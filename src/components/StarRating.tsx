import { starsForWeight } from '../lib/scoring'

export default function StarRating({ weight, max = 5 }: { weight: number; max?: number }) {
  const filled = starsForWeight(weight)
  return (
    <span className="stars" title={`গুরুত্ব: ${weight}%`} aria-label={`${filled} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < filled ? '' : 'off'}>
          ★
        </span>
      ))}
    </span>
  )
}
