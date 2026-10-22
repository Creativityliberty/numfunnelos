-- Apply only on an isolated InsForge DEV project. Never auto-run on BioDeck production.
-- The separate application PostgreSQL remains the source of truth.
CREATE TABLE IF NOT EXISTS public.num_funnel_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL,
    event_id uuid NOT NULL,
    funnel_id uuid,
    event_type text NOT NULL,
    occurred_at timestamptz NOT NULL,
    UNIQUE(workspace_id, event_id)
);
CREATE INDEX IF NOT EXISTS num_funnel_events_tenant_date_idx
    ON public.num_funnel_events(workspace_id, occurred_at DESC);
ALTER TABLE public.num_funnel_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.num_funnel_events FROM PUBLIC, anon, authenticated;
-- No client-facing grants/policies. Server admin credentials only.
