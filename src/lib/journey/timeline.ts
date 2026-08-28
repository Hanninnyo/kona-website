import { journey } from '@/content/journey'

/* ==========================================================================
   The journey timeline

   One pure function of one number. `frameAt(t)` takes the seconds elapsed
   since the sequence started and returns everything the stage needs to paint:
   how opaque each layer is, how much of the route has been drawn, and which
   words are on screen. The camera is separate, because it also has to answer
   to the shape of the viewport.

   Nothing in here touches the DOM and nothing reads a clock, which is what
   makes the sequence pausable — hold `t` still and the picture holds still —
   and testable without a browser.
   ========================================================================== */

/** Seconds from the first frame to the destination screen settling. */
export const DURATION = 17.0

const clamp = (n: number, lo: number, hi: number) => (n < lo ? lo : n > hi ? hi : n)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** Normalised progress across a window, clamped at both ends. */
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1)
/** Slow in, slow out. */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * Where the camera is pointing, in degrees.
 *
 * `span` is how much longitude is visible across the full width of the stage.
 * Latitude coverage falls out of the stage's own proportions.
 */
export interface Camera {
  lat: number
  lon: number
  span: number
}

/**
 * The pullback and the crossing, as geographic keyframes.
 *
 * Two paths, because one cannot serve both shapes of screen. The corridor
 * from Kona to the Bay Area is 33.7° of longitude by 17.9° of latitude — a
 * wide, shallow diagonal. A landscape stage can hold all of it at once. A
 * 390×844 phone cannot: showing that much longitude across 390 pixels implies
 * more than eighty degrees of latitude down 844, which is more sky than there
 * is map north of the equator. Rather than letterbox the map or shrink the
 * corridor to a smear, the narrow camera travels along the route — Kona in
 * frame at the start, California at the end, the drawing edge in view
 * throughout.
 */
const CAMERA_WIDE: (Camera & { t: number })[] = [
  { t: 5.5, lat: 19.74, lon: -156.02, span: 1.28 },
  /* A deliberately small first move, and its numbers are not free. The close
     image covers 2.871° of longitude and 1.687° of latitude, of which the
     outer 8% on each side is feathered; this keyframe holds the frame inside
     what is left, on every landscape stage, until the wide map has reached
     full opacity underneath it. That is what makes the handoff a change of
     detail rather than a change of picture. */
  { t: 7.0, lat: 19.66, lon: -155.8, span: 1.72 },
  { t: 8.5, lat: 19.62, lon: -155.55, span: 4.2 },
  { t: 11.0, lat: 22.6, lon: -150.2, span: 13.0 },
  { t: 13.0, lat: 25.8, lon: -144.5, span: 26.0 },
  { t: 14.5, lat: 28.68, lon: -139.21, span: 40.0 },
  /* Comes to rest on California a full second before the map begins to
     dissolve, so the last thing the map does is settle rather than vanish
     mid-move. */
  { t: 16.0, lat: 36.9, lon: -124.2, span: 15.0 },
]

const CAMERA_NARROW: (Camera & { t: number })[] = [
  { t: 5.5, lat: 19.59, lon: -155.99, span: 0.62 },
  { t: 7.0, lat: 19.68, lon: -155.9, span: 1.6 },
  { t: 8.5, lat: 19.62, lon: -155.6, span: 4.6 },
  { t: 11.0, lat: 22.5, lon: -152.5, span: 9.0 },
  { t: 13.0, lat: 28.0, lon: -142.0, span: 15.0 },
  { t: 14.5, lat: 35.0, lon: -128.5, span: 20.0 },
  { t: 16.0, lat: 36.6, lon: -125.0, span: 12.0 },
]

/**
 * When each layer arrives and leaves.
 *
 * Every transition is a fade-in over something still fully opaque, and every
 * departure waits for the layer that replaced it to reach full opacity. That
 * is the rule the whole sequence rests on: at no moment are two stacked
 * layers both partly transparent, so the canvas never shows through and there
 * is no frame in which the ground is visible.
 *
 * The order of the array is not the stacking order — the stage sets that
 * explicitly — so each departure names its own window rather than inferring
 * one from its neighbours.
 *
 * Two of them read backwards on purpose. The wide Pacific view rises *below*
 * the close view of Hawaiʻi and reaches full opacity while that close view
 * still covers the stage, so it is already in place underneath before the
 * camera pulls back past the edge of the island image; the close view then
 * fades out over it. The café does the same thing at the other end: it comes
 * up to full opacity underneath the settled map, and the map dissolves away
 * to reveal it. Both are the same trick, and both are why nothing here ever
 * cuts.
 */
const LAYERS: { key: string; in: [number, number]; out?: [number, number] }[] = [
  { key: 'coastline', in: [-1, 0], out: [3.3, 3.4] },
  { key: 'farm', in: [2.2, 3.3], out: [6.85, 7.0] },
  { key: 'destination', in: [15.2, 16.0] },
  { key: 'pacific', in: [6.35, 6.85], out: [16.0, 17.0] },
  { key: 'island', in: [5.2, 6.3], out: [8.8, 10.4] },
]

export type LayerKey = 'coastline' | 'farm' | 'pacific' | 'island' | 'destination'

/** The three sets of words, and the half of the frame each sits in. */
const CAPTIONS = [
  { key: 'kona', anchor: 'bottom', in: [0.4, 1.0], out: [2.2, 2.8] },
  { key: 'farm', anchor: 'bottom', in: [3.0, 3.6], out: [5.2, 5.8] },
  /* Over the wide Pacific the route runs from the lower left to the upper
     right, which puts Hawaiʻi in the bottom-left corner — exactly where these
     words would otherwise sit. They go to the top, over open ocean. */
  { key: 'pacific', anchor: 'top', in: [9.6, 10.3], out: [14.2, 14.9] },
] as const

export type CaptionKey = (typeof CAPTIONS)[number]['key']

export const CAPTION_ANCHORS: Record<CaptionKey, 'top' | 'bottom'> = {
  kona: 'bottom',
  farm: 'bottom',
  pacific: 'top',
}

export interface Frame {
  layers: Record<LayerKey, number>
  route: { progress: number; opacity: number }
  captions: Record<CaptionKey, { opacity: number; shift: number }>
  veil: { top: number; bottom: number }
}

/** How far the words travel as they arrive and leave. Restraint, not motion. */
const CAPTION_SHIFT = 10

export function frameAt(t: number): Frame {
  const layers = {} as Record<LayerKey, number>
  for (let i = 0; i < LAYERS.length; i += 1) {
    const layer = LAYERS[i]
    const [from, to] = layer.in
    const rising = clamp((t - from) / (to - from), 0, 1)
    const leaving = layer.out
      ? ease(clamp((t - layer.out[0]) / (layer.out[1] - layer.out[0]), 0, 1))
      : 0
    layers[layer.key as LayerKey] = rising * (1 - leaving)
  }

  const route = {
    /*
      Eased *in*, not out, and this is the whole point of it. The line is drawn
      while the camera is still pulling back, so the frame is widening
      underneath it. Anything that starts fast sends the leading edge past the
      right-hand edge of the frame within half a second and draws the rest of
      the Pacific off-screen: the visitor sees a finished line appear rather
      than a line being drawn, and the glint travels where nobody can see it.
      Starting slow and accelerating keeps the head inside the frame the whole
      way, arriving at the Bay Area as the camera settles.
    */
    progress: seg(t, 9.5, 14.5) ** 2,
    /* Gone well before the map begins to dissolve, so the line is never left
       floating over the photograph underneath it. */
    opacity: Math.min(seg(t, 9.2, 10.2), 1 - seg(t, 14.9, 15.6)),
  }

  const captions = {} as Record<CaptionKey, { opacity: number; shift: number }>
  for (const c of CAPTIONS) {
    const arriving = ease(seg(t, c.in[0], c.in[1]))
    const leaving = ease(seg(t, c.out[0], c.out[1]))
    captions[c.key] = {
      opacity: arriving * (1 - leaving),
      shift: (1 - arriving) * CAPTION_SHIFT - leaving * CAPTION_SHIFT,
    }
  }

  /* The ground under the words follows the words, not the pictures: a scrim
     that is always on is a scrim that dims the satellite for four seconds to
     make one sentence readable. */
  const veil = { top: 0, bottom: 0 }
  for (const c of CAPTIONS) veil[c.anchor] = Math.max(veil[c.anchor], captions[c.key].opacity)

  return { layers, route, captions, veil }
}

/** The camera before it has been fitted to a viewport. */
export function cameraAt(t: number, narrow: boolean): Camera {
  const keys = narrow ? CAMERA_NARROW : CAMERA_WIDE
  if (t <= keys[0].t) return keys[0]
  const last = keys[keys.length - 1]
  if (t >= last.t) return last
  for (let i = 0; i < keys.length - 1; i += 1) {
    const a = keys[i]
    const b = keys[i + 1]
    if (t >= a.t && t < b.t) {
      /* Linear in time between keyframes which — with the geometric zoom
         below — makes the pullback a constant rate of magnification. Easing it
         as well would make the camera lurch away and then crawl. The one move
         that is eased is the last, which comes to rest on California. */
      const p = i === keys.length - 2 ? ease(seg(t, a.t, b.t)) : seg(t, a.t, b.t)
      return {
        lat: lerp(a.lat, b.lat, p),
        lon: lerp(a.lon, b.lon, p),
        span: a.span * (b.span / a.span) ** p,
      }
    }
  }
  return last
}

/* ==========================================================================
   Geography

   Both satellite images are equirectangular, so longitude and latitude map
   linearly to pixels and one scale factor covers both axes. Windowing them is
   exact arithmetic — no projection maths, no warping, and no chance of the
   two images disagreeing about where Hawaiʻi is.
   ========================================================================== */

export interface Bounds {
  north: number
  south: number
  west: number
  east: number
}

/**
 * Fit a camera to a viewport so the map cannot fail to cover it.
 *
 * This is a hard guarantee rather than a hand-checked one. Whatever the
 * keyframes ask for, the window is first narrowed until the latitude it
 * implies fits inside the image, then slid until it sits wholly within the
 * image on both axes. A camera that has been through this cannot show the
 * stage behind the map at any viewport, at any moment, which is the only way
 * to be sure there is no black edge — checking a handful of screen sizes by
 * eye is not.
 */
export function fit(camera: Camera, width: number, height: number, bounds: Bounds): Camera {
  const aspect = width / height
  const lonRange = bounds.east - bounds.west
  const latRange = bounds.north - bounds.south
  /* The widest window whose height still fits inside the image. */
  const span = Math.min(camera.span, lonRange, latRange * aspect)
  const latSpan = span / aspect
  return {
    span,
    lon: clamp(camera.lon, bounds.west + span / 2, bounds.east - span / 2),
    lat: clamp(camera.lat, bounds.south + latSpan / 2, bounds.north - latSpan / 2),
  }
}

/** The camera resolved against a real box, in pixels. */
export interface View {
  /** Pixels per degree. Equal on both axes, which keeps it undistorted. */
  ppd: number
  /** Longitude at the left edge, latitude at the top edge. */
  west: number
  north: number
}

/**
 * The camera for a moment, fitted to a box, in pixels.
 *
 * The one path from a time to a view. The stage paints through it and the
 * coverage check measures through it, so a viewport that passes the check is
 * the same arithmetic the browser will run — not an approximation of it.
 */
export function viewFor(t: number, width: number, height: number, narrow: boolean): View {
  return resolve(fit(cameraAt(t, narrow), width, height, journey.satellite.pacific.bounds), width, height)
}

export function resolve(camera: Camera, width: number, height: number): View {
  const ppd = width / camera.span
  return {
    ppd,
    west: camera.lon - camera.span / 2,
    north: camera.lat + height / ppd / 2,
  }
}

/** A geographic point, in stage pixels. */
export function point(view: View, lat: number, lon: number): [number, number] {
  return [(lon - view.west) * view.ppd, (view.north - lat) * view.ppd]
}

/**
 * The transform that puts an image of known geographic extent in the right
 * place at the right size. Translation and scale only — nothing that could
 * bend a coastline.
 */
export function placement(view: View, bounds: Bounds, naturalWidth: number) {
  const scale = (view.ppd * (bounds.east - bounds.west)) / naturalWidth
  const x = (bounds.west - view.west) * view.ppd
  const y = (view.north - bounds.north) * view.ppd
  return `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(5)})`
}

/**
 * The great circle between two points on the Earth, sampled evenly.
 *
 * This is the path an aircraft actually flies, and on an equirectangular map
 * it bows gently north — which is why the route needs no artificial arc to
 * look like a flight. Returned in the pixel space of the wide Pacific image
 * so the overlay can share that image's transform exactly.
 */
export function routePoints(count = 64): [number, number][] {
  const { origin, destination } = journey.route
  const { bounds, wide } = journey.satellite.pacific
  const ppd = wide.width / (bounds.east - bounds.west)
  const rad = Math.PI / 180

  const φ1 = origin.lat * rad
  const λ1 = origin.lon * rad
  const φ2 = destination.lat * rad
  const λ2 = destination.lon * rad
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
      ),
    )

  const out: [number, number][] = []
  for (let i = 0; i <= count; i += 1) {
    const f = i / count
    const A = Math.sin((1 - f) * d) / Math.sin(d)
    const B = Math.sin(f * d) / Math.sin(d)
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2)
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2)
    const z = A * Math.sin(φ1) + B * Math.sin(φ2)
    const lat = Math.atan2(z, Math.hypot(x, y)) / rad
    const lon = Math.atan2(y, x) / rad
    out.push([(lon - bounds.west) * ppd, (bounds.north - lat) * ppd])
  }
  return out
}

/** The sampled path as an SVG `d`, in the wide Pacific image's pixel space. */
export function routePath(points: [number, number][]): string {
  return points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ')
}

/**
 * The length of the sampled path in its own user units.
 *
 * Measured here rather than left to `pathLength="1"`, because the normalised
 * form does not survive contact with `vector-effect: non-scaling-stroke`: the
 * browser then resolves the dash pattern in screen pixels while the path is
 * still normalised to one unit, and a line meant to be drawn in one
 * continuous stroke comes out as a row of one-pixel dots.
 */
export function routeLength(points: [number, number][]): number {
  let total = 0
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
  }
  return total
}

/** Where along the sampled path a given progress falls, for the glint. */
export function pointAt(points: [number, number][], progress: number): [number, number] {
  const i = clamp(progress, 0, 1) * (points.length - 1)
  const lo = Math.floor(i)
  const hi = Math.min(lo + 1, points.length - 1)
  const f = i - lo
  return [lerp(points[lo][0], points[hi][0], f), lerp(points[lo][1], points[hi][1], f)]
}
