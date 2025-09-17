"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import type { MenuItem } from '@/lib/types'

interface ItemModificationModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: MenuItem, modifications: any) => void
}

interface Modification {
  id: string
  name: string
  options: Array<{
    id: string
    name: string
    price: number
  }>
  required?: boolean
  multiple?: boolean
}

const ItemModificationModal: React.FC<ItemModificationModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedModifications, setSelectedModifications] = useState<Record<string, string[]>>({})
  const [specialInstructions, setSpecialInstructions] = useState('')

  const modifications: Modification[] = [
    {
      id: 'milk',
      name: 'Milk Choice',
      required: item?.category === 'hot-specialties' || item?.category === 'espresso',
      options: [
        { id: 'whole', name: 'Whole Milk', price: 0 },
        { id: 'oat', name: 'Oat Milk', price: 0.60 },
        { id: 'almond', name: 'Almond Milk', price: 0.50 },
        { id: 'coconut', name: 'Coconut Milk', price: 0.50 },
        { id: 'soy', name: 'Soy Milk', price: 0.50 },
        { id: 'macadamia', name: 'Macadamia Milk', price: 0.75 }
      ]
    },
    {
      id: 'sweetener',
      name: 'Sweetener',
      options: [
        { id: 'none', name: 'No Sweetener', price: 0 },
        { id: 'sugar', name: 'Sugar', price: 0 },
        { id: 'honey', name: 'Local Honey', price: 0.25 },
        { id: 'agave', name: 'Agave', price: 0.25 },
        { id: 'coconut-sugar', name: 'Coconut Sugar', price: 0.30 },
        { id: 'vanilla', name: 'Vanilla Syrup', price: 0.50 },
        { id: 'caramel', name: 'Caramel Syrup', price: 0.50 }
      ]
    },
    {
      id: 'temperature',
      name: 'Temperature',
      required: true,
      options: [
        { id: 'hot', name: 'Hot', price: 0 },
        { id: 'iced', name: 'Iced', price: 0 },
        { id: 'extra-hot', name: 'Extra Hot', price: 0 }
      ]
    },
    {
      id: 'extras',
      name: 'Add Extras',
      multiple: true,
      options: [
        { id: 'extra-shot', name: 'Extra Shot', price: 1.00 },
        { id: 'decaf', name: 'Make it Decaf', price: 0 },
        { id: 'whipped-cream', name: 'Whipped Cream', price: 0.75 },
        { id: 'cinnamon', name: 'Cinnamon Dust', price: 0 },
        { id: 'nutmeg', name: 'Nutmeg', price: 0 },
        { id: 'sea-salt', name: 'Sea Salt', price: 0.25 }
      ]
    }
  ]

  if (!item) return null

  const handleModificationChange = (modId: string, optionId: string, multiple = false) => {
    setSelectedModifications(prev => {
      if (multiple) {
        const current = prev[modId] || []
        const updated = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId]
        return { ...prev, [modId]: updated }
      } else {
        return { ...prev, [modId]: [optionId] }
      }
    })
  }

  const calculateTotalPrice = () => {
    let total = item.price.amount * quantity

    modifications.forEach(mod => {
      const selected = selectedModifications[mod.id] || []
      selected.forEach(optionId => {
        const option = mod.options.find(opt => opt.id === optionId)
        if (option) {
          total += option.price * quantity
        }
      })
    })

    return total
  }

  const handleAddToCart = () => {
    const modifiedItem = {
      ...item,
      modifications: selectedModifications,
      specialInstructions,
      quantity
    }
    onAddToCart(modifiedItem, selectedModifications)
    onClose()
    // Reset form
    setQuantity(1)
    setSelectedModifications({})
    setSpecialInstructions('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
            style={{ zIndex: 9998 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-auto bg-kona-white rounded-kona shadow-kona-medium overflow-hidden pointer-events-auto"
            style={{ zIndex: 9999 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-kona-taupe/20">
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="font-league-spartan text-xl font-bold text-kona-espresso">
                      {item.name}
                    </h2>
                    <p className="text-kona-espresso/70 text-sm">
                      ${item.price.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-kona-espresso hover:bg-kona-taupe/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Description */}
                <p className="text-kona-espresso/80">{item.description}</p>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Modifications */}
                {modifications.map(modification => (
                  <div key={modification.id} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-league-spartan font-semibold text-kona-espresso">
                        {modification.name}
                      </h3>
                      {modification.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {modification.options.map(option => {
                        const isSelected = (selectedModifications[modification.id] || []).includes(option.id)

                        return (
                          <button
                            key={option.id}
                            onClick={() => handleModificationChange(modification.id, option.id, modification.multiple)}
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              isSelected
                                ? 'border-kona-teal bg-kona-teal/10 text-kona-espresso'
                                : 'border-kona-taupe/30 hover:border-kona-taupe/50 text-kona-espresso'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{option.name}</span>
                              {option.price > 0 && (
                                <span className="text-kona-brown font-semibold">
                                  +${option.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Special Instructions */}
                <div className="space-y-3">
                  <h3 className="font-league-spartan font-semibold text-kona-espresso">
                    Special Instructions
                  </h3>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests? (e.g., extra foam, light ice, etc.)"
                    className="w-full p-3 border border-kona-taupe/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-kona-teal focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-kona-taupe/20 bg-kona-taupe/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="font-league-spartan font-semibold text-kona-espresso">
                      Quantity
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-kona-espresso">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-kona-espresso/70">Total</div>
                    <div className="font-league-spartan text-xl font-bold text-kona-espresso">
                      ${calculateTotalPrice().toFixed(2)}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full"
                  variant="aloha"
                  size="lg"
                >
                  <Coffee className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ItemModificationModal