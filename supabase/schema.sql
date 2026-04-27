create extension if not exists pgcrypto;

create table if not exists public.intake_submissions (
  id uuid primary key,
  submitted_at timestamptz not null default timezone('utc', now()),
  full_name text not null,
  phone text not null,
  email text not null,
  contact_method text not null,
  best_time text not null,
  accident_type text not null,
  accident_date text not null,
  city_area text not null,
  in_ontario text not null,
  accident_summary text not null,
  injured text not null,
  medical_attention text not null,
  work_impact text not null,
  ongoing_symptoms text not null,
  injury_details text,
  spoken_with_lawyer text not null,
  currently_represented text not null,
  third_party_involved text not null,
  additional_notes text,
  consent_truth boolean not null,
  consent_not_law_firm boolean not null,
  consent_to_contact boolean not null,
  source_page text not null default '/',
  review_score integer not null,
  review_bucket text not null,
  raw_submission jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),

  -- Lead quality and attribution fields
  first_name text,
  phone_or_email text,
  city_region text,
  happened_in_ontario text,
  main_issue text,
  needs_treatment_coverage text,
  missing_work text,
  short_message text,
  best_time_to_reach text,
  landing_page_url text,
  referrer text,
  user_agent text,
  ip_hash text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  status text not null default 'new' check (status in ('new','contacted','unreachable','unqualified','qualified','referred','accepted_by_partner','rejected_by_partner','spam','test'))
);

create index if not exists intake_submissions_submitted_at_idx
  on public.intake_submissions (submitted_at desc);

create index if not exists intake_submissions_review_bucket_idx
  on public.intake_submissions (review_bucket);

create index if not exists intake_submissions_status_idx
  on public.intake_submissions (status);

create index if not exists intake_submissions_campaign_idx
  on public.intake_submissions (utm_source, utm_medium, utm_campaign);

create index if not exists intake_submissions_gclid_idx
  on public.intake_submissions (gclid)
  where gclid is not null;

comment on table public.intake_submissions is 'Ontario Accident Review v1 intake submissions. No insurance details or uploads.';

-- ── Analytics events table ──────────────────────────────────────────────────
create table if not exists public.analytics_events (
  id            bigserial primary key,
  event         text not null,
  device        text,
  traffic_source text,
  utm_medium    text,
  utm_campaign  text,
  landing_page  text,
  -- intake-specific (nullable)
  accident_type text,
  claim_status  text,
  ontario_yn    text,
  injured       text,
  step          integer,
  step_label    text,
  cta_text      text,
  cta_location  text,
  trigger       text,
  question      text,
  -- meta
  props         jsonb,
  occurred_at   timestamptz not null default now()
);

create index if not exists analytics_events_event_idx     on public.analytics_events (event);
create index if not exists analytics_events_occurred_idx  on public.analytics_events (occurred_at desc);
create index if not exists analytics_events_accident_idx  on public.analytics_events (accident_type);
