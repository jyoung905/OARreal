# Ontario Accident Review

Next.js App Router build for **Ontario Accident Review**.

This version keeps the existing landing-page structure and intake UX intact, while upgrading submission persistence from a local JSONL file to **Supabase** so the app can be deployed on **Vercel** without relying on the ephemeral filesystem.

## Product constraints preserved
- Ontario Accident Review is **not a law firm**
- public-facing follow-up is from a representative of Ontario Accident Review
- **no insurance-detail collection in v1**
- **no uploads in v1**

## What’s included
- `app/` — App Router pages and API route
- `components/` — reusable UI sections used by the landing page
- `app/api/intake/route.js` — intake submission endpoint
- `lib/intake.js` — validation, scoring, and Supabase insert mapping
- `lib/supabase-server.js` — server-only Supabase admin client helper
- `supabase/schema.sql` — SQL to create the intake submissions table quickly

## Run locally
```bash
cd /Users/jamesyoung/.openclaw/workspace/ontario-accident-review-launch
npm install
npm run dev
```

Open `http://localhost:3000`

## Required environment variables
Create a local `.env.local` (or set these in Vercel project settings):

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=replace-with-your-service-role-key
SUPABASE_INTAKE_TABLE=intake_submissions
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` is required because inserts happen server-side in the Next.js route.
- Do **not** expose the service role key to the browser.
- `SUPABASE_INTAKE_TABLE` is optional; if omitted, the app defaults to `intake_submissions`.

## Supabase setup
1. Create a Supabase project.
2. In the Supabase SQL editor, run `supabase/schema.sql`.
3. Copy your project URL and service role key into local env vars / Vercel env vars.
4. Deploy the Next.js app.

### Table created by `supabase/schema.sql`
The schema stores:
- contact and intake answers
- review score and review bucket
- source page
- a `raw_submission` JSONB copy of the full sanitized payload for easy inspection/export

It does **not** add insurance fields or uploads.

## Intake flow
The public intake UX is unchanged. The route still:
1. validates the submitted payload
2. calculates the review score / bucket
3. stores the submission
4. returns a success response to the existing form

The only storage change is that submissions now insert into Supabase instead of appending to `data/submissions.jsonl`.

## Production build
```bash
npm run build
npm start
```

## Vercel deployment
This app is structured for normal Next.js/Vercel deployment:
- standard `package.json`
- App Router `app/` directory
- server route at `app/api/intake/route.js`
- Supabase-backed persistence instead of local filesystem writes

Set these env vars in Vercel before shipping:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- optionally `SUPABASE_INTAKE_TABLE`

## Dashboard / legacy prototype scope
There are still **legacy prototype files** in the repo (`server.js`, `dashboard.html`, `dashboard.js`, local `data/*` files, older handoff docs).

Those files are **not part of the active Next.js app** and were **not** migrated into a Supabase-backed authenticated dashboard in this pass.

Current scope of this migration:
- ✅ active Next.js intake persistence migrated to Supabase
- ✅ Vercel-safe storage path for new submissions
- ✅ exact schema/setup steps included
- ❌ legacy standalone dashboard prototype not ported to Next.js/Supabase yet
- ❌ legacy local JSON dashboard state not used by the active app

If the dashboard needs to be revived for production, it should be rebuilt against the same Supabase project with proper auth rather than relying on the old local JSON files.

## Notes
Legacy static files (`index.html`, `styles.css`, `script.js`, `server.js`, dashboard files) are still present as historical/source material, but the Next.js app under `app/` is the active implementation.
