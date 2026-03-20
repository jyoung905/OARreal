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
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists intake_submissions_submitted_at_idx
  on public.intake_submissions (submitted_at desc);

create index if not exists intake_submissions_review_bucket_idx
  on public.intake_submissions (review_bucket);

comment on table public.intake_submissions is 'Ontario Accident Review v1 intake submissions. No insurance details or uploads.';
