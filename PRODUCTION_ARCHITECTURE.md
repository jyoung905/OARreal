# Ontario Accident Review — Production Architecture Recommendation

Last updated: 2026-03-20

## Recommended stack

**Preferred stack:**
- **Vercel** — frontend hosting + serverless routes
- **Supabase** — Postgres database, auth, row-level security, optional storage later
- **Resend** — transactional email alerts
- **Telegram Bot API** — immediate operator alerts

This is the cleanest upgrade path from the current static/Node prototype.

---

## 1) Why this stack

### Vercel
Good fit for:
- static marketing site
- Next.js or static frontend deployment
- serverless intake endpoints
- preview deployments for copy/design review
- simple env var management

### Supabase
Good fit for:
- persistent relational storage instead of JSON files
- easy Postgres access from Vercel server functions
- dashboard auth for internal users
- structured querying for status queues, follow-up dates, exports
- future expansion if uploads or audit trails are added later

### Resend
Good fit for:
- simpler and more reliable transactional email than raw SMTP setup
- fast setup for lead alerts
- easier templates and sender management
- better fit for Vercel/serverless than hand-rolled SMTP socket code

### Telegram
Good fit for:
- immediate triage alerts
- already desired by owner
- low-cost and simple operational channel

### Why not keep the current JSON-file approach
Because Vercel filesystem is ephemeral. Local files like:
- `data/submissions.jsonl`
- `data/lead-dashboard-state.json`

will not behave like persistent storage in production.

---

## 2) Recommended production app shape

## Frontend
Use either:
- **Next.js on Vercel** for the full app, recommended
- or keep static pages and move just API routes into Vercel functions

**Recommendation:** migrate to **Next.js App Router** so public pages and internal dashboard can live in one repo with shared validation and database access.

## Backend surface
### Public routes
- `GET /` — homepage
- `GET /privacy`
- `GET /disclaimer`
- `GET /contact`
- `POST /api/intake` — create new review request

### Private routes
- `POST /api/admin/login` if using custom auth, or Supabase Auth
- `GET /api/admin/leads`
- `GET /api/admin/leads/:id`
- `PATCH /api/admin/leads/:id`
- `POST /api/admin/leads/:id/mark-sent`
- `GET /api/admin/leads/:id/export.txt`
- `GET /api/admin/leads/:id/export.json`
- `GET /api/admin/leads/:id/export.html`

---

## 3) Database schema outline

Use Postgres with separate tables for submissions, workflow, notes/audit, and optional notifications.

## Core table: `intake_submissions`

Purpose: immutable-ish record of what the visitor submitted.

Suggested columns:
- `id uuid primary key default gen_random_uuid()`
- `created_at timestamptz not null default now()`
- `source_page text`
- `full_name text not null`
- `phone text not null`
- `email text not null`
- `contact_method text not null`
- `best_time text not null`
- `accident_type text not null`
- `accident_date date not null`
- `city_area text not null`
- `in_ontario text not null`
- `accident_summary text not null`
- `injured text not null`
- `medical_attention text not null`
- `work_impact text not null`
- `ongoing_symptoms text not null`
- `injury_details text`
- `spoken_with_lawyer text not null`
- `currently_represented text not null`
- `third_party_involved text not null`
- `additional_notes text`
- `consent_truth boolean not null`
- `consent_not_law_firm boolean not null`
- `consent_to_contact boolean not null`
- `review_score integer not null`
- `review_bucket text not null`
- `spam_flag boolean not null default false`
- `ip_hash text` nullable if used
- `user_agent text` nullable if used
- `referrer text` nullable if used

### Suggested indexes
- `created_at desc`
- `review_bucket`
- `currently_represented`
- full-text or trigram search on name/email/phone/city/summary if needed

## Workflow table: `lead_workflow`

Purpose: mutable internal review state, separate from original intake.

Suggested columns:
- `submission_id uuid primary key references intake_submissions(id) on delete cascade`
- `status text not null default 'new'`
- `follow_up_priority text not null default 'none'`
- `follow_up_on date`
- `follow_up_note text`
- `notes text`
- `requested_docs text[] not null default '{}'`
- `custom_requested_docs text[] not null default '{}'`
- `last_contacted_at timestamptz`
- `sent_to_firm_at timestamptz`
- `conflict_check boolean not null default false`
- `docs_requested boolean not null default false`
- `client_follow_up_sent boolean not null default false`
- `summary_ready boolean not null default false`
- `referral_ready boolean not null default false`
- `updated_at timestamptz not null default now()`
- `updated_by uuid` nullable if using auth users

## Internal table: `lead_notifications`

Purpose: audit notification attempts.

Suggested columns:
- `id uuid primary key default gen_random_uuid()`
- `submission_id uuid references intake_submissions(id) on delete cascade`
- `channel text not null` -- email / telegram
- `destination text`
- `status text not null` -- queued / sent / failed / skipped
- `provider_message_id text`
- `error_message text`
- `created_at timestamptz not null default now()`

## Optional table: `lead_activity_log`

Purpose: audit trail for admin changes.

Suggested columns:
- `id uuid primary key default gen_random_uuid()`
- `submission_id uuid references intake_submissions(id) on delete cascade`
- `actor_user_id uuid`
- `event_type text not null`
- `payload jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`

## Optional table: `partner_handoffs`

Only add if v1 needs structured partner tracking.

Suggested columns:
- `id uuid primary key default gen_random_uuid()`
- `submission_id uuid references intake_submissions(id) on delete cascade`
- `partner_label text not null`
- `sent_at timestamptz not null default now()`
- `notes text`

If the owner does not need partner-level reporting yet, skip this and just use `sent_to_firm_at`.

---

## 4) Auth recommendation

### Best practical choice
Use **Supabase Auth** for the internal dashboard.

Why:
- more production-safe than the current in-memory password session
- supports multiple operators later
- easy middleware/session handling in Next.js
- avoids storing a shared static dashboard password forever

### Minimum fallback if auth must stay lightweight
If the owner insists on a single shared password:
- keep dashboard behind Vercel auth middleware or IP restrictions if possible
- use a hashed password in env
- use signed, httpOnly, secure cookies
- enforce server-side session expiry

Still, Supabase Auth is the better production answer.

---

## 5) Validation and security notes

### Server-side validation
Use a shared schema library such as **Zod**.

Validate:
- required fields
- enum values
- max lengths
- email format
- boolean consents
- reject uploads and insurance fields

### Anti-spam / abuse protection
Recommended for production:
- honeypot field
- basic rate limiting per IP
- optional Turnstile if spam appears
- audit logs for repeated failures

### Sensitive-data posture
V1 intentionally avoids more sensitive categories, which is good. Keep it that way.

Do not add:
- insurance identifiers
- government ID numbers
- file uploads
without a deliberate privacy/security redesign.

---

## 6) Environment variable list

### Public app
- `NEXT_PUBLIC_SITE_URL` — canonical site URL
- `APP_NAME` — `Ontario Accident Review`

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL` or standard Postgres connection string if builder prefers direct SQL access

### Resend
- `RESEND_API_KEY`
- `LEAD_ALERT_EMAIL_TO`
- `LEAD_FROM_EMAIL` — verified sender, e.g. `alerts@domain.com`
- `LEAD_FROM_NAME` — `Ontario Accident Review`

### Telegram
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- optional `TELEGRAM_API_BASE`

### Admin / auth
If using Supabase Auth, no shared dashboard password env is required.

If using fallback shared-password auth, then add:
- `DASHBOARD_PASSWORD_HASH`
- `SESSION_SECRET`

### Optional ops / anti-spam
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `RATE_LIMIT_KV_REST_API_URL` / provider-specific vars if using Upstash Redis

---

## 7) Notification flow recommendation

### On intake submission
1. Validate payload.
2. Compute score and bucket.
3. Insert into `intake_submissions`.
4. Insert default row into `lead_workflow`.
5. Trigger email + Telegram notifications.
6. Record notification results in `lead_notifications`.
7. Return success to user.

### Important reliability rule
The submission database insert must complete **before** external notifications are attempted, or notifications must be retried asynchronously from a persisted job. Do not risk losing leads because Resend or Telegram blips.

---

## 8) Deployment flow

## Recommended deployment sequence
1. Builder ports frontend to Next.js on Vercel.
2. Builder creates Supabase project.
3. Builder runs SQL migrations for tables and indexes.
4. Builder configures env vars in Vercel.
5. Builder wires `POST /api/intake` to Supabase.
6. Builder wires internal dashboard data routes to Supabase.
7. Builder integrates Resend for alert email.
8. Builder integrates Telegram alerts.
9. Builder implements dashboard auth.
10. Builder tests full flow in Vercel preview.
11. Builder launches production after legal entity details are inserted on public pages.

### Vercel previews
Use preview deployments for:
- copy review
- styling review
- intake smoke testing against staging Supabase

Use separate staging and production Supabase projects if the builder wants cleaner isolation.

---

## 9) Migration notes from the current JSON prototype

## Current prototype storage
- submissions are appended to `data/submissions.jsonl`
- dashboard workflow state lives in `data/lead-dashboard-state.json`

## Migration approach
Write a one-time migration script that:
1. reads JSONL submission records
2. reads dashboard state JSON
3. joins records on submission ID
4. inserts each submission into `intake_submissions`
5. inserts related workflow into `lead_workflow`
6. optionally inserts historical notification summary rows if desired

### Field mapping
#### `submissions.jsonl` -> `intake_submissions`
- `submittedAt` -> `created_at`
- `id` -> `id`
- `data.fullName` -> `full_name`
- `data.phone` -> `phone`
- `data.email` -> `email`
- `data.contactMethod` -> `contact_method`
- `data.bestTime` -> `best_time`
- `data.accidentType` -> `accident_type`
- `data.accidentDate` -> `accident_date`
- `data.cityArea` -> `city_area`
- `data.inOntario` -> `in_ontario`
- `data.accidentSummary` -> `accident_summary`
- `data.injured` -> `injured`
- `data.medicalAttention` -> `medical_attention`
- `data.workImpact` -> `work_impact`
- `data.ongoingSymptoms` -> `ongoing_symptoms`
- `data.injuryDetails` -> `injury_details`
- `data.spokenWithLawyer` -> `spoken_with_lawyer`
- `data.currentlyRepresented` -> `currently_represented`
- `data.thirdPartyInvolved` -> `third_party_involved`
- `data.additionalNotes` -> `additional_notes`
- `data.consentTruth` -> `consent_truth`
- `data.consentNotLawFirm` -> `consent_not_law_firm`
- `data.consentToContact` -> `consent_to_contact`
- `data.sourcePage` -> `source_page`
- `review.score` -> `review_score`
- `review.bucket` -> `review_bucket`

#### `lead-dashboard-state.json` -> `lead_workflow`
For each `leads[submissionId]` record:
- `status` -> `status`
- `notes` -> `notes`
- `followUpPriority` -> `follow_up_priority`
- `followUpOn` -> `follow_up_on`
- `followUpNote` -> `follow_up_note`
- `requestedDocs` -> `requested_docs`
- `customRequestedDocs` -> `custom_requested_docs`
- `lastContactedAt` -> `last_contacted_at`
- `sentToFirmAt` -> `sent_to_firm_at`
- `checklist.conflictCheck` -> `conflict_check`
- `checklist.docsRequested` -> `docs_requested`
- `checklist.clientFollowUpSent` -> `client_follow_up_sent`
- `checklist.summaryReady` -> `summary_ready`
- `checklist.referralReady` -> `referral_ready`
- `updatedAt` -> `updated_at`

### Defaulting rules during migration
If a submission has no dashboard state row:
- create a default workflow row
- default `status` to `not a fit` if `currently_represented = Yes`
- otherwise default `status` to `new`
- default `follow_up_priority` to `none`

### Cutover strategy
- freeze old intake briefly
- export JSON prototype data
- run migration script into production DB
- verify counts and a few spot-check records
- switch production intake endpoint to the new app
- archive old JSON files outside the public app path

---

## 10) Recommended file structure for the rebuilt app

```txt
app/
  page.tsx
  privacy/page.tsx
  disclaimer/page.tsx
  contact/page.tsx
  dashboard/page.tsx
  api/
    intake/route.ts
    admin/
      leads/route.ts
      leads/[id]/route.ts
      leads/[id]/mark-sent/route.ts
      leads/[id]/export.txt/route.ts
      leads/[id]/export.json/route.ts
      leads/[id]/export.html/route.ts
lib/
  db.ts
  auth.ts
  intake-schema.ts
  lead-scoring.ts
  notifications/
    resend.ts
    telegram.ts
  exports/
    lead-summary.ts
supabase/
  migrations/
```

---

## 11) Builder recommendation summary

If this is being productionized now, the builder should do this:
- rebuild or port the app to Next.js on Vercel
- use Supabase Postgres as the source of truth
- use Supabase Auth for dashboard access
- use Resend for email alerts
- use Telegram for operator alerts
- preserve the current intake schema and public positioning
- keep uploads and insurance details out of scope for v1

That stack is fast to ship, operationally sane, and directly solves the current prototype’s biggest problem: non-persistent file storage.
