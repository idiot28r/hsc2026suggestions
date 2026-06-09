// Generates supabase/seed.sql from the single source of truth in src/lib/seedData.ts
// Usage: npx tsx scripts/gen-seed-sql.mjs
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { SEED_SUBJECTS } from '../src/lib/seedData.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`)
const n = (v) => (v === null || v === undefined ? 'null' : Number(v))

const lines = [
  '-- AUTO-GENERATED from src/lib/seedData.ts — do not edit by hand.',
  '-- Run after schema.sql. Weights & mark distributions are PLACEHOLDERS; review them.',
  'begin;',
  '',
]

for (const s of SEED_SUBJECTS) {
  lines.push(
    `insert into subjects (id,title,short_code,icon_emoji,is_active,rank_science,rank_business,rank_humanities,max_cq,max_mcq,max_sq,cq_value_per_q,sq_value_per_q,alt_marks_scheme,cq_label) values (${q(s.id)},${q(s.title)},${q(s.short_code)},${q(s.icon_emoji)},${s.is_active},${n(s.rank_science)},${n(s.rank_business)},${n(s.rank_humanities)},${n(s.max_cq)},${n(s.max_mcq)},${n(s.max_sq)},${n(s.cq_value_per_q)},${n(s.sq_value_per_q)},${s.alt_marks_scheme},${q(s.cq_label)}) on conflict (id) do nothing;`,
  )
  for (const sec of s.sections) {
    lines.push(
      `insert into sections (id,subject_id,title,min_cq_required,total_cq_available,cq_value_per_q,sort_order) values (${q(sec.id)},${q(sec.subject_id)},${q(sec.title)},${n(sec.min_cq_required)},${n(sec.total_cq_available)},${n(sec.cq_value_per_q)},${n(sec.sort_order)}) on conflict (id) do nothing;`,
    )
    for (const chap of sec.chapters) {
      lines.push(
        `insert into chapters (id,section_id,title,est_mcq,est_sq,sort_order) values (${q(chap.id)},${q(chap.section_id)},${q(chap.title)},${n(chap.est_mcq)},${n(chap.est_sq)},${n(chap.sort_order)}) on conflict (id) do nothing;`,
      )
      for (const top of chap.topics) {
        lines.push(
          `insert into topics (id,chapter_id,title,weight,sort_order) values (${q(top.id)},${q(top.chapter_id)},${q(top.title)},${n(top.weight)},${n(top.sort_order)}) on conflict (id) do nothing;`,
        )
      }
    }
  }
  lines.push('')
}

lines.push('commit;')
writeFileSync(resolve(__dirname, '../supabase/seed.sql'), lines.join('\n'))
console.log('Wrote supabase/seed.sql')
