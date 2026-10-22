# Architecture & Delivery Plan — NÜM Funnel OS

## Product boundary
`APP 7` is the first reusable funnel template. SaaS Workspaces can create more funnels based on it and manage a CRM, booking data, inbox drafts and event analytics from the same UI. The application is currently a local functional **vertical** rather than a complete multi-provider marketing automation product.

## Data ownership and invariants

- `User` ↔ `Membership` ↔ `Workspace`: membership check on each admin API request, role `owner/admin` for writes to funnels/connections.
- `Funnel` belongs to workspace. `slug` is globally unique; its only public read is a `FunnelVersion` snapshot when status `published`.
- `Contact` unique by `(workspace_id,email)` with current funnel for invitation token. Each `Submission` stores the exact version submitted.
- `Consent` append-only history, purposes `marketing` and `measurement`, with proof source and timestamp; token-authenticated revocation.
- `Event` generated only after a validated business event has been persisted in DB transaction. `event_id` can later be mapped 1:1 to ad delivery.
- `Booking` unique by `(workspace_id,slot)` and commit check; internal slots are Europe/Paris, stored UTC. No provider sync yet.
- `Integration` credentials encrypted at rest; `InboxMessage` event-id dedup for verified AgentMail inbound webhooks.
- `Outbox` modeled as schema but has no queue consumer yet.

## API contract (subset)

| Endpoint | Actor | Purpose |
|---|---|---|
| `GET /api/auth/me` | public/signed-in | current session and CSRF token |
| `POST /api/auth/register` / `login` / `logout` | public/session | auth lifecycle |
| `GET/POST /api/workspaces` | authenticated | tenant spaces |
| `GET/POST/PATCH /api/funnels` | workspace member | builder projects |
| `POST /api/funnels/{id}/publish` | workspace owner/admin | immutable publish |
| `GET /api/public/{slug}` | visitor | published snapshot |
| `POST /api/public/{slug}/leads` | visitor | persist contact+submission+consent+event |
| `POST /api/public/{slug}/applications` | visitor with lead token | project interest |
| `GET /api/public/{slug}/slots` | visitor | available local slots |
| `POST /api/public/{slug}/bookings` | visitor with lead token | confirmed booking+event |
| `POST /api/public/{slug}/consent/revoke` | visitor with lead token | append consent revocation |
| `GET/PATCH /api/contacts` | workspace | CRM |
| `GET /api/analytics`, `/api/analytics/timeseries`, `/api/events` | workspace | real metrics |
| `GET /api/inbox` / `POST /api/inbox/drafts` | workspace | drafts and inbound |
| `POST /api/inbox/drafts/{id}/send` | workspace owner/admin | explicit AgentMail send |
| `POST /api/webhooks/agentmail/{workspace_id}` | signed provider | inbound email events |
| `PUT /api/integrations/{provider}` | workspace owner/admin | secrets and connection options |

Authenticated write requests must include `X-CSRF-Token`; clients may include `X-Workspace-Id` but must possess a membership. Public forms do not use auth cookie and are tenant-resolved by published slug. `secret_encrypted` and lead tokens are never returned through the admin listing API.

## Development phases to reach genuine production completeness

1. Database migrations & durability: Alembic, backup/recovery, Postgres concurrency tests, Redis-based rate limiting/queues, audit/access logs.
2. True content builder: schema-validated blocks, preview token, drag-and-drop, revision diff, brand fonts, media object store, accessible semantic components.
3. AgentMail: pod provisioning per workspace, signed webhooks integration tests, bounce/deliverability/unsubscribe, template system, secure human approval, bounded agent actions.
4. Booking: Cal.com API bookings and webhooks verified; OAuth calendars, conflict handling, timezone management, cancellation/reschedule, buffers.
5. Ads integration: cookie consent manager, per-workspace OpenAI Pixel and CAPI, outbox retries, dedup, advanced matching with legal basis, provider SDK validation, UTM/oppref/obref contract, Meta/Google adapters.
6. Commerce: quote/offer models, payments with signed webhooks and idempotency, VAT/GDPR contracts, subscriptions, reports calculated on authoritative payment events.
7. SaaS platform: invites, roles, password reset, domain verification, quotas, billing per workspace, support and onboarding, observability, test/e2e CI.
8. Optional stack convergence: Laravel Sanctum + React/TypeScript per original blueprint; contract-test all existing URLs and migrations before replacement.

## Release gates

- No user credentials in JS, logs, URL or repository.
- No cross-workspace leakage, including event streams, exports, webhooks and media.
- No duplicate external conversion when Pixel and CAPI share an ID.
- No ad tracking after refusal or revocation.
- No email automation without verified consent, proper suppression and delivery policies.
- No external booking events counted as confirmed without an authoritative provider webhook.
- No claim about a payment, sale, revenue, AI reasoning, or published video unless actually verified.
- Production TLS, secure cookie, privacy pages, monitoring/alerts, backups, migration/rollback and incident process.
