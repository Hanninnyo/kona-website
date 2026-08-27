import { site } from './site'
import type { JourneyContent } from './types'

const mountainView = site.locations.find((l) => l.id === 'mountain-view')!
const coffeeTruck = site.locations.find((l) => l.id === 'coffee-truck')!

/**
 * The Kona journey — an optional eleven-second sequence that plays only when
 * the visitor asks for it.
 *
 * Nothing here starts on its own. The opening screen is the Kona coastline
 * and two choices, and `Enter Kona` goes straight to the homepage from the
 * first frame and from every frame after it. There is no session flag: the
 * journey is neither forced on a first visit nor suppressed on a second.
 *
 * The centre of the sequence is real satellite imagery. Two NASA images —
 * a MODIS scene of Hawaiʻi Island and the Blue Marble Next Generation tile
 * covering the North Pacific and North America — are windowed by one
 * geographic camera that pulls back continuously from the Kona coast to the
 * whole ocean and then moves in on California. The route drawn over them is
 * the real great circle between two verified airports.
 *
 * Every claim is owner-verified and deliberately narrow: grown in Kona on
 * Hawaiʻi Island, roasted on the farm, carried from Kona International
 * Airport across the Pacific to the Bay Area, and served at both the
 * Mountain View café and the coffee truck.
 *
 * The satellite imagery shows where the journey happens. It does not document
 * a shipment, and the route line is our own drawing over NASA's photograph,
 * not something NASA recorded. The farm take shows coffee cherries on the
 * branch — no roasting equipment and no roasting activity — so the words
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
    'An optional eleven-second animation about where this coffee comes from. You can skip it or go straight to the homepage at any time.',

  cover: {
    eyebrow: 'FROM KONA TO CALIFORNIA',
    headline: '100% Kona coffee, with a journey worth following.',
    beginLabel: 'Begin the Journey',
  },

  /**
   * Titles, not paragraphs. Each one is on screen for two or three seconds
   * over moving pictures, which is enough to read a line and not enough to
   * read a sentence.
   */
  captions: {
    /* Owner-verified. The take under these words shows cherries on the
       branch; it does not show roasting equipment or the roasting process,
       and nothing here may suggest that it does. */
    farm: ['GROWN IN KONA.', 'ROASTED ON THE FARM.'],
    pacific: { primary: 'FLOWN ACROSS THE PACIFIC.', secondary: 'Kona to California.' },
    california: 'KONA TO CALIFORNIA.',
  },

  footage: {
    coastline: {
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
    farm: {
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
    california: {
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

  /**
   * The bounds are the exact patch of Earth each derivative covers, carried
   * through from the crop that produced it. They are the whole reason the
   * close view and the wide view line up: the camera asks each image for the
   * same degrees, and each answers in its own pixels.
   */
  satellite: {
    island: {
      wide: { src: '/journey/hawaii-wide.jpg', width: 1600, height: 1000 },
      mid: { src: '/journey/hawaii-mid.jpg', width: 900, height: 563 },
      bounds: { north: 20.43364, south: 18.74741, west: -156.9344, east: -154.06329 },
      description:
        'A NASA satellite view of Hawaiʻi Island, with the Kona coast along its western shore.',
    },
    pacific: {
      wide: { src: '/journey/pacific-wide.jpg', width: 3600, height: 2250 },
      mid: { src: '/journey/pacific-mid.jpg', width: 1800, height: 1125 },
      bounds: { north: 43.75125, south: 12.49875, west: -165.00375, east: -115.00875 },
      description:
        'A NASA satellite view of the North Pacific, with the Hawaiian Islands to the south-west and the coast of California to the north-east.',
    },
  },

  /**
   * The two photographs the sequence ends on. Both are owner-supplied and
   * show the real places. Nothing in either was erased, replaced or repainted,
   * and no generative image editing was used.
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
      description: 'The Kona coffee truck with its service window open and a customer ordering.',
    },
  },

  /**
   * The two verified endpoints. The line between them is drawn as a great
   * circle — the path an aircraft actually follows — so its gentle northward
   * bow is geography rather than decoration.
   */
  route: {
    origin: { label: 'KONA', lat: 19.7388, lon: -156.0456 },
    destination: { label: 'BAY AREA', lat: 37.6213, lon: -122.379 },
  },

  destinations: [
    {
      id: 'mountain-view',
      label: 'MOUNTAIN VIEW CAFÉ',
      place: 'Mountain View, California',
      directionsLabel: 'Directions',
      orderLabel: 'Order Ahead',
      directionsHref: mountainView.directionsUrl,
      orderHref: mountainView.ordering.url,
    },
    {
      id: 'coffee-truck',
      label: 'KONA COFFEE TRUCK',
      place: 'Sobrato Pavilion, San Jose',
      directionsLabel: 'Directions to VMC',
      orderLabel: 'Order from the Truck',
      directionsHref: coffeeTruck.directionsUrl,
      orderHref: coffeeTruck.ordering.url,
    },
  ],

  close: {
    eyebrow: 'WHERE WILL YOU FIND KONA?',
    lines: ['The same farm-roasted coffee.', 'Two ways to find your island escape.'],
  },

  enterLabel: 'Enter Kona',
  replayLabel: 'Replay the Journey',
  controls: { skip: 'Skip', pause: 'Pause', play: 'Play' },
  continueLabel: 'Continue',

  summary:
    'Our Kona coffee is grown in Kona on Hawaiʻi Island and roasted on the farm. It travels from Kona International Airport across the Pacific to Northern California, where the same farm-roasted coffee is served at the Mountain View café and from the Kona coffee truck.',
}
