"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coffee, Filter, Search, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VolcanoParticles, VolcanicSteam } from '@/components/volcano-effects'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import type { MenuItem } from '@/lib/types'

const MenuPreviewPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

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
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
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

            {/* CTA to Download App */}
            <div className="mb-8">
              <Button variant="aloha" size="lg" asChild>
                <Link href="/app">
                  <Download className="mr-2 w-5 h-5" />
                  Get the App to Order
                </Link>
              </Button>
            </div>

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
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden group">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image || '/images/placeholder-drink.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Badges Overlay */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {item.isNew && (
                          <Badge variant="new" className="text-xs font-semibold">
                            New
                          </Badge>
                        )}
                        {item.isPopular && (
                          <Badge variant="popular" className="text-xs font-semibold">
                            Popular
                          </Badge>
                        )}
                        {item.isSeasonal && (
                          <Badge variant="seasonal" className="text-xs font-semibold">
                            Seasonal
                          </Badge>
                        )}
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <CardContent className="p-4">
                      {/* Name and Price */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-league-spartan text-lg font-semibold text-kona-espresso leading-tight">
                          {item.name}
                        </h3>
                        <span className="font-bold text-kona-brown ml-2 flex-shrink-0">
                          {formatPrice(item.price.amount, item.price.currency)}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-kona-espresso/70 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Tags */}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-kona-taupe/30 text-kona-espresso text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-kona-espresso/50 text-xs px-2 py-1">
                              +{item.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-gradient-to-br from-kona-brown/10 to-kona-teal/10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
              Ready to Order?
            </h2>
            <p className="text-kona-espresso/70 text-lg mb-8">
              Download our app to place your order and skip the line
            </p>
            <Button variant="aloha" size="lg" className="text-lg px-8" asChild>
              <Link href="/app">
                <Download className="mr-2 w-5 h-5" />
                Get the App
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default MenuPreviewPage
