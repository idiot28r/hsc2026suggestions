import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchSyllabus, fetchCompletedTopics, saveProgress, dataMode } from '../lib/data'
import type { Chapter, Section, SubjectWithSyllabus } from '../lib/types'
import { calculateScore, gradeMessage } from '../lib/scoring'
import { useUserParams } from '../lib/useUserParams'
import StatusBanner, { type SaveState } from '../components/StatusBanner'
import ThemeToggle from '../components/ThemeToggle'
import ProgressRing from '../components/ProgressRing'
import ScoreBreakdown from '../components/ScoreBreakdown'
import StarRating from '../components/StarRating'
import { MathText } from '../lib/math'

export default function TrackerPage() {
  const { id = '' } = useParams()
  const user = useUserParams()
  const [subject, setSubject] = useState<SubjectWithSyllabus | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [saveState, setSaveState] = useState<SaveState>('idle')

  // Demo mode persists progress under a fixed local user so it survives reloads.
  const effPhone = user.phone ?? (dataMode === 'local' ? 'demo-user' : null)
  const firstRender = useRef(true)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const [syl, done] = await Promise.all([fetchSyllabus(id), fetchCompletedTopics(effPhone, id)])
      if (!alive) return
      setSubject(syl)
      setCompleted(done)
      setLoading(false)
      firstRender.current = true
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, effPhone])

  const score = useMemo(
    () => (subject ? calculateScore(subject, completed) : null),
    [subject, completed],
  )

  // Debounced autosave whenever the completed set changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!effPhone || !subject || !score) return
    setSaveState('saving')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        await saveProgress({
          phone: effPhone,
          name: user.name,
          subjectId: id,
          completed: [...completed],
          earned: Math.trunc(score.finalScore),
        })
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 2500)
      } catch {
        setSaveState('error')
      }
    }, 700)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed])

  const toggleTopic = useCallback((topicId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(topicId)) next.delete(topicId)
      else next.add(topicId)
      return next
    })
  }, [])

  const toggleChapter = useCallback((chap: Chapter, on: boolean) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      for (const t of chap.topics) {
        if (on) next.add(t.id)
        else next.delete(t.id)
      }
      return next
    })
  }, [])

  return (
    <>
      <StatusBanner user={user} saveState={saveState} />

      {loading || !subject || !score ? (
        <TrackerSkeleton backHref={`/${user.carry}`} />
      ) : (
        <>
          <header className="hero">
            <div className="container">
              <div className="row" style={{ paddingTop: 12 }}>
                <Link to={`/${user.carry}`} className="btn btn-ghost btn-sm">
                  ← সব বিষয়
                </Link>
                <div className="spacer" />
                <ThemeToggle />
              </div>
              <div className="hero-inner">
                <ProgressRing percent={score.percent} />
                <div className="titles" style={{ flex: 1 }}>
                  <h2>
                    <MathText text={subject.title} />
                  </h2>
                  <div className={`grade ${score.percent >= 80 ? 'aplus' : ''}`}>{gradeMessage(score)}</div>
                </div>
              </div>
              <div style={{ paddingBottom: 14 }}>
                <ScoreBreakdown score={score} subject={subject} />
              </div>
            </div>
          </header>

          <main className="container" style={{ paddingBottom: 60 }}>
            {subject.sections.map((sec) => (
              <SectionBlock
                key={sec.id}
                section={sec}
                alt={!!subject.alt_marks_scheme}
                cqLabel={subject.cq_label?.trim() || 'CQ'}
                completed={completed}
                onToggleTopic={toggleTopic}
                onToggleChapter={toggleChapter}
              />
            ))}
          </main>
        </>
      )}
    </>
  )
}

function SectionBlock({
  section,
  alt,
  cqLabel,
  completed,
  onToggleTopic,
  onToggleChapter,
}: {
  section: Section
  alt: boolean
  cqLabel: string
  completed: Set<string>
  onToggleTopic: (id: string) => void
  onToggleChapter: (chap: Chapter, on: boolean) => void
}) {
  return (
    <div className="section-block">
      <div className="section-bar">
        <h3>
          <MathText text={section.title} />
        </h3>
        {section.total_cq_available > 0 &&
          (alt ? (
            <span
              className="cq-badge"
              title={
                section.min_cq_required > 0
                  ? `${section.total_cq_available}টি ${cqLabel} প্রশ্নের মধ্যে যেকোনো ${section.min_cq_required}টির উত্তর · প্রতিটি ${section.cq_value_per_q} নম্বর`
                  : `এই অংশের ${section.total_cq_available}টি ${cqLabel} প্রশ্ন · প্রতিটি ${section.cq_value_per_q} নম্বর`
              }
            >
              {section.min_cq_required > 0
                ? `${cqLabel}: যেকোনো ${section.min_cq_required}/${section.total_cq_available} · ${section.min_cq_required * section.cq_value_per_q} নম্বর`
                : `${cqLabel}: ${section.total_cq_available}টি প্রশ্ন · ${section.total_cq_available * section.cq_value_per_q} নম্বর`}
            </span>
          ) : (
            <span
              className={`cq-badge ${section.min_cq_required > 0 ? '' : 'optional'}`}
              title={
                section.min_cq_required > 0
                  ? `এই অংশের ${section.total_cq_available}টি সৃজনশীল প্রশ্ন থেকে অন্তত ${section.min_cq_required}টির উত্তর আবশ্যক`
                  : `এই অংশের অধ্যায়গুলো থেকে ${section.total_cq_available}টি সৃজনশীল প্রশ্ন আসবে (উত্তর দেওয়া বাধ্যতামূলক নয়)`
              }
            >
              {section.min_cq_required > 0
                ? `CQ: ${section.total_cq_available}টির মধ্যে ${section.min_cq_required}টি আবশ্যক`
                : `CQ: ${section.total_cq_available}টি প্রশ্ন আসবে`}
            </span>
          ))}
      </div>
      {section.chapters.map((chap) => (
        <ChapterRow
          key={chap.id}
          chapter={chap}
          completed={completed}
          onToggleTopic={onToggleTopic}
          onToggleChapter={onToggleChapter}
        />
      ))}
    </div>
  )
}

function ChapterRow({
  chapter,
  completed,
  onToggleTopic,
  onToggleChapter,
}: {
  chapter: Chapter
  completed: Set<string>
  onToggleTopic: (id: string) => void
  onToggleChapter: (chap: Chapter, on: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const checkRef = useRef<HTMLInputElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [maxH, setMaxH] = useState(0)

  const doneCount = chapter.topics.filter((t) => completed.has(t.id)).length
  const allDone = chapter.topics.length > 0 && doneCount === chapter.topics.length
  const someDone = doneCount > 0 && !allDone

  useEffect(() => {
    if (checkRef.current) checkRef.current.indeterminate = someDone
  }, [someDone])

  // Animate the panel to its exact content height (robust across engines).
  useLayoutEffect(() => {
    setMaxH(open && innerRef.current ? innerRef.current.scrollHeight : 0)
  }, [open, chapter.topics.length])

  const pct = chapter.topics.length > 0 ? (doneCount / chapter.topics.length) * 100 : 0

  return (
    <div className={`chapter ${open ? 'open' : ''}`}>
      <div className="chapter-head" onClick={() => setOpen((o) => !o)}>
        <input
          ref={checkRef}
          type="checkbox"
          className={`chk ${someDone ? 'indeterminate' : ''}`}
          checked={allDone}
          onChange={(e) => onToggleChapter(chapter, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
          aria-label="অধ্যায়ের সব টপিক"
        />
        <div className={`chapter-title ${allDone ? 'done' : ''}`}>
          <MathText text={chapter.title} />
        </div>
        {doneCount > 0 ? (
          <span className="done-count">{allDone ? '✓ সম্পন্ন' : `${doneCount}/${chapter.topics.length}`}</span>
        ) : (
          <span className="est-badge">
            MCQ {chapter.est_mcq}
            {chapter.est_sq > 0 && (
              <>
                {' · '}
                <span className="sq">SQ {chapter.est_sq}</span>
              </>
            )}
          </span>
        )}
        <span className={`chev ${open ? 'open' : ''}`} aria-hidden="true">
          <Chevron />
        </span>
        {doneCount > 0 && (
          <span className="chapter-progress">
            <i style={{ width: `${pct}%` }} />
          </span>
        )}
      </div>

      <div className={`topic-wrap ${open ? 'open' : ''}`} style={{ maxHeight: maxH }}>
        <div className="topic-wrap-inner" ref={innerRef}>
          <ul className="topic-list">
            {chapter.topics.map((t) => {
              const done = completed.has(t.id)
              return (
                <li key={t.id} className="topic">
                  <input type="checkbox" className="chk" checked={done} onChange={() => onToggleTopic(t.id)} />
                  <span className={`topic-name ${done ? 'done' : ''}`} onClick={() => onToggleTopic(t.id)}>
                    <MathText text={t.title} />
                  </span>
                  <StarRating weight={t.weight} />
                </li>
              )
            })}
            {chapter.topics.length === 0 && <li className="muted" style={{ fontSize: '0.85rem' }}>কোনো টপিক নেই</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function TrackerSkeleton({ backHref }: { backHref: string }) {
  return (
    <>
      <header className="hero">
        <div className="container">
          <div style={{ paddingTop: 12 }}>
            <Link to={backHref} className="btn btn-ghost btn-sm">
              ← সব বিষয়
            </Link>
          </div>
          <div className="hero-inner">
            <div className="skeleton" style={{ width: 92, height: 92, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 13, width: '40%' }} />
            </div>
          </div>
          <div className="skeleton" style={{ height: 22, marginBottom: 14 }} />
        </div>
      </header>
      <main className="container">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 52, margin: '10px 0', borderRadius: 14 }} />
        ))}
      </main>
    </>
  )
}
