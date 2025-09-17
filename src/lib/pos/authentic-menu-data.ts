import type { MenuItem } from '@/lib/types'

// Authentic Kona Island Coffee Menu Data
export const authenticMenu: MenuItem[] = [
  // Hot Coffee
  {
    id: "kona-medium-roast",
    posExternalId: "ASIHHJWNAOBPULTIBJTPIOAY",
    name: "100% Kona Medium Roast",
    description: "Medium roast Kona coffee",
    price: { amount: 5.45, currency: "USD" },
    category: "hot-coffee",
    image: "/images/kona-coffee-beans.jpg",
    tags: ["100%-kona", "medium-roast", "signature"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (8oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (12oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (16oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 50,
    isPopular: true
  },
  {
    id: "kona-hazelnut",
    posExternalId: "GUCNFK4VJ32ZXREKLOQIL7WC",
    name: "100% Kona Hazelnut Coffee",
    description: "Medium-dark roast hazelnut-flavored coffee",
    price: { amount: 5.75, currency: "USD" },
    category: "hot-coffee",
    image: "/images/kona-hazelnut.jpg",
    tags: ["100%-kona", "hazelnut", "flavored"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (8oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (12oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (16oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 30
  },
  {
    id: "americano-hot",
    posExternalId: "E3J6JZPU3J34WO2CHMVNGJSM",
    name: "Americano (HOT)",
    description: "Double shot of Kona espresso with hot water",
    price: { amount: 5.25, currency: "USD" },
    category: "hot-coffee",
    image: "/images/americano.jpg",
    tags: ["espresso", "americano", "double-shot"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (8oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (12oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (16oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 40
  },

  // Hot Specialty Drinks
  {
    id: "kona-island-latte-hot",
    posExternalId: "KONAISLATTE001",
    name: "Kona Island Latte (HOT)",
    description: "Double shots of Kona espresso, macadamia with a hint of coconut",
    price: { amount: 6.49, currency: "USD" },
    category: "hot-specialties",
    image: "/images/kona-island-latte.jpg",
    tags: ["signature", "macadamia", "coconut", "latte"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (8oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (12oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (16oz)", priceAdjustment: 1.00, available: true }
        ]
      },
      {
        id: "milk",
        name: "Milk Choice",
        type: "milk",
        required: false,
        options: [
          { id: "whole", name: "Whole Milk", priceAdjustment: 0, available: true },
          { id: "almond", name: "Almond Milk", priceAdjustment: 0.60, available: true },
          { id: "oat", name: "Oat Milk", priceAdjustment: 0.60, available: true },
          { id: "coconut", name: "Coconut Milk", priceAdjustment: 0.60, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 35,
    isPopular: true
  },
  {
    id: "fancy-latte-hot",
    posExternalId: "QEX2NTB55TUUDC6VEA7YYR3W",
    name: "Fancy Latte (HOT)",
    description: "Double shots of Kona espresso, roasted marshmallow and lavender with oat milk",
    price: { amount: 6.95, currency: "USD" },
    category: "hot-specialties",
    image: "/images/fancy-latte.jpg",
    tags: ["signature", "marshmallow", "lavender", "oat-milk"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (8oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (12oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (16oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 25,
    isNew: true
  },
  {
    id: "hilo-latte-ube-hot",
    posExternalId: "GXFRWRGTPAWEE7EU6G3LFXQD",
    name: "Hilo Latte (UBE) (HOT)",
    description: "Double shots of Kona espresso, ube/taro, milk. Topped with coconut flakes.",
    price: { amount: 6.75, currency: "USD" },
    category: "hot-specialties",
    image: "/images/hilo-ube-latte.jpg",
    tags: ["signature", "ube", "taro", "coconut"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (8oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (12oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (16oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 30,
    isSeasonal: true
  },

  // Cold Coffee
  {
    id: "iced-kona-island-latte",
    posExternalId: "BSBMLT7XDKGWNCLFLWJFOZXR",
    name: "(iced) Kona Island Latte",
    description: "Double shots of Kona espresso. macadamia with a hint of coconut.",
    price: { amount: 6.95, currency: "USD" },
    category: "cold-coffee",
    image: "/images/iced-kona-island-latte.jpg",
    tags: ["signature", "iced", "macadamia", "coconut"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (12oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (16oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (20oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 40,
    isPopular: true
  },
  {
    id: "iced-fancy-latte",
    posExternalId: "HZALL72LMHQQDNVZJRM5RKXS",
    name: "(iced) Fancy Latte",
    description: "Double shots of Kona espresso, roasted marshmallow, lavender with oat milk.",
    price: { amount: 7.49, currency: "USD" },
    category: "cold-coffee",
    image: "/images/iced-fancy-latte.jpg",
    tags: ["signature", "iced", "marshmallow", "lavender"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (12oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (16oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (20oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 30,
    isNew: true
  },
  {
    id: "iced-hilo-latte-ube",
    posExternalId: "GTHOM7LESGZEPQTIYOJUB5SU",
    name: "Iced Hilo Latte (UBE)",
    description: "Double shots of Kona espresso, ube/taro, milk. Topped with ube/taro whipped cream and coconut flakes.",
    price: { amount: 7.49, currency: "USD" },
    category: "cold-coffee",
    image: "/images/iced-hilo-ube.jpg",
    tags: ["signature", "iced", "ube", "taro"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (12oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (16oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (20oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 25,
    isSeasonal: true
  },
  {
    id: "iced-kamoa-mocha",
    posExternalId: "MYTWXYUGC4LW2EAREJSZKXUB",
    name: "(iced) Kamoa Mocha",
    description: "Double shots of Kona espresso, raspberry, dark chocolate with coconut whipped cream.",
    price: { amount: 7.25, currency: "USD" },
    category: "cold-coffee",
    image: "/images/iced-kamoa-mocha.jpg",
    tags: ["mocha", "raspberry", "chocolate", "iced"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (12oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (16oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (20oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 35
  },

  // Non-Coffee
  {
    id: "haupia-matcha-latte-iced",
    posExternalId: "U243EBXTAVOLEGGHTOYWCVA3",
    name: "(iced) Haupia Matcha Latte",
    description: "Coconut green tea with milk and dried strawberries",
    price: { amount: 6.95, currency: "USD" },
    category: "non-coffee",
    image: "/images/haupia-matcha.jpg",
    tags: ["matcha", "coconut", "strawberries", "non-coffee"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (12oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (16oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (20oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 20,
    isPopular: true
  },
  {
    id: "hot-chocolate",
    posExternalId: "J6TXUHADMVNI6FJPPJYMGAJT",
    name: "Hot Chocolate",
    description: "Hot chocolate with coconut whipped cream",
    price: { amount: 4.75, currency: "USD" },
    category: "non-coffee",
    image: "/images/hot-chocolate.jpg",
    tags: ["hot-chocolate", "coconut", "whipped-cream"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "small", name: "Small (8oz)", priceAdjustment: 0, available: true },
          { id: "medium", name: "Medium (12oz)", priceAdjustment: 0.50, available: true },
          { id: "large", name: "Large (16oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 30
  },

  // Food
  {
    id: "maui-creme-brulee-crepe",
    posExternalId: "MAUI-CREPE-001",
    name: "Maui (crème brûlée crepe)",
    description: "Fresh strawberries and pistachio nuts with custard creme. Topped with coconut whipped cream and crème brûlée.",
    price: { amount: 14.75, currency: "USD" },
    category: "food",
    image: "/images/maui-crepe.jpg",
    tags: ["crepe", "creme-brulee", "strawberries", "pistachio"],
    modifiers: [],
    inStock: true,
    quantity: 15,
    isPopular: true
  },
  {
    id: "oahu-nutella-crepe",
    posExternalId: "OAHU-CREPE-001",
    name: "O'ahu (Nutella crepe)",
    description: "Your choice of fresh strawberries or banana with Nutella spread. Topped with macadamia nut, coconut whipped cream. and chocolate sauce.",
    price: { amount: 14.49, currency: "USD" },
    category: "food",
    image: "/images/oahu-crepe.jpg",
    tags: ["crepe", "nutella", "strawberries", "banana"],
    modifiers: [
      {
        id: "fruit-choice",
        name: "Fruit Choice",
        type: "choice",
        required: true,
        options: [
          { id: "strawberries", name: "Fresh Strawberries", priceAdjustment: 0, available: true },
          { id: "banana", name: "Fresh Banana", priceAdjustment: 0, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 12,
    isPopular: true
  },
  {
    id: "haupia-chia-pudding",
    posExternalId: "RUNTBXYG5HANX4DEQIOWDO3M",
    name: "Haupia Chia Pudding",
    description: "Haupia Chia Pudding, mango spread, and fresh fruits",
    price: { amount: 7.99, currency: "USD" },
    category: "food",
    image: "/images/haupia-chia-pudding.jpg",
    tags: ["healthy", "chia", "haupia", "mango"],
    modifiers: [],
    inStock: true,
    quantity: 20
  },

  // Smoothies
  {
    id: "tropical-bliss",
    posExternalId: "TROPICAL-001",
    name: "Tropical bliss",
    description: "Pineapple, banana, and island tropical flavors.",
    price: { amount: 7.99, currency: "USD" },
    category: "smoothies",
    image: "/images/tropical-bliss.jpg",
    tags: ["smoothie", "tropical", "pineapple", "banana"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "medium", name: "Medium (16oz)", priceAdjustment: 0, available: true },
          { id: "large", name: "Large (20oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 25,
    isPopular: true
  },
  {
    id: "strawberry-banana",
    posExternalId: "STRAWBERRY-BANANA-001",
    name: "Strawberry banana",
    description: "Fresh Strawberry, fresh banana, and milk.",
    price: { amount: 7.99, currency: "USD" },
    category: "smoothies",
    image: "/images/strawberry-banana.jpg",
    tags: ["smoothie", "strawberry", "banana", "fresh"],
    modifiers: [
      {
        id: "size",
        name: "Size",
        type: "size",
        required: true,
        options: [
          { id: "medium", name: "Medium (16oz)", priceAdjustment: 0, available: true },
          { id: "large", name: "Large (20oz)", priceAdjustment: 1.00, available: true }
        ]
      }
    ],
    inStock: true,
    quantity: 20
  }
]