import type { JourneyContent } from './types'

/**
 * The Kona Arrival Journey — the opening chapter.
 *
 * Every claim here is owner-verified and deliberately narrow: grown on
 * Hawaiʻi Island in Kona, roasted on the farm, carried through Kona
 * International Airport, flown across the Pacific to the Bay Area, and served
 * at both the café and the truck.
 *
 * What is NOT here, and must not be added: a farm name, a farmer, an
 * elevation, a varietal, a processing or harvest method, a roast profile, a
 * flight schedule, a shipment frequency, a freshness window, a sustainability
 * claim, or any suggestion that shipments arrive exclusively through SFO. The
 * illustration routes to SFO because a line has to land somewhere; the words
 * say "the Bay Area", and that distinction is the point.
 */
export const journey: JourneyContent = {
  /** Names the dialog for assistive technology. */
  label: 'The journey of Kona Island Coffee, from the farm to your cup',

  moments: [
    {
      id: 'grown',
      stage: 'Grown',
      eyebrow: 'Origin',
      primary: 'Grown on Hawaiʻi Island.',
      /** How long this moment holds before the next, in milliseconds. */
      holdMs: 2000,
    },
    {
      id: 'roasted',
      stage: 'Roasted',
      eyebrow: 'Roasted',
      primary: 'Roasted on the farm.',
      supporting: 'Before beginning its journey across the Pacific.',
      holdMs: 1900,
    },
    {
      id: 'flown',
      stage: 'Flown',
      eyebrow: 'Flown',
      primary: 'Flown across the Pacific.',
      supporting: 'From Kona International Airport to the Bay Area.',
      holdMs: 3200,
    },
    {
      id: 'served',
      stage: 'Served',
      eyebrow: 'Served',
      primary: 'The same coffee. Two ways to experience it.',
      supporting:
        'Our farm-roasted beans make their way to both the Mountain View café and the Kona coffee truck.',
      holdMs: 1900,
    },
    {
      id: 'arrival',
      stage: 'Arrival',
      eyebrow: 'Arrival',
      primary: 'From the farm to your cup.',
      /** Terminal moment: it holds until the visitor chooses to enter. */
      holdMs: null,
    },
  ],

  enterLabel: 'Enter Your Island Escape',
  skipLabel: 'Skip to Kona',
  replayLabel: 'Replay the Journey',

  /**
   * The whole story as plain prose. Rendered for assistive technology and for
   * reduced-motion visitors, so nothing meaningful depends on the animation or
   * on the illustration being understood.
   */
  summary:
    'Our Kona coffee is grown in Kona on Hawaiʻi Island and roasted on the farm. It travels through Kona International Airport and across the Pacific to the Bay Area, where the same farm-roasted beans are served at the Mountain View café and from the Kona coffee truck.',

  /** Map labels. Geography is stylised; these are the only place names shown. */
  places: {
    island: 'Hawaiʻi Island',
    kona: 'Kona',
    departure: 'KOA',
    departureFull: 'Kona International Airport',
    arrival: 'SFO',
    arrivalFull: 'San Francisco',
    cafe: 'Mountain View Café',
    truck: 'Kona Coffee Truck',
  },
}
