"""NÜM Funnel OS API v1: real persistent multi-tenant vertical slice, not a payment platform."""
from __future__ import annotations
import os, json, secrets, asyncio
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from .db import create_tables
from .dependencies import BUCKET, rate_limit, logged_user, tenant, owner_only, public_funnel, contact_from_token, record_event, create_autodrafts
from .integration_pipeline import dispatch_forever
from .insforge_oauth import oauth_authorization_url, exchange_and_verify
from .expansion import put_file, read_file
from .routers.realtime import realtime_stream
from .routers.funnels import load_app7, serialize_funnel
from .routers.mcp import agent_membership
from .routers import (
    health_router,
    auth_router,
    workspaces_router,
    funnels_router,
    public_router,
    crm_router,
    automations_router,
    integrations_router,
    realtime_router,
    mcp_router
)

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / 'web'

@asynccontextmanager
async def lifespan(application: FastAPI):
    create_tables()
    task = asyncio.create_task(dispatch_forever()) if os.getenv("WORKER_ENABLED", "true").lower() == "true" else None
    try:
        yield
    finally:
        if task:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

API_DESCRIPTION = """
### NÜM Funnel OS — Plateforme SaaS de Conversion, CRM & IA

Bienvenue sur l'API officielle de **NÜM Funnel OS**.
Cette infrastructure haute sécurité unifiée regroupe :
- **Tunnels de conversion haute performance** (capture, VSL, candidature et réservation).
- **CRM & Pipeline de vente** (gestion des leads qualifiés, scoring et statuts).
- **Calendrier & Rendez-vous** (synchronisation d'agenda et gestion des disponibilités).
- **Messagerie & Communications intelligentes** (AgentMail, boîte de réception unifiée, brouillons assistés par IA).
- **Automatisations & Workflows** (scénarios événementiels et relances ciblées).
- **Attribution & Analyse d'audience** (mesure multi-canale conforme RGPD).
- **Connectivité Agents IA & Serveur MCP** (standard Model Context Protocol pour orchestrateurs autonomes).
"""

TAGS_METADATA = [
    {"name": "Système & Santé", "description": "Endpoints de diagnostic, supervision et disponibilité du service."},
    {"name": "Authentification & Profil", "description": "Gestion des sessions sécurisées, authentification Google InsForge et récupération."},
    {"name": "Espaces de travail", "description": "Architecture multi-tenant, gestion des workspaces et isolation des données."},
    {"name": "Tunnels de conversion", "description": "Création, personnalisation et publication de tunnels de vente."},
    {"name": "Expérience publique", "description": "Endpoints publics pour formulaires de capture, candidatures et réservations."},
    {"name": "CRM & Contacts", "description": "Gestion centralisée des prospects qualifiés et évolution des statuts du pipeline."},
    {"name": "Calendrier & Rendez-vous", "description": "Consultation des créneaux, confirmation de réservations et export iCalendar."},
    {"name": "Messagerie & Inbox", "description": "Boîte de réception unifiée, validation de brouillons et expédition d'emails."},
    {"name": "Automatisations & Workflows", "description": "Scénarios événementiels et déclencheurs de conversion."},
    {"name": "Analyses & Attribution", "description": "Métriques de performance, séries temporelles et traçabilité des conversions."},
    {"name": "Intégrations & Médias", "description": "Connecteurs AgentMail, Cal.com, stockage sécurisé de médias et webhooks."},
    {"name": "Agents IA & MCP", "description": "Points d'accès sécurisés réservés aux agents IA (Claude, Cursor, Codex, Antigravity)."}
]

app = FastAPI(
    title='NÜM Funnel OS',
    version='1.3.0',
    summary='Suite logicielle complète pour la création de tunnels de vente, CRM et automatisation IA',
    description=API_DESCRIPTION,
    openapi_tags=TAGS_METADATA,
    docs_url='/api/docs',
    openapi_url='/api/openapi.json',
    lifespan=lifespan
)
SESSION_SECRET = os.getenv('SESSION_SECRET', 'unsafe-local-dev-session-secret-change-before-release')

app.mount('/assets', StaticFiles(directory=WEB / 'assets'), name='assets')

@app.middleware('http')
async def protect(request: Request, call_next):
    # All authenticated writes and login/register require same-origin double-submit CSRF.
    if request.url.path.startswith('/api/') and request.method in ('POST', 'PUT', 'PATCH', 'DELETE') and not request.url.path.startswith(('/api/public/', '/api/webhooks/', '/api/agent/')):
        csrf = request.session.get('csrf')
        if not csrf or not secrets.compare_digest(str(request.headers.get('x-csrf-token', '')), str(csrf)):
            return JSONResponse({'detail': 'Jeton CSRF invalide ou absent'}, status_code=403)
    response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "img-src 'self' data: blob: https://fastapi.tiangolo.com https://*.cal.com; "
        "media-src 'self' blob:; "
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://*.cal.com; "
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
        "frame-src 'self' https://cal.com https://*.cal.com; "
        "connect-src 'self' https://cal.com https://*.cal.com; "
        "frame-ancestors 'self'"
    )
    return response

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET,
    same_site='lax',
    https_only=os.getenv('COOKIE_SECURE', 'false').lower() == 'true',
    max_age=86400 * 7
)

# Enregistrement ordonné des routeurs
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(workspaces_router)
app.include_router(funnels_router)
app.include_router(public_router)
app.include_router(crm_router)
app.include_router(automations_router)
app.include_router(integrations_router)
app.include_router(realtime_router)
app.include_router(mcp_router)

# Pages d'accueil et SPA Wildcard (doit obligatoirement rester en dernière position)
@app.get('/', include_in_schema=False)
def index():
    return FileResponse(WEB / 'index.html')

@app.get('/{path:path}', include_in_schema=False)
def spa(path: str):
    if path.startswith('api/') or path.startswith('assets/'):
        raise HTTPException(404)
    return FileResponse(WEB / 'index.html')
