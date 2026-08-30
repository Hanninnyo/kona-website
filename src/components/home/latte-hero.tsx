'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { OrderChooser } from '@/components/order-chooser'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * The Kona Island Latte commercial — the homepage opening.
 *
 * This is an owner-approved, AI-assisted product visualization built from
 * authentic owner-supplied Kona Island Coffee references (the cup, the
 * printed logo and the real drink colors). It is not documentary footage of
 * a drink being prepared and must never be described as such. The cup is
 * intentionally left open through the whole film so the espresso pour and the
 * macadamia garnish stay visible; real iced service uses a flat lid. Full
 * provenance is recorded in `public/hero/SOURCES.md`.
 *
 * The desktop master already frames the cup in the right half of the frame
 * with dark negative space on the left — the copy overlays it there
 * deliberately, because the source composition already supports it. The
 * mobile crop is tighter and does not have that negative space (it is
 * centred on the cup so the garnish and logo stay full-frame), so overlaying
 * the same copy there read poorly in review — text sitting across the drink
 * itself. Below `sm`, the layout instead stacks: the video/poster fills a
 * fixed-height band on top, and the copy sits on a solid ground underneath
 * it, never over the image. That is a deliberate mobile-only composition
 * change, not a stretch or a crop of the desktop frame.
 *
 * Video only ever mounts once `useReducedMotion` resolves it should — the
 * same pattern `SatelliteJourney` and `SectionReveal` use elsewhere in this
 * codebase, so a `prefers-reduced-motion` visitor never gets an element that
 * autoplays and has to be stopped after the fact. The poster image is
 * rendered unconditionally underneath it, and `<noscript>` hides the video
 * markup outright, so a script-disabled browser is left with exactly the
 * still and the (already plain, always-functional) actions below.
 *
 * The commercial has no audio track. No "Sound On" control is rendered — a
 * control for a track that does not exist would be a lie the first time
 * someone tapped it. `data-hero-video` is reserved so a future pass can
 * target this element to add a real mute/unmute control once sound design
 * exists, without otherwise restructuring the component.
 */
export function LatteHero() {
  const prefersReducedMotion = useReducedMotion()
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const showVideo = !prefersReducedMotion && !videoFailed

  useEffect(() => {
    const video = videoRef.current
    if (!showVideo || !video) return

    const onVisibility = () => {
      if (document.hidden) video.pause()
      else video.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [showVideo])

  const media = (
    <>
      {/* Poster: always present, so the first paint is never blank and a
          no-JS or video-failure visitor still sees the real drink. A plain
          `<picture>` — the same art-direction pattern `SatelliteJourney`
          uses for its place photos — so only the poster matching the
          viewport is ever requested; `next/image` cannot make that guarantee
          across two swapped instances. */}
      <picture>
        <source media="(max-width: 699px)" srcSet="/hero/latte-hero-mobile.jpg" />
        <img
          src="/hero/latte-hero-desktop.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      {showVideo && (
        <video
          ref={videoRef}
          data-hero-video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster="/hero/latte-hero-desktop.jpg"
          onError={() => setVideoFailed(true)}
        >
          <source media="(max-width: 699px)" src="/hero/latte-hero-mobile.mp4" type="video/mp4" />
          <source src="/hero/latte-hero-desktop.mp4" type="video/mp4" />
        </video>
      )}

      <noscript>
        <style>{'[data-hero-video]{display:none !important}'}</style>
      </noscript>
    </>
  )

  const actions = (
    <>
      <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
        100% Kona Coffee
      </p>

      <h1
        id="hero-heading"
        className="mt-5 max-w-xl font-display text-display-lg font-light text-sand-50"
      >
        Meet the Kona Island Latte
      </h1>

      <p className="mt-6 max-w-md font-body text-lede text-sand-100/85">
        Macadamia. Coconut. Espresso.
        <br />
        Made for your island escape.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <OrderChooser
          solid={false}
          label="Order Yours"
          align="left"
          triggerClassName="inline-flex min-h-14 items-center justify-center gap-2 rounded-panel bg-sand-50 px-7 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
        />

        <Link
          href="/menu-preview"
          className="inline-flex items-center justify-center rounded-panel border border-sand-50/45 px-7 py-3.5 font-body text-sm text-sand-50 transition-colors duration-200 hover:border-sand-50 hover:bg-sand-50/10"
        >
          Explore the Menu
        </Link>
      </div>

      <p className="mt-8">
        <Link
          href="/our-kona-journey"
          className="inline-flex items-center gap-2 font-body text-sm text-sand-100/80 underline decoration-sand-100/40 underline-offset-4 transition-colors hover:text-sand-50 hover:decoration-sand-50"
        >
          Discover Our Kona Journey
          <span aria-hidden="true">→</span>
        </Link>
      </p>
    </>
  )

  return (
    // One media block and one copy block, in the DOM exactly once — CSS
    // repositions them per breakpoint rather than the component rendering
    // two separate video/picture instances, which would fetch the hero twice.
    <section aria-labelledby="hero-heading" className="relative bg-charcoal-900 sm:min-h-[88svh]">
      <div className="relative h-[52svh] min-h-[22rem] overflow-hidden sm:absolute sm:inset-0 sm:h-auto sm:min-h-0">
        {media}
        {/* Only overlaid on desktop, where the master's own negative space
            supports it. Mobile's copy sits below the media instead. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/25 to-transparent sm:block"
        />
      </div>

      <div className="relative px-5 pb-14 pt-10 sm:mx-auto sm:flex sm:min-h-[88svh] sm:max-w-page sm:items-end sm:px-8 sm:pb-24 sm:pt-40">
        {actions}
      </div>
    </section>
  )
}
