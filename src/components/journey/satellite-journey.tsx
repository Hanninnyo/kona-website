'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { journey } from '@/content/journey'
import {
  CAPTION_ANCHORS,
  DURATION,
  frameAt,
  placement,
  point,
  pointAt,
  routeLength,
  routePath,
  routePoints,
  viewFor,
  type Frame,
} from '@/lib/journey/timeline'

/* ==========================================================================
   The Kona journey

   A seventeen-second sequence that starts on its own, driven by one
   requestAnimationFrame loop and one pure function of elapsed time. React
   state changes a handful of times in the whole experience — never per frame.
   Everything that moves is written straight to a ref's `style` as a transform
   or an opacity.

   Two modes, and the linear one is what the server sends:

   `linear` — three stills, their words, and the destination choice, in
              document order. This is the whole experience for a visitor with
              `prefers-reduced-motion: reduce` or no JavaScript, and it is
              complete: every claim, both destinations, every verified link.

   `stage`  — the animation, mounted on the client only.
   ========================================================================== */

const { lead, captions, footage, satellite, photos, destinations, close, controls } = journey

/** Below this width the portrait encodes and the lighter satellite file. */
const NARROW = '(max-width: 699px)'

/**
 * Which encode of the wide map to use.
 *
 * Only the Pacific map has a lighter one. The close view of Hawaiʻi is 77 kB
 * at full size and is the one image in the sequence a phone sees at close to
 * its own pixel scale, so it is served whole to everybody: halving it would
 * save forty kilobytes and cost the only sharp thing on screen.
 */
const pacificFrame = (narrow: boolean) =>
  (narrow ? satellite.pacific.mid : null) ?? satellite.pacific.wide

/**
 * What has to be in hand before the clock may pass each moment.
 *
 * This is what lets the sequence start immediately without ever stalling
 * halfway through. The coastline is in the markup the server sends, so the
 * first frame is a picture rather than a spinner and the timeline can begin
 * at once; everything after it is fetched behind that picture. If something
 * is not ready when its moment arrives the clock holds at the gate — the
 * coastline stays on screen and keeps playing — and resumes the instant the
 * asset lands. In practice, on any ordinary connection, nothing here ever
 * holds; what it guarantees is that a slow one degrades into a longer
 * coastline rather than into a blank screen or a jump.
 */
const GATES: { t: number; need: string[] }[] = [
  { t: 2.2, need: ['farm'] },
  { t: 5.2, need: ['island', 'pacific'] },
  { t: 15.2, need: ['photos'] },
]

type Mode = 'linear' | 'stage'
type Phase = 'playing' | 'destination'
type Choice = (typeof destinations)[number]['id']

export function SatelliteJourney() {
  const [mode, setMode] = useState<Mode>('linear')
  const [variant, setVariant] = useState<'wide' | 'tall' | null>(null)
  const [narrow, setNarrow] = useState(false)
  const [phase, setPhase] = useState<Phase>('playing')
  const [paused, setPaused] = useState(false)
  const [choice, setChoice] = useState<Choice>('mountain-view')
  /**
   * Bumped by Replay. The clock effect keys off it, so asking for the journey
   * again restarts it — and restarts it *playing* — without any stored flag
   * and without a second code path for "starting again".
   */
  const [run, setRun] = useState(0)
  /** The two destination photographs, put into the document mid-flight. */
  const [staged, setStaged] = useState(false)
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

  /**
   * What has loaded.
   *
   * A ref rather than state because the only reader is the animation loop,
   * which is already running: a picture arriving must let the clock through
   * the next gate, not re-render the component.
   */
  const loaded = useRef<Set<string>>(new Set())
  const markLoaded = useCallback((what: string) => {
    loaded.current.add(what)
  }, [])

  /** Seconds of the sequence played so far. The only clock. */
  const elapsed = useRef(0)
  const frame = useRef(0)
  const last = useRef(0)
  /** Set while the tab is hidden, so resuming does not override a real pause. */
  const autoPaused = useRef(false)

  const path = useMemo(() => routePoints(), [])
  const pathD = useMemo(() => routePath(path), [path])
  const pathLen = useMemo(() => routeLength(path), [path])

  /* Rotating a phone crosses the breakpoint and changes every encode, so what
     was in hand a moment ago is not what the sequence now needs. Emptied here
     rather than during render, and before the effect below refills it. */
  useEffect(() => {
    loaded.current = new Set()
  }, [variant, narrow])

  /* ------------------------------------------------------------------ mode */
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const small = window.matchMedia(NARROW)

    const decide = () => {
      setNarrow(small.matches)
      // A visitor who has asked for less motion keeps the linear story: no
      // timeline, no camera, no video, no animation loop at all — and no
      // autoplay, which is the whole point of the preference.
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
    Started as soon as the client knows which encodes apply, and never in the
    way: the coastline is already on screen and already playing, so the rest
    arrives behind a moving picture rather than in front of a message about
    loading. The satellite images announce themselves through their own `img`
    elements, which are in the document at zero opacity from the first client
    render; only the farm take needs asking.
  */
  useEffect(() => {
    if (mode !== 'stage' || !variant) return
    const farm = videoRefs.current.farm
    if (!farm) {
      markLoaded('farm')
      return
    }
    const src = footage.farm[variant].src
    if (farm.getAttribute('src') !== src) {
      farm.src = src
      farm.load()
    }
    if (farm.readyState >= 2) {
      markLoaded('farm')
      return
    }
    const done = () => markLoaded('farm')
    farm.addEventListener('loadeddata', done, { once: true })
    farm.addEventListener('error', done, { once: true })
    return () => {
      farm.removeEventListener('loadeddata', done)
      farm.removeEventListener('error', done)
    }
  }, [mode, variant, markLoaded])

  /* The photographs are put into the document once the crossing is under way,
     seven seconds before the café is needed. */
  useEffect(() => {
    if (!staged || !variant) return
    let left = 2
    for (const photo of [photos.cafe, photos.truck]) {
      const img = new Image()
      img.onload = img.onerror = () => {
        left -= 1
        if (left === 0) markLoaded('photos')
      }
      img.src = narrow ? photo.tall.src : photo.wide.src
    }
  }, [staged, variant, narrow, markLoaded])

  /* -------------------------------------------------------------- painting */
  const apply = useCallback(
    (f: Frame, t: number) => {
      const stage = stageRef.current
      if (!stage) return
      const w = stage.clientWidth
      const h = stage.clientHeight
      if (!w || !h) return

      for (const [key, value] of Object.entries(f.layers)) {
        const el = layerRefs.current[key]
        if (el) el.style.opacity = value.toFixed(4)
      }

      /* One call, and it is the same one the coverage check runs: the camera
         for this moment, narrowed and slid until the wide map is guaranteed
         to cover the whole stage at this exact aspect ratio. Nothing
         downstream can reintroduce an uncovered edge, because everything
         downstream is placed relative to this view. */
      const view = viewFor(t, w, h, narrow)

      const island = layerRefs.current.islandImage
      if (island) {
        island.style.transform = placement(view, satellite.island.bounds, satellite.island.wide.width)
      }
      const pacific = layerRefs.current.pacificImage
      if (pacific) {
        pacific.style.transform = placement(
          view,
          satellite.pacific.bounds,
          pacificFrame(narrow).width,
        )
      }

      /* The overlay shares the wide image's geography, so it is placed by the
         same call — which is what guarantees the line sits on the coastline
         rather than near it. */
      const svg = routeRef.current
      if (svg) {
        svg.style.transform = placement(view, satellite.pacific.bounds, satellite.pacific.wide.width)
        svg.style.opacity = f.route.opacity.toFixed(4)
      }
      const sx =
        (view.ppd * (satellite.pacific.bounds.east - satellite.pacific.bounds.west)) /
        satellite.pacific.wide.width

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
      for (const key of ['coastline', 'farm'] as const) {
        const video = videoRefs.current[key]
        if (!video) continue
        const visible = f.layers[key] > 0.01
        if (visible && video.paused && video.readyState >= 2) {
          void video.play().catch(() => {})
        } else if (!visible && !video.paused) {
          video.pause()
        }
      }
    },
    [narrow, path, pathLen],
  )

  /* ------------------------------------------------------------- the clock
     Started by mounting, not by a button. There is no first screen to get
     past: the coastline is already on the page when this runs, and this is
     what sets it moving. */
  useEffect(() => {
    if (mode !== 'stage') return
    /* The destination holds the last frame. */
    if (phase === 'destination') {
      apply(frameAt(DURATION), DURATION)
      return
    }
    if (paused) {
      for (const v of Object.values(videoRefs.current)) v?.pause()
      apply(frameAt(elapsed.current), elapsed.current)
      return
    }

    last.current = performance.now()
    const step = (now: number) => {
      const dt = Math.min((now - last.current) / 1000, 0.1)
      last.current = now

      let next = Math.min(elapsed.current + dt, DURATION)
      /* Hold at the first gate whose assets have not arrived. The gates are
         in order, so the earliest unmet one wins. */
      for (const gate of GATES) {
        if (next > gate.t && !gate.need.every((k) => loaded.current.has(k))) {
          next = Math.min(next, gate.t)
          break
        }
      }
      elapsed.current = next

      if (next >= 8 && !staged) setStaged(true)
      apply(frameAt(next), next)
      if (next >= DURATION) {
        setPhase('destination')
        return
      }
      frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame.current)
  }, [mode, phase, paused, staged, run, apply])

  /* Repaint on resize so the camera keeps its geography when the box changes. */
  useEffect(() => {
    if (mode !== 'stage') return
    const onResize = () => apply(frameAt(elapsed.current), elapsed.current)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [mode, apply])

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
  const skip = useCallback(() => {
    elapsed.current = DURATION
    setPaused(false)
    setStaged(true)
    setPhase('destination')
  }, [])

  /**
   * Replay, from the footer. A plain link that also asks the journey to start
   * again — from the first frame, playing, with no stored flag anywhere and
   * no second path through the code.
   */
  const restart = useCallback(() => {
    elapsed.current = 0
    autoPaused.current = false
    for (const v of Object.values(videoRefs.current)) {
      if (!v) continue
      v.pause()
      if (v.currentTime && v.readyState >= 1) v.currentTime = 0
    }
    setPaused(false)
    setPhase('playing')
    setRun((n) => n + 1)
  }, [])

  useEffect(() => {
    window.addEventListener('kona:journey-reset', restart)
    return () => window.removeEventListener('kona:journey-reset', restart)
  }, [restart])

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
    nothing inside the journey holds focus while it plays: it starts on its
    own, so the visitor has touched nothing. A key that means "let me out" has
    to work from wherever focus happens to be.

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
      window.location.href = '/'
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [mode, phase])

  const selected = destinations.find((d) => d.id === choice) ?? destinations[0]
  const showStage = mode === 'stage'
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
      aria-label={lead.eyebrow}
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
          __html: `<style>.jy:not([data-resolved]) .jy-linear,.jy:not([data-resolved]) .jy-lead{display:block}.jy:not([data-resolved]) .jy-stage{display:none}</style>`,
        }}
      />

      {/*
        The stage is rendered by the server as well as the client, so the Kona
        coastline is in the markup that paints first rather than something
        React adds a moment later — which is what lets the sequence start on
        a picture instead of on a wait. Everything inside it that needs a
        decision waits for one; the poster does not.
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
            {variant ? (
              <Scene id="farm" media={footage.farm} variant={variant} register={registerVideo} />
            ) : null}
          </div>

          {/* --------------------------------------------- the destination
              Below the map, not above it. It comes up to full opacity while
              the settled map still covers the stage, and the map then
              dissolves away to reveal it — so the last transition of the
              sequence is the same kind as every other one, and the café
              arrives rather than cuts. */}
          <div
            className="jy-layer jy-layer--dest"
            aria-hidden="true"
            data-layer="destination"
            ref={(n) => {
              layerRefs.current.destination = n
            }}
            style={{ zIndex: 3 }}
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
            className="jy-layer jy-layer--sat"
            aria-hidden="true"
            data-layer="pacific"
            ref={(n) => {
              layerRefs.current.pacific = n
            }}
            style={{ zIndex: 4 }}
          >
            {variant ? (
              /* eslint-disable-next-line @next/next/no-img-element --
                 Deliberately not `next/image`. The camera positions this by
                 its exact encoded pixel width against a known geographic
                 extent; an optimiser that resizes it silently would move the
                 map out from under the route. */
              <img
                className="jy-sat"
                ref={(n) => {
                  layerRefs.current.pacificImage = n
                }}
                src={pacificFrame(narrow).src}
                alt=""
                width={pacificFrame(narrow).width}
                height={pacificFrame(narrow).height}
                decoding="async"
                fetchPriority="high"
                onLoad={() => markLoaded('pacific')}
                onError={() => markLoaded('pacific')}
                style={
                  {
                    '--nat-w': `${pacificFrame(narrow).width}px`,
                    '--nat-h': `${pacificFrame(narrow).height}px`,
                  } as React.CSSProperties
                }
              />
            ) : null}
          </div>

          <div
            className="jy-layer jy-layer--sat"
            aria-hidden="true"
            data-layer="island"
            ref={(n) => {
              layerRefs.current.island = n
            }}
            style={{ zIndex: 5 }}
          >
            {variant ? (
              /* eslint-disable-next-line @next/next/no-img-element -- see above. */
              <img
                className="jy-sat"
                ref={(n) => {
                  layerRefs.current.islandImage = n
                }}
                src={satellite.island.wide.src}
                data-feather="true"
                alt=""
                width={satellite.island.wide.width}
                height={satellite.island.wide.height}
                decoding="async"
                onLoad={() => markLoaded('island')}
                onError={() => markLoaded('island')}
                style={
                  {
                    '--nat-w': `${satellite.island.wide.width}px`,
                    '--nat-h': `${satellite.island.wide.height}px`,
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
          <div className="jy-routes" aria-hidden="true" style={{ zIndex: 6 }}>
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
              data-anchor={CAPTION_ANCHORS.kona}
              ref={(n) => {
                captionRefs.current.kona = n
              }}
            >
              {captions.kona.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
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
          </div>

          {/* A live region so the sequence is followable without seeing it. */}
          <p className="sr-only" aria-live="polite">
            {phase === 'playing' ? journey.summary : ''}
          </p>

          {/* ------------------------------------------------- the controls
              On screen from the first frame, because the journey is now the
              first thing that happens: whoever did not ask for it must be
              able to stop it or leave immediately, and small understated
              controls in the corner are how. */}
          {showStage && !showDestination ? (
            <div className="jy-controls" style={{ zIndex: 11 }}>
              <button type="button" className="jy-control" onClick={() => setPaused((p) => !p)}>
                {paused ? controls.play : controls.pause}
              </button>
              <button type="button" className="jy-control" onClick={skip}>
                {controls.skip}
              </button>
              <Link href="/" className="jy-control">
                {journey.enterLabel}
              </Link>
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
              <Link href="/" className="jy-control jy-control--close">
                {journey.enterLabel}
              </Link>
            </div>
          ) : null}
      </div>

      {/* --------------------------------------------------------- the lead
          The heading over the linear story, and the only place the journey
          asks anything of anyone. It exists for the two visitors who never
          see the animation — reduced motion, and no JavaScript — so it is
          hidden for everybody else rather than fading out over the stage. */}
      <div className="jy-lead">
        <p className="jy-eyebrow">{lead.eyebrow}</p>
        <h2 className="jy-headline">{lead.headline}</h2>
        <div className="jy-actions">
          <a href="#journey-story" className="jy-action jy-action--primary">
            {journey.continueLabel}
          </a>
          <Link href="/" className="jy-action">
            {journey.enterLabel}
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------ linear story
          What the server sends, and what a reduced-motion visitor keeps. It
          carries the complete story and every verified action, so nothing
          meaningful depends on the animation running. */}
      <div className="jy-linear" id="journey-story">
        <Still
          wide={footage.coastline.wide.poster}
          narrowSrc={footage.coastline.tall.poster}
          width={footage.coastline.wide.width}
          height={footage.coastline.wide.height}
          description={footage.coastline.description}
          lines={captions.kona}
        />
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
          narrowSrc={pacificFrame(true).src}
          width={satellite.pacific.wide.width}
          height={satellite.pacific.wide.height}
          description={satellite.pacific.description}
          lines={[captions.pacific.primary]}
          sub={captions.pacific.secondary}
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
          <Link href="/" className="jy-action">
            {journey.enterLabel}
          </Link>
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
