# Wave 3 Monitoring Report

- Last production proof timestamp: 2026-05-22T20:48Z
- Production URL: https://www.ontarioaccidentreview.ca
- Supabase project/table: `cxwcsyiadjwizofvqopg` / `public.intake_submissions`
- Analytics table: `public.analytics_events`

## Leads by source / campaign

```json
{
  "(none) / (none)": 5
}
```

Note: Wave 3 fake paid lead was cleaned, so it is not present in current lead counts. UTM persistence proof is in `raw/final-lead-capture.json`.

## Analytics events by event / campaign

```json
{
  "confirmation_page_view / (none)": 8,
  "intake_start / (none)": 2,
  "intake_step_view / (none)": 1,
  "cta_click / (none)": 1
}
```

Wave 3 test analytics rows were cleaned after proof; cleanup deleted `20` Wave 3 rows and verified `0` remaining.

## Conversion proof

| State | generate_lead | conversion |
|---|---:|---:|
| Direct /thank-you | 0 | 0 |
| Marker-gated paid lead | 1 | 1 |
| Refresh | 0 | 0 |

## Known caveats

- Moderate Next/PostCSS audit advisory remains documented; no high/critical audit failure.
- Vercel deployment metadata for CLI deploys does not include git SHA, but accepted production deploy is inspected and current source commit is recorded.
- One Wave 3 proof harness bug occurred after proof capture; cleanup still executed. Script has been fixed and no second fake lead was submitted.
