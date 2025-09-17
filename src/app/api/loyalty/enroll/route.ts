import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, phone } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Check if customer already exists
    // 2. Create customer record in database
    // 3. Initialize loyalty account in POS system
    // 4. Send welcome email

    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log(`[Loyalty API] Enrolling customer: ${email} (ID: ${customerId})`)

    // Mock customer creation
    const customer = {
      id: customerId,
      email,
      name,
      phone,
      loyaltyPoints: 0,
      enrolledAt: new Date().toISOString(),
      preferences: {}
    }

    return NextResponse.json({
      success: true,
      customer,
      message: `Welcome to the Kona Island Coffee ʻohana, ${name}!`
    }, { status: 201 })

  } catch (error) {
    console.error('[Loyalty API] Error enrolling customer:', error)
    return NextResponse.json(
      { error: 'Failed to enroll in loyalty program' },
      { status: 500 }
    )
  }
}