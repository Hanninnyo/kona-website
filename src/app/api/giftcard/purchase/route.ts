import { NextRequest, NextResponse } from 'next/server'
import { getPosProvider } from '@/lib/pos'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'USD', recipient, purchasedBy } = body

    // Validate required fields
    if (!amount || !recipient?.email || !purchasedBy?.email || !purchasedBy?.name) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, recipient.email, purchasedBy.email, purchasedBy.name' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount < 5 || amount > 500) {
      return NextResponse.json(
        { error: 'Gift card amount must be between $5 and $500' },
        { status: 400 }
      )
    }

    console.log(`[Gift Card API] Purchasing gift card: $${amount} for ${recipient.email}`)

    const pos = getPosProvider()
    const { giftCardCode } = await pos.issueGiftCard({ amount, currency }, recipient)

    // In a real application, you would also:
    // 1. Process payment
    // 2. Send email to recipient
    // 3. Store transaction in database

    return NextResponse.json({
      success: true,
      giftCardCode,
      amount: { amount, currency },
      recipient,
      purchasedBy,
      message: 'Gift card purchased successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('[Gift Card API] Error purchasing gift card:', error)
    return NextResponse.json(
      { error: 'Failed to purchase gift card' },
      { status: 500 }
    )
  }
}

// Check gift card balance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Gift card code is required' },
        { status: 400 }
      )
    }

    // For mock implementation, we'll simulate balance check
    // In a real application, this would query the POS system
    const mockBalance = { amount: 25.00, currency: 'USD' }

    return NextResponse.json({
      code,
      balance: mockBalance,
      valid: true
    })

  } catch (error) {
    console.error('[Gift Card API] Error checking gift card balance:', error)
    return NextResponse.json(
      { error: 'Failed to check gift card balance' },
      { status: 500 }
    )
  }
}