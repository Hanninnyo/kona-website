'use client'

import { journey } from '@/content/journey'
import { requestJourneyReplay } from '@/lib/journey/session'

/**
 * Reopens the arrival journey.
 *
 * A window event rather than a context: the journey is mounted once in the
 * root layout, this button lives in the server-rendered footer, and an event
 * couples them without turning the footer — or anything between them — into a
 * client component.
 *
 * It replays in place, with no navigation and no reload, and it does not clear
 * the session flag, so dismissing it again does not cause the journey to
 * reappear on the next page the visitor opens.
 */
export function ReplayJourney({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={requestJourneyReplay} className={className}>
      {journey.replayLabel}
    </button>
  )
}
