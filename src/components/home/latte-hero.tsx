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
 * The desktop master frames the cup in the right ~60% of the 1920×1080 frame
 * (its left edge sits at roughly x=770, i.e. 40% in), with dark negative
 * space filling the left side — every word and action lives inside that
 * space, never over the cup, its marbling, garnish or logo. The section is
 * locked to the source's own `aspect-video` (16:9) rather than a viewport-
 * height band: `object-cover` only ever needs to crop top/bottom letterboxing
 * at that ratio, never the left/right edges, so the 40%-wide negative space
 * stays exactly 40% of the frame at every width instead of shrinking as a
 * tall, narrow viewport would otherwise force a center-cropped `object-cover`
 * to eat into it. The copy column's `max-w-[min(28rem,34vw)]` stays
 * comfortably inside that fixed 40%, safe zone confirmed at 1440/1280/1024/768.
 *
 * The mobile crop is tighter and does not have that negative space (it is
 * centred on the cup so the garnish and logo stay full-frame), so overlaying
 * the same copy there read poorly in review — text sitting across the drink
 * itself. Below `sm`, the layout instead stacks: the video/poster fills a
 * fixed-height band on top, and the copy sits on a solid ground underneath
 * it, never over the image. That is a deliberate mobile-only composition
 * change, not a stretch or a crop of the desktop frame.
 *
 * The server-rendered HTML — and the client's very first hydration pass —
 * never contain a `<video>` element at all, only the poster. `useReducedMotion`
 * is backed by `useSyncExternalStore`, whose server snapshot is hard-coded to
 * `false` (the server has no media queries): gating the video on that value
 * directly would put a `<video preload="auto" autoPlay>` tag in the literal
 * HTML the browser parses before any JS runs, so a `prefers-reduced-motion`
 * visitor's browser would start fetching the 1.8 MB commercial immediately
 * and only have React remove the element a moment later — the fetch is
 * already in flight by then. Instead, `canMountVideo` starts `false` on
 * both server and first client render (identical markup, no hydration
 * mismatch) and flips true only inside a post-hydration effect, which is the
 * first point a real `prefers-reduced-motion` read is safe to act on. A
 * `prefers-reduced-motion` visitor's `showVideo` then never becomes true, so
 * the video's `<source>` tags are never inserted into the DOM and the
 * browser never requests them — not merely a hidden-but-fetched element, an
 * absent one. The poster image is rendered unconditionally underneath it, so
 * every visitor — reduced motion, no JS, or the instant before hydration —
 * sees the real drink from first paint.
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
  // False on the server and on the client's first render — matching exactly,
  // so hydration never has to reconcile a server/client mismatch — and true
  // only from this point on, once it is actually safe to read and act on the
  // real `prefers-reduced-motion` value. See the block comment above.
  const [canMountVideo, setCanMountVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    // Deliberate: React's own documented pattern for rendering something
    // only after the client has mounted, which is exactly what a correct
    // `prefers-reduced-motion` read requires here (see the block comment
    // above) — not the derived-state anti-pattern this rule targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanMountVideo(true)
  }, [])

  const showVideo = canMountVideo && !prefersReducedMotion && !videoFailed

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
        className="mt-5 font-display text-[clamp(1.75rem,1.1rem+2.6vw,2.75rem)] font-light leading-[1.08] text-sand-50"
      >
        Meet the
        <br />
        Kona Island Latte
      </h1>

      <p className="mt-5 font-body text-base leading-relaxed text-sand-100/85 sm:text-lg">
        Macadamia. Coconut. Espresso.
        <br />
        Made for your island escape.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <OrderChooser
          solid={false}
          label="Order Yours"
          align="left"
          triggerClassName="inline-flex min-h-14 items-center justify-center gap-2 whitespace-nowrap rounded-panel bg-sand-50 px-5 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
        />

        <Link
          href="/menu-preview"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-panel border border-sand-50/40 px-5 py-3.5 font-body text-sm text-sand-100/90 transition-colors duration-200 hover:border-sand-50 hover:text-sand-50"
        >
          Explore the Menu
        </Link>
      </div>
    </>
  )

  const journeyLink = (
    <Link
      href="/our-kona-journey"
      className="inline-flex items-center gap-2 font-body text-sm text-sand-100/70 underline decoration-sand-100/30 underline-offset-4 transition-colors hover:text-sand-50 hover:decoration-sand-50"
    >
      Discover Our Kona Journey
      <span aria-hidden="true">→</span>
    </Link>
  )

  return (
    // One media block and one copy block, in the DOM exactly once — CSS
    // repositions them per breakpoint rather than the component rendering
    // two separate video/picture instances, which would fetch the hero twice.
    // `sm:aspect-video` locks the container to the source master's own 16:9
    // ratio so `object-cover` never has to crop the left/right edges — see
    // the block comment above for why that matters to the copy's safe zone.
    <section aria-labelledby="hero-heading" className="relative bg-charcoal-900 sm:aspect-video">
      <div className="relative h-[52svh] min-h-[22rem] overflow-hidden sm:absolute sm:inset-0 sm:h-full sm:min-h-0">
        {media}
        {/* Only overlaid on desktop, where the master's own negative space
            supports it. Mobile's copy sits below the media instead. Stops
            at 42% of the frame width — just past the cup's own left edge at
            40% — so the scrim never dims the drink itself. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              'linear-gradient(to right, rgba(27,25,23,0.85) 0%, rgba(27,25,23,0.55) 22%, rgba(27,25,23,0.18) 38%, transparent 42%)',
          }}
        />
      </div>

      <div className="relative px-5 pb-14 pt-10 sm:absolute sm:inset-0 sm:flex sm:flex-col sm:justify-between sm:px-8 sm:pb-[clamp(1.5rem,4vw,2.5rem)] sm:pt-[clamp(4.5rem,9vw,7rem)] lg:pl-12">
        <div className="sm:max-w-[min(28rem,34vw)]">{actions}</div>
        <p className="mt-8 sm:mt-0 sm:max-w-[min(28rem,34vw)]">{journeyLink}</p>
      </div>
    </section>
  )
}
