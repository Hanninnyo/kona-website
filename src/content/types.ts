/**
 * Types for centralised, verified business content.
 *
 * Operational facts (hours, phone, schedules) change without a code deploy and
 * have historically drifted across components. They live here once, and each
 * carries an explicit verification state so unconfirmed information is never
 * silently presented as fact.
 */

/** Whether a fact has been confirmed by the business owner. */
export type VerificationState = 'verified' | 'needs-owner-confirmation'

/**
 * A value that must not be rendered as fact until confirmed. Consumers are
 * expected to check `state` before display.
 */
export interface Verifiable<T> {
  value: T
  state: VerificationState
  /** Why this is unconfirmed, and what would confirm it. */
  note?: string
}

export interface PostalAddress {
  street: string
  unit?: string
  city: string
  region: string
  postalCode: string
  country: string
}

export interface OrderingDestination {
  label: string
  url: string
}

export interface Location {
  id: 'mountain-view' | 'coffee-truck'
  name: string
  kind: 'cafe' | 'mobile'
  /** Short description of what this location actually is. */
  summary: string
  address: PostalAddress
  /** Set when the location sits inside a named centre or campus. */
  district?: string
  directionsUrl: string
  ordering: OrderingDestination
  /** Unconfirmed until the owner re-verifies. Never render as fact when unverified. */
  hours: Verifiable<string[]>
}

export interface ContactDetails {
  phone: Verifiable<string>
  email: Verifiable<string>
}

export interface NavItem {
  label: string
  href: string
  /** True for links leaving the site; rendered with an external affordance. */
  external?: boolean
  /** Describes where the link goes when the label alone is ambiguous. */
  description?: string
}

export interface SiteContent {
  brand: {
    name: string
    tagline: string
    positioning: string
    logoMark: {
      src: string
      /** No approved horizontal wordmark exists yet. */
      wordmark: null
      width: number
      height: number
    }
  }
  navigation: NavItem[]
  primaryAction: NavItem
  /**
   * The two places a visitor can order from, offered as a single choice rather
   * than as competing buttons. Both URLs are owner-confirmed.
   */
  orderDestinations: NavItem[]
  locations: Location[]
  giftCardsUrl: string
  contact: ContactDetails
  /** Empty until verified profile URLs are supplied; no placeholder links. */
  socialProfiles: NavItem[]
}

/** A section of homepage copy with an optional image slot. */
export interface ImageSlot {
  /** Null while approved photography is outstanding. */
  src: string | null
  alt: string
  /** Shown in place of the image, and to the owner as a brief. */
  awaiting: string
  aspect: 'portrait' | 'landscape' | 'wide'
}

export interface Principle {
  id: string
  title: string
  statement: string
  detail: string
}

/**
 * One of the two ways to experience Kona. Both destinations carry equal weight
 * in the layout: the café and the truck are one brand, not a flagship and a
 * footnote.
 */
export interface VisitDestination {
  id: Location['id']
  label: string
  description: string
  /** Verified address line. Never hours, never a schedule. */
  place: string
  /** Directions, or wherever the visitor goes to find this destination. */
  primary: NavItem
  /** The verified ordering destination for this location. */
  secondary: NavItem
  image: ImageSlot
}

export interface HomepageContent {
  hero: {
    eyebrow: string
    headline: string
    positioning: string
    place: string
    image: ImageSlot
    actions: { visit: NavItem; order: NavItem }
  }
  principles: {
    eyebrow: string
    heading: string
    intro: string
    items: Principle[]
  }
  space: {
    eyebrow: string
    heading: string
    lines: string[]
    body: string
    images: ImageSlot[]
  }
  visit: {
    eyebrow: string
    heading: string
    intro: string
    destinations: VisitDestination[]
  }
}

/* ==========================================================================
   Find Your Kona — guided discovery
   ========================================================================== */

/**
 * The vocabulary the discovery experience reasons in.
 *
 * Every tag is either a mood, a flavour direction, or a way of drinking
 * coffee. Answers contribute weighted tags; beans and drinks declare which
 * tags they genuinely match. Nothing outside this union can influence a
 * recommendation, which keeps the engine closed and auditable.
 */
export type DiscoveryTag =
  // mood
  | 'comforting'
  | 'bright'
  | 'indulgent'
  | 'tropical'
  | 'warm'
  | 'energizing'
  | 'rich'
  | 'refreshing'
  // flavour
  | 'chocolate'
  | 'caramel'
  | 'fruity'
  | 'clean'
  | 'toasted'
  | 'nutty'
  | 'smooth'
  | 'balanced'
  | 'flavored'
  // how it is enjoyed
  | 'pour-over'
  | 'espresso-milk'
  | 'iced'
  | 'beans-at-home'
  | 'decaf'

/** Tag → weight. A missing tag means no affinity, not a negative one. */
export type TagWeights = Partial<Record<DiscoveryTag, number>>

/**
 * An image placement that is ready for approved photography.
 *
 * Unlike `ImageSlot` this carries no owner-facing brief: the discovery
 * experience is customer-facing, so an empty slot renders as a composed
 * typographic panel rather than as a "photography pending" notice.
 */
export interface DiscoveryImage {
  /** Null until approved photography is delivered. */
  src: string | null
  alt: string
}

export type BeanId =
  | 'private-estate'
  | 'peaberry'
  | 'chocolate-macadamia'
  | 'hazelnut'
  | 'kauai-decaf'

export interface DiscoveryBean {
  id: BeanId
  name: string
  /** e.g. "100% Kona Coffee" or "100% Hawaiian coffee". Rendered verbatim. */
  classification: string
  roast: string
  /** Verified flavour description. Never paraphrased into new tasting notes. */
  flavor: string
  personality: string
  /**
   * An explicit clarification shown with the result — used for the flavoured
   * coffees, and for the Kauaʻi decaf, which is Hawaiian but not Kona.
   */
  clarification?: string
  /** Why this bean suits the visitor. Character, not invented provenance. */
  rationale: string
  /** Owner-confirmed availability, stated plainly. Omitted when none applies. */
  availability?: string
  affinity: TagWeights
  image: DiscoveryImage
}

export type DrinkId =
  | 'kona-island-latte'
  | 'captain-cook'
  | 'kamoa-mocha'
  | 'nutella'
  | 'island-coco-refresher'

export interface DiscoveryDrink {
  id: DrinkId
  name: string
  /** Verified flavour description. No ingredient may be added to it. */
  flavor: string
  /** Verified positioning, where one exists. */
  position?: string
  rationale: string
  /**
   * True for drinks built on espresso. The owner has confirmed that every
   * espresso-based drink can be prepared with decaf espresso, so this is what
   * gates the decaf availability line on a result.
   */
  espressoBased: boolean
  affinity: TagWeights
  image: DiscoveryImage
}

export type QuestionId = 'mood' | 'flavor' | 'method'

export interface DiscoveryOption {
  id: string
  label: string
  /** Optional second line. Kept short so options stay scannable on mobile. */
  detail?: string
  tags: TagWeights
  /**
   * Narrows the shortlist to candidates carrying this tag. Used only where a
   * preference is a genuine constraint rather than a leaning — currently just
   * decaf, where recommending a caffeinated bean would be wrong rather than
   * merely off-key. A constraint that no candidate in a pool satisfies is
   * ignored for that pool, and the result reports that it was.
   */
  requiresTag?: DiscoveryTag
}

export interface DiscoveryQuestion {
  id: QuestionId
  /** The question, used as the group label and the visible heading. */
  prompt: string
  options: DiscoveryOption[]
}

export interface DiscoveryContent {
  eyebrow: string
  heading: string
  intro: string
  /** Sets expectations before the visitor commits to starting. */
  invitationMeta: string
  beginLabel: string
  /** Shown beside the options until one is chosen. */
  choosePrompt: string
  questions: DiscoveryQuestion[]
  beans: DiscoveryBean[]
  drinks: DiscoveryDrink[]
  /** Short display labels for the descriptors gathered around a result. */
  tagLabels: Record<DiscoveryTag, string>
  result: {
    eyebrow: string
    heading: string
    beanLabel: string
    drinkLabel: string
    /**
     * Shown on the drink card when the visitor asked for decaf. Owner-confirmed:
     * every espresso-based drink can be made with decaf espresso.
     */
    decafDrinkAvailability: string
    viewMenu: NavItem
    startAgainLabel: string
  }
  /** Rendered when JavaScript is unavailable. */
  fallback: {
    heading: string
    intro: string
  }
}

/* ==========================================================================
   The Kona Arrival Journey
   ========================================================================== */

export interface JourneyMoment {
  id: 'grown' | 'roasted' | 'flown' | 'served' | 'arrival'
  /** Short label for the stage indicator. */
  stage: string
  eyebrow: string
  primary: string
  supporting?: string
  /** Milliseconds before advancing. Null means the moment is terminal. */
  holdMs: number | null
}

export interface JourneyContent {
  label: string
  moments: JourneyMoment[]
  enterLabel: string
  skipLabel: string
  replayLabel: string
  summary: string
  places: {
    island: string
    kona: string
    departure: string
    departureFull: string
    arrival: string
    arrivalFull: string
    cafe: string
    truck: string
  }
}
