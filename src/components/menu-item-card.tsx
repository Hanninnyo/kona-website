"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Leaf, Flame, Snowflake } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import type { MenuItem } from '@/lib/types'

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
  onCustomize?: (item: MenuItem) => void
  className?: string
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  onCustomize,
  className = ""
}) => {
  const getDietaryIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'vegan':
      case 'organic':
        return <Leaf className="w-3 h-3" />
      case 'hot':
      case 'spicy':
        return <Flame className="w-3 h-3" />
      case 'iced':
      case 'cold':
        return <Snowflake className="w-3 h-3" />
      default:
        return null
    }
  }

  // Unused for now but may be needed for future badge logic
  // const getBadgeVariant = (tag: string) => {
  //   if (item.isNew) return 'new'
  //   if (item.isPopular) return 'popular'
  //   if (item.isSeasonal) return 'seasonal'
  //   return 'secondary'
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="h-full overflow-hidden group cursor-pointer">
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

          {/* Stock Status */}
          <div className="absolute top-3 right-3">
            <Badge variant={item.inStock ? "in-stock" : "sold-out"} className="text-xs">
              {item.inStock ? "In Stock" : "Sold Out"}
            </Badge>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4 flex-1">
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
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-kona-taupe/30 text-kona-espresso text-xs rounded-full"
                >
                  {getDietaryIcon(tag)}
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

          {/* Nutrition Info (if available) */}
          {item.nutritionInfo && (
            <div className="text-xs text-kona-espresso/60 mb-3">
              <span>{item.nutritionInfo.calories} cal</span>
              {item.nutritionInfo.caffeine && (
                <span className="ml-2">• {item.nutritionInfo.caffeine}mg caffeine</span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {item.inStock ? (
            <div className="w-full space-y-2">
              <Button
                variant="aloha"
                className="w-full group-hover:shadow-kona-medium transition-shadow"
                onClick={() => onCustomize ? onCustomize(item) : onAddToCart(item)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {onCustomize ? 'Customize & Add' : 'Add to Cart'}
              </Button>
              {onCustomize && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => onAddToCart(item)}
                >
                  Quick Add (No Customization)
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="secondary"
              className="w-full"
              disabled
            >
              Currently Unavailable
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default MenuItemCard