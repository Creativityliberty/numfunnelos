-- NÜM Funnel OS v1.2: incremental addition; run on a DEV clone, with a backup.
-- Existing tables are left unchanged. For production adopt Alembic before launch.

CREATE TABLE IF NOT EXISTS assets (
	id VARCHAR(36) NOT NULL, 
	workspace_id VARCHAR(36) NOT NULL, 
	bucket VARCHAR(70) NOT NULL, 
	object_key VARCHAR(300) NOT NULL, 
	filename VARCHAR(200) NOT NULL, 
	mime_type VARCHAR(100) NOT NULL, 
	byte_count INTEGER NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(workspace_id) REFERENCES workspaces (id), 
	UNIQUE (object_key)
);

CREATE INDEX IF NOT EXISTS ix_assets_workspace_id ON assets (workspace_id);

CREATE TABLE IF NOT EXISTS cal_bookings (
	id VARCHAR(36) NOT NULL, 
	workspace_id VARCHAR(36) NOT NULL, 
	funnel_id VARCHAR(36) NOT NULL, 
	contact_id VARCHAR(36) NOT NULL, 
	provider_uid VARCHAR(160) NOT NULL, 
	slot VARCHAR(48) NOT NULL, 
	status VARCHAR(24) NOT NULL, 
	event_type_id INTEGER NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	UNIQUE (workspace_id, provider_uid), 
	FOREIGN KEY(workspace_id) REFERENCES workspaces (id), 
	FOREIGN KEY(funnel_id) REFERENCES funnels (id), 
	FOREIGN KEY(contact_id) REFERENCES contacts (id)
);

CREATE INDEX IF NOT EXISTS ix_cal_bookings_funnel_id ON cal_bookings (funnel_id);

CREATE INDEX IF NOT EXISTS ix_cal_bookings_workspace_id ON cal_bookings (workspace_id);

CREATE INDEX IF NOT EXISTS ix_cal_bookings_contact_id ON cal_bookings (contact_id);

CREATE TABLE IF NOT EXISTS automation_runs (
	id VARCHAR(36) NOT NULL, 
	workspace_id VARCHAR(36) NOT NULL, 
	automation_id VARCHAR(36) NOT NULL, 
	event_id VARCHAR(36) NOT NULL, 
	contact_id VARCHAR(36) NOT NULL, 
	state VARCHAR(24) NOT NULL, 
	attempts INTEGER NOT NULL, 
	next_attempt_at TIMESTAMP WITH TIME ZONE, 
	created_at TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	UNIQUE (automation_id, event_id), 
	FOREIGN KEY(workspace_id) REFERENCES workspaces (id), 
	FOREIGN KEY(automation_id) REFERENCES automations (id), 
	FOREIGN KEY(event_id) REFERENCES events (id), 
	FOREIGN KEY(contact_id) REFERENCES contacts (id)
);

CREATE INDEX IF NOT EXISTS ix_automation_runs_workspace_id ON automation_runs (workspace_id);
