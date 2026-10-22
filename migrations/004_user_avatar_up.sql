-- PostgreSQL upgrade for User Avatar support in NÜM Funnel OS v1.4
BEGIN;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
COMMIT;
