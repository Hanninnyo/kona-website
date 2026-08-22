import { journey } from '@/content/journey'

/**
 * The journey illustration: Hawaiʻi Island, the Pacific, and the California
 * coast, drawn as one continuous scene so the camera can move from a close-up
 * of the island out to the whole ocean without a cut.
 *
 * Entirely decorative and `aria-hidden`. Every place name and every claim also
 * exists as real text in the layer above, so nothing here has to be understood
 * by assistive technology.
 *
 * Geography is stylised but directionally honest: Kona and KOA sit on the
 * western side of the island, California lies east across the ocean, SFO is in
 * Northern California, and Mountain View and San Jose are south of it. It is
 * not, and does not pretend to be, survey-accurate.
 *
 * Nothing animates here. The parent sets `data-moment` and the CSS in
 * globals.css drives the camera, the route stroke and the marker — transform,
 * opacity and stroke-dashoffset only.
 */

/**
 * Shared so the drawn route and the marker's `offset-path` cannot drift apart.
 *
 * The whole scene is composed in the upper two thirds of the frame: the lower
 * third is open ocean, which is where the copy sits. Nothing of consequence is
 * ever drawn behind the words.
 */
export const ROUTE_PACIFIC = 'M218 312 C 390 196, 636 120, 826 168'
export const ROUTE_CAFE = 'M826 168 C 836 178, 844 188, 852 198'
export const ROUTE_TRUCK = 'M826 168 C 844 184, 860 204, 874 222'

/**
 * Hawaiʻi Island: broad across the north, tapering to a point in the south,
 * with the eastern side fuller than the western. Stylised, but that is the
 * island's actual gesture rather than a generic blob.
 */
const ISLAND =
  'M226 254 L272 250 C 291 252, 303 268, 305 289 C 307 311, 296 333, 282 347 C 268 361, 255 369, 247 362 C 237 353, 225 338, 217 318 C 209 298, 207 272, 213 262 C 217 256, 221 254, 226 254 Z'

export function JourneyMap() {
  const { places } = journey

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1000 560"
      preserveAspectRatio="xMidYMid meet"
      className="journey-map"
    >
      <defs>
        {/* The Kona side of the island, lit. */}
        <radialGradient id="kona-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-gold-400)" stopOpacity="0.4" />
          <stop offset="55%" stopColor="var(--color-gold-500)" stopOpacity="0.13" />
          <stop offset="100%" stopColor="var(--color-gold-500)" stopOpacity="0" />
        </radialGradient>
        {/* A soft fall of light through the middle of the ocean, darkening to
            the layer's own colour at the top and bottom edges. On a narrow
            screen the map letterboxes, and without that the edge of the
            drawing would show as a seam against the background. */}
        <linearGradient id="pacific-depth" x1="10%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="var(--color-pacific-950)" />
          <stop offset="42%" stopColor="var(--color-pacific-800)" />
          <stop offset="100%" stopColor="var(--color-pacific-950)" />
        </linearGradient>
      </defs>

      <rect width="1000" height="560" fill="url(#pacific-depth)" />

      {/* --- Latitude lines: a travel-document grid, not a decoration ------ */}
      <g className="journey-grid" stroke="var(--color-seaglass-line)" strokeWidth="0.5" fill="none">
        {[80, 160, 240, 320, 400].map((y) => (
          <line key={y} x1="30" y1={y} x2="970" y2={y} />
        ))}
        {[180, 360, 540, 720, 900].map((x) => (
          <line key={x} x1={x} y1="30" x2={x} y2="440" />
        ))}
      </g>

      {/* --- California -----------------------------------------------------
          The coast runs north-west to south-east, which is the gesture that
          makes the landmass read as California without pretending to survey
          accuracy. */}
      <g className="journey-land">
        <path
          d="M1000 34 L936 74 C 906 92, 884 116, 868 142 C 852 168, 838 190, 820 208 C 802 226, 790 248, 786 272 L 800 300 L 1000 300 Z"
          fill="var(--color-land)"
        />
        <path
          d="M1000 34 L936 74 C 906 92, 884 116, 868 142 C 852 168, 838 190, 820 208 C 802 226, 790 248, 786 272"
          fill="none"
          stroke="var(--color-coast)"
          strokeWidth="1.1"
        />
      </g>

      {/* --- Hawaiʻi Island ------------------------------------------------
          A rounded triangle with the point to the south, which is the Big
          Island's actual gesture. Kona is the western flank. */}
      <g className="journey-island">
        <path
          d={ISLAND}
          fill="var(--color-land)"
        />
        <path
          d={ISLAND}
          fill="none"
          stroke="var(--color-coast)"
          strokeWidth="1.3"
        />

        {/* The lit western flank — the Kona side. */}
        <ellipse className="journey-kona-glow" cx="226" cy="306" rx="24" ry="28" fill="url(#kona-glow)" />

        {/* Contours rising inland: the shape of a volcanic island, and the
            detail that resolves as the camera settles on the farm. */}
        <g className="journey-contours" fill="none" stroke="var(--color-gold-400)" strokeWidth="0.7">
          <ellipse cx="254" cy="300" rx="29" ry="31" opacity="0.42" />
          <ellipse cx="258" cy="304" rx="18" ry="20" opacity="0.6" />
          <ellipse cx="261" cy="307" rx="8" ry="9" opacity="0.85" />
        </g>
      </g>

      {/* --- The route ------------------------------------------------------ */}
      <g className="journey-route" fill="none" stroke="var(--color-gold-500)" strokeLinecap="round">
        <path className="journey-route__line" d={ROUTE_PACIFIC} pathLength={1} strokeWidth="1.6" />
        <path className="journey-route__leg journey-route__leg--cafe" d={ROUTE_CAFE} pathLength={1} strokeWidth="1.2" />
        <path className="journey-route__leg journey-route__leg--truck" d={ROUTE_TRUCK} pathLength={1} strokeWidth="1.2" />
      </g>

      {/* The travelling light. Not an aeroplane — a small illuminated point
          moving along the same path the route draws. */}
      <circle className="journey-marker" r="3.4" fill="var(--color-gold-400)" />

      {/* --- Points ---------------------------------------------------------
          Labels are duplicated as real text in the layer above; these exist so
          the drawing reads on its own. */}
      <g className="journey-points" fill="var(--color-ink-inverse)">
        <g className="journey-point journey-point--koa">
          <circle cx="218" cy="312" r="3" fill="var(--color-gold-400)" />
          <circle cx="218" cy="312" r="7.5" fill="none" stroke="var(--color-gold-500)" strokeWidth="0.7" opacity="0.7" />
          <text x="218" y="334" textAnchor="middle" className="journey-map__label">
            {places.departure}
          </text>
        </g>
        <g className="journey-point journey-point--sfo">
          <circle cx="826" cy="168" r="3" fill="var(--color-gold-400)" />
          <circle cx="826" cy="168" r="7.5" fill="none" stroke="var(--color-gold-500)" strokeWidth="0.7" opacity="0.7" />
          <text x="826" y="154" textAnchor="middle" className="journey-map__label">
            {places.arrival}
          </text>
        </g>
        <g className="journey-point journey-point--cafe">
          <circle cx="852" cy="198" r="2.8" fill="var(--color-seaglass-mark)" />
          <text x="852" y="210" textAnchor="middle" className="journey-map__label journey-map__label--place">
            {places.cafe}
          </text>
        </g>
        <g className="journey-point journey-point--truck">
          <circle cx="874" cy="222" r="2.8" fill="var(--color-seaglass-mark)" />
          <text x="874" y="234" textAnchor="middle" className="journey-map__label journey-map__label--place">
            {places.truck}
          </text>
        </g>
      </g>
    </svg>
  )
}
