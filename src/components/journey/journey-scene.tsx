'use client'

import { useCallback, useEffect, useRef } from 'react'
import { journey } from '@/content/journey'
import type { JourneyScene as Scene } from '@/content/types'

/**
 * The footage layer of the arrival journey.
 *
 * Four takes stacked on top of each other, cross-fading by opacity. Only the
 * active one is opaque; only the active one is playing.
 *
 * Three things here are deliberate and worth not undoing:
 *
 * 1. Every scene carries its poster as its own element underneath the video,
 *    rather than relying on the `poster` attribute. A `<video>` at zero
 *    opacity hides its poster too, so the attribute cannot hold a frame for a
 *    scene that is loading or has fallen back. Painted separately, there is
 *    always something on screen and never a blank frame.
 *
 * 2. The variant is chosen in JavaScript, not by `<source media>`. That
 *    attribute was dropped from the HTML spec and no browser honours it, so
 *    the only way to avoid downloading both a landscape and a portrait encode
 *    is to decide before the element gets a `src`. The layer never renders on
 *    the server, so reading `matchMedia` cannot desynchronise hydration.
 *
 * 3. A scene's `src` is withheld until the sequence is close enough to need
 *    it. The first take is the only thing requested when the layer opens; the
 *    rest arrive with several seconds of lead over the beat that shows them.
 */

const { scenes } = journey

type Variant = 'wide' | 'tall'

/** What the layer is showing for the active scene right now. */
export type Gate = 'waiting' | 'video' | 'poster'

interface JourneySceneProps {
  /** The scene the current beat plays over, or null for the handover. */
  activeId: Scene['id'] | null
  /** How far the sequence has advanced, which decides what may start loading. */
  momentIndex: number
  variant: Variant
  gate: Gate
  /** Fired the first time the active scene actually starts moving. */
  onPlaying: (id: Scene['id']) => void
  /** Fired when a scene cannot play at all, so the gate can fall back at once. */
  onFailed: (id: Scene['id']) => void
}

export function JourneyScene({
  activeId,
  momentIndex,
  variant,
  gate,
  onPlaying,
  onFailed,
}: JourneySceneProps) {
  return (
    <div className="journey-stack">
      {scenes.map((scene, index) => (
        <SceneVideo
          key={scene.id}
          scene={scene}
          variant={variant}
          isActive={scene.id === activeId}
          /* Revealed only once this scene is genuinely playing. A scene that
             has fallen back to its poster stays hidden for the rest of its
             beat, so late-arriving video never flashes in just before the
             sequence moves on. */
          isRevealed={scene.id === activeId && gate === 'video'}
          /* The origin is needed at once. Everything after it waits for the
             sequence to reach the beat before the one that shows it. */
          isArmed={index === 0 || momentIndex >= index}
          onPlaying={onPlaying}
          onFailed={onFailed}
        />
      ))}
    </div>
  )
}

interface SceneVideoProps {
  scene: Scene
  variant: Variant
  isActive: boolean
  isRevealed: boolean
  isArmed: boolean
  onPlaying: (id: Scene['id']) => void
  onFailed: (id: Scene['id']) => void
}

function SceneVideo({
  scene,
  variant,
  isActive,
  isRevealed,
  isArmed,
  onPlaying,
  onFailed,
}: SceneVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const source = scene[variant]

  /* Starting a take is a two-step affair, because the old one-step version is
     exactly what broke on a phone: `play()` was called on an element with no
     data at all, and `currentTime` was written while `readyState` was zero,
     which is a no-op at best and throws on older WebKit.

     Now nothing is asked of the element until it has metadata. If it already
     has some, start immediately; otherwise wait for `loadedmetadata` once. */
  const start = useCallback(() => {
    const video = ref.current
    if (!video) return

    // Safe only now: a timeline exists, so seeking to the top means something.
    if (video.readyState > 0 && video.currentTime > 0) video.currentTime = 0

    const played = video.play()
    // Autoplay can still be refused — Low Power Mode, a strict policy, a
    // codec the browser will not touch. That is not a failure of the journey:
    // the poster carries the beat and the sequence keeps its timing.
    if (played) played.catch(() => onFailed(scene.id))
  }, [onFailed, scene.id])

  useEffect(() => {
    const video = ref.current
    if (!video) return

    if (!isActive) {
      video.pause()
      return
    }

    if (video.readyState >= 1) {
      start()
      return
    }

    const onMeta = () => start()
    const onError = () => onFailed(scene.id)
    video.addEventListener('loadedmetadata', onMeta, { once: true })
    video.addEventListener('error', onError, { once: true })
    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('error', onError)
    }
  }, [isActive, start, onFailed, scene.id])

  return (
    <div className="journey-scene" data-state={isActive ? 'active' : 'idle'}>
      {/*
        The poster, as its own layer. It is what the visitor looks at while
        the take loads, and what they keep looking at if it never arrives.
        Only armed scenes paint one: an unarmed scene is not on screen, and
        fetching its still would cost bytes for a frame nobody sees.
      */}
      {/* Deliberately a plain <img>: these posters are already sized and
          compressed for exactly this box, and routing them through the image
          optimiser would add a round-trip to the one frame whose whole job is
          to be on screen before anything else is. */}
      {isArmed && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="journey-poster" src={source.poster} alt="" aria-hidden="true" />
      )}

      <video
        ref={ref}
        className="journey-video"
        data-state={isRevealed ? 'shown' : 'hidden'}
        /* Real pixel dimensions, so the box is right before any bytes land. */
        width={source.width}
        height={source.height}
        src={isArmed ? source.src : undefined}
        preload={isArmed ? 'auto' : 'none'}
        muted
        playsInline
        disablePictureInPicture
        onPlaying={() => onPlaying(scene.id)}
        /* Decorative: the prose summary in the dialog carries the story, and
           each scene's description is read out with the beat it belongs to. */
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}

/**
 * The route drawn over the crossing.
 *
 * A hairline between two named points and a light travelling along it. There
 * is no aircraft, no globe and no map, because the footage is licensed
 * atmospheric imagery: it does not record our shipment, and a route drawn like
 * a flight tracker would claim that it does. What this states is only what is
 * verified — the coffee leaves through Kona International Airport and reaches
 * the Bay Area.
 */
export function JourneyRouteLine() {
  const { route } = journey

  return (
    <div className="journey-route" aria-hidden="true">
      <span className="journey-route__place">{route.from}</span>
      <span className="journey-route__track">
        <svg
          className="journey-route__rule"
          viewBox="0 0 200 4"
          preserveAspectRatio="none"
          focusable="false"
        >
          {/* Two strokes drawn as one: a soft dark line under a warm sand
              one, so the hairline holds over both bright cloud and dark
              water without needing a filter. */}
          <line
            className="journey-route__line journey-route__line--shadow"
            x1="0"
            y1="2"
            x2="200"
            y2="2"
            pathLength="1"
            vectorEffect="non-scaling-stroke"
          />
          <line
            className="journey-route__line journey-route__line--ink"
            x1="0"
            y1="2"
            x2="200"
            y2="2"
            pathLength="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* Rides the drawing edge of the line: same duration, same easing. */}
        <span className="journey-route__mark" />
      </span>
      <span className="journey-route__place">{route.to}</span>
    </div>
  )
}
