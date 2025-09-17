import { NextRequest, NextResponse } from 'next/server'
import { getPosProvider } from '@/lib/pos'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    console.log(`[Order Status API] Checking status for order: ${orderId}`)

    // For this implementation, we assume the orderId is actually the posOrderId
    // In a real app, you'd look up the posOrderId from your database
    const pos = getPosProvider()
    const status = await pos.getOrderStatus(orderId)

    return NextResponse.json({
      orderId,
      status,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Order Status API] Error checking order status:', error)

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to check order status' },
      { status: 500 }
    )
  }
}