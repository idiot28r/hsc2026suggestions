-- ─────────────────────────────────────────────────────────────────────────────
--  Lock down RLS on an existing DB that was seeded with the old demo-open
--  policies. Idempotent: drops the anon-write content policies and grants
--  content writes to authenticated admins only. Public read + anon progress
--  read/write are preserved. Run once via the SQL editor / Management API.
-- ─────────────────────────────────────────────────────────────────────────────

-- Remove demo-open anon write on content.
drop policy if exists "anon write subjects" on subjects;
drop policy if exists "anon write sections" on sections;
drop policy if exists "anon write chapters" on chapters;
drop policy if exists "anon write topics"   on topics;

-- Grant content management to authenticated admins only.
drop policy if exists "admin manage subjects" on subjects;
drop policy if exists "admin manage sections" on sections;
drop policy if exists "admin manage chapters" on chapters;
drop policy if exists "admin manage topics"   on topics;
create policy "admin manage subjects" on subjects for all to authenticated using (true) with check (true);
create policy "admin manage sections" on sections for all to authenticated using (true) with check (true);
create policy "admin manage chapters" on chapters for all to authenticated using (true) with check (true);
create policy "admin manage topics"   on topics   for all to authenticated using (true) with check (true);

-- Ensure public read still exists.
drop policy if exists "public read subjects" on subjects;
drop policy if exists "public read sections" on sections;
drop policy if exists "public read chapters" on chapters;
drop policy if exists "public read topics"   on topics;
create policy "public read subjects" on subjects for select using (true);
create policy "public read sections" on sections for select using (true);
create policy "public read chapters" on chapters for select using (true);
create policy "public read topics"   on topics   for select using (true);

-- Progress: keep anon read/write (rename from the old policy if present).
drop policy if exists "anon rw progress"   on student_progress;
drop policy if exists "anyone rw progress" on student_progress;
create policy "anyone rw progress" on student_progress for all using (true) with check (true);
