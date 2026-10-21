import type { Metadata } from 'next'
import { site } from '@/content/site'

/**
 * Menu — the ordering location chooser.
 *
 * This page used to redirect to the Mountain View Square site on a 3-second
 * timer. A customer who tapped "Menu" intending to order from the Coffee
 * Truck was carried to the café's ordering site and ordered from the wrong
 * location. The timer is gone: nothing on this page navigates on its own, and
 * an external ordering site opens only after a deliberate choice.
 *
 * Server-rendered with no JavaScript — two plain `<a>` tags — so both links
 * work identically with JS disabled and there is no client timer that could
 * be reintroduced by accident. With no animation of any kind, there is
 * nothing for prefers-reduced-motion to suppress.
 */

export const metadata: Metadata = {
  title: 'Menu & Ordering | Kona Island Coffee',
  description:
    'Choose the Mountain View café or the Kona Coffee Truck to see its full menu and order ahead. The two locations order separately.',
}

const mountainView = site.locations.find((l) => l.id === 'mountain-view')!
const coffeeTruck = site.locations.find((l) => l.id === 'coffee-truck')!

/**
 * Ordering destinations for this page, stated explicitly.
 *
 * The truck URL is the same one held in `site.ts`. The café URL is the
 * Square storefront specified for this chooser, which is NOT the
 * `orderkonamountainview.com` address `site.ts` uses for "Order Ahead"
 * elsewhere. Kept literal here so the button goes exactly where it was asked
 * to; if the two should be the same, change this one line.
 */
const ORDERING = {
  cafe: 'https://kona-island-coffee-102495.square.site/',
  truck: coffeeTruck.ordering.url,
} as const

/** "STE 84" reads as "Suite 84" in running text. */
function formatUnit(unit: string | undefined): string {
  return (unit ?? '').replace(/^STE\.?\s*/i, 'Suite ')
}

export default function MenuPreviewPage() {
  return (
    <main className="bg-espresso-900 py-24 sm:py-32">
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
          Menu &amp; Ordering
        </p>
        <h1 className="mt-5 max-w-2xl font-display text-display-md font-light text-sand-50">
          Where would you like to order?
        </h1>
        <p className="mt-6 max-w-editorial font-body text-lede text-sand-100/80">
          Choose your Kona Island Coffee location to see its full menu and
          order ahead.
        </p>

        {/* Stacked on phones, two equal columns from `lg`. Both cards use the
            same surface, padding and button treatment so neither reads as the
            default choice. */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Mountain View Café */}
          <div className="flex flex-col rounded-frame bg-charcoal-900 p-8 sm:p-10">
            <h2 className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
              Mountain View Café
            </h2>
            <address className="mt-4 font-body text-base not-italic leading-relaxed text-sand-100/80">
              {mountainView.address.street}, {formatUnit(mountainView.address.unit)}
              <br />
              {mountainView.address.city}, {mountainView.address.region}{' '}
              {mountainView.address.postalCode}
            </address>

            {/* Pushes both buttons to a common baseline when the cards differ
                in height, so they stay visually equal. */}
            <div className="mt-8 flex-1" />

            <a
              href={ORDERING.cafe}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-14 items-center justify-center rounded-panel bg-sand-50 px-7 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
            >
              Order from the Café
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          {/* Kona Coffee Truck */}
          <div className="flex flex-col rounded-frame bg-charcoal-900 p-8 sm:p-10">
            <h2 className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
              Kona Coffee Truck
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-sand-100/80">
              {coffeeTruck.address.unit}
            </p>
            <address className="font-body text-base not-italic leading-relaxed text-sand-100/80">
              {coffeeTruck.address.street}, {coffeeTruck.address.city},{' '}
              {coffeeTruck.address.region} {coffeeTruck.address.postalCode}
            </address>

            {/* Hours read from the verified location record, so the truck's
                times live in one place in the codebase. */}
            {coffeeTruck.schedule && (
              <dl className="mt-5 font-body text-sm leading-relaxed text-sand-100/70">
                {coffeeTruck.schedule.map((block) => (
                  <div key={block.label}>
                    <dt className="inline text-sand-50">{block.label}:</dt>{' '}
                    <dd className="inline">{block.when}</dd>
                    {block.note && (
                      <dd className="mt-2 block text-sand-100/60">{block.note}</dd>
                    )}
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 flex-1" />

            <a
              href={ORDERING.truck}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-14 items-center justify-center rounded-panel bg-sand-50 px-7 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
            >
              Order from the Truck
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
