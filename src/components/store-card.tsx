"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation, Wifi, Car, Coffee } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { isBusinessOpen, formatTime } from '@/lib/utils'
import type { Store } from '@/lib/types'

interface StoreCardProps {
  store: Store
  className?: string
}

const StoreCard: React.FC<StoreCardProps> = ({ store, className = "" }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase() // mon, tue, etc.
  const todayHours = store.hours[today]
  const isOpen = todayHours && !todayHours.closed ? isBusinessOpen(todayHours) : false

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'wifi':
      case 'free wifi':
        return <Wifi className="w-4 h-4" />
      case 'parking':
      case 'free parking':
        return <Car className="w-4 h-4" />
      case 'drive-thru':
      case 'drive through':
        return <Coffee className="w-4 h-4" />
      default:
        return <Coffee className="w-4 h-4" />
    }
  }

  const openGoogleMaps = () => {
    const { street, city, state, zipCode } = store.address
    const fullAddress = `${street}, ${city}, ${state} ${zipCode}`
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    window.open(mapsUrl, '_blank')
  }

  const callStore = () => {
    window.location.href = `tel:${store.phone}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="h-full overflow-hidden group">
        {/* Store Image */}
        {store.image && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={store.image}
              alt={`${store.name} location`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <Badge
                variant={isOpen ? "in-stock" : "sold-out"}
                className="text-xs font-semibold"
              >
                {isOpen ? "Open Now" : "Closed"}
              </Badge>
            </div>
          </div>
        )}

        <CardContent className="p-6 flex-1">
          {/* Store Name */}
          <h3 className="font-league-spartan text-xl font-bold text-kona-espresso mb-2">
            {store.name}
          </h3>

          {/* Address */}
          <div className="flex items-start space-x-2 mb-3">
            <MapPin className="w-4 h-4 text-kona-brown mt-0.5 flex-shrink-0" />
            <div className="text-kona-espresso/80 text-sm">
              <p>{store.address.street}</p>
              <p>{store.address.city}, {store.address.state} {store.address.zipCode}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-2 mb-3">
            <Phone className="w-4 h-4 text-kona-brown flex-shrink-0" />
            <button
              onClick={callStore}
              className="text-kona-brown hover:text-kona-teal transition-colors text-sm"
            >
              {store.phone}
            </button>
          </div>

          {/* Hours */}
          <div className="flex items-start space-x-2 mb-4">
            <Clock className="w-4 h-4 text-kona-brown mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              {todayHours && !todayHours.closed ? (
                <div>
                  <span className="text-kona-espresso font-medium">Today: </span>
                  <span className={isOpen ? "text-green-600" : "text-kona-espresso/70"}>
                    {formatTime(new Date(`2000-01-01T${todayHours.open}`))} - {formatTime(new Date(`2000-01-01T${todayHours.close}`))}
                  </span>
                </div>
              ) : (
                <span className="text-red-600">Closed Today</span>
              )}

              {/* View All Hours Link */}
              <button className="text-kona-brown hover:text-kona-teal text-xs mt-1 block">
                View all hours
              </button>
            </div>
          </div>

          {/* Features */}
          {store.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {store.features.slice(0, 3).map((feature, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-kona-taupe/20 text-kona-espresso text-xs rounded-full"
                >
                  {getFeatureIcon(feature)}
                  {feature}
                </div>
              ))}
              {store.features.length > 3 && (
                <span className="text-kona-espresso/50 text-xs px-2 py-1">
                  +{store.features.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openGoogleMaps}
            className="flex-1"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Directions
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={callStore}
            className="flex-1"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default StoreCard