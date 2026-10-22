from __future__ import annotations
import json
import secrets
import time
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Membership, User, AgentAccessToken, Funnel, FunnelVersion
from ..schemas import AgentTokenIn, FunnelIn, PatchFunnel
from ..security import token_hash, new_token, slug
from ..dependencies import tenant, owner_only, logged_user
from .funnels import serialize_funnel, load_app7

router = APIRouter(tags=['Agents IA & MCP'])

def agent_membership(request: Request, db: Session = Depends(get_db), scope: str = "funnels:read"):
    header = request.headers.get('authorization', '')
    if not header.startswith('Bearer ') or len(header) > 500:
        raise HTTPException(401, 'Token agent requis')
    token = header[7:]
    if not token.startswith('num_mcp_'):
        raise HTTPException(401, 'Token agent invalide')
    entry = db.scalar(select(AgentAccessToken).where(AgentAccessToken.token_hash == token_hash(token)))
    if not entry or entry.revoked or entry.expires_unix < int(time.time()):
        raise HTTPException(401, 'Token agent absent, expiré ou révoqué')
    if scope not in (entry.scopes or []):
        raise HTTPException(403, 'Scope MCP insuffisant')
    membership = db.scalar(select(Membership).where(Membership.user_id == entry.created_by, Membership.workspace_id == entry.workspace_id))
    if not membership or membership.role not in ('owner', 'admin'):
        raise HTTPException(403, 'Droits workspace supprimés')
    return membership

@router.post('/api/mcp/tokens', status_code=201, summary='Générer un jeton d’accès pour agent IA')
def create_agent_token(p: AgentTokenIn, db: Session = Depends(get_db), m: Membership = Depends(tenant), u: User = Depends(logged_user)):
    owner_only(m)
    allowed = {'funnels:read', 'funnels:write', 'funnels:publish'}
    scopes = set(p.scopes)
    if not scopes or not scopes.issubset(allowed):
        raise HTTPException(422, 'Scopes invalides')
    raw = 'num_mcp_' + new_token()
    entry = AgentAccessToken(
        workspace_id=m.workspace_id,
        created_by=u.id,
        token_hash=token_hash(raw),
        label=p.label.strip(),
        scopes=sorted(scopes),
        expires_unix=int(time.time()) + p.valid_days * 86400
    )
    db.add(entry)
    db.commit()
    return {
        'id': entry.id,
        'token': raw,
        'scopes': entry.scopes,
        'expires_unix': entry.expires_unix,
        'warning': 'Copiez ce jeton dans votre coffre de secrets : il ne sera plus affiché.'
    }

@router.get('/api/mcp/tokens', summary='Lister les jetons d’accès MCP actifs')
def list_agent_tokens(db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    rows = db.scalars(select(AgentAccessToken).where(AgentAccessToken.workspace_id == m.workspace_id).order_by(AgentAccessToken.created_at.desc())).all()
    return [{'id': x.id, 'label': x.label, 'scopes': x.scopes, 'revoked': x.revoked, 'expires_unix': x.expires_unix} for x in rows]

@router.delete('/api/mcp/tokens/{id_}', summary='Révoquer un jeton d’accès MCP')
def revoke_agent_token(id_: str, db: Session = Depends(get_db), m: Membership = Depends(tenant)):
    owner_only(m)
    entry = db.scalar(select(AgentAccessToken).where(AgentAccessToken.id == id_, AgentAccessToken.workspace_id == m.workspace_id))
    if not entry:
        raise HTTPException(404, 'Token introuvable')
    entry.revoked = True
    db.commit()
    return {'ok': True}

@router.get('/api/agent/funnels', summary='API Agent : Liste des tunnels du workspace')
def agent_funnels(request: Request, db: Session = Depends(get_db)):
    m = agent_membership(request, db)
    return [serialize_funnel(f) for f in db.scalars(select(Funnel).where(Funnel.workspace_id == m.workspace_id).order_by(Funnel.created_at.desc())).all()]

@router.get('/api/agent/funnels/{id_}', summary='API Agent : Détails d’un tunnel')
def agent_funnel(id_: str, request: Request, db: Session = Depends(get_db)):
    m = agent_membership(request, db)
    f = db.scalar(select(Funnel).where(Funnel.id == id_, Funnel.workspace_id == m.workspace_id))
    if not f:
        raise HTTPException(404, 'Tunnel introuvable')
    return serialize_funnel(f)

@router.post('/api/agent/funnels', status_code=201, summary='API Agent : Création d’un tunnel')
def agent_create_funnel(p: FunnelIn, request: Request, db: Session = Depends(get_db)):
    m = agent_membership(request, db, 'funnels:write')
    data = load_app7()
    data['copy']['title'] = p.name
    f = Funnel(workspace_id=m.workspace_id, name=p.name, slug=slug(p.name) + '-' + secrets.token_hex(4), draft=data)
    db.add(f)
    db.commit()
    return serialize_funnel(f)

@router.patch('/api/agent/funnels/{id_}', summary='API Agent : Édition du brouillon d’un tunnel')
def agent_edit_funnel(id_: str, p: PatchFunnel, request: Request, db: Session = Depends(get_db)):
    m = agent_membership(request, db, 'funnels:write')
    f = db.scalar(select(Funnel).where(Funnel.id == id_, Funnel.workspace_id == m.workspace_id))
    if not f:
        raise HTTPException(404, 'Tunnel introuvable')
    if p.name is not None:
        f.name = p.name.strip()
    if p.draft is not None:
        raw = json.dumps(p.draft, ensure_ascii=False)
        if len(raw) > 120000 or not isinstance(p.draft.get('copy'), dict) or not isinstance(p.draft.get('brand'), dict):
            raise HTTPException(422, 'Document invalide ou trop volumineux')
        f.draft = p.draft
    db.commit()
    return serialize_funnel(f)

@router.post('/api/agent/funnels/{id_}/publish', summary='API Agent : Publication officielle d’un tunnel')
def agent_publish_funnel(id_: str, request: Request, db: Session = Depends(get_db)):
    m = agent_membership(request, db, 'funnels:publish')
    f = db.scalar(select(Funnel).where(Funnel.id == id_, Funnel.workspace_id == m.workspace_id))
    if not f:
        raise HTTPException(404, 'Tunnel introuvable')
    next_ver = (db.scalar(select(func.max(FunnelVersion.version)).where(FunnelVersion.funnel_id == f.id)) or 0) + 1
    version = FunnelVersion(workspace_id=m.workspace_id, funnel_id=f.id, version=next_ver, snapshot=json.loads(json.dumps(f.draft)))
    db.add(version)
    db.flush()
    f.status = 'published'
    f.published_version_id = version.id
    db.commit()
    return {'url': f'/f/{f.slug}', 'version': next_ver}
