import type { SiteContent } from './types'

/**
 * Single source of truth for business information.
 *
 * Facts here are drawn from KONA_INTERACTIVE_BUILD_SPEC.md and from ordering
 * URLs confirmed by the owner. Anything not confirmed is marked
 * `needs-owner-confirmation` and must not be rendered as fact.
 */

const MOUNTAIN_VIEW_ORDERING = 'https://www.orderkonamountainview.com/'
const COFFEE_TRUCK_ORDERING = 'https://kona-island-coffee.square.site/'
const GIFT_CARDS = 'https://app.squareup.com/gift/MLJAP1MDQXKAP/order'

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
      href: '/#experience',
      description: 'The three principles behind every cup',
    },
    { label: 'Coffee', href: '/coffee' },
    {
      label: 'Menu',
      href: '/menu-preview',
      description: 'Full menu and online ordering',
    },
    { label: 'Our Story', href: '/story' },
    { label: 'Visit', href: '/locations', description: 'Café and coffee truck' },
  ],

  primaryAction: {
    label: 'Order Ahead',
    href: MOUNTAIN_VIEW_ORDERING,
    external: true,
    description: 'Order from the Mountain View café',
  },

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
        value: [],
        state: 'needs-owner-confirmation',
        note: 'Café hours are not published here until the owner reconfirms them. Visitors are sent to the live Google listing instead.',
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
      hours: {
        value: [],
        state: 'needs-owner-confirmation',
        note: 'Truck schedules change. No schedule is published until the owner confirms the current one.',
      },
    },
  ],

  giftCardsUrl: GIFT_CARDS,

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
  giftCards: GIFT_CARDS,
} as const
