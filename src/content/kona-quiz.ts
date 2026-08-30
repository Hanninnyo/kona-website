import type { DrinkId } from './drinks'

/**
 * Find Your Kona — the five-question drink quiz.
 *
 * Every possible result is one of the seven real, photographed drinks in
 * `drinks.ts` — the scoring engine in `src/lib/kona-quiz/recommend.ts` can
 * only ever return a member of that list, so no answer combination can
 * recommend a drink that does not exist. Descriptor tags are drawn only from
 * each drink's own confirmed ingredients or name (see `drinks.ts`); nothing
 * here invents a flavor note.
 *
 * The temperature question (`temp`) is a hard constraint, not a leaning —
 * "Hot" or "Iced" narrows the candidate pool to drinks actually served that
 * way before the other four questions are scored, the same pattern the
 * existing bean-and-drink quiz (`discovery.ts`) uses for its decaf answer.
 * "Surprise me" applies no constraint.
 */

export type QuizTag =
  | 'comforting'
  | 'refreshing'
  | 'bright'
  | 'indulgent'
  | 'nutty'
  | 'tropical'
  | 'chocolate'
  | 'rich'
  | 'smooth'
  | 'earthy'
  | 'fruity'
  | 'classic'
  | 'adventurous'

export type TagWeights = Partial<Record<QuizTag, number>>

export interface QuizOption {
  id: string
  label: string
  tags: TagWeights
  /** A hard constraint applied before scoring, e.g. 'hot' or 'iced'. */
  requiresTemperature?: 'hot' | 'iced'
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: QuizOption[]
}

interface QuizContent {
  eyebrow: string
  heading: string
  supportingLine: string
  questions: QuizQuestion[]
  affinities: Record<DrinkId, TagWeights>
  result: {
    heading: string
    primaryAction: string
    secondaryAction: string
    saveAction: string
    startOverAction: string
    backAction: string
  }
}

export const quizContent: QuizContent = {
  eyebrow: 'Find Your Kona',
  heading: 'Your Perfect Kona Is Waiting',
  supportingLine: 'So many ways to make Kona yours.',
  questions: [
    {
      id: 'feel',
      prompt: 'How do you want to feel?',
      options: [
        { id: 'comforted', label: 'Comforted', tags: { comforting: 3, smooth: 1 } },
        { id: 'refreshed', label: 'Refreshed', tags: { refreshing: 3, bright: 1 } },
        { id: 'energized', label: 'Energized', tags: { bright: 2, refreshing: 1 } },
        { id: 'indulgent', label: 'Indulgent', tags: { indulgent: 3, rich: 1 } },
      ],
    },
    {
      id: 'temperature',
      prompt: 'Hot or iced?',
      options: [
        { id: 'hot', label: 'Hot', tags: {}, requiresTemperature: 'hot' },
        { id: 'iced', label: 'Iced', tags: {}, requiresTemperature: 'iced' },
        { id: 'surprise', label: 'Surprise me', tags: {} },
      ],
    },
    {
      id: 'flavor',
      prompt: 'Choose your flavor mood',
      options: [
        { id: 'nutty-tropical', label: 'Nutty and tropical', tags: { nutty: 3, tropical: 2 } },
        { id: 'rich-chocolatey', label: 'Rich and chocolatey', tags: { chocolate: 3, rich: 2 } },
        { id: 'sweet-creamy', label: 'Sweet and creamy', tags: { smooth: 3 } },
        { id: 'earthy-balanced', label: 'Earthy and balanced', tags: { earthy: 3 } },
        { id: 'bright-fruity', label: 'Bright and fruity', tags: { bright: 3, fruity: 3 } },
      ],
    },
    {
      id: 'adventure',
      prompt: 'How adventurous are you?',
      options: [
        { id: 'classic', label: 'Keep it classic', tags: { classic: 3 } },
        { id: 'twist', label: 'A little island twist', tags: { tropical: 2 } },
        { id: 'surprise', label: 'Surprise me completely', tags: { adventurous: 3 } },
      ],
    },
    {
      id: 'moment',
      prompt: 'Choose your perfect moment',
      options: [
        { id: 'morning-reset', label: 'Morning reset', tags: { comforting: 2, classic: 1 } },
        { id: 'afternoon-escape', label: 'Afternoon escape', tags: { refreshing: 2, tropical: 1 } },
        { id: 'something-sweet', label: 'Something sweet', tags: { indulgent: 2, chocolate: 1 } },
        { id: 'weekend-treat', label: 'Weekend treat', tags: { indulgent: 1, adventurous: 2 } },
      ],
    },
  ],

  /**
   * Each drink's affinity for the tags above — 1 per genuinely matching
   * property, the same convention `discovery.ts` uses. Traceable to
   * `drinks.ts`: nutty/tropical/comforting for the macadamia-coconut Kona
   * Island Latte, classic/comforting for Captain Cook's vanilla-honey-cinnamon
   * warmth, tropical/adventurous for ube, chocolate/rich/adventurous for
   * Nutella, tropical/refreshing/bright/fruity for the two iced refreshers,
   * and classic/smooth/earthy/comforting for the unflavored Classic Latte.
   */
  affinities: {
    'kona-island-latte': { nutty: 1, tropical: 1, comforting: 1, smooth: 1, indulgent: 1 },
    'captain-cook': { comforting: 1, classic: 1, smooth: 1, earthy: 1 },
    'hilo-ube': { tropical: 1, smooth: 1, adventurous: 1, indulgent: 1 },
    'nutella-latte': { chocolate: 1, rich: 1, indulgent: 1, adventurous: 1 },
    'island-coco-refresher': { tropical: 1, refreshing: 1, bright: 1, fruity: 1 },
    'blue-hawaii-refresher': { refreshing: 1, bright: 1, fruity: 1, adventurous: 1 },
    'classic-latte': { classic: 1, smooth: 1, comforting: 1, earthy: 1 },
  },

  result: {
    heading: 'Your Kona Match',
    primaryAction: 'Order Your Match',
    secondaryAction: 'See Another Match',
    saveAction: 'Save My Kona',
    startOverAction: 'Start Again',
    backAction: 'Back',
  },
}
