# Wave 3 Controlled Paid-Traffic Launch Checklist

## Campaign naming

- Google Ads campaign: `OAR | Search | Ontario Accident Benefits | Wave 3 | Controlled`
- Ad group pattern: `OAR | {theme} | {geo}`
- Do not create broad exploratory campaigns until first-lead tracking is verified.

## UTM naming

Required URL pattern:

`https://www.ontarioaccidentreview.ca/?utm_source=google&utm_medium=cpc&utm_campaign=wave3_test&utm_term={keyword_or_theme}&utm_content={ad_variant}`

Conventions:

- `utm_source=google`
- `utm_medium=cpc`
- `utm_campaign=wave3_test` for initial controlled test; use lowercase snake_case for later campaigns.
- `utm_term=` keyword/theme, lowercase snake_case.
- `utm_content=` ad/control variant, lowercase snake_case.

## Starting budget

Owner decision required: `$____ / day` for the initial controlled test.

Recommendation: start low enough that one bad day is acceptable, then wait for proof after the first real lead before scaling.

## Pause triggers

Pause immediately if any occur:

- First real lead arrives without UTM fields in Supabase.
- Email or Telegram notification missing for a captured lead.
- `/api/intake` returns 5xx or repeated 429 for normal users.
- `/api/track` logs Supabase schema/cache/missing-table errors.
- Direct `/thank-you` fires a conversion.
- Refresh duplicates conversions.
- More than one conversion fires for one lead.
- Lead quality is obviously unrelated for 2+ paid clicks/leads.
- Spend exceeds owner-approved daily cap.

## After first lead

Save:

- Google Ads click/ad details screenshot.
- Supabase redacted lead row with UTM fields.
- Vercel `/api/intake` log showing captureMode full + notifications sent.
- Browser/conversion proof if reproducible without extra fake submissions.
- Notification screenshot/redacted email/Telegram proof.

Check:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`.
- Lead row is full capture, not legacy fallback.
- Email + Telegram arrived.
- No `/api/track` errors.

## After first 24 hours

Review only operational readiness:

- Spend, clicks, CTR, CPC.
- Number of leads and obvious spam/unrelated leads.
- Notification reliability.
- Analytics event count.
- Any 4xx/5xx logs on intake/track/admin.

## What not to optimize yet

- Do not redesign homepage/intake.
- Do not rewrite legal copy unless compliance-blocking.
- Do not add new forms/CRM.
- Do not broaden match types or geos until tracking is verified with a real lead.
- Do not judge conversion rate from tiny sample size.

## Bad lead vs tracking failure

Bad lead indicators:

- UTM fields present, notifications sent, conversion fired once, but user is unqualified/unrelated.

Tracking failure indicators:

- Missing UTM fields, missing notifications, no analytics row, conversion 0 after confirmed capture, or duplicate conversion on refresh.
