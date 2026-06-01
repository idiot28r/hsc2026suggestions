# HSC 2026 Interactive Suggestions — Session Handoff

> Read this first when continuing in a new Claude Code session opened **in this
> folder** (`C:\Users\Raian\Documents\Raian\HSC 2026 Interactive Suggestion`).
> It captures everything decided and done so far, plus what's left.

## 1. What this project is

A mobile-first **interactive suggestion tracker** for HSC 2026, packaged inside
the **brritto mobile app** (runs in an in-app browser/webview). A subject's
suggestion is broken into **Sections → Chapters → Topics**; each topic carries an
importance **weight** (shown as stars). Students tick what they've studied and a
live **Estimated Exam Score** projects their marks (CQ / MCQ / SQ breakdown)
toward A+ (80%). Successor to the SSC 2026 version — same features, rebuilt UI/UX,
new HSC content.

Stack: **React 19 + TypeScript + Vite**, HashRouter, KaTeX, Supabase (with a
localStorage demo fallback when no DB is configured).

## 2. Repository & isolation

- Repo: **https://github.com/idiot28r/hsc2026suggestions** (public, account
  `idiot28r`). This folder is the repo root; `origin` is the only remote.
- **Fully isolated** from the old `bdcollegeadmission` / "2026 College Admission"
  project. Verify any time:
  ```bash
  git remote -v                 # only origin -> hsc2026suggestions
  git rev-parse --show-toplevel # this folder
  ```
  If an IDE ever shows bdcollegeadmission, it's because a *parent* folder was
  opened — open only this folder.
- The "2026 College Admission" project was the accidental original cwd; it has
  been left completely untouched (no tracked files changed; the temporary
  `.claude/launch.json` that was added there has been removed).

## 3. Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

- **No backend needed by default**: runs in **local demo mode** using
  `src/lib/seedData.ts` for content and `localStorage` for progress.
- `npm run build` — type-check + production build (must stay green).
- `npm run gen:seed` — regenerates `supabase/seed.sql` from `seedData.ts`.

### Previewing inside a Claude session

`.claude/launch.json` defines a `hsc-dev` server on port 5173 (`npm run dev`).
Use the preview tooling with that config from this folder.

## 4. Routes / pages

| Route          | Page            | Notes |
| -------------- | --------------- | ----- |
| `/`            | SubjectsPage    | Group tabs (Science/Business/Humanities), subject cards, progress badges. Tap the **HSC** logo 5× to reach admin. |
| `/subject/:id` | TrackerPage     | Score ring + CQ/MCQ/SQ bar, chapter accordions, star-weighted topics, debounced autosave. |
| `/admin`       | AdminPage       | Syllabus Manager: inline CRUD for subjects/sections/chapters/topics, weights, ranks, mark caps. Reachable at `#/admin`. |

## 5. File map

```
src/lib/
  types.ts          domain types + GROUPS
  seedData.ts       HSC starter content (single source of truth)
  data.ts           data layer: Supabase OR localStorage fallback (dataMode)
  scoring.ts        estimated-score engine (ported from SSC) + stars + grade msg
  supabaseClient.ts Supabase client (null when no env -> demo mode)
  math.tsx          KaTeX render helper
  useUserParams.ts  reads ?phone=&name= and preserves them across nav
src/components/      StatusBanner, ProgressRing, ScoreBreakdown, StarRating, Toast
src/pages/           SubjectsPage, TrackerPage, AdminPage
supabase/            schema.sql, seed.sql (generated)
scripts/             gen-seed-sql.mjs
```

## 6. brritto integration (important)

The app receives the logged-in student via URL query, exactly like SSC:

```
#/subject/phy1?phone=017XXXXXXXX&name=Rahim
```

- `phone` keys saved progress in `student_progress`; `name` shows in the banner.
- No `phone` = read-only guest. `phone`/`name` are preserved across navigation.
- **Student side must have NO debug/demo messaging** (it's an in-app browser).
  Already done: the demo banner was removed; only the real save-status strip
  shows for logged-in students. Keep it that way.

## 7. Scoring model (see `src/lib/scoring.ts`)

- A chapter yields `est_mcq`/`est_sq` marks, earned in proportion to the
  topic-weight covered in it.
- CQ is per section: up to `total_cq_available` scaled by coverage; first
  `min_cq_required` are mandatory, the rest is overflow capped globally so a
  student can't exceed the paper's CQ count.
- Each bucket capped at the subject's `max_*`. A+ = 80% of total.

## 8. ⚠️ Content is a STARTER scaffold

Chapter/topic names follow the standard HSC syllabus, but **all topic weights and
the per-subject mark distributions are placeholders**. They must be replaced with
real suggestion data (via the Admin panel, or by editing `seedData.ts` and
re-running `npm run gen:seed`).

## 9. PENDING — Supabase setup (next task)

Decision (2026-06-01): create a **new** Supabase project and connect.

User chose to provide a **Supabase personal access token** (`sbp_...`, from
https://supabase.com/dashboard/account/tokens) so the Management API can be used.
Planned steps once the token is provided:

1. `GET https://api.supabase.com/v1/organizations` → pick org (confirm with user
   if more than one).
2. `POST https://api.supabase.com/v1/projects` with
   `{ name: "hsc2026suggestions", organization_id, region: "ap-south-1",
   db_pass: <generated strong password>, plan: "free" }`.
   (Region default = Mumbai/ap-south-1; user may prefer Singapore/ap-southeast-1.)
3. Wait for project to be ACTIVE, then run `supabase/schema.sql` then
   `supabase/seed.sql` via `POST /v1/projects/{ref}/database/query`.
4. `GET /v1/projects/{ref}/api-keys` → grab the **anon** key.
5. Create `.env` (gitignored) in this folder:
   ```
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```
6. Restart dev server — banner switches from demo to live; admin + tracker now
   read/write Supabase.
7. Remind user to **revoke the access token** afterward.
8. Tighten RLS in `schema.sql` (currently demo-friendly anon read/write) to a
   real admin/auth model before production.

To resume, just say so and paste the token.

## 10. Next-steps checklist

- [ ] Supabase: create new DB + connect (section 9).
- [ ] Replace placeholder weights & mark distributions with real HSC suggestion
      data.
- [ ] Optional: gate the admin panel (the 5-tap-logo entry is obscure but open).
- [ ] Optional: code-split to silence the >500 kB chunk warning.
- [ ] Decide hosting for the webview build (`npm run build` → `dist/`, base is
      relative so it works under any sub-path).
```
