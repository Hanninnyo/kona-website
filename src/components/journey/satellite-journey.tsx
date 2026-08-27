'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { journey } from '@/content/journey'
import {
  CAPTION_ANCHORS,
  DURATION,
  frameAt,
  placement,
  point,
  pointAt,
  resolve,
  routeLength,
  routePath,
  routePoints,
  type Frame,
} from '@/lib/journey/timeline'

/* ==========================================================================
   The Kona journey

   An optional eleven-second sequence that plays only when the visitor asks
   for it, driven by one requestAnimationFrame loop and one pure function of
   elapsed time. React state changes about six times in the whole experience —
   never per frame. Everything that moves is written straight to a ref's
   `style` as a transform or an opacity.

   Two modes, and the linear one is what the server sends:

   `linear` — three stills, their words, and the destination choice, in
              document order. This is the whole experience for a visitor with
              `prefers-reduced-motion: reduce` or no JavaScript, and it is
              complete: every claim, both destinations, every verified link.

   `stage`  — the animation, mounted on the client only.
   ========================================================================== */

const { cover, captions, footage, satellite, photos, destinations, close, controls } = journey

/** Below this width the portrait encodes and the lighter satellite files. */
const NARROW = '(max-width: 699px)'

/**
 * On a narrow screen the camera is pulled in slightly, so the corridor still
 * occupies most of the width rather than sitting small in the middle of it.
 * The route stays geographically exact either way — this scales the window,
 * not the geography.
 */
const NARROW_SPAN = 0.86

type Mode = 'linear' | 'stage'
type Phase = 'cover' | 'playing' | 'destination'
type Choice = (typeof destinations)[number]['id']

export function SatelliteJourney() {
  const [mode, setMode] = useState<Mode>('linear')
  const [variant, setVariant] = useState<'wide' | 'tall' | null>(null)
  const [narrow, setNarrow] = useState(false)
  const [phase, setPhase] = useState<Phase>('cover')
  const [paused, setPaused] = useState(false)
  /**
   * Which asset set is loaded, rather than a bare boolean.
   *
   * Keying it this way means readiness is *derived* from the current variant
   * rather than reset by an effect: rotating a phone changes the key, which
   * makes `ready` false again on its own, with no synchronous setState in an
   * effect and no window where a stale `true` could let the sequence start on
   * media it does not have.
   */
  const [readyKey, setReadyKey] = useState<string | null>(null)
  /** Only shown if preparation actually takes a moment. */
  const [preparing, setPreparing] = useState(false)
  const [choice, setChoice] = useState<Choice>('mountain-view')
  /**
   * True once the client has decided which mode applies.
   *
   * The linear story is in the markup the server sends, which is what makes
   * the experience work without JavaScript — but its images are then inside
   * the document from the first paint, and the browser starts fetching them
   * before React has had a chance to say that this visitor is getting the
   * animation instead. Hiding it until the decision is made keeps five
   * pictures off the wire for everyone who never sees it; the `noscript` rule
   * hands it straight back to anyone with no script to make the decision.
   */
  const [resolved, setResolved] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const beginRef = useRef<HTMLButtonElement>(null)
  const layerRefs = useRef<Record<string, HTMLElement | null>>({})
  const captionRefs = useRef<Record<string, HTMLElement | null>>({})
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const routeRef = useRef<SVGSVGElement>(null)
  const routeLineRef = useRef<SVGPathElement>(null)
  const routeHeadRef = useRef<SVGPathElement>(null)
  const glintRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<Record<string, HTMLElement | null>>({})

  /* Passed to each scene so a child never writes to a ref it was handed. */
  const registerVideo = useCallback((id: string, node: HTMLVideoElement | null) => {
    videoRefs.current[id] = node
  }, [])


  const assetKey = mode === 'stage' && variant ? `${variant}:${narrow ? 'n' : 'w'}` : null
  const ready = assetKey !== null && readyKey === assetKey

  /** Seconds of the sequence played so far. The only clock. */
  const elapsed = useRef(0)
  const frame = useRef(0)
  const last = useRef(0)
  /** Set while the tab is hidden, so resuming does not override a real pause. */
  const autoPaused = useRef(false)

  const path = useMemo(() => routePoints(), [])
  const pathD = useMemo(() => routePath(path), [path])
  const pathLen = useMemo(() => routeLength(path), [path])

  /* ------------------------------------------------------------------ mode */
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const small = window.matchMedia(NARROW)

    const decide = () => {
      setNarrow(small.matches)
      // A visitor who has asked for less motion keeps the linear story: no
      // timeline, no camera, no video, no animation loop at all.
      setMode(still.matches ? 'linear' : 'stage')
      setVariant(still.matches ? null : small.matches ? 'tall' : 'wide')
      setResolved(true)
    }

    decide()
    still.addEventListener('change', decide)
    small.addEventListener('change', decide)
    return () => {
      still.removeEventListener('change', decide)
      small.removeEventListener('change', decide)
    }
  }, [])

  /* --------------------------------------------------------------- loading */
  /*
    Only the coastline is needed to paint the opening screen. The farm take
    and the close satellite view are prepared during idle time behind it, and
    the wide satellite view has to be in hand before Begin will start
    anything — the sequence must never stall halfway through a pullback.
  */
  useEffect(() => {
    if (mode !== 'stage' || !variant || !assetKey) return
    const need = new Set(['farm', 'island', 'pacific'])
    const markReady = (key: string) => {
      need.delete(key)
      if (need.size === 0) setReadyKey(assetKey)
    }
    const hint = window.setTimeout(() => setPreparing(true), 1000)

    const load = () => {
      const island = new Image()
      island.onload = island.onerror = () => markReady('island')
      island.src = narrow ? satellite.island.mid.src : satellite.island.wide.src

      const pacific = new Image()
      pacific.onload = pacific.onerror = () => markReady('pacific')
      pacific.src = narrow ? satellite.pacific.mid.src : satellite.pacific.wide.src

      const farm = videoRefs.current.farm
      if (farm) {
        const src = footage.farm[variant].src
        if (farm.getAttribute('src') !== src) {
          farm.src = src
          farm.load()
        }
        if (farm.readyState >= 2) markReady('farm')
        else {
          const done = () => markReady('farm')
          farm.addEventListener('loadeddata', done, { once: true })
          farm.addEventListener('error', done, { once: true })
        }
      } else {
        markReady('farm')
      }
    }

    const idle = window.requestIdleCallback?.(load, { timeout: 1200 })
    const fallback = idle === undefined ? window.setTimeout(load, 200) : undefined
    return () => {
      window.clearTimeout(hint)
      if (idle !== undefined) window.cancelIdleCallback?.(idle)
      if (fallback !== undefined) window.clearTimeout(fallback)
    }
  }, [mode, variant, narrow, assetKey])

  /* Later media is staged once the sequence is running — the Golden Gate has
     nine seconds of warning, the photographs ten. */
  useEffect(() => {
    if (phase !== 'playing' || !variant) return
    const gg = videoRefs.current.california
    if (gg && !gg.getAttribute('src')) {
      gg.src = footage.california[variant].src
      gg.load()
    }
    for (const photo of [photos.cafe, photos.truck]) {
      const img = new Image()
      img.src = narrow ? photo.tall.src : photo.wide.src
    }
  }, [phase, variant, narrow])

  /* -------------------------------------------------------------- painting */
  const apply = useCallback(
    (f: Frame) => {
      const stage = stageRef.current
      if (!stage) return
      const w = stage.clientWidth
      const h = stage.clientHeight
      if (!w || !h) return

      for (const [key, value] of Object.entries(f.layers)) {
        const el = layerRefs.current[key]
        if (el) el.style.opacity = value.toFixed(4)
      }

      const span = f.camera.span * (narrow ? NARROW_SPAN : 1)
      const view = resolve({ ...f.camera, span }, w, h)

      const island = layerRefs.current.islandImage
      if (island) {
        island.style.transform = placement(
          view,
          satellite.island.bounds,
          narrow ? satellite.island.mid.width : satellite.island.wide.width,
        )
      }
      const pacific = layerRefs.current.pacificImage
      if (pacific) {
        pacific.style.transform = placement(
          view,
          satellite.pacific.bounds,
          narrow ? satellite.pacific.mid.width : satellite.pacific.wide.width,
        )
      }

      /* The overlay shares the wide image's geography, so it is placed by the
         same call — which is what guarantees the line sits on the coastline
         rather than near it. `vector-effect` keeps the stroke one pixel wide
         however far the camera has zoomed. */
      const svg = routeRef.current
      if (svg) {
        svg.style.transform = placement(view, satellite.pacific.bounds, satellite.pacific.wide.width)
        svg.style.opacity = f.route.opacity.toFixed(4)
      }
      const sx = (view.ppd * (satellite.pacific.bounds.east - satellite.pacific.bounds.west)) / satellite.pacific.wide.width

      /* Everything about the stroke is expressed in the overlay's own user
         units and divided by the camera's scale, so the line stays one
         hairline wide on screen at every zoom without asking the browser to
         reconcile two coordinate systems. */
      if (routeLineRef.current) {
        const line = routeLineRef.current
        line.style.strokeWidth = String(1.25 / sx)
        line.style.strokeDasharray = `${pathLen} ${pathLen}`
        line.style.strokeDashoffset = String(pathLen * (1 - f.route.progress))
      }
      if (routeHeadRef.current) {
        /* A short brighter length riding at the head of the drawn line. */
        const head = Math.max(0, f.route.progress - 0.055)
        const lit = Math.max(0, (f.route.progress - head) * pathLen)
        routeHeadRef.current.style.strokeWidth = String(1.5 / sx)
        routeHeadRef.current.style.strokeDasharray = `${lit} ${pathLen}`
        routeHeadRef.current.style.strokeDashoffset = String(-head * pathLen)
      }

      const ox = (satellite.pacific.bounds.west - view.west) * view.ppd
      const oy = (view.north - satellite.pacific.bounds.north) * view.ppd
      if (glintRef.current) {
        const [gx, gy] = pointAt(path, f.route.progress)
        glintRef.current.style.transform = `translate3d(${(ox + gx * sx).toFixed(1)}px, ${(oy + gy * sx).toFixed(1)}px, 0)`
        glintRef.current.style.opacity = (
          f.route.opacity * (f.route.progress > 0.002 && f.route.progress < 0.999 ? 1 : 0)
        ).toFixed(3)
      }
      for (const [key, place] of [
        ['origin', journey.route.origin],
        ['destination', journey.route.destination],
      ] as const) {
        const el = labelRefs.current[key]
        if (!el) continue
        const [lx, ly] = point(view, place.lat, place.lon)
        el.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`
        el.style.opacity = f.route.opacity.toFixed(4)
      }

      if (layerRefs.current.veilTop) layerRefs.current.veilTop.style.opacity = f.veil.top.toFixed(4)
      if (layerRefs.current.veilBottom) {
        layerRefs.current.veilBottom.style.opacity = f.veil.bottom.toFixed(4)
      }

      for (const [key, value] of Object.entries(f.captions)) {
        const el = captionRefs.current[key]
        if (!el) continue
        el.style.opacity = value.opacity.toFixed(4)
        el.style.transform = `translate3d(0, ${value.shift.toFixed(2)}px, 0)`
      }

      /* Playing only while it is on screen. Everything else is paused, so at
         most one take is ever decoding. */
      for (const [key, layer] of [
        ['coastline', 'coastline'],
        ['farm', 'farm'],
        ['california', 'california'],
      ] as const) {
        const video = videoRefs.current[key]
        if (!video) continue
        const visible = f.layers[layer] > 0.01
        if (visible && video.paused && video.readyState >= 2) {
          void video.play().catch(() => {})
        } else if (!visible && !video.paused) {
          video.pause()
        }
      }
    },
    [narrow, path, pathLen],
  )

  /* ------------------------------------------------------------- the clock */
  useEffect(() => {
    if (mode !== 'stage') return
    /* The cover holds the first frame; the destination holds the last. */
    if (phase !== 'playing') {
      apply(frameAt(phase === 'cover' ? 0 : DURATION))
      return
    }
    if (paused) {
      for (const v of Object.values(videoRefs.current)) v?.pause()
      apply(frameAt(elapsed.current))
      return
    }

    last.current = performance.now()
    const step = (now: number) => {
      const dt = Math.min((now - last.current) / 1000, 0.1)
      last.current = now
      elapsed.current = Math.min(elapsed.current + dt, DURATION)
      apply(frameAt(elapsed.current))
      if (elapsed.current >= DURATION) {
        setPhase('destination')
        return
      }
      frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [mode, phase, paused, apply])

  /* Repaint on resize so the camera keeps its geography when the box changes. */
  useEffect(() => {
    if (mode !== 'stage') return
    const onResize = () => apply(frameAt(phase === 'cover' ? 0 : elapsed.current))
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [mode, phase, apply])

  /* A tab nobody is looking at does not run the sequence or decode video. */
  useEffect(() => {
    if (mode !== 'stage') return
    const onVisibility = () => {
      if (document.hidden) {
        if (!paused) {
          autoPaused.current = true
          setPaused(true)
        }
      } else if (autoPaused.current) {
        autoPaused.current = false
        setPaused(false)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [mode, paused])

  /* ------------------------------------------------------------- controls */
  const begin = useCallback(() => {
    elapsed.current = 0
    autoPaused.current = false
    setPaused(false)
    setPhase('playing')
  }, [])

  const skip = useCallback(() => {
    elapsed.current = DURATION
    setPaused(false)
    setPhase('destination')
  }, [])

  const reset = useCallback(() => {
    elapsed.current = 0
    autoPaused.current = false
    setPaused(false)
    setPhase('cover')
    for (const v of Object.values(videoRefs.current)) {
      if (!v) continue
      v.pause()
      if (v.currentTime && v.readyState >= 1) v.currentTime = 0
    }
    window.requestAnimationFrame(() => beginRef.current?.focus())
  }, [])

  /* Replay, from the footer. A plain link that also asks the journey to go
     back to its first frame — without storage, and without playing. */
  useEffect(() => {
    const onReplay = () => reset()
    window.addEventListener('kona:journey-reset', onReplay)
    return () => window.removeEventListener('kona:journey-reset', onReplay)
  }, [reset])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      /* Space toggles pause, but only while the sequence is running and only
         when the key is not doing something else — a button's own activation
         always wins. */
      if (
        event.key === ' ' &&
        phase === 'playing' &&
        !(event.target as HTMLElement).closest('button, a, [role="button"]')
      ) {
        event.preventDefault()
        setPaused((p) => !p)
      }
    },
    [phase],
  )

  /*
    Escape is listened for on the document rather than on the section, because
    by the time the sequence is running there is usually nothing inside the
    journey holding focus: `Begin the Journey` is the last thing the visitor
    touched, and it goes away when the sequence starts. A key that means "let
    me out" has to work from wherever focus happens to be.

    It is bound only while the sequence is actually playing, and it stands
    aside for the header — the ordering chooser closes on Escape too, and the
    visitor pressing it there means the menu, not the journey.
  */
  useEffect(() => {
    if (mode !== 'stage' || phase !== 'playing') return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      if (document.activeElement?.closest('header')) return
      event.preventDefault()
      window.location.hash = '#home-content'
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [mode, phase])

  const selected = destinations.find((d) => d.id === choice) ?? destinations[0]
  /* The Golden Gate and the two photographs are put into the document once
     the sequence is running — nine and ten seconds before they are needed. */
  const staged = phase !== 'cover'
  const showStage = mode === 'stage'
  const onCover = phase === 'cover'
  const showDestination = phase === 'destination'

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="jy"
      data-mode={mode}
      data-phase={phase}
      data-resolved={resolved ? '' : undefined}
      tabIndex={-1}
      aria-labelledby="journey-start"
      aria-describedby="journey-intro"
      onKeyDown={showStage ? onKeyDown : undefined}
    >
      <p id="journey-intro" className="sr-only">
        {journey.intro}
      </p>

      {/*
        Without JavaScript nothing decides between the two modes, so the linear
        story is handed back unconditionally. This is the only rule in the
        journey that depends on the absence of scripting, and it exists so the
        strict default — five pictures left unfetched — can be the one everyone
        else gets.
      */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<style>.jy:not([data-resolved]) .jy-linear{display:block}</style>`,
        }}
      />

      {/*
        The stage is rendered by the server as well as the client, so the Kona
        coastline is in the markup that paints first rather than something
        React adds a moment later. Everything inside it that needs a decision —
        which encode, whether the satellite is loaded — waits for one; the
        poster does not. A reduced-motion visitor's copy of it is removed once
        the client has decided, having cost them one image.
      */}
      <div ref={stageRef} className="jy-stage">
          <div className="jy-ground" aria-hidden="true" />

          {/* ------------------------------------------------- the pictures */}
          <div
            className="jy-layer"
            aria-hidden="true"
            data-layer="coastline"
            ref={(n) => {
              layerRefs.current.coastline = n
            }}
            style={{ zIndex: 1 }}
          >
            <Scene id="coastline" media={footage.coastline} variant={variant} register={registerVideo} eager />
          </div>

          <div
            className="jy-layer"
            aria-hidden="true"
            data-layer="farm"
            ref={(n) => {
              layerRefs.current.farm = n
            }}
            style={{ zIndex: 2 }}
          >
            {/* Prepared during idle time, not at first paint: the coastline is
                the only thing the opening screen needs to be on the wire. */}
            {variant ? (
              <Scene id="farm" media={footage.farm} variant={variant} register={registerVideo} />
            ) : null}
          </div>

          <div
            className="jy-layer jy-layer--sat"
            aria-hidden="true"
            data-layer="island"
            ref={(n) => {
              layerRefs.current.island = n
            }}
            style={{ zIndex: 4 }}
          >
            {ready ? (
              /* eslint-disable-next-line @next/next/no-img-element --
                 Deliberately not `next/image`. The camera positions this by
                 its exact encoded pixel width against a known geographic
                 extent; an optimiser that resizes it silently would move
                 Hawaiʻi out from under the route. */
              <img
                className="jy-sat"
                ref={(n) => {
                  layerRefs.current.islandImage = n
                }}
                src={narrow ? satellite.island.mid.src : satellite.island.wide.src}
                data-feather="true"
                alt=""
                width={narrow ? satellite.island.mid.width : satellite.island.wide.width}
                height={narrow ? satellite.island.mid.height : satellite.island.wide.height}
                decoding="async"
                style={
                  {
                    '--nat-w': `${narrow ? satellite.island.mid.width : satellite.island.wide.width}px`,
                    '--nat-h': `${narrow ? satellite.island.mid.height : satellite.island.wide.height}px`,
                  } as React.CSSProperties
                }
              />
            ) : null}
          </div>

          <div
            className="jy-layer jy-layer--sat"
            aria-hidden="true"
            data-layer="pacific"
            ref={(n) => {
              layerRefs.current.pacific = n
            }}
            style={{ zIndex: 3 }}
          >
            {ready ? (
              /* eslint-disable-next-line @next/next/no-img-element -- see above. */
              <img
                className="jy-sat"
                ref={(n) => {
                  layerRefs.current.pacificImage = n
                }}
                src={narrow ? satellite.pacific.mid.src : satellite.pacific.wide.src}
                alt=""
                width={narrow ? satellite.pacific.mid.width : satellite.pacific.wide.width}
                height={narrow ? satellite.pacific.mid.height : satellite.pacific.wide.height}
                decoding="async"
                style={
                  {
                    '--nat-w': `${narrow ? satellite.pacific.mid.width : satellite.pacific.wide.width}px`,
                    '--nat-h': `${narrow ? satellite.pacific.mid.height : satellite.pacific.wide.height}px`,
                  } as React.CSSProperties
                }
              />
            ) : null}
          </div>

          {/* ----------------------------------------------------- the route
              Our drawing over NASA's photograph: the real great circle
              between two verified airports, one hairline wide, with a single
              small glint travelling along it. No marker, no aircraft, no
              icon of any kind. */}
          <div className="jy-routes" aria-hidden="true" style={{ zIndex: 5 }}>
            <svg
              ref={routeRef}
              className="jy-route"
              width={satellite.pacific.wide.width}
              height={satellite.pacific.wide.height}
              viewBox={`0 0 ${satellite.pacific.wide.width} ${satellite.pacific.wide.height}`}
              fill="none"
            >
              <path ref={routeLineRef} className="jy-route__line" d={pathD} />
              <path ref={routeHeadRef} className="jy-route__head" d={pathD} />
            </svg>
            <div
              className="jy-glint"
              ref={glintRef}
            />
            <span
              className="jy-place jy-place--origin"
              ref={(n) => {
                labelRefs.current.origin = n
              }}
            >
              {journey.route.origin.label}
            </span>
            <span
              className="jy-place jy-place--destination"
              ref={(n) => {
                labelRefs.current.destination = n
              }}
            >
              {journey.route.destination.label}
            </span>
          </div>

          <div
            className="jy-layer"
            aria-hidden="true"
            data-layer="california"
            ref={(n) => {
              layerRefs.current.california = n
            }}
            style={{ zIndex: 6 }}
          >
            {staged ? (
              <Scene
                id="california"
                media={footage.california}
                variant={variant}
                register={registerVideo}
              />
            ) : null}
          </div>

          {/* ----------------------------------------------- the destination */}
          <div
            className="jy-layer jy-layer--dest"
            aria-hidden="true"
            data-layer="destination"
            ref={(n) => {
              layerRefs.current.destination = n
            }}
            style={{ zIndex: 7 }}
          >
            {(staged ? destinations : []).map((d) => {
              const photo = d.id === 'mountain-view' ? photos.cafe : photos.truck
              return (
                <picture key={d.id}>
                  <source media={NARROW} srcSet={photo.tall.src} />
                  <img
                    className={`jy-place-photo jy-place-photo--${d.id}`}
                    data-shown={choice === d.id ? 'true' : 'false'}
                    src={photo.wide.src}
                    alt=""
                    width={photo.wide.width}
                    height={photo.wide.height}
                    decoding="async"
                  />
                </picture>
              )
            })}
          </div>

          <div
            className="jy-veil jy-veil--bottom"
            aria-hidden="true"
            style={{ zIndex: 8 }}
            ref={(n) => {
              layerRefs.current.veilBottom = n
            }}
          />
          <div
            className="jy-veil jy-veil--top"
            aria-hidden="true"
            style={{ zIndex: 8 }}
            ref={(n) => {
              layerRefs.current.veilTop = n
            }}
          />

          {/* ---------------------------------------------------- the words */}
          <div className="jy-captions" aria-hidden={showDestination} style={{ zIndex: 9 }}>
            <p
              className="jy-caption jy-caption--title"
              data-anchor={CAPTION_ANCHORS.farm}
              ref={(n) => {
                captionRefs.current.farm = n
              }}
            >
              {captions.farm.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p
              className="jy-caption jy-caption--title"
              data-anchor={CAPTION_ANCHORS.pacific}
              ref={(n) => {
                captionRefs.current.pacific = n
              }}
            >
              <span>{captions.pacific.primary}</span>
              <span className="jy-caption__sub">{captions.pacific.secondary}</span>
            </p>
            <p
              className="jy-caption jy-caption--title"
              data-anchor={CAPTION_ANCHORS.california}
              ref={(n) => {
                captionRefs.current.california = n
              }}
            >
              <span>{captions.california}</span>
            </p>
          </div>

          {/* A live region so the sequence is followable without seeing it. */}
          <p className="sr-only" aria-live="polite">
            {phase === 'playing' ? journey.summary : ''}
          </p>

          {/* ------------------------------------------------- the controls */}
          {phase === 'playing' ? (
            <div className="jy-controls" style={{ zIndex: 11 }}>
              <button type="button" className="jy-control" onClick={() => setPaused((p) => !p)}>
                {paused ? controls.play : controls.pause}
              </button>
              <button type="button" className="jy-control" onClick={skip}>
                {controls.skip}
              </button>
              <a href="#home-content" className="jy-control">
                {journey.enterLabel}
              </a>
            </div>
          ) : null}

          {/* ----------------------------------------------- the destination */}
          {showDestination ? (
            <div className="jy-close" data-choice={choice} style={{ zIndex: 10 }}>
              <p className="jy-eyebrow">{close.eyebrow}</p>
              <div className="jy-choices" role="group" aria-label={close.eyebrow}>
                {destinations.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className="jy-choice"
                    aria-pressed={choice === d.id}
                    onMouseEnter={() => setChoice(d.id)}
                    onFocus={() => setChoice(d.id)}
                    onClick={() => setChoice(d.id)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="jy-place-line">{selected.place}</p>
              <div className="jy-actions">
                <a href={selected.directionsHref} className="jy-action">
                  {selected.directionsLabel}
                </a>
                <a
                  href={selected.orderHref}
                  className="jy-action jy-action--primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selected.orderLabel}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
              <p className="jy-close__lines">
                {close.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <a href="#home-content" className="jy-control jy-control--close">
                {journey.enterLabel}
              </a>
            </div>
          ) : null}
      </div>

      {/* -------------------------------------------------------- the cover */}
      <div className="jy-cover" data-hidden={showStage && !onCover ? 'true' : 'false'}>
        <p className="jy-eyebrow">{cover.eyebrow}</p>
        <h1 id="journey-start" className="jy-headline">
          {cover.headline}
        </h1>
        <div className="jy-actions">
          {showStage ? (
            <button
              ref={beginRef}
              type="button"
              className="jy-action jy-action--primary"
              onClick={begin}
              disabled={!ready}
              aria-describedby={preparing && !ready ? 'journey-preparing' : undefined}
            >
              {cover.beginLabel}
            </button>
          ) : (
            <a href="#journey-story" className="jy-action jy-action--primary">
              {journey.continueLabel}
            </a>
          )}
          <a href="#home-content" className="jy-action">
            {journey.enterLabel}
          </a>
        </div>
        {showStage && preparing && !ready ? (
          <p id="journey-preparing" className="jy-preparing" role="status">
            Preparing the journey…
          </p>
        ) : null}
      </div>

      {/* ------------------------------------------------------ linear story
          What the server sends, and what a reduced-motion visitor keeps. It
          carries the complete story and every verified action, so nothing
          meaningful depends on the animation running. */}
      <div className="jy-linear" id="journey-story">
        <Still
          wide={footage.farm.wide.poster}
          narrowSrc={footage.farm.tall.poster}
          width={footage.farm.wide.width}
          height={footage.farm.wide.height}
          description={footage.farm.description}
          lines={captions.farm}
        />
        <Still
          wide={satellite.pacific.wide.src}
          narrowSrc={satellite.pacific.mid.src}
          width={satellite.pacific.wide.width}
          height={satellite.pacific.wide.height}
          description={satellite.pacific.description}
          lines={[captions.pacific.primary]}
          sub={captions.pacific.secondary}
        />
        <Still
          wide={footage.california.wide.poster}
          narrowSrc={footage.california.tall.poster}
          width={footage.california.wide.width}
          height={footage.california.wide.height}
          description={footage.california.description}
          lines={[captions.california]}
        />

        <div className="jy-linear__close">
          <p className="jy-eyebrow">{close.eyebrow}</p>
          {destinations.map((d) => {
            const photo = d.id === 'mountain-view' ? photos.cafe : photos.truck
            return (
              <div key={d.id} className="jy-linear__place">
                <picture>
                  <source media={NARROW} srcSet={photo.tall.src} />
                  <img
                    src={photo.wide.src}
                    alt=""
                    width={photo.wide.width}
                    height={photo.wide.height}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div>
                  <h2 className="jy-linear__name">{d.label}</h2>
                  <p className="jy-place-line">{d.place}</p>
                  <p className="sr-only">{photo.description}</p>
                  <div className="jy-actions">
                    <a href={d.directionsHref} className="jy-action">
                      {d.directionsLabel}
                    </a>
                    <a
                      href={d.orderHref}
                      className="jy-action jy-action--primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {d.orderLabel}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
          <p className="jy-close__lines">
            {close.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <a href="#home-content" className="jy-action">
            {journey.enterLabel}
          </a>
        </div>
      </div>

      <p className="sr-only">{journey.summary}</p>
    </section>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * One take, painted as a poster with its video over it.
 *
 * The poster is its own element rather than the video's `poster` attribute: a
 * video at zero opacity hides its own poster, so the attribute cannot hold a
 * frame for a scene that is loading or whose codec the browser does not have.
 * Painted separately, there is always a picture and never a blank frame.
 */
function Scene({
  id,
  media,
  variant,
  register,
  eager = false,
}: {
  id: string
  media: (typeof footage)['farm']
  variant: 'wide' | 'tall' | null
  register: (id: string, node: HTMLVideoElement | null) => void
  eager?: boolean
}) {
  return (
    <>
      <picture>
        <source media={NARROW} srcSet={media.tall.poster} />
        <img
          className="jy-frame"
          src={media.wide.poster}
          alt=""
          width={media.wide.width}
          height={media.wide.height}
          decoding="async"
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
        />
      </picture>
      {variant ? (
        <video
          key={variant}
          ref={(n) => register(id, n)}
          className="jy-frame jy-video"
          {...(eager ? { src: media[variant].src } : {})}
          width={media[variant].width}
          height={media[variant].height}
          muted
          loop={id === 'coastline'}
          playsInline
          preload={eager ? 'auto' : 'none'}
          tabIndex={-1}
          onLoadedData={(e) => {
            e.currentTarget.dataset.ready = 'true'
          }}
        />
      ) : null}
    </>
  )
}

/** One block of the linear story: a still, and the words that go with it. */
function Still({
  wide,
  narrowSrc,
  width,
  height,
  description,
  lines,
  sub,
}: {
  wide: string
  narrowSrc: string
  width: number
  height: number
  description: string
  lines: string[]
  sub?: string
}) {
  return (
    <div className="jy-linear__panel">
      <picture>
        <source media={NARROW} srcSet={narrowSrc} />
        <img src={wide} alt="" width={width} height={height} loading="lazy" decoding="async" />
      </picture>
      <div>
        <p className="jy-caption jy-caption--static">
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
          {sub ? <span className="jy-caption__sub">{sub}</span> : null}
        </p>
        <p className="sr-only">{description}</p>
      </div>
    </div>
  )
}
