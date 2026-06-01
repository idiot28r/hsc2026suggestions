import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchSubjects, fetchEarnedBySubject } from '../lib/data'
import { GROUPS, type GroupKey, type Subject } from '../lib/types'
import { useUserParams } from '../lib/useUserParams'
import StatusBanner from '../components/StatusBanner'
import ThemeToggle from '../components/ThemeToggle'
import { MathText } from '../lib/math'

const GROUP_STORE = 'hsc2026.group'

export default function SubjectsPage() {
  const navigate = useNavigate()
  const user = useUserParams()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [earned, setEarned] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [group, setGroup] = useState<GroupKey>(() => (localStorage.getItem(GROUP_STORE) as GroupKey) || 'science')
  const tapRef = useRef(0)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const [subs, earnedMap] = await Promise.all([fetchSubjects(), fetchEarnedBySubject(user.phone)])
      if (!alive) return
      setSubjects(subs)
      setEarned(earnedMap)
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [user.phone])

  function pickGroup(g: GroupKey) {
    setGroup(g)
    localStorage.setItem(GROUP_STORE, g)
  }

  const rankOf = (s: Subject, g: GroupKey) =>
    g === 'science' ? s.rank_science : g === 'business' ? s.rank_business : s.rank_humanities

  const visible = useMemo(
    () =>
      subjects
        .filter((s) => rankOf(s, group) !== null)
        .sort((a, b) => (rankOf(a, group)! - rankOf(b, group)!)),
    [subjects, group],
  )

  // Hidden admin entry: tap the brand mark 5× → admin login (gated by ?admin=true).
  function brandTap() {
    tapRef.current += 1
    if (tapRef.current >= 5) {
      tapRef.current = 0
      navigate('/admin?admin=true')
    }
    setTimeout(() => (tapRef.current = 0), 1200)
  }

  return (
    <>
      <StatusBanner user={user} />
      <header className="appbar">
        <div className="container appbar-inner">
          <div className="brand-mark" onClick={brandTap} style={{ cursor: 'pointer' }}>
            HSC
          </div>
          <div>
            <h1>Interactive Suggestions</h1>
            <div className="sub">HSC 2026 · তোমার সাজেশন ট্র্যাকার</div>
          </div>
          <div className="spacer" />
          <ThemeToggle />
        </div>
      </header>

      <main className="container">
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 4px' }}>
          <div className="segment" role="tablist">
            {GROUPS.map((g) => (
              <button
                key={g.key}
                className={group === g.key ? 'active' : ''}
                onClick={() => pickGroup(g.key)}
                role="tab"
                aria-selected={group === g.key}
              >
                {g.emoji} {g.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="subjects-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card subject-card">
                <div className="skeleton" style={{ height: 46, width: 46, borderRadius: 12 }} />
                <div className="skeleton" style={{ height: 16, width: '70%' }} />
                <div className="skeleton" style={{ height: 44 }} />
                <div className="skeleton" style={{ height: 8 }} />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="empty">
            <div className="big">📭</div>
            এই গ্রুপে এখনো কোনো বিষয় যুক্ত করা হয়নি।
          </div>
        ) : (
          <>
            <div className="list-head">
              <h2>{GROUPS.find((g) => g.key === group)?.label}</h2>
              <span className="count">{visible.length} বিষয়</span>
            </div>
            <div className="subjects-grid">
              {visible.map((s) => (
                <SubjectCard
                  key={s.id}
                  subject={s}
                  earned={earned[s.id]}
                  onOpen={() => navigate(`/subject/${s.id}${user.carry}`)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  )
}

function SubjectCard({ subject, earned, onOpen }: { subject: Subject; earned?: number; onOpen: () => void }) {
  const totalPossible = subject.max_cq + subject.max_mcq + subject.max_sq
  const started = earned !== undefined
  const earnedInt = Math.floor(earned ?? 0)
  const pct = started && totalPossible > 0 ? Math.min(100, (earnedInt / totalPossible) * 100) : 0
  const hue = Math.round(140 * (pct / 100))
  const barColor = started ? `hsl(${hue}, 72%, 45%)` : 'var(--idle-bar)'

  return (
    <div className="card subject-card" onClick={onOpen}>
      <div className={`status-chip ${started ? '' : 'idle'}`} style={started ? { background: barColor } : undefined}>
        {started ? `⭐ ${earnedInt}/${totalPossible}` : 'শুরু করোনি'}
      </div>

      <div className="top">
        <div className="subject-icon">{subject.icon_emoji || '📘'}</div>
        <div style={{ minWidth: 0 }}>
          <div className="subject-name">
            <MathText text={subject.title} />
          </div>
          {subject.short_code && <span className="subject-code">{subject.short_code}</span>}
        </div>
      </div>

      <div className="mark-pills">
        <div className="mark-pill">
          <div className="k">CQ</div>
          <div className="v">{subject.max_cq}</div>
        </div>
        <div className="mark-pill">
          <div className="k">MCQ</div>
          <div className="v">{subject.max_mcq}</div>
        </div>
        {subject.max_sq > 0 && (
          <div className="mark-pill sq">
            <div className="k">SQ</div>
            <div className="v">{subject.max_sq}</div>
          </div>
        )}
      </div>

      <div className="subject-progress">
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${pct}%`, background: barColor }} />
        </div>
        <div className="progress-meta">
          <span className="muted">{started ? `${Math.round(pct)}% প্রস্তুতি` : 'ট্র্যাকিং শুরু করো'}</span>
          <span className="subject-cta">খুলুন →</span>
        </div>
      </div>
    </div>
  )
}
