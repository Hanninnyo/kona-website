"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { MenuItem, CartItem, Cart, ModifierOption } from '@/lib/types'

// Extended cart item type to include UI-specific fields
interface CartItemWithMeta extends CartItem {
  updatedAt: Date
}

// Cart state interface
interface CartState {
  items: CartItemWithMeta[]
  subtotal: number
  tax: number
  tip: number
  tipPercentage: number
  total: number
  specialInstructions?: string
  appliedGiftCard?: {
    code: string
    amount: number
  }
  appliedLoyaltyPoints?: {
    points: number
    discount: number
  }
}

// Cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; selectedModifiers: { [modifierId: string]: ModifierOption[] }; quantity: number; notes?: string } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'UPDATE_ITEM_NOTES'; payload: { itemId: string; notes: string } }
  | { type: 'SET_TIP'; payload: { amount: number; percentage: number } }
  | { type: 'SET_SPECIAL_INSTRUCTIONS'; payload: string }
  | { type: 'APPLY_GIFT_CARD'; payload: { code: string; amount: number } }
  | { type: 'REMOVE_GIFT_CARD' }
  | { type: 'APPLY_LOYALTY_POINTS'; payload: { points: number; discount: number } }
  | { type: 'REMOVE_LOYALTY_POINTS' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE_CART'; payload: CartState }

// Tax rate (8% for Bay Area)
const TAX_RATE = 0.08

// Calculate item price including modifiers
function calculateItemPrice(menuItem: MenuItem, selectedModifiers: { [modifierId: string]: ModifierOption[] }): number {
  let price = menuItem.price.amount

  // Add modifier price adjustments
  Object.values(selectedModifiers).forEach(options => {
    options.forEach(option => {
      price += option.priceAdjustment
    })
  })

  return price
}

// Calculate cart totals
function calculateTotals(state: CartState): CartState {
  // Calculate subtotal from items
  const subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0)

  // Calculate tax
  const tax = subtotal * TAX_RATE

  // Calculate total (subtotal + tax + tip - discounts)
  let total = subtotal + tax + state.tip

  // Apply gift card discount
  if (state.appliedGiftCard) {
    total -= state.appliedGiftCard.amount
  }

  // Apply loyalty points discount
  if (state.appliedLoyaltyPoints) {
    total -= state.appliedLoyaltyPoints.discount
  }

  // Ensure total doesn't go below 0
  total = Math.max(0, total)

  return {
    ...state,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

// Initial state
const initialState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  tip: 0,
  tipPercentage: 0,
  total: 0,
}

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, selectedModifiers, quantity, notes } = action.payload

      // Calculate price for this specific item with modifiers
      const itemPrice = calculateItemPrice(menuItem, selectedModifiers)
      const totalPrice = itemPrice * quantity

      // Check if identical item already exists (same item, same modifiers, same notes)
      const existingItemIndex = state.items.findIndex(item => {
        const sameItem = item.menuItem.id === menuItem.id
        const sameNotes = item.notes === notes
        const sameModifiers = JSON.stringify(item.selectedModifiers) === JSON.stringify(selectedModifiers)
        return sameItem && sameNotes && sameModifiers
      })

      let newItems: CartItemWithMeta[]

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + quantity
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: Math.round(itemPrice * newQuantity * 100) / 100,
              updatedAt: new Date(),
            }
          }
          return item
        })
      } else {
        // Add new item
        const newItem: CartItemWithMeta = {
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          menuItem,
          selectedModifiers,
          quantity,
          notes,
          totalPrice: Math.round(totalPrice * 100) / 100,
          updatedAt: new Date(),
        }
        newItems = [...state.items, newItem]
      }

      return calculateTotals({ ...state, items: newItems })
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.itemId)
      return calculateTotals({ ...state, items: newItems })
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload

      // Remove item if quantity is 0 or less
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== itemId)
        return calculateTotals({ ...state, items: newItems })
      }

      const newItems = state.items.map(item => {
        if (item.id === itemId) {
          const itemPrice = calculateItemPrice(item.menuItem, item.selectedModifiers)
          return {
            ...item,
            quantity,
            totalPrice: Math.round(itemPrice * quantity * 100) / 100,
            updatedAt: new Date(),
          }
        }
        return item
      })

      return calculateTotals({ ...state, items: newItems })
    }

    case 'UPDATE_ITEM_NOTES': {
      const { itemId, notes } = action.payload
      const newItems = state.items.map(item => {
        if (item.id === itemId) {
          return { ...item, notes, updatedAt: new Date() }
        }
        return item
      })
      return { ...state, items: newItems }
    }

    case 'SET_TIP': {
      const { amount, percentage } = action.payload
      const newState = {
        ...state,
        tip: Math.round(amount * 100) / 100,
        tipPercentage: percentage,
      }
      return calculateTotals(newState)
    }

    case 'SET_SPECIAL_INSTRUCTIONS': {
      return { ...state, specialInstructions: action.payload }
    }

    case 'APPLY_GIFT_CARD': {
      const newState = {
        ...state,
        appliedGiftCard: {
          code: action.payload.code,
          amount: Math.round(action.payload.amount * 100) / 100,
        },
      }
      return calculateTotals(newState)
    }

    case 'REMOVE_GIFT_CARD': {
      const { appliedGiftCard, ...rest } = state
      return calculateTotals(rest)
    }

    case 'APPLY_LOYALTY_POINTS': {
      const newState = {
        ...state,
        appliedLoyaltyPoints: {
          points: action.payload.points,
          discount: Math.round(action.payload.discount * 100) / 100,
        },
      }
      return calculateTotals(newState)
    }

    case 'REMOVE_LOYALTY_POINTS': {
      const { appliedLoyaltyPoints, ...rest } = state
      return calculateTotals(rest)
    }

    case 'CLEAR_CART': {
      return initialState
    }

    case 'HYDRATE_CART': {
      return action.payload
    }

    default:
      return state
  }
}

// Context
interface CartContextValue {
  state: CartState
  addItem: (menuItem: MenuItem, selectedModifiers: { [modifierId: string]: ModifierOption[] }, quantity: number, notes?: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  updateItemNotes: (itemId: string, notes: string) => void
  setTip: (amount: number, percentage: number) => void
  setSpecialInstructions: (instructions: string) => void
  applyGiftCard: (code: string, amount: number) => void
  removeGiftCard: () => void
  applyLoyaltyPoints: (points: number, discount: number) => void
  removeLoyaltyPoints: () => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

// Provider props
interface CartProviderProps {
  children: React.ReactNode
}

// Storage key
const CART_STORAGE_KEY = 'kona-cart-state'

// Provider component
export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Hydrate cart from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedCart = sessionStorage.getItem(CART_STORAGE_KEY)
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart)
          // Convert date strings back to Date objects
          parsedCart.items = parsedCart.items.map((item: any) => ({
            ...item,
            updatedAt: new Date(item.updatedAt),
          }))
          dispatch({ type: 'HYDRATE_CART', payload: parsedCart })
        }
      } catch (error) {
        console.error('[Cart] Failed to hydrate cart from storage:', error)
      }
    }
  }, [])

  // Persist cart to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
      } catch (error) {
        console.error('[Cart] Failed to persist cart to storage:', error)
      }
    }
  }, [state])

  // Actions
  const addItem = useCallback((
    menuItem: MenuItem,
    selectedModifiers: { [modifierId: string]: ModifierOption[] },
    quantity: number,
    notes?: string
  ) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, selectedModifiers, quantity, notes } })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } })
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })
  }, [])

  const updateItemNotes = useCallback((itemId: string, notes: string) => {
    dispatch({ type: 'UPDATE_ITEM_NOTES', payload: { itemId, notes } })
  }, [])

  const setTip = useCallback((amount: number, percentage: number) => {
    dispatch({ type: 'SET_TIP', payload: { amount, percentage } })
  }, [])

  const setSpecialInstructions = useCallback((instructions: string) => {
    dispatch({ type: 'SET_SPECIAL_INSTRUCTIONS', payload: instructions })
  }, [])

  const applyGiftCard = useCallback((code: string, amount: number) => {
    dispatch({ type: 'APPLY_GIFT_CARD', payload: { code, amount } })
  }, [])

  const removeGiftCard = useCallback(() => {
    dispatch({ type: 'REMOVE_GIFT_CARD' })
  }, [])

  const applyLoyaltyPoints = useCallback((points: number, discount: number) => {
    dispatch({ type: 'APPLY_LOYALTY_POINTS', payload: { points, discount } })
  }, [])

  const removeLoyaltyPoints = useCallback(() => {
    dispatch({ type: 'REMOVE_LOYALTY_POINTS' })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  // Calculate item count
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0)

  const value: CartContextValue = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    updateItemNotes,
    setTip,
    setSpecialInstructions,
    applyGiftCard,
    removeGiftCard,
    applyLoyaltyPoints,
    removeLoyaltyPoints,
    clearCart,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Export types for use in other components
export type { CartState, CartItemWithMeta }
