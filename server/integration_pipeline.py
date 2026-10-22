"""Provider pipeline: server-only delivery queue, retries, optional InsForge event mirror.

The SQL Outbox table is the durable hand-off. An external send may be delivered
more than once when the provider accepts a request but the response is lost.
No provider calls happen inside a public funnel request.
"""
from __future__ import annotations
import os, asyncio, json, logging, hmac, hashlib, base64, time
from datetime import datetime, timezone, timedelta
from urllib.parse import urlsplit
from sqlalchemy import select
from sqlalchemy.orm import Session
import httpx
from .models import Outbox, Event, Integration, Consent, PasswordResetToken, now
from .security import decrypt
from .db import SessionLocal

log=logging.getLogger("num.integrations")
AGENTMAIL_API_URL="https://api.agentmail.to"


def verify_svix(raw:bytes, headers, secret:str) -> dict:
    """AgentMail/Svix Standard Webhooks: raw-body HMAC + strict 5 min replay window."""
    def hdr(key):
        return headers.get(key) or headers.get(key.title())
    event_id=hdr("svix-id")
    timestamp=hdr("svix-timestamp")
    signatures=hdr("svix-signature")
    if not event_id or not timestamp or not signatures or not isinstance(secret,str):
        raise ValueError("Missing webhook signature metadata")
    if len(event_id)>200 or len(timestamp)>25:
        raise ValueError("Invalid webhook metadata")
    try:
        t=int(timestamp)
        if abs(int(time.time())-t)>300:
            raise ValueError("Webhook timestamp expired")
        encoded=secret.removeprefix("whsec_")
        key=base64.b64decode(encoded+"="*((-len(encoded))%4),validate=True)
        if len(key)<16:raise ValueError("Webhook key too short")
        signed=event_id.encode()+b"."+timestamp.encode()+b"."+raw
        expected=base64.b64encode(hmac.new(key,signed,hashlib.sha256).digest()).decode()
        if not any(hmac.compare_digest(sig[3:],expected)
                   for sig in signatures.split(" ") if sig.startswith("v1,")):
            raise ValueError("Webhook signature mismatch")
        payload=json.loads(raw.decode("utf-8"))
        if not isinstance(payload,dict):raise ValueError("Webhook body must be an object")
        return payload
    except (ValueError,TypeError,UnicodeDecodeError) as exc:
        raise ValueError("Webhook signature or payload invalid") from exc

def insforge_enabled():
    return os.getenv("INSFORGE_EVENT_MIRROR_ENABLED","false").lower()=="true"

def enqueue_notification(db:Session, event:Event, kind:str, *, subject:str, message:str) -> None:
    integration=db.scalar(select(Integration).where(
        Integration.workspace_id==event.workspace_id,Integration.provider=="agentmail",Integration.enabled==True
    ))
    if integration and integration.config and integration.config.get("notification_to"):
        db.add(Outbox(workspace_id=event.workspace_id,event_id=event.id,
            provider="agentmail_notify",payload={
                "to": integration.config["notification_to"], "subject": subject,
                "text": message[:1500], "inbox_id":integration.config.get("inbox_id"),"kind":kind
            }))
    # InsForge DEV mirror: deliberately excludes email/name/body and is not an ads Pixel.
    # Only mirror the event when explicitly enabled; failures are retried independently.
    if insforge_enabled():
        # Only mirror public conversion events with current measurement consent.
        if event.contact_id:
            proof=db.scalar(select(Consent).where(
                Consent.workspace_id==event.workspace_id,Consent.contact_id==event.contact_id,
                Consent.purpose=="measurement").order_by(Consent.recorded_at.desc(),Consent.id.desc()))
            if not proof or not proof.granted:
                return
        db.add(Outbox(workspace_id=event.workspace_id,event_id=event.id,provider="insforge_mirror",
            payload={"workspace_id":event.workspace_id,"event_id":event.id,
                     "funnel_id":event.funnel_id,"event_type":event.type,
                     "occurred_at":event.created_at.isoformat() if event.created_at else now().isoformat()}))

def _checked_insforge():
    raw=os.getenv("INSFORGE_BASE_URL","").rstrip("/")
    key=os.getenv("INSFORGE_ADMIN_API_KEY","")
    u=urlsplit(raw)
    local=u.hostname in {"localhost","127.0.0.1","insforge"}
    if not key or not u.hostname or not (u.scheme=="https" or (u.scheme=="http" and local)) or u.username or u.password or u.query or u.fragment:
        raise ValueError("InsForge non configuré correctement (HTTPS + admin key serveur)")
    return raw,key

async def deliver(job:Outbox, db:Session, transport=None):
    if job.provider=="agentmail_notify":
        cfg=db.scalar(select(Integration).where(Integration.workspace_id==job.workspace_id,
            Integration.provider=="agentmail",Integration.enabled==True))
        if not cfg or not cfg.secret_encrypted:
            raise ValueError("AgentMail désactivé ou secret absent")
        credentials=json.loads(decrypt(cfg.secret_encrypted))
        inbox=cfg.config.get("inbox_id")
        if not credentials.get("api_key") or not inbox:
            raise ValueError("AgentMail manque clé ou inbox")
        if job.payload.get("to")!=cfg.config.get("notification_to"):
            raise ValueError("Destinataire de notification a changé : événement mis en quarantaine")
        # NOTE: status unknown if provider accepted but network timed out: at-least-once.
        async with httpx.AsyncClient(timeout=15,transport=transport) as client:
            response=await client.post(f"{AGENTMAIL_API_URL}/v0/inboxes/{inbox}/messages/send",
                headers={"Authorization":f"Bearer {credentials['api_key']}"},
                json={"to":[job.payload["to"]],"subject":job.payload["subject"],"text":job.payload["text"]})
        response.raise_for_status()
    elif job.provider=="auth_reset_mail":
        reset=db.get(PasswordResetToken,job.event_id)
        if not reset or reset.used or reset.expires_unix<=int(time.time()):
            raise ValueError("Lien de récupération expiré ou déjà utilisé : aucun envoi")
        key=os.getenv("AUTH_MAIL_AGENTMAIL_API_KEY","")
        inbox=os.getenv("AUTH_MAIL_INBOX_ID","")
        if not key or not inbox: raise ValueError("Email de récupération non configuré")
        link=decrypt(job.payload["url_enc"])
        if not link.startswith(os.getenv("PUBLIC_APP_URL","").rstrip("/")+"/?reset_token="):
            # Fails closed when the public origin is misconfigured.
            raise ValueError("Origine du lien de réinitialisation incorrecte")
        async with httpx.AsyncClient(timeout=15,transport=transport) as client:
            response=await client.post(f"{AGENTMAIL_API_URL}/v0/inboxes/{inbox}/messages/send",
                headers={"Authorization":"Bearer "+key},
                json={"to":[job.payload["to"]],
                      "subject":"Réinitialiser votre accès NÜM Funnel OS",
                      "text":"Pour réinitialiser votre mot de passe (lien valable 15 min) : "+link})
        response.raise_for_status()
    elif job.provider=="insforge_mirror":
        url,key=_checked_insforge()
        async with httpx.AsyncClient(timeout=10,transport=transport) as client:
            response=await client.post(
                f"{url}/api/database/records/num_funnel_events",
                params={"on_conflict":"workspace_id,event_id"},
                headers={"X-API-Key":key,"Prefer":"resolution=ignore-duplicates,return=minimal"},
                json=[{k:job.payload[k] for k in
                       ("workspace_id","event_id","funnel_id","event_type","occurred_at")}])
        response.raise_for_status()
    else:
        raise ValueError("Provider outbox inconnu")

async def dispatch_once(*,transport=None) -> dict:
    """Claim due jobs and process. PostgreSQL row locks prevent cross-worker claims."""
    due=[]
    with SessionLocal() as db:
        pending=db.scalars(select(Outbox).where(Outbox.status=="pending")
            .order_by(Outbox.created_at.asc()).with_for_update(skip_locked=True).limit(25)).all()
        now_time=now()
        for job in pending:
            next_attempt=(job.payload or {}).get("_retry_after")
            if next_attempt and datetime.fromisoformat(next_attempt)>now_time:
                continue
            job.status="processing"
            due.append(job.id)
        db.commit()
    outcomes={"sent":0,"retried":0,"failed":0}
    for id_ in due:
        with SessionLocal() as db:
            j=db.get(Outbox,id_)
            if not j or j.status!="processing": continue
            try:
                await deliver(j,db,transport)
                j.status="sent"; outcomes["sent"]+=1
            except Exception as err:
                j.attempts=(j.attempts or 0)+1
                if j.attempts>=5:
                    j.status="failed";outcomes["failed"]+=1
                else:
                    j.status="pending";outcomes["retried"]+=1
                # Exponential retry without putting sensitive provider errors into the UI.
                delay=min(3600,30*(2**(j.attempts-1)))
                j.payload={**j.payload,"_retry_after":(now()+timedelta(seconds=delay)).isoformat()}
                log.warning("Delivery provider=%s failed attempt=%s type=%s",j.provider,j.attempts,type(err).__name__)
            db.commit()
    return outcomes

async def dispatch_forever():
    # recover interrupted jobs after process restart (not guarantees exactly once).
    with SessionLocal() as db:
        for j in db.scalars(select(Outbox).where(Outbox.status=="processing")).all():
            j.status="pending"
        db.commit()
    from .expansion import process_ai_once, recover_ai_jobs
    recover_ai_jobs()
    while True:
        try:
            await dispatch_once()
            await process_ai_once()
        except asyncio.CancelledError: raise
        except Exception:
            log.exception("outbox dispatch loop failed")
        await asyncio.sleep(10)
