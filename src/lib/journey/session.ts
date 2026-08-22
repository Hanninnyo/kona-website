/**
 * Session memory for the arrival journey.
 *
 * One first-party key, one browser session. It exists so the opening chapter
 * does not replay every time a visitor moves between pages, and it is
 * deliberately session-scoped: a visitor returning tomorrow sees the journey
 * again, which is the intent.
 *
 * Every access is guarded. Private browsing and blocked storage throw on
 * access rather than returning null, and a visitor whose browser refuses
 * storage should still see the journey rather than an error.
 */

const KEY = 'kona.journey.seen'

/** Fired on `window` to open the journey from elsewhere in the page. */
export const JOURNEY_REPLAY_EVENT = 'kona:replay-journey'

export function hasSeenJourney(): boolean {
  try {
    return window.sessionStorage.getItem(KEY) === '1'
  } catch {
    // Storage unavailable: treat it as a first visit rather than failing.
    return false
  }
}

export function markJourneySeen(): void {
  try {
    window.sessionStorage.setItem(KEY, '1')
  } catch {
    // Nothing to do. The journey may simply replay on the next navigation.
  }
}

export function requestJourneyReplay(): void {
  window.dispatchEvent(new CustomEvent(JOURNEY_REPLAY_EVENT))
}
