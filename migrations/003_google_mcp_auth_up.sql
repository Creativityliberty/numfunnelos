-- PostgreSQL upgrade from NÜM Funnel OS v1.2 to v1.3.
-- Apply in staging first. This migration is additive and idempotent.
BEGIN;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS oauth_identities (
 id varchar(36) PRIMARY KEY, user_id varchar(36) NOT NULL REFERENCES users(id),
 provider varchar(32) NOT NULL, provider_subject varchar(200) NOT NULL,
 created_at timestamptz,
 CONSTRAINT uq_oauth_provider_subject UNIQUE(provider,provider_subject),
 CONSTRAINT uq_oauth_provider_user UNIQUE(provider,user_id)
);
CREATE INDEX IF NOT EXISTS ix_oauth_identities_user_id ON oauth_identities (user_id);
CREATE TABLE IF NOT EXISTS oauth_challenges (
 id varchar(36) PRIMARY KEY,nonce_hash varchar(64) NOT NULL UNIQUE,
 verifier_encrypted text NOT NULL,mode varchar(10) NOT NULL,
 user_id varchar(36),expires_unix integer NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_oauth_challenges_nonce_hash ON oauth_challenges (nonce_hash);
CREATE TABLE IF NOT EXISTS agent_access_tokens (
 id varchar(36) PRIMARY KEY, workspace_id varchar(36) NOT NULL REFERENCES workspaces(id),
 created_by varchar(36) NOT NULL REFERENCES users(id),
 token_hash varchar(64) NOT NULL UNIQUE,label varchar(100) NOT NULL,
 scopes json NOT NULL,expires_unix integer NOT NULL,revoked boolean NOT NULL DEFAULT false,
 created_at timestamptz
);
CREATE INDEX IF NOT EXISTS ix_agent_access_tokens_workspace_id ON agent_access_tokens (workspace_id);
CREATE INDEX IF NOT EXISTS ix_agent_access_tokens_token_hash ON agent_access_tokens (token_hash);
CREATE TABLE IF NOT EXISTS password_reset_tokens (
 id varchar(36) PRIMARY KEY,user_id varchar(36) NOT NULL REFERENCES users(id),
 token_hash varchar(64) NOT NULL UNIQUE,expires_unix integer NOT NULL,
 used boolean NOT NULL DEFAULT false, created_at timestamptz
);
CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_user_id ON password_reset_tokens (user_id);
CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_token_hash ON password_reset_tokens (token_hash);
COMMIT;
