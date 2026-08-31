'use client'

import { useCallback, useEffect, useState } from 'react'
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
 *
 * Two fixes from a correction pass, both proven against the committed files
 * rather than guessed:
 *
 * 1. The poster's and video's own `<source media="...">` breakpoint used to
 *    read 699px while the layout around it switches from the mobile stacked
 *    composition to the desktop overlay at Tailwind's `sm:` (640px). Between
 *    640–699px that meant the desktop overlay layout rendered while the
 *    *mobile* portrait (810×1080) video/poster were still selected — a
 *    portrait source stretched into a 16:9-ish overlay box, `object-cover`
 *    zooming in until only the cup's rim and logo filled the entire frame.
 *    Reproduced and screenshotted at 650px before this fix. The breakpoint
 *    below is now 639px, exactly matching `sm:`, so the two switches can
 *    never straddle different sources again.
 *
 * 2. The mobile stage used to be an arbitrary `52svh` band, whose aspect
 *    ratio matched neither the mobile master's own 3:4 (810×1080) framing.
 *    `object-cover` inside a mismatched box crops unpredictably depending on
 *    viewport height. A later pass made it `aspect-[3/4]` instead — the
 *    master's exact native ratio, so nothing was cropped — but on a real
 *    phone that meant a full-width 3:4 box (up to ~575px tall on a large
 *    phone), which read as the cup filling nearly the entire screen with the
 *    copy pushed almost out of the first viewport. The stage is now a fixed
 *    band, `clamp(25rem,55svh,34rem)` tall regardless of width, and the
 *    poster/video sit inside it at `object-contain` with a `6%` inset (so
 *    each media file scales to ~88% of the box) instead of filling it edge
 *    to edge — the full cup stays legible without the box itself dominating
 *    the screen. The poster and video still share one identical className,
 *    so swapping one for the other cannot change width, height, object-fit,
 *    object-position or scale, and still cannot shift layout.
 *
 * `autoplayBlocked` covers the remaining case a fixed box can't: a browser
 * that declines the autoplay attempt outright (some in-app/embedded
 * webviews, or a first load before the page has any user activation on
 * certain mobile browsers). `video.play()` is called explicitly once the
 * element mounts so its returned promise can be inspected; a rejection shows
 * one small centered play control over the poster — never the default
 * state, and it never appears for a browser that autoplayed successfully.
 *
 * One resolved `src`, not sibling `<source>` candidates. A VP9/WebM
 * derivative sits alongside each approved H.264 master (same content, same
 * duration, no audio, no upscale — see `public/hero/SOURCES.md`), and
 * `canPlayType` picks whichever this browser actually supports — WebM where
 * it can, the original MP4 (Safari, older engines) where it can't — so
 * exactly one file is ever requested. Four sibling `<source>` elements (two
 * codecs × two breakpoints) were tried first and measurably fired a spurious
 * `error` on this element within ~15ms of mount specifically when React
 * inserted them — the identical markup worked when built with plain
 * `createElement`/`appendChild`, and dropping to two `<source>` elements
 * also worked, isolating the failure to how many sibling sources React
 * mounts under one `<video>` at once. `Scene` in `satellite-journey.tsx`
 * already resolves its own video variant in JS to one `src` rather than
 * leaning on `<source>` fallback for exactly this kind of switch; this
 * follows that precedent instead of trusting the fragile path a second
 * time. `key={videoSrc}` forces a clean remount on a breakpoint change
 * (e.g. rotating a phone) instead of reusing a node still holding the other
 * master.
 *
 * The play attempt is keyed off the mounted DOM node itself, not off
 * `showVideo`. A `ref` callback (rather than a plain `useRef`) turns "the
 * video element exists" into real React state, so the effect that calls
 * `.play()` cannot run before that node exists — it has nothing to depend on
 * until React hands it one. Depending on `showVideo` alone relies on ref
 * attachment and this effect landing in the same commit, which usually
 * holds but isn't the thing actually guaranteeing readiness. The native
 * `autoplay` attribute stays (never the only thing relied on — see below),
 * but the element is inserted with `preload="auto"` and no guarantee of
 * `readyState` yet, so the first explicit `.play()` call can land before any
 * data has arrived and be silently dropped by some engines rather than
 * queued. `loadeddata` and `canplay` listeners retry the same attempt once
 * more data is actually available, so a drop at `readyState === 0` isn't the
 * end of it. Only a genuine rejection — not just "hasn't started yet" — sets
 * `autoplayBlocked`.
 */
export function LatteHero() {
  const prefersReducedMotion = useReducedMotion()
  const [videoFailed, setVideoFailed] = useState(false)
  // False on the server and on the client's first render — matching exactly,
  // so hydration never has to reconcile a server/client mismatch — and true
  // only from this point on, once it is actually safe to read and act on the
  // real `prefers-reduced-motion` value. See the block comment above.
  const [canMountVideo, setCanMountVideo] = useState(false)
  // True only once a real, observed autoplay rejection occurs — never the
  // default rendered state. See the block comment above.
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  // The mounted <video> node, as React state rather than a plain ref, so the
  // play-attempt effect below can depend on the node actually existing
  // instead of inferring it from `showVideo`. Set by the `ref` callback
  // passed to the element — React calls that callback with the real node
  // only once it is in the DOM, and with `null` once it's removed.
  const [videoNode, setVideoNode] = useState<HTMLVideoElement | null>(null)
  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    setVideoNode(node)
  }, [])
  // Same breakpoint the poster's `<picture>` and the layout below switch on
  // (639px, matching Tailwind's `sm:`), read the same way `satellite-
  // journey.tsx` reads its own narrow breakpoint: `matchMedia` plus a
  // `change` listener, not a resize listener re-measuring width on every
  // pixel.
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    // Deliberate: React's own documented pattern for rendering something
    // only after the client has mounted, which is exactly what a correct
    // `prefers-reduced-motion` read requires here (see the block comment
    // above) — not the derived-state anti-pattern this rule targets.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanMountVideo(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNarrow(mq.matches)
    const onChange = () => setNarrow(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const showVideo = canMountVideo && !prefersReducedMotion && !videoFailed
  // Never touches the DOM during SSR — `document` doesn't exist there, and
  // `showVideo` is false on every server render anyway (see above), so the
  // fallback value here is never actually rendered into a `<video>`.
  const videoExt =
    typeof document !== 'undefined' &&
    document.createElement('video').canPlayType('video/webm; codecs="vp9"')
      ? 'webm'
      : 'mp4'
  const videoSrc = `/hero/latte-hero-${narrow ? 'mobile' : 'desktop'}.${videoExt}`

  // Depends on the mounted node itself (see the block comment above), not on
  // `showVideo` alone — this cannot run until React has actually handed the
  // ref callback a real element.
  useEffect(() => {
    if (!showVideo || !videoNode) return

    let settled = false

    // Resets the flag for a fresh mount (e.g. after reduced-motion toggles
    // off and back on) before the actual play attempt below decides it.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAutoplayBlocked(false)

    const attemptPlay = () => {
      if (settled || !videoNode.paused) return
      videoNode.play().then(
        () => {
          settled = true
        },
        () => {
          // Only a genuine rejection reaches here — `loadeddata`/`canplay`
          // retry the same attempt first, so this never fires just because
          // the element wasn't ready yet on the very first try.
          if (!settled) setAutoplayBlocked(true)
        },
      )
    }
    const onPlaying = () => {
      settled = true
      setAutoplayBlocked(false)
    }

    attemptPlay()
    videoNode.addEventListener('loadeddata', attemptPlay)
    videoNode.addEventListener('canplay', attemptPlay)
    videoNode.addEventListener('playing', onPlaying)

    const onVisibility = () => {
      if (document.hidden) videoNode.pause()
      else attemptPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      settled = true
      videoNode.removeEventListener('loadeddata', attemptPlay)
      videoNode.removeEventListener('canplay', attemptPlay)
      videoNode.removeEventListener('playing', onPlaying)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [showVideo, videoNode])

  const retryPlayback = () => {
    if (!videoNode) return
    videoNode.play().then(
      () => setAutoplayBlocked(false),
      () => setAutoplayBlocked(true)
    )
  }

  const media = (
    <>
      {/* Poster: always present, so the first paint is never blank and a
          no-JS or video-failure visitor still sees the real drink. A plain
          `<picture>` — the same art-direction pattern `SatelliteJourney`
          uses for its place photos — so only the poster matching the
          viewport is ever requested; `next/image` cannot make that guarantee
          across two swapped instances. */}
      <picture>
        {/* 639px, not 700 — exactly Tailwind's `sm:` breakpoint that the
            layout below switches on, so this can never select a different
            source than the one the surrounding composition was built for. */}
        <source media="(max-width: 639px)" srcSet="/hero/latte-hero-mobile.jpg" />
        <img
          src="/hero/latte-hero-desktop.jpg"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-contain p-[6%] sm:object-cover sm:p-0"
        />
      </picture>

      {showVideo && (
        <video
          key={videoSrc}
          ref={setVideoRef}
          data-hero-video
          src={videoSrc}
          className="absolute inset-0 h-full w-full object-contain p-[6%] sm:object-cover sm:p-0"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero/latte-hero-desktop.jpg"
          onError={() => setVideoFailed(true)}
        />
      )}

      {showVideo && autoplayBlocked && (
        <button
          type="button"
          onClick={retryPlayback}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-charcoal-900/60 text-sand-50 ring-1 ring-sand-50/40 backdrop-blur-sm transition-colors hover:bg-charcoal-900/75">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
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
      {/* A fixed band below `sm`, not an aspect ratio — see the block
          comment above for why a full-width 3:4 box read as too large on a
          real phone. `bg-charcoal-900` matches the section's own ground so
          the `object-contain` letterboxing this stage now needs is never a
          visible seam. At `sm:` and up the section's own `aspect-video`
          takes over and this box just fills it, unchanged from before. */}
      <div className="relative h-[clamp(25rem,55svh,34rem)] overflow-hidden bg-charcoal-900 sm:absolute sm:inset-0 sm:h-full">
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
