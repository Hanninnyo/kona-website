import Link from 'next/link'
import { OceanLight } from '@/components/ambient/ocean-light'
import { MediaFrame } from '@/components/media-frame'
import { homepage } from '@/content/homepage'

/**
 * Cinematic arrival. Server-rendered: the wordmark, positioning and both
 * actions are in the initial HTML, so ordering and directions never wait on
 * JavaScript.
 *
 * One primary visual, no slideshow, no promotional popup, no opening
 * announcement card, no autoplay media.
 */
export function CinematicHero() {
  const { hero } = homepage
  const hasPhotograph = hero.image.src !== null

  return (
    <section
      id="hero-section"
      // Not quite full-viewport: a deliberate sliver of the next section shows
      // at the fold so the page reads as continuous rather than as a splash.
      className="relative flex min-h-[88svh] items-end overflow-hidden bg-surface-inverse"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0">
        {hasPhotograph ? (
          <MediaFrame
            slot={hero.image}
            priority
            sizes="100vw"
            className="!aspect-auto h-full w-full !rounded-none"
          />
        ) : (
          // Until approved photography lands, the hero is a quiet espresso
          // field rather than a stand-in photograph.
          <div className="h-full w-full bg-gradient-to-b from-espresso-700 via-espresso-900 to-charcoal-900" />
        )}
        {/* Scrim keeps text at AA contrast once a photograph is dropped in. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-charcoal-900/85 via-charcoal-900/45 to-charcoal-900/20"
        />

        {/*
          A trace of the same reflected light along the bottom edge, as an
          invitation to scroll into the section that carries it properly. Sits
          above the scrim but below the copy, masked so it fades out well
          before the headline, and confined to the lowest sliver of the frame
          so it never covers or tints the photograph itself.
        */}
        <OceanLight
          intensity="hint"
          className="!inset-auto bottom-0 left-0 right-0 h-[22%] [mask-image:linear-gradient(to_top,black_0%,transparent_100%)]"
        />
      </div>

      <div className="relative mx-auto w-full max-w-page px-5 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
          {hero.eyebrow}
        </p>

        <h1
          id="hero-heading"
          className="mt-5 max-w-4xl font-display text-display-lg font-light text-sand-50"
        >
          {hero.headline}
        </h1>

        <p className="mt-6 max-w-xl font-body text-lede text-sand-100/85">
          {hero.place}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href={hero.actions.visit.href}
            className="inline-flex items-center justify-center rounded-panel bg-sand-50 px-7 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
          >
            {hero.actions.visit.label}
          </Link>

          <a
            href={hero.actions.order.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-panel border border-sand-50/45 px-7 py-3.5 font-body text-sm text-sand-50 transition-colors duration-200 hover:border-sand-50 hover:bg-sand-50/10"
          >
            {hero.actions.order.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        {!hasPhotograph && (
          <p className="mt-12 max-w-md border-l-2 border-gold-500/50 pl-4 font-body text-xs leading-relaxed text-sand-100/55">
            Awaiting approved photography: {hero.image.awaiting}
          </p>
        )}
      </div>
    </section>
  )
}
