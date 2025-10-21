"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Coffee } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const OrderPage: React.FC = () => {
  const router = useRouter()
  const { state, updateQuantity, removeItem, setTip, setSpecialInstructions } = useCart()
  const prefersReducedMotion = useReducedMotion()

  const [tipPercentage, setTipPercentage] = useState(0)
  const [customTip, setCustomTip] = useState('')
  const [showCustomTip, setShowCustomTip] = useState(false)

  const tipOptions = [
    { label: '15%', value: 0.15 },
    { label: '18%', value: 0.18 },
    { label: '20%', value: 0.20 },
  ]

  const handleTipSelection = (percentage: number) => {
    setTipPercentage(percentage)
    setShowCustomTip(false)
    setCustomTip('')
    const tipAmount = state.subtotal * percentage
    setTip(tipAmount, percentage * 100)
  }

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value)
    const amount = parseFloat(value) || 0
    setTipPercentage(0)
    setTip(amount, 0)
  }

  const handleSpecialInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSpecialInstructions(e.target.value)
  }

  const handleProceedToCheckout = () => {
    router.push('/checkout')
  }

  const getModifierSummary = (selectedModifiers: { [modifierId: string]: any[] }): string => {
    const modifierStrings: string[] = []
    Object.values(selectedModifiers).forEach(options => {
      options.forEach(option => {
        if (option.name) {
          modifierStrings.push(option.name)
        }
      })
    })
    return modifierStrings.join(', ')
  }

  // Animation variants
  const containerVariants = prefersReducedMotion ? undefined : {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = prefersReducedMotion ? undefined : {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  }

  // Empty cart state
  if (state.items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-kona-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="mb-6">
              <ShoppingBag className="w-24 h-24 text-kona-taupe mx-auto mb-4" />
              <h1 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-kona-espresso/70 text-lg mb-8">
                Start your island coffee journey by adding some delicious items from our menu!
              </p>
            </div>

            <Button variant="aloha" size="lg" asChild>
              <Link href="/menu">
                <Coffee className="mr-2 w-5 h-5" />
                Browse Menu
              </Link>
            </Button>
          </motion.div>
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
          className="mb-8"
        >
          <h1 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-2">
            Your Order
          </h1>
          <p className="text-kona-espresso/70">
            Review your items and proceed to checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {state.items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout={!prefersReducedMotion}
                  >
                    <Card className="overflow-hidden shadow-kona-soft hover:shadow-kona-medium transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {/* Item Image */}
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={item.menuItem.image || '/images/placeholder-drink.jpg'}
                              alt={item.menuItem.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-league-spartan text-lg font-semibold text-kona-espresso">
                                  {item.menuItem.name}
                                </h3>
                                {Object.keys(item.selectedModifiers).length > 0 && (
                                  <p className="text-sm text-kona-espresso/60">
                                    {getModifierSummary(item.selectedModifiers)}
                                  </p>
                                )}
                                {item.notes && (
                                  <p className="text-sm text-kona-espresso/60 italic mt-1">
                                    Note: {item.notes}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700 p-2 -mr-2 -mt-2"
                                aria-label={`Remove ${item.menuItem.name} from cart`}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-kona-taupe hover:bg-kona-taupe/20 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-8 text-center font-semibold text-kona-espresso">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full border border-kona-taupe hover:bg-kona-taupe/20 transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="font-bold text-kona-brown">
                                {formatPrice(item.totalPrice, item.menuItem.price.currency)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Special Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6"
            >
              <Card className="shadow-kona-soft">
                <CardHeader>
                  <CardTitle className="text-lg text-kona-espresso">
                    Special Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={state.specialInstructions || ''}
                    onChange={handleSpecialInstructionsChange}
                    placeholder="Any special requests or dietary restrictions? Let us know here..."
                    className="w-full px-4 py-3 border border-kona-taupe/30 rounded-kona focus:outline-none focus:ring-2 focus:ring-kona-teal focus:border-transparent resize-none"
                    rows={3}
                  />
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
                  <CardTitle className="flex items-center gap-2 text-kona-espresso">
                    <ShoppingCart className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-kona-espresso">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(state.subtotal, 'USD')}
                    </span>
                  </div>

                  {/* Tip Selection */}
                  <div className="border-t border-kona-taupe/20 pt-4">
                    <label className="block text-sm font-semibold text-kona-espresso mb-3">
                      Add a Tip
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {tipOptions.map((option) => (
                        <button
                          key={option.label}
                          onClick={() => handleTipSelection(option.value)}
                          className={`py-2 px-3 rounded-kona text-sm font-medium transition-colors ${
                            tipPercentage === option.value
                              ? 'bg-kona-teal text-white'
                              : 'bg-kona-taupe/20 text-kona-espresso hover:bg-kona-taupe/40'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowCustomTip(!showCustomTip)}
                      className="w-full py-2 px-3 rounded-kona text-sm font-medium bg-kona-taupe/20 text-kona-espresso hover:bg-kona-taupe/40 transition-colors"
                    >
                      Custom Tip
                    </button>
                    {showCustomTip && (
                      <div className="mt-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-kona-espresso">
                            $
                          </span>
                          <input
                            type="number"
                            value={customTip}
                            onChange={(e) => handleCustomTipChange(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-2 border border-kona-taupe/30 rounded-kona focus:outline-none focus:ring-2 focus:ring-kona-teal focus:border-transparent"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tip Amount */}
                  {state.tip > 0 && (
                    <div className="flex justify-between text-kona-espresso">
                      <span>Tip</span>
                      <span className="font-semibold">
                        {formatPrice(state.tip, 'USD')}
                      </span>
                    </div>
                  )}

                  {/* Tax */}
                  <div className="flex justify-between text-kona-espresso">
                    <span>Tax (8%)</span>
                    <span className="font-semibold">
                      {formatPrice(state.tax, 'USD')}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-kona-taupe/20 pt-4">
                    <div className="flex justify-between text-lg font-bold text-kona-espresso">
                      <span>Total</span>
                      <span className="text-kona-brown">
                        {formatPrice(state.total, 'USD')}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    variant="aloha"
                    size="lg"
                    className="w-full"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  {/* Continue Shopping */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href="/menu">
                      Continue Shopping
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage
