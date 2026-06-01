import type { ScoreResult, SubjectWithSyllabus } from '../lib/types'

interface Seg {
  key: 'cq' | 'mcq' | 'sq'
  label: string
  earned: number
  max: number
}

export default function ScoreBreakdown({
  score,
  subject,
}: {
  score: ScoreResult
  subject: SubjectWithSyllabus
}) {
  const segs: Seg[] = [
    { key: 'cq' as const, label: 'CQ', earned: score.finalCQ, max: subject.max_cq },
    { key: 'mcq' as const, label: 'MCQ', earned: score.finalMCQ, max: subject.max_mcq },
    { key: 'sq' as const, label: 'SQ', earned: score.finalSQ, max: subject.max_sq },
  ].filter((s) => s.max > 0)

  const total = score.totalPossible || 1

  return (
    <div>
      <div className="score-line">
        <span>আনুমানিক নম্বর</span>
        <span>
          <b>{Math.trunc(score.finalScore)}</b> / {score.totalPossible}
        </span>
      </div>
      <div className="breakdown">
        {segs.map((s) => {
          const fillPct = s.max > 0 ? (s.earned / s.max) * 100 : 0
          return (
            <div
              key={s.key}
              className={`seg ${s.key}`}
              style={{ flexBasis: `${(s.max / total) * 100}%` }}
              title={`${s.label}: ${Math.trunc(s.earned)} / ${s.max}`}
            >
              <div className="fill" style={{ width: `${fillPct}%` }} />
              <div className="lbl">
                {s.label} {Math.trunc(s.earned)}/{s.max}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
