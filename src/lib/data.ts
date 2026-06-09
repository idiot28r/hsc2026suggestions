import { supabase, isSupabaseConfigured } from './supabaseClient'
import { SEED_SUBJECTS } from './seedData'
import type {
  Chapter,
  Section,
  Subject,
  SubjectWithSyllabus,
  Topic,
} from './types'

export type DbTable = 'subjects' | 'sections' | 'chapters' | 'topics'

export const dataMode: 'supabase' | 'local' = isSupabaseConfigured ? 'supabase' : 'local'

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN AUTH (custom: username/password → session token, verified by RPC)
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_TOKEN_KEY = 'hsc2026.admin.token'

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY)
  } catch {
    return null
  }
}
function setAdminToken(t: string) {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, t)
  } catch {
    /* ignore */
  }
}
export function clearAdminToken() {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

/** Authenticate an admin. Local/demo mode has no backend, so it always succeeds. */
export async function adminLogin(username: string, password: string): Promise<boolean> {
  if (!supabase) return true
  const { data, error } = await supabase.rpc('admin_login', { p_username: username, p_password: password })
  if (error || !data) return false
  setAdminToken(data as string)
  return true
}

/** Is the stored admin token still valid? (Always true in local/demo mode.) */
export async function adminValid(): Promise<boolean> {
  if (!supabase) return true
  const token = getAdminToken()
  if (!token) return false
  const { data, error } = await supabase.rpc('admin_valid', { p_token: token })
  return !error && data === true
}

export async function adminLogout(): Promise<void> {
  const token = getAdminToken()
  clearAdminToken()
  if (supabase && token) await supabase.rpc('admin_logout', { p_token: token })
}

// ─────────────────────────────────────────────────────────────────────────────
//  LOCAL DEMO STORE (localStorage-backed clone of the seed)
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT_KEY = 'hsc2026.content'
const PROGRESS_KEY = 'hsc2026.progress'

function loadContent(): SubjectWithSyllabus[] {
  try {
    const raw = localStorage.getItem(CONTENT_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  const seeded = structuredClone(SEED_SUBJECTS)
  saveContent(seeded)
  return seeded
}

function saveContent(c: SubjectWithSyllabus[]) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(c))
}

type ProgressMap = Record<string, { name: string; completed: string[]; earned: number; updated_at: string }>

function loadProgress(): ProgressMap {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveProgressMap(m: ProgressMap) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(m))
}

const pkey = (phone: string, subjectId: string) => `${phone}|${subjectId}`

function uid(prefix: string): string {
  const rnd = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  return `${prefix}-${rnd.slice(0, 8)}`
}

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC READ API
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchSubjects(includeInactive = false): Promise<Subject[]> {
  if (supabase) {
    let q = supabase.from('subjects').select('*')
    if (!includeInactive) q = q.eq('is_active', true)
    const { data, error } = await q
    if (error) throw error
    return (data || []) as Subject[]
  }
  return loadContent()
    .filter((s) => includeInactive || s.is_active)
    .map(({ sections: _s, ...rest }) => rest)
}

export async function fetchSyllabus(subjectId: string): Promise<SubjectWithSyllabus | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from('subjects')
      .select(
        '*, sections(*, chapters(*, topics(*)))',
      )
      .eq('id', subjectId)
      .single()
    if (error) return null
    return normalizeSyllabus(data as SubjectWithSyllabus)
  }
  const found = loadContent().find((s) => s.id === subjectId)
  return found ? normalizeSyllabus(structuredClone(found)) : null
}

/** earned_marks per subject for one student (for landing-page badges). */
export async function fetchEarnedBySubject(phone: string | null): Promise<Record<string, number>> {
  if (!phone) return {}
  if (supabase) {
    const { data, error } = await supabase
      .from('student_progress')
      .select('subject_id, earned_marks')
      .eq('phone', phone)
    if (error) return {}
    const map: Record<string, number> = {}
    for (const row of data || []) map[row.subject_id] = row.earned_marks
    return map
  }
  const all = loadProgress()
  const map: Record<string, number> = {}
  for (const [k, v] of Object.entries(all)) {
    const [ph, sub] = k.split('|')
    if (ph === phone) map[sub] = v.earned
  }
  return map
}

export async function fetchCompletedTopics(phone: string | null, subjectId: string): Promise<Set<string>> {
  if (!phone) return new Set()
  if (supabase) {
    const { data, error } = await supabase
      .from('student_progress')
      .select('completed_topics')
      .eq('phone', phone)
      .eq('subject_id', subjectId)
      .maybeSingle()
    if (error || !data) return new Set()
    return new Set((data.completed_topics as string[]) || [])
  }
  const entry = loadProgress()[pkey(phone, subjectId)]
  return new Set(entry?.completed || [])
}

export async function saveProgress(args: {
  phone: string
  name: string
  subjectId: string
  completed: string[]
  earned: number
}): Promise<void> {
  const { phone, name, subjectId, completed, earned } = args
  const updated_at = new Date().toISOString()
  if (supabase) {
    const { error } = await supabase.from('student_progress').upsert(
      { phone, subject_id: subjectId, name, completed_topics: completed, earned_marks: earned, updated_at },
      { onConflict: 'phone,subject_id' },
    )
    if (error) throw error
    return
  }
  const map = loadProgress()
  map[pkey(phone, subjectId)] = { name, completed, earned, updated_at }
  saveProgressMap(map)
}

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN WRITE API
// ─────────────────────────────────────────────────────────────────────────────

export async function updateRecord(table: DbTable, id: string, patch: Record<string, unknown>): Promise<void> {
  if (supabase) {
    const { error } = await supabase.rpc('admin_update', { p_token: getAdminToken(), p_table: table, p_id: id, p_patch: patch })
    if (error) throw error
    return
  }
  const content = loadContent()
  for (const subj of content) {
    if (table === 'subjects' && subj.id === id) Object.assign(subj, patch)
    for (const sec of subj.sections) {
      if (table === 'sections' && sec.id === id) Object.assign(sec, patch)
      for (const chap of sec.chapters) {
        if (table === 'chapters' && chap.id === id) Object.assign(chap, patch)
        for (const top of chap.topics) {
          if (table === 'topics' && top.id === id) Object.assign(top, patch)
        }
      }
    }
  }
  saveContent(content)
}

export async function deleteRecord(table: DbTable, id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.rpc('admin_delete', { p_token: getAdminToken(), p_table: table, p_id: id })
    if (error) throw error
    return
  }
  let content = loadContent()
  if (table === 'subjects') {
    content = content.filter((s) => s.id !== id)
  } else {
    for (const subj of content) {
      if (table === 'sections') subj.sections = subj.sections.filter((s) => s.id !== id)
      for (const sec of subj.sections) {
        if (table === 'chapters') sec.chapters = sec.chapters.filter((c) => c.id !== id)
        for (const chap of sec.chapters) {
          if (table === 'topics') chap.topics = chap.topics.filter((t) => t.id !== id)
        }
      }
    }
  }
  saveContent(content)
}

export async function createSubject(input: Partial<Subject> & { id: string; title: string }): Promise<void> {
  const row: Subject = {
    id: input.id,
    title: input.title,
    short_code: input.short_code ?? null,
    icon_emoji: input.icon_emoji ?? '📘',
    is_active: input.is_active ?? true,
    rank_science: input.rank_science ?? null,
    rank_business: input.rank_business ?? null,
    rank_humanities: input.rank_humanities ?? null,
    max_cq: input.max_cq ?? 50,
    max_mcq: input.max_mcq ?? 25,
    max_sq: input.max_sq ?? 0,
    cq_value_per_q: input.cq_value_per_q ?? 10,
    sq_value_per_q: input.sq_value_per_q ?? 2,
    alt_marks_scheme: input.alt_marks_scheme ?? false,
    cq_label: input.cq_label ?? null,
  }
  if (supabase) {
    const { error } = await supabase.rpc('admin_insert', { p_token: getAdminToken(), p_table: 'subjects', p_data: row })
    if (error) throw error
    return
  }
  const content = loadContent()
  content.push({ ...row, sections: [] })
  saveContent(content)
}

export async function createSection(subjectId: string): Promise<string> {
  const id = uid('sec')
  const row: Omit<Section, 'chapters'> = {
    id,
    subject_id: subjectId,
    title: 'নতুন গ্রুপ',
    min_cq_required: 0,
    total_cq_available: 0,
    cq_value_per_q: 0,
    sort_order: 999,
  }
  if (supabase) {
    const { error } = await supabase.rpc('admin_insert', { p_token: getAdminToken(), p_table: 'sections', p_data: row })
    if (error) throw error
    return id
  }
  const content = loadContent()
  content.find((s) => s.id === subjectId)?.sections.push({ ...row, chapters: [] })
  saveContent(content)
  return id
}

export async function createChapter(sectionId: string): Promise<string> {
  const id = uid('chap')
  const row: Omit<Chapter, 'topics'> = {
    id,
    section_id: sectionId,
    title: 'নতুন অধ্যায়',
    est_mcq: 0,
    est_sq: 0,
    sort_order: 999,
  }
  if (supabase) {
    const { error } = await supabase.rpc('admin_insert', { p_token: getAdminToken(), p_table: 'chapters', p_data: row })
    if (error) throw error
    return id
  }
  const content = loadContent()
  for (const subj of content)
    for (const sec of subj.sections)
      if (sec.id === sectionId) sec.chapters.push({ ...row, topics: [] })
  saveContent(content)
  return id
}

export async function createTopic(chapterId: string): Promise<string> {
  const id = uid('top')
  const row: Topic = { id, chapter_id: chapterId, title: 'নতুন টপিক', weight: 50, sort_order: 999 }
  if (supabase) {
    const { error } = await supabase.rpc('admin_insert', { p_token: getAdminToken(), p_table: 'topics', p_data: row })
    if (error) throw error
    return id
  }
  const content = loadContent()
  for (const subj of content)
    for (const sec of subj.sections)
      for (const chap of sec.chapters) if (chap.id === chapterId) chap.topics.push(row)
  saveContent(content)
  return id
}

/** Wipe local demo content back to the bundled seed (no effect in Supabase mode). */
export function resetLocalContent(): void {
  if (supabase) return
  localStorage.removeItem(CONTENT_KEY)
}

// ─────────────────────────────────────────────────────────────────────────────

function normalizeSyllabus(s: SubjectWithSyllabus): SubjectWithSyllabus {
  const sections = [...(s.sections || [])].sort(byOrder)
  for (const sec of sections) {
    sec.chapters = [...(sec.chapters || [])].sort(byOrder)
    for (const chap of sec.chapters) {
      chap.topics = [...(chap.topics || [])].sort((a, b) => b.weight - a.weight || byOrder(a, b))
    }
  }
  return { ...s, sections }
}

function byOrder(a: { sort_order: number; id: string }, b: { sort_order: number; id: string }): number {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id.localeCompare(b.id)
}
