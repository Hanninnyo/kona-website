import type { PosProvider, Order, MenuItem, Money, OrderStatus } from '@/lib/types'

export abstract class BasePosProvider implements PosProvider {
  protected baseUrl: string
  protected apiKey: string
  protected webhookSecret: string

  constructor(config: { baseUrl: string; apiKey: string; webhookSecret: string }) {
    this.baseUrl = config.baseUrl
    this.apiKey = config.apiKey
    this.webhookSecret = config.webhookSecret
  }

  abstract pushOrder(order: Order): Promise<{ posOrderId: string }>
  abstract getMenu(): Promise<MenuItem[]>
  abstract getOrderStatus(posOrderId: string): Promise<OrderStatus>
  abstract issueGiftCard(amount: Money, recipient: { email: string; name?: string }): Promise<{ giftCardCode: string }>
  abstract applyGiftCard(code: string, orderId: string): Promise<{ remainingBalance: Money }>
  abstract recordLoyaltyPoints(customerId: string, orderId: string, points: number): Promise<void>
  abstract getLoyaltyBalance(customerId: string): Promise<number>

  acknowledgeWebhook(payload: unknown, signature: string): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const crypto = require('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex')

      return signature === `sha256=${expectedSignature}`
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return false
    }
  }

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`POS API error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  protected generateIdempotencyKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  protected async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error

        if (attempt === maxRetries) {
          break
        }

        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }
}