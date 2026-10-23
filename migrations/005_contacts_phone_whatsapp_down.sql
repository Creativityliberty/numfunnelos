-- PostgreSQL rollback for Contacts Phone & WhatsApp Support
BEGIN;

DROP INDEX IF EXISTS ix_contacts_phone;
ALTER TABLE IF EXISTS contacts DROP COLUMN IF EXISTS phone;

COMMIT;
