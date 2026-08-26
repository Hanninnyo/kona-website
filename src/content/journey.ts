import { site } from './site'
import type { JourneyContent } from './types'

/**
 * The Kona Arrival Journey — the opening chapter.
 *
 * Four moments told in real footage: the Kona coast, the Pacific crossing,
 * the Bay Area at dawn, and the handover into the homepage.
 *
 * Every claim here is owner-verified and deliberately narrow: grown on
 * Hawaiʻi Island in Kona, roasted on the farm, carried through Kona
 * International Airport, across the Pacific to the Bay Area, and served at
 * both the café and the truck.
 *
 * The footage is licensed atmospheric imagery, not documentation. It is not
 * our farm, not our aircraft, not our shipment and not a specific flight, and
 * nothing in this file may say or imply otherwise. The coastline establishes
 * where Kona is; the words say the coffee is roasted on the farm, and those
 * are two separate statements deliberately kept apart.
 *
 * What is NOT here, and must not be added: a farm name, a farmer, an
 * elevation, a varietal, a processing or harvest method, a roast profile, a
 * flight schedule, a shipment frequency, a freshness window, a sustainability
 * claim, or any suggestion that shipments arrive exclusively through one
 * airport. The route line names KOA and the Bay Area because those are the
 * two verified endpoints; it is a piece of typography, not a flight path.
 */
export const journey: JourneyContent = {
  /** Names the dialog for assistive technology. */
  label: 'The journey of Kona Island Coffee, from the farm to your cup',

  /**
   * Four takes, each encoded twice. `wide` is the 2.09:1 band used by
   * landscape viewports; `tall` is a separately framed portrait crop, not the
   * same footage letterboxed. Dimensions are the real encoded pixels, so the
   * player can reserve the right box before a byte arrives.
   */
  scenes: [
    {
      id: 'origin',
      layout: 'band',
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
    {
      id: 'farm',
      layout: 'aperture',
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
      /* Literal, and careful. Coffee cherries on the branch and a hand at
         them is all this frame shows; it is not a roastery and must never be
         described as one. */
      description:
        'Coffee cherries ripening on the branch at the farm on Hawaiʻi Island, with a hand reaching among them.',
    },
    {
      id: 'crossing',
      layout: 'band',
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
      description: 'A view from high above an unbroken deck of cloud, under open blue sky.',
    },
    {
      id: 'arrival',
      layout: 'band',
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
  ],

  /**
   * One short film in five beats: the island, the farm, the crossing, the
   * arrival, and the two places the coffee is served.
   *
   * The copy is written to read as one sentence carried across five frames —
   * it begins in Kona, is grown and roasted at the source, crosses the
   * Pacific, arrives in the Bay Area, and is served at the café and from the
   * truck. No beat restates the one before it.
   *
   * `holdMs` is readable time, not wall-clock time. A beat's clock starts
   * when its scene is visually ready — playing, or committed to its poster —
   * so a slow connection costs the visitor waiting, never the scene itself.
   * The dissolve between beats overlaps them, so each take is on screen for
   * about a second longer than its own number.
   */
  moments: [
    {
      id: 'island',
      stage: 'The Big Island',
      scene: 'origin',
      anchor: 'bottom-left',
      eyebrow: 'The Big Island',
      primary: 'It begins in Kona.',
      supporting:
        'On the volcanic slopes of Hawaiʻi Island, coffee grows unlike anywhere else.',
      /**
       * Readable time, measured from the moment the scene is visually ready.
       * The dissolve into the next beat overlaps this, so each take is on
       * screen for roughly a second longer than the number here.
       */
      holdMs: 4600,
    },
    {
      id: 'farm',
      stage: 'From the farm',
      scene: 'farm',
      anchor: 'bottom-left',
      eyebrow: 'From the farm',
      /* Owner-verified: grown and roasted on the farm. The take shows
         cherries on the branch and nothing else — no roasting equipment, no
         roasting activity — so the words carry the claim and the picture is
         never asked to. */
      primary: 'Grown and roasted at the source.',
      supporting:
        'Our coffee is roasted on the farm before beginning its journey to California.',
      /**
       * Longer than the take.
       *
       * The usable motion in the source runs 3.2 s — earlier than 12.85 s a
       * figure is cropped at the shoulders, and 16.04 s is the end of the
       * clip — but this is the sentence that carries the whole roasting
       * claim, and three seconds is not enough to read it and look at the
       * cherries. The take plays out and its last frame then settles under
       * the words rather than freezing: see `journey-settle`. Nothing is
       * looped and nothing is slowed.
       */
      holdMs: 4400,
    },
    {
      id: 'crossing',
      stage: 'Across the Pacific',
      scene: 'crossing',
      anchor: 'top-left',
      eyebrow: 'Across the Pacific',
      primary: 'From KOA to the Bay Area.',
      supporting:
        'Farm-roasted coffee, flown from Kona International Airport to Northern California.',
      holdMs: 4200,
    },
    {
      id: 'arrival',
      stage: 'The Bay Area',
      scene: 'arrival',
      anchor: 'bottom-left',
      eyebrow: 'The Bay Area',
      primary: 'An island journey, arriving closer to home.',
      supporting: 'The same farm-roasted beans continue to the places where we serve them.',
      holdMs: 3000,
    },
    {
      id: 'destination',
      stage: 'Two destinations',
      scene: null,
      anchor: 'bottom-wide',
      eyebrow: 'One coffee. Two experiences.',
      primary: 'Find your island escape.',
      supporting:
        'The same farm-roasted coffee is served at our Mountain View café and from the Kona coffee truck.',
      /** Terminal: the film ends here and waits for the visitor. */
      holdMs: null,
    },
  ],

  /**
   * The two photographs the film ends on. Both are owner-supplied and show
   * the real places: the Mountain View café with its door open, and the Kona
   * coffee truck in service. Neither is stock and neither is generated.
   *
   * The truck photograph carries a menu panel advertising crepes that the
   * café no longer serves. It is cropped to the corner of frame rather than
   * removed — nothing in either picture has been erased, replaced or painted
   * over.
   */
  stills: [
    {
      id: 'cafe',
      wide: { src: '/journey/cafe-wide.jpg', width: 720, height: 900 },
      tall: { src: '/journey/cafe-tall.jpg', width: 480, height: 600 },
      description:
        'The Mountain View café entrance, its door open beneath the round Kona Island Coffee sign.',
    },
    {
      id: 'truck',
      wide: { src: '/journey/truck-wide.jpg', width: 720, height: 900 },
      tall: { src: '/journey/truck-tall.jpg', width: 480, height: 600 },
      description:
        'The Kona coffee truck with its service window open and a customer ordering.',
    },
  ],

  /**
   * The close of the film. Both hrefs are read from the verified location
   * records rather than written out again, so there is exactly one place in
   * the codebase where either address can be wrong.
   */
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

  enterLabel: 'Enter Your Island Escape',
  skipLabel: 'Skip to Kona',
  replayLabel: 'Replay the Journey',

  /**
   * The whole story as plain prose. Rendered for assistive technology and for
   * reduced-motion visitors, so nothing meaningful depends on the sequence
   * playing or on the footage being seen.
   */
  summary:
    'Our Kona coffee is grown in Kona on Hawaiʻi Island and roasted on the farm. It travels through Kona International Airport and across the Pacific to the Bay Area, where the same farm-roasted beans are served at the Mountain View café and from the Kona coffee truck.',

  /** The only place names shown outside the route line. */
  places: {
    island: 'Hawaiʻi Island',
    kona: 'Kona',
    cafe: 'Mountain View Café',
    truck: 'Kona Coffee Truck',
  },
}
