"""InsForge Google OAuth PKCE adapter. All tokens stay server side.

The InsForge project MUST allow the exact PUBLIC_APP_URL callback.
"""
from __future__ import annotations
import os, base64, hashlib, secrets, time
from urllib.parse import urlsplit
import httpx
from fastapi import HTTPException

def insforge_auth_url():
    url=os.getenv("INSFORGE_BASE_URL","").rstrip("/")
    u=urlsplit(url)
    if not u.hostname or u.username or u.password or u.query or u.fragment:
        raise HTTPException(503,"URL InsForge invalide")
    if u.scheme!="https" and not (u.scheme=="http" and u.hostname in ("127.0.0.1","localhost","insforge")):
        raise HTTPException(503,"HTTPS requis pour InsForge")
    return url

def public_base():
    u=urlsplit(os.getenv("PUBLIC_APP_URL","").rstrip("/"))
    if not u.hostname or u.query or u.fragment or u.username or u.password:
        raise HTTPException(503,"PUBLIC_APP_URL non configurée")
    if u.scheme!="https" and not (u.scheme=="http" and u.hostname in ("localhost","127.0.0.1")):
        raise HTTPException(503,"PUBLIC_APP_URL doit être en HTTPS")
    return u.geturl().rstrip("/")

def make_pkce():
    verifier=secrets.token_urlsafe(64)
    challenge=base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode().rstrip("=")
    return verifier,challenge

async def oauth_authorization_url(challenge:str, *, transport=None):
    origin=insforge_auth_url()
    async with httpx.AsyncClient(timeout=12,transport=transport) as client:
        response=await client.get(origin+"/api/auth/oauth/google",params={
            "redirect_uri":public_base()+"/api/auth/insforge/callback",
            "code_challenge":challenge
        })
    response.raise_for_status()
    url=response.json().get("authUrl")
    if not url or urlsplit(url).scheme!="https":
        raise ValueError("Adresse d'autorisation OAuth absente ou non sécurisée")
    return url

async def exchange_and_verify(code:str,verifier:str, *, transport=None):
    origin=insforge_auth_url()
    async with httpx.AsyncClient(timeout=12,transport=transport) as client:
        r=await client.post(origin+"/api/auth/oauth/exchange",params={"client_type":"server"},
                            json={"code":code,"code_verifier":verifier})
        r.raise_for_status()
        data=r.json()
        token=data.get("accessToken")
        if not token: raise ValueError("Jeton InsForge absent")
        me=await client.get(origin+"/api/auth/sessions/current",
                          headers={"Authorization":"Bearer "+token})
        me.raise_for_status()
        remote=me.json().get("user",{})
        initial=data.get("user",{})
    sub=remote.get("id")
    email=str(remote.get("email","")).strip().lower()
    # Verify both endpoints agree about the account identity.
    if not sub or initial.get("id")!=sub or not email or str(initial.get("email","")).lower()!=email:
        raise ValueError("Identité InsForge contradictoire")
    if initial.get("emailVerified") is False or remote.get("emailVerified") is False:
        raise ValueError("Adresse Google non vérifiée")
    providers=initial.get("providers")
    if isinstance(providers,list) and providers and "google" not in providers:
        raise ValueError("L'identité n'est pas liée à Google")
    name=str((initial.get("profile") or {}).get("name") or email.split("@")[0])[:120]
    return {"subject":str(sub),"email":email,"name":name}
