'use client'

import { useEffect, useRef } from 'react'
import { journey } from '@/content/journey'
import type { JourneyScene as Scene } from '@/content/types'

/**
 * The footage layer of the arrival journey.
 *
 * Three takes stacked on top of each other, cross-fading by opacity. Only the
 * active one is opaque; only the active one is playing. Nothing here animates
 * anything but opacity and transform, so the whole stack stays on the
 * compositor.
 *
 * Two things are deliberate and worth not undoing:
 *
 * 1. The variant is chosen in JavaScript, not by `<source media>`. That
 *    attribute was dropped from the HTML spec and no browser honours it, so
 *    the only way to avoid downloading both a landscape and a portrait encode
 *    is to decide before the element gets a `src`. The layer never renders on
 *    the server, so reading `matchMedia` here cannot desynchronise hydration.
 *
 * 2. A scene's `src` is withheld until the sequence is close enough to need
 *    it. The first take is the only thing requested when the layer opens; the
 *    crossing is asked for two seconds later and the arrival two seconds after
 *    that, each with several seconds of lead over the moment that shows it.
 */

const { scenes } = journey

type Variant = 'wide' | 'tall'

interface JourneySceneProps {
  /** The scene the current moment is playing over, or null for the handover. */
  activeId: Scene['id'] | null
  /** How far the sequence has advanced, which decides what may start loading. */
  momentIndex: number
  variant: Variant
}

export function JourneyScene({ activeId, momentIndex, variant }: JourneySceneProps) {
  return (
    <div className="journey-stack">
      {scenes.map((scene, index) => (
        <SceneVideo
          key={scene.id}
          scene={scene}
          variant={variant}
          isActive={scene.id === activeId}
          /* The origin is needed at once. Everything after it waits for the
             sequence to reach the beat before the one that shows it. */
          isArmed={index === 0 || momentIndex >= index}
        />
      ))}
    </div>
  )
}

interface SceneVideoProps {
  scene: Scene
  variant: Variant
  isActive: boolean
  isArmed: boolean
}

function SceneVideo({ scene, variant, isActive, isArmed }: SceneVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const source = scene[variant]

  /* Play from the top whenever this scene becomes the active one, and stop
     when it stops being it. Consecutive moments over the same take never pass
     through here, so the shot runs on uninterrupted while the copy changes. */
  useEffect(() => {
    const video = ref.current
    if (!video) return

    if (!isActive) {
      video.pause()
      return
    }

    video.currentTime = 0
    // Autoplay can be refused even when muted. The poster stays up if it is,
    // and the copy sits on its own vignette, so nothing becomes unreadable.
    const played = video.play()
    if (played) played.catch(() => {})
  }, [isActive])

  return (
    <video
      ref={ref}
      className="journey-video"
      data-state={isActive ? 'active' : 'idle'}
      /* Real pixel dimensions, so the box is right before any bytes land. */
      width={source.width}
      height={source.height}
      /* The poster is armed with the video, not before it. Left unconditional
         it would pull all three stills down at open for two the visitor never
         sees, since by the time a later take is shown its own video is
         already buffered. Armed, it arrives seconds ahead of its clip and is
         a real fallback if that clip is slow or autoplay is refused. */
      poster={isArmed ? source.poster : undefined}
      src={isArmed ? source.src : undefined}
      preload={isArmed ? 'auto' : 'none'}
      muted
      playsInline
      disablePictureInPicture
      /* Decorative: the prose summary in the dialog carries the story, and
         each scene's description is read out with the moment it belongs to. */
      aria-hidden="true"
      tabIndex={-1}
    />
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
