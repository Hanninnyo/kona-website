'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { journey } from '@/content/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { JourneyScene, JourneyRouteLine, type Gate } from '@/components/journey/journey-scene'
import {
  JOURNEY_REPLAY_EVENT,
  markJourneySeen,
  hasSeenJourney,
} from '@/lib/journey/session'

/**
 * The Kona Arrival Journey — an opening chapter over the homepage.
 *
 * It is a layer, not a route and not a splash page. The homepage renders
 * underneath the whole time, so the markup search engines see is the real
 * homepage, dismissal reveals it instantly with nothing to load, and a visitor
 * who never runs JavaScript never sees the layer at all: it renders nothing on
 * the server and mounts only after hydration.
 *
 * Hydration safety comes from that ordering. The first client render matches
 * the server exactly — closed, nothing painted — and only an effect, which
 * runs after hydration, reads sessionStorage and decides to open. Nothing
 * touches storage during render, and no state is set during render.
 *
 * Timing is a chain of `setTimeout`s, one per moment, cleared on unmount and
 * on close. There is no per-frame JavaScript and no loop left running once the
 * layer is dismissed.
 */

const { moments, scenes } = journey
const LAST = moments.length - 1

/**
 * The stage indicator, which counts moments rather than beats.
 *
 * The origin is one moment told in two beats: the copy moves from where the
 * coffee grows to what happens to it there while the same take runs on. The
 * indicator collapses consecutive beats that share a stage, so it shows four
 * stops and not five, and selecting one returns to the beat that opens it.
 */
const STEPS = moments.reduce<{ stage: string; index: number }[]>((steps, moment, index) => {
  if (steps[steps.length - 1]?.stage !== moment.stage) {
    steps.push({ stage: moment.stage, index })
  }
  return steps
}, [])

/**
 * The same four stops, laid out for a visitor who has asked not to be moved.
 * The terminal beat is dropped: it is the destination, and it is already the
 * heading of the still composition.
 */
const STATIC_STAGES = STEPS.filter((step) => step.index < LAST).map((step, position, all) => ({
  stage: step.stage,
  beats: moments.slice(step.index, all[position + 1]?.index ?? LAST),
}))

/**
 * The footage a beat is shown over, which is not always the footage it names:
 * the handover has no take of its own and holds the one before it, so the
 * warm ground rises through the Bay Area rather than through an empty frame.
 */
function sceneAt(index: number) {
  for (let i = index; i >= 0; i -= 1) {
    const { scene } = moments[i]
    if (scene) return scene
  }
  return null
}

/** The still shown to reduced-motion visitors, who download no video at all. */
const STILL = scenes[0]

type OpenedBy = 'auto' | 'replay'
type Variant = 'wide' | 'tall'

/** Below this the portrait encodes are used; at or above it, the wide ones. */
const WIDE_QUERY = '(min-width: 640px)'

/**
 * How long a scene may spend becoming ready before the journey stops waiting.
 *
 * This is the whole fix for the bug where a phone showed two seconds of a
 * four-second scene. A beat's clock used to start the instant the beat began,
 * so every second the take spent downloading was a second subtracted from the
 * take. Now the clock starts when the scene is visually ready and this bound
 * decides how long "becoming ready" is allowed to take. Past it the scene
 * commits to its poster and plays out its full readable duration there, so a
 * slow connection costs the visitor a short wait and never a truncated scene.
 *
 * It is deliberately short. The point is not to wait for slow video, it is to
 * stop charging load time to the scene.
 */
const READY_BOUND_MS = 2500

export function ArrivalJourney() {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  const [isOpen, setIsOpen] = useState(false)
  const [moment, setMoment] = useState(0)
  const [openedBy, setOpenedBy] = useState<OpenedBy>('auto')
  /** True once the layer has painted, so the entrance can fade rather than cut. */
  const [entered, setEntered] = useState(false)
  /**
   * Null until measured. The layer renders nothing on the server and nothing
   * before it opens, and this is settled in an effect during that same commit,
   * so no video ever gets a `src` chosen from a guess.
   */
  const [variant, setVariant] = useState<Variant | null>(null)
  /**
   * Which scene has settled, and how.
   *
   * Keyed by scene rather than held as a bare status, so moving to the next
   * scene makes the gate `waiting` again on its own. Nothing has to remember
   * to reset it, and a `playing` event that arrives from the take we just
   * left cannot reopen a gate that has moved on.
   */
  const [ready, setReady] = useState<{ id: string; mode: 'video' | 'poster' } | null>(null)

  const labelId = useId()
  const layerRef = useRef<HTMLDivElement | null>(null)
  const skipRef = useRef<HTMLButtonElement | null>(null)
  const returnFocusTo = useRef<HTMLElement | null>(null)
  const sceneKeyRef = useRef<string | null>(null)

  /**
   * Reduced motion gets the whole story at once: every stage laid out as text
   * over a single still frame. Nothing autoplays, nothing moves, and no video
   * is requested at all — only the one poster image the still is made from.
   */
  const isStatic = prefersReducedMotion

  const open = useCallback((by: OpenedBy) => {
    returnFocusTo.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    markJourneySeen()
    setOpenedBy(by)
    setMoment(0)
    setReady(null)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEntered(false)
  }, [])

  /* --- Which encode ------------------------------------------------------
     A landscape band cannot fill a portrait phone: covering 390x844 with a
     2.09:1 frame would mean scaling it four and a half times. So the two
     orientations get separately framed encodes, and the choice is made here
     rather than by `<source media>`, which no browser implements. */
  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY)
    const apply = () => setVariant(query.matches ? 'wide' : 'tall')
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  /* --- Arrival ------------------------------------------------------------
     Only on the homepage, and only once per browser session.

     Opening is deferred by a frame rather than set synchronously here. That
     keeps the effect from cascading a second render before paint, and it
     gives the layer a real frame to fade in over the homepage instead of
     replacing it in a cut. */
  useEffect(() => {
    if (pathname !== '/') return
    if (hasSeenJourney()) return
    const raf = requestAnimationFrame(() => open('auto'))
    return () => cancelAnimationFrame(raf)
    // `open` is stable and pathname is the real trigger; re-running on later
    // navigations is prevented by the session flag set inside `open`.
  }, [pathname, open])

  /* --- Replay ------------------------------------------------------------- */
  useEffect(() => {
    const onReplay = () => open('replay')
    window.addEventListener(JOURNEY_REPLAY_EVENT, onReplay)
    return () => window.removeEventListener(JOURNEY_REPLAY_EVENT, onReplay)
  }, [open])

  /* --- Entrance ----------------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return
    // Two frames: one to mount at zero opacity, one to transition from it.
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [isOpen])

  /* --- The readiness gate -------------------------------------------------
     One gate per scene, not per beat: consecutive beats over the same take
     share it, so the take is not re-gated when only the copy changes.

     It opens on the first `playing` event, or on the bound expiring, and once
     it has settled on the poster it stays there for the rest of the scene.
     That last part matters as much as the wait: without it a take that
     finished loading late would flash in for a moment and then be cut, which
     reads worse than never showing it at all. */
  const sceneKey = isStatic ? null : sceneAt(moment)

  /* The handover has no take of its own — it holds the one before it, which
     is already on screen — so it is never gated. */
  const gate: Gate =
    sceneKey === null ? 'video' : ready?.id === sceneKey ? ready.mode : 'waiting'

  useEffect(() => {
    if (!isOpen || isStatic || sceneKey === null) return
    const bound = setTimeout(
      () => setReady((current) => (current?.id === sceneKey ? current : { id: sceneKey, mode: 'poster' })),
      READY_BOUND_MS
    )
    return () => clearTimeout(bound)
  }, [isOpen, isStatic, sceneKey])

  /* Mirrored into a ref so the two callbacks below can stay identity-stable.
     They are passed to every video element, and re-creating them each beat
     would re-run the effect that starts playback. Written in an effect rather
     than during render; both callbacks fire from media events, which is long
     after the commit that set it. */
  useEffect(() => {
    sceneKeyRef.current = sceneKey
  }, [sceneKey])

  /* Both settle the gate only if it has not settled already, so a take that
     finishes loading after the bound expired cannot displace the poster the
     scene has already committed to. */
  const handlePlaying = useCallback((id: string) => {
    if (id !== sceneKeyRef.current) return
    setReady((current) => (current?.id === id ? current : { id, mode: 'video' }))
  }, [])

  const handleFailed = useCallback((id: string) => {
    if (id !== sceneKeyRef.current) return
    setReady((current) => (current?.id === id ? current : { id, mode: 'poster' }))
  }, [])

  /* --- The chain ----------------------------------------------------------
     One timer per beat, started only once the scene it belongs to is ready.
     Nothing runs for the terminal beat, for a static visitor, or once the
     layer is closed. */
  useEffect(() => {
    if (!isOpen || isStatic) return
    if (gate === 'waiting') return
    const hold = moments[moment].holdMs
    if (hold === null) return
    const timer = setTimeout(() => setMoment((current) => Math.min(current + 1, LAST)), hold)
    return () => clearTimeout(timer)
  }, [isOpen, isStatic, moment, gate])

  /* --- Modal behaviour ----------------------------------------------------
     Scroll lock, a real `inert` on the page behind, Escape, and a Tab trap. */
  useEffect(() => {
    if (!isOpen) return

    const shell = document.getElementById('site-shell')
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    // Genuinely inert, not merely described as such: the page behind cannot be
    // focused, clicked, or reached by a virtual cursor.
    shell?.setAttribute('inert', '')

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab') return

      const layer = layerRef.current
      if (!layer) return
      const focusable = layer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      shell?.removeAttribute('inert')
    }
  }, [isOpen, close])

  /* --- Focus in, focus out ------------------------------------------------ */
  useEffect(() => {
    if (!isOpen) return
    // Skip is reachable from the first frame, so that is where focus starts.
    skipRef.current?.focus()
  }, [isOpen])

  const wasOpen = useRef(false)
  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true
      return
    }
    if (!wasOpen.current) return
    wasOpen.current = false

    if (openedBy === 'replay' && returnFocusTo.current?.isConnected) {
      returnFocusTo.current.focus()
      return
    }
    // Arriving for the first time: the homepage should begin at the top.
    window.scrollTo(0, 0)
    document.getElementById('content')?.focus()
  }, [isOpen, openedBy])

  if (!isOpen) return null

  const current = moments[moment]
  const isFinal = moment === LAST
  const showEnter = isStatic || isFinal
  const activeScene = sceneKey
  const scene = scenes.find((item) => item.id === (activeScene ?? STILL.id))
  const still = STILL[variant ?? 'wide']
  const layout = scene?.layout ?? 'band'

  return (
    <div
      ref={layerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      data-moment={isStatic ? 'static' : moment}
      data-layout={layout}
      data-gate={gate}
      data-entered={entered ? 'true' : 'false'}
      className="journey-layer"
    >
      <p id={labelId} className="sr-only">
        {journey.label}
      </p>

      {/* The whole story, independent of the sequence and of the footage. */}
      <p className="sr-only">{journey.summary}</p>

      {/* What is on screen right now, for anyone who cannot see it. Not a live
          region: it is there to be found, not to interrupt. */}
      {scene && <p className="sr-only">{scene.description}</p>}

      <div className="journey-stage">
        {isStatic ? (
          /* One frame, no video element: a visitor who has asked not to be
             moved downloads a single image and no footage at all. */
          <Image
            className="journey-still"
            src={still.poster}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
          />
        ) : (
          variant && (
            <JourneyScene
              activeId={activeScene}
              momentIndex={moment}
              variant={variant}
              gate={gate}
              onPlaying={handlePlaying}
              onFailed={handleFailed}
            />
          )
        )}

        {/* Anchored to the viewport, not to the copy: see `.journey-scrim`. */}
        <div aria-hidden="true" className="journey-scrim" />

        {/* The route belongs to the beat that names the crossing, not to a
            later one that merely still holds the footage. */}
        {current.scene === 'crossing' && <JourneyRouteLine />}

        {/*
          The handover. On the last moment the warm ground of the homepage
          rises through the footage, so the visitor crosses into the room they
          are about to be standing in rather than having one screen swapped
          for another.
        */}
        <div aria-hidden="true" className="journey-dawn" />
      </div>

      <div className="journey-content">
        <div className="journey-copy">
          {isStatic ? (
            <StaticSummary />
          ) : (
            <>
              <p key={`e${moment}`} className="journey-eyebrow">
                {current.eyebrow}
              </p>
              <h2 key={`p${moment}`} className="journey-primary">
                {current.primary}
              </h2>
              {current.supporting && (
                <p key={`s${moment}`} className="journey-supporting">
                  {current.supporting}
                </p>
              )}
            </>
          )}
        </div>

        <div className="journey-controls">
          {showEnter && (
            <button type="button" onClick={close} className="journey-enter">
              {journey.enterLabel}
            </button>
          )}
          <button ref={skipRef} type="button" onClick={close} className="journey-skip">
            {journey.skipLabel}
          </button>
        </div>

        {!isStatic && (
          <ol className="journey-steps" aria-label="Journey stages">
            {STEPS.map((step, position) => {
              const next = STEPS[position + 1]
              const isCurrent = moment >= step.index && (!next || moment < next.index)
              return (
                <li key={step.stage}>
                  <button
                    type="button"
                    onClick={() => setMoment(step.index)}
                    aria-current={isCurrent ? 'step' : undefined}
                    className="journey-step"
                    data-state={
                      isCurrent ? 'current' : moment > step.index ? 'done' : 'upcoming'
                    }
                  >
                    <span className="journey-step__mark" aria-hidden="true" />
                    <span className="journey-step__label">{step.stage}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </div>
  )
}

/** Every stage at once, for a visitor who has asked not to be moved. */
function StaticSummary() {
  return (
    <>
      {/* The heading is the terminal beat's, so the eyebrow is too — taking
          the first beat's would label the destination "Origin", and repeat a
          word the stage list below is about to use. */}
      <p className="journey-eyebrow">{moments[LAST].eyebrow}</p>
      <h2 className="journey-primary">{moments[LAST].primary}</h2>
      <ol className="journey-static-stages">
        {STATIC_STAGES.map((step) => (
          <li key={step.stage}>
            <span className="journey-static-stages__stage">{step.stage}</span>
            <span className="journey-static-stages__lines">
              {step.beats.map((beat) => (
                <span key={beat.id} className="journey-static-stages__line">
                  {beat.supporting ? `${beat.primary} — ${beat.supporting}` : beat.primary}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>
    </>
  )
}
