import { journey } from '@/content/journey'

/* ==========================================================================
   The journey timeline

   One pure function of one number. `frameAt(t)` takes the seconds elapsed
   since the visitor pressed Begin and returns everything the stage needs to
   paint: how opaque each layer is, where the geographic camera is pointing,
   how much of the route has been drawn, and which words are on screen.

   Nothing in here touches the DOM, and nothing in here reads a clock. That
   makes the whole sequence trivially pausable — hold `t` still and the
   picture holds still — and testable without a browser.
   ========================================================================== */

/** Seconds from Begin to the destination screen settling. */
export const DURATION = 11.4

const clamp = (n: number, lo: number, hi: number) => (n < lo ? lo : n > hi ? hi : n)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** Normalised progress across a window, clamped at both ends. */
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1)
/** Slow in, slow out. Used for the words, and for the move onto California. */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * Where the camera is pointing, in degrees.
 *
 * `span` is how much longitude is visible across the full width of the stage.
 * Latitude coverage falls out of the stage's own proportions, which is why
 * the same keyframes work on a wide desktop and a narrow phone: the corridor
 * always occupies the same fraction of the width, and a portrait screen
 * simply shows less ocean above and below it.
 */
export interface Camera {
  lat: number
  lon: number
  span: number
}

/**
 * The pullback, as six geographic keyframes.
 *
 * It starts tight on the Kona coast, opens out to the whole island, keeps
 * opening until the Pacific and North America are both in frame, and then
 * moves in on California. The camera never cuts; every value between these
 * points is interpolated, so the two satellite images hand over to each other
 * in the middle of one continuous move.
 */
const CAMERA: (Camera & { t: number })[] = [
  { t: 2.2, lat: 19.74, lon: -156.05, span: 1.15 },
  { t: 3.9, lat: 19.72, lon: -155.9, span: 3.2 },
  { t: 5.2, lat: 20.6, lon: -154.6, span: 7.6 },
  { t: 6.6, lat: 24.2, lon: -149.0, span: 20.0 },
  { t: 8.0, lat: 28.68, lon: -139.21, span: 48.0 },
  { t: 9.3, lat: 36.6, lon: -124.5, span: 19.0 },
]

/**
 * When each layer arrives, in the order they are stacked.
 *
 * Almost all of it is fade-in only: an incoming layer rises over one that is
 * still fully opaque underneath it, so the canvas never passes through the
 * ground. Fading both sides of a transition at once would let black show
 * through the middle of every one. A layer is dropped to zero only once the
 * layer above it has completely covered it, where nobody can see it go.
 *
 * The wide Pacific view is the exception, and the reason for the order here.
 * It sits *below* the close view of Hawaiʻi and rises to full opacity while
 * the close view still covers the whole stage — so nobody sees it arrive at a
 * zoom it has no resolution for. It is already in place underneath when the
 * camera pulls back past the edge of the island image, which is what keeps
 * real ocean rather than a flat band around the island. The close view then
 * fades out over it: the same geography at two levels of detail, aligned to
 * the pixel, so what reads is a map losing detail as it zooms out rather than
 * one picture replacing another.
 */
const LAYERS: { key: string; in: [number, number]; out?: [number, number] }[] = [
  { key: 'coastline', in: [-1, 0] },
  { key: 'farm', in: [0.35, 1.25] },
  { key: 'pacific', in: [3.05, 3.6] },
  { key: 'island', in: [2.2, 3.0], out: [4.6, 5.9] },
  { key: 'california', in: [9.15, 10.05] },
  { key: 'destination', in: [10.45, 11.35] },
]

export type LayerKey =
  | 'coastline'
  | 'farm'
  | 'pacific'
  | 'island'
  | 'california'
  | 'destination'

/**
 * The three sets of words, the windows they hold the screen for, and which
 * half of the frame they sit in.
 *
 * The anchor is not decoration. Over the wide Pacific the route runs from the
 * lower left to the upper right, which puts Hawaiʻi in the bottom-left corner
 * — exactly where the words would otherwise sit. Those words go to the top,
 * over open ocean, so neither endpoint of the journey is ever covered by the
 * sentence describing it.
 */
const CAPTIONS = [
  { key: 'farm', anchor: 'bottom', in: [0.6, 1.15], out: [2.35, 2.9] },
  { key: 'pacific', anchor: 'top', in: [4.95, 5.5], out: [7.95, 8.45] },
  { key: 'california', anchor: 'bottom', in: [8.8, 9.35], out: [10.35, 10.8] },
] as const

export type CaptionKey = (typeof CAPTIONS)[number]['key']

export const CAPTION_ANCHORS: Record<CaptionKey, 'top' | 'bottom'> = {
  farm: 'bottom',
  pacific: 'top',
  california: 'bottom',
}

export interface Frame {
  layers: Record<LayerKey, number>
  camera: Camera
  /** How much of the route is drawn, 0–1, and how visible the whole overlay is. */
  route: { progress: number; opacity: number }
  /** Per caption: opacity, and the vertical offset it is entering or leaving on. */
  captions: Record<CaptionKey, { opacity: number; shift: number }>
  /**
   * How dark the ground under the words is, at each end of the frame. It
   * follows the words rather than the pictures: a scrim that is always on is
   * a scrim that dims the satellite imagery for four seconds to make one
   * sentence readable.
   */
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
    let leaving = 0
    if (layer.out) {
      /* An explicit fade-out, used only where the layer below is already
         opaque and carrying the same geography. */
      leaving = ease(clamp((t - layer.out[0]) / (layer.out[1] - layer.out[0]), 0, 1))
    } else {
      /* Otherwise retired the moment the next layer that covers it is
         completely opaque, where the drop cannot be seen. */
      const above = LAYERS.slice(i + 1).find((l) => !l.out)
      leaving = above ? clamp((t - above.in[1]) / 0.08, 0, 1) : 0
    }
    layers[layer.key as LayerKey] = rising * (1 - leaving)
  }

  /* --- camera ---------------------------------------------------------- */
  let camera: Camera = CAMERA[0]
  if (t >= CAMERA[CAMERA.length - 1].t) {
    camera = CAMERA[CAMERA.length - 1]
  } else {
    for (let i = 0; i < CAMERA.length - 1; i += 1) {
      const a = CAMERA[i]
      const b = CAMERA[i + 1]
      if (t >= a.t && t < b.t) {
        /* Linear in time between keyframes, which — combined with the
           geometric zoom below — makes the pullback a constant rate of
           magnification. Easing it as well would make the camera lurch away
           and then crawl. The one move that is eased is the last, which comes
           to rest on California. */
        const p = i === CAMERA.length - 2 ? ease(seg(t, a.t, b.t)) : seg(t, a.t, b.t)
        camera = {
          lat: lerp(a.lat, b.lat, p),
          lon: lerp(a.lon, b.lon, p),
          /* Zoom is interpolated geometrically. Linear interpolation of a
             span that grows forty-fold reads as a lurch at the start and a
             crawl at the end; this reads as one steady pullback. */
          span: a.span * (b.span / a.span) ** p,
        }
        break
      }
    }
  }

  /* --- route ------------------------------------------------------------ */
  const route = {
    /*
      Eased *in*, not out, and this is the whole point of it.
      The line is drawn while the camera is still pulling back, so the frame
      is widening underneath it. Anything that starts fast — an ease-out, or
      even a straight ramp — sends the leading edge past the right-hand edge
      of the frame within half a second and draws the rest of the Pacific
      off-screen: the visitor sees a finished line appear rather than a line
      being drawn, and the glint travels where nobody can see it. Starting
      slow and accelerating keeps the head inside the frame the whole way,
      arriving at the Bay Area just as the camera settles at its widest.
    */
    progress: seg(t, 4.8, 8.2) ** 2,
    /* Gone before the Golden Gate has arrived, so the line is never left
       floating over the bridge. */
    opacity: Math.min(seg(t, 4.6, 5.6), 1 - seg(t, 8.75, 9.3)),
  }

  /* --- words ------------------------------------------------------------ */
  const captions = {} as Record<CaptionKey, { opacity: number; shift: number }>
  for (const c of CAPTIONS) {
    const arriving = ease(seg(t, c.in[0], c.in[1]))
    const leaving = ease(seg(t, c.out[0], c.out[1]))
    captions[c.key] = {
      opacity: arriving * (1 - leaving),
      shift: (1 - arriving) * CAPTION_SHIFT - leaving * CAPTION_SHIFT,
    }
  }

  const veil = { top: 0, bottom: 0 }
  for (const c of CAPTIONS) veil[c.anchor] = Math.max(veil[c.anchor], captions[c.key].opacity)

  return { layers, camera, route, captions, veil }
}

/* ==========================================================================
   Geography

   Both satellite images are equirectangular, so longitude and latitude map
   linearly to pixels and a single scale factor covers both axes. Windowing
   them is therefore exact arithmetic — no projection maths, no warping, and
   no chance of the two images disagreeing about where Hawaiʻi is.
   ========================================================================== */

export interface Bounds {
  north: number
  south: number
  west: number
  east: number
}

/** The camera resolved against a real box, in pixels. */
export interface View {
  /** Pixels per degree. Equal on both axes, which is what keeps it undistorted. */
  ppd: number
  /** Longitude at the left edge, latitude at the top edge. */
  west: number
  north: number
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
        Math.sin((φ2 - φ1) / 2) ** 2 +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
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
 * form does not survive contact with `vector-effect: non-scaling-stroke`:
 * the browser then resolves the dash pattern in screen pixels while the path
 * is still normalised to one unit, and a line meant to be drawn in one
 * continuous stroke comes out as a row of one-pixel dots. Measuring the real
 * length keeps the dash pattern, the stroke width and the geometry in the
 * same space, where they agree.
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
