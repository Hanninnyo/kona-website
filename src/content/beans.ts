/**
 * Bring Kona Home — retail bean pricing, owner-confirmed.
 *
 * No package photography exists for any of these (checked against both
 * supplied image packages and the existing repository — none contain a bean
 * bag), so none is rendered here.
 *
 * The purchase path is owner-confirmed: retail bags are sold through the
 * Mountain View Square ordering account, pickup at the Mountain View café
 * only — not through the truck's ordering account, and no shipping or
 * delivery is claimed because the Square destination itself does not offer
 * either. The action links straight to `orderingUrls.mountainView`
 * (`src/content/site.ts`), never a second, duplicate URL.
 *
 * Chocolate Macadamia and Hazelnut are flavored 100% Kona coffees — the
 * flavor is added, not a naturally occurring note — per the existing,
 * owner-verified description in `discovery.ts`, which is the basis for
 * grouping them under "100% Kona Coffees" here rather than separately.
 * Kauaʻi Decaf is Hawaiian coffee, not Kona, and is grouped apart.
 */
import { orderingUrls } from './site'

export interface BeanPrice {
  size: string
  amount: number
}

export interface Bean {
  id: string
  name: string
  classification: '100% Kona' | 'Hawaiian, not Kona'
  /**
   * A factual descriptor line — origin, roast and any added flavor — never a
   * tasting note (acidity, body, aroma, sweetness, fruit or chocolate
   * character). None of those has been owner-confirmed for any bean here, so
   * none is implied. Kauaʻi Decaf omits a roast level for the same reason.
   */
  descriptor: string
  prices: BeanPrice[]
}

export const beans: Bean[] = [
  {
    id: 'private-estate',
    name: 'Private Estate',
    classification: '100% Kona',
    descriptor: '100% Kona · Medium roast',
    prices: [
      { size: '8 oz', amount: 38 },
      { size: '1 lb', amount: 70 },
    ],
  },
  {
    id: 'peaberry',
    name: 'Peaberry',
    classification: '100% Kona',
    descriptor: '100% Kona · Medium roast · Rare peaberry selection',
    prices: [
      { size: '8 oz', amount: 46 },
      { size: '1 lb', amount: 84 },
    ],
  },
  {
    id: 'chocolate-macadamia',
    name: 'Chocolate Macadamia',
    classification: '100% Kona',
    descriptor: 'Flavored 100% Kona · Chocolate and macadamia',
    prices: [
      { size: '8 oz', amount: 40 },
      { size: '1 lb', amount: 75 },
    ],
  },
  {
    id: 'hazelnut',
    name: 'Hazelnut',
    classification: '100% Kona',
    descriptor: 'Flavored 100% Kona · Hazelnut',
    prices: [
      { size: '8 oz', amount: 40 },
      { size: '1 lb', amount: 75 },
    ],
  },
  {
    id: 'kauai-decaf',
    name: 'Kauaʻi Decaf',
    classification: 'Hawaiian, not Kona',
    descriptor: 'Hawaiian coffee · Decaffeinated',
    prices: [
      { size: '8 oz', amount: 40 },
      { size: '1 lb', amount: 75 },
    ],
  },
]

export const bringKonaHome = {
  eyebrow: 'Bring Kona Home',
  heading: 'Bring Kona Home',
  intro:
    '100% Kona coffee, grown and roasted on Hawaiʻi Island. For mornings that deserve more than ordinary coffee.',
  groups: [
    { label: '100% Kona Coffees', beanIds: ['private-estate', 'peaberry', 'chocolate-macadamia', 'hazelnut'] },
    { label: 'Hawaiian Decaf', beanIds: ['kauai-decaf'] },
  ],
  availabilityLabel: 'Available for Pickup at Our Mountain View Café',
  // Retail bags are Mountain View pickup only — never the truck's ordering
  // account, and never a shipping/delivery claim the Square destination
  // itself doesn't make.
  action: { label: 'Order Coffee Beans', href: orderingUrls.mountainView },
}
