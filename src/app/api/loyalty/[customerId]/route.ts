import { NextRequest, NextResponse } from 'next/server'
import { getPosProvider } from '@/lib/pos'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    console.log(`[Loyalty API] Getting loyalty balance for customer: ${customerId}`)

    const pos = getPosProvider()
    const loyaltyPoints = await pos.getLoyaltyBalance(customerId)

    // Calculate available rewards (example: 50 points = $5 off)
    const availableRewards = Math.floor(loyaltyPoints / 50)
    const pointsToNextReward = 50 - (loyaltyPoints % 50)

    return NextResponse.json({
      customerId,
      loyaltyPoints,
      availableRewards,
      pointsToNextReward,
      rewardValue: availableRewards * 5, // $5 per reward
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Loyalty API] Error getting loyalty balance:', error)
    return NextResponse.json(
      { error: 'Failed to get loyalty balance' },
      { status: 500 }
    )
  }
}

// Redeem loyalty points
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  try {
    const { customerId } = await params
    const body = await request.json()
    const { pointsToRedeem, orderId } = body

    if (!customerId || !pointsToRedeem || !orderId) {
      return NextResponse.json(
        { error: 'Customer ID, points to redeem, and order ID are required' },
        { status: 400 }
      )
    }

    // Validate points are in increments of 50
    if (pointsToRedeem % 50 !== 0) {
      return NextResponse.json(
        { error: 'Points must be redeemed in increments of 50' },
        { status: 400 }
      )
    }

    console.log(`[Loyalty API] Redeeming ${pointsToRedeem} points for customer: ${customerId}`)

    const pos = getPosProvider()
    const currentBalance = await pos.getLoyaltyBalance(customerId)

    if (currentBalance < pointsToRedeem) {
      return NextResponse.json(
        { error: 'Insufficient loyalty points' },
        { status: 400 }
      )
    }

    // Record negative points to deduct from balance
    await pos.recordLoyaltyPoints(customerId, orderId, -pointsToRedeem)

    const discountAmount = (pointsToRedeem / 50) * 5 // $5 per 50 points
    const newBalance = currentBalance - pointsToRedeem

    return NextResponse.json({
      success: true,
      customerId,
      pointsRedeemed: pointsToRedeem,
      discountAmount,
      newBalance,
      message: `Redeemed ${pointsToRedeem} points for $${discountAmount} off!`
    })

  } catch (error) {
    console.error('[Loyalty API] Error redeeming loyalty points:', error)
    return NextResponse.json(
      { error: 'Failed to redeem loyalty points' },
      { status: 500 }
    )
  }
}