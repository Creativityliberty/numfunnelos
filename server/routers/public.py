from __future__ import annotations
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
from pathlib import Path
from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Contact, Submission, Consent, Application, Booking, Integration, now
from ..schemas import LeadIn, InterestIn, BookingIn
from ..security import norm_email, new_token, token_hash
from ..dependencies import rate_limit, public_funnel, contact_from_token, record_event, create_autodrafts
from ..integration_pipeline import enqueue_notification

ROOT = Path(__file__).resolve().parent.parent.parent
WEB = ROOT / 'web'

router = APIRouter()

@router.get('/api/public/{slug_}', tags=['Expérience publique'], summary='Récupérer les contenus publics d’un tunnel')
def get_public(slug_: str, db: Session = Depends(get_db)):
    f, v = public_funnel(db, slug_)
    cal = db.scalar(select(Integration).where(Integration.workspace_id == f.workspace_id, Integration.provider == 'calcom', Integration.enabled == True))
    return {
        'name': f.name,
        'slug': f.slug,
        'content': v.snapshot,
        'version': v.version,
        'booking_enabled': bool(v.snapshot.get('settings', {}).get('booking_enabled')),
        'external_booking_url': cal.config.get('booking_url') if cal else None
    }

@router.post('/api/public/{slug_}/leads', status_code=201, tags=['Expérience publique'], summary='Enregistrer un prospect depuis la page de capture')
def public_lead(slug_: str, p: LeadIn, request: Request, db: Session = Depends(get_db)):
    rate_limit(request, 'public-lead-' + slug_, 18)
    f, v = public_funnel(db, slug_)
    if p.honeypot:
        raise HTTPException(422, 'Formulaire non accepté')
    email = norm_email(p.email)
    c = db.scalar(select(Contact).where(Contact.workspace_id == f.workspace_id, Contact.email == email))
    is_new = c is None
    if is_new:
        c = Contact(workspace_id=f.workspace_id, email=email, first_name=p.first_name.strip(), funnel_id=f.id)
        db.add(c)
        db.flush()
    token = new_token()
    c.lead_token_hash = token_hash(token)
    c.funnel_id = f.id
    source = {k: getattr(p, k) for k in ('utm_source', 'utm_medium', 'utm_campaign') if getattr(p, k)}
    c.source = source
    db.add(Submission(workspace_id=f.workspace_id, funnel_id=f.id, version_id=v.id, contact_id=c.id, data={'step': 'capture', 'source': source}))
    proof = {'source': 'public_form', 'form_version': v.id, 'at': now().isoformat()}
    db.add_all([Consent(workspace_id=f.workspace_id, contact_id=c.id, purpose=k, granted=getattr(p, k + '_consent'), proof=proof) for k in ('marketing', 'measurement')])
    e = record_event(db, f.workspace_id, f.id, 'lead_created', {'source': source, 'measurement_consent': p.measurement_consent}, c.id)
    if is_new and p.marketing_consent:
        create_autodrafts(db, f.workspace_id, c)
    enqueue_notification(db, e, "lead", subject="Nüptin • Nouveau prospect APP 7",
                         message=f"Un nouveau prospect est enregistré dans votre tunnel {f.name}.
Contact : {c.first_name} ({c.email})
Consultez le CRM pour agir.")
    try:
        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(500, f'Erreur base de données prospect: {str(exc)}')
    return {'contact_id': c.id, 'token': token, 'event_id': e.id, 'next': 'formation'}

@router.post('/api/public/{slug_}/applications', status_code=201, tags=['Expérience publique'], summary='Dépôt de candidature et description de projet')
def interest(slug_: str, p: InterestIn, db: Session = Depends(get_db)):
    f, v = public_funnel(db, slug_)
    c = contact_from_token(db, f, p.token)
    a = Application(workspace_id=f.workspace_id, funnel_id=f.id, contact_id=c.id, idea_stage=p.idea_stage, category=p.category, message=p.message)
    db.add(a)
    c.status = 'qualified'
    db.flush()
    e = record_event(db, f.workspace_id, f.id, 'application_interest_submitted', {'stage': p.idea_stage}, c.id)
    enqueue_notification(db, e, "application", subject="NÜM • Nouvelle candidature APP 7",
                         message=f"Une candidature APP 7 a été déposée dans {f.name}. Consultez votre CRM.")
    db.commit()
    return {'application_id': a.id, 'event_id': e.id, 'next': 'merci'}

@router.get('/api/public/{slug_}/slots', tags=['Expérience publique'], summary='Consulter les créneaux disponibles pour la réservation')
def available(slug_: str, db: Session = Depends(get_db)):
    f, v = public_funnel(db, slug_)
    if not v.snapshot.get('settings', {}).get('booking_enabled'):
        return {'slots': [], 'notice': 'Réservations désactivées sur ce tunnel'}
    tz = ZoneInfo('Europe/Paris')
    base = datetime.now(tz)
    busy = set(db.scalars(select(Booking.slot).where(Booking.workspace_id == f.workspace_id, Booking.status == 'confirmed')).all())
    slots = []
    for days in range(1, 15):
        date = (base + timedelta(days=days)).date()
        if date.weekday() >= 5:
            continue
        for hour in (9, 10, 11, 14, 15, 16):
            local = datetime(date.year, date.month, date.day, hour, 0, tzinfo=tz)
            iso = local.astimezone(timezone.utc).isoformat()
            if iso not in busy:
                slots.append({'id': iso, 'label': local.strftime('%d/%m/%Y %H:%M') + ' (Paris)'})
    return {'slots': slots}

@router.post('/api/public/{slug_}/bookings', status_code=201, tags=['Expérience publique'], summary='Confirmer une réservation de consultation')
def book(slug_: str, p: BookingIn, db: Session = Depends(get_db)):
    f, v = public_funnel(db, slug_)
    if not v.snapshot.get('settings', {}).get('booking_enabled'):
        raise HTTPException(409, 'Réservation désactivée')
    c = contact_from_token(db, f, p.token)
    valid = {s['id'] for s in available(slug_, db)['slots']}
    if p.slot not in valid:
        raise HTTPException(409, 'Créneau indisponible')
    b = Booking(workspace_id=f.workspace_id, funnel_id=f.id, contact_id=c.id, slot=p.slot)
    db.add(b)
    c.status = 'booked'
    try:
        db.flush()
        e = record_event(db, f.workspace_id, f.id, 'appointment_scheduled', {'slot': p.slot}, c.id)
        enqueue_notification(db, e, "booking", subject="NÜM • Nouveau rendez-vous",
                             message=f"Un rendez-vous vient d'être confirmé le {p.slot}. Consultez le calendrier NÜM.")
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, 'Créneau réservé par une autre personne')
    return {'booking_id': b.id, 'event_id': e.id, 'next': 'merci'}

@router.post('/api/public/{slug_}/consent/revoke', tags=['Expérience publique'], summary='Révocation de consentement prospect')
def revoke_consent(slug_: str, p: dict, db: Session = Depends(get_db)):
    f, v = public_funnel(db, slug_)
    c = contact_from_token(db, f, str(p.get('token', '')))
    purpose = p.get('purpose')
    if purpose not in ('marketing', 'measurement'):
        raise HTTPException(422, 'Finalité incorrecte')
    db.add(Consent(workspace_id=f.workspace_id, contact_id=c.id, purpose=purpose, granted=False, proof={'source': 'self-service', 'at': now().isoformat()}))
    db.commit()
    return {'ok': True, 'purpose': purpose, 'granted': False}

@router.get('/f/{slug_}', response_class=HTMLResponse, include_in_schema=False)
def public_html(slug_: str, db: Session = Depends(get_db)):
    public_funnel(db, slug_)
    return FileResponse(WEB / 'public.html')
