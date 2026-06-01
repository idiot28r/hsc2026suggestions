import type { ScoreResult, SubjectWithSyllabus } from '../lib/types'

interface Seg {
  key: string
  label: string
  earned: number
  max: number
  bg: string
  fill: string
  text: string
}

export default function ScoreBreakdown({
  score,
  subject,
}: {
  score: ScoreResult
  subject: SubjectWithSyllabus
}) {
  const segs: Seg[] = [
    { key: 'cq', label: 'CQ', earned: score.finalCQ, max: subject.max_cq, bg: '#e0e7ff', fill: '#4f46e5', text: '#1e3a8a' },
    { key: 'mcq', label: 'MCQ', earned: score.finalMCQ, max: subject.max_mcq, bg: '#d1fae5', fill: '#10b981', text: '#064e3b' },
    { key: 'sq', label: 'SQ', earned: score.finalSQ, max: subject.max_sq, bg: '#fef3c7', fill: '#f59e0b', text: '#78350f' },
  ].filter((s) => s.max > 0)

  const total = score.totalPossible || 1

  return (
    <div>
      <div className="score-line">
        <span>আনুমানিক নম্বর</span>
        <span>
          {Math.trunc(score.finalScore)} / {score.totalPossible}
        </span>
      </div>
      <div className="breakdown">
        {segs.map((s) => {
          const fillPct = s.max > 0 ? (s.earned / s.max) * 100 : 0
          return (
            <div
              key={s.key}
              className="seg"
              style={{ flexBasis: `${(s.max / total) * 100}%`, background: s.bg }}
              title={`${s.label}: ${Math.trunc(s.earned)} / ${s.max}`}
            >
              <div className="fill" style={{ width: `${fillPct}%`, background: s.fill }} />
              <div className="lbl" style={{ color: s.text }}>
                {s.label} {Math.trunc(s.earned)}/{s.max}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
