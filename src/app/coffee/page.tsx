import type { Metadata } from 'next'
import Image from 'next/image'
import { beans, bringKonaHome } from '@/content/beans'
import { site } from '@/content/site'

export const metadata: Metadata = {
  title: '100% Kona Coffee | Kona Island Coffee',
  description: 'Retail Kona coffee, available for pickup at our Mountain View café.',
}

/**
 * The retail coffee page.
 *
 * Replaces an earlier version that described three farms (Hualalai Estate,
 * Mauna Loa Slopes, Holualoa Village) with invented altitudes, tasting notes
 * and processing methods, plus roast-temperature and brew-ratio tables —
 * none of it owner-confirmed, none of it connected to anything this business
 * actually sells. None of that is preserved; keeping it to minimize the diff
 * would have kept sending visitors to fictional content.
 *
 * The five products and prices here are the same owner-confirmed data the
 * homepage's "Bring Kona Home" section uses (`@/content/beans`), read once
 * rather than duplicated. No package photography exists for any of them, so
 * this stays typography-led, anchored by the one authentic farm photograph
 * already used elsewhere on the site — no placeholder bags, no generated
 * packaging.
 *
 * Purchase path, owner-confirmed: Mountain View pickup only, ordered through
 * the Mountain View Square account. No shipping, delivery, subscription or
 * truck-ordering claim appears, because none is confirmed.
 */
export default function CoffeePage() {
  const mountainView = site.locations.find((l) => l.id === 'mountain-view')!
  const groups = bringKonaHome.groups.map((group) => ({
    ...group,
    beans: group.beanIds.map((id) => beans.find((b) => b.id === id)!),
  }))

  return (
    <main>
      <section className="relative flex min-h-[60svh] items-end overflow-hidden bg-charcoal-900">
        <div className="absolute inset-0">
          <Image
            src="/images/kona-coffee-hero.jpg"
            alt="Kona coffee beans and farm on Hawaiʻi Island."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-charcoal-900/10"
          />
        </div>
        <div className="relative mx-auto w-full max-w-page px-5 pb-16 pt-32 sm:px-8 sm:pb-24">
          <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
            100% Kona Coffee
          </p>
          <h1 className="mt-5 max-w-xl font-display text-display-lg font-light text-sand-50">
            Bring Kona Home
          </h1>
          <p className="mt-6 max-w-md font-body text-lede text-sand-100/85">
            Grown and roasted on Hawaiʻi Island.
          </p>
        </div>
      </section>

      <section aria-labelledby="coffee-products-heading" className="bg-espresso-900 py-24 text-sand-50 sm:py-32">
        <div className="mx-auto max-w-page px-5 sm:px-8">
          <h2 id="coffee-products-heading" className="sr-only">
            Our coffees
          </h2>

          <div className="flex flex-col gap-16">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
                  {group.label}
                </p>
                <ul className="mt-8 grid gap-x-10 gap-y-12 sm:grid-cols-2">
                  {group.beans.map((bean) => (
                    <li key={bean.id} className="border-t border-sand-50/15 pt-6">
                      <h3 className="font-display text-3xl font-light text-sand-50 sm:text-4xl">
                        {bean.name}
                      </h3>
                      <dl className="mt-5 flex flex-col gap-2">
                        {bean.prices.map((price) => (
                          <div
                            key={price.size}
                            className="flex items-baseline justify-between border-b border-sand-50/10 pb-2 font-body"
                          >
                            <dt className="text-sand-100/75">{price.size}</dt>
                            <dd className="text-lg text-sand-50">${price.amount.toFixed(2)}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-4">
            <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-sand-100/60">
              {bringKonaHome.availabilityLabel}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={bringKonaHome.action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-panel border border-sand-50/45 px-8 py-4 font-body text-sm tracking-wide text-sand-50 transition-colors duration-200 hover:border-sand-50 hover:bg-sand-50/10"
              >
                {bringKonaHome.action.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={mountainView.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center rounded-panel border border-sand-50/20 px-8 py-4 font-body text-sm tracking-wide text-sand-100/85 transition-colors duration-200 hover:border-sand-50/45 hover:text-sand-50"
              >
                Visit Mountain View
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
