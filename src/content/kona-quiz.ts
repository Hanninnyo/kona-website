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
  /** One of the quiz's own accent tokens — drives the reactive background atmosphere. */
  accent: string
  /** Short, punchy confirmation shown after this option is chosen — never the final result. */
  reaction: string
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
  /** The invitation stage's call-to-action button label. */
  startAction: string
  /** Shown under the start action — sets expectations, invents no variation count. */
  trustLine: string
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
  heading: 'Your Next Favorite Drink Is Five Taps Away.',
  supportingLine: "Tell us your mood. We'll match you with a Kona drink worth craving.",
  startAction: 'Find My Drink',
  trustLine: 'Less than 30 seconds. No email required.',
  questions: [
    {
      id: 'feel',
      prompt: 'How do you want to feel?',
      options: [
        {
          id: 'comforted',
          label: 'Comforted',
          tags: { comforting: 3, smooth: 1 },
          accent: 'var(--color-koa-400)',
          reaction: "Comfort mode. We know just the cup.",
        },
        {
          id: 'refreshed',
          label: 'Refreshed',
          tags: { refreshing: 3, bright: 1 },
          accent: 'var(--color-quiz-turquoise)',
          reaction: 'Refreshed it is. Light and bright, coming up.',
        },
        {
          id: 'energized',
          label: 'Energized',
          tags: { bright: 2, refreshing: 1 },
          accent: 'var(--color-quiz-mango)',
          reaction: "Energized. Let's keep that momentum.",
        },
        {
          id: 'indulgent',
          label: 'Indulgent',
          tags: { indulgent: 3, rich: 1 },
          accent: 'var(--color-koa-600)',
          reaction: "Rich and indulgent. Let's narrow it down.",
        },
      ],
    },
    {
      id: 'temperature',
      prompt: 'Hot or iced?',
      options: [
        {
          id: 'hot',
          label: 'Hot',
          tags: {},
          requiresTemperature: 'hot',
          accent: 'var(--color-gold-500)',
          reaction: 'Hot and cozy. Good choice.',
        },
        {
          id: 'iced',
          label: 'Iced',
          tags: {},
          requiresTemperature: 'iced',
          accent: 'var(--color-quiz-ocean)',
          reaction: 'Iced it is. Staying cool.',
        },
        {
          id: 'surprise',
          label: 'Surprise me',
          tags: {},
          accent: 'var(--color-quiz-coral)',
          reaction: 'No preference? We like that.',
        },
      ],
    },
    {
      id: 'flavor',
      prompt: 'Choose your flavor mood',
      options: [
        {
          id: 'nutty-tropical',
          label: 'Nutty and tropical',
          tags: { nutty: 3, tropical: 2 },
          accent: 'var(--color-gold-400)',
          reaction: 'Nutty and tropical? We already have an idea.',
        },
        {
          id: 'rich-chocolatey',
          label: 'Rich and chocolatey',
          tags: { chocolate: 3, rich: 2 },
          accent: 'var(--color-koa-600)',
          reaction: "Rich and chocolatey. Now we're talking.",
        },
        {
          id: 'sweet-creamy',
          label: 'Sweet and creamy',
          tags: { smooth: 3 },
          accent: 'var(--color-quiz-coconut)',
          reaction: 'Sweet and creamy. Smooth choice.',
        },
        {
          id: 'earthy-balanced',
          label: 'Earthy and balanced',
          tags: { earthy: 3 },
          accent: 'var(--color-koa-400)',
          reaction: 'Earthy and balanced. We respect it.',
        },
        {
          id: 'bright-fruity',
          label: 'Bright and fruity',
          tags: { bright: 3, fruity: 3 },
          accent: 'var(--color-quiz-coral)',
          reaction: 'Bright and fruity? We already have an idea.',
        },
      ],
    },
    {
      id: 'adventure',
      prompt: 'How adventurous are you?',
      options: [
        {
          id: 'classic',
          label: 'Keep it classic',
          tags: { classic: 3 },
          accent: 'var(--color-gold-500)',
          reaction: 'Keeping it classic. One more step closer.',
        },
        {
          id: 'twist',
          label: 'A little island twist',
          tags: { tropical: 2 },
          accent: 'var(--color-quiz-turquoise)',
          reaction: "A little twist. We like where this is going.",
        },
        {
          id: 'surprise',
          label: 'Surprise me completely',
          tags: { adventurous: 3 },
          accent: 'var(--color-quiz-ube)',
          reaction: 'Full surprise mode. Hold on to your cup.',
        },
      ],
    },
    {
      id: 'moment',
      prompt: 'Choose your perfect moment',
      options: [
        {
          id: 'morning-reset',
          label: 'Morning reset',
          tags: { comforting: 2, classic: 1 },
          accent: 'var(--color-gold-500)',
          reaction: "Morning reset. Let's wake things up.",
        },
        {
          id: 'afternoon-escape',
          label: 'Afternoon escape',
          tags: { refreshing: 2, tropical: 1 },
          accent: 'var(--color-quiz-turquoise)',
          reaction: 'Afternoon escape. Almost there.',
        },
        {
          id: 'something-sweet',
          label: 'Something sweet',
          tags: { indulgent: 2, chocolate: 1 },
          accent: 'var(--color-koa-600)',
          reaction: 'Something sweet. One step from your match.',
        },
        {
          id: 'weekend-treat',
          label: 'Weekend treat',
          tags: { indulgent: 1, adventurous: 2 },
          accent: 'var(--color-quiz-ube)',
          reaction: 'Weekend treat. Your match is ready.',
        },
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
