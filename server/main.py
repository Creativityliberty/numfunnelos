"""NÜM Funnel OS API v1: real persistent multi-tenant vertical slice, not a payment platform."""
from __future__ import annotations
import os, json, secrets, asyncio, logging
from pathlib import Path
from contextlib import asynccontextmanager

import httpx
from pydantic import BaseModel, Field, EmailStr
from fastapi import FastAPI, Request, HTTPException, Depends, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from sqlalchemy.orm import Session

logger = logging.getLogger("numfunnel")

from .db import create_tables, get_db
from .models import User
from .dependencies import BUCKET, rate_limit, logged_user, tenant, owner_only, public_funnel, contact_from_token, record_event, create_autodrafts
from .integration_pipeline import dispatch_forever
from .whatsapp_runner import supervise as whatsapp_supervise, embedded_enabled as whatsapp_embedded_enabled
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
    mcp_router,
    whatsapp_router
)

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / 'web'

@asynccontextmanager
async def lifespan(application: FastAPI):
    create_tables()
    task = asyncio.create_task(dispatch_forever()) if os.getenv("WORKER_ENABLED", "true").lower() == "true" else None
    wa_task = asyncio.create_task(whatsapp_supervise()) if whatsapp_embedded_enabled() else None
    try:
        yield
    finally:
        for t in (task, wa_task):
            if t:
                t.cancel()
                try:
                    await t
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
    {"name": "Agents IA & MCP", "description": "Points d'accès sécurisés réservés aux agents IA (Claude, Cursor, Codex, Antigravity)."},
    {"name": "WhatsApp & Baileys", "description": "Connexion WhatsApp Web souveraine, synchronisation de messages et groupes."}
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
        "img-src 'self' data: blob: https://fastapi.tiangolo.com https://*.cal.com https://*.mux.com; "
        "media-src 'self' blob: https://*.mux.com https://stream.mux.com; "
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://*.cal.com; "
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; "
        "font-src 'self' data: https://fonts.gstatic.com; "
        "frame-src 'self' https://cal.com https://*.cal.com; "
        "connect-src 'self' blob: data: https://cal.com https://*.cal.com https://*.mux.com https://stream.mux.com; "
        "worker-src 'self' blob:; "
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
app.include_router(whatsapp_router)


# =====================================================================
# CANDIDATURES BÊTA TESTEURS VIA AGENTMAIL
# =====================================================================
AGENTMAIL_API_KEY = os.environ.get('AGENTMAIL_API_KEY', 'am_us_inbox_408e6fafa90c2000b4255295ca1927dd3ea9a48fe790747bb9ad533b55daabc6')
AGENTMAIL_INBOX = 'numfunnelos@agentmail.to'
FOUNDER_EMAIL = 'numtemalionel@gmail.com'

class BetaApplication(BaseModel):
    name: str = Field(..., max_length=120)
    email: EmailStr
    phone: str = Field(..., max_length=50)
    profile: str = Field(default='Non spécifié', max_length=120)
    business_need: str = Field(default='Non spécifié', max_length=300)

@app.post('/api/public/beta-apply', tags=['Public & Funnels'], summary='Soumission d’une candidature Bêta Testeur Nüptin')
async def apply_beta(payload: BetaApplication, background_tasks: BackgroundTasks):
    # 1. Envoi asynchrone des e-mails via AgentMail
    def send_agentmail_notifications():
        client = httpx.Client(timeout=12.0)
        headers = {
            'Authorization': f'Bearer {AGENTMAIL_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        # A. Notification à l'équipe Nümtema & Lionel
        founder_body = f"""Une nouvelle candidature Bêta Testeur vient d'être déposée sur Nüptin !

Nom du candidat : {payload.name}
Email : {payload.email}
Téléphone / WhatsApp : {payload.phone}
Profil d'activité : {payload.profile}
Besoin Commercial n°1 : {payload.business_need}

Candidature horodatée via Nüptin Studio Autonome.
"""
        try:
            client.post(
                f'https://api.agentmail.to/v0/inboxes/{AGENTMAIL_INBOX}/messages',
                headers=headers,
                json={
                    'to': [FOUNDER_EMAIL, AGENTMAIL_INBOX],
                    'subject': f'[BÊTA TESTEUR] Nouvelle candidature : {payload.name} ({payload.profile})',
                    'text': founder_body
                }
            )
        except Exception as e:
            logger.error(f"Erreur notification AgentMail fondateur: {e}")

        # B. Accusé de réception officiel au candidat
        candidate_body = f"""Bonjour {payload.name},

Nous avons bien reçu votre candidature pour rejoindre le programme Bêta Testeur Nüptin.

Votre besoin identifié :
« {payload.business_need} »

Notre équipe analyse actuellement votre profil ({payload.profile}) afin de vous préparer votre accès studio autonome et la connexion à votre serveur MCP.

En attendant, vous pouvez enregistrer notre contact WhatsApp officiel ou répondre directement à cet e-mail si vous avez des précisions sur vos objectifs de conversion.

Bienvenue dans l'aventure Nüptin,
L'équipe Nümtema AI LABS & Nüptin Studio
"""
        try:
            client.post(
                f'https://api.agentmail.to/v0/inboxes/{AGENTMAIL_INBOX}/messages',
                headers=headers,
                json={
                    'to': [payload.email],
                    'subject': 'Bienvenue dans le programme Bêta Nüptin · Candidature confirmée',
                    'text': candidate_body
                }
            )
        except Exception as e:
            logger.error(f"Erreur accusé AgentMail candidat: {e}")
        finally:
            client.close()

    background_tasks.add_task(send_agentmail_notifications)
    return {'ok': True, 'message': 'Candidature enregistrée avec succès'}

# Pages d'accueil et SPA Wildcard (doit obligatoirement rester en dernière position)
@app.get('/', include_in_schema=False)
def index(request: Request, db: Session = Depends(get_db)):
    # Si token de réinitialisation, d'erreur ou demande d'auth explicite, diriger vers le formulaire du studio
    if request.query_params.get('auth_error') or request.query_params.get('reset_token') or request.query_params.get('mode'):
        return RedirectResponse(f"/app?{request.query_params}", status_code=303)
    # Si l'utilisateur est déjà connecté avec session active, diriger directement vers le studio
    uid = request.session.get('uid')
    if uid:
        u = db.get(User, uid)
        if u and request.session.get('sv') == u.session_version:
            return RedirectResponse('/app', status_code=303)
    # Sinon, afficher la landing page officielle Nüptin
    landing_path = WEB / 'landing' / 'index.html'
    if landing_path.exists():
        return FileResponse(landing_path)
    return FileResponse(WEB / 'index.html')

@app.get('/app', include_in_schema=False)
@app.get('/app/{path:path}', include_in_schema=False)
def studio_app(path: str = ''):
    return FileResponse(WEB / 'index.html')

@app.get('/landing', include_in_schema=False)
def landing():
    landing_path = WEB / 'landing' / 'index.html'
    if landing_path.exists():
        return FileResponse(landing_path)
    return FileResponse(WEB / 'index.html')

# Fichiers SEO & Découverte IA
@app.get('/robots.txt', include_in_schema=False)
def robots_txt():
    p = WEB / 'robots.txt'
    if p.exists():
        return FileResponse(p, media_type='text/plain; charset=utf-8')
    raise HTTPException(404)

@app.get('/sitemap.xml', include_in_schema=False)
def sitemap_xml():
    p = WEB / 'sitemap.xml'
    if p.exists():
        return FileResponse(p, media_type='application/xml; charset=utf-8')
    raise HTTPException(404)

@app.get('/llms.txt', include_in_schema=False)
def llms_txt():
    p = WEB / 'llms.txt'
    if p.exists():
        return FileResponse(p, media_type='text/markdown; charset=utf-8')
    raise HTTPException(404)

@app.get('/llms-full.txt', include_in_schema=False)
def llms_full_txt():
    p = WEB / 'llms-full.txt'
    if p.exists():
        return FileResponse(p, media_type='text/markdown; charset=utf-8')
    raise HTTPException(404)

# Routes directes de sections (sans #)
@app.get('/constat', include_in_schema=False)
@app.get('/ecosysteme', include_in_schema=False)
@app.get('/parcours', include_in_schema=False)
@app.get('/studio', include_in_schema=False)
@app.get('/simulateur', include_in_schema=False)
@app.get('/profils', include_in_schema=False)
def page_section(request: Request):
    landing_path = WEB / 'landing' / 'index.html'
    if landing_path.exists():
        return FileResponse(landing_path)
    return RedirectResponse('/', status_code=303)

# Pages d'information publiques avec URLs propres (sans #)
@app.get('/faq', include_in_schema=False)
@app.get('/aide', include_in_schema=False)
def page_faq():
    p = WEB / 'landing' / 'faq.html'
    if p.exists():
        return FileResponse(p)
    return RedirectResponse('/#faq', status_code=303)

@app.get('/securite', include_in_schema=False)
def page_securite():
    p = WEB / 'landing' / 'securite.html'
    if p.exists():
        return FileResponse(p)
    return RedirectResponse('/#securite', status_code=303)

@app.get('/confidentialite', include_in_schema=False)
def page_confidentialite():
    p = WEB / 'landing' / 'confidentialite.html'
    if p.exists():
        return FileResponse(p)
    return RedirectResponse('/', status_code=303)

@app.get('/conditions', include_in_schema=False)
def page_conditions():
    p = WEB / 'landing' / 'conditions.html'
    if p.exists():
        return FileResponse(p)
    return RedirectResponse('/', status_code=303)

@app.get('/docs', include_in_schema=False)
@app.get('/docs/', include_in_schema=False)
def page_docs():
    p = WEB / 'docs' / 'index.html'
    if p.exists():
        return FileResponse(p)
    return RedirectResponse('/', status_code=303)

@app.get('/beta', include_in_schema=False)
@app.get('/beta/', include_in_schema=False)
def page_beta():
    p = WEB / 'landing' / 'beta.html'
    if p.exists():
        return FileResponse(p)
    return RedirectResponse('/', status_code=303)

@app.get('/{path:path}', include_in_schema=False)
def spa(path: str):
    if path.startswith('api/') or path.startswith('assets/'):
        raise HTTPException(404)
    return FileResponse(WEB / 'index.html')
