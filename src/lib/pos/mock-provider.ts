import { BasePosProvider } from './base-provider'
import { authenticMenu } from './authentic-menu-data'
import type { Order, MenuItem, Money, OrderStatus } from '@/lib/types'

export class MockPosProvider extends BasePosProvider {
  private mockMenu: MenuItem[] = authenticMenu

  private orders: Map<string, Order> = new Map()
  private giftCards: Map<string, { balance: Money; issuedAt: Date }> = new Map()
  private loyaltyBalances: Map<string, number> = new Map()

  async pushOrder(order: Order): Promise<{ posOrderId: string }> {
    return this.retryWithBackoff(async () => {
      const posOrderId = `POS-ORDER-${this.generateIdempotencyKey()}`

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Store the order with POS ID
      const orderWithPosId = { ...order, posOrderId, status: 'confirmed' as OrderStatus }
      this.orders.set(posOrderId, orderWithPosId)

      console.log(`[MockPOS] Order pushed successfully: ${posOrderId}`)

      return { posOrderId }
    })
  }

  async getMenu(): Promise<MenuItem[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200))

    console.log(`[MockPOS] Menu retrieved: ${this.mockMenu.length} items`)
    return [...this.mockMenu]
  }

  async getOrderStatus(posOrderId: string): Promise<OrderStatus> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const order = this.orders.get(posOrderId)
    if (!order) {
      throw new Error(`Order not found: ${posOrderId}`)
    }

    // Simulate order progression
    const now = new Date()
    const orderAge = now.getTime() - order.createdAt.getTime()

    let status: OrderStatus = order.status

    if (orderAge > 10000 && status === 'confirmed') { // 10 seconds
      status = 'preparing'
    } else if (orderAge > 20000 && status === 'preparing') { // 20 seconds
      status = 'ready'
    } else if (orderAge > 30000 && status === 'ready') { // 30 seconds
      status = 'completed'
    }

    // Update order status
    if (status !== order.status) {
      this.orders.set(posOrderId, { ...order, status })
      console.log(`[MockPOS] Order ${posOrderId} status updated to: ${status}`)
    }

    return status
  }

  async issueGiftCard(amount: Money, _recipient: { email: string; name?: string }): Promise<{ giftCardCode: string }> {
    return this.retryWithBackoff(async () => {
      const giftCardCode = `KONA-${this.generateIdempotencyKey().toUpperCase()}`

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))

      this.giftCards.set(giftCardCode, {
        balance: amount,
        issuedAt: new Date()
      })

      console.log(`[MockPOS] Gift card issued: ${giftCardCode} for ${amount.amount} ${amount.currency}`)

      return { giftCardCode }
    })
  }

  async applyGiftCard(code: string, _orderId: string): Promise<{ remainingBalance: Money }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200))

    const giftCard = this.giftCards.get(code)
    if (!giftCard) {
      throw new Error(`Gift card not found: ${code}`)
    }

    // For mock, assume $5 was used
    const usedAmount = Math.min(5.00, giftCard.balance.amount)
    const remainingBalance = {
      amount: giftCard.balance.amount - usedAmount,
      currency: giftCard.balance.currency
    }

    this.giftCards.set(code, {
      ...giftCard,
      balance: remainingBalance
    })

    console.log(`[MockPOS] Gift card ${code} applied: $${usedAmount} used, $${remainingBalance.amount} remaining`)

    return { remainingBalance }
  }

  async recordLoyaltyPoints(customerId: string, orderId: string, points: number): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))

    const currentBalance = this.loyaltyBalances.get(customerId) || 0
    const newBalance = currentBalance + points

    this.loyaltyBalances.set(customerId, newBalance)

    console.log(`[MockPOS] Loyalty points recorded: Customer ${customerId} earned ${points} points (Total: ${newBalance})`)
  }

  async getLoyaltyBalance(customerId: string): Promise<number> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 50))

    const balance = this.loyaltyBalances.get(customerId) || 0
    console.log(`[MockPOS] Loyalty balance for ${customerId}: ${balance} points`)

    return balance
  }

  // Mock-specific methods for testing
  updateItemStock(posExternalId: string, inStock: boolean, quantity?: number): void {
    const item = this.mockMenu.find(item => item.posExternalId === posExternalId)
    if (item) {
      item.inStock = inStock
      if (quantity !== undefined) {
        item.quantity = quantity
      }
      console.log(`[MockPOS] Item ${posExternalId} stock updated: inStock=${inStock}, quantity=${quantity}`)
    }
  }

  updateItemPrice(posExternalId: string, newPrice: Money): void {
    const item = this.mockMenu.find(item => item.posExternalId === posExternalId)
    if (item) {
      item.price = newPrice
      console.log(`[MockPOS] Item ${posExternalId} price updated: ${newPrice.amount} ${newPrice.currency}`)
    }
  }
}