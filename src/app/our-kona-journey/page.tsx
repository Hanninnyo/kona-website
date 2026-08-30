import type { Metadata } from 'next'
import { SatelliteJourney } from '@/components/journey/satellite-journey'

export const metadata: Metadata = {
  title: 'Our Kona Journey | Kona Island Coffee',
  description:
    'From Hawaiʻi Island to the Bay Area — the satellite journey behind every cup of Kona Island Coffee.',
}

/**
 * Our Kona Journey — the satellite journey's own page.
 *
 * Previously the homepage's opening. Moved here so the homepage can open
 * with the Kona Island Latte commercial instead, and so the journey's own
 * media is never requested by a visitor who lands on `/`. The experience
 * itself — the animated `stage` mode, the `linear` no-JS/reduced-motion
 * fallback, pause/play/skip, and the destination choice at its close — is
 * unchanged; only its address changed, from the top of `/` to `/our-kona-journey`.
 */
export default function OurKonaJourneyPage() {
  return (
    <main>
      <SatelliteJourney />
    </main>
  )
}
