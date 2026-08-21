import type { DiscoveryContent } from './types'

/**
 * Find Your Kona — content and scoring data.
 *
 * Every bean and drink here is verified. Flavour descriptions are rendered as
 * written and are never expanded into additional tasting notes or ingredients.
 * Three rules matter especially:
 *
 * 1. Chocolate Macadamia and Hazelnut are intentionally flavoured coffees. The
 *    flavour is added, not a naturally occurring note, and each carries a
 *    clarification saying so.
 * 2. The Kauaʻi decaf is 100% Hawaiian coffee. It is not Kona coffee, and the
 *    distinction is stated wherever it appears.
 * 3. Decaf, owner-confirmed: every espresso-based drink can be prepared with
 *    decaf espresso, and decaf pour-over is available. `espressoBased` is set
 *    from each drink's own verified description and best-match data — all five
 *    are espresso drinks — and it is what gates the availability line. Nothing
 *    claims a café drink is prepared with the retail Kauaʻi Decaf bean; that
 *    is a separate operational fact and has not been confirmed.
 *
 * The bean and the drink are two independent recommendations, connected by
 * flavour and mood. Nothing here claims a café drink is prepared with the
 * recommended retail bean, and no copy should imply it.
 *
 * Prices and photography are deliberately absent from this phase; the layout
 * is ready for approved photography without depending on it.
 *
 * ── Weighting convention ─────────────────────────────────────────────────
 * Answer tags: 3 = what the visitor actually said, 2 = a close consequence of
 * it, 1 = a mild leaning. Bean and drink affinities are 1 per genuinely
 * matching tag, so the visitor's own emphasis drives the outcome rather than a
 * hand-tuned per-product curve. The single exception is the decaf affinity,
 * which is a defining property of the Kauaʻi bean rather than a leaning.
 */
export const discovery: DiscoveryContent = {
  eyebrow: 'A guided coffee discovery',
  heading: 'Find Your Kona',
  intro:
    'Three quick choices. One Kona coffee and one café drink selected for you.',
  invitationMeta: 'Takes less than a minute',
  beginLabel: 'Begin the Experience',
  /** Shown under the options until one is chosen, then replaced by Continue. */
  choosePrompt: 'Choose one to continue',

  questions: [
    {
      id: 'mood',
      prompt: 'What kind of moment are you looking for?',
      options: [
        {
          id: 'comforting',
          label: 'Comforting',
          detail: 'Warm, familiar and easy to settle into',
          tags: { comforting: 3, warm: 2, smooth: 1 },
        },
        {
          id: 'bright',
          label: 'Bright',
          detail: 'Lively, clean and energizing',
          tags: { bright: 3, energizing: 2, clean: 1 },
        },
        {
          id: 'indulgent',
          label: 'Indulgent',
          detail: 'Rich, layered and dessert-like',
          tags: { indulgent: 3, rich: 2 },
        },
        {
          id: 'tropical',
          label: 'Tropical',
          detail: 'Island-inspired and unexpected',
          tags: { tropical: 3 },
        },
      ],
    },
    {
      id: 'flavor',
      prompt: 'Which flavor direction sounds best?',
      options: [
        {
          id: 'chocolate-caramel',
          label: 'Chocolate & caramel',
          tags: { chocolate: 3, caramel: 3, smooth: 1 },
        },
        {
          id: 'bright-fruity',
          label: 'Bright & fruity',
          tags: { fruity: 3, bright: 2, clean: 2 },
        },
        {
          id: 'toasted-nutty',
          label: 'Toasted & nutty',
          tags: { toasted: 3, nutty: 3 },
        },
        {
          id: 'smooth-balanced',
          label: 'Smooth & balanced',
          tags: { smooth: 3, balanced: 3 },
        },
        {
          id: 'flavored',
          label: 'Flavored coffee',
          tags: { flavored: 3 },
        },
      ],
    },
    {
      id: 'method',
      prompt: 'How would you enjoy it today?',
      options: [
        { id: 'pour-over', label: 'Pour-over', tags: { 'pour-over': 3 } },
        {
          id: 'espresso-milk',
          label: 'Espresso and milk',
          tags: { 'espresso-milk': 3 },
        },
        { id: 'iced', label: 'Iced', tags: { iced: 3, refreshing: 2 } },
        {
          id: 'beans-at-home',
          label: 'Beans at home',
          tags: { 'beans-at-home': 3 },
        },
        {
          id: 'decaf',
          label: 'Decaf',
          tags: { decaf: 3 },
          // A constraint, not a leaning: a caffeinated bean is the wrong
          // answer here, however well it scores on flavour.
          requiresTag: 'decaf',
        },
      ],
    },
  ],

  beans: [
    {
      id: 'private-estate',
      name: 'Private Estate',
      classification: '100% Kona Coffee',
      roast: 'Medium',
      flavor: 'Smooth, chocolate and caramel',
      personality: 'Balanced, approachable and quietly luxurious',
      rationale:
        'It is the cup that asks nothing of you. Medium roast, smooth through the middle, with chocolate and caramel carrying the finish — the coffee we reach for when the moment matters more than the novelty.',
      affinity: {
        comforting: 1,
        smooth: 1,
        balanced: 1,
        chocolate: 1,
        caramel: 1,
        'pour-over': 1,
        'beans-at-home': 1,
      },
      image: { src: null, alt: '' },
    },
    {
      id: 'peaberry',
      name: 'Peaberry',
      classification: '100% Kona Coffee',
      roast: 'Medium',
      flavor: 'Bright, fruity and clean',
      personality: 'Lively, distinctive and expressive',
      rationale:
        'The most expressive coffee we pour. Bright and clean, with fruit that arrives early and a finish that stays out of the way — it rewards a slow brew and it is unmistakable over ice.',
      affinity: {
        bright: 1,
        fruity: 1,
        clean: 1,
        energizing: 1,
        'pour-over': 1,
        iced: 1,
        'beans-at-home': 1,
      },
      image: { src: null, alt: '' },
    },
    {
      id: 'chocolate-macadamia',
      name: 'Chocolate Macadamia',
      classification: '100% Kona Coffee, flavored',
      roast: 'Medium-to-dark',
      flavor: 'Chocolate and macadamia flavor',
      personality: 'Tropical, comforting and indulgent',
      clarification:
        'A flavored coffee: the chocolate and macadamia are added, not naturally occurring notes of the bean.',
      rationale:
        'The island in a cup, and our most openly generous coffee. A medium-to-dark roast underneath, chocolate and macadamia flavor over the top — comfort and something a little unexpected in the same breath.',
      affinity: {
        tropical: 1,
        comforting: 1,
        chocolate: 1,
        nutty: 1,
        flavored: 1,
        'pour-over': 1,
        'beans-at-home': 1,
      },
      image: { src: null, alt: '' },
    },
    {
      id: 'hazelnut',
      name: 'Hazelnut',
      classification: '100% Kona Coffee, flavored',
      roast: 'Medium-to-dark',
      flavor: 'Hazelnut flavor',
      personality: 'Toasted, nutty and indulgent',
      clarification:
        'A flavored coffee: the hazelnut is added, not a naturally occurring note of the bean.',
      rationale:
        'Toasted and unhurried. The medium-to-dark roast gives it weight, the hazelnut flavor gives it warmth, and together they land somewhere close to dessert without ever tipping into it.',
      affinity: {
        nutty: 1,
        toasted: 1,
        indulgent: 1,
        flavored: 1,
        'pour-over': 1,
        'beans-at-home': 1,
      },
      image: { src: null, alt: '' },
    },
    {
      id: 'kauai-decaf',
      name: 'Kauaʻi Decaf',
      classification: '100% Hawaiian coffee',
      roast: 'Medium',
      flavor:
        'Smooth and rich chocolate, toasted nuts, with subtle bright fruitiness or a light floral aroma',
      personality: 'Rich and balanced without caffeine',
      clarification:
        'Grown on Kauaʻi. This is 100% Hawaiian coffee rather than Kona coffee — a distinction we keep, because it is a different island and a different cup.',
      rationale:
        'Proof that decaf need not be a compromise. Chocolate and toasted nuts hold the centre, a little brightness lifts the finish, and the whole cup stays rich enough to sit with late in the day.',
      availability: 'Available as a decaf pour-over.',
      affinity: {
        decaf: 6,
        smooth: 1,
        chocolate: 1,
        nutty: 1,
        balanced: 1,
      },
      image: { src: null, alt: '' },
    },
  ],

  drinks: [
    {
      id: 'kona-island-latte',
      name: 'Kona Island Latte',
      flavor: 'Macadamia and coconut',
      position: 'Kona’s top-selling signature latte, with macadamia and coconut.',
      rationale:
        'Macadamia and coconut, which is about as close as a latte gets to the islands themselves. Rich enough to feel like an occasion, gentle enough for an ordinary morning.',
      espressoBased: true,
      affinity: {
        tropical: 1,
        comforting: 1,
        nutty: 1,
        smooth: 1,
        'espresso-milk': 1,
        iced: 1,
      },
      image: { src: null, alt: '' },
    },
    {
      id: 'captain-cook',
      name: 'Captain Cook',
      flavor: 'Vanilla, honey and cinnamon',
      rationale:
        'Vanilla, honey and cinnamon — warm, familiar and gently spiced. The quietest drink on the menu, and the most comforting.',
      espressoBased: true,
      affinity: {
        comforting: 1,
        smooth: 1,
        warm: 1,
        balanced: 1,
        'espresso-milk': 1,
      },
      image: { src: null, alt: '' },
    },
    {
      id: 'kamoa-mocha',
      name: 'Kamoa Mocha',
      flavor: 'Dark chocolate and raspberry',
      rationale:
        'Dark chocolate with raspberry cutting through it. Rich, but with enough acidity to stay lively — the indulgent choice that does not turn heavy.',
      espressoBased: true,
      affinity: {
        indulgent: 1,
        chocolate: 1,
        rich: 1,
        'espresso-milk': 1,
        iced: 1,
      },
      image: { src: null, alt: '' },
    },
    {
      id: 'nutella',
      name: 'Nutella',
      flavor: 'Chocolate and hazelnut',
      rationale:
        'Chocolate and hazelnut, unapologetically. The most dessert-like drink we make, and the natural landing place for anyone drawn to toasted, nutty flavors.',
      espressoBased: true,
      affinity: {
        indulgent: 1,
        toasted: 1,
        nutty: 1,
        chocolate: 1,
        'espresso-milk': 1,
      },
      image: { src: null, alt: '' },
    },
    {
      id: 'island-coco-refresher',
      name: 'Island Coco Refresher',
      flavor: 'Espresso and coconut water',
      rationale:
        'Espresso and coconut water over ice. Clean, bright and genuinely refreshing — the drink for a warm afternoon that still needs to go somewhere.',
      espressoBased: true,
      affinity: {
        bright: 1,
        tropical: 1,
        refreshing: 1,
        iced: 1,
      },
      image: { src: null, alt: '' },
    },
  ],

  tagLabels: {
    comforting: 'Comforting',
    bright: 'Bright',
    indulgent: 'Indulgent',
    tropical: 'Tropical',
    warm: 'Warm',
    energizing: 'Energizing',
    rich: 'Rich',
    refreshing: 'Refreshing',
    chocolate: 'Chocolate',
    caramel: 'Caramel',
    fruity: 'Fruity',
    clean: 'Clean',
    toasted: 'Toasted',
    nutty: 'Nutty',
    smooth: 'Smooth',
    balanced: 'Balanced',
    flavored: 'Flavored',
    'pour-over': 'Pour-over',
    'espresso-milk': 'Espresso and milk',
    iced: 'Iced',
    'beans-at-home': 'Beans at home',
    decaf: 'Decaf',
  },

  result: {
    eyebrow: 'Find Your Kona',
    heading: 'Your Kona Match',
    beanLabel: 'The coffee',
    drinkLabel: 'The café drink',
    decafDrinkAvailability: 'Available with decaf espresso.',
    viewMenu: { label: 'View Menu', href: '/menu-preview' },
    startAgainLabel: 'Start Again',
  },

  fallback: {
    heading: 'The collection',
    intro:
      'Five coffees, each with its own character. Explore the collection and we will help you choose in person.',
  },
}
