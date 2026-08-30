/**
 * Chimney cakes and breakfast — homepage food section content.
 *
 * Location: `KONA_INTERACTIVE_BUILD_SPEC.md` confirms chimney cakes and
 * bakery items as Mountain View café offerings, and separately confirms
 * "chimney cakes at Mountain View rather than crepes" — a direct contrast
 * with the truck's sweet crêpes. No hours or daypart beyond the café's own
 * general hours are confirmed for any item here, so none are claimed.
 *
 * "Freshly made" is not asserted: no repository content confirms a
 * made-to-order or same-day preparation claim for these items, so the copy
 * stays factual rather than descriptive of process.
 *
 * The Nutella Chimney Cake is deliberately absent from this list — the only
 * photograph of it is dark and shot in the prep area, and does not meet the
 * bar for a homepage image even after a restrained local exposure test. It is
 * kept in scratch for a future food or menu page, not wired into anything
 * here.
 */

export interface FoodItem {
  id: string
  name: string
  image: { src: string; alt: string }
  /** True for the one large, dominant photograph; false for supporting items. */
  dominant: boolean
}

export const foodItems: FoodItem[] = [
  {
    id: 'dragonfruit-chimney-cake',
    name: 'Dragonfruit Chimney Cake',
    image: {
      src: '/images/food/dragonfruit-chimney-cake.jpg',
      alt: 'A dragonfruit chimney cake, its stretched spiral lifted from the cup, Kona Island Coffee branding visible.',
    },
    dominant: true,
  },
  {
    id: 'mango-haupia-chia-pudding',
    name: 'Mango Haupia Chia Pudding',
    image: {
      src: '/images/food/mango-haupia-chia-pudding.jpg',
      alt: 'A jar of Mango Haupia Chia Pudding, mango spread over coconut chia pudding, Kona Island Coffee label on the jar.',
    },
    dominant: false,
  },
  {
    id: 'ube-banana-bread',
    name: 'Ube Banana Bread',
    image: {
      src: '/images/food/ube-banana-bread.jpg',
      alt: 'A loaf of Ube Banana Bread.',
    },
    dominant: false,
  },
  {
    id: 'hawaiian-bread',
    name: 'Hawaiian Bread',
    image: {
      src: '/images/food/hawaiian-bread.jpg',
      alt: 'A loaf of Hawaiian Bread.',
    },
    dominant: false,
  },
]

export const chimneyCakeSection = {
  eyebrow: 'More Than Coffee',
  heading: 'Island-Inspired Chimney Cakes and Breakfast',
  intro:
    'Chimney cakes, tropical breakfast jars and island-inspired breads at the Mountain View café.',
  dominantHeading: 'Chimney Cakes',
  dominantCopy: 'Crisp outside. Soft inside. Finished with island-inspired flavors.',
  action: { label: 'Explore Food', href: '/pastries' },
}
