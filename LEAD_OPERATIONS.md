# Ontario Accident Review Lead Operations

## Durable lead storage

Every successful intake submission must be stored in Supabase before the API returns success.

Table:

`public.intake_submissions`

Apply the migration before deploying this sprint:

`supabase/migrations/20260427_lead_quality_tracking.sql`

## Lead statuses

Allowed statuses:

- `new`
- `contacted`
- `unreachable`
- `unqualified`
- `qualified`
- `referred`
- `accepted_by_partner`
- `rejected_by_partner`
- `spam`
- `test`

Default status is `new`.

Obvious test submissions are stored with status `test`, including examples like first name `Test`, `TEST DO NOT CONTACT`, or email containing `test@example.com`.

## Paid traffic attribution

The intake form captures and preserves these values in `sessionStorage` when present on the landing URL:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `gclid`
- `fbclid`

The form also submits:

- landing page URL
- referrer
- user agent

The API adds:

- `ip_hash`, generated server-side from IP and `IP_HASH_SALT` if set. If `IP_HASH_SALT` is not set, it falls back to the Supabase service role key as salt. Raw IP is not stored.

## Viewing leads safely

Preferred safe method for now: Supabase dashboard.

Go to Supabase → Table Editor → `intake_submissions`.

Useful columns for review:

- `submitted_at`
- `status`
- `first_name`
- `phone_or_email`
- `city_region`
- `accident_date`
- `accident_type`
- `happened_in_ontario`
- `injured`
- `main_issue`
- `needs_treatment_coverage`
- `missing_work`
- `short_message`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `gclid`
- `landing_page_url`

Do not expose a public leads admin page unless proper authentication is added.

## Marking lead quality

Update the `status` column in Supabase Table Editor.

Examples:

```sql
update public.intake_submissions
set status = 'qualified'
where id = 'SUBMISSION_UUID';

update public.intake_submissions
set status = 'test'
where id = 'SUBMISSION_UUID';

update public.intake_submissions
set status = 'unqualified'
where id = 'SUBMISSION_UUID';
```

## Conversion tracking and test leads

The form redirects to `/thank-you` after durable capture succeeds.

Google Ads and GA4 conversion events only fire if the form saved a session success marker.

For test leads, the API returns `testLead: true`, the form does not save the conversion marker, and `/thank-you` does not fire the Google Ads conversion.

Refreshing `/thank-you` also does not fire duplicate conversion events because the marker is removed after first use.

## Required Vercel environment variables

Durable capture:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- optional `SUPABASE_INTAKE_TABLE`, defaults to `intake_submissions`
- recommended `IP_HASH_SALT`

Optional alerts:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`
- `SMTP_EHLO_NAME`
- `LEAD_ALERT_EMAIL_TO`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
