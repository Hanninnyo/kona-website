import { drinks, type Drink, type DrinkId } from '@/content/drinks'
import { quizContent, type TagWeights } from '@/content/kona-quiz'

/**
 * Find Your Kona (drinks) — recommendation engine.
 *
 * Pure and deterministic, following the same shape as
 * `src/lib/discovery/recommendation.ts`: no randomness, no network call, no
 * persistence, no DOM dependency. The candidate pool is always exactly the
 * seven drinks in `drinks.ts`, so every possible result is a real,
 * photographed, owner-confirmed product — there is no path to an invented one.
 */

export type QuizAnswers = Partial<Record<string, string>>

export interface ScoredDrink {
  drink: Drink
  score: number
}

export interface QuizRecommendation {
  primary: ScoredDrink
  /** The next-highest-scoring drink, distinct from the primary. */
  secondary: ScoredDrink
}

const questionOrder = quizContent.questions.map((q) => q.id)

export function isQuizComplete(answers: QuizAnswers): boolean {
  return questionOrder.every((id) => answers[id] !== undefined)
}

function findOption(questionId: string, optionId: string) {
  const question = quizContent.questions.find((q) => q.id === questionId)
  return question?.options.find((o) => o.id === optionId)
}

function collectTagWeights(answers: QuizAnswers): TagWeights {
  const totals: TagWeights = {}
  for (const questionId of questionOrder) {
    const optionId = answers[questionId]
    if (optionId === undefined) continue
    const option = findOption(questionId, optionId)
    if (!option) continue
    for (const [tag, weight] of Object.entries(option.tags)) {
      const key = tag as keyof TagWeights
      totals[key] = (totals[key] ?? 0) + (weight ?? 0)
    }
  }
  return totals
}

/** The hard temperature constraint, if the visitor asked for one. */
function requiredTemperature(answers: QuizAnswers): 'hot' | 'iced' | undefined {
  for (const questionId of questionOrder) {
    const optionId = answers[questionId]
    if (optionId === undefined) continue
    const option = findOption(questionId, optionId)
    if (option?.requiresTemperature) return option.requiresTemperature
  }
  return undefined
}

function score(drink: Drink, visitorTags: TagWeights): number {
  const affinity = quizContent.affinities[drink.id]
  let total = 0
  for (const [tag, visitorWeight] of Object.entries(visitorTags)) {
    const drinkAffinity = affinity[tag as keyof TagWeights]
    if (drinkAffinity === undefined || visitorWeight === undefined) continue
    total += visitorWeight * drinkAffinity
  }
  return total
}

/**
 * Highest-scoring drink first; ties broken by declaration order in
 * `drinks.ts`, so every outcome is reproducible from the same answers.
 */
function rank(pool: Drink[], visitorTags: TagWeights): ScoredDrink[] {
  return pool
    .map((drink) => ({ drink, score: score(drink, visitorTags) }))
    .sort((a, b) => b.score - a.score)
}

export function recommendDrinks(answers: QuizAnswers): QuizRecommendation | null {
  if (!isQuizComplete(answers)) return null

  const temperature = requiredTemperature(answers)
  const pool = temperature
    ? drinks.filter((d) => d.temperature.includes(temperature))
    : drinks

  const visitorTags = collectTagWeights(answers)
  const ranked = rank(pool.length > 0 ? pool : drinks, visitorTags)

  const primary = ranked[0]
  const secondary = ranked.find((candidate) => candidate.drink.id !== primary.drink.id) ?? primary

  return { primary, secondary }
}

/** Every drink id reachable as a result, for verification. */
export function allPossibleResults(): DrinkId[] {
  return drinks.map((d) => d.id)
}

export interface LiveRankEntry {
  drink: Drink
  score: number
  /** True once a temperature answer rules this drink out entirely. */
  eliminated: boolean
}

/**
 * A live, in-progress ranking from whatever subset of questions has been
 * answered so far — used only to drive the intro/question stage's reactive
 * drink visual (fading out temperature-eliminated drinks, brightening likely
 * matches). Never used to reveal or imply the final result early: with no
 * answers yet every drink scores 0 and none is eliminated, so the visual
 * starts neutral.
 */
export function getLiveRanking(answers: QuizAnswers): LiveRankEntry[] {
  const temperature = requiredTemperature(answers)
  const visitorTags = collectTagWeights(answers)
  return drinks
    .map((drink) => ({
      drink,
      score: score(drink, visitorTags),
      eliminated: temperature !== undefined && !drink.temperature.includes(temperature),
    }))
    .sort((a, b) => b.score - a.score)
}
