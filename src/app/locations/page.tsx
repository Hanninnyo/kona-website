"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Wifi, Car, Coffee, Navigation, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StoreCard from '@/components/store-card'
import GoogleMap from '@/components/google-map'
import type { Store } from '@/lib/types'
import { VolcanoBackground, CoffeeBeanParticles } from '@/components/volcano-effects'

const LocationsPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('all')

  const locations: Store[] = [
    {
      id: 'valley-medical-center',
      name: 'Valley Medical Center',
      address: {
        street: '751 S Bascom Ave',
        city: 'San Jose',
        state: 'CA',
        zipCode: '95128'
      },
      coordinates: {
        lat: 37.3002,
        lng: -121.9311
      },
      phone: '(408) 513-6455',
      hours: {
        monday: { open: '07:30', close: '16:00' },
        tuesday: { open: '07:30', close: '16:00' },
        wednesday: { open: '07:30', close: '64:00' },
        thursday: { open: '07:30', close: '16:00' },
        friday: { open: '07:30', close: '16:00' },
        saturday: { closed: true },
        sunday: { closed: true }
      },
      features: ['Mobile Truck', 'Healthcare Workers Discount', 'Quick Service', 'Outdoor Setup'],
      image: '/images/valley-medical-truck.jpg'
    },
    {
      id: 'saturday-route-1',
      name: 'Saturday Bay Area Route',
      address: {
        street: 'Various Locations',
        city: 'Bay Area',
        state: 'CA',
        zipCode: 'Various'
      },
      coordinates: {
        lat: 37.4419,
        lng: -122.1430
      },
      phone: '(408) 513-6455',
      hours: {
        monday: { closed: true },
        tuesday: { closed: true },
        wednesday: { closed: true },
        thursday: { closed: true },
        friday: { closed: true },
        saturday: { open: '08:00', close: '13:30' },
        sunday: { closed: true }
      },
      features: ['Mobile Truck', 'Rotating Locations', 'Community Events', 'Special Promotions'],
      image: '/images/saturday-truck-route.jpg'
    }
  ]

  const cities = [
    { id: 'all', name: 'All Stops', count: locations.length },
    { id: 'san-jose', name: 'San Jose (Weekdays)', count: locations.filter(l => l.address.city === 'San Jose').length },
    { id: 'bay-area', name: 'Bay Area (Saturdays)', count: locations.filter(l => l.address.city === 'Bay Area').length }
  ]

  const filteredLocations = selectedLocation === 'all'
    ? locations
    : locations.filter(location => {
        if (selectedLocation === 'san-jose') return location.address.city === 'San Jose'
        if (selectedLocation === 'bay-area') return location.address.city === 'Bay Area'
        return location.address.city.toLowerCase().replace(' ', '-') === selectedLocation
      })

  const totalOpenLocations = locations.filter(location => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const todayHours = location.hours[today as keyof typeof location.hours]
    return todayHours && !todayHours.closed
  }).length

  return (
    <div className="pt-20 min-h-screen bg-kona-white relative overflow-hidden">
      <CoffeeBeanParticles />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-kona-brown/20 to-kona-teal/20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-league-spartan text-4xl md:text-6xl font-bold text-kona-espresso mb-6">
              Find Our Coffee Truck
            </h1>
            <p className="text-kona-espresso/80 text-lg md:text-xl mb-8 leading-relaxed">
              Follow us around the Bay Area! We bring authentic Hawaiian coffee culture directly to your community with our mobile ʻohana.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-kona-brown">{locations.length}</div>
                <div className="text-sm text-kona-espresso/70">Locations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-kona-teal">{totalOpenLocations}</div>
                <div className="text-sm text-kona-espresso/70">Open Today</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-kona-brown">30+</div>
                <div className="text-sm text-kona-espresso/70">Years Serving</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* City Filter */}
      <section className="py-8 bg-kona-white border-b border-kona-taupe/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {cities.map((city) => (
              <Button
                key={city.id}
                variant={selectedLocation === city.id ? "default" : "outline"}
                onClick={() => setSelectedLocation(city.id)}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                {city.name}
                <Badge variant="secondary" className="text-xs">
                  {city.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-kona-taupe mx-auto mb-4" />
              <h3 className="font-league-spartan text-xl font-semibold text-kona-espresso mb-2">
                No locations found
              </h3>
              <p className="text-kona-espresso/60">
                Try selecting a different city or view all locations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLocations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <StoreCard store={location} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 bg-kona-taupe/10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
              Interactive Map
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Explore all our locations on the map and find the perfect spot for your coffee adventure
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <GoogleMap
              center={{ lat: 37.3002, lng: -121.9311 }}
              zoom={15}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Hours & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
              General Information
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              What you can expect at every Kona Island Coffee location
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-kona-soft">
              <CardHeader>
                <Clock className="w-12 h-12 text-kona-brown mx-auto mb-2" />
                <CardTitle className="text-lg text-kona-espresso">
                  Typical Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div>Mon-Thu: 6:00 AM - 8:00 PM</div>
                  <div>Fri-Sat: 6:00 AM - 9:00 PM</div>
                  <div>Sunday: 7:00 AM - 7:00 PM</div>
                </div>
                <p className="text-xs text-kona-espresso/60 mt-3">
                  *Hours may vary by location
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-kona-soft">
              <CardHeader>
                <Wifi className="w-12 h-12 text-kona-teal mx-auto mb-2" />
                <CardTitle className="text-lg text-kona-espresso">
                  Free WiFi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-kona-espresso/80">
                  High-speed internet at all locations for work, study, or staying connected
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-kona-soft">
              <CardHeader>
                <Car className="w-12 h-12 text-kona-brown mx-auto mb-2" />
                <CardTitle className="text-lg text-kona-espresso">
                  Parking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-kona-espresso/80">
                  Most locations offer parking or are near public transit options
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-kona-soft">
              <CardHeader>
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <CardTitle className="text-lg text-kona-espresso">
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-kona-espresso/80">
                  Earn points on every purchase and enjoy exclusive member benefits
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-kona-espresso text-kona-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Coffee className="w-12 h-12 text-kona-teal mx-auto mb-4" />
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold mb-4">
              Visit Us Today
            </h2>
            <p className="font-hawaiian-script text-2xl text-kona-teal mb-4">
              ʻO wau kēia - This is me (your coffee home)
            </p>
            <p className="text-lg text-kona-white/90 mb-8">
              Whether you&apos;re looking for your morning coffee, afternoon pick-me-up, or a cozy place to work,
              we have a location near you. Come experience the aloha spirit!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="teal" size="lg">
                <MapPin className="w-5 h-5 mr-2" />
                Find Nearest Location
              </Button>
              <Button variant="outline" size="lg" className="border-kona-white text-kona-white hover:bg-kona-white hover:text-kona-espresso" asChild>
                <a
                  href="https://kona-island-coffee-llc.square.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order Online
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default function Locations() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold">Locations & Hours</h1>
      <div className="mt-8 space-y-6">
        <section className="rounded-2xl ring-1 ring-neutral-200 p-5 shadow-kona-soft">
          <h2 className="text-xl font-semibold">Valley Medical Center (San Jose)</h2>
          <p className="text-neutral-600">751 S Bascom Ave, San Jose, CA</p>
          <p className="mt-1">Mon–Fri · 7:30am–4:00pm</p>
        </section>
        <section className="rounded-2xl ring-1 ring-neutral-200 p-5 shadow-kona-soft">
          <h2 className="text-xl font-semibold">Mountain View (Flagship) — Coming Soon</h2>
          <p className="text-neutral-600">Downtown Mountain View</p>
        </section>
      </div>
      <div className="mt-10">
        <a href="/catering" className="underline">Book our trailer for private events →</a>
      </div>
    </main>
  );
}
