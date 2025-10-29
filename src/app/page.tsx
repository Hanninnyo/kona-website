"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Coffee, Heart, Leaf, Users, Star, ArrowRight, MapPin, Clock, Award, Download } from 'lucide-react'
import Hero from '@/components/hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import MenuItemCard from '@/components/menu-item-card'
import type { MenuItem } from '@/lib/types'
import homepageContent from '@/content/homepage.json'

// Mock data for featured items
const featuredItems: MenuItem[] = [
  {
    id: "1",
    posExternalId: "POS-001",
    name: "Kona Island Latte",
    description: "Our signature espresso latte with authentic Kona coffee and a hint of tropical vanilla",
    price: { amount: 6.50, currency: "USD" },
    category: "espresso",
    image: "/images/kona-island-latte.jpg",
    tags: ["signature", "espresso", "vanilla", "kona"],
    modifiers: [],
    inStock: true,
    isPopular: true
  },
  {
    id: "2",
    posExternalId: "POS-002",
    name: "Oʻahu Crepe",
    description: "Delicate French crepe filled with fresh tropical fruits and topped with coconut whipped cream",
    price: { amount: 8.95, currency: "USD" },
    category: "pastries",
    image: "/images/oahu-crepe.jpg",
    tags: ["crepe", "tropical", "coconut", "fresh"],
    modifiers: [],
    inStock: true,
    isNew: true
  },
  {
    id: "3",
    posExternalId: "POS-003",
    name: "Ube-Banana Bread",
    description: "Hawaiian-style banana bread with purple ube swirl, perfectly moist and naturally sweet",
    price: { amount: 4.75, currency: "USD" },
    category: "pastries",
    image: "/images/ube-banana-bread.jpg",
    tags: ["banana", "ube", "hawaiian", "sweet"],
    modifiers: [],
    inStock: true,
    isSeasonal: true
  }
]

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    location: "Valley Medical Center",
    rating: 5,
    text: "Having Kona Island Coffee at our hospital brightens everyone's day! Their Kona Island Latte gives me the energy to care for patients.",
    avatar: "/images/avatar-sarah.jpg"
  },
  {
    name: "Marcus Rodriguez",
    location: "Bay Area",
    rating: 5,
    text: "I follow their truck around on Saturdays! The authentic Hawaiian flavors and mobile aloha experience is unmatched.",
    avatar: "/images/avatar-marcus.jpg"
  },
  {
    name: "Emily Wang",
    location: "Healthcare Worker",
    rating: 5,
    text: "The Haupia Matcha Latte from their truck is my favorite pick-me-up between shifts. True Hawaiian hospitality on wheels!",
    avatar: "/images/avatar-emily.jpg"
  }
]

export default function HomePage() {
  const handleAddToCart = (item: MenuItem) => {
    console.log('Item preview:', item)
    // No cart functionality - redirect to app download
  }

  return (
    <div className="pt-20">

      {/* Storefront Launch Announcement */}
      {homepageContent.announcement.enabled && (
        <section className="py-6 relative overflow-hidden" style={{ backgroundColor: '#c7bab6' }}>
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-600 animate-pulse" />
                <span className="font-league-spartan text-lg font-bold text-kona-espresso">EXCITING NEWS!</span>
                <Star className="w-5 h-5 text-yellow-600 animate-pulse" />
              </div>
              <h2 className="font-league-spartan text-xl md:text-2xl font-bold mb-2 text-kona-espresso">
                {homepageContent.announcement.title}
              </h2>
              <p className="text-kona-espresso/80 mb-4">
                {homepageContent.announcement.subtitle} - Bringing our mobile aloha to a permanent home
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-kona-espresso/10 backdrop-blur-sm border-kona-espresso/30 text-kona-espresso hover:bg-kona-espresso hover:text-white"
                  asChild
                >
                  <Link href="/about">
                    Learn More About Our Journey
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-2 left-4 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🏪</div>
          <div className="absolute top-4 right-8 text-xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌺</div>
          <div className="absolute bottom-2 left-8 text-lg animate-bounce" style={{ animationDelay: '1s' }}>☕</div>
          <div className="absolute bottom-4 right-4 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>🎉</div>
        </section>
      )}

      {/* Hero Section */}
      <Hero />

      {/* Featured Drinks Section */}
      <section className="py-16 bg-kona-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
              Island Favorites
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Discover our most beloved Hawaiian-inspired drinks and treats, crafted with authentic island ingredients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <MenuItemCard
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Button variant="aloha" size="lg" asChild>
              <Link href="/menu-preview">
                View Full Menu
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Coffee Farm Picture Section */}
      <section className="py-16 bg-kona-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative h-64 md:h-96 lg:h-[500px] rounded-kona overflow-hidden shadow-kona-medium">
              <Image
                src="/images/kona-coffee-farm-sustainable.jpg"
                alt="Sustainable Kona coffee farm in Hawaii"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="text-white text-lg md:text-xl font-medium drop-shadow-lg">
                  Sustainably sourced — from Hawaiʻi with aloha
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-kona-taupe/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-96 lg:h-[500px] rounded-kona overflow-hidden">
                <Image
                  src="/images/coffee-farm-mauna-loa.jpg"
                  alt="Kona coffee farm on Mauna Loa slopes"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
                  Rolling Aloha to You
                </h2>
                <p className="text-kona-espresso/80 text-lg leading-relaxed">
                  Our mobile ʻohana brings authentic Hawaiian coffee culture directly to the Bay Area.
                  From our flagship weekday spot at Valley Medical Center to our Saturday routes throughout
                  the community, we share the spirit of aloha one cup at a time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-kona-white rounded-kona">
                  <Coffee className="w-8 h-8 text-kona-brown mx-auto mb-2" />
                  <h3 className="font-league-spartan font-bold text-kona-espresso">Mobile Truck</h3>
                  <p className="text-sm text-kona-espresso/70">We come to you</p>
                </div>
                <div className="text-center p-4 bg-kona-white rounded-kona">
                  <Heart className="w-8 h-8 text-kona-teal mx-auto mb-2" />
                  <h3 className="font-league-spartan font-bold text-kona-espresso">Community</h3>
                  <p className="text-sm text-kona-espresso/70">Bay Area aloha</p>
                </div>
              </div>

              <Button variant="outline" size="lg" asChild>
                <Link href="/about">
                  Learn Our Story
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-kona-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
              Our ʻOhana Values
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              More than coffee, we&apos;re building a community rooted in Hawaiian values
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: "Sustainability",
                description: "Protecting the land that grows our coffee through eco-friendly practices and regenerative farming."
              },
              {
                icon: Users,
                title: "Community",
                description: "Building connections and fostering ʻohana (family) spirit in every cup and conversation."
              },
              {
                icon: Award,
                title: "Quality",
                description: "Uncompromising dedication to excellence in every bean, every roast, and every experience."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-kona-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-kona-brown" />
                    </div>
                    <CardTitle className="text-xl text-kona-espresso">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-kona-espresso/70 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-kona-brown/5 to-kona-teal/5">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
              What Our ʻOhana Says
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Real stories from real people who&apos;ve experienced the aloha spirit
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-kona-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-kona-espresso/80 mb-4 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-kona-brown rounded-full flex items-center justify-center">
                        <span className="text-kona-white font-bold text-sm">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-kona-espresso">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-kona-espresso/60 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-kona-espresso text-kona-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">🌺</div>
          <div className="absolute top-20 right-20 text-4xl">🌴</div>
          <div className="absolute bottom-20 left-20 text-5xl">☕</div>
          <div className="absolute bottom-10 right-10 text-3xl">🏄‍♀️</div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-hawaiian-script text-4xl md:text-5xl text-kona-teal mb-4">
              E komo mai!
            </h2>
            <h3 className="font-league-spartan text-2xl md:text-3xl font-bold mb-4">
              Welcome to Our Coffee ʻOhana
            </h3>
            <p className="text-lg text-kona-white/90 mb-8 leading-relaxed">
              Ready to experience authentic Hawaiian coffee culture? Visit us today and taste the difference
              that true aloha makes in every cup.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="teal" size="lg" className="text-lg px-8" asChild>
                <Link href="/app">
                  <Download className="mr-2 w-5 h-5" />
                  Get the App
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="text-lg px-8 border-kona-white text-kona-white hover:bg-kona-white hover:text-kona-espresso" asChild>
                <Link href="/locations">
                  <MapPin className="mr-2 w-5 h-5" />
                  Find a Location
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-kona-white/70">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Monday–Friday 7:30am–4:00pm at Valley Medical Center • Saturday Bay Area trips
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
