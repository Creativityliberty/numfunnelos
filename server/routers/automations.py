from __future__ import annotations
import httpx
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Membership, Automation, AutomationRun, EmailDraft, InboxMessage, Integration
from ..schemas import AutomationIn, NewDraft, SendDraftIn
from ..dependencies import tenant, owner_only
from ..security import decrypt

router = APIRouter()

@router.get('/api/automations', tags=['Automatisations & Workflows'], summary='Liste des scénarios d’automatisation')
def automations(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    rows = db.scalars(select(Automation).where(Automation.workspace_id == m.workspace_id)).all()
    return [{'id': a.id, 'name': a.name, 'trigger': a.trigger, 'action': a.action, 'enabled': a.enabled} for a in rows]

@router.post('/api/automations', status_code=201, tags=['Automatisations & Workflows'], summary='Créer un scénario d’automatisation')
def add_automation(p: AutomationIn, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    if (p.trigger, p.action) not in (
        ('lead_created', 'welcome_draft'),
        ('lead_created', 'ai_reply_draft'),
        ('application_interest_submitted', 'ai_reply_draft'),
        ('appointment_scheduled', 'ai_reply_draft')
    ):
        raise HTTPException(422, 'Déclencheur/action non pris en charge')
    a = Automation(workspace_id=m.workspace_id, **p.model_dump())
    db.add(a)
    db.commit()
    return {'id': a.id}

@router.patch('/api/automations/{id_}', tags=['Automatisations & Workflows'], summary='Activer ou suspendre un scénario')
def toggle_automation(id_: str, p: dict, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    a = db.scalar(select(Automation).where(Automation.workspace_id == m.workspace_id, Automation.id == id_))
    if not a:
        raise HTTPException(404, 'Automatisation introuvable')
    if type(p.get('enabled')) is not bool:
        raise HTTPException(422, 'Booléen attendu')
    a.enabled = p['enabled']
    db.commit()
    return {'ok': True}

@router.get('/api/automations/runs', tags=['Automatisations & Workflows'], summary='Historique des exécutions de relances automatisées')
def automation_runs(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    runs = db.scalars(select(AutomationRun).where(AutomationRun.workspace_id == m.workspace_id)
                      .order_by(AutomationRun.created_at.desc()).limit(60)).all()
    return [{'id': r.id, 'state': r.state, 'attempts': r.attempts, 'automation_id': r.automation_id,
             'event_id': r.event_id, 'created_at': r.created_at.isoformat()} for r in runs]

@router.post('/api/automations/process-one', tags=['Automatisations & Workflows'], summary='Exécution ponctuelle d’un travail de relance')
async def automation_process_one(m: Membership = Depends(tenant)):
    owner_only(m)
    raise HTTPException(409, 'Traitement réservé au worker; aucun déclenchement inter-workspace')

@router.get('/api/inbox', tags=['Messagerie & Inbox'], summary='Boîte de réception et brouillons')
def inbox(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    drafts = db.scalars(select(EmailDraft).where(EmailDraft.workspace_id == m.workspace_id).order_by(EmailDraft.created_at.desc()).limit(100)).all()
    messages = db.scalars(select(InboxMessage).where(InboxMessage.workspace_id == m.workspace_id).order_by(InboxMessage.received_at.desc()).limit(100)).all()
    return {
        'drafts': [{'id': d.id, 'to': d.to, 'subject': d.subject, 'body': d.body, 'status': d.status} for d in drafts],
        'received': [{'id': r.id, 'from': r.from_address, 'subject': r.subject, 'preview': r.preview} for r in messages]
    }

@router.post('/api/inbox/drafts', status_code=201, tags=['Messagerie & Inbox'], summary='Créer un nouveau brouillon de message')
def new_draft(p: NewDraft, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    d = EmailDraft(workspace_id=m.workspace_id, to=str(p.to), subject=p.subject, body=p.body)
    db.add(d)
    db.commit()
    return {'id': d.id, 'status': d.status}

@router.post('/api/inbox/drafts/{id_}/send', tags=['Messagerie & Inbox'], summary='Approuver et expédier un message')
async def send_draft(id_: str, p: SendDraftIn | None = None, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    d = db.scalar(select(EmailDraft).where(EmailDraft.id == id_, EmailDraft.workspace_id == m.workspace_id))
    if not d:
        raise HTTPException(404, 'Brouillon introuvable')
    if d.status != 'draft':
        raise HTTPException(409, 'Message déjà traité')
    if p:
        if p.subject and p.subject.strip():
            d.subject = p.subject.strip()
        if p.body and p.body.strip():
            d.body = p.body.strip()
    r = db.scalar(select(Integration).where(Integration.workspace_id == m.workspace_id, Integration.provider == 'agentmail', Integration.enabled == True))
    if not r or not r.secret_encrypted:
        raise HTTPException(409, 'AgentMail non connecté. Renseignez votre clé d’API dans Intégrations.')
    credentials = json.loads(decrypt(r.secret_encrypted))
    key = credentials.get('api_key')
    if not key:
        raise HTTPException(409, 'AgentMail : clé d’API manquante')
    inbox_id = r.config.get('inbox_id')
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            result = await client.post(
                f'https://api.agentmail.to/v0/inboxes/{inbox_id}/messages/send',
                headers={'Authorization': f'Bearer {key}'},
                json={'to': [d.to], 'subject': d.subject, 'text': d.body}
            )
        result.raise_for_status()
        response = result.json()
    except Exception:
        raise HTTPException(502, 'L’envoi AgentMail a échoué ; vérifiez vos identifiants AgentMail dans Intégrations')
    d.status = 'sent'
    d.provider_message_id = response.get('message_id')
    db.commit()
    return {'ok': True, 'message_id': d.provider_message_id}
