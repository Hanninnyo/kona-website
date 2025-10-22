"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CreditCard, Gift, Award, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

const CheckoutPage: React.FC = () => {
  const router = useRouter()
  const { state, clearCart, applyGiftCard, removeGiftCard } = useCart()

  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')
  const [giftCardCode, setGiftCardCode] = useState('')
  const [giftCardError, setGiftCardError] = useState('')
  const [isApplyingGiftCard, setIsApplyingGiftCard] = useState(false)

  // Order state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  // Redirect if cart is empty
  React.useEffect(() => {
    if (state.items.length === 0) {
      router.push('/menu')
    }
  }, [state.items.length, router])

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (!customerName.trim()) {
      errors.name = 'Name is required'
    }

    if (!customerEmail.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.email = 'Invalid email address'
    }

    if (!customerPhone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s\-()]+$/.test(customerPhone)) {
      errors.phone = 'Invalid phone number'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim()) {
      setGiftCardError('Please enter a gift card code')
      return
    }

    setIsApplyingGiftCard(true)
    setGiftCardError('')

    try {
      // Simulate API call to validate gift card
      await new Promise(resolve => setTimeout(resolve, 1000))

      // For mock, assume $10 gift card value
      const giftCardValue = 10.00
      applyGiftCard(giftCardCode, giftCardValue)
      setGiftCardCode('')
    } catch (error) {
      setGiftCardError('Invalid gift card code')
    } finally {
      setIsApplyingGiftCard(false)
    }
  }

  const handlePlaceOrder = async () => {
    setOrderError('')

    if (!validateForm()) {
      return
    }

    setIsPlacingOrder(true)

    try {
      // Create order payload
      const orderPayload = {
        customer: {
          id: `customer-${Date.now()}`,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          loyaltyPoints: 0,
        },
        items: state.items,
        subtotal: state.subtotal,
        tax: state.tax,
        tip: state.tip,
        total: state.total,
        paymentMethod,
        orderType: 'pickup' as const,
        specialInstructions: state.specialInstructions,
        appliedGiftCard: state.appliedGiftCard,
        location: {
          id: 'valley-medical',
          name: 'Valley Medical Center',
          address: {
            street: '751 S Bascom Ave',
            city: 'San Jose',
            state: 'CA',
            zipCode: '95128'
          },
          coordinates: { lat: 37.3022, lng: -121.9319 },
          phone: '(555) KONA-VMC',
          hours: {
            weekday: { open: '07:30', close: '16:00' }
          },
          features: ['Weekday Service', 'Healthcare Location']
        }
      }

      console.log('[Checkout] Placing order:', orderPayload)

      // Call the order creation API
      const response = await fetch('/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const data = await response.json()
      const { order } = data

      console.log('[Checkout] Order created successfully:', order)

      // Clear cart and redirect to tracking page
      clearCart()
      router.push(`/track/${order.id}`)

    } catch (error) {
      console.error('[Checkout] Error placing order:', error)
      setOrderError(error instanceof Error ? error.message : 'Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (state.items.length === 0) {
    return null
  }

  return (
    <div className="pt-20 min-h-screen bg-kona-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/order"
            className="inline-flex items-center text-kona-brown hover:text-kona-brown/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-2">
            Checkout
          </h1>
          <p className="text-kona-espresso/70">
            Complete your order details
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="shadow-kona-soft">
                <CardHeader>
                  <CardTitle className="text-xl text-kona-espresso">
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-kona-espresso mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-kona focus:outline-none focus:ring-2 focus:ring-kona-teal focus:border-transparent ${
                        formErrors.name ? 'border-red-500' : 'border-kona-taupe/30'
                      }`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-kona-espresso mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-kona focus:outline-none focus:ring-2 focus:ring-kona-teal focus:border-transparent ${
                        formErrors.email ? 'border-red-500' : 'border-kona-taupe/30'
                      }`}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-kona-espresso mb-2">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-kona focus:outline-none focus:ring-2 focus:ring-kona-teal focus:border-transparent ${
                        formErrors.phone ? 'border-red-500' : 'border-kona-taupe/30'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-kona-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-kona-espresso">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`py-4 px-4 rounded-kona border-2 transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-kona-teal bg-kona-teal/10'
                          : 'border-kona-taupe/30 hover:border-kona-taupe'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2 text-kona-espresso" />
                      <span className="font-semibold text-kona-espresso">Credit Card</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-4 px-4 rounded-kona border-2 transition-colors ${
                        paymentMethod === 'cash'
                          ? 'border-kona-teal bg-kona-teal/10'
                          : 'border-kona-taupe/30 hover:border-kona-taupe'
                      }`}
                    >
                      <div className="text-2xl mb-2">💵</div>
                      <span className="font-semibold text-kona-espresso">Pay at Pickup</span>
                    </button>
                  </div>

                  {/* Dummy Stripe Element Placeholder */}
                  {paymentMethod === 'card' && (
                    <div className="mt-4 p-6 border-2 border-dashed border-kona-taupe/30 rounded-kona bg-kona-taupe/5">
                      <p className="text-center text-kona-espresso/60 text-sm">
                        💳 Stripe payment element would appear here
                        <br />
                        <span className="text-xs">(Disabled in mock mode)</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Gift Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="shadow-kona-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-kona-espresso">
                    <Gift className="w-5 h-5" />
                    Gift Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.appliedGiftCard ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-kona">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-800">Gift Card Applied</p>
                          <p className="text-sm text-green-600">
                            Code: {state.appliedGiftCard.code} • {formatPrice(state.appliedGiftCard.amount, 'USD')} off
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeGiftCard}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={giftCardCode}
                          onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                          placeholder="Enter gift card code"
                          className="flex-1 px-4 py-2 border border-kona-taupe/30 rounded-kona focus:outline-none focus:ring-2 focus:ring-kona-teal focus:border-transparent"
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyGiftCard}
                          disabled={isApplyingGiftCard}
                        >
                          {isApplyingGiftCard ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      </div>
                      {giftCardError && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {giftCardError}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="sticky top-24"
            >
              <Card className="shadow-kona-medium">
                <CardHeader>
                  <CardTitle className="text-xl text-kona-espresso">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-2">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-kona-espresso">
                        <span className="flex-1">
                          {item.quantity}× {item.menuItem.name}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.totalPrice, item.menuItem.price.currency)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-kona-taupe/20 pt-4 space-y-2">
                    <div className="flex justify-between text-kona-espresso">
                      <span>Subtotal</span>
                      <span>{formatPrice(state.subtotal, 'USD')}</span>
                    </div>
                    {state.tip > 0 && (
                      <div className="flex justify-between text-kona-espresso">
                        <span>Tip</span>
                        <span>{formatPrice(state.tip, 'USD')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-kona-espresso">
                      <span>Tax</span>
                      <span>{formatPrice(state.tax, 'USD')}</span>
                    </div>
                    {state.appliedGiftCard && (
                      <div className="flex justify-between text-green-600">
                        <span>Gift Card</span>
                        <span>-{formatPrice(state.appliedGiftCard.amount, 'USD')}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-kona-taupe/20 pt-4">
                    <div className="flex justify-between text-lg font-bold text-kona-espresso">
                      <span>Total</span>
                      <span className="text-kona-brown">
                        {formatPrice(state.total, 'USD')}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    variant="aloha"
                    size="lg"
                    className="w-full"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>

                  {orderError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-kona">
                      <p className="text-red-700 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {orderError}
                      </p>
                    </div>
                  )}

                  {/* Pickup Info */}
                  <div className="text-xs text-kona-espresso/60 text-center pt-2">
                    📍 Pickup at Valley Medical Center
                    <br />
                    Estimated ready in 15-20 minutes
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
