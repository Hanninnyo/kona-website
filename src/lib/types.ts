export interface Money {
  amount: number
  currency: string
}

export interface MenuItem {
  id: string
  posExternalId: string
  name: string
  description: string
  price: Money
  category: MenuCategory
  image?: string
  tags: string[]
  modifiers: Modifier[]
  nutritionInfo?: NutritionInfo
  inStock: boolean
  quantity?: number
  isNew?: boolean
  isPopular?: boolean
  isSeasonal?: boolean
}

export interface Modifier {
  id: string
  name: string
  type: 'size' | 'milk' | 'syrup' | 'extra' | 'preparation'
  options: ModifierOption[]
  required: boolean
  maxSelections?: number
}

export interface ModifierOption {
  id: string
  name: string
  priceAdjustment: number
  available: boolean
}

export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  caffeine?: number
}

export type MenuCategory =
  | 'coffee'
  | 'espresso'
  | 'cold-brew'
  | 'tea'
  | 'seasonal'
  | 'pastries'
  | 'sweet-crepes'
  | 'savory-crepes'

export interface CartItem {
  id: string
  menuItem: MenuItem
  selectedModifiers: { [modifierId: string]: ModifierOption[] }
  quantity: number
  notes?: string
  totalPrice: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  tip: number
  total: number
  appliedGiftCard?: {
    code: string
    amount: number
  }
  appliedLoyaltyPoints?: {
    points: number
    discount: number
  }
}

export interface Customer {
  id: string
  email: string
  name: string
  phone?: string
  loyaltyPoints: number
  preferences?: {
    defaultLocation?: string
    favoriteDrinks?: string[]
  }
}

export interface Order {
  id: string
  posOrderId?: string
  customer: Customer
  items: CartItem[]
  subtotal: number
  tax: number
  tip: number
  total: number
  paymentMethod: string
  status: OrderStatus
  orderType: 'pickup' | 'dine-in'
  location: Store
  estimatedReadyTime?: Date
  createdAt: Date
  updatedAt: Date
  specialInstructions?: string
  loyaltyPointsEarned?: number
  appliedGiftCard?: {
    code: string
    amount: number
  }
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'

export interface Store {
  id: string
  name: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  phone: string
  hours: {
    [key: string]: { open: string; close: string; closed?: boolean }
  }
  features: string[]
  image?: string
}

export interface GiftCard {
  code: string
  balance: Money
  recipient: {
    email: string
    name?: string
  }
  purchasedBy: {
    email: string
    name: string
  }
  expiresAt?: Date
  createdAt: Date
}

export interface LoyaltyTransaction {
  id: string
  customerId: string
  orderId?: string
  points: number
  type: 'earned' | 'redeemed'
  description: string
  createdAt: Date
}

export interface PosProvider {
  pushOrder(order: Order): Promise<{ posOrderId: string }>
  getMenu(): Promise<MenuItem[]>
  getOrderStatus(posOrderId: string): Promise<OrderStatus>
  acknowledgeWebhook(payload: unknown, signature: string): boolean
  issueGiftCard(amount: Money, recipient: { email: string; name?: string }): Promise<{ giftCardCode: string }>
  applyGiftCard(code: string, orderId: string): Promise<{ remainingBalance: Money }>
  recordLoyaltyPoints(customerId: string, orderId: string, points: number): Promise<void>
  getLoyaltyBalance(customerId: string): Promise<number>
}

export interface WebhookEvent {
  event: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  timestamp: string
  signature: string
}

export interface InventoryUpdate {
  posExternalId: string
  inStock: boolean
  quantity?: number
}

export interface PriceUpdate {
  posExternalId: string
  price: Money
}

export interface AnalyticsEvent {
  event: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: Record<string, any>
  timestamp: Date
  sessionId?: string
  userId?: string
}