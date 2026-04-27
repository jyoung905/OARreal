-- Ontario Accident Review lead quality and paid-traffic attribution fields
-- Safe to run more than once.

alter table public.intake_submissions
  add column if not exists first_name text,
  add column if not exists phone_or_email text,
  add column if not exists city_region text,
  add column if not exists happened_in_ontario text,
  add column if not exists main_issue text,
  add column if not exists needs_treatment_coverage text,
  add column if not exists missing_work text,
  add column if not exists short_message text,
  add column if not exists best_time_to_reach text,
  add column if not exists landing_page_url text,
  add column if not exists referrer text,
  add column if not exists user_agent text,
  add column if not exists ip_hash text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term text,
  add column if not exists utm_content text,
  add column if not exists gclid text,
  add column if not exists fbclid text,
  add column if not exists status text not null default 'new';

alter table public.intake_submissions
  drop constraint if exists intake_submissions_status_check;

alter table public.intake_submissions
  add constraint intake_submissions_status_check
  check (status in (
    'new',
    'contacted',
    'unreachable',
    'unqualified',
    'qualified',
    'referred',
    'accepted_by_partner',
    'rejected_by_partner',
    'spam',
    'test'
  ));

create index if not exists intake_submissions_status_idx
  on public.intake_submissions (status);

create index if not exists intake_submissions_campaign_idx
  on public.intake_submissions (utm_source, utm_medium, utm_campaign);

create index if not exists intake_submissions_gclid_idx
  on public.intake_submissions (gclid)
  where gclid is not null;

-- Backfill convenience fields for existing rows where possible.
update public.intake_submissions
set
  first_name = coalesce(first_name, nullif(split_part(full_name, ' ', 1), '')),
  phone_or_email = coalesce(phone_or_email, nullif(phone, ''), nullif(email, '')),
  city_region = coalesce(city_region, city_area),
  happened_in_ontario = coalesce(happened_in_ontario, in_ontario),
  main_issue = coalesce(main_issue, raw_submission->'data'->>'claimStatus'),
  needs_treatment_coverage = coalesce(needs_treatment_coverage, medical_attention),
  missing_work = coalesce(missing_work, work_impact),
  short_message = coalesce(short_message, nullif(accident_summary, '')),
  best_time_to_reach = coalesce(best_time_to_reach, best_time)
where first_name is null
   or phone_or_email is null
   or city_region is null
   or happened_in_ontario is null
   or main_issue is null
   or needs_treatment_coverage is null
   or missing_work is null
   or short_message is null
   or best_time_to_reach is null;
