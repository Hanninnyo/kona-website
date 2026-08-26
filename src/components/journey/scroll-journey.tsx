'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { OrderChooser } from '@/components/order-chooser'
import { journey } from '@/content/journey'

/* ==========================================================================
   The Kona journey

   One story, five chapters, told over a single sticky canvas that the visitor
   drives with their own scroll. There is no timer anywhere in this file:
   every opacity, every offset and every video decision is a pure function of
   one number — how far the visitor has scrolled through the journey section —
   which is what makes the whole thing reverse perfectly when they scroll back
   up, and what lets them stop anywhere and read for as long as they like.

   It renders in two modes:

   `linear`  — what the server sends, and what a visitor without JavaScript or
               with `prefers-reduced-motion: reduce` keeps: six ordinary
               blocks, each a poster photograph and its words, in the order
               the coffee travels. No sticky, no transforms, no video.

   `stage`   — the enhanced mode, entered on mount. The same six blocks are
               lifted into one sticky 100svh canvas and cross-faded against
               each other by scroll position.

   Because both modes are the same DOM, the story is complete before a byte of
   JavaScript arrives and stays complete if none ever does.
   ========================================================================== */

const { chapters, cover, photos, destinations, route } = journey

/**
 * The length of the journey in chapter units.
 *
 * The cover sits at 0 and each chapter at 1…5, so the story itself spans five
 * units. The extra 0.6 is the tail after the final chapter's words have
 * arrived, during which the closing composition opens out — the café is
 * already full-canvas and the truck comes forward into it. One unit costs one
 * viewport of scrolling.
 */
const SPAN = 5.6

/** The last copy beat, and the one the tail belongs to. */
const LAST = chapters.length // 5

/**
 * When each media layer fades in, in chapter units.
 *
 * Only fade-ins are listed, and that is the point. The layers are stacked in
 * this order, so the incoming one is always on top of the outgoing one: it
 * fades up over a picture that is still fully opaque underneath. Fading both
 * at once — the obvious way — lets the ground show through in the middle of
 * every transition, which is exactly the dip toward black we are avoiding.
 * An outgoing layer is dropped to zero only once the layer above it is fully
 * opaque, where it cannot be seen going.
 *
 * The Kona layer starts opaque: it is the first thing on the screen, and it
 * carries both the cover and the first chapter, so the coastline stays
 * dominant across the whole opening rather than handing over at chapter one.
 */
const FADES: { in: [number, number] }[] = [
  { in: [-1, 0] }, // kona          — opaque from the first paint, out under farm
  { in: [1.25, 1.75] }, // farm
  { in: [2.25, 2.75] }, // pacific
  { in: [3.25, 3.75] }, // arrival
  { in: [4.25, 4.75] }, // destinations
]

/**
 * How far either side of its own position a beat's words stay fully readable,
 * and where they reach zero.
 *
 * The plateau is wide — more than half a viewport of scrolling on each side —
 * so stopping mid-chapter leaves the words at full strength rather than
 * half-faded. Outgoing words reach zero at 0.46 and the next ones do not
 * begin until 0.54, so no two chapters are ever legible at once.
 */
const COPY_HOLD = 0.28
const COPY_EDGE = 0.46

/** How far the words travel as they arrive and leave. Restraint, not motion. */
const COPY_SHIFT = 14

/** Where the closing composition opens out, in chapter units. */
const SUB_START = 4.85
const SUB_LENGTH = 0.6

const clamp = (n: number, min: number, max: number) => (n < min ? min : n > max ? max : n)

/** Below this width the portrait encodes are used. */
const TALL_QUERY = '(max-width: 699px)'

export function ScrollJourney() {
  const [mode, setMode] = useState<'linear' | 'stage'>('linear')
  const [variant, setVariant] = useState<'wide' | 'tall' | null>(null)
  /**
   * How far into the story the visitor has been, as a chapter index.
   *
   * The only piece of React state the scroll engine touches, and it moves at
   * most four times in a whole session: it never goes back down, so scrolling
   * up unloads nothing and re-fetches nothing.
   *
   * It starts at zero on the server, which is what keeps four chapters of
   * poster off the wire. `loading="lazy"` cannot do that on its own here:
   * every chapter is stacked at `inset: 0` of a sticky stage, so the moment
   * the enhanced layout exists they are all inside the viewport and all get
   * fetched. A chapter that has not been reached is not in the layout at all.
   * The `noscript` rule below puts them back for a visitor without
   * JavaScript, who has no engine to admit them.
   */
  const [reach, setReach] = useState(0)
  const reachRef = useRef(0)

  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const beatRefs = useRef<(HTMLDivElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  /** Which videos have been given a `src`, so none is requested twice. */
  const armed = useRef<Set<number>>(new Set())
  /** The beat currently holding the words, so `inert` is only rewritten on change. */
  const liveBeat = useRef<number>(-1)

  /* ------------------------------------------------------------------ mode */
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')

    const decide = () => {
      // A visitor who has asked for less motion keeps the linear story: no
      // sticky canvas, no transforms, no video, no scroll listener at all.
      // With no engine to admit chapters as they are approached, every
      // chapter is admitted at once and the browser loads the posters by
      // distance, in the ordinary way.
      if (still.matches) {
        reachRef.current = chapters.length - 1
        setReach(chapters.length - 1)
      }
      setMode(still.matches ? 'linear' : 'stage')
      setVariant(still.matches ? null : window.matchMedia(TALL_QUERY).matches ? 'tall' : 'wide')
    }

    decide()
    still.addEventListener('change', decide)
    return () => still.removeEventListener('change', decide)
  }, [])

  /* Re-pick the encode when the viewport crosses the boundary. Changing the
     variant re-keys the video elements, so a portrait phone rotated to
     landscape gets the landscape take rather than a stretched portrait one. */
  useEffect(() => {
    if (mode !== 'stage') return
    const wide = window.matchMedia(TALL_QUERY)
    const pick = () => setVariant(wide.matches ? 'tall' : 'wide')
    wide.addEventListener('change', pick)
    return () => wide.removeEventListener('change', pick)
  }, [mode])

  /* ----------------------------------------------------------- the engine */
  useEffect(() => {
    if (mode !== 'stage') return
    const track = trackRef.current
    const stage = stageRef.current
    if (!track || !stage) return

    /* The arrays themselves are stable — React only ever writes slots into
       them — so holding them here is safe and keeps the cleanup honest. */
    const beats = beatRefs.current
    const videos = videoRefs.current

    let frame = 0

    const paint = () => {
      frame = 0

      /* One read of layout per frame, all writes after it. Nothing below
         measures anything, so there is no read-write-read thrash. */
      const rect = track.getBoundingClientRect()
      const travel = rect.height - stage.offsetHeight
      const progress = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0
      const t = progress * SPAN

      stage.style.setProperty('--jy-p', progress.toFixed(4))
      stage.style.setProperty(
        '--jy-sub',
        clamp((t - SUB_START) / SUB_LENGTH, 0, 1).toFixed(4),
      )

      /* --- media ------------------------------------------------------- */
      let wanted = 0
      for (let i = 0; i < FADES.length; i += 1) {
        if (t > FADES[i].in[0] - 1) wanted = i
      }
      if (wanted > reachRef.current) {
        reachRef.current = wanted
        setReach(wanted)
      }

      for (let i = 0; i < FADES.length; i += 1) {
        const [from, to] = FADES[i].in
        const rising = clamp((t - from) / (to - from), 0, 1)
        /* Retired only once the layer above has fully covered this one, so
           the drop happens where nobody can see it. */
        const above = FADES[i + 1]
        const covered = above ? clamp((t - above.in[1]) / 0.06, 0, 1) : 0
        const opacity = rising * (1 - covered)
        stage.style.setProperty(`--jy-m${i}`, opacity.toFixed(4))

        const video = videos[i]
        if (!video) continue

        /* Prepared shortly before it is needed, never at the start. Only the
           opening take is requested when the journey mounts. */
        if (!armed.current.has(i) && t > from - 1) {
          const source = video.dataset.src
          if (source) {
            armed.current.add(i)
            video.src = source
            video.load()
          }
        }

        /* Playing only while it is on screen, or about to be. Everything else
           is paused, so at most two takes are ever decoding. */
        const live = opacity > 0.01 || (t > from - 0.2 && t < from + 0.2)
        if (live) {
          if (video.paused && video.readyState >= 2) {
            void video.play().catch(() => {
              /* Autoplay refused, or the codec is unavailable. The poster is
                 already painted underneath; the chapter is unaffected. */
            })
          }
        } else if (!video.paused) {
          video.pause()
        }
      }

      /* --- words ------------------------------------------------------- */
      for (let i = 0; i <= LAST; i += 1) {
        /* The cover never fades in and the closing chapter never fades out:
           the first thing on the screen is already legible, and the last
           chapter carries the actions, so it stays through the tail. */
        const signed = i === 0 ? Math.max(0, t) : i === LAST ? Math.min(0, t - LAST) : t - i
        const distance = Math.abs(signed)
        const opacity = clamp((COPY_EDGE - distance) / (COPY_EDGE - COPY_HOLD), 0, 1)
        stage.style.setProperty(`--jy-c${i}`, opacity.toFixed(4))
        stage.style.setProperty(
          `--jy-y${i}`,
          `${(clamp(signed / COPY_EDGE, -1, 1) * -COPY_SHIFT).toFixed(2)}px`,
        )
      }

      /* --- what the keyboard and the screen reader see ------------------ */
      const current = clamp(Math.round(t), 0, LAST)
      if (current !== liveBeat.current) {
        liveBeat.current = current
        for (let i = 0; i <= LAST; i += 1) {
          const beat = beats[i]
          if (beat) beat.inert = i !== current
        }
      }
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
      /* Leave nothing hidden from the keyboard behind. */
      for (const beat of beats) if (beat) beat.inert = false
      for (const video of videos) if (video) video.pause()
      liveBeat.current = -1
    }
  }, [mode, variant])

  /* ------------------------------------------------------- follow the story */
  const follow = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      /* In linear mode the anchor does the right thing on its own. */
      if (mode !== 'stage') return
      const track = trackRef.current
      const stage = stageRef.current
      if (!track || !stage) return
      event.preventDefault()
      const rect = track.getBoundingClientRect()
      const travel = rect.height - stage.offsetHeight
      window.scrollTo({
        top: window.scrollY + rect.top + (travel * 1) / SPAN,
        behavior: 'smooth',
      })
    },
    [mode],
  )

  return (
    <section
      id="journey"
      className="jy"
      data-mode={mode}
      tabIndex={-1}
      aria-labelledby="journey-start"
      aria-describedby="journey-intro"
    >
      <p id="journey-intro" className="sr-only">
        {journey.intro}
      </p>

      {/*
        Without JavaScript there is no engine to admit chapters as the visitor
        reaches them, so every chapter is admitted here instead and the browser
        loads the posters by distance. This is the only rule in the journey
        that depends on the absence of scripting, and it exists so that the
        default — four chapters of poster left unfetched — can be the strict
        one.
      */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<style>.jy-media[data-near='false']{display:block}</style>`,
        }}
      />

      <div ref={trackRef} className="jy-track">
        <div ref={stageRef} className="jy-stage">
          <div className="jy-ground" aria-hidden="true" />

          {/* ---------------------------------------------------- the cover */}
          <article className="jy-panel jy-panel--cover">
            <div
              className="jy-copy jy-copy--lower"
              ref={(node) => {
                beatRefs.current[0] = node
              }}
              style={{ '--c': 'var(--jy-c0)', '--y': 'var(--jy-y0)' } as React.CSSProperties}
            >
              <p className="jy-eyebrow">{cover.eyebrow}</p>
              <h1 id="journey-start" className="jy-headline">
                {cover.headline}
              </h1>
              <p className="jy-supporting">{cover.supporting}</p>
              <div className="jy-actions">
                <a href="#jy-kona" className="jy-action jy-action--primary" onClick={follow}>
                  {cover.followLabel}
                </a>
                <a href="#home-content" className="jy-action">
                  {journey.enterLabel}
                </a>
              </div>
            </div>
          </article>

          {/* ------------------------------------------------- the chapters */}
          {chapters.map((chapter, index) => {
            const beat = index + 1
            const footage = chapter.footage
            const closing = chapter.id === 'destinations'

            return (
              <article
                key={chapter.id}
                id={`jy-${chapter.id}`}
                className="jy-panel"
                data-chapter={chapter.id}
              >
                <div
                  className="jy-media"
                  aria-hidden="true"
                  data-near={index <= reach ? 'true' : 'false'}
                  style={
                    {
                      '--z': index + 1,
                      '--m': `var(--jy-m${index})`,
                    } as React.CSSProperties
                  }
                >
                  {footage ? (
                    <>
                      {/*
                        The poster is its own element rather than the video's
                        `poster` attribute. A video at zero opacity hides its
                        own poster, so the attribute cannot hold a frame for a
                        chapter that is still loading or whose codec the
                        browser does not have. Painted separately, there is
                        always a picture and never a blank frame.
                      */}
                      <picture>
                        <source media="(max-width: 699px)" srcSet={footage.tall.poster} />
                        <img
                          className="jy-frame"
                          src={footage.wide.poster}
                          alt=""
                          width={footage.wide.width}
                          height={footage.wide.height}
                          decoding="async"
                          loading={index === 0 ? 'eager' : 'lazy'}
                          fetchPriority={index === 0 ? 'high' : 'auto'}
                        />
                      </picture>
                      {variant ? (
                        <video
                          key={variant}
                          ref={(node) => {
                            videoRefs.current[index] = node
                          }}
                          className="jy-frame jy-video"
                          data-src={footage[variant].src}
                          width={footage[variant].width}
                          height={footage[variant].height}
                          muted
                          playsInline
                          preload="none"
                          tabIndex={-1}
                          onLoadedData={(event) => {
                            event.currentTarget.dataset.ready = 'true'
                          }}
                        />
                      ) : null}
                      <div className="jy-scrim" data-anchor={chapter.anchor} />
                    </>
                  ) : (
                    <div className="jy-close">
                      {/*
                        The café first and full-canvas — its sign and open
                        entrance stay recognisable the whole way through — and
                        the truck comes forward into the same picture as the
                        visitor keeps scrolling. One composition, not two
                        cards.
                      */}
                      <picture>
                        <source media="(max-width: 699px)" srcSet={photos.cafe.tall.src} />
                        <img
                          className="jy-frame jy-frame--cafe"
                          src={photos.cafe.wide.src}
                          alt=""
                          width={photos.cafe.wide.width}
                          height={photos.cafe.wide.height}
                          decoding="async"
                          loading="lazy"
                        />
                      </picture>
                      {/*
                        The ground for the words goes here, between the two
                        photographs rather than over both: the café is what
                        the words are read against and is weighted for them,
                        and the truck stays as bright as it was photographed.
                      */}
                      <div className="jy-scrim" data-anchor={chapter.anchor} />
                      <div className="jy-truck">
                        <picture>
                          <source media="(max-width: 699px)" srcSet={photos.truck.tall.src} />
                          <img
                            className="jy-frame"
                            src={photos.truck.wide.src}
                            alt=""
                            width={photos.truck.wide.width}
                            height={photos.truck.wide.height}
                            decoding="async"
                            loading="lazy"
                          />
                        </picture>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`jy-copy jy-copy--${chapter.anchor}${closing ? ' jy-copy--closing' : ''}`}
                  ref={(node) => {
                    beatRefs.current[beat] = node
                  }}
                  style={
                    { '--c': `var(--jy-c${beat})`, '--y': `var(--jy-y${beat})` } as React.CSSProperties
                  }
                >
                  <p className="jy-eyebrow">{chapter.eyebrow}</p>
                  <h2 className="jy-headline">{chapter.headline}</h2>
                  <p className="jy-supporting">{chapter.supporting}</p>

                  {closing ? (
                    <>
                      <div className="jy-destinations">
                        {destinations.map((item) => (
                          <a key={item.label} href={item.href} className="jy-destination">
                            <span className="jy-destination__label">{item.label}</span>
                            <span className="jy-destination__detail">{item.description}</span>
                          </a>
                        ))}
                        <OrderChooser solid={false} className="jy-order" />
                      </div>
                      <div className="jy-actions jy-actions--closing">
                        <a href="#home-content" className="jy-action jy-action--primary">
                          {journey.enterLabel}
                        </a>
                      </div>
                    </>
                  ) : null}

                  {/* The picture is decorative; this is what it shows. */}
                  {footage ? <p className="sr-only">{footage.description}</p> : null}
                  {closing ? (
                    <p className="sr-only">
                      {photos.cafe.description} {photos.truck.description}
                    </p>
                  ) : null}
                </div>
              </article>
            )
          })}

          {/* ------------------------------------------------- the route line */}
          <div className="jy-route" aria-hidden="true">
            <span className="jy-route__end">{route.start}</span>
            <span className="jy-route__line">
              <span className="jy-route__fill" />
            </span>
            <span className="jy-route__end">{route.end}</span>
          </div>
        </div>
      </div>

      {/* The whole story in prose, for anyone who cannot see the pictures. */}
      <p className="sr-only">{journey.summary}</p>
    </section>
  )
}
