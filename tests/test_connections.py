"""Connector contract tests, no outbound network or real provider secrets."""
import asyncio, base64, hmac, hashlib, json, os, sys, time
from pathlib import Path
import httpx
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from cryptography.fernet import Fernet

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT))
os.environ["DATABASE_URL"]="sqlite:///"+str(ROOT/"tests"/"_test_connections.sqlite")
os.environ["SESSION_SECRET"]="test-session-not-for-production"
os.environ["INTEGRATION_KEY"]=Fernet.generate_key().decode()
os.environ["WORKER_ENABLED"]="false"
os.environ["INSFORGE_EVENT_MIRROR_ENABLED"]="false"

from server.main import app, BUCKET
from server.models import Base, Outbox, Event, WebhookReceipt
from server.db import engine, SessionLocal
from server.integration_pipeline import dispatch_once, verify_svix

@pytest.fixture(autouse=True)
def reset(monkeypatch):
    BUCKET.clear()
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    monkeypatch.setenv("INSFORGE_EVENT_MIRROR_ENABLED","false")
    monkeypatch.delenv("INSFORGE_BASE_URL",raising=False)
    monkeypatch.delenv("INSFORGE_ADMIN_API_KEY",raising=False)
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def setup(c,email="admin@example.com",ws="Atelier"):
    csrf=c.get("/api/auth/me").json()["csrf"]
    reg=c.post("/api/auth/register",headers={"x-csrf-token":csrf},json={
        "name":"Atelier Owner","email":email,"password":"this-is-secret-123","workspace_name":ws})
    assert reg.status_code==201,reg.text
    workspace=c.get("/api/auth/me").json()["workspaces"][0]["id"]
    headers={"x-csrf-token":c.get("/api/auth/me").json()["csrf"],"x-workspace-id":workspace}
    fid=reg.json()["funnel_id"]
    assert c.post(f"/api/funnels/{fid}/publish",headers=headers,json={}).status_code==200
    slug=c.get("/api/funnels",headers=headers).json()[0]["slug"]
    return headers,workspace,slug

def agentmail_config(c,h,inbox="agent@example.com",secret=None):
    data={"enabled":True,"inbox_id":inbox,"api_key":"TEST_FAKE_TOKEN","notification_to":"alerts@example.com"}
    if secret:data["webhook_secret"]=secret
    r=c.put("/api/integrations/agentmail",headers=h,json=data)
    assert r.status_code==200,r.text

def lead(c,slug,email="lead@example.com",consent=False):
    return c.post(f"/api/public/{slug}/leads",json={
        "first_name":"Sophie","email":email,"measurement_consent":consent,
        "marketing_consent":True,"honeypot":""})

def sign(raw,secret,ts=None):
    ts=str(ts or int(time.time()))
    eid="delivery-123"
    key=base64.b64decode(secret[6:])
    digest=base64.b64encode(hmac.new(key,eid.encode()+b"."+ts.encode()+b"."+raw,hashlib.sha256).digest()).decode()
    return {"svix-id":eid,"svix-timestamp":ts,"svix-signature":"v1,"+digest}

def test_real_local_notification_queue_dispatch_with_mock(client):
    h,w,slug=setup(client)
    agentmail_config(client,h)
    r=lead(client,slug)
    assert r.status_code==201,r.text
    rows=client.get("/api/integrations/deliveries",headers=h).json()
    assert len(rows)==1 and rows[0]["provider"]=="agentmail_notify" and rows[0]["status"]=="pending"
    calls=[]
    def handler(req):
        calls.append(req)
        assert "Bearer TEST_FAKE_TOKEN"==req.headers["Authorization"]
        assert req.url.path.endswith("/messages/send")
        body=json.loads(req.content)
        assert body["to"]==["alerts@example.com"]
        assert "Sophie" in body["text"]
        return httpx.Response(201,json={"message_id":"mid_test"})
    results=asyncio.run(dispatch_once(transport=httpx.MockTransport(handler)))
    assert results["sent"]==1 and len(calls)==1
    assert client.get("/api/integrations/deliveries",headers=h).json()[0]["status"]=="sent"

def test_no_notification_without_opt_in_configuration(client):
    h,w,slug=setup(client)
    assert lead(client,slug).status_code==201
    assert client.get("/api/integrations/deliveries",headers=h).json()==[]

def test_retry_failed_provider_uses_persistent_outbox(client):
    h,w,slug=setup(client)
    agentmail_config(client,h)
    assert lead(client,slug).status_code==201
    def fail(req):return httpx.Response(503,json={"error":"provider busy"})
    assert asyncio.run(dispatch_once(transport=httpx.MockTransport(fail)))["retried"]==1
    with SessionLocal() as db:
        job=db.scalar(select(Outbox))
        assert job.status=="pending" and job.attempts==1 and job.payload.get("_retry_after")

def test_signed_agentmail_webhook_deduplicated_and_isolated(client):
    secret="whsec_"+base64.b64encode(b"webhook-signing-secret-24bytes!").decode()
    h,w,slug=setup(client)
    agentmail_config(client,h,secret=secret)
    data={"event_type":"message.received","event_id":"provider-one",
        "message":{"inbox_id":"agent@example.com","from_":["sender@example.org"],
        "subject":"Demande de devis","preview":"Bonjour, une question."}}
    raw=json.dumps(data,separators=(",",":")).encode()
    url=f"/api/webhooks/agentmail/{w}"
    assert client.post(url,content=raw,headers=sign(raw,secret)).status_code==200
    again=client.post(url,content=raw,headers=sign(raw,secret))
    assert again.status_code==200 and again.json().get("duplicate") is True
    inbox=client.get("/api/inbox",headers=h).json()
    assert len(inbox["received"])==1
    assert inbox["received"][0]["from"]=="sender@example.org"
    assert len([x for x in client.get("/api/events",headers=h).json() if x["type"]=="agentmail_message_received"])==1
    # Same signed event must not be usable to pollute another tenant.
    with TestClient(app) as other:
        h2,w2,slug2=setup(other,"other@example.com","Other")
        agentmail_config(other,h2,inbox="other@example.com",secret=secret)
        assert other.post(f"/api/webhooks/agentmail/{w2}",content=raw,headers=sign(raw,secret)).status_code==403
        assert other.get("/api/inbox",headers=h2).json()["received"]==[]
        assert other.get("/api/realtime/stream?workspace_id="+w).status_code==403

def test_webhook_invalid_forged_stale_rejected(client):
    secret="whsec_"+base64.b64encode(b"webhook-signing-secret-24bytes!").decode()
    h,w,slug=setup(client)
    agentmail_config(client,h,secret=secret)
    payload={"event_type":"message.received","event_id":"another","message":{"inbox_id":"agent@example.com"}}
    raw=json.dumps(payload).encode()
    url=f"/api/webhooks/agentmail/{w}"
    bad=sign(raw,secret)
    bad["svix-signature"]="v1,TAMPERED"
    assert client.post(url,content=raw,headers=bad).status_code==401
    old=sign(raw,secret,ts=int(time.time())-600)
    assert client.post(url,content=raw,headers=old).status_code==401
    assert client.get("/api/inbox",headers=h).json()["received"]==[]

def test_insforge_dev_mirror_off_by_default_optin_only(client,monkeypatch):
    monkeypatch.setenv("INSFORGE_EVENT_MIRROR_ENABLED","true")
    h,w,slug=setup(client)
    assert lead(client,slug,"noconsent@example.com",False).status_code==201
    assert client.get("/api/integrations/deliveries",headers=h).json()==[]
    assert lead(client,slug,"consent@example.com",True).status_code==201
    items=client.get("/api/integrations/deliveries",headers=h).json()
    assert len(items)==1 and items[0]["provider"]=="insforge_mirror"
    monkeypatch.setenv("INSFORGE_BASE_URL","https://insforge.dev.example")
    monkeypatch.setenv("INSFORGE_ADMIN_API_KEY","fake-server-only-key")
    def check(request):
        assert request.url.path=="/api/database/records/num_funnel_events"
        assert request.headers["x-api-key"]=="fake-server-only-key"
        body=json.loads(request.content)
        assert len(body)==1 and "email" not in body[0]
        assert body[0]["workspace_id"]==w
        return httpx.Response(201,json=[])
    assert asyncio.run(dispatch_once(transport=httpx.MockTransport(check)))["sent"]==1


def test_private_sse_format(client):
    from starlette.requests import Request
    from server.main import realtime_stream
    from server.models import User
    h,w,slug=setup(client)
    # Directly validate the initial SSE frame; other-tenant denial is checked above.
    async def check():
        from sqlalchemy import select
        with SessionLocal() as db:
            u=db.scalar(select(User).where(User.email=="admin@example.com"))
            scope={"type":"http","method":"GET","path":"/api/realtime/stream","headers":[],"query_string":b""}
            async def receive():
                await asyncio.sleep(3600)
                return {"type":"http.disconnect"}
            req=Request(scope,receive=receive)
            response=await realtime_stream(workspace_id=w,request=req,db=db,user=u)
            frame=await response.body_iterator.__anext__()
            await response.body_iterator.aclose()
            assert frame.startswith("event: ready\n")
            assert frame.endswith("\n\n")
    asyncio.run(check())
