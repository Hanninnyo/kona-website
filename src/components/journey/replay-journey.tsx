'use client'

import { journey } from '@/content/journey'

/**
 * The way back to the start of the journey.
 *
 * A plain link to the journey section, which also asks the journey to return
 * to its first frame. Both halves matter:
 *
 * - as a link it works without JavaScript, and it is what moves the page and
 *   the focus back up to the opening screen;
 * - the event resets the timeline to zero and puts focus on `Begin the
 *   Journey`, without starting anything. Replaying is still the visitor's
 *   decision, exactly as it is on a first visit.
 *
 * It touches no storage. The journey is not something a visitor dismisses and
 * is not suppressed once seen, so there is no flag to clear.
 */
export function ReplayJourney({ className = '' }: { className?: string }) {
  return (
    <a
      href="#journey"
      className={className}
      onClick={() => window.dispatchEvent(new Event('kona:journey-reset'))}
    >
      {journey.replayLabel}
    </a>
  )
}
