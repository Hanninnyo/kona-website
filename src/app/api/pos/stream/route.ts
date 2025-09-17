import { NextRequest } from 'next/server'
import { posEventEmitter } from '@/lib/pos'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const data = `data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`
      controller.enqueue(encoder.encode(data))

      // Subscribe to POS events
      const unsubscribeInventory = posEventEmitter.subscribe('inventory:update', (items) => {
        const data = `data: ${JSON.stringify({ type: 'inventory:update', items })}\n\n`
        controller.enqueue(encoder.encode(data))
      })

      const unsubscribePrice = posEventEmitter.subscribe('price:update', (priceData) => {
        const data = `data: ${JSON.stringify({ type: 'price:update', ...priceData })}\n\n`
        controller.enqueue(encoder.encode(data))
      })

      const unsubscribeMenu = posEventEmitter.subscribe('menu:changed', (menuData) => {
        const data = `data: ${JSON.stringify({ type: 'menu:changed', ...menuData })}\n\n`
        controller.enqueue(encoder.encode(data))
      })

      const unsubscribeOrder = posEventEmitter.subscribe('order:update', (orderData) => {
        const data = `data: ${JSON.stringify({ type: 'order:update', ...orderData })}\n\n`
        controller.enqueue(encoder.encode(data))
      })

      // Keep connection alive with periodic heartbeat
      const heartbeat = setInterval(() => {
        const data = `data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`
        controller.enqueue(encoder.encode(data))
      }, 30000) // Every 30 seconds

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        console.log('[SSE] Client disconnected')
        clearInterval(heartbeat)
        unsubscribeInventory()
        unsubscribePrice()
        unsubscribeMenu()
        unsubscribeOrder()
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    }
  })
}