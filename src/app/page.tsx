import { SatelliteJourney } from '@/components/journey/satellite-journey'
import { CinematicHero } from '@/components/home/cinematic-hero'
import { FindYourKona } from '@/components/home/find-your-kona'
import { KonaPrinciples } from '@/components/home/kona-principles'
import { SpaceEditorial } from '@/components/home/space-editorial'
import { VisitDestinations } from '@/components/home/visit-destinations'

/**
 * Homepage shell. A Server Component that composes the sections; only the
 * scroll-reveal wrapper and the header are client code.
 *
 * The remaining sections of the approved structure (Our Craft, Signature
 * Collection, Coffee should be appreciated like wine, From Trailer to Dream)
 * are scoped to later phases and are deliberately absent rather than stubbed
 * with invented content.
 */
export default function HomePage() {
  return (
    <main>
      {/*
        The journey is optional and it plays only when asked. It sits inside
        the one `main` landmark ahead of the homepage, and `Enter Kona` — on
        its very first screen, throughout the sequence and again at its close —
        is a plain link to the anchor below, so the homepage is never more than
        one action away and no visitor can be held here.
      */}
      <SatelliteJourney />
      <div id="home-content" tabIndex={-1}>
        <CinematicHero />
        <KonaPrinciples />
        <FindYourKona />
        <SpaceEditorial />
        <VisitDestinations />
      </div>
    </main>
  )
}
