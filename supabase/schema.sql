-- ============================================================
-- Portfolio Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profile ────────────────────────────────────────────────
create table if not exists profile (
  id text primary key default 'main',
  name text,
  tagline text,
  summary text,
  location text,
  email text,
  phone text,
  resume text,
  social jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Seed default row
insert into profile (id, name, tagline, summary, location, email, social)
values (
  'main',
  'Harshil P',
  'Third-year CS student focused on AI, ML, and practical product work.',
  'I build lightweight products that make technical ideas easy to understand and easy to use. My focus is on AI-assisted workflows, clean interfaces, and shipping useful tools that help people work faster.',
  'Kerala, India',
  'harshilp1234@gmail.com',
  '{"github": "https://github.com/erzer12", "linkedin": "https://www.linkedin.com/in/harshil-p"}'::jsonb
)
on conflict (id) do nothing;

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

-- Seed sample projects
insert into projects (title, slug, description, long_description, tags, github, category, date, featured, "order")
values
  ('NewsHunt', 'newshunt', 'A Discord bot that automates news collection and delivers focused updates on demand.', 'NewsHunt is a Discord bot built to solve information overload. It monitors multiple RSS feeds and news sources, filters by topic relevance, and delivers clean summaries directly to Discord channels on a schedule or on-demand.

Built with Python, discord.py, Flask, and MongoDB. Deployed on Render.', '{"Python","discord.py","Flask","MongoDB","Render"}', 'https://github.com/erzer12', 'Discord Bot', 'May 2025', true, 1),

  ('HR Agent', 'hr-agent', 'An AI-assisted workflow for organizing hiring tasks and screening candidate information.', 'HR Agent is a lightweight tool that uses GPT to parse resumes, generate structured summaries, and help organize interview pipelines without heavy ATS overhead.

Built with Python, OpenAI API, and Flask. Designed to run locally or on any server.', '{"Python","OpenAI","Flask","GPT"}', 'https://github.com/erzer12', 'AI Workflow', '2025', true, 2),

  ('Portfolio', 'portfolio', 'Resume-first personal portfolio built with Next.js 16 and Supabase as a CMS backend.', 'This portfolio itself is the project — a full rewrite from a cinematic, animation-heavy site to a clean, typographically-driven resume format.

Built with Next.js 16, TypeScript, Supabase (PostgreSQL), and vanilla CSS design tokens. Fully server-rendered with ISR. The admin panel acts as a headless CMS.', '{"Next.js","TypeScript","Supabase","CSS"}', 'https://github.com/erzer12/Portfolio', 'Web App', '2026', true, 3)
on conflict (slug) do nothing;

-- ─── Skills ─────────────────────────────────────────────────
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  skills text[] not null,
  "order" int default 0
);

insert into skills (category, skills, "order") values
  ('Languages', '{"Python","JavaScript","TypeScript"}', 1),
  ('Frontend', '{"React","Next.js"}', 2),
  ('Backend', '{"Flask","Supabase","PostgreSQL"}', 3),
  ('AI / ML', '{"OpenAI API","Prompting","LangChain"}', 4),
  ('Tools', '{"Git","Figma","VS Code"}', 5)
on conflict do nothing;

-- ─── Experience ─────────────────────────────────────────────
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  start_date text not null,
  end_date text,
  description text not null default '',
  bullets text[] default '{}',
  tags text[] default '{}',
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

insert into education (school, degree, year, "order") values
  ('College of Engineering', 'B.Tech Computer Science (AI & ML) · 7.91 CGPA', '2027', 2),
  ('Bhavan''s Vidya Mandir', 'Class 12 · 90.4%', '2023', 1)
on conflict do nothing;

-- ─── Certifications ─────────────────────────────────────────
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text not null,
  date text not null,
  link text,
  image text,
  credly_id text unique
);

insert into certifications (name, issuer, date) values
  ('AWS ML Foundations', 'Amazon', '2024'),
  ('AI Fundamentals', 'IBM', '2024'),
  ('Python MOOC', 'University of Helsinki', '2023')
on conflict do nothing;

-- ─── Testimonials ───────────────────────────────────────────
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  message text not null,
  rating int default 5,
  approved boolean default false,
  created_at timestamptz default now()
);

-- ─── Site Settings ──────────────────────────────────────────
create table if not exists site_settings (
  id text primary key default 'main',
  show_testimonials boolean default true
);

insert into site_settings (id, show_testimonials) values ('main', true)
on conflict (id) do nothing;

-- ============================================================
-- Row Level Security
-- ============================================================

-- Enable RLS on all tables
alter table profile enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;
alter table experience enable row level security;
alter table education enable row level security;
alter table certifications enable row level security;
alter table testimonials enable row level security;
alter table site_settings enable row level security;

-- Public read policies
create policy "public_read_profile" on profile for select using (true);
create policy "public_read_projects" on projects for select using (true);
create policy "public_read_skills" on skills for select using (true);
create policy "public_read_experience" on experience for select using (true);
create policy "public_read_education" on education for select using (true);
create policy "public_read_certifications" on certifications for select using (true);
create policy "public_read_approved_testimonials" on testimonials for select using (approved = true);
create policy "public_read_settings" on site_settings for select using (true);

-- Public can insert testimonials (pending approval)
create policy "public_submit_testimonials" on testimonials for insert with check (approved = false);

-- All writes require service role key (enforced by using supabaseAdmin in server actions)
-- No anon update/delete permitted on any table
