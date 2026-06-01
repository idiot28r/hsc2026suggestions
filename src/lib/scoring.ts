import type { ScoreResult, SubjectWithSyllabus } from './types'

/**
 * Projects a student's expected board-exam score from the set of topics they
 * have marked as "covered". Ported from the SSC interactive-suggestion engine.
 *
 * Model:
 *  - Each chapter has an estimated MCQ and SQ yield. A student earns a fraction
 *    of that yield equal to the fraction of the chapter's topic-weight covered.
 *  - CQ is handled per section: a section can yield up to `total_cq_available`
 *    CQ, scaled by how much of the section is covered. The first
 *    `min_cq_required` of those are "mandatory" (always count); anything beyond
 *    is "overflow" and only counts up to a global cap (you can't answer more CQ
 *    than the paper allows).
 */
export function calculateScore(
  subject: SubjectWithSyllabus,
  completed: ReadonlySet<string>,
): ScoreResult {
  const maxCq = num(subject.max_cq)
  const maxMcq = num(subject.max_mcq)
  const maxSq = num(subject.max_sq)
  const cqValue = num(subject.cq_value_per_q) || 10
  const sqValue = num(subject.sq_value_per_q) || 2

  const totalCqToAnswer = cqValue > 0 ? maxCq / cqValue : 0

  let earnedMcq = 0
  let earnedSqCount = 0
  let mandatoryCq = 0
  let overflowCq = 0
  let minRequiredCqTotal = 0

  for (const sec of subject.sections) {
    let secWeightTotal = 0
    let secWeightEarned = 0

    for (const chap of sec.chapters) {
      let chapWeightTotal = 0
      let chapWeightEarned = 0

      for (const top of chap.topics) {
        const w = num(top.weight)
        chapWeightTotal += w
        if (completed.has(top.id)) chapWeightEarned += w
      }

      const ratio = chapWeightTotal > 0 ? chapWeightEarned / chapWeightTotal : 0
      earnedMcq += ratio * num(chap.est_mcq)
      earnedSqCount += ratio * num(chap.est_sq)

      secWeightTotal += chapWeightTotal
      secWeightEarned += chapWeightEarned
    }

    const secRatio = secWeightTotal > 0 ? secWeightEarned / secWeightTotal : 0
    const minReq = num(sec.min_cq_required)
    const avail = num(sec.total_cq_available)

    minRequiredCqTotal += minReq
    const potential = avail * secRatio
    mandatoryCq += Math.min(potential, minReq)
    overflowCq += Math.max(0, potential - minReq)
  }

  const finalMCQ = Math.min(earnedMcq, maxMcq)
  const finalSQ = Math.min(earnedSqCount * sqValue, maxSq)

  const globalOverflowCap = Math.max(0, totalCqToAnswer - minRequiredCqTotal)
  let finalCQ = (mandatoryCq + Math.min(overflowCq, globalOverflowCap)) * cqValue
  finalCQ = Math.min(finalCQ, maxCq)

  const finalScore = finalMCQ + finalSQ + finalCQ
  const totalPossible = maxMcq + maxSq + maxCq
  const percent = totalPossible > 0 ? Math.round((finalScore / totalPossible) * 100) : 0

  return { finalCQ, finalMCQ, finalSQ, finalScore, totalPossible, percent }
}

/** Star count for a topic importance weight. Mirrors the SSC 3-tier scale:
 *  high (≥80) → 5★, medium (≥40) → 3★, low → 1★. */
export function starsForWeight(weight: number): number {
  const w = num(weight)
  if (w >= 80) return 5
  if (w >= 40) return 3
  return 1
}

/** Bengali motivational line based on how close the student is to A+ (80%). */
export function gradeMessage(score: ScoreResult): string {
  if (score.totalPossible <= 0 || score.finalScore <= 0) {
    return 'সাজেশনের যেসব অংশ তোমার পড়া শেষ হয়েছে — সেগুলোয় টিক দাও'
  }
  if (score.percent >= 80) {
    return 'দারুণ! তোমার A+ পাওয়ার প্রস্তুতি প্রায় সম্পন্ন 🎉'
  }
  const targetAplus = Math.ceil(score.totalPossible * 0.8)
  const marksLeft = Math.max(1, targetAplus - Math.trunc(score.finalScore))
  return `A+ পেতে তোমার আরও ${marksLeft} মার্কের প্রস্তুতি বাকি`
}

function num(v: unknown): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? 0))
  return Number.isFinite(n) ? n : 0
}
