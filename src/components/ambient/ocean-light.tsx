/**
 * Ocean light — a decorative atmosphere layer.
 *
 * Sunlight bounced off water onto a warm interior wall: two soft pools of
 * sea-glass light drifting very slowly behind the content. Warm sand stays the
 * dominant colour; this only tints it.
 *
 * A Server Component with no state and no randomness, so it renders identically
 * on the server and the client — there is nothing here that can cause a
 * hydration mismatch. All movement is CSS and is removed under
 * prefers-reduced-motion, leaving the static tint, which is the part that
 * actually carries the atmosphere.
 */

interface OceanLightProps {
  /**
   * `ambient` is the fuller treatment, for a section where the effect should be
   * felt. `whisper` is roughly half strength, for a transition between
   * sections.
   */
  intensity?: 'ambient' | 'whisper'
  className?: string
}

export function OceanLight({ intensity = 'ambient', className = '' }: OceanLightProps) {
  // Peak alpha at a pool centre. The pale pool lightens the ground, which
  // *raises* contrast for the dark text on it; the deep pool is held low
  // enough that it cannot pull any on-ground text below AA. Both were
  // measured against the rendered page rather than assumed — raising either
  // needs a fresh contrast pass.
  const lit = intensity === 'ambient' ? 'opacity-[0.45]' : 'opacity-[0.26]'
  const deep = intensity === 'ambient' ? 'opacity-[0.12]' : 'opacity-[0.07]'

  return (
    <div aria-hidden="true" className={`ocean-light ${className}`}>
      <div
        className={`ocean-light__pool ocean-light__pool--lit ocean-light__pool--a ${lit} -left-[16%] top-[-24%] h-[62vw] max-h-[36rem] w-[62vw] max-w-[36rem]`}
      />
      <div
        className={`ocean-light__pool ocean-light__pool--deep ocean-light__pool--b ${deep} -left-[4%] top-[6%] h-[40vw] max-h-[24rem] w-[40vw] max-w-[24rem]`}
      />
      <div
        className={`ocean-light__pool ocean-light__pool--lit ocean-light__pool--b ${lit} -right-[14%] bottom-[-28%] h-[54vw] max-h-[32rem] w-[54vw] max-w-[32rem]`}
      />
    </div>
  )
}
