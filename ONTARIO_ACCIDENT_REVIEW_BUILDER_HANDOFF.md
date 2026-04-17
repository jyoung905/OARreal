# Ontario Accident Review — Builder Handoff

Last updated: 2026-03-20

## 1) Product overview

**Brand:** Ontario Accident Review  
**Public role:** a simple first-step accident review service for Ontario accident situations  
**Not:** a law firm, legal clinic, or legal representation service  
**Core homepage line:** **Find out whether your Ontario accident may be worth pursuing**

### Product goal
The public site exists to help a visitor submit a calm, low-pressure first-stage review request after an Ontario accident. The internal team reviews that request, decides whether it appears worth pursuing, and may follow up.

### Public user promise
- The visitor can explain the basics of what happened.
- Ontario Accident Review will review whether the accident **may be worth pursuing**.
- If the request appears to fit review criteria, **a representative from Ontario Accident Review may contact them**.

### Internal operating reality
Internally this is a screening / intake / routing business that can prepare leads for referral partners. That reality should guide the internal workflow and architecture, but **public copy should stay careful** and should not read like an affiliate lead farm or imply that Ontario Accident Review itself is the law firm.

---

## 2) Locked positioning and copy guardrails

These are **non-optional** unless the owner explicitly changes them.

### Locked statements
- Brand name is **Ontario Accident Review**.
- Homepage headline stays: **Find out whether your Ontario accident may be worth pursuing**.
- Public-facing role is a **simple first-step review service**.
- Follow-up language must say that **a representative from Ontario Accident Review may contact them**.

### Must not imply
- that Ontario Accident Review is a law firm
- that submitting creates a solicitor-client / lawyer-client relationship
- that the visitor is guaranteed compensation, a lawsuit, a settlement, or representation
- that the site gives legal advice
- that Ontario Accident Review itself will personally litigate the matter

### Required tone
- calm
- professional
- simple
- low-pressure
- reassuring without being salesy

### Copy style to use
- “Start your review”
- “Tell us what happened”
- “A representative may contact you”
- “may be worth pursuing”
- “initial review request”
- “simple first step”

### Copy style to avoid
- “We are your lawyers”
- “Get maximum compensation”
- “You are entitled to money”
- “Sue now”
- “Instant case approval”
- “Free legal consultation” unless the owner explicitly approves that phrasing

### Public disclaimer baseline
The site must repeatedly and clearly state:
- Ontario Accident Review is **not a law firm**.
- It does **not provide legal advice or legal representation**.
- Submission is **only a request for an initial review**.
- Submission does **not create a lawyer-client relationship**.

---

## 3) V1 feature scope

### Public website
- Landing page with Ontario-focused positioning
- “How it works” section
- “Who this is for” section
- FAQ
- Privacy / disclaimer / contact pages
- 5-step intake form
- Submission confirmation state

### Intake flow behavior
- Multi-step form with progress indicator
- Front-end validation per step
- Server-side validation on submit
- No account creation
- No user login
- No save-and-resume in v1

### Intake submission handling
- Accept submission
- Sanitize fields
- Reject files/uploads
- Reject incomplete consent state
- Store the submission
- Score and bucket the submission for internal review
- Trigger notifications to configured channels

### Internal dashboard
- Password-gated internal dashboard
- Search and filter by status / bucket / text
- View full lead details
- Update status
- Add internal notes
- Set follow-up priority and due date
- Track requested documents manually without accepting uploads
- Track internal checklist items
- Mark sent to firm
- Export handoff summary as text / JSON / HTML

### Notifications
- Email alert per new submission
- Telegram alert per new submission
- If notifications fail, submission must still persist and remain reviewable

---

## 4) Exact v1 intake field schema

This section is intended to be implementation-ready.

## Submission object
Each submission should have:
- `id` — UUID
- `submitted_at` — ISO timestamp
- `source_page` — path or URL source
- `data` — visitor-provided intake fields
- `review` — scoring/bucketing metadata
- `delivery` — notification attempt results
- `dashboard` — internal workflow state (separate table/model in production)

## Public intake fields

| Field | Type | Required | Allowed values / format | Notes |
|---|---|---:|---|---|
| `fullName` | string | yes | max 120 | free text |
| `phone` | string | yes | max 40 | keep flexible; no strict formatting requirement in v1 |
| `email` | string | yes | valid email, max 200 | |
| `contactMethod` | enum | yes | `Phone`, `Email`, `Either` | |
| `bestTime` | enum | yes | `Morning`, `Afternoon`, `Evening`, `Anytime` | |
| `accidentType` | enum | yes | `Car accident`, `Truck accident`, `Motorcycle accident`, `Pedestrian accident`, `Bicycle accident`, `Slip and fall`, `Other` | |
| `accidentDate` | date string | yes | `YYYY-MM-DD` | allow approximate future enhancement later, not in v1 |
| `cityArea` | string | yes | max 120 | Ontario city/town/area |
| `inOntario` | enum | yes | `Yes`, `No` | |
| `accidentSummary` | text | yes | max 3000 | short narrative |
| `injured` | enum | yes | `Yes`, `No`, `Not sure` | |
| `medicalAttention` | enum | yes | `Yes`, `No`, `Not yet` | |
| `workImpact` | enum | yes | `Yes`, `No`, `Not sure` | |
| `ongoingSymptoms` | enum | yes | `Yes`, `No`, `Not sure` | |
| `injuryDetails` | text | no | max 1500 | |
| `spokenWithLawyer` | enum | yes | `Yes`, `No` | |
| `currentlyRepresented` | enum | yes | `Yes`, `No` | important routing flag |
| `thirdPartyInvolved` | enum | yes | `Yes`, `No`, `Not sure` | |
| `additionalNotes` | text | no | max 1500 | |
| `consentTruth` | boolean | yes | must be true | |
| `consentNotLawFirm` | boolean | yes | must be true | |
| `consentToContact` | boolean | yes | must be true | |
| `sourcePage` | string | system | max 200 | auto-set by frontend/backend |

### Explicitly excluded from v1 intake
Do **not** collect:
- insurance company name
- policy number
- claim number
- adjuster name/contact
- health card number
- driver’s licence number
- SIN
- banking info
- uploaded files
- photos/documents

### Recommended production validation rules
- Trim whitespace on all strings.
- Enforce max lengths.
- Enforce enum whitelist values.
- Require all required fields server-side even if client validation exists.
- Reject multipart file attachments and any upload payloads.
- Store the original IP hash / request metadata only if the builder decides it is needed for anti-spam; if added, document it in privacy copy.

---

## 5) Review scoring and bucketing model

Current prototype logic is acceptable for v1 and can be preserved in production.

### Current scoring inputs
Add points for:
- in Ontario
- injured
- received medical attention
- work/daily life impact
- ongoing symptoms
- third party involved
- has not spoken with lawyer
- not currently represented
- more detailed summary
- certain accident categories

Subtract points for:
- outside Ontario
- currently represented

### Current review buckets
- `High priority review`
- `Qualified review`
- `Manual review`
- `Low priority review`
- `Already represented / low priority`
- `Outside Ontario / low priority`

### Builder note
Keep this scoring **internal only**. Do not expose score or bucket publicly.

---

## 6) Dashboard / admin workflow model

The dashboard is an internal review queue, not a CRM replacement.

### Statuses
Use these exact v1 statuses:
- `new`
- `reviewing`
- `need docs / follow-up`
- `good fit`
- `ready to hand off`
- `sent to firm`
- `not a fit`
- `duplicate`
- `spam`
- `closed`

### Follow-up priority values
- `today`
- `this week`
- `watch`
- `none`

### Requested doc tracking options
These are internal checkboxes / tags only, not public uploads:
- `Accident report`
- `Photos`
- `Medical records`
- `Accident benefits denial letter`
- `Employer / income note`
- `Witness details`
- `Other timeline details`

Support custom requested docs as free-text tags too.

### Internal checklist fields
- `conflictCheck`
- `docsRequested`
- `clientFollowUpSent`
- `summaryReady`
- `referralReady`

### Per-lead workflow fields
- `status`
- `notes`
- `followUpPriority`
- `followUpOn`
- `followUpNote`
- `requestedDocs[]`
- `customRequestedDocs[]`
- `lastContactedAt`
- `sentToFirmAt`
- `updatedAt`
- `checklist` object

### Expected operator workflow
1. New lead arrives and triggers notifications.
2. Operator opens dashboard and reviews submission.
3. Operator sets status to `reviewing`.
4. Operator decides if more information is needed and tracks requested docs manually.
5. Operator adds notes and follow-up timing.
6. If lead looks promising, operator moves to `good fit` then `ready to hand off`.
7. Once handed onward, operator uses `sent to firm` and timestamps the event.
8. Leads that are unsuitable, duplicated, represented, or spam are closed accordingly.

### Exports
Builder should preserve export capability for:
- text summary
- JSON payload
- printer-friendly / HTML summary

This matters because the operator may want a quick handoff package without opening the full dashboard.

---

## 7) Legal / disclaimer requirements

These should be visible in multiple places, not hidden only in footer copy.

### Required public disclosures
- Ontario Accident Review is not a law firm.
- Ontario Accident Review does not provide legal advice.
- Ontario Accident Review does not provide legal representation.
- Submitting information is only a request for an initial review.
- Submission does not create a lawyer-client relationship.
- Follow-up is not guaranteed.
- A representative from Ontario Accident Review may contact the person if the submission appears to fit review criteria.

### Required consent language in intake
The user must affirm:
- the information is true to the best of their knowledge
- they understand Ontario Accident Review is not a law firm and does not provide legal advice or representation
- they consent to being contacted about their review request

### Privacy posture for v1
Because v1 intentionally avoids uploads and insurance data, keep copy simple but accurate:
- explain what information is collected
- explain why it is collected
- explain that it may be reviewed internally to assess the request and contact the person
- explain that data may be shared onward where appropriate as part of follow-up / referral handling, but only after the operator decides it is appropriate and subject to the final legal wording the owner approves

### Important implementation note
Final public privacy/disclaimer pages should include the **real operating entity name and contact details** before launch.

---

## 8) Routing and notification expectations

### Submission routing
- Every valid submission should create a persistent record first.
- Notifications should happen after persistence or in a safe async job path that cannot lose the record.
- Notification failure must not block storage.

### Email notification expectation
Send a full internal summary to the configured destination.

Minimum content:
- lead ID
- submitted timestamp
- review bucket
- score
- contact details
- accident details
- narrative summary
- injury/impact answers
- represented / spoken-with-lawyer flags
- source page

### Telegram notification expectation
Send a concise triage alert containing:
- review bucket
- score
- name
- phone
- email
- accident type
- city/area
- Ontario flag
- injury/impact highlights
- short summary

### Internal handoff expectation
The internal workflow should support onward referral handling, but the public UI should not describe the downstream relationship in detail.

---

## 9) Explicit out-of-scope list for v1

Do **not** add these in v1 unless the owner explicitly approves a scope change:
- uploads / documents / photos from the public user
- insurance detail collection
- payment handling
- live chat
- SMS automation
- client portal
- user accounts
- save-and-resume intake
- e-signatures
- detailed conflict checking workflow beyond a simple internal checkbox
- calendaring / booking flow
- direct firm routing exposed in public copy
- public case-status tracking
- multilingual support
- complex marketing automation / drip campaigns
- analytics-heavy ad stack beyond basic privacy-conscious analytics

---

## 10) Build acceptance criteria

A builder is done with v1 when:
- the public site retains the current positioning guardrails
- the intake matches the schema above
- uploads are impossible in the public flow
- insurance details are not requested anywhere in the public flow
- the dashboard supports the exact workflow fields above
- submissions persist reliably in production storage
- alerts send by email and Telegram
- legal/disclaimer language is present in the public UX
- the system is deployable on Vercel with persistent backend services

---

## 11) Truly important open questions

Only a few items still need owner confirmation before production launch:
1. **Final legal entity name and mailing/contact details** for privacy/disclaimer/contact pages.
2. **Who can access the private dashboard** and whether there will be one operator or multiple named users.
3. **Whether onward partner handoff events need a partner identifier** in the database in v1, or if simple `sent to firm` logging is enough for launch.

If those are not answered immediately, the builder can still implement almost everything else.
