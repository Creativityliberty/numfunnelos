from __future__ import annotations
import time
from collections import defaultdict
from fastapi import Request, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from .db import get_db
from .models import User, Workspace, Membership, Funnel, FunnelVersion, Contact, Event, Automation, EmailDraft
from .security import token_hash
from .expansion import queue_ai

BUCKET: dict[str, list[float]] = defaultdict(list)

def rate_limit(request: Request, scope: str, limit: int = 12, window: int = 3600):
    ip = (request.client.host if request.client else '?')
    key = f'{scope}:{ip}'
    t = time.time()
    BUCKET[key] = [x for x in BUCKET[key] if t - x < window]
    if len(BUCKET[key]) >= limit:
        raise HTTPException(429, 'Trop de demandes, réessayez plus tard')
    BUCKET[key].append(t)

def logged_user(request: Request, db: Session = Depends(get_db)):
    user_id = request.session.get('uid')
    user = db.get(User, user_id) if user_id else None
    if not user or request.session.get('sv', 0) != user.session_version:
        raise HTTPException(401, 'Connectez-vous pour continuer')
    return user

def tenant(request: Request, db: Session = Depends(get_db), user: User = Depends(logged_user)):
    wid = request.headers.get('x-workspace-id')
    memberships = db.scalars(select(Membership).where(Membership.user_id == user.id)).all()
    member = next((m for m in memberships if m.workspace_id == wid), None) if wid else (memberships[0] if memberships else None)
    if not member:
        raise HTTPException(403, 'Accès workspace refusé')
    return member

def owner_only(member: Membership):
    if member.role not in ('owner', 'admin'):
        raise HTTPException(403, 'Droits insuffisants')

def public_funnel(db: Session, slug_: str):
    f = db.scalar(select(Funnel).where(Funnel.slug == slug_, Funnel.status == 'published'))
    if not f or not f.published_version_id:
        raise HTTPException(404, 'Tunnel non publié')
    v = db.get(FunnelVersion, f.published_version_id)
    if not v or v.workspace_id != f.workspace_id:
        raise HTTPException(404, 'Version introuvable')
    return f, v

def contact_from_token(db: Session, f: Funnel, token: str):
    if not token or len(token) > 400:
        raise HTTPException(401, 'Référence prospect manquante')
    c = db.scalar(select(Contact).where(Contact.workspace_id == f.workspace_id, Contact.funnel_id == f.id, Contact.lead_token_hash == token_hash(token)))
    if not c:
        raise HTTPException(401, 'Référence prospect incorrecte')
    return c

def record_event(db: Session, wid: str, fid: str | None, type_: str, data: dict | None = None, cid: str | None = None):
    event = Event(workspace_id=wid, funnel_id=fid, contact_id=cid, type=type_, data=data or {})
    db.add(event)
    db.flush()
    queue_ai(db, event)
    # External tracking is intentionally off until actual consent and supported provider config.
    return event

def create_autodrafts(db: Session, wid: str, c: Contact):
    workflows = db.scalars(select(Automation).where(Automation.workspace_id == wid, Automation.enabled == True, Automation.trigger == 'lead_created')).all()
    for a in workflows:
        if a.action == 'welcome_draft':
            db.add(EmailDraft(
                workspace_id=wid,
                contact_id=c.id,
                to=c.email,
                subject='Bienvenue — votre formation',
                body=f'Bonjour {c.first_name},\n\nMerci pour votre inscription. Voici les prochaines étapes de votre parcours.\n\nL’équipe Nümtema'
            ))
