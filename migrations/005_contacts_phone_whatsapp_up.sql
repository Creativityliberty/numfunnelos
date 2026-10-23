-- PostgreSQL upgrade for Contacts Phone & WhatsApp Support in NÜM Funnel OS
BEGIN;

ALTER TABLE IF EXISTS contacts ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE IF EXISTS contacts ALTER COLUMN email DROP NOT NULL;

-- Index phone per workspace for fast lookup
CREATE INDEX IF NOT EXISTS ix_contacts_phone ON contacts (workspace_id, phone);

COMMIT;
