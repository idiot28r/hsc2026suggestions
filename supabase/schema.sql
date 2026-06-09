-- ─────────────────────────────────────────────────────────────────────────────
--  HSC 2026 Interactive Suggestions — Supabase schema
--  Run this in the Supabase SQL editor, then run seed.sql for starter content.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists subjects (
  id              text primary key,
  title           text not null,
  short_code      text,
  icon_emoji      text default '📘',
  is_active       boolean not null default true,
  rank_science    integer,
  rank_business   integer,
  rank_humanities integer,
  max_cq          numeric not null default 50,
  max_mcq         numeric not null default 25,
  max_sq          numeric not null default 0,
  cq_value_per_q  numeric not null default 10,
  sq_value_per_q  numeric not null default 2,
  -- Alternate marks scheme (for written subjects like Bangla 2nd / English):
  -- per-group CQ marks + a custom label instead of one global CQ value.
  alt_marks_scheme boolean not null default false,
  cq_label        text,
  created_at      timestamptz not null default now()
);

create table if not exists sections (
  id                  text primary key,
  subject_id          text not null references subjects(id) on delete cascade,
  title               text not null,
  min_cq_required     numeric not null default 0,
  total_cq_available  numeric not null default 0,
  -- Per-group CQ marks (used only when the subject's alt_marks_scheme is on).
  cq_value_per_q      numeric not null default 0,
  sort_order          integer not null default 0
);

create table if not exists chapters (
  id          text primary key,
  section_id  text not null references sections(id) on delete cascade,
  title       text not null,
  est_mcq     numeric not null default 0,
  est_sq      numeric not null default 0,
  sort_order  integer not null default 0
);

create table if not exists topics (
  id          text primary key,
  chapter_id  text not null references chapters(id) on delete cascade,
  title       text not null,
  weight      numeric not null default 50,
  sort_order  integer not null default 0
);

create table if not exists student_progress (
  phone            text not null,
  subject_id       text not null references subjects(id) on delete cascade,
  name             text,
  completed_topics jsonb not null default '[]'::jsonb,
  earned_marks     numeric not null default 0,
  updated_at       timestamptz not null default now(),
  primary key (phone, subject_id)
);

create index if not exists idx_sections_subject on sections(subject_id);
create index if not exists idx_chapters_section on chapters(section_id);
create index if not exists idx_topics_chapter on topics(chapter_id);
create index if not exists idx_progress_phone on student_progress(phone);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- Content tables (subjects/sections/chapters/topics): world-READABLE so the
-- brritto webview (anon) can show suggestions, but only WRITABLE by authenticated
-- admins (subject-matter experts logging in via Supabase Auth on the admin panel).
-- student_progress: anon read/write so logged-in-via-brritto students can save
-- their tickmarks (keyed by phone in app logic).

alter table subjects        enable row level security;
alter table sections        enable row level security;
alter table chapters        enable row level security;
alter table topics          enable row level security;
alter table student_progress enable row level security;

-- Public read of content. There are intentionally NO write policies, so the
-- anon key cannot insert/update/delete content directly. Admin edits go through
-- the SECURITY DEFINER functions in admin-auth.sql (token-gated), which run as
-- the function owner and bypass RLS.
create policy "public read subjects"  on subjects  for select using (true);
create policy "public read sections"  on sections  for select using (true);
create policy "public read chapters"  on chapters  for select using (true);
create policy "public read topics"    on topics    for select using (true);

-- Students (anon) read/write their own progress to record tickmarks.
create policy "anyone rw progress"    on student_progress for all using (true) with check (true);

-- After this, run admin-auth.sql for the custom admin login + write functions.
