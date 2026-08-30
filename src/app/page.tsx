import { LatteHero } from '@/components/home/latte-hero'
import { SignatureDrinks } from '@/components/home/signature-drinks'
import { ChimneyCakes } from '@/components/home/chimney-cakes'
import { FindYourKona } from '@/components/home/find-your-kona'
import { BringKonaHome } from '@/components/home/bring-kona-home'
import { DestinationCanvas } from '@/components/home/destination-canvas'
import { OriginInvitation } from '@/components/home/origin-invitation'

/**
 * Homepage shell. A Server Component composing the approved section order:
 *
 *   1. Kona Island Latte commercial   (LatteHero)
 *   2. Signature-drink showcase       (SignatureDrinks)
 *   3. Chimney cakes and breakfast    (ChimneyCakes)
 *   4. Find Your Kona quiz            (FindYourKona)
 *   5. Bring Kona Home retail coffee  (BringKonaHome)
 *   6. Café / truck destination       (DestinationCanvas)
 *   7. Kona-origin invitation         (OriginInvitation)
 *   8. Footer (rendered by the root layout, not here)
 *
 * The satellite journey previously opened this page. It now lives at its own
 * address, `/our-kona-journey` — see that route — and nothing here imports
 * it, so its media is never requested by a visitor landing on `/`.
 *
 * `KonaPrinciples` and `SpaceEditorial`, the two sections this replaced, are
 * left on disk unused rather than deleted: the approved order above does not
 * include them, but nothing here asserts they will never return.
 */
export default function HomePage() {
  return (
    <main>
      <LatteHero />
      <SignatureDrinks />
      <ChimneyCakes />
      <FindYourKona />
      <BringKonaHome />
      <DestinationCanvas />
      <OriginInvitation />
    </main>
  )
}
