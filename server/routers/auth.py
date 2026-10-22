from __future__ import annotations
import os
import secrets
import time
from pathlib import Path
from urllib.parse import quote
from fastapi import APIRouter, Request, Depends, HTTPException, UploadFile, File
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import User, Workspace, Membership, OAuthIdentity, OAuthChallenge, PasswordResetToken, Outbox, Automation, Funnel
from ..schemas import Signup, Login, ProfileUpdateIn, PasswordChangeIn, ForgotIn, ResetIn
from ..security import password_hash, verify_password, norm_email, slug, token_hash, new_token, encrypt, decrypt
from ..insforge_oauth import make_pkce, oauth_authorization_url, exchange_and_verify, public_base
from ..dependencies import rate_limit, logged_user

router = APIRouter(tags=['Authentification & Profil'])
ROOT = Path(__file__).resolve().parent.parent.parent
WEB = ROOT / 'web'

@router.get('/api/auth/me', summary='Profil utilisateur et permissions de la session active')
def me(request: Request, db: Session = Depends(get_db)):
    if not request.session.get('csrf'):
        request.session['csrf'] = new_token()
    id_ = request.session.get('uid')
    u = db.get(User, id_) if id_ else None
    if u and request.session.get('sv', 0) != u.session_version:
        u = None
        request.session.clear()
        request.session['csrf'] = new_token()
    members = db.scalars(select(Membership).where(Membership.user_id == u.id)).all() if u else []
    workspaces = [db.get(Workspace, m.workspace_id) for m in members]
    google_linked = bool(db.scalar(select(OAuthIdentity.id).where(OAuthIdentity.user_id == u.id, OAuthIdentity.provider == 'google'))) if u else False
    return {
        'csrf': request.session['csrf'],
        'user': ({'id': u.id, 'name': u.name, 'email': u.email, 'avatar_url': getattr(u, 'avatar_url', None)} if u else None),
        'workspaces': [{'id': w.id, 'name': w.name, 'slug': w.slug, 'role': m.role} for m, w in zip(members, workspaces) if w],
        'google_enabled': os.getenv('INSFORGE_GOOGLE_AUTH_ENABLED', 'false').lower() == 'true',
        'google_linked': google_linked
    }

@router.patch('/api/auth/profile', summary='Mettre à jour le profil utilisateur')
def update_profile(p: ProfileUpdateIn, db: Session = Depends(get_db), u: User = Depends(logged_user)):
    u.name = p.name.strip()
    if p.avatar_url is not None:
        clean_url = p.avatar_url.strip()
        u.avatar_url = clean_url if clean_url else None
    db.commit()
    return {'ok': True, 'user': {'id': u.id, 'name': u.name, 'email': u.email, 'avatar_url': u.avatar_url}}

@router.post('/api/auth/avatar', summary='Téléverser la photo de profil')
async def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), u: User = Depends(logged_user)):
    mime = file.content_type or ""
    if mime not in ("image/png", "image/jpeg", "image/webp"):
        raise HTTPException(415, "Format d'image non supporté (JPG, PNG, WEBP uniquement)")
    data = await file.read(4 * 1024 * 1024 + 1)
    if len(data) > 4 * 1024 * 1024:
        raise HTTPException(413, "Photo trop volumineuse (4 Mo maximum)")
    valid = (mime == "image/png" and data.startswith(b'\x89PNG\r\n\x1a\n')) or (
        mime == "image/jpeg" and data.startswith(b'\xff\xd8\xff')) or (
        mime == "image/webp" and data[:4] == b'RIFF' and data[8:12] == b'WEBP')
    if not valid:
        raise HTTPException(422, "Fichier image corrompu ou invalide")
    avatar_dir = WEB / 'assets' / 'avatars'
    avatar_dir.mkdir(parents=True, exist_ok=True)
    ext = ".jpg" if mime == "image/jpeg" else ".png" if mime == "image/png" else ".webp"
    filename = f"{u.id}{ext}"
    filepath = avatar_dir / filename
    with open(filepath, "wb") as f:
        f.write(data)
    avatar_url = f"/assets/avatars/{filename}?t={int(time.time())}"
    u.avatar_url = avatar_url
    db.commit()
    return {"ok": True, "avatar_url": avatar_url, "user": {"id": u.id, "name": u.name, "email": u.email, "avatar_url": avatar_url}}

@router.post('/api/auth/change-password', summary='Changer son mot de passe directement')
def change_password(p: PasswordChangeIn, request: Request, db: Session = Depends(get_db), u: User = Depends(logged_user)):
    if not verify_password(u.password_hash, p.current_password):
        raise HTTPException(400, 'Mot de passe actuel incorrect')
    u.password_hash = password_hash(p.new_password)
    u.session_version += 1
    db.commit()
    request.session['sv'] = u.session_version
    return {'ok': True}

@router.post('/api/auth/register', status_code=201, summary='Création de compte et initialisation de l’espace')
def register(payload: Signup, request: Request, db: Session = Depends(get_db)):
    from .funnels import load_app7
    rate_limit(request, 'register', 5)
    email = norm_email(payload.email)
    if db.scalar(select(User.id).where(User.email == email)):
        raise HTTPException(409, 'Adresse déjà utilisée')
    user = User(name=payload.name.strip(), email=email, password_hash=password_hash(payload.password))
    ws = Workspace(name=payload.workspace_name.strip(), slug=slug(payload.workspace_name) + '-' + secrets.token_hex(3))
    db.add_all([user, ws])
    db.flush()
    db.add(Membership(user_id=user.id, workspace_id=ws.id, role='owner'))
    db.add(Automation(workspace_id=ws.id, name='Préparer un brouillon de bienvenue', trigger='lead_created', action='welcome_draft', enabled=True))
    data = load_app7()
    f = Funnel(workspace_id=ws.id, name='APP 7 — Première application', slug='app7-' + secrets.token_hex(4), draft=data)
    db.add(f)
    db.commit()
    request.session['uid'] = user.id
    request.session['sv'] = user.session_version
    return {'user_id': user.id, 'workspace_id': ws.id, 'funnel_id': f.id}

@router.post('/api/auth/login', summary='Connexion sécurisée par email et mot de passe')
def login(payload: Login, request: Request, db: Session = Depends(get_db)):
    rate_limit(request, 'login', 15, 900)
    u = db.scalar(select(User).where(User.email == norm_email(payload.email)))
    if not u or not verify_password(u.password_hash, payload.password):
        raise HTTPException(401, 'Identifiants incorrects')
    request.session.clear()
    request.session['uid'] = u.id
    request.session['sv'] = u.session_version
    request.session['csrf'] = new_token()
    return {'ok': True, 'csrf': request.session['csrf']}

@router.post('/api/auth/logout', summary='Clôture de la session active')
def logout(request: Request):
    request.session.clear()
    return {'ok': True}

@router.get('/api/auth/insforge/google/start', summary='Initialisation du flux OAuth Google sécurisé')
async def google_start(request: Request, mode: str = 'login', db: Session = Depends(get_db)):
    import httpx, traceback
    from .. import main as main_module
    if os.getenv('INSFORGE_GOOGLE_AUTH_ENABLED', 'false').lower() != 'true':
        raise HTTPException(503, 'Connexion Google InsForge non configurée')
    if mode not in ('login', 'link'):
        raise HTTPException(422, 'Mode OAuth invalide')
    rate_limit(request, 'oauth', 12, 600)
    current_id = request.session.get('uid')
    current_user = db.get(User, current_id) if current_id else None
    if mode == 'link' and (not current_user or request.session.get('sv', 0) != current_user.session_version):
        raise HTTPException(401, 'Connectez-vous avant de lier Google')
    verifier, challenge = make_pkce()
    nonce = new_token()
    try:
        enc_verifier = encrypt(verifier)
    except Exception as e:
        raise HTTPException(500, f'Erreur de chiffrement PKCE: {str(e)}')
    state = OAuthChallenge(
        nonce_hash=token_hash(nonce),
        verifier_encrypted=enc_verifier,
        mode=mode,
        user_id=current_id if mode == 'link' else None,
        expires_unix=int(time.time()) + 600
    )
    try:
        db.add(state)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f'Erreur de base de données state OAuth: {str(e)}')
    request.session['oauth_nonce'] = nonce
    try:
        # Use main_module to preserve monkeypatch in tests
        auth_func = getattr(main_module, 'oauth_authorization_url', oauth_authorization_url)
        url = await auth_func(challenge)
    except (httpx.HTTPError, ValueError) as e:
        db.delete(state)
        db.commit()
        request.session.pop('oauth_nonce', None)
        raise HTTPException(503, f'Google OAuth InsForge indisponible ({str(e)}), contrôlez la configuration DEV')
    except Exception as e:
        raise HTTPException(500, f'Erreur inattendue Google start: {str(e)}')
    return RedirectResponse(url, status_code=302)

@router.get('/api/auth/insforge/callback', summary='Validation et finalisation de l’authentification Google')
async def google_callback(request: Request, insforge_code: str | None = None, db: Session = Depends(get_db)):
    import httpx
    from .funnels import load_app7
    from .. import main as main_module
    nonce = request.session.pop('oauth_nonce', None)
    flow = db.scalar(select(OAuthChallenge).where(OAuthChallenge.nonce_hash == token_hash(nonce))) if nonce else None
    if not flow or flow.expires_unix < int(time.time()) or not insforge_code or len(insforge_code) > 2048:
        return RedirectResponse('/?auth_error=oauth_expired', status_code=303)
    verifier = decrypt(flow.verifier_encrypted)
    mode, link_id = flow.mode, flow.user_id
    db.delete(flow)
    db.commit()
    try:
        # Use main_module to preserve monkeypatch in tests
        exchange_func = getattr(main_module, 'exchange_and_verify', exchange_and_verify)
        identity = await exchange_func(insforge_code, verifier)
    except (httpx.HTTPError, ValueError):
        return RedirectResponse('/?auth_error=oauth_failed', status_code=303)
    existing = db.scalar(select(OAuthIdentity).where(OAuthIdentity.provider == 'google', OAuthIdentity.provider_subject == identity['subject']))
    if mode == 'link':
        if request.session.get('uid') != link_id:
            return RedirectResponse('/?auth_error=oauth_expired', status_code=303)
        u = db.get(User, link_id)
        if not u or request.session.get('sv', 0) != u.session_version:
            return RedirectResponse('/?auth_error=oauth_expired', status_code=303)
        if u.email != identity['email']:
            return RedirectResponse('/?auth_error=google_email_mismatch', status_code=303)
        if existing and existing.user_id != u.id:
            return RedirectResponse('/?auth_error=google_already_linked', status_code=303)
        other = db.scalar(select(OAuthIdentity).where(OAuthIdentity.provider == 'google', OAuthIdentity.user_id == u.id))
        if other and other.provider_subject != identity['subject']:
            return RedirectResponse('/?auth_error=google_already_linked', status_code=303)
        if not existing:
            db.add(OAuthIdentity(user_id=u.id, provider='google', provider_subject=identity['subject']))
    elif existing:
        u = db.get(User, existing.user_id)
        if not u or u.email != identity['email']:
            return RedirectResponse('/?auth_error=identity_changed', status_code=303)
    else:
        u = db.scalar(select(User).where(User.email == identity['email']))
        if u:
            return RedirectResponse('/?auth_error=link_required', status_code=303)
        u = User(email=identity['email'], name=identity['name'], password_hash=password_hash(new_token()))
        w = Workspace(name=identity['name'] + ' Studio', slug=slug(identity['name']) + '-' + secrets.token_hex(3))
        db.add_all([u, w])
        db.flush()
        db.add(Membership(user_id=u.id, workspace_id=w.id, role='owner'))
        db.add(OAuthIdentity(user_id=u.id, provider='google', provider_subject=identity['subject']))
        db.add(Automation(workspace_id=w.id, name='Préparer un brouillon de bienvenue', trigger='lead_created', action='welcome_draft', enabled=True))
        db.add(Funnel(workspace_id=w.id, name='APP 7 — Première application', slug='app7-' + secrets.token_hex(4), draft=load_app7()))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return RedirectResponse('/?auth_error=identity_conflict', status_code=303)
    request.session.clear()
    request.session['uid'] = u.id
    request.session['sv'] = u.session_version
    request.session['csrf'] = new_token()
    return RedirectResponse('/', status_code=303)

@router.get('/api/auth/insforge/linked', summary='Statut d’association du compte Google')
def google_linked(db: Session = Depends(get_db), u: User = Depends(logged_user)):
    return {'google': bool(db.scalar(select(OAuthIdentity.id).where(OAuthIdentity.user_id == u.id, OAuthIdentity.provider == 'google')))}

@router.post('/api/auth/password/forgot', status_code=202, summary='Demande de réinitialisation de mot de passe')
def forgot_password(p: ForgotIn, request: Request, db: Session = Depends(get_db)):
    rate_limit(request, 'forgot', 5, 3600)
    if not (os.getenv('AUTH_MAIL_AGENTMAIL_API_KEY') and os.getenv('AUTH_MAIL_INBOX_ID')):
        raise HTTPException(503, 'Email de réinitialisation non configuré')
    base = public_base()
    u = db.scalar(select(User).where(User.email == norm_email(p.email)))
    if u:
        token = new_token()
        reset = PasswordResetToken(user_id=u.id, token_hash=token_hash(token), expires_unix=int(time.time()) + 900)
        db.add(reset)
        db.flush()
        membership = db.scalar(select(Membership).where(Membership.user_id == u.id))
        link = base + '/?reset_token=' + quote(token, safe='')
        db.add(Outbox(
            workspace_id=membership.workspace_id if membership else "system",
            event_id=reset.id,
            provider='auth_reset_mail',
            payload={'to': u.email, 'url_enc': encrypt(link)}
        ))
        db.commit()
    return {'message': "Si cette adresse possède un compte, un email de réinitialisation sera envoyé."}

@router.post('/api/auth/password/reset', summary='Validation du nouveau mot de passe')
def reset_password(p: ResetIn, request: Request, db: Session = Depends(get_db)):
    rate_limit(request, 'reset', 12, 3600)
    r = db.scalar(select(PasswordResetToken).where(PasswordResetToken.token_hash == token_hash(p.token), PasswordResetToken.used == False))
    if not r or r.expires_unix < int(time.time()):
        raise HTTPException(400, 'Lien expiré ou invalide')
    u = db.get(User, r.user_id)
    if not u:
        raise HTTPException(400, 'Lien invalide')
    u.password_hash = password_hash(p.password)
    u.session_version = (u.session_version or 0) + 1
    for t in db.scalars(select(PasswordResetToken).where(PasswordResetToken.user_id == u.id)).all():
        t.used = True
    db.commit()
    request.session.clear()
    return {'ok': True, 'message': 'Mot de passe mis à jour. Reconnectez-vous.'}
