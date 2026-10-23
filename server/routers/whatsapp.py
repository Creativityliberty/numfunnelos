from __future__ import annotations
import os
import httpx
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Membership
from ..dependencies import tenant

router = APIRouter()

WHATSAPP_SERVICE_URL = os.getenv('WHATSAPP_SERVICE_URL', 'http://127.0.0.1:3001')
WHATSAPP_INTERNAL_KEY = os.getenv('WHATSAPP_INTERNAL_KEY', '')


class SendMessageIn(BaseModel):
    jid: str = Field(min_length=3, max_length=100)
    text: str = Field(min_length=1, max_length=4000)


class CreateGroupIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    participants: list[str] = Field(default_factory=list)


class AddToGroupIn(BaseModel):
    groupJid: str = Field(min_length=5, max_length=100)
    phone: str = Field(min_length=5, max_length=40)


async def _call_service(method: str, path: str, json_data: dict | None = None, params: dict | None = None):
    url = f"{WHATSAPP_SERVICE_URL.rstrip('/')}{path}"
    headers = {'X-Internal-Key': WHATSAPP_INTERNAL_KEY} if WHATSAPP_INTERNAL_KEY else {}
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.request(method, url, json=json_data, params=params, headers=headers)
            try:
                return resp.status_code, resp.json()
            except ValueError:
                return 502, {"error": "Réponse invalide du service WhatsApp (HTTP %s)" % resp.status_code}
    except (httpx.ConnectError, httpx.ConnectTimeout):
        return 503, {
            "connected": False,
            "status": "service_offline",
            "error": "Service WhatsApp injoignable. Il démarre avec l'application : consultez les logs du conteneur."
        }
    except Exception as e:
        return 500, {"error": str(e)}


@router.get('/api/whatsapp/status', tags=['WhatsApp & Baileys'], summary='Statut de la session WhatsApp')
async def get_whatsapp_status(m: Membership = Depends(tenant)):
    status, data = await _call_service('GET', f"/status/{m.workspace_id}")
    return data


@router.post('/api/whatsapp/connect', tags=['WhatsApp & Baileys'], summary='Initier la connexion et générer le QR code')
async def connect_whatsapp(m: Membership = Depends(tenant)):
    status, data = await _call_service('POST', f"/connect/{m.workspace_id}")
    return data


@router.post('/api/whatsapp/disconnect', tags=['WhatsApp & Baileys'], summary='Déconnecter la session WhatsApp')
async def disconnect_whatsapp(m: Membership = Depends(tenant)):
    status, data = await _call_service('POST', f"/disconnect/{m.workspace_id}")
    return data


@router.get('/api/whatsapp/chats', tags=['WhatsApp & Baileys'], summary='Liste des conversations WhatsApp')
async def get_chats(m: Membership = Depends(tenant)):
    status, data = await _call_service('GET', f"/chats/{m.workspace_id}")
    return data


@router.get('/api/whatsapp/messages', tags=['WhatsApp & Baileys'], summary='Messages d’une conversation')
async def get_messages(jid: str = Query(...), m: Membership = Depends(tenant)):
    status, data = await _call_service('GET', f"/messages/{m.workspace_id}", params={'jid': jid})
    return data


@router.post('/api/whatsapp/send', tags=['WhatsApp & Baileys'], summary='Envoyer un message WhatsApp')
async def send_message(p: SendMessageIn, m: Membership = Depends(tenant)):
    status, data = await _call_service('POST', f"/send/{m.workspace_id}", json_data=p.model_dump())
    if status >= 400 and 'error' in data:
        raise HTTPException(status, data['error'])
    return data


@router.get('/api/whatsapp/groups', tags=['WhatsApp & Baileys'], summary='Liste des groupes WhatsApp')
async def get_groups(m: Membership = Depends(tenant)):
    status, data = await _call_service('GET', f"/groups/{m.workspace_id}")
    return data


@router.post('/api/whatsapp/groups', tags=['WhatsApp & Baileys'], summary='Créer un groupe WhatsApp')
async def create_group(p: CreateGroupIn, m: Membership = Depends(tenant)):
    status, data = await _call_service('POST', f"/groups/{m.workspace_id}", json_data=p.model_dump())
    if status >= 400 and 'error' in data:
        raise HTTPException(status, data['error'])
    return data


@router.post('/api/whatsapp/groups/add', tags=['WhatsApp & Baileys'], summary='Ajouter un prospect au groupe')
async def add_to_group(p: AddToGroupIn, m: Membership = Depends(tenant)):
    status, data = await _call_service('POST', f"/groups/{m.workspace_id}/add", json_data=p.model_dump())
    if status >= 400 and 'error' in data:
        raise HTTPException(status, data['error'])
    return data


@router.get('/api/whatsapp/groups/invite', tags=['WhatsApp & Baileys'], summary='Lien d’invitation d’un groupe')
async def group_invite(groupJid: str = Query(...), m: Membership = Depends(tenant)):
    status, data = await _call_service('GET', f"/groups/{m.workspace_id}/invite", params={'groupJid': groupJid})
    return data
