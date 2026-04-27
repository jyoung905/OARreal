# Ontario Accident Review Lead Funnel Production Test

Use this after each deploy that touches intake, tracking, or routing.

## 1. Submit a fake lead from the public site

Open:

`https://www.ontarioaccidentreview.ca/#intake`

Use an obvious test lead:

- First name: `TEST DO NOT CONTACT`
- Phone or email: use a controlled inbox or `test+oar@example.com`
- City or region: `Toronto TEST`
- Accident date: any recent date
- Ontario accident: `Yes`
- Injured: `Yes`
- Main issue: `I am not sure what benefits apply`
- Message: `TEST LEAD. Please delete after verification.`

Expected user result:

- Form submits without error.
- User reaches `/thank-you`.
- Refreshing `/thank-you` should not fire another Google Ads conversion.

## 2. Confirm durable capture

Check Supabase table:

`public.intake_submissions`

Confirm a row exists with the test submission ID and raw submission. Delete the test row after verification if desired.

## 3. Confirm notifications

If configured, confirm:

- Telegram alert arrives.
- Email alert arrives.

Notification failure should not block the user if Supabase capture succeeded.

## 4. Confirm tracking

Use Google Tag Assistant during the test.

Expected:

- `generate_lead` fires only after successful submit and redirect to `/thank-you`.
- Google Ads conversion fires only after successful submit and redirect to `/thank-you`.
- Refreshing `/thank-you` does not fire a duplicate conversion.

## 5. Required production environment variables

Durable capture requires:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- optional `SUPABASE_INTAKE_TABLE`, defaults to `intake_submissions`

Optional notification alerts:

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

Tracking IDs currently in code:

- GA4: `G-BJN974S0MR`
- Google Ads: `AW-18043625605`
- Lead conversion: `AW-18043625605/HwLYCIypipAcEIXB75tD`
