/**
 * Palm shadow — a decorative atmosphere layer.
 *
 * A frond silhouette blurred until it reads as a shadow cast by sunlight
 * rather than as a palm-leaf graphic. Monochrome espresso, entering from a
 * single edge, swaying on a 14-second cycle with a 9-second breath layered
 * under it — two pivots rather than one, because a single rotation reads as a
 * rigid shape rocking, and a frond in a breeze does not do that.
 *
 * The geometry matters: what makes a frond shadow read as light rather than as
 * a mark is the gaps between the leaflets. So the shape is a thin spine with
 * separate tapering blades hung off it, and the blur is kept just low enough
 * that those gaps survive. The blades are derived from constants at module
 * scope — no randomness, no dates, nothing that could differ between the
 * server and the client, so this cannot cause a hydration mismatch.
 *
 * Decorative and aria-hidden. It is kept on small screens rather than dropped,
 * at a smaller scale and lower opacity, cropped by the section edge so it
 * enters the corner without reaching the answer cards. Under
 * prefers-reduced-motion it holds still at roughly half strength: a frond
 * shadow that cannot move has to be quieter, or it stops reading as light and
 * starts reading as a graphic.
 */

const BLADE_COUNT = 15

/** A tapered blade hung off the spine, curling away from it. */
function blade(index: number): string {
  const t = (index + 1) / (BLADE_COUNT + 1)
  // The spine runs from the top-right corner down and to the left, dropping
  // away faster as it goes.
  const x = 398 - 340 * t
  const y = 6 + 288 * Math.pow(t, 1.28)
  // Blades shorten toward the tip of the frond.
  const length = 128 * (1 - 0.6 * t)
  const side = index % 2 === 0 ? 1 : -1

  const tipX = x - length * 0.78
  const tipY = y + side * length * 0.66
  const outerX = x - length * 0.2
  const outerY = y + side * length * 0.56
  const innerX = x - length * 0.34
  const innerY = y + side * length * 0.16

  return `M${x.toFixed(1)} ${y.toFixed(1)} Q${outerX.toFixed(1)} ${outerY.toFixed(1)} ${tipX.toFixed(1)} ${tipY.toFixed(1)} Q${innerX.toFixed(1)} ${innerY.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)} Z`
}

const BLADES = Array.from({ length: BLADE_COUNT }, (_, index) => blade(index))

interface PalmShadowProps {
  className?: string
}

export function PalmShadow({ className = '' }: PalmShadowProps) {
  return (
    <div aria-hidden="true" className={`palm-shadow ${className}`}>
      <div className="palm-shadow__inner">
        <svg
          viewBox="0 0 400 300"
          className="palm-shadow__art"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          {/* Spine */}
          <path
            d="M399 3C330 30 258 76 198 136 138 196 96 258 74 300c30-52 74-112 132-170C264 72 334 26 399 12z"
            fillOpacity="0.9"
          />
          {BLADES.map((d, index) => (
            <path key={index} d={d} />
          ))}
        </svg>
      </div>
    </div>
  )
}
