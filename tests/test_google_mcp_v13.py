"""NÜM 1.3: Google InsForge PKCE and workspace MCP authorization regression tests."""
import os, time, json, pytest
from urllib.parse import parse_qs, urlparse
from sqlalchemy import select
from test_system import client, freshdb, bootstrap
from server.main import app
from server.db import SessionLocal
from server.models import OAuthChallenge, OAuthIdentity, Outbox, User, PasswordResetToken
from server.security import decrypt

def make_google(monkeypatch, email="google@sample.fr", subject="insforge-google-1"):
    async def authorization(challenge):
        assert len(challenge)>40
        return "https://accounts.google.com/o/oauth2/v2/auth?client_id=dummy"
    async def identity(code,verifier):
        assert len(verifier)>43
        return {"subject":subject,"email":email,"name":"Google Owner"}
    monkeypatch.setattr("server.main.oauth_authorization_url",authorization)
    monkeypatch.setattr("server.main.exchange_and_verify",identity)
    monkeypatch.setenv("INSFORGE_GOOGLE_AUTH_ENABLED","true")

def test_google_feature_flag_is_off_by_default(client,monkeypatch):
    monkeypatch.setenv("INSFORGE_GOOGLE_AUTH_ENABLED","false")
    assert client.get('/api/auth/insforge/google/start',follow_redirects=False).status_code==503

def test_google_new_login_and_linked_relogin(client,monkeypatch):
    make_google(monkeypatch)
    r=client.get('/api/auth/insforge/google/start',follow_redirects=False)
    assert r.status_code==302
    with SessionLocal() as db:
        challenge=db.scalar(select(OAuthChallenge))
        assert challenge and 'verifier_encrypted' not in client.cookies
        assert challenge.verifier_encrypted.startswith('gAAAA')
    r=client.get('/api/auth/insforge/callback?insforge_code=testcode',follow_redirects=False)
    assert r.status_code==303 and r.headers['location']=='/'
    me=client.get('/api/auth/me').json()
    assert me['user']['email']=='google@sample.fr' and len(me['workspaces'])==1
    client.post('/api/auth/logout',headers={'x-csrf-token':me['csrf']})
    r=client.get('/api/auth/insforge/google/start',follow_redirects=False)
    r=client.get('/api/auth/insforge/callback?insforge_code=testcode',follow_redirects=False)
    assert r.headers['location']=='/'
    assert len(client.get('/api/auth/me').json()['workspaces'])==1

def test_existing_email_requires_explicit_link(client,monkeypatch):
    h,fid=bootstrap(client,email='legacy@sample.fr')
    client.post('/api/auth/logout',headers=h)
    make_google(monkeypatch,email='legacy@sample.fr')
    client.get('/api/auth/insforge/google/start',follow_redirects=False)
    r=client.get('/api/auth/insforge/callback?insforge_code=x',follow_redirects=False)
    assert 'link_required' in r.headers['location']
    with SessionLocal() as db:
        assert not db.scalar(select(OAuthIdentity))
    # Authenticated local account can explicitly bind the same Google identity.
    csrf=client.get('/api/auth/me').json()['csrf']
    r=client.post('/api/auth/login',headers={'x-csrf-token':csrf},
                  json={'email':'legacy@sample.fr','password':'a-long-pass-123'})
    assert r.status_code==200
    r=client.get('/api/auth/insforge/google/start?mode=link',follow_redirects=False)
    assert r.status_code==302
    r=client.get('/api/auth/insforge/callback?insforge_code=x',follow_redirects=False)
    assert r.headers['location']=='/'
    assert client.get('/api/auth/insforge/linked').json()['google']

def test_google_cross_email_link_forbidden(client,monkeypatch):
    bootstrap(client,email='legacy@sample.fr')
    make_google(monkeypatch,email='other@sample.fr')
    client.get('/api/auth/insforge/google/start?mode=link',follow_redirects=False)
    r=client.get('/api/auth/insforge/callback?insforge_code=x',follow_redirects=False)
    assert 'google_email_mismatch' in r.headers['location']
    assert not client.get('/api/auth/insforge/linked').json()['google']

def test_google_expired_or_unsolicited_callback(client,monkeypatch):
    make_google(monkeypatch)
    r=client.get('/api/auth/insforge/callback?insforge_code=attacker',follow_redirects=False)
    assert 'oauth_expired' in r.headers['location']
    client.get('/api/auth/insforge/google/start',follow_redirects=False)
    with SessionLocal() as db:
        state=db.scalar(select(OAuthChallenge));state.expires_unix=0;db.commit()
    r=client.get('/api/auth/insforge/callback?insforge_code=code',follow_redirects=False)
    assert 'oauth_expired' in r.headers['location']

def test_mcp_token_scopes_revocation_and_tenant_isolation(client):
    h,fid=bootstrap(client,email='workspace1@sample.fr')
    invalid=client.post('/api/mcp/tokens',headers=h,
                        json={'label':'unsafe','scopes':['database:admin']})
    assert invalid.status_code==422
    r=client.post('/api/mcp/tokens',headers=h,
                  json={'label':'Codex local','scopes':['funnels:read','funnels:write']})
    assert r.status_code==201,r.text
    token=r.json()['token']
    assert token.startswith('num_mcp_')
    pat={'Authorization':'Bearer '+token}
    assert client.get('/api/agent/funnels',headers=pat).status_code==200
    assert client.get('/api/agent/funnels').status_code==401
    assert client.post('/api/agent/funnels',headers=pat,json={'name':'Créé par Codex','template':'app7'}).status_code==201
    assert client.post(f'/api/agent/funnels/{fid}/publish',headers=pat).status_code==403
    new_client=type(client)(app)
    try:
        new_client.__enter__()
        h2,fid2=bootstrap(new_client,email='workspace2@sample.fr',ws='Other Workspace')
        assert client.get(f'/api/agent/funnels/{fid2}',headers=pat).status_code==404
        assert client.patch(f'/api/agent/funnels/{fid2}',headers=pat,json={'name':'Intrusion'}).status_code==404
    finally:new_client.__exit__(None,None,None)
    assert all('token' not in e for e in client.get('/api/mcp/tokens',headers=h).json())
    assert client.delete('/api/mcp/tokens/'+r.json()['id'],headers=h).status_code==200
    assert client.get('/api/agent/funnels',headers=pat).status_code==401

def test_mcp_publish_explicit_scope(client):
    h,fid=bootstrap(client)
    token=client.post('/api/mcp/tokens',headers=h,json={
      'label':'Publish explicitly','scopes':['funnels:read','funnels:publish']}).json()['token']
    pat={'Authorization':'Bearer '+token}
    r=client.post(f'/api/agent/funnels/{fid}/publish',headers=pat)
    assert r.status_code==200 and r.json()['version']==1
    assert client.post('/api/agent/funnels',headers=pat,json={'name':'blocked'}).status_code==403

def test_password_reset_durable_and_old_sessions_revoked(client,monkeypatch):
    h,_=bootstrap(client,email='restore@sample.fr')
    monkeypatch.setenv("AUTH_MAIL_AGENTMAIL_API_KEY","dummy-env-not-real")
    monkeypatch.setenv("AUTH_MAIL_INBOX_ID","dummy-inbox")
    monkeypatch.setenv("PUBLIC_APP_URL","http://localhost:8080")
    r=client.post('/api/auth/password/forgot',headers=h,json={'email':'unknown@sample.fr'})
    assert r.status_code==202
    r=client.post('/api/auth/password/forgot',headers=h,json={'email':'restore@sample.fr'})
    assert r.status_code==202
    with SessionLocal() as db:
        out=db.scalar(select(Outbox).where(Outbox.provider=='auth_reset_mail'))
        assert out and out.payload.get('url_enc')
        link=decrypt(out.payload['url_enc'])
        token=parse_qs(urlparse(link).query)['reset_token'][0]
        assert token not in json.dumps(out.payload)
    r=client.post('/api/auth/password/reset',headers=h,json={'token':token,'password':'new-long-password'})
    assert r.status_code==200,r.text
    assert client.get('/api/funnels',headers=h).status_code==401
    csrf=client.get('/api/auth/me').json()['csrf']
    assert client.post('/api/auth/login',headers={'x-csrf-token':csrf},
                json={'email':'restore@sample.fr','password':'a-long-pass-123'}).status_code==401
    assert client.post('/api/auth/login',headers={'x-csrf-token':csrf},
                json={'email':'restore@sample.fr','password':'new-long-password'}).status_code==200
    me=client.get('/api/auth/me').json()
    assert client.post('/api/auth/password/reset',headers={'x-csrf-token':me['csrf']},
                       json={'token':token,'password':'another-password'}).status_code==400

def test_password_reset_unavailable_until_configured(client,monkeypatch):
    h,_=bootstrap(client)
    monkeypatch.delenv("AUTH_MAIL_AGENTMAIL_API_KEY",raising=False)
    assert client.post('/api/auth/password/forgot',headers=h,json={'email':'x@sample.fr'}).status_code==503
