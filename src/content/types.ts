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
}
