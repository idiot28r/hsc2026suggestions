export default function ProgressRing({ percent, size = 92 }: { percent: number; size?: number }) {
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, percent))
  const offset = c - (pct / 100) * c
  // Hue 0 (red) → 140 (green) as the student nears completion.
  const hue = Math.round(140 * (pct / 100))
  const color = `hsl(${hue}, 72%, 45%)`

  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" style={{ stroke: 'var(--track)' }} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .6s ease, stroke .4s ease' }}
        />
      </svg>
      <div className="pct">
        <b style={{ color }}>{pct}%</b>
        <span>প্রস্তুতি</span>
      </div>
    </div>
  )
}
