"""NÜM integrations: allowlisted InsForge I/O and human-reviewed AI draft pipeline.

No public client ever receives an InsForge admin key. Do not point this at a
production BioDeck instance. Provider calls are performed outside public
transactions and are always optional.
"""
import os, re, json, asyncio
from datetime import datetime, timezone, timedelta
from urllib.parse import quote
import httpx
from sqlalchemy import select
from .db import SessionLocal
from .models import Automation, AutomationRun, Contact, Event, EmailDraft, Application, Consent, now
from .integration_pipeline import _checked_insforge

ALLOWED_MIME = {"image/png":".png", "image/jpeg":".jpg", "image/webp":".webp",
                "application/pdf":".pdf", "video/mp4":".mp4"}
MAX_ASSET_BYTES = 12 * 1024 * 1024

def storage_config():
    if os.getenv("INSFORGE_STORAGE_ENABLED","false").lower() != "true":
        raise ValueError("InsForge Storage n'est pas activé")
    base,key = _checked_insforge()
    bucket=os.getenv("INSFORGE_STORAGE_BUCKET","num_funnel_assets")
    if not re.fullmatch(r"[A-Za-z0-9_-]{3,70}",bucket):
        raise ValueError("Nom du bucket invalide")
    return base,key,bucket

def checked_function_slug(slug:str):
    allow={p.strip() for p in os.getenv("INSFORGE_FUNCTION_ALLOWLIST","").split(",") if p.strip()}
    if not re.fullmatch(r"[a-zA-Z0-9_-]{2,90}",slug or "") or slug not in allow:
        raise ValueError("Fonction InsForge non autorisée")
    return slug

async def put_file(object_key:str, filename:str, content:bytes, mime:str, *,transport=None):
    base,key,bucket=storage_config()
    if mime not in ALLOWED_MIME or not content or len(content)>MAX_ASSET_BYTES:
        raise ValueError("Type ou taille de média non autorisé")
    if len(object_key)>300 or ".." in object_key or not re.fullmatch(r"[0-9a-f-]+/[0-9a-f-]+\.(png|jpg|webp|pdf|mp4)", object_key):
        raise ValueError("Clé d'objet non sûre")
    url=f"{base}/api/storage/buckets/{bucket}/objects/{quote(object_key,safe='/')}"
    async with httpx.AsyncClient(timeout=35,transport=transport) as client:
        r=await client.put(url,headers={"x-api-key":key},files={"file":(filename,content,mime)})
    r.raise_for_status()
    return r.json()

async def read_file(bucket:str,object_key:str, *,transport=None):
    base,key,configured=storage_config()
    if configured!=bucket:raise ValueError("Bucket non autorisé")
    async with httpx.AsyncClient(timeout=25,transport=transport) as client:
        r=await client.get(f"{base}/api/storage/buckets/{bucket}/objects/{quote(object_key,safe='/')}",
                           headers={"x-api-key":key})
    r.raise_for_status()
    if len(r.content)>MAX_ASSET_BYTES:raise ValueError("Réponse média trop volumineuse")
    return r.content

async def invoke_function(slug:str,payload:dict, *,transport=None):
    checked_function_slug(slug)
    base,key=_checked_insforge()
    if len(json.dumps(payload,ensure_ascii=False))>6000:
        raise ValueError("Charge utile trop volumineuse")
    headers={"x-api-key":key, "content-type":"application/json"}
    # Function code must independently authenticate inbound service-to-service requests.
    shared=os.getenv("INSFORGE_FUNCTION_SHARED_SECRET","")
    if not shared or len(shared)<24: raise ValueError("Secret de fonction non configuré")
    headers["x-num-service-secret"]=shared
    async with httpx.AsyncClient(timeout=22,transport=transport) as client:
        r=await client.post(f"{base}/functions/{slug}",json=payload,headers=headers)
    r.raise_for_status()
    data=r.json()
    if not isinstance(data,dict): raise ValueError("Réponse fonction incorrecte")
    return data

def queue_ai(db,event):
    """Atomic insertion alongside business event, with unique automation/event."""
    if not event.contact_id:return
    proof=db.scalar(select(Consent).where(Consent.workspace_id==event.workspace_id,
        Consent.contact_id==event.contact_id,Consent.purpose=="marketing")
        .order_by(Consent.recorded_at.desc(),Consent.id.desc()))
    if not proof or not proof.granted:
        return
    rules=db.scalars(select(Automation).where(Automation.workspace_id==event.workspace_id,
              Automation.trigger==event.type,Automation.action=="ai_reply_draft",
              Automation.enabled==True)).all()
    for rule in rules:
        db.add(AutomationRun(workspace_id=event.workspace_id,
            automation_id=rule.id,event_id=event.id,contact_id=event.contact_id))

async def process_ai_once(*,transport=None):
    """At-least-once job execution, idempotent draft creation after claim."""
    with SessionLocal() as db:
        run=db.scalar(select(AutomationRun).where(AutomationRun.state=="pending",
            AutomationRun.next_attempt_at<=now()).order_by(AutomationRun.created_at)
            .with_for_update(skip_locked=True).limit(1))
        if not run:return {"processed":0}
        run.state="processing";run_id=run.id
        db.commit()
    try:
        with SessionLocal() as db:
            run=db.get(AutomationRun,run_id)
            rule=db.get(Automation,run.automation_id)
            contact=db.get(Contact,run.contact_id)
            ev=db.get(Event,run.event_id)
            if not rule or not rule.enabled or rule.workspace_id!=run.workspace_id or not contact or contact.workspace_id!=run.workspace_id or not ev or ev.workspace_id!=run.workspace_id:
                run.state="skipped";db.commit();return {"processed":1,"skipped":1}
            proof=db.scalar(select(Consent).where(Consent.workspace_id==run.workspace_id,
                Consent.contact_id==contact.id, Consent.purpose=="marketing")
                .order_by(Consent.recorded_at.desc(),Consent.id.desc()))
            if not proof or not proof.granted:
                run.state="skipped";db.commit()
                return {"processed":1,"skipped":1,"reason":"marketing_consent_missing"}
            context={"event_type":ev.type,
                     "funnel_id":ev.funnel_id,
                     "stage":str((ev.data or {}).get("stage") or "")[:50]}
            function=os.getenv("INSFORGE_AI_DRAFT_FUNCTION","").strip()
            if function:
                result=await invoke_function(function,{"task":"draft_follow_up",
                    "context":context, "instructions":"Retourner uniquement subject et body en français. Ne pas inventer de faits. Ne pas envoyer d'email. Pas de données personnelles dans cette requête."},
                    transport=transport)
                subject=str(result.get("subject",""))[:180].strip()
                body=str(result.get("body",""))[:4000].strip()
                if not subject or not body:raise ValueError("Fonction IA: brouillon manquant")
            else:
                subject="Votre projet APP 7 — prochaines étapes"
                body="Merci pour votre intérêt pour APP 7. Nous avons reçu votre demande et reviendrons vers vous avec les prochaines étapes du parcours."
            # The provider receives no email, first name, message, or identifiers of the contact.
            db.add(EmailDraft(workspace_id=run.workspace_id,contact_id=contact.id,
                     to=contact.email,subject=subject,body=f"Bonjour {contact.first_name},\\n\\n{body}\\n\\nL'équipe Nümtema"))
            run.state="completed"
            db.commit()
            return {"processed":1,"completed":1,"mode":"insforge_function" if function else "local_template"}
    except Exception:
        with SessionLocal() as db:
            run=db.get(AutomationRun,run_id)
            if run:
                run.attempts+=1
                run.state="failed" if run.attempts>=4 else "pending"
                run.next_attempt_at=now()+timedelta(seconds=min(3600,30*2**run.attempts))
                db.commit()
        return {"processed":1,"retry":1}

def recover_ai_jobs():
    with SessionLocal() as db:
        for r in db.scalars(select(AutomationRun).where(AutomationRun.state=="processing")).all():
            r.state="pending"
        db.commit()
