from __future__ import annotations
import secrets
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import User, Workspace, Membership
from ..schemas import WorkspaceIn
from ..security import slug
from ..dependencies import logged_user

router = APIRouter(tags=['Espaces de travail'])

@router.post('/api/workspaces', status_code=201, summary='Création d’un nouvel espace de travail')
def make_workspace(p: WorkspaceIn, db: Session = Depends(get_db), u: User = Depends(logged_user)):
    ws = Workspace(name=p.name, slug=slug(p.name) + '-' + secrets.token_hex(3))
    db.add(ws)
    db.flush()
    db.add(Membership(workspace_id=ws.id, user_id=u.id, role='owner'))
    db.commit()
    return {'id': ws.id, 'name': ws.name}

@router.get('/api/workspaces', summary='Liste des espaces de travail accessibles')
def get_workspaces(db: Session = Depends(get_db), u: User = Depends(logged_user)):
    members = db.scalars(select(Membership).where(Membership.user_id == u.id)).all()
    return [{'id': m.workspace_id, 'name': db.get(Workspace, m.workspace_id).name, 'role': m.role} for m in members]
