import type { HomepageContent } from './types'
import { site } from './site'

/**
 * Homepage copy.
 *
 * Copy here is either drawn from KONA_INTERACTIVE_BUILD_SPEC.md or written to
 * its brief, and is subject to final creative approval. No product, price,
 * award, testimonial or sourcing claim appears on this page.
 *
 * Professional café photography has not been delivered to the repository. Image
 * slots carry `src: null` and a written brief so the placement is visible,
 * reviewable, and replaceable by dropping in a file and setting one path.
 */

const [mountainView, coffeeTruck] = site.locations

export const homepage: HomepageContent = {
  hero: {
    eyebrow: site.brand.positioning,
    headline: site.brand.tagline,
    positioning: '100% Authentic Kona Coffee',
    place: 'Mountain View, California',
    image: {
      src: null,
      alt: '',
      awaiting:
        'Full-bleed café photograph — the single primary image of the site. Needs a wide landscape crop and a separate portrait crop for mobile.',
      aspect: 'wide',
    },
    actions: {
      visit: { label: 'Visit the Café', href: '/locations' },
      order: site.primaryAction,
    },
  },

  principles: {
    eyebrow: 'The Kona Experience',
    heading: 'Three things we will not compromise.',
    intro:
      'Everything we do returns to the same three ideas. They shape the coffee we buy, the way we serve it, and the room we serve it in.',
    items: [
      {
        id: 'authentic',
        title: 'Authentic',
        statement: '100% Kona Coffee. Never blended.',
        detail:
          'Grown in Kona\u2019s celebrated coffee belt on Hawai\u02BBi Island, our 100% Kona coffee is served without blending it with coffee from other origins.',
      },
      {
        id: 'crafted',
        title: 'Crafted',
        statement: 'Every cup prepared with intention.',
        detail:
          'Each drink is prepared to order with care, balance, and attention to detail.',
      },
      {
        id: 'escape',
        title: 'Escape',
        statement: 'A calm place in the middle of your day.',
        detail:
          'The café is built for the hour you actually have — long enough to sit, quiet enough to think, close enough to get back.',
      },
    ],
  },

  space: {
    eyebrow: 'The Space',
    heading: 'Designed for conversations.',
    lines: ['Built for slow mornings.', 'Stay a little longer.'],
    body: `The café sits in ${mountainView.district ?? 'Mountain View'}, a few steps off the street. It was made for the way people actually use a coffee shop: somewhere to start the day slowly, meet someone properly, or sit alone for a while without being hurried along.`,
    images: [
      {
        src: null,
        alt: '',
        awaiting:
          'Interior wide shot — the room as a whole, ideally in natural morning light with no people in frame.',
        aspect: 'landscape',
      },
      {
        src: null,
        alt: '',
        awaiting:
          'Interior detail — a table, seating texture, or the counter. Portrait crop, shallow depth of field.',
        aspect: 'portrait',
      },
    ],
  },

  /**
   * Two ways to visit, given equal weight.
   *
   * Addresses and hours both come from `site.locations`, so they cannot drift
   * from the rest of the site. The truck's hours are the hours of its Valley
   * Medical Center stop and are labelled as such where they are shown; the
   * truck's other stops are a separate schedule and nothing here claims one.
   *
   * Photography: both images are authentic photographs already in the
   * repository. Three other truck images in `public/images` are AI-generated
   * (visible generator watermark, garbled signage, invented customers) and are
   * deliberately not used.
   */
  visit: {
    eyebrow: 'Visit Kona',
    heading: 'One brand. Two ways to visit.',
    intro:
      'The café in Mountain View, and the coffee truck the business began with. Wherever you find us, it is the same Kona.',
    destinations: [
      {
        id: mountainView.id,
        label: 'Mountain View Café',
        description:
          'A calm, modern island escape for handcrafted drinks, bakery favorites and chimney cakes.',
        place: `${mountainView.address.street}, ${mountainView.address.unit} · ${mountainView.address.city}`,
        primary: {
          label: 'Visit the Café',
          href: mountainView.directionsUrl,
          external: true,
          description: 'Directions to the Mountain View café',
        },
        secondary: {
          label: 'Order Café Pickup',
          href: mountainView.ordering.url,
          external: true,
          description: 'Order ahead from the Mountain View café',
        },
        image: {
          // The real storefront at The Village at San Antonio Center.
          src: '/images/storefront-open.jpg',
          alt: 'The Kona Island Coffee storefront in Mountain View, its round 100% Kona sign above the entrance.',
          awaiting: '',
          aspect: 'landscape',
        },
      },
      {
        id: coffeeTruck.id,
        label: 'Kona Coffee Truck',
        description:
          'Find our original mobile coffee experience at Valley Medical Center and selected community stops.',
        place: `${coffeeTruck.address.street}, ${coffeeTruck.address.unit} · ${coffeeTruck.address.city}`,
        primary: {
          // Names the destination rather than promising a live locator: the
          // truck also serves community stops, and no verified current
          // schedule exists to send anyone to.
          label: 'Directions to VMC',
          href: coffeeTruck.directionsUrl,
          external: true,
          description: 'Directions to the truck at Valley Medical Center',
        },
        secondary: {
          label: 'Order from the Truck',
          href: coffeeTruck.ordering.url,
          external: true,
          description: 'Order ahead from the coffee truck',
        },
        image: {
          // The actual Kona trailer, photographed at the 2023 launch.
          src: '/images/2023-first-coffee-truck-launch.jpg',
          alt: 'The Kona Island Coffee trailer, wrapped in coffee beans and palm motifs, with its service window open.',
          awaiting: '',
          aspect: 'landscape',
        },
      },
    ],
  },
}
