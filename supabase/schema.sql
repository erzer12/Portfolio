-- ============================================================
-- Portfolio Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── Profile ────────────────────────────────────────────────
create table if not exists profile (
  id text primary key default 'main',
  name text,
  tagline text,
  summary text,
  location text,
  email text,
  phone text,
  image text,
  resume text,
  social jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ─── Projects ───────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  image text,
  tags text[] default '{}',
  github text,
  live text,
  category text,
  date text,
  featured boolean default false,
  "order" int default 0,
  created_at timestamptz default now()
);

-- ─── Skills ─────────────────────────────────────────────────
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  skills text[] not null,
  "order" int default 0
);

alter table skills drop constraint if exists skills_category_unique;
alter table skills add constraint skills_category_unique unique (category);

-- ─── Experience ─────────────────────────────────────────────
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  employment_type text,
  start_date text not null,
  end_date text,
  description text not null default '',
  bullets text[] default '{}',
  tags text[] default '{}',
  certificate_url text,
  recommendation_url text,
  repo_url text,
  related_projects text[] default '{}',
  "order" int default 0
);

-- ─── Education ──────────────────────────────────────────────
create table if not exists education (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text not null,
  year text not null,
  description text,
  "order" int default 0
);

alter table education drop constraint if exists education_unique;
alter table education add constraint education_unique unique (school, degree, year);

-- ─── Certifications ─────────────────────────────────────────
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text not null,
  date text not null,
  link text,
  image text,
  credly_id text unique,
  "order" int default 0
);

alter table certifications drop constraint if exists certifications_unique;
alter table certifications add constraint certifications_unique unique (name, issuer, date);

-- ─── Achievements ───────────────────────────────────────────
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date text,
  url text,
  "order" int default 0
);

-- ─── Testimonials ───────────────────────────────────────────
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  message text not null,
  rating int default 5,
  approved boolean default false,
  created_at timestamptz default now(),
  "order" int default 0
);

-- ─── Site Settings ──────────────────────────────────────────
create table if not exists site_settings (
  id text primary key default 'main',
  show_testimonials boolean default true
);

insert into site_settings (id, show_testimonials) values ('main', true)
on conflict (id) do nothing;

-- ─── Footer Links ───────────────────────────────────────────
create table if not exists footer_links (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  label text not null,
  url text not null,
  "order" int default 0
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profile enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;
alter table experience enable row level security;
alter table education enable row level security;
alter table certifications enable row level security;
alter table achievements enable row level security;
alter table testimonials enable row level security;
alter table site_settings enable row level security;
alter table footer_links enable row level security;

-- Public read policies
drop policy if exists "public_read_profile" on profile;
create policy "public_read_profile" on profile for select using (true);

drop policy if exists "public_read_projects" on projects;
create policy "public_read_projects" on projects for select using (true);

drop policy if exists "public_read_skills" on skills;
create policy "public_read_skills" on skills for select using (true);

drop policy if exists "public_read_experience" on experience;
create policy "public_read_experience" on experience for select using (true);

drop policy if exists "public_read_education" on education;
create policy "public_read_education" on education for select using (true);

drop policy if exists "public_read_certifications" on certifications;
create policy "public_read_certifications" on certifications for select using (true);

drop policy if exists "public_read_achievements" on achievements;
create policy "public_read_achievements" on achievements for select using (true);

drop policy if exists "public_read_approved_testimonials" on testimonials;
create policy "public_read_approved_testimonials" on testimonials for select using (approved = true);

drop policy if exists "public_read_settings" on site_settings;
create policy "public_read_settings" on site_settings for select using (true);

drop policy if exists "public_read_footer_links" on footer_links;
create policy "public_read_footer_links" on footer_links for select using (true);

drop policy if exists "public_submit_testimonials" on testimonials;
create policy "public_submit_testimonials" on testimonials for insert with check (approved = false);

-- ============================================================
-- Storage: portfolio_media bucket
-- ============================================================

insert into storage.buckets (id, name, public)
values ('portfolio_media', 'portfolio_media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access to Media" on storage.objects;
create policy "Public Access to Media" on storage.objects for select using (bucket_id = 'portfolio_media');

drop policy if exists "Admin Insert Media" on storage.objects;
create policy "Admin Insert Media" on storage.objects for insert with check (bucket_id = 'portfolio_media');

drop policy if exists "Admin Update Media" on storage.objects;
create policy "Admin Update Media" on storage.objects for update using (bucket_id = 'portfolio_media');

drop policy if exists "Admin Delete Media" on storage.objects;
create policy "Admin Delete Media" on storage.objects for delete using (bucket_id = 'portfolio_media');

-- ============================================================
-- Migrations (safe to re-run on existing databases)
-- ============================================================

-- V2
alter table testimonials add column if not exists "order" int default 0;

-- V3
alter table certifications add column if not exists "order" int default 0;

update certifications set "order" = sub.rn - 1
from (
  select id, row_number() over (order by date desc) as rn
  from certifications
) as sub
where certifications.id = sub.id
  and certifications."order" = 0;

alter table experience add column if not exists employment_type text;
alter table experience add column if not exists certificate_url text;
alter table experience add column if not exists recommendation_url text;
alter table profile add column if not exists image text;

-- V4
alter table experience add column if not exists repo_url text;
alter table experience add column if not exists related_projects text[] default '{}';

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date text,
  url text,
  "order" int default 0
);

alter table achievements enable row level security;

drop policy if exists "public_read_achievements" on achievements;
create policy "public_read_achievements" on achievements for select using (true);
