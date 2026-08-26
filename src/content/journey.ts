import { site } from './site'
import type { JourneyContent } from './types'

/**
 * The Kona journey — an optional, visitor-controlled story told in five
 * chapters between the top of the homepage and the homepage itself.
 *
 * Nothing here plays on its own. The visitor's scroll position is the only
 * thing that advances the story, so there are no durations in this file and
 * no beat can expire while someone is still reading it. `Enter Kona` is on
 * the first screen and in the last chapter, so the homepage is never more
 * than one action away.
 *
 * Every claim is owner-verified and deliberately narrow: grown in Kona on
 * Hawaiʻi Island, roasted on the farm, carried through Kona International
 * Airport across the Pacific to Northern California, and served at both the
 * Mountain View café and the coffee truck.
 *
 * The footage represents those chapters; it does not document them. It is not
 * our aircraft and not a specific flight, and nothing here may say or imply
 * otherwise. The farm take shows coffee cherries on the branch and a hand
 * among them — no roasting equipment and no roasting activity — so the words
 * carry the roasting claim and the picture is never asked to.
 *
 * What is NOT here, and must not be added: a farm name, a farmer, an
 * elevation, a varietal, a processing or harvest method, a roast profile, a
 * flight schedule, a shipment frequency, a freshness window, a sustainability
 * claim, or any suggestion that shipments arrive exclusively through one
 * airport.
 */
export const journey: JourneyContent = {
  intro:
    'An optional five-chapter story about where this coffee comes from, told as you scroll. You can skip it and go straight to the homepage at any time.',

  /**
   * The opening screen. The Kona coastline fills the frame from the first
   * paint — there is no dialog over it, no countdown and nothing to dismiss —
   * and the visitor chooses between following the story and going past it.
   */
  cover: {
    eyebrow: 'FROM KONA TO CALIFORNIA',
    headline: 'Coffee with a journey worth following.',
    supporting:
      'Grown and roasted on the farm in Kona, then flown across the Pacific to the Bay Area.',
    followLabel: 'Follow the Journey',
  },

  /**
   * Five chapters, in the order the coffee travels. The copy reads as one
   * sentence carried across five frames, and no chapter restates the one
   * before it.
   */
  chapters: [
    {
      id: 'kona',
      eyebrow: 'THE BIG ISLAND',
      headline: 'It begins in Kona.',
      supporting:
        'On volcanic slopes above the Kona coast, our 100% Kona coffee begins its journey.',
      /* The coastline runs across the lower half of the frame and the open
         water sits under it; the copy stays low, over the water. */
      anchor: 'lower',
      footage: {
        wide: {
          src: '/journey/origin-wide.mp4',
          poster: '/journey/origin-wide.jpg',
          width: 1280,
          height: 612,
        },
        tall: {
          src: '/journey/origin-tall.mp4',
          poster: '/journey/origin-tall.jpg',
          width: 414,
          height: 896,
        },
        description:
          'An aerial view along the Kona coast on Hawaiʻi Island: palms, black lava shoreline and clear shallow water.',
      },
    },
    {
      id: 'farm',
      eyebrow: 'FROM THE FARM',
      /* Owner-verified: grown and roasted on the farm. The take shows
         cherries on the branch and nothing else. It does not show roasting
         equipment or the roasting process, and no wording or presentation
         here may suggest that it does. */
      headline: 'Grown and roasted at the source.',
      supporting: 'The coffee is roasted on the farm before leaving Hawaiʻi Island.',
      anchor: 'lower',
      footage: {
        wide: {
          src: '/journey/farm-wide.mp4',
          poster: '/journey/farm-wide.jpg',
          width: 720,
          height: 1280,
        },
        tall: {
          src: '/journey/farm-tall.mp4',
          poster: '/journey/farm-tall.jpg',
          width: 414,
          height: 896,
        },
        description:
          'Coffee cherries ripening on the branch at the farm on Hawaiʻi Island, with a hand reaching among them.',
      },
    },
    {
      id: 'pacific',
      eyebrow: 'ACROSS THE PACIFIC',
      headline: 'From KOA to the Bay Area.',
      supporting:
        'Our farm-roasted coffee travels from Kona International Airport to Northern California.',
      /* The cloud deck is emptiest at the top of the frame. */
      anchor: 'upper',
      footage: {
        wide: {
          src: '/journey/crossing-wide.mp4',
          poster: '/journey/crossing-wide.jpg',
          width: 1280,
          height: 612,
        },
        tall: {
          src: '/journey/crossing-tall.mp4',
          poster: '/journey/crossing-tall.jpg',
          width: 414,
          height: 896,
        },
        /* Open ocean and cloud at altitude. It represents the crossing; it
           does not depict our shipment, an airline or a particular flight. */
        description: 'A view from high above an unbroken deck of cloud, under open blue sky.',
      },
    },
    {
      id: 'arrival',
      eyebrow: 'NORTHERN CALIFORNIA',
      headline: 'The island journey arrives closer to home.',
      supporting: 'The same farm-roasted coffee continues to the places where we serve it.',
      anchor: 'lower',
      footage: {
        wide: {
          src: '/journey/arrival-wide.mp4',
          poster: '/journey/arrival-wide.jpg',
          width: 1280,
          height: 612,
        },
        tall: {
          src: '/journey/arrival-tall.mp4',
          poster: '/journey/arrival-tall.jpg',
          width: 414,
          height: 896,
        },
        description: 'The Golden Gate Bridge above low fog as first light reaches the Bay Area.',
      },
    },
    {
      id: 'destinations',
      eyebrow: 'ONE COFFEE. TWO EXPERIENCES.',
      headline: 'Find your island escape.',
      supporting:
        'The same farm-roasted coffee is served at our Mountain View café and from the Kona coffee truck.',
      anchor: 'lower',
      /* Told over the two owner photographs rather than over footage. */
      footage: null,
    },
  ],

  /**
   * The two photographs the journey ends on. Both are owner-supplied and show
   * the real places: the Mountain View café with its door open under its sign,
   * and the Kona coffee truck in service.
   *
   * The truck photograph carries a menu panel advertising items the business
   * no longer serves. It is cropped to the edge of frame rather than removed —
   * nothing in either picture has been erased, replaced or painted over, and
   * no generative image editing was used on either.
   */
  photos: {
    cafe: {
      wide: { src: '/journey/cafe-wide.jpg', width: 720, height: 900 },
      tall: { src: '/journey/cafe-tall.jpg', width: 480, height: 600 },
      description:
        'The Mountain View café entrance, its door open beneath the round Kona Island Coffee sign.',
    },
    truck: {
      wide: { src: '/journey/truck-wide.jpg', width: 720, height: 900 },
      tall: { src: '/journey/truck-tall.jpg', width: 480, height: 600 },
      description:
        'The Kona coffee truck with its service window open and a customer ordering.',
    },
  },

  destinations: [
    {
      label: 'Visit the Café',
      href: site.locations.find((l) => l.id === 'mountain-view')!.directionsUrl,
      description: 'Directions to the Mountain View café',
    },
    {
      label: 'Find the Truck',
      href: site.locations.find((l) => l.id === 'coffee-truck')!.directionsUrl,
      description: 'Directions to the Kona coffee truck',
    },
  ],

  orderLabel: 'Order Ahead',
  enterLabel: 'Enter Kona',
  replayLabel: 'Replay the Journey',

  /**
   * A hairline along the foot of the stage that fills with the visitor's own
   * scroll position. It names the two verified endpoints and nothing else:
   * there is no map, no marker and no step counter, because the story is the
   * pictures and this is only a sense of how far along them you are.
   */
  route: {
    start: 'KONA',
    middle: 'ACROSS THE PACIFIC',
    end: 'CALIFORNIA',
  },

  summary:
    'Our Kona coffee is grown in Kona on Hawaiʻi Island and roasted on the farm. It travels through Kona International Airport and across the Pacific to Northern California, where the same farm-roasted coffee is served at the Mountain View café and from the Kona coffee truck.',
}
