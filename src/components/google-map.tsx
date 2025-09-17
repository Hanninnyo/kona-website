"use client"

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Navigation, MapPin } from 'lucide-react'

interface GoogleMapProps {
  center: {
    lat: number
    lng: number
  }
  zoom?: number
  markers?: Array<{
    position: { lat: number; lng: number }
    title: string
    content?: string
  }>
  className?: string
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  zoom = 15,
  markers = [],
  className = ""
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  // Default map configuration for Valley Medical Center
  const valleyMedicalCenter = {
    lat: 37.3002,
    lng: -121.9311
  }

  const openInGoogleMaps = () => {
    const address = "751 South Bascom Avenue, San Jose, CA 95128"
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(url, '_blank')
  }

  const getDirections = () => {
    const address = "751 South Bascom Avenue, San Jose, CA 95128"
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    window.open(url, '_blank')
  }

  useEffect(() => {
    // For now, we'll use a placeholder since Google Maps requires an API key
    // In production, you would load the Google Maps JavaScript API
    console.log('Google Maps would be initialized here with center:', center)
  }, [center])

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder Map - Replace with actual Google Maps when API key is available */}
      <div
        ref={mapRef}
        className="w-full h-64 bg-gradient-to-br from-kona-teal/20 to-kona-brown/20 rounded-kona flex items-center justify-center relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Map Content */}
        <div className="relative z-10 text-center">
          <MapPin className="w-12 h-12 text-kona-brown mx-auto mb-4" />
          <h3 className="font-league-spartan text-lg font-bold text-kona-espresso mb-2">
            Valley Medical Center
          </h3>
          <p className="text-kona-espresso/70 mb-4 text-sm">
            751 S Bascom Ave, San Jose, CA 95128
          </p>
          <p className="text-kona-espresso/60 mb-6 text-sm">
            Monday-Friday: 7:30am - 4:00pm
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="aloha"
              size="sm"
              onClick={getDirections}
              className="text-sm"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Get Directions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openInGoogleMaps}
              className="text-sm"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View on Maps
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-kona-teal rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-6 w-1 h-1 bg-kona-brown rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-kona-teal rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-kona-brown rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Interactive Map Notice */}
      <div className="mt-4 p-3 bg-kona-taupe/10 rounded-lg text-center">
        <p className="text-xs text-kona-espresso/60">
          Interactive Google Maps integration available with API key configuration
        </p>
      </div>
    </div>
  )
}

export default GoogleMap