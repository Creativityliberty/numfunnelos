"""NÜM v1.2: isolated contract tests, never contact InsForge/Cal.com."""
import asyncio, hashlib, hmac, json, os
from io import BytesIO
import httpx
import pytest
from sqlalchemy import select
from test_connections import client,reset,setup,lead
from server.main import app
from server.db import SessionLocal
from server.models import Asset, CalBooking, AutomationRun, WebhookReceipt
from server.expansion import invoke_function, put_file, process_ai_once

def configure_cal(c, headers, ws, secret="test-cal-secret"):
    data={"enabled":True,"booking_url":"https://cal.com/team/intro",
          "cal_event_type_id":12345,"webhook_secret":secret}
    r=c.put("/api/integrations/calcom",headers=headers,json=data)
    assert r.status_code==200,r.text

def post_cal(c, ws, payload, secret="test-cal-secret", bad=False):
    raw=json.dumps(payload,separators=(',',':')).encode()
    signature=hmac.new(secret.encode(),raw,hashlib.sha256).hexdigest()
    return c.post(f"/api/webhooks/calcom/{ws}",content=raw,
        headers={"content-type":"application/json",
                 "x-cal-signature-256":"invalid" if bad else signature})

def payload_cal(event="BOOKING_CREATED",uid="booking_111", email="lead@example.com",
                type_id=12345, slot="2026-12-02T10:00:00Z"):
    return {"triggerEvent":event,"createdAt":"2026-10-22T09:00:00Z",
      "payload":{"uid":uid,"startTime":slot,"eventTypeId":type_id,
        "attendees":[{"email":email}]}}

def test_cal_webhook_binding_idempotency_lifecycle(client):
    h,ws,slug=setup(client)
    configure_cal(client,h,ws)
    assert lead(client,slug).status_code==201
    good=payload_cal()
    assert post_cal(client,ws,good,bad=True).status_code==401
    wrong=payload_cal(type_id=7)
    assert post_cal(client,ws,wrong).json()["ignored"]
    r=post_cal(client,ws,good)
    assert r.status_code==200,r.text
    assert post_cal(client,ws,good).json()["duplicate"]
    bookings=client.get('/api/bookings',headers=h).json()
    assert len(bookings)==1 and bookings[0]["provider"]=="calcom"
    cancel=payload_cal(event="BOOKING_CANCELLED")
    assert post_cal(client,ws,cancel).status_code==200
    assert client.get('/api/bookings',headers=h).json()[0]['status']=="cancelled"
    rescheduled=payload_cal(event="BOOKING_RESCHEDULED",slot="2026-12-03T10:00:00Z")
    assert post_cal(client,ws,rescheduled).status_code==200
    bookings=client.get('/api/bookings',headers=h).json()
    assert bookings[0]['status']=="confirmed" and bookings[0]['slot']=="2026-12-03T10:00:00Z"
    with SessionLocal() as db:
        assert len(db.scalars(select(WebhookReceipt).where(WebhookReceipt.workspace_id==ws,
                       WebhookReceipt.provider=="calcom")).all())==3

def test_cal_webhook_no_cross_tenant_or_unknown_email(client):
    h,ws,slug=setup(client)
    configure_cal(client,h,ws)
    assert lead(client,slug).status_code==201
    resp=post_cal(client,ws,payload_cal(email="some-other@example.com"))
    assert resp.status_code==200 and resp.json()["ignored"]
    assert client.get("/api/bookings",headers=h).json()==[]

def test_cal_configuration_validates_url(client):
    h,ws,slug=setup(client)
    r=client.put("/api/integrations/calcom",headers=h,json={
        "enabled":True,"booking_url":"https://127.0.0.1:9000/admin","cal_event_type_id":11})
    assert r.status_code==422
    r=client.put("/api/integrations/calcom",headers=h,json={"enabled":True})
    assert r.status_code==422

def test_ai_workflow_creates_draft_for_human_approval(client,monkeypatch):
    h,ws,slug=setup(client)
    monkeypatch.delenv("INSFORGE_AI_DRAFT_FUNCTION",raising=False)
    new=client.post('/api/automations',headers=h,json={
        'name':'Qualification IA','trigger':'application_interest_submitted',
        'action':'ai_reply_draft','enabled':True})
    assert new.status_code==201,new.text
    response=lead(client,slug); token=response.json()['token']
    app=client.post(f'/api/public/{slug}/applications',json={
        'token':token,'idea_stage':'ideation','message':'Une idée de SaaS.'})
    assert app.status_code==201,app.text
    assert len(client.get('/api/inbox',headers=h).json()['drafts'])==1 # welcome draft only
    with SessionLocal() as db:
        runs=db.scalars(select(AutomationRun).where(AutomationRun.workspace_id==ws)).all()
        assert len(runs)==1 and runs[0].state=="pending"
    result=asyncio.run(process_ai_once())
    assert result['completed']==1
    drafts=client.get('/api/inbox',headers=h).json()['drafts']
    assert len(drafts)==2 and any("prochaines étapes" in d['subject'] for d in drafts)
    assert all(d['status']=='draft' for d in drafts)
    assert asyncio.run(process_ai_once())['processed']==0

def test_insforge_function_allowlist_and_no_secrets(client,monkeypatch):
    h,ws,slug=setup(client)
    r=client.post('/api/insforge/functions/arbitrary/invoke',headers=h,json={'payload':{}})
    assert r.status_code==422
    monkeypatch.setenv('INSFORGE_FUNCTION_ALLOWLIST','num-ai-draft')
    monkeypatch.setenv('INSFORGE_BASE_URL','https://insforge.example')
    monkeypatch.setenv('INSFORGE_ADMIN_API_KEY','FAKE_ADMIN_KEY')
    monkeypatch.setenv('INSFORGE_FUNCTION_SHARED_SECRET','LOCAL_TEST_SHARED_KEY_123456789')
    def handler(req):
        assert req.url.path=="/functions/num-ai-draft"
        assert req.headers['x-api-key']=='FAKE_ADMIN_KEY'
        assert req.headers['x-num-service-secret']=='LOCAL_TEST_SHARED_KEY_123456789'
        return httpx.Response(200,json={'subject':'Prochaines étapes','body':'Projet reçu'})
    r=asyncio.run(invoke_function('num-ai-draft',{'task':'draft_follow_up'},transport=httpx.MockTransport(handler)))
    assert r['subject']=='Prochaines étapes'
    with pytest.raises(ValueError):
        asyncio.run(invoke_function('arbitrary',{},transport=httpx.MockTransport(handler)))

def test_storage_proxy_uses_server_only_credentials(client,monkeypatch):
    h,ws,slug=setup(client)
    monkeypatch.setenv('INSFORGE_STORAGE_ENABLED','true')
    monkeypatch.setenv('INSFORGE_BASE_URL','https://insforge.example')
    monkeypatch.setenv('INSFORGE_ADMIN_API_KEY','FAKE_ADMIN_KEY')
    png=b'\x89PNG\r\n\x1a\n'+b'FAKE-PNG-CONTENT'
    def handler(req):
        assert req.headers['x-api-key']=='FAKE_ADMIN_KEY'
        assert req.url.path.startswith('/api/storage/buckets/num_funnel_assets/objects/')
        return httpx.Response(201,json={'key':'test.png','size':len(png)})
    response=asyncio.run(put_file(ws+'/00000000-0000-4000-8000-000000000001.png',
                                 'image.png',png,'image/png',transport=httpx.MockTransport(handler)))
    assert response['size']==len(png)
    import server.main as main
    async def fake_put(key,filename,blob,mime):
        assert key.startswith(ws+'/')
        assert mime=='image/png'
        return {'size':len(blob)}
    async def fake_read(bucket,key):
        return png
    monkeypatch.setattr(main,'put_file',fake_put)
    monkeypatch.setattr(main,'read_file',fake_read)
    upload=client.post('/api/assets',headers=h,files={'file':('sample.png',png,'image/png')})
    assert upload.status_code==201,upload.text
    id_=upload.json()['id']
    assert client.get('/api/assets',headers=h).json()[0]['id']==id_
    read=client.get('/api/assets/'+id_,headers=h)
    assert read.status_code==200 and read.content==png
    bad=client.post('/api/assets',headers=h,files={'file':('virus.png',b'evil','image/png')})
    assert bad.status_code==422

def test_private_media_cannot_be_read_by_another_workspace(client,monkeypatch):
    h,ws,slug=setup(client)
    from server.models import Asset
    with SessionLocal() as db:
        a=Asset(workspace_id=ws,bucket='num_funnel_assets',object_key=ws+'/some.png',
                filename='photo.png',mime_type='image/png',byte_count=14)
        db.add(a);db.commit();id_=a.id
    second=client.post('/api/workspaces',headers=h,json={'name':'Autre entreprise'})
    assert second.status_code==201,second.text
    h2={**h,'x-workspace-id':second.json()['id']}
    assert client.get('/api/assets/'+id_,headers=h2).status_code==404


def test_no_automatic_ai_follow_up_without_marketing_consent(client):
    h,ws,slug=setup(client)
    auto=client.post('/api/automations',headers=h,json={
        'name':'AI Projets','trigger':'application_interest_submitted',
        'action':'ai_reply_draft','enabled':True})
    assert auto.status_code==201
    response=client.post(f'/api/public/{slug}/leads',json={
        'first_name':'Alice','email':'alice@example.com','marketing_consent':False,
        'measurement_consent':False,'honeypot':''})
    assert response.status_code==201
    token=response.json()['token']
    interest=client.post(f'/api/public/{slug}/applications',json={
        'token':token,'idea_stage':'ideation','message':'Un projet.'})
    assert interest.status_code==201
    assert client.get('/api/automations/runs',headers=h).json()==[]
    assert client.get('/api/inbox',headers=h).json()['drafts']==[]

def test_webhook_secret_is_workspace_scoped(client):
    h,ws,slug=setup(client)
    configure_cal(client,h,ws,secret="secret-ws-a")
    second=client.post('/api/workspaces',headers=h,json={'name':'Équipe B'})
    assert second.status_code==201
    other=second.json()['id']
    h2={**h,'x-workspace-id':other}
    assert client.put('/api/integrations/calcom',headers=h2,json={
      'enabled':True,'booking_url':'https://cal.com/team-b/intro',
      'cal_event_type_id':12345,'webhook_secret':'secret-ws-b'}).status_code==200
    assert lead(client,slug).status_code==201
    webhook=post_cal(client,other,payload_cal(),secret="secret-ws-a")
    assert webhook.status_code==401
    assert client.get('/api/bookings',headers=h2).json()==[]
