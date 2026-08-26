import { journey } from '@/content/journey'

/**
 * The way back to the start of the journey.
 *
 * A plain link to the journey section, which is the top of its scroll track
 * and therefore its opening screen. That is the whole implementation, and it
 * is deliberate:
 *
 * - it works without JavaScript, so it is a Server Component and the footer
 *   stays server-rendered;
 * - fragment navigation moves focus to the section, which is focusable and
 *   named by the opening headline, so a screen reader announces where the
 *   visitor has arrived;
 * - it touches no storage. The journey is not something a visitor dismisses
 *   and is not suppressed once seen, so there is no flag to clear and nothing
 *   to reopen.
 */
export function ReplayJourney({ className = '' }: { className?: string }) {
  return (
    <a href="#journey" className={className}>
      {journey.replayLabel}
    </a>
  )
}
