import { site } from './site'
import type { JourneyContent } from './types'

const mountainView = site.locations.find((l) => l.id === 'mountain-view')!
const coffeeTruck = site.locations.find((l) => l.id === 'coffee-truck')!

/**
 * The Kona journey — a seventeen-second sequence that plays on its own.
 *
 * It begins with the homepage: the Kona coastline is moving before anyone has
 * decided anything, and `Enter Kona` goes straight to the homepage from the
 * first frame and from every frame after it. There is no session flag — the
 * journey plays whenever the homepage is loaded or replayed, and is never
 * suppressed on a return visit.
 *
 * The centre of the sequence is real satellite imagery. Two NASA images —
 * a MODIS scene of Hawaiʻi Island and the Blue Marble Next Generation tile
 * covering the North Pacific and North America — are windowed by one
 * geographic camera that pulls back continuously from the Kona coast to the
 * whole ocean and then moves in on California, where the map dissolves
 * directly into the photograph of the Mountain View café.
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
 * The sequence ends where the coffee is served. There is no landmark between
 * the map and the café: the route reaches the Bay Area and the next thing the
 * visitor sees is the door of the shop, because arriving is the point and a
 * bridge is not on the way to it.
 *
 * What is NOT here, and must not be added: a farm name, a farmer, an
 * elevation, a varietal, a processing or harvest method, a roast profile, a
 * flight schedule, a shipment frequency, a freshness window, a sustainability
 * claim, or any suggestion that shipments arrive exclusively through one
 * airport.
 */
export const journey: JourneyContent = {
  intro:
    'A seventeen-second animation about where this coffee comes from, playing now. You can skip it, pause it, or go straight to the homepage at any time.',

  /**
   * The linear story's heading. There is no opening screen on the animated
   * path — the sequence has already started by the time anything could be
   * read — so this is written for the page it actually appears on.
   */
  lead: {
    eyebrow: 'FROM KONA TO CALIFORNIA',
    headline: '100% Kona coffee, with a journey worth following.',
  },

  /**
   * Titles, not paragraphs. Each one is on screen for two or three seconds
   * over moving pictures, which is enough to read a line and not enough to
   * read a sentence.
   */
  captions: {
    kona: ['FROM KONA', 'TO CALIFORNIA'],
    /* Owner-verified. The take under these words shows cherries on the
       branch; it does not show roasting equipment or the roasting process,
       and nothing here may suggest that it does. */
    farm: ['GROWN IN KONA.', 'ROASTED ON THE FARM.'],
    pacific: { primary: 'FLOWN ACROSS THE PACIFIC.', secondary: 'Kona to California.' },
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
  },

  /**
   * The bounds are the exact patch of Earth each derivative covers, carried
   * through from the crop that produced it. They are the whole reason the
   * close view and the wide view line up: the camera asks each image for the
   * same degrees, and each answers in its own pixels.
   *
   * The Pacific derivative is deliberately tall — sixty-two degrees of
   * latitude against fifty-one of longitude. The corridor the route crosses
   * is wide and shallow, but a portrait phone showing that much longitude
   * implies far more latitude than a landscape crop of the same scene has to
   * give, and the shortfall is exactly the black band that used to appear
   * above and below the map. Carrying the extra latitude in the image itself
   * is what removes it, rather than hiding it.
   */
  satellite: {
    island: {
      /* One encode for every screen. At the closest framing a phone asks for
         very nearly this image's own pixel scale, so the lighter file it used
         to be given was the softest thing on the screen at the moment the
         screen was sharpest. */
      wide: { src: '/journey/hawaii-wide.jpg', width: 1600, height: 1000 },
      bounds: { north: 20.43364, south: 18.74741, west: -156.9344, east: -154.06329 },
      description:
        'A NASA satellite view of Hawaiʻi Island, with the Kona coast along its western shore.',
    },
    pacific: {
      wide: { src: '/journey/pacific-wide.jpg', width: 3000, height: 3647 },
      mid: { src: '/journey/pacific-mid.jpg', width: 1500, height: 1824 },
      bounds: { north: 61.99875, south: 0, west: -165.00375, east: -114.0075 },
      description:
        'A NASA satellite view of the eastern North Pacific, from the equator to Alaska, with the Hawaiian Islands to the south-west and the coast of California to the north-east.',
    },
  },

  /**
   * The two photographs the sequence ends on. Both are owner-supplied and
   * show the real places. Nothing in either was erased, replaced or repainted,
   * and no generative image editing was used.
   *
   * The café is framed on the entrance — the round sign, the awning, the glass
   * frontage and the open door — rather than on the façade above it, because
   * the door is what arriving looks like. Desktop and mobile are cropped
   * separately from the same photograph: a widescreen stage can only show
   * about half the height of a 3:4 original, so one crop cannot hold the sign
   * and the doorway in both shapes at once.
   */
  photos: {
    cafe: {
      wide: { src: '/journey/cafe-wide.jpg', width: 1600, height: 1000 },
      tall: { src: '/journey/cafe-tall.jpg', width: 700, height: 1296 },
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
