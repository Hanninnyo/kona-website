import { NextRequest, NextResponse } from 'next/server'
import { posEventEmitter, verifyWebhookSignature, isWebhookTimestampValid } from '@/lib/pos'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature') || ''
    const timestamp = request.headers.get('x-timestamp') || ''

    // Verify webhook signature
    const webhookSecret = process.env.POS_WEBHOOK_SECRET || 'mock-webhook-secret'
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('[Webhook] Invalid signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Verify timestamp to prevent replay attacks
    if (!isWebhookTimestampValid(timestamp)) {
      console.error('[Webhook] Invalid or expired timestamp')
      return NextResponse.json(
        { error: 'Invalid timestamp' },
        { status: 400 }
      )
    }

    const payload = JSON.parse(body)
    const { event, ...data } = payload

    console.log(`[Webhook] Received event: ${event}`)

    // Handle different webhook events
    switch (event) {
      case 'inventory.updated':
        posEventEmitter.handleWebhookEvent(event, data)
        break

      case 'price.updated':
        posEventEmitter.handleWebhookEvent(event, data)
        break

      case 'item.created':
      case 'item.updated':
      case 'item.archived':
        posEventEmitter.handleWebhookEvent(event, data)
        break

      case 'order.updated':
        posEventEmitter.handleWebhookEvent(event, data)
        break

      default:
        console.log(`[Webhook] Unhandled event type: ${event}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
}