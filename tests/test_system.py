"""Real API integration tests; use SQLite locally, production runs Postgres."""
import os, sys
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from cryptography.fernet import Fernet

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT))
os.environ['DATABASE_URL']='sqlite:///'+str(ROOT/'tests'/'_test_numfunnel.sqlite')
os.environ['SESSION_SECRET']='test-only-session-secret-keep-out-of-prod'
os.environ['INTEGRATION_KEY']=Fernet.generate_key().decode()
os.environ['WORKER_ENABLED']='false'
os.environ['INSFORGE_EVENT_MIRROR_ENABLED']='false'
from server.main import app,BUCKET
from server.db import engine
from server.models import Base

@pytest.fixture(autouse=True)
def freshdb():
    BUCKET.clear()
    Base.metadata.drop_all(engine);Base.metadata.create_all(engine)
    yield

@pytest.fixture
def client():
    with TestClient(app) as c:yield c

def bootstrap(c,email='owner1@example.com',ws='Agency A'):
    csrf=c.get('/api/auth/me').json()['csrf']
    r=c.post('/api/auth/register',headers={'x-csrf-token':csrf},json={'name':'Studio Owner','email':email,'password':'a-long-pass-123','workspace_name':ws})
    assert r.status_code==201,r.text
    auth=c.get('/api/auth/me').json()
    return {'x-csrf-token':auth['csrf'],'x-workspace-id':auth['workspaces'][0]['id']},r.json()['funnel_id']

def publish(c,headers,fid):
    response=c.post(f'/api/funnels/{fid}/publish',headers=headers,json={});assert response.status_code==200,response.text
    return c.get('/api/funnels',headers=headers).json()[0]['slug']

def lead(c,slug,mail='lead@example.com',measurement=False):
    return c.post(f'/api/public/{slug}/leads',json={'first_name':'Sophie','email':mail,'measurement_consent':measurement,'marketing_consent':True,'honeypot':'','utm_source':'chatgpt'})

def test_auth_workspace_seed_and_draft_privacy(client):
    h,fid=bootstrap(client)
    assert len(client.get('/api/funnels',headers=h).json())==1
    slug=client.get('/api/funnels',headers=h).json()[0]['slug']
    assert client.get('/api/public/'+slug).status_code==404
    assert TestClient(app).get('/api/contacts').status_code==401
    assert client.post('/api/funnels/'+fid+'/publish',json={}).status_code==403
    assert client.get('/api/analytics',headers=h).json()['contacts']==0

def test_publish_immutable_snapshot_capture_interest_and_drafts(client):
    h,fid=bootstrap(client);slug=publish(client,h,fid)
    cfg=client.get('/api/public/'+slug).json()
    assert len(cfg['content']['chapters'])==11
    result=lead(client,slug)
    assert result.status_code==201,result.text
    data=result.json(); assert len(data['event_id'])==36 and len(data['token'])>35
    a=client.post(f'/api/public/{slug}/applications',json={'token':data['token'],'idea_stage':'idea','message':'Je veux créer une plateforme'})
    assert a.status_code==201,a.text
    metrics=client.get('/api/analytics',headers=h).json()
    assert (metrics['contacts'],metrics['submissions'],metrics['applications'],metrics['bookings'])==(1,1,1,0)
    assert len(client.get('/api/inbox',headers=h).json()['drafts'])==1
    f=client.get('/api/funnels',headers=h).json()[0]
    new=f['draft'];new['copy']['title']='Un titre en brouillon uniquement'
    assert client.patch('/api/funnels/'+fid,headers=h,json={'draft':new}).status_code==200
    assert client.get('/api/public/'+slug).json()['content']['copy']['title']!=new['copy']['title']
    assert client.post('/api/funnels/'+fid+'/publish',headers=h,json={}).json()['version']==2
    assert client.get('/api/public/'+slug).json()['content']['copy']['title']==new['copy']['title']

def test_public_invalid_spam_consent_and_revocation(client):
    h,fid=bootstrap(client);slug=publish(client,h,fid)
    spam=client.post(f'/api/public/{slug}/leads',json={'first_name':'Sophie','email':'x@example.com','honeypot':'filled'})
    assert spam.status_code==422
    ok=lead(client,slug,measurement=False);assert ok.status_code==201
    tok=ok.json()['token']
    assert client.post(f'/api/public/{slug}/applications',json={'token':'bad','idea_stage':'idea'}).status_code==401
    r=client.post(f'/api/public/{slug}/consent/revoke',json={'token':tok,'purpose':'measurement'})
    assert r.status_code==200 and r.json()['granted'] is False
    assert client.get('/api/analytics',headers=h).json()['contacts']==1

def test_booking_and_slot_conflict(client):
    h,fid=bootstrap(client);f=client.get('/api/funnels',headers=h).json()[0]
    draft=f['draft'];draft['settings']['booking_enabled']=True
    assert client.patch('/api/funnels/'+fid,headers=h,json={'draft':draft}).status_code==200
    slug=publish(client,h,fid)
    available=client.get(f'/api/public/{slug}/slots').json()['slots'];assert len(available)>20
    t1=lead(client,slug,'first@example.com').json()['token']
    t2=lead(client,slug,'second@example.com').json()['token']
    slot=available[0]['id']
    good=client.post(f'/api/public/{slug}/bookings',json={'token':t1,'slot':slot})
    assert good.status_code==201,good.text
    bad=client.post(f'/api/public/{slug}/bookings',json={'token':t2,'slot':slot})
    assert bad.status_code==409
    metrics=client.get('/api/analytics',headers=h).json()
    assert metrics['bookings']==1
    ics=client.get('/api/bookings/'+good.json()['booking_id']+'/ics',headers=h)
    assert ics.status_code==200 and 'BEGIN:VCALENDAR' in ics.text

def test_workspace_isolation(client):
    h,fid=bootstrap(client)
    client2=TestClient(app)
    h2,fid2=bootstrap(client2,'owner2@example.com','Agency B')
    slug=publish(client,h,fid)
    lead(client2,slug,'anon@example.com')
    assert client.get('/api/analytics',headers=h).json()['contacts']==1
    assert client2.get('/api/analytics',headers=h2).json()['contacts']==0
    assert client2.get('/api/funnels/'+fid,headers=h2).status_code==404
    assert client2.patch('/api/funnels/'+fid,headers=h2,json={'name':'attack'}).status_code==404
    assert client2.get('/api/contacts',headers={**h2,'x-workspace-id':h['x-workspace-id']}).status_code==403
    assert client2.get('/api/bookings/'+str(__import__('uuid').uuid4())+'/ics',headers=h2).status_code==404
    client2.close()

def test_integrations_guard_and_automations(client):
    h,fid=bootstrap(client)
    r=client.put('/api/integrations/openai_ads',headers=h,json={'pixel_id':'123','enabled':True})
    assert r.status_code==422
    assert client.put('/api/integrations/openai_ads',headers=h,json={'pixel_id':'123','enabled':False}).status_code==200
    rows=client.get('/api/integrations',headers=h).json()
    assert rows[0]['config']['pixel_id']=='123'
    assert client.post('/api/inbox/drafts/random/send',headers=h,json={}).status_code==404
    flows=client.get('/api/automations',headers=h).json();assert len(flows)==1
    toggle=client.patch('/api/automations/'+flows[0]['id'],headers=h,json={'enabled':False});assert toggle.status_code==200

def test_login_persists_session(client):
    h,fid=bootstrap(client)
    assert client.post('/api/auth/logout',headers=h,json={}).status_code==200
    assert client.get('/api/funnels',headers=h).status_code==401
    csrf=client.get('/api/auth/me').json()['csrf']
    login=client.post('/api/auth/login',headers={'x-csrf-token':csrf},json={'email':'owner1@example.com','password':'a-long-pass-123'})
    assert login.status_code==200
    assert len(client.get('/api/funnels',headers={'x-workspace-id':h['x-workspace-id']}).json())==1

def test_multiple_funnels_creation_duplication_and_deletion(client):
    h,fid=bootstrap(client)
    # 1. Vérifier qu'un utilisateur peut créer autant de tunnels qu'il le souhaite
    f2=client.post('/api/funnels',headers=h,json={'name':'Tunnel Masterclass 2'}).json()
    f3=client.post('/api/funnels',headers=h,json={'name':'Tunnel Offre VIP 3'}).json()
    all_f=client.get('/api/funnels',headers=h).json()
    assert len(all_f)==3
    assert {x['name'] for x in all_f}=={'APP 7 — Première application','Tunnel Masterclass 2','Tunnel Offre VIP 3'}

    # 2. Dupliquer un tunnel existant
    dup=client.post(f'/api/funnels/{f2["id"]}/duplicate',headers=h).json()
    assert dup['name']=='Tunnel Masterclass 2 (Copie)'
    assert dup['status']=='draft'
    assert len(client.get('/api/funnels',headers=h).json())==4

    # 3. Supprimer un tunnel
    del_res=client.delete(f'/api/funnels/{f3["id"]}',headers=h).json()
    assert del_res['ok'] is True
    assert len(client.get('/api/funnels',headers=h).json())==3
