/**
 * Ocean light — sunlight reflected off moving water onto a warm cream wall.
 *
 * The shapes come from fractal noise, not from blurred circles. Real caustics
 * are a network of thin bright filaments that cross and enclose irregular
 * cells; a handful of soft discs reads as a gradient background, which is what
 * an earlier pass of this looked like. The two nets are generated in
 * `public/ambient/caustic-*.svg` and used here as cached CSS masks over a flat
 * token colour — see globals.css for why they are files rather than live
 * filters.
 *
 * Two colours, two jobs. Cream carries the brightness and is lighter than the
 * ground, so it raises text contrast rather than lowering it. Sea glass carries
 * the water and is the one held in check.
 *
 * A Server Component with no state and no randomness, so server and client
 * output are identical and nothing here can cause a hydration mismatch.
 */

interface OceanLightProps {
  /**
   * `ambient` is the full reflection, for the section where it should be felt.
   * `whisper` carries it across a lighter section so the atmosphere does not
   * stop at a boundary. `hint` is a trace only.
   */
  intensity?: 'ambient' | 'whisper' | 'hint'
  /**
   * Set on a section whose ground is already pale, where a cream filament is
   * nearly the ground itself and the tones have to deepen instead.
   */
  onLight?: boolean
  className?: string
}

const FIELD_OPACITY: Record<NonNullable<OceanLightProps['intensity']>, string> = {
  ambient: 'opacity-[0.78]',
  whisper: 'opacity-[0.62]',
  hint: 'opacity-[0.3]',
}

export function OceanLight({
  intensity = 'ambient',
  onLight = false,
  className = '',
}: OceanLightProps) {
  return (
    <div
      aria-hidden="true"
      className={`caustic-field ${onLight ? 'caustic-field--on-light' : ''} ${FIELD_OPACITY[intensity]} ${className}`}
    >
      {/* Each plane is oversized and off-centre so its edges never enter the
          frame, and so the two weaves never line up. */}
      <div className="caustic-plane caustic-plane--lit" />
      <div className="caustic-plane caustic-plane--sea" />
    </div>
  )
}
