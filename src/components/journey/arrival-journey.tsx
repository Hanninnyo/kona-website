'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { journey } from '@/content/journey'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import {
  JourneyMap,
  ROUTE_CAFE,
  ROUTE_PACIFIC,
  ROUTE_TRUCK,
} from '@/components/journey/journey-map'
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

const { moments } = journey
const LAST = moments.length - 1

type OpenedBy = 'auto' | 'replay'

export function ArrivalJourney() {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  const [isOpen, setIsOpen] = useState(false)
  const [moment, setMoment] = useState(0)
  const [openedBy, setOpenedBy] = useState<OpenedBy>('auto')
  /** True once the layer has painted, so the entrance can fade rather than cut. */
  const [entered, setEntered] = useState(false)

  const labelId = useId()
  const layerRef = useRef<HTMLDivElement | null>(null)
  const skipRef = useRef<HTMLButtonElement | null>(null)
  const returnFocusTo = useRef<HTMLElement | null>(null)

  /**
   * Reduced motion gets the whole story at once: every stage laid out as text
   * beside a still map with the route already drawn. Nothing autoplays and
   * nothing moves.
   */
  const isStatic = prefersReducedMotion

  const open = useCallback((by: OpenedBy) => {
    returnFocusTo.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    markJourneySeen()
    setOpenedBy(by)
    setMoment(0)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setEntered(false)
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

  /* --- The chain ----------------------------------------------------------
     One timer per moment. Nothing runs for the terminal moment, for a static
     visitor, or once the layer is closed. */
  useEffect(() => {
    if (!isOpen || isStatic) return
    const hold = moments[moment].holdMs
    if (hold === null) return
    const timer = setTimeout(() => setMoment((current) => Math.min(current + 1, LAST)), hold)
    return () => clearTimeout(timer)
  }, [isOpen, isStatic, moment])

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

  return (
    <div
      ref={layerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      data-moment={isStatic ? 'static' : moment}
      data-entered={entered ? 'true' : 'false'}
      className="journey-layer"
    >
      <p id={labelId} className="sr-only">
        {journey.label}
      </p>

      {/* The whole story, independent of the animation and of the drawing. */}
      <p className="sr-only">{journey.summary}</p>

      <div className="journey-scene">
        <div className="journey-camera">
          <JourneyMap />
        </div>
        {/*
          The handover. On the last moment the warm ground of the homepage
          rises through the scene, so the visitor crosses from the night
          Pacific into the room they are about to be standing in rather than
          having one screen swapped for another.
        */}
        <div aria-hidden="true" className="journey-dawn" />
        {/* The travelling light follows the same path the route draws. */}
        <style>{`
          .journey-marker { offset-path: path('${ROUTE_PACIFIC}'); }
          .journey-route__leg--cafe { --leg: path('${ROUTE_CAFE}'); }
          .journey-route__leg--truck { --leg: path('${ROUTE_TRUCK}'); }
        `}</style>
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
            {moments.map((step, index) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => setMoment(index)}
                  aria-current={index === moment ? 'step' : undefined}
                  className="journey-step"
                  data-state={index === moment ? 'current' : index < moment ? 'done' : 'upcoming'}
                >
                  <span className="journey-step__mark" aria-hidden="true" />
                  <span className="journey-step__label">{step.stage}</span>
                </button>
              </li>
            ))}
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
      <p className="journey-eyebrow">{moments[0].eyebrow}</p>
      <h2 className="journey-primary">{moments[LAST].primary}</h2>
      <ol className="journey-static-stages">
        {moments.slice(0, LAST).map((step) => (
          <li key={step.id}>
            <span className="journey-static-stages__stage">{step.stage}</span>
            <span className="journey-static-stages__line">{step.primary}</span>
          </li>
        ))}
      </ol>
    </>
  )
}
