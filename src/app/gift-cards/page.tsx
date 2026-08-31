import type { Metadata } from 'next'
import { site, giftCardUrls } from '@/content/site'

/**
 * Gift Cards — the entry point every general "Gift Cards" link on the site
 * now points to, instead of straight to a Square checkout.
 *
 * Kona Island Coffee runs two separate Square gift-card programs, one per
 * location, and they are owner-confirmed as not interchangeable: a card
 * bought for the café cannot be redeemed at the truck, and a card bought for
 * the truck cannot be redeemed at the café. Sending a general "buy a gift
 * card" click straight to either Square page — as the footer used to —
 * silently picks one location for the visitor and never mentions the other
 * exists. This page states the distinction before either purchase link, not
 * as a footnote after it, and each restriction sits directly above its
 * button rather than in fine print or a disclosure.
 *
 * No JavaScript, no Square embed, no purchaser data collected here: this
 * page is plain server-rendered markup with two `<a>` tags pointing at the
 * owner-provided Square URLs, so it — and both purchase links — work
 * identically with JS disabled.
 */

export const metadata: Metadata = {
  title: 'Gift Cards | Kona Island Coffee',
  description:
    'Buy a Kona Island Coffee gift card for the Mountain View café or the Kona Coffee Truck. The two programs are separate and not interchangeable.',
}

const mountainView = site.locations.find((l) => l.id === 'mountain-view')!
const coffeeTruck = site.locations.find((l) => l.id === 'coffee-truck')!

export default function GiftCardsPage() {
  return (
    <main className="bg-espresso-900 py-24 sm:py-32">
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
          Gift Kona
        </p>
        <h1 className="mt-5 max-w-2xl font-display text-display-md font-light text-sand-50">
          Choose Where They&rsquo;ll Enjoy It.
        </h1>
        <p className="mt-6 max-w-editorial font-body text-lede text-sand-100/80">
          Our Mountain View café and Kona Coffee Truck use separate gift-card
          systems. Choose the location where the recipient will redeem their
          gift.
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Mountain View Café */}
          <div className="flex flex-col rounded-frame bg-charcoal-900 p-8 sm:p-10">
            <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
              Mountain View Café
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-sand-100/80">
              For drinks, coffee and food purchased at our Mountain View café.
            </p>
            <p className="mt-6 font-body text-sm leading-relaxed text-sand-100/70">
              {mountainView.address.street}, {mountainView.address.unit}
              <br />
              {mountainView.address.city}, {mountainView.address.region}{' '}
              {mountainView.address.postalCode}
            </p>

            <div className="mt-8 flex-1" />

            <p className="font-body text-sm font-medium leading-relaxed text-sand-50">
              Valid only at the Mountain View Café.
              <br />
              Not redeemable at the Kona Coffee Truck.
            </p>
            <a
              href={giftCardUrls.mountainView}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-14 items-center justify-center rounded-panel bg-sand-50 px-7 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
              aria-label="Buy a Café eGift Card, valid only at the Mountain View Café (opens in a new tab)"
            >
              Buy a Café eGift Card
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          {/* Kona Coffee Truck */}
          <div className="flex flex-col rounded-frame bg-charcoal-900 p-8 sm:p-10">
            <p className="font-body text-eyebrow uppercase tracking-[0.18em] text-gold-400">
              Kona Coffee Truck
            </p>
            <p className="mt-4 font-body text-base leading-relaxed text-sand-100/80">
              For purchases made directly from the Kona Coffee Truck.
            </p>
            <dl className="mt-6 flex flex-col gap-2 font-body text-sm leading-relaxed text-sand-100/70">
              {coffeeTruck.schedule?.map((block) => (
                <div key={block.label}>
                  <dt className="text-sand-100/85">{block.label}</dt>
                  <dd>{block.when}</dd>
                  {block.note && <dd className="text-sand-100/50">{block.note}</dd>}
                </div>
              ))}
            </dl>

            <div className="mt-8 flex-1" />

            <p className="font-body text-sm font-medium leading-relaxed text-sand-50">
              Valid only at the Kona Coffee Truck.
              <br />
              Not redeemable at the Mountain View Café.
            </p>
            <a
              href={giftCardUrls.coffeeTruck}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-14 items-center justify-center rounded-panel bg-sand-50 px-7 py-3.5 font-body text-sm text-charcoal-900 transition-colors duration-200 hover:bg-white"
              aria-label="Buy a Truck eGift Card, valid only at the Kona Coffee Truck (opens in a new tab)"
            >
              Buy a Truck eGift Card
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <p className="mt-10 max-w-editorial font-body text-sm leading-relaxed text-sand-100/60">
          Gift cards are location-specific and cannot be transferred or
          redeemed between the café and truck.
        </p>
      </div>
    </main>
  )
}
