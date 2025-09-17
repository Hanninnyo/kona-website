import { NextRequest, NextResponse } from 'next/server'
import { getPosProvider } from '@/lib/pos'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, orderId } = body

    if (!code || !orderId) {
      return NextResponse.json(
        { error: 'Gift card code and order ID are required' },
        { status: 400 }
      )
    }

    console.log(`[Gift Card API] Redeeming gift card: ${code} for order: ${orderId}`)

    const pos = getPosProvider()
    const { remainingBalance } = await pos.applyGiftCard(code, orderId)

    return NextResponse.json({
      success: true,
      code,
      orderId,
      remainingBalance,
      message: 'Gift card applied successfully'
    })

  } catch (error) {
    console.error('[Gift Card API] Error redeeming gift card:', error)

    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Invalid gift card code' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to redeem gift card' },
      { status: 500 }
    )
  }
}