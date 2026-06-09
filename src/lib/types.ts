export type GroupKey = 'science' | 'business' | 'humanities'

export const GROUPS: { key: GroupKey; label: string; emoji: string }[] = [
  { key: 'science', label: 'Science', emoji: '🔬' },
  { key: 'business', label: 'Business Studies', emoji: '📊' },
  { key: 'humanities', label: 'Humanities', emoji: '🌍' },
]

export interface Topic {
  id: string
  chapter_id: string
  title: string
  /** Importance weight 0–100 within its chapter (drives the star rating). */
  weight: number
  sort_order: number
}

export interface Chapter {
  id: string
  section_id: string
  title: string
  /** Estimated marks this chapter contributes if fully covered. */
  est_mcq: number
  est_sq: number
  sort_order: number
  topics: Topic[]
}

export interface Section {
  id: string
  subject_id: string
  title: string
  /** Minimum CQ a student must answer from this section. */
  min_cq_required: number
  /** Total CQ available to attempt from this section. */
  total_cq_available: number
  /** Per-group marks per CQ — used only when the subject's alt_marks_scheme is on. */
  cq_value_per_q: number
  sort_order: number
  chapters: Chapter[]
}

export interface Subject {
  id: string
  title: string
  short_code: string | null
  icon_emoji: string | null
  is_active: boolean
  /** Per-group ordering. null => not shown in that group. */
  rank_science: number | null
  rank_business: number | null
  rank_humanities: number | null
  /** Full-mark caps for each question type on the board exam. */
  max_cq: number
  max_mcq: number
  max_sq: number
  /** Marks awarded per answered question of each type. */
  cq_value_per_q: number
  sq_value_per_q: number
  /** When true, CQ marks are set per group (section.cq_value_per_q) and labelled
   *  with `cq_label` — for written subjects that don't follow the CQ/MCQ pattern. */
  alt_marks_scheme: boolean
  /** Custom name for the "CQ" question type (null → default "সৃজনশীল"). */
  cq_label: string | null
}

export interface SubjectWithSyllabus extends Subject {
  sections: Section[]
}

export interface StudentProgress {
  phone: string
  subject_id: string
  name: string
  completed_topics: string[]
  earned_marks: number
  updated_at: string
}

export interface ScoreResult {
  finalCQ: number
  finalMCQ: number
  finalSQ: number
  finalScore: number
  totalPossible: number
  percent: number
}
