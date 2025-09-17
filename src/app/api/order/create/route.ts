import { NextRequest, NextResponse } from 'next/server'
import { getPosProvider } from '@/lib/pos'
import { generateOrderId } from '@/lib/utils'
import type { Order, OrderStatus } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { customer, items, subtotal, tax, tip, total, orderType, location, paymentMethod } = body

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid order data: customer and items are required' },
        { status: 400 }
      )
    }

    // Create order object
    const order: Order = {
      id: generateOrderId(),
      customer,
      items,
      subtotal: subtotal || 0,
      tax: tax || 0,
      tip: tip || 0,
      total: total || subtotal + tax + tip,
      paymentMethod: paymentMethod || 'card',
      status: 'pending' as OrderStatus,
      orderType: orderType || 'pickup',
      location: location || {
        id: 'main',
        name: 'Main Location',
        address: {
          street: '123 Coffee St',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102'
        },
        coordinates: { lat: 37.7749, lng: -122.4194 },
        phone: '(555) KONA-123',
        hours: {},
        features: []
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      specialInstructions: body.specialInstructions,
      appliedGiftCard: body.appliedGiftCard
    }

    // Calculate estimated ready time (15-25 minutes from now)
    const estimatedMinutes = 15 + Math.floor(Math.random() * 10)
    order.estimatedReadyTime = new Date(Date.now() + estimatedMinutes * 60 * 1000)

    console.log(`[Order API] Creating order: ${order.id}`)

    // Push order to POS
    const pos = getPosProvider()
    const { posOrderId } = await pos.pushOrder(order)

    // Update order with POS ID
    order.posOrderId = posOrderId
    order.status = 'confirmed'

    // Calculate and record loyalty points (1 point per dollar spent)
    if (customer.id) {
      const pointsEarned = Math.floor(order.total)
      order.loyaltyPointsEarned = pointsEarned

      try {
        await pos.recordLoyaltyPoints(customer.id, order.id, pointsEarned)
      } catch (error) {
        console.error('[Order API] Failed to record loyalty points:', error)
        // Don't fail the order if loyalty points fail
      }
    }

    console.log(`[Order API] Order created successfully: ${order.id} (POS: ${posOrderId})`)

    return NextResponse.json({
      order,
      success: true,
      message: 'Order created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('[Order API] Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}