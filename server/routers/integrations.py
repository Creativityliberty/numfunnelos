from __future__ import annotations
import os
import re
import json
import hmac
import hashlib
from pathlib import Path
from urllib.parse import urlparse
import httpx
from pydantic import BaseModel, Field
from fastapi import APIRouter, Request, Depends, HTTPException, UploadFile, File
from fastapi.responses import Response, JSONResponse
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Membership, Integration, Outbox, Asset, WebhookReceipt, InboxMessage, Contact, CalBooking
from ..schemas import IntegrationIn
from ..security import decrypt, encrypt, norm_email
from ..dependencies import tenant, owner_only, record_event
from ..expansion import ALLOWED_MIME, MAX_ASSET_BYTES, put_file, read_file, invoke_function
from ..integration_pipeline import verify_svix, enqueue_notification

router = APIRouter()

class InsforgeCall(BaseModel):
    payload: dict = Field(default_factory=dict)

@router.get('/api/integrations', tags=['Intégrations & Médias'], summary='Liste des intégrations et connecteurs tiers')
def integrations(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    rows = db.scalars(select(Integration).where(Integration.workspace_id == m.workspace_id)).all()
    return [{'provider': r.provider, 'enabled': r.enabled, 'config': r.config, 'has_secret': bool(r.secret_encrypted)} for r in rows]

@router.put('/api/integrations/{provider}', tags=['Intégrations & Médias'], summary='Enregistrer les identifiants d’un connecteur')
def save_integration(provider: str, p: IntegrationIn, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    if provider not in ('agentmail', 'calcom', 'openai_ads'):
        raise HTTPException(422, 'Fournisseur non pris en charge')
    r = db.scalar(select(Integration).where(Integration.workspace_id == m.workspace_id, Integration.provider == provider))
    if not r:
        r = Integration(workspace_id == m.workspace_id, provider=provider)
        r = Integration(workspace_id=m.workspace_id, provider=provider)
        db.add(r)
    if provider == 'agentmail':
        if p.inbox_id is not None:
            if not re.fullmatch(r'[a-zA-Z0-9_.@-]{3,180}', p.inbox_id):
                raise HTTPException(422, 'Identifiant inbox invalide')
            r.config = {**(r.config or {}), 'inbox_id': p.inbox_id}
        if p.api_key is not None or p.webhook_secret is not None:
            creds = json.loads(decrypt(r.secret_encrypted)) if r.secret_encrypted else {}
            if p.api_key:
                creds['api_key'] = p.api_key
            if p.webhook_secret:
                creds['webhook_secret'] = p.webhook_secret
            r.secret_encrypted = encrypt(json.dumps(creds))
        if p.notification_to is not None:
            r.config = {**(r.config or {}), "notification_to": norm_email(p.notification_to)}
        if p.enabled and not (r.secret_encrypted and r.config.get('inbox_id')):
            raise HTTPException(422, 'Clé et inbox obligatoires')
    if provider == 'calcom':
        config = dict(r.config or {})
        if p.booking_url is not None:
            parsed = urlparse(p.booking_url)
            if parsed.scheme != 'https' or not parsed.netloc or parsed.username or parsed.password or parsed.hostname not in ('cal.com', 'app.cal.com'):
                raise HTTPException(422, 'Lien de réservation cal.com HTTPS obligatoire')
            config['booking_url'] = p.booking_url
        if p.cal_event_type_id is not None:
            config['event_type_id'] = p.cal_event_type_id
        r.config = config
        if p.webhook_secret:
            creds = json.loads(decrypt(r.secret_encrypted)) if r.secret_encrypted else {}
            creds['webhook_secret'] = p.webhook_secret
            r.secret_encrypted = encrypt(json.dumps(creds))
        if p.enabled and not config.get('booking_url'):
            raise HTTPException(422, 'Lien de réservation requis')
    if provider == 'openai_ads':
        if p.pixel_id is not None:
            r.config = {'pixel_id': p.pixel_id[:120]}
        if p.enabled:
            raise HTTPException(422, 'Connecteur CAPI non activé : vérification technique et juridique requise')
    r.enabled = p.enabled
    db.commit()
    return {'provider': provider, 'enabled': r.enabled, 'has_secret': bool(r.secret_encrypted)}

@router.post('/api/webhooks/agentmail/{workspace_id}', tags=['Intégrations & Médias'], summary='Réception webhook des emails entrants AgentMail')
async def agentmail_webhook(workspace_id: str, request: Request, db: Session = Depends(get_db)):
    r = db.scalar(select(Integration).where(Integration.workspace_id == workspace_id, Integration.provider == 'agentmail', Integration.enabled == True))
    if not r or not r.secret_encrypted:
        raise HTTPException(404, 'Webhook inconnu')
    secret = json.loads(decrypt(r.secret_encrypted)).get('webhook_secret')
    if not secret:
        raise HTTPException(403, 'Secret webhook non configuré')
    raw = await request.body()
    if len(raw) > 256 * 1024:
        raise HTTPException(413, 'Événement trop volumineux')
    try:
        payload = verify_svix(raw, request.headers, secret)
    except Exception:
        raise HTTPException(401, 'Signature invalide')
    event_type = payload.get('event_type', '')
    event_id = payload.get('event_id', '')
    if not isinstance(event_id, str) or not 1 <= len(event_id) <= 160 or not isinstance(event_type, str) or len(event_type) > 90:
        raise HTTPException(422, 'Identifiant événement invalide')
    details = payload.get('message') or payload.get('send') or payload.get('delivery') or payload.get('bounce') or payload.get('complaint') or payload.get('reject') or {}
    inbox_id = payload.get('inbox_id') or (details.get('inbox_id') if isinstance(details, dict) else None)
    if not inbox_id or inbox_id != r.config.get('inbox_id'):
        raise HTTPException(403, 'Inconnue ou mauvaise boîte de réception')
    if not event_type.startswith('message.'):
        return {'ok': True, 'ignored': True}
    try:
        receipt = WebhookReceipt(workspace_id=workspace_id, provider='agentmail', provider_event_id=event_id, event_type=event_type)
        db.add(receipt)
        db.flush()
        if event_type == 'message.received':
            msg = payload.get('message') or {}
            sender = msg.get('from_') or msg.get('from') or '?'
            if isinstance(sender, list):
                sender = sender[0] if sender else '?'
            if isinstance(sender, dict):
                sender = sender.get('email', '?')
            db.add(InboxMessage(
                workspace_id=workspace_id,
                provider_event_id=event_id,
                from_address=str(sender)[:254],
                subject=str(msg.get('subject') or 'Sans objet')[:255],
                preview=str(msg.get('preview') or msg.get('text') or msg.get('extracted_text') or '')[:3000]
            ))
        record_event(db, workspace_id, None, 'agentmail_' + event_type.replace('.', '_'), {'inbox_id': inbox_id, 'provider_event_id': event_id})
        db.commit()
    except IntegrityError:
        db.rollback()
        return {'ok': True, 'duplicate': True}
    return {'ok': True}

@router.get('/api/integrations/deliveries', tags=['Intégrations & Médias'], summary='État de la file d’acheminement des notifications')
def delivery_status(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    jobs = db.scalars(select(Outbox).where(Outbox.workspace_id == m.workspace_id).order_by(Outbox.created_at.desc()).limit(50)).all()
    return [{'id': j.id, 'provider': j.provider, 'state': j.state, 'attempts': j.attempts, 'created_at': j.created_at.isoformat()} for j in jobs]

@router.get('/api/assets', tags=['Intégrations & Médias'], summary='Lister les fichiers médias et documents téléversés')
def assets_list(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    rows = db.scalars(select(Asset).where(Asset.workspace_id == m.workspace_id).order_by(Asset.created_at.desc())).all()
    return [{"id": a.id, "name": a.filename, "mime": a.mime_type, "size": a.byte_count, "url": f"/api/assets/{a.id}"} for a in rows]

@router.post('/api/assets', status_code=201, tags=['Intégrations & Médias'], summary='Téléverser un nouveau média (image, vidéo, PDF)')
async def upload_asset(file: UploadFile = File(...), db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    from .. import main as main_module
    owner_only(m)
    mime = file.content_type or ""
    if mime not in ALLOWED_MIME:
        raise HTTPException(415, 'Média non autorisé (PNG, JPG, WEBP, PDF, MP4)')
    data = await file.read(MAX_ASSET_BYTES + 1)
    if not data or len(data) > MAX_ASSET_BYTES:
        raise HTTPException(413, 'Fichier trop volumineux (12 Mo max)')
    valid = (mime == "image/png" and data.startswith(b'\x89PNG\r\n\x1a\n')) or (
        mime == "image/jpeg" and data.startswith(b'\xff\xd8\xff')) or (
        mime == "image/webp" and data[:4] == b'RIFF' and data[8:12] == b'WEBP') or (
        mime == "application/pdf" and data.startswith(b'%PDF-')) or (
        mime == "video/mp4" and len(data) > 12 and data[4:8] == b'ftyp')
    if not valid:
        raise HTTPException(422, 'Signature du fichier incorrecte')
    a = Asset(
        workspace_id=m.workspace_id,
        bucket=os.getenv('INSFORGE_STORAGE_BUCKET', 'num_funnel_assets'),
        object_key='',
        filename=Path(file.filename or 'media').name[:200],
        mime_type=mime,
        byte_count=len(data)
    )
    a.object_key = f"{a.workspace_id}/{a.id}{ALLOWED_MIME[mime]}"
    try:
        put_func = getattr(main_module, 'put_file', put_file)
        await put_func(a.object_key, a.filename, data, mime)
    except (httpx.HTTPError, ValueError):
        raise HTTPException(502, 'Stockage InsForge indisponible ou mal configuré')
    db.add(a)
    db.commit()
    return {"id": a.id, "url": f"/api/assets/{a.id}", "size": a.byte_count}

@router.get('/api/assets/{asset_id}', tags=['Intégrations & Médias'], summary='Télécharger ou visualiser un média sécurisé')
async def asset_read(asset_id: str, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    from .. import main as main_module
    a = db.scalar(select(Asset).where(Asset.id == asset_id, Asset.workspace_id == m.workspace_id))
    if not a:
        raise HTTPException(404, 'Média introuvable')
    try:
        read_func = getattr(main_module, 'read_file', read_file)
        data = await read_func(a.bucket, a.object_key)
    except (httpx.HTTPError, ValueError):
        raise HTTPException(502, 'Lecture du média impossible')
    return Response(
        content=data,
        media_type=a.mime_type,
        headers={
            'Content-Disposition': f'inline; filename="{a.id}{ALLOWED_MIME[a.mime_type]}"',
            'Cache-Control': 'private, no-store',
            'X-Content-Type-Options': 'nosniff'
        }
    )

@router.post('/api/insforge/functions/{function_slug}/invoke', tags=['Intégrations & Médias'], summary='Exécution sécurisée d’une fonction serverless')
async def call_insforge_function(function_slug: str, p: InsforgeCall, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    try:
        result = await invoke_function(function_slug, p.payload)
    except ValueError:
        raise HTTPException(422, 'Fonction non autorisée ou configuration incomplète')
    except httpx.HTTPError:
        raise HTTPException(502, 'Fonction InsForge indisponible')
    record_event(db, m.workspace_id, None, 'insforge_function_called', {'slug': function_slug})
    db.commit()
    return {'result': result}

@router.post('/api/webhooks/calcom/{workspace_id}', tags=['Intégrations & Médias'], summary='Webhook de synchronisation des réservations Cal.com')
async def calcom_webhook(workspace_id: str, request: Request, db: Session = Depends(get_db)):
    r = db.scalar(select(Integration).where(Integration.workspace_id == workspace_id, Integration.provider == 'calcom', Integration.enabled == True))
    if not r or not r.secret_encrypted:
        return JSONResponse({'detail': 'Webhook inconnu'}, status_code=404)
    creds = json.loads(decrypt(r.secret_encrypted))
    secret = creds.get('webhook_secret')
    event_type_id = (r.config or {}).get('event_type_id')
    if not secret or not event_type_id:
        raise HTTPException(403, 'Webhook Cal.com non configuré')
    raw = await request.body()
    if len(raw) > 128 * 1024:
        raise HTTPException(413, 'Payload trop volumineux')
    expected = hmac.new(secret.encode(), raw, hashlib.sha256).hexdigest()
    header = request.headers.get('x-cal-signature-256', '')
    if not hmac.compare_digest(expected, header):
        raise HTTPException(401, 'Signature Cal.com incorrecte')
    try:
        payload = json.loads(raw)
    except ValueError:
        raise HTTPException(422, 'JSON invalide')
    if not isinstance(payload, dict):
        raise HTTPException(422, 'Payload incorrect')
    event_type = payload.get('triggerEvent', '')
    detail = payload.get('payload') or {}
    if not isinstance(detail, dict):
        raise HTTPException(422, 'Détails manquants')
    supported = {'BOOKING_CREATED', 'BOOKING_CANCELLED', 'BOOKING_RESCHEDULED'}
    if event_type not in supported:
        return {'ok': True, 'ignored': True}
    try:
        actual_event_type = int(detail.get('eventTypeId') or 0)
    except (TypeError, ValueError):
        raise HTTPException(422, 'Type rendez-vous invalide')
    if actual_event_type != event_type_id:
        return {'ok': True, 'ignored': True, 'reason': 'event_type_mismatch'}
    uid_ = str(detail.get('uid') or '')[:160]
    slot = str(detail.get('startTime') or '')[:48]
    if not uid_ or not slot:
        raise HTTPException(422, 'Identifiant ou date manquants')
    attendee = detail.get('attendees') or []
    attendee_email = (attendee[0].get('email') if attendee and isinstance(attendee[0], dict) else None)
    c = db.scalar(select(Contact).where(Contact.workspace_id == workspace_id, Contact.email == norm_email(attendee_email))) if attendee_email else None
    existing = db.scalar(select(CalBooking).where(CalBooking.workspace_id == workspace_id, CalBooking.provider_uid == uid_))
    if not c and existing:
        c = db.get(Contact, existing.contact_id)
    if not c or c.workspace_id != workspace_id or not c.funnel_id:
        return {'ok': True, 'ignored': True, 'reason': 'no_matching_lead'}
    dedupe = hashlib.sha256((uid_ + '|' + event_type + '|' + slot + '|' + str(payload.get('createdAt', ''))).encode()).hexdigest()
    db.add(WebhookReceipt(workspace_id=workspace_id, provider='calcom', provider_event_id=dedupe, event_type=event_type))
    try:
        db.flush()
        status = 'cancelled' if event_type == 'BOOKING_CANCELLED' else 'confirmed'
        if existing:
            existing.status = status
            existing.slot = slot
        else:
            existing = CalBooking(
                workspace_id=workspace_id,
                funnel_id=c.funnel_id,
                contact_id=c.id,
                provider_uid=uid_,
                event_type_id=actual_event_type,
                slot=slot,
                status=status
            )
            db.add(existing)
        if status == 'confirmed':
            c.status = 'booked'
        elif c.status == 'booked':
            c.status = 'qualified'
        event_name = {
            'BOOKING_CREATED': 'appointment_scheduled',
            'BOOKING_CANCELLED': 'appointment_cancelled',
            'BOOKING_RESCHEDULED': 'appointment_rescheduled'
        }[event_type]
        event = record_event(db, workspace_id, c.funnel_id, event_name, {'source': 'calcom', 'slot': slot, 'booking_uid': uid_}, c.id)
        enqueue_notification(
            db,
            event,
            'booking',
            subject=f'NÜM • Cal.com : {event_name}',
            message=f'Rendez-vous Cal.com {event_name} : {slot}. Consultez le calendrier dans le studio.'
        )
        db.commit()
    except IntegrityError:
        db.rollback()
        return {'ok': True, 'duplicate': True}
    return {'ok': True, 'event_id': event.id}
