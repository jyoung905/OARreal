# Ontario Accident Review — Vercel Handoff Note

## What is already aligned
- Brand is **Ontario Accident Review**
- Public copy does **not** present the business as a law firm
- Homepage line is locked to: **Find out whether your Ontario accident may be worth pursuing**
- Public follow-up is described as coming from a representative of Ontario Accident Review
- v1 intake does **not** collect insurance details
- v1 intake does **not** allow uploads
- Dashboard statuses and labels are aligned to an intake-first review workflow

## Biggest deployment caveat
The app currently stores data in local files:
- `data/submissions.jsonl`
- `data/lead-dashboard-state.json`

That is fine for local use and handoff review, but it is **not a real Vercel persistence plan**.

## Recommended real deployment shape
### Public site on Vercel
Good fit for:
- static pages
- front-end intake flow
- serverless intake endpoint only if it writes to persistent storage

### Persistent storage/backend required
Replace local files with one of:
- Supabase
- Neon / Postgres
- Railway Postgres
- Firebase / Firestore
- another private backend the operator controls

### Private dashboard
Best options:
1. Keep the dashboard off Vercel and run it on a private backend with proper auth
2. Or deploy it separately with real authentication and database-backed state

## Minimum launch edits still needed by owner
- insert final contact email/phone/hours in `contact.html`
- insert final legal entity / operator details in `privacy.html` and `disclaimer.html`
- set production secrets
- choose persistent storage
- decide final alert routing for email / Telegram in production

## Suggested next implementation step
If the next builder is taking this to production, the first technical task should be:

1. replace local JSONL / JSON dashboard state with Postgres or Supabase
2. keep the public pages and intake fields mostly as-is
3. port the current `POST /api/intake` logic to persistent storage
4. port dashboard updates and export routes to the same backend
5. add proper auth for the dashboard

## Local verification commands
```bash
node server.js
open http://localhost:8080
open http://localhost:8080/dashboard
```

Example intake POST:
```bash
curl -i -X POST http://localhost:8080/api/intake \
  -F 'fullName=Test Person' \
  -F 'phone=416-555-0199' \
  -F 'email=test@example.com' \
  -F 'contactMethod=Email' \
  -F 'bestTime=Afternoon' \
  -F 'accidentType=Car accident' \
  -F 'accidentDate=2026-03-01' \
  -F 'cityArea=Toronto' \
  -F 'inOntario=Yes' \
  -F 'accidentSummary=Rear-end collision with ongoing pain and missed work.' \
  -F 'injured=Yes' \
  -F 'medicalAttention=Yes' \
  -F 'workImpact=Yes' \
  -F 'ongoingSymptoms=Yes' \
  -F 'injuryDetails=Neck and back pain.' \
  -F 'spokenWithLawyer=No' \
  -F 'currentlyRepresented=No' \
  -F 'thirdPartyInvolved=Yes' \
  -F 'consentTruth=on' \
  -F 'consentNotLawFirm=on' \
  -F 'consentToContact=on'
```
