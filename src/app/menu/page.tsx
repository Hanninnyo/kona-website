"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Filter, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MenuItemCard from '@/components/menu-item-card'
import ItemModificationModal from '@/components/item-modification-modal'
import { VolcanoParticles, VolcanicSteam } from '@/components/volcano-effects'
import { useCart } from '@/contexts/cart-context'
import type { MenuItem } from '@/lib/types'

const MenuPage: React.FC = () => {
  const { addItem } = useCart()
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalItem, setModalItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/pos/menu')
        const data = await response.json()
        setMenu(data.menu || [])
      } catch (error) {
        console.error('Failed to fetch menu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const categories = [
    { id: 'all', name: 'All Items', icon: Coffee },
    { id: 'hot-coffee', name: 'Hot Coffee', icon: Coffee },
    { id: 'hot-specialties', name: 'Hot Specialties', icon: Coffee },
    { id: 'cold-coffee', name: 'Cold Coffee', icon: Coffee },
    { id: 'non-coffee', name: 'Non-Coffee', icon: Coffee },
    { id: 'food', name: 'Food', icon: Coffee },
    { id: 'smoothies', name: 'Smoothies', icon: Coffee },
  ]

  const filteredMenu = menu.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (item: MenuItem) => {
    // Quick add without modifiers (default selections only)
    const defaultModifiers: { [modifierId: string]: any[] } = {}

    // Add default modifier selections if item has required modifiers
    item.modifiers.forEach(modifier => {
      if (modifier.required && modifier.options.length > 0) {
        defaultModifiers[modifier.id] = [modifier.options[0]]
      }
    })

    addItem(item, defaultModifiers, 1)
    console.log('[Menu] Quick added to cart:', item.name)
  }

  const handleCustomizeItem = (item: MenuItem) => {
    setModalItem(item)
    setIsModalOpen(true)
  }

  const handleModalAddToCart = (item: MenuItem, modifications: any) => {
    const { selectedModifiers, quantity, notes } = modifications
    addItem(item, selectedModifiers || {}, quantity || 1, notes)
    console.log('[Menu] Added to cart with customization:', item.name, modifications)
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-kona-white">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="text-center">
            <Coffee className="w-12 h-12 text-kona-brown mx-auto mb-4 animate-spin" />
            <p className="text-kona-espresso">Loading our delicious menu...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-kona-white relative overflow-hidden">
      <VolcanoParticles />
      <VolcanicSteam />
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-kona-brown/10 to-kona-teal/10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-league-spartan text-4xl md:text-5xl font-bold text-kona-espresso mb-4">
              Our Island Menu
            </h1>
            <p className="text-kona-espresso/70 text-lg mb-8">
              Discover authentic Hawaiian flavors crafted with premium Kona coffee beans and island-inspired ingredients
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kona-espresso/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-kona-taupe/30 rounded-kona focus:outline-none focus:ring-2 focus:ring-kona-teal focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-kona-white border-b border-kona-taupe/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-kona-brown flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0"
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {filteredMenu.length === 0 ? (
            <div className="text-center py-16">
              <Coffee className="w-16 h-16 text-kona-taupe mx-auto mb-4" />
              <h3 className="font-league-spartan text-xl font-semibold text-kona-espresso mb-2">
                No items found
              </h3>
              <p className="text-kona-espresso/60">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <MenuItemCard
                    item={item}
                    onAddToCart={handleAddToCart}
                    onCustomize={handleCustomizeItem}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Menu Stats */}
      <section className="py-8 bg-kona-taupe/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center border-0 shadow-kona-soft">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-kona-brown">
                  {menu.length}
                </div>
                <div className="text-sm text-kona-espresso/70">Total Items</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-kona-soft">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-kona-teal">
                  {menu.filter(item => item.isNew).length}
                </div>
                <div className="text-sm text-kona-espresso/70">New Items</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-kona-soft">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-500">
                  {menu.filter(item => item.isPopular).length}
                </div>
                <div className="text-sm text-kona-espresso/70">Popular</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-kona-soft">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-500">
                  {menu.filter(item => item.isSeasonal).length}
                </div>
                <div className="text-sm text-kona-espresso/70">Seasonal</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Item Modification Modal */}
      <ItemModificationModal
        item={modalItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  )
}

export default MenuPage