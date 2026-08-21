import { discovery } from '@/content/discovery'
import type {
  DiscoveryBean,
  DiscoveryDrink,
  DiscoveryOption,
  DiscoveryTag,
  QuestionId,
  TagWeights,
} from '@/content/types'

/**
 * Find Your Kona — recommendation engine.
 *
 * Pure, deterministic and free of React: the same answers always produce the
 * same pair, there is no randomness, no network call, no persistence and no
 * dependence on the DOM. That is what makes it verifiable independently of the
 * interface (see `scripts/verify-discovery.ts`).
 *
 * The bean and the drink are scored separately against the same set of
 * weighted tags and returned as two independent recommendations. Nothing here
 * models the café drink as being prepared with the recommended retail bean.
 */

/** A completed set of answers: question id → chosen option id. */
export type DiscoveryAnswers = Partial<Record<QuestionId, string>>

export interface ScoredCandidate<T> {
  item: T
  score: number
  /** Tags that actually contributed, strongest first. Deterministically ordered. */
  matchedTags: DiscoveryTag[]
}

export interface Recommendation {
  bean: ScoredCandidate<DiscoveryBean>
  drink: ScoredCandidate<DiscoveryDrink>
  /** The visitor's chosen options, in question order. */
  selections: DiscoveryOption[]
  /** True when the bean shortlist was narrowed by a constraint such as decaf. */
  beanWasConstrained: boolean
  /**
   * True when the visitor asked for decaf. The bean is constrained to the
   * decaf coffee; the drink is scored normally on mood and flavour and is
   * presented as available with decaf espresso.
   */
  decafRequested: boolean
}

/** The questions, in the order they are asked. */
export const questionOrder: QuestionId[] = discovery.questions.map((q) => q.id)

export function getQuestion(id: QuestionId) {
  const question = discovery.questions.find((q) => q.id === id)
  if (!question) throw new Error(`Unknown discovery question: ${id}`)
  return question
}

/** Resolves answers to option objects, ignoring anything unanswered or stale. */
export function resolveSelections(answers: DiscoveryAnswers): DiscoveryOption[] {
  const selections: DiscoveryOption[] = []
  for (const question of discovery.questions) {
    const chosen = answers[question.id]
    if (chosen === undefined) continue
    const option = question.options.find((o) => o.id === chosen)
    if (option) selections.push(option)
  }
  return selections
}

export function isComplete(answers: DiscoveryAnswers): boolean {
  return discovery.questions.every((question) => {
    const chosen = answers[question.id]
    return (
      chosen !== undefined &&
      question.options.some((option) => option.id === chosen)
    )
  })
}

/**
 * Canonical tag order, taken from the content's label map. Used only as a
 * deterministic tie-break between equally strong descriptors, never as a
 * preference between candidates.
 */
const TAG_ORDER = Object.keys(discovery.tagLabels) as DiscoveryTag[]
const TAG_RANK = new Map(TAG_ORDER.map((tag, index) => [tag, index]))

/** Sums the weighted tags contributed by every selected option. */
function collectTagWeights(selections: DiscoveryOption[]): TagWeights {
  const totals: TagWeights = {}
  for (const option of selections) {
    for (const [tag, weight] of Object.entries(option.tags) as [
      DiscoveryTag,
      number,
    ][]) {
      totals[tag] = (totals[tag] ?? 0) + weight
    }
  }
  return totals
}

/**
 * Scores one candidate: the visitor's weight for a tag multiplied by the
 * candidate's affinity for it, summed. A tag either side is silent about
 * contributes nothing — nothing is ever penalised.
 */
function score<T extends { affinity: TagWeights }>(
  item: T,
  visitorTags: TagWeights
): { total: number; matchedTags: DiscoveryTag[] } {
  const contributions: { tag: DiscoveryTag; value: number }[] = []
  let total = 0

  for (const [tag, visitorWeight] of Object.entries(visitorTags) as [
    DiscoveryTag,
    number,
  ][]) {
    const affinity = item.affinity[tag]
    if (affinity === undefined) continue
    const value = visitorWeight * affinity
    if (value <= 0) continue
    total += value
    contributions.push({ tag, value })
  }

  // Strongest contribution first; ties fall back to the canonical tag order so
  // the descriptor list is stable for identical answers.
  contributions.sort(
    (a, b) =>
      b.value - a.value ||
      (TAG_RANK.get(a.tag) ?? 0) - (TAG_RANK.get(b.tag) ?? 0)
  )

  return { total, matchedTags: contributions.map((c) => c.tag) }
}

/**
 * Picks the highest-scoring candidate.
 *
 * Ties are broken by declaration order in the content file — the first bean or
 * drink listed wins. That is deliberate and documented rather than incidental:
 * it makes every outcome reproducible, and it means the order of the arrays in
 * `discovery.ts` is a content decision with a visible effect.
 */
function pickBest<T extends { affinity: TagWeights }>(
  candidates: T[],
  visitorTags: TagWeights
): ScoredCandidate<T> {
  const [first, ...rest] = candidates
  if (first === undefined) {
    throw new Error('Cannot recommend from an empty candidate pool')
  }

  const opening = score(first, visitorTags)
  let best: ScoredCandidate<T> = {
    item: first,
    score: opening.total,
    matchedTags: opening.matchedTags,
  }

  for (const item of rest) {
    const { total, matchedTags } = score(item, visitorTags)
    // Strictly greater keeps the earliest declared candidate on a tie.
    if (total > best.score) {
      best = { item, score: total, matchedTags }
    }
  }

  return best
}

/**
 * Applies any hard constraints the selected options declare.
 *
 * A constraint that would empty the pool is ignored rather than allowed to
 * fail. That is what shapes the decaf case: the decaf answer constrains the
 * beans, because only the Kauaʻi decaf carries the tag, while the drinks carry
 * no decaf tag at all and so keep scoring normally on mood and flavour. Every
 * café drink is espresso-based and can be made with decaf espresso, so the
 * highest-scoring drink is the right recommendation either way.
 */
function applyConstraints<T extends { affinity: TagWeights }>(
  candidates: T[],
  selections: DiscoveryOption[]
): { pool: T[]; constrained: boolean } {
  let pool = candidates
  let constrained = false

  for (const option of selections) {
    const required = option.requiresTag
    if (required === undefined) continue
    const filtered = pool.filter((item) => item.affinity[required] !== undefined)
    if (filtered.length === 0) continue
    pool = filtered
    constrained = true
  }

  return { pool, constrained }
}

/**
 * Produces one bean and one café drink for a completed set of answers.
 *
 * Returns null when the answers are incomplete, so callers never render a
 * half-formed result.
 */
export function recommend(answers: DiscoveryAnswers): Recommendation | null {
  if (!isComplete(answers)) return null

  const selections = resolveSelections(answers)
  const visitorTags = collectTagWeights(selections)

  const beans = applyConstraints(discovery.beans, selections)
  const drinks = applyConstraints(discovery.drinks, selections)

  return {
    bean: pickBest(beans.pool, visitorTags),
    drink: pickBest(drinks.pool, visitorTags),
    selections,
    beanWasConstrained: beans.constrained,
    decafRequested: selections.some((option) => option.requiresTag === 'decaf'),
  }
}

/**
 * A plain-language summary of what the visitor asked for, used to open the
 * explanation of each recommendation. Built from their own words: it never
 * asserts anything about the coffee itself.
 */
export function describeSelections(selections: DiscoveryOption[]): string {
  const labels = selections.map((option) => option.label.toLowerCase())
  if (labels.length === 0) return ''
  if (labels.length === 1) return labels[0]
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
}
