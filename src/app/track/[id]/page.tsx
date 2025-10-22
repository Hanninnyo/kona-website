"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  Coffee,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  Home,
  RefreshCw,
  Package,
  ChefHat
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Link from 'next/link'
import type { Order, OrderStatus } from '@/lib/types'

const TrackOrderPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const prefersReducedMotion = useReducedMotion()

  const [order, setOrder] = useState<Order | null>(null)
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sseConnected, setSSEConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Status progression
  const statusSteps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'ready', label: 'Ready for Pickup', icon: Package },
    { status: 'completed', label: 'Completed', icon: Coffee },
  ]

  // Fetch order details
  const fetchOrderStatus = useCallback(async () => {
    if (!orderId) return

    try {
      const response = await fetch(`/api/order/status/${orderId}`)

      if (!response.ok) {
        throw new Error('Order not found')
      }

      const data = await response.json()

      if (data.order) {
        setOrder(data.order)
        setCurrentStatus(data.order.status)
        setLastUpdate(new Date())
      }

      setLoading(false)
    } catch (err) {
      console.error('[Track] Error fetching order:', err)
      setError(err instanceof Error ? err.message : 'Failed to load order')
      setLoading(false)
    }
  }, [orderId])

  // Connect to SSE stream for real-time updates
  useEffect(() => {
    if (!orderId) return

    // Initial fetch
    fetchOrderStatus()

    // Connect to SSE stream
    let eventSource: EventSource | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null
    let pollingInterval: NodeJS.Timeout | null = null

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/pos/stream')

        eventSource.onopen = () => {
          console.log('[Track] SSE connected')
          setSSEConnected(true)
        }

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            if (data.type === 'order:update' && data.orderId === orderId) {
              console.log('[Track] Order update received:', data)
              setCurrentStatus(data.status)
              setLastUpdate(new Date())

              // Optionally refetch full order details
              fetchOrderStatus()
            }
          } catch (err) {
            console.error('[Track] Error parsing SSE message:', err)
          }
        }

        eventSource.onerror = () => {
          console.error('[Track] SSE connection error')
          setSSEConnected(false)
          eventSource?.close()

          // Attempt to reconnect after 5 seconds
          reconnectTimeout = setTimeout(() => {
            console.log('[Track] Attempting SSE reconnection...')
            connectSSE()
          }, 5000)
        }
      } catch (err) {
        console.error('[Track] Failed to establish SSE connection:', err)
        setSSEConnected(false)
      }
    }

    // Try SSE first
    connectSSE()

    // Fallback to polling every 5 seconds if SSE is not connected
    pollingInterval = setInterval(() => {
      if (!sseConnected) {
        console.log('[Track] Polling for updates (SSE not connected)')
        fetchOrderStatus()
      }
    }, 5000)

    // Cleanup
    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [orderId, fetchOrderStatus, sseConnected])

  // Get status index
  const currentStepIndex = statusSteps.findIndex(step => step.status === currentStatus)

  // Time since last update
  const [timeSinceUpdate, setTimeSinceUpdate] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000)
      if (seconds < 60) {
        setTimeSinceUpdate(`${seconds}s ago`)
      } else {
        const minutes = Math.floor(seconds / 60)
        setTimeSinceUpdate(`${minutes}m ago`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastUpdate])

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-kona-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-kona-brown mx-auto mb-4 animate-spin" />
          <p className="text-kona-espresso">Loading your order...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !order) {
    return (
      <div className="pt-20 min-h-screen bg-kona-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <Card className="max-w-2xl mx-auto shadow-kona-soft">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="font-league-spartan text-2xl font-bold text-kona-espresso mb-2">
                Order Not Found
              </h2>
              <p className="text-kona-espresso/70 mb-6">
                {error || "We couldn't find an order with that ID"}
              </p>
              <Button variant="aloha" asChild>
                <Link href="/menu">
                  <Home className="mr-2 w-5 h-5" />
                  Return to Menu
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-kona-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-2">
            Track Your Order
          </h1>
          <p className="text-kona-espresso/70">
            Order ID: <span className="font-mono font-semibold">{order.id}</span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-kona-espresso/60">
            <div className={`w-2 h-2 rounded-full ${sseConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{sseConnected ? 'Real-time updates active' : 'Polling for updates'}</span>
            <span>•</span>
            <span>Updated {timeSinceUpdate}</span>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="shadow-kona-medium">
              <CardHeader>
                <CardTitle className="text-xl text-kona-espresso">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex
                    const Icon = step.icon

                    return (
                      <motion.div
                        key={step.status}
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                              isCompleted
                                ? 'bg-kona-teal text-white'
                                : 'bg-kona-taupe/30 text-kona-espresso/50'
                            }`}
                          >
                            {isCurrent && !prefersReducedMotion ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              >
                                <Icon className="w-6 h-6" />
                              </motion.div>
                            ) : (
                              <Icon className="w-6 h-6" />
                            )}
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div
                              className={`absolute left-1/2 top-full w-0.5 h-8 -translate-x-1/2 transition-colors ${
                                index < currentStepIndex ? 'bg-kona-teal' : 'bg-kona-taupe/30'
                              }`}
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <h3
                            className={`font-league-spartan font-semibold ${
                              isCompleted ? 'text-kona-espresso' : 'text-kona-espresso/50'
                            }`}
                          >
                            {step.label}
                          </h3>
                          {isCurrent && (
                            <p className="text-sm text-kona-espresso/60">In progress...</p>
                          )}
                          {isCompleted && !isCurrent && (
                            <p className="text-sm text-green-600">✓ Complete</p>
                          )}
                        </div>

                        {isCurrent && (
                          <Badge variant="popular" className="animate-pulse">
                            Current
                          </Badge>
                        )}
                      </motion.div>
                    )
                  })}
                </div>

                {/* Estimated Time */}
                {order.estimatedReadyTime && currentStatus !== 'completed' && (
                  <div className="mt-6 p-4 bg-kona-teal/10 border border-kona-teal/30 rounded-kona">
                    <div className="flex items-center gap-2 text-kona-espresso">
                      <Clock className="w-5 h-5 text-kona-teal" />
                      <div>
                        <p className="font-semibold">Estimated Ready Time</p>
                        <p className="text-sm text-kona-espresso/70">
                          {new Date(order.estimatedReadyTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-kona-soft">
              <CardHeader>
                <CardTitle className="text-xl text-kona-espresso">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start pb-3 border-b border-kona-taupe/20 last:border-0">
                      <div className="flex-1">
                        <p className="font-semibold text-kona-espresso">
                          {item.quantity}× {item.menuItem.name}
                        </p>
                        {item.notes && (
                          <p className="text-sm text-kona-espresso/60 italic mt-1">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-kona-brown">
                        {formatPrice(item.totalPrice, item.menuItem.price.currency)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div className="p-3 bg-kona-taupe/10 rounded-kona">
                    <p className="text-sm font-semibold text-kona-espresso mb-1">
                      Special Instructions:
                    </p>
                    <p className="text-sm text-kona-espresso/70">{order.specialInstructions}</p>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 pt-4 border-t border-kona-taupe/20">
                  <div className="flex justify-between text-kona-espresso">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal, 'USD')}</span>
                  </div>
                  {order.tip > 0 && (
                    <div className="flex justify-between text-kona-espresso">
                      <span>Tip</span>
                      <span>{formatPrice(order.tip, 'USD')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-kona-espresso">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax, 'USD')}</span>
                  </div>
                  {order.appliedGiftCard && (
                    <div className="flex justify-between text-green-600">
                      <span>Gift Card</span>
                      <span>-{formatPrice(order.appliedGiftCard.amount, 'USD')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-kona-espresso pt-2 border-t border-kona-taupe/20">
                    <span>Total</span>
                    <span className="text-kona-brown">{formatPrice(order.total, 'USD')}</span>
                  </div>
                </div>

                {/* Pickup Location */}
                <div className="p-4 bg-gradient-to-br from-kona-brown/10 to-kona-teal/10 rounded-kona">
                  <h4 className="font-semibold text-kona-espresso mb-2">Pickup Location</h4>
                  <p className="text-sm text-kona-espresso/70">
                    {order.location.name}
                    <br />
                    {order.location.address.street}
                    <br />
                    {order.location.address.city}, {order.location.address.state} {order.location.address.zipCode}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4 justify-center"
          >
            <Button variant="outline" onClick={() => fetchOrderStatus()}>
              <RefreshCw className="mr-2 w-4 h-4" />
              Refresh Status
            </Button>
            <Button variant="aloha" asChild>
              <Link href="/menu">
                <Home className="mr-2 w-5 h-5" />
                Order Again
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default TrackOrderPage
