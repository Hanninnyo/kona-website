import { CinematicHero } from '@/components/home/cinematic-hero'
import { KonaPrinciples } from '@/components/home/kona-principles'
import { SpaceEditorial } from '@/components/home/space-editorial'

/**
 * Homepage shell. A Server Component that composes the sections; only the
 * scroll-reveal wrapper and the header are client code.
 *
 * Sections 4-8 of the approved structure (Our Craft, Begin Your Escape, Coffee
 * should be appreciated like wine, From Trailer to Dream, Visit Kona) are
 * scoped to later phases and are deliberately absent rather than stubbed with
 * invented content.
 */
export default function HomePage() {
  return (
    <>
      <CinematicHero />
      <KonaPrinciples />
      <SpaceEditorial />
    </>
  )
}
