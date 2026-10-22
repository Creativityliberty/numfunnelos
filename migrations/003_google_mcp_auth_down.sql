-- Destructive rollback: review and back up data before executing.
BEGIN;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS agent_access_tokens;
DROP TABLE IF EXISTS oauth_challenges;
DROP TABLE IF EXISTS oauth_identities;
-- Intentionally retain users.session_version: dropping it would weaken session revocation.
COMMIT;
