import type { PosProvider } from '@/lib/types'
import { MockPosProvider } from './mock-provider'

// POS Provider Factory
export class PosProviderFactory {
  static create(provider: string): PosProvider {
    switch (provider) {
      case 'mock':
        return new MockPosProvider({
          baseUrl: process.env.MOCK_POS_URL || 'http://localhost:3001',
          apiKey: process.env.MOCK_POS_API_KEY || 'mock-api-key',
          webhookSecret: process.env.POS_WEBHOOK_SECRET || 'mock-webhook-secret'
        })

      case 'square':
        // Future implementation for Square POS
        throw new Error('Square POS provider not implemented yet')

      case 'toast':
        // Future implementation for Toast POS
        throw new Error('Toast POS provider not implemented yet')

      case 'clover':
        // Future implementation for Clover POS
        throw new Error('Clover POS provider not implemented yet')

      default:
        throw new Error(`Unknown POS provider: ${provider}`)
    }
  }
}

// Global POS instance
let posInstance: PosProvider | null = null

export function getPosProvider(): PosProvider {
  if (!posInstance) {
    const provider = process.env.POS_PROVIDER || 'mock'
    posInstance = PosProviderFactory.create(provider)
  }
  return posInstance
}

// Menu cache management
interface MenuCacheEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menu: any[]
  lastUpdated: Date
  ttl: number
}

class MenuCache {
  private cache: MenuCacheEntry | null = null
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getMenu(pos: PosProvider, forceFresh = false): Promise<any[]> {
    const now = new Date()

    if (!forceFresh && this.cache && this.isValid(now)) {
      console.log('[MenuCache] Returning cached menu')
      return this.cache.menu
    }

    console.log('[MenuCache] Fetching fresh menu from POS')
    try {
      const menu = await pos.getMenu()
      this.cache = {
        menu,
        lastUpdated: now,
        ttl: this.DEFAULT_TTL
      }
      return menu
    } catch (error) {
      console.error('[MenuCache] Failed to fetch menu:', error)

      // Return stale cache if available
      if (this.cache) {
        console.log('[MenuCache] Returning stale cache due to error')
        return this.cache.menu
      }

      throw error
    }
  }

  invalidate(): void {
    console.log('[MenuCache] Cache invalidated')
    this.cache = null
  }

  private isValid(now: Date): boolean {
    if (!this.cache) return false

    const age = now.getTime() - this.cache.lastUpdated.getTime()
    return age < this.cache.ttl
  }
}

export const menuCache = new MenuCache()

// Server-Sent Events for real-time updates
export class PosEventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[PosEventEmitter] Error in callback for event ${event}:`, error)
        }
      })
    }
  }

  // Handle webhook events and emit to subscribers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleWebhookEvent(event: string, data: any): void {
    console.log(`[PosEventEmitter] Handling webhook event: ${event}`)

    switch (event) {
      case 'inventory.updated':
        this.emit('inventory:update', data.items)
        break

      case 'price.updated':
        this.emit('price:update', {
          posExternalId: data.posExternalId,
          price: data.price
        })
        break

      case 'item.created':
      case 'item.updated':
      case 'item.archived':
        // Invalidate menu cache on item changes
        menuCache.invalidate()
        this.emit('menu:changed', { event, data })
        break

      default:
        console.log(`[PosEventEmitter] Unknown event type: ${event}`)
    }
  }
}

export const posEventEmitter = new PosEventEmitter()

// Webhook signature verification
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return signature === `sha256=${expectedSignature}`
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}

// Webhook timestamp validation (prevent replay attacks)
export function isWebhookTimestampValid(
  timestamp: string,
  toleranceMs: number = 300000 // 5 minutes
): boolean {
  try {
    const webhookTime = new Date(timestamp).getTime()
    const now = Date.now()
    const diff = Math.abs(now - webhookTime)

    return diff <= toleranceMs
  } catch (error) {
    console.error('Invalid webhook timestamp:', error)
    return false
  }
}