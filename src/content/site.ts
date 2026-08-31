import type { ScheduleBlock, SiteContent } from './types'

/**
 * The truck's week, as owner-confirmed.
 *
 * Three blocks, not a merged list of days, and the split is the whole point:
 * Monday to Friday the truck is at Valley Medical Center, on Saturday it is on
 * a rotating community route somewhere else, and on Sunday it is nowhere. A
 * visitor who reads the weekday hours as covering Saturday drives to a
 * hospital forecourt and finds nothing there.
 */
const TRUCK_SCHEDULE: ScheduleBlock[] = [
  { label: 'Valley Medical Center', when: 'Monday–Friday · 7:00 AM–2:00 PM' },
  {
    label: 'Saturday community route',
    when: 'Saturday · 8:30 AM–1:30 PM',
    note: 'Location rotates — check the current schedule before visiting.',
  },
  { label: 'Sunday', when: 'Closed' },
]

/**
 * Single source of truth for business information.
 *
 * Facts here are drawn from KONA_INTERACTIVE_BUILD_SPEC.md and from ordering
 * URLs confirmed by the owner. Anything not confirmed is marked
 * `needs-owner-confirmation` and must not be rendered as fact.
 */

const MOUNTAIN_VIEW_ORDERING = 'https://www.orderkonamountainview.com/'
const COFFEE_TRUCK_ORDERING = 'https://kona-island-coffee.square.site/'
/*
 * Two separate Square gift-card programs, owner-confirmed as location-
 * specific and not interchangeable: a Mountain View café card cannot be
 * redeemed at the truck, and a truck card cannot be redeemed at the café.
 * Never collapse these back into one general "gift cards" URL — that is
 * exactly the ambiguity `/gift-cards` exists to resolve before a customer
 * picks a purchase link.
 */
const MOUNTAIN_VIEW_GIFT_CARD = 'https://app.squareup.com/gift/MLJN9CK6F24ZV/order'
const COFFEE_TRUCK_GIFT_CARD = 'https://app.squareup.com/gift/MLJAP1MDQXKAP/order'

function googleMapsSearch(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export const site: SiteContent = {
  brand: {
    name: 'Kona Island Coffee',
    tagline: 'Your Island Escape.',
    positioning: '100% Authentic Kona Coffee',
    logoMark: {
      // The current official mark, matching the physical storefront signage.
      src: '/images/logo-mark.png',
      // No approved horizontal wordmark exists. The header reserves space for
      // one so it can be dropped in without a layout change.
      wordmark: null,
      width: 2048,
      height: 2048,
    },
  },

  navigation: [
    {
      label: 'Experience',
      // Repointed from the homepage's old "Three principles" section, which
      // is no longer mounted there, to the signature-drink showcase that
      // replaced it as the homepage's own discovery moment.
      href: '/#signature-drinks',
      description: 'Find your island favorite',
    },
    { label: 'Coffee', href: '/coffee' },
    {
      label: 'Menu',
      href: '/menu-preview',
      description: 'Full menu and online ordering',
    },
    { label: 'Our Story', href: '/story' },
    { label: 'Our Kona Journey', href: '/our-kona-journey' },
    { label: 'Visit', href: '/locations', description: 'Café and coffee truck' },
    // The only "Gift Cards" entry point in the header/mobile menu — this
    // array backs both the desktop nav and the mobile menu panel in
    // `site-header.tsx`, so one entry here is enough to reach both. Points
    // to `/gift-cards`, never straight to a Square URL: see the block
    // comment on `giftCardsUrl` below for why.
    { label: 'Gift Cards', href: '/gift-cards' },
  ],

  primaryAction: {
    label: 'Order Ahead',
    // The café is the default destination, but the header offers the choice
    // below rather than sending every visitor here silently.
    href: MOUNTAIN_VIEW_ORDERING,
    external: true,
    description: 'Order from the Mountain View café',
  },

  orderDestinations: [
    {
      label: 'Mountain View Café',
      href: MOUNTAIN_VIEW_ORDERING,
      external: true,
      description: 'Pickup from the café at San Antonio Center',
    },
    {
      label: 'Kona Coffee Truck',
      href: COFFEE_TRUCK_ORDERING,
      external: true,
      description: 'Valley Medical Center and community stops',
    },
  ],

  locations: [
    {
      id: 'mountain-view',
      name: 'Mountain View Café',
      kind: 'cafe',
      summary:
        '100% Kona coffee, handcrafted drinks, chimney cakes and bakery items.',
      address: {
        street: '2565 California Street',
        unit: 'STE 84',
        city: 'Mountain View',
        region: 'CA',
        postalCode: '94040',
        country: 'USA',
      },
      district: 'The Village at San Antonio Center',
      directionsUrl: googleMapsSearch(
        '2565 California Street STE 84 Mountain View CA 94040'
      ),
      ordering: { label: 'Order from Mountain View', url: MOUNTAIN_VIEW_ORDERING },
      hours: {
        value: ['Monday–Friday: 7:00 AM–4:00 PM', 'Saturday–Sunday: 7:30 AM–5:00 PM'],
        state: 'verified',
      },
    },
    {
      id: 'coffee-truck',
      name: 'Coffee Truck',
      kind: 'mobile',
      summary:
        'A separate Kona location with its own ordering, currently serving Valley Medical Center.',
      address: {
        street: '751 S. Bascom Ave',
        unit: 'Sobrato Pavilion',
        city: 'San Jose',
        region: 'CA',
        postalCode: '',
        country: 'USA',
      },
      directionsUrl: googleMapsSearch(
        '751 S Bascom Ave Sobrato Pavilion San Jose CA'
      ),
      ordering: { label: 'Order from the Coffee Truck', url: COFFEE_TRUCK_ORDERING },
      /* Flattened from the blocks above rather than written twice, so a time
         cannot drift between the two shapes. Each line carries its own place,
         which is what makes it safe to render as a bare list. */
      hours: {
        value: TRUCK_SCHEDULE.map((block) => `${block.label}: ${block.when}`),
        state: 'verified',
      },
      schedule: TRUCK_SCHEDULE,
    },
  ],

  // Every general "Gift Cards" link on the site points here, never straight
  // to a Square page — the two programs are not interchangeable, and a
  // visitor needs to choose before they land on either checkout. See
  // `/gift-cards`.
  giftCardsUrl: '/gift-cards',

  contact: {
    phone: {
      value: '(408) 513-6455',
      state: 'needs-owner-confirmation',
      note: 'Carried over from the previous site. Not confirmed against the specification.',
    },
    email: {
      value: 'contact@konaislandcoffee.com',
      state: 'needs-owner-confirmation',
      note: 'Carried over from the previous site. Not confirmed against the specification.',
    },
  },

  // The previous footer linked Instagram, Facebook and X to "#". No verified
  // profile URLs are available, so none are rendered.
  socialProfiles: [],
}

export const orderingUrls = {
  mountainView: MOUNTAIN_VIEW_ORDERING,
  coffeeTruck: COFFEE_TRUCK_ORDERING,
} as const

/** The two location-specific Square gift-card checkouts. See `/gift-cards`. */
export const giftCardUrls = {
  mountainView: MOUNTAIN_VIEW_GIFT_CARD,
  coffeeTruck: COFFEE_TRUCK_GIFT_CARD,
} as const
