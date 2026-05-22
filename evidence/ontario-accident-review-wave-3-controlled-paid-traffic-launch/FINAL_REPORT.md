# Wave 3 Final Report

## Verdict

PASS. Paid traffic verdict: GO.

## Production baseline

- Production URL: https://www.ontarioaccidentreview.ca
- Accepted commit at start: `9392bd1`
- Live deploy inspected: `dpl_2TzeRFo2bFFRJtZkfRYZLSYC1Fj7` / `https://oa-rreal-bbss-mnqugkc0p-jyoung905s-projects.vercel.app`
- Target/status: `production` / `READY`

## Exactly-one fake paid production lead

- Submitted: 1
- Submission id: redacted in reports; internal id retained in raw proof.
- Capture mode: full
- UTM persisted: `google / cpc / wave3_test / ontario_accident_benefits / control`
- Email notification: sent
- Telegram notification: sent
- Analytics rows stored: yes — cleanup deleted `20` Wave 3 analytics rows.

## Conversion counts

| State | generate_lead | Google Ads conversion |
|---|---:|---:|
| Preflight direct /thank-you | 0 | 0 |
| Preflight marker-seeded /thank-you | 1 | 1 |
| Preflight refresh | 0 | 0 |
| Final direct /thank-you paid URL | 0 | 0 |
| Final marker-gated paid lead | 1 | 1 |
| Final refresh | 0 | 0 |

## Cleanup

- Fake lead deleted: `1`
- Matching fake lead rows remaining: `0`
- Wave 3 analytics rows deleted: `20`
- Matching Wave 3 analytics rows remaining: `0`

## Required gates

- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm test`: PASS, 8/8
- `npm run build`: PASS
- production route smoke: PASS
- broken-link scan: PASS, checked=18 bad=0
- high/critical audit gate: PASS for high/critical; 2 moderate PostCSS/Next advisories remain
- secret scan: PASS, only env variable names/redacted placeholders found
- `/admin/analytics` unauthenticated: 404 PASS
- FSRA old slug redirect: 308 to LAT-AABS PASS
- `/api/track` logs clean: PASS, no matching missing-table/schema-cache error logs
- fake lead cleanup: PASS
- analytics cleanup: PASS

## Artifacts

- Paid launch checklist: `PAID_LAUNCH_CHECKLIST.md`
- Monitoring report: `MONITORING_REPORT.md`
- Copy sanity report: `COPY_SANITY_REPORT.md`
- Screenshots: `screenshots/`
- Raw proof: `raw/`

## Caveats

The first final proof harness run had a local variable bug after lead/conversion JSON was saved. The catch path cleaned up successfully. No second fake lead was submitted. The script was fixed before commit.
