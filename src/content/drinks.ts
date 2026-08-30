/**
 * Signature drinks — homepage showcase content.
 *
 * Every drink here is a real, owner-confirmed Kona Island Coffee product.
 * `authentic-menu-data.ts` (the repository's POS export) is known to be
 * incomplete: several of these do not appear in it at all, and their absence
 * there is not evidence against them. Ingredients are stated only where the
 * owner gave them explicitly; where they were not given, the descriptor list
 * draws only from the product's own name rather than an invented tasting note.
 *
 * `temperature` is owner-confirmed availability, not an inference from a
 * photograph. A photo may show a drink served one way while the product is
 * sold both ways — Captain Cook, Nutella Latte and Classic Latte are each
 * photographed in only one temperature but are confirmed available in both.
 * Nothing here should ever be corrected by looking at an image again; only by
 * a new owner-confirmed rule.
 *
 * `kona-island-latte` is the one drink pictured only through a still from the
 * approved commercial rather than a dedicated product photograph — noted on
 * the field itself so a future edit does not have to rediscover that.
 *
 * Kamoa Mocha (hot and iced) and Crème Brûlée Latte (iced only) are also
 * owner-confirmed real products, but neither has a supplied photograph, so
 * neither appears below — recorded here only so the availability fact is not
 * lost before photography exists.
 */

export type DrinkId =
  | 'kona-island-latte'
  | 'captain-cook'
  | 'hilo-ube'
  | 'nutella-latte'
  | 'island-coco-refresher'
  | 'blue-hawaii-refresher'
  | 'classic-latte'

export interface Drink {
  id: DrinkId
  name: string
  /** Short, verified descriptors — ingredient words or the name itself, never an invented tasting note. */
  descriptors: string[]
  /** One sentence, drawn only from confirmed ingredients or the product's own name. */
  description: string
  temperature: ('hot' | 'iced')[]
  image: { src: string; alt: string; fromCommercialStill?: boolean }
  /** Shown in the signature-drink showcase's own selector. Kona Island Latte is optional there. */
  inShowcase: boolean
}

export const drinks: Drink[] = [
  {
    id: 'kona-island-latte',
    name: 'Kona Island Latte',
    descriptors: ['Macadamia', 'Coconut', 'Espresso'],
    description:
      '100% Kona espresso, milk, macadamia syrup and coconut syrup, finished with delicate macadamia shavings.',
    temperature: ['hot', 'iced'],
    image: {
      src: '/images/drinks/kona-island-latte.jpg',
      alt: 'An iced Kona Island Latte, macadamia and espresso marbling through the milk, macadamia shavings on top.',
      fromCommercialStill: true,
    },
    inShowcase: true,
  },
  {
    id: 'captain-cook',
    name: 'Captain Cook',
    descriptors: ['Vanilla', 'Honey', 'Cinnamon'],
    description: 'Espresso and milk with vanilla, honey and cinnamon. Available hot or iced.',
    temperature: ['hot', 'iced'],
    image: {
      src: '/images/drinks/captain-cook.jpg',
      alt: 'A hot Captain Cook latte in a paper cup, dusted with cinnamon.',
    },
    inShowcase: true,
  },
  {
    id: 'hilo-ube',
    name: 'Hilo Ube',
    descriptors: ['Ube', 'Espresso', 'Milk'],
    description: 'Espresso and milk with ube.',
    temperature: ['hot', 'iced'],
    image: {
      src: '/images/drinks/hilo-ube.jpg',
      alt: 'An iced Hilo Ube latte, its violet color layered under whipped cream.',
    },
    inShowcase: true,
  },
  {
    id: 'nutella-latte',
    name: 'Nutella Latte',
    descriptors: ['Nutella', 'Espresso', 'Milk'],
    description: 'Espresso and milk with Nutella. Available hot or iced.',
    temperature: ['hot', 'iced'],
    image: {
      src: '/images/drinks/nutella-latte.jpg',
      alt: 'An iced Nutella Latte, chocolate-hazelnut swirled through espresso and milk over ice.',
    },
    inShowcase: true,
  },
  {
    id: 'island-coco-refresher',
    name: 'Island Coco Refresher',
    descriptors: ['Coconut Water', 'Espresso', 'Iced'],
    description: 'Coconut water and espresso, served over ice.',
    temperature: ['iced'],
    image: {
      src: '/images/drinks/island-coco-refresher.jpg',
      alt: 'An Island Coco Refresher, espresso layered over coconut water and ice.',
    },
    inShowcase: true,
  },
  {
    id: 'blue-hawaii-refresher',
    name: 'Blue Hawaii Refresher',
    descriptors: ['Blue Hawaii', 'Refresher', 'Iced'],
    description: 'A Kona Island Coffee refresher, served over ice.',
    temperature: ['iced'],
    image: {
      src: '/images/drinks/blue-hawaii-refresher.jpg',
      alt: 'A Blue Hawaii Refresher, layered blue and orange over ice.',
    },
    inShowcase: true,
  },
  {
    id: 'classic-latte',
    name: 'Classic Latte',
    descriptors: ['Espresso', 'Milk', 'Classic'],
    description: 'Espresso and milk, poured the classic way. Available hot or iced.',
    temperature: ['hot', 'iced'],
    image: {
      src: '/images/drinks/classic-latte.jpg',
      alt: 'A classic hot latte with heart latte art in a paper cup.',
    },
    // Not part of the showcase selector — it exists so the quiz always has a
    // real photographed drink to recommend for a "keep it classic" answer.
    inShowcase: false,
  },
]

export const showcaseDrinks = drinks.filter((drink) => drink.inShowcase)
