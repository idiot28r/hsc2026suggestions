# HSC 2026 — Interactive Suggestions

A mobile-first interactive **suggestion tracker** for HSC 2026. Each subject's
suggestion is broken into **Sections → Chapters → Topics**, every topic weighted
by importance (star rating). Students tick off what they've studied and a live
**Estimated Exam Score** projects their marks (CQ / MCQ / SQ breakdown) toward
A+. Built as the successor to the SSC 2026 version, with a rebuilt UI/UX and new
HSC content.

Stack: **React 19 + TypeScript + Vite**, KaTeX for math, Supabase for storage.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

The app runs out of the box in **local demo mode** — no backend required.
Content comes from `src/lib/seedData.ts` and student progress is saved to the
browser's `localStorage`. A blue banner indicates demo mode.

## Pages

| Route          | What it is                                                        |
| -------------- | ----------------------------------------------------------------- |
| `/`            | Landing: group tabs (Science / Business / Humanities) + subject cards with progress badges |
| `/subject/:id` | Tracker: live score ring + CQ/MCQ/SQ bar, accordion of chapters/topics, autosave |
| `/admin`       | Syllabus Manager: inline CRUD for subjects, sections, chapters, topics, weights & mark distribution |

The admin panel is reachable directly at `#/admin`, or by tapping the **HSC**
logo on the landing page 5×.

## brritto-app integration

The student's login context is passed through the URL, exactly like the SSC
version:

```
#/subject/phy1?phone=017XXXXXXXX&name=Rahim
```

`phone` keys the saved progress; `name` is shown in the status banner. Without
`phone`, the user is a read-only guest. `phone`/`name` are preserved across
in-app navigation automatically.

## Connecting Supabase (going live)

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Run `supabase/seed.sql` to load the starter HSC content (regenerate it from
   the seed source any time with `npm run gen:seed`).
4. Copy `.env.example` → `.env` and fill in:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```

5. Restart `npm run dev`. The banner switches from demo to live; all reads/writes
   (including the admin panel) now hit Supabase.

The schema's RLS policies are demo-friendly (anon can read content + read/write
progress, and edit content). **Tighten the content-write and progress policies
to your auth model before production.**

## ⚠️ Content is a starter scaffold

Chapter and topic names follow the standard HSC syllabus, but every topic
**weight** and the per-subject **mark distribution** (`max_cq`, `max_mcq`,
`max_sq`, `cq_value_per_q`, …) are **placeholders**. Review and replace them with
real suggestion data via the Admin panel (or by editing `seedData.ts`) before
release.

## How the score is projected

See `src/lib/scoring.ts`. In short:

- A chapter yields `est_mcq` / `est_sq` marks, earned in proportion to the
  topic-weight a student has covered in it.
- CQ is computed per section: a section can yield up to `total_cq_available`
  CQ scaled by coverage; the first `min_cq_required` are mandatory and the rest
  is "overflow", capped globally so a student can't exceed the paper's CQ count.
- Each bucket is capped at the subject's `max_*`. A+ is 80% of the total.

## Project layout

```
src/
  lib/
    types.ts          domain types
    seedData.ts       HSC starter content (single source of truth)
    data.ts           data layer — Supabase or localStorage fallback
    scoring.ts        estimated-score engine
    supabaseClient.ts Supabase client (null in demo mode)
    math.tsx          KaTeX rendering helper
    useUserParams.ts  phone/name URL context
  components/         StatusBanner, ProgressRing, ScoreBreakdown, StarRating, Toast
  pages/             SubjectsPage, TrackerPage, AdminPage
supabase/
  schema.sql         tables + RLS
  seed.sql           generated starter content
scripts/
  gen-seed-sql.mjs   regenerates seed.sql from seedData.ts
```
