"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Download, Smartphone, Coffee, Star, MapPin, Bell, Gift, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Image from 'next/image'
import Link from 'next/link'

const AppPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()

  const features = [
    {
      icon: Coffee,
      title: 'Order Ahead',
      description: 'Skip the line and have your favorite drink ready when you arrive'
    },
    {
      icon: MapPin,
      title: 'Find Us Anywhere',
      description: 'Track our mobile truck in real-time and discover our brick-and-mortar location'
    },
    {
      icon: Gift,
      title: 'Rewards & Gifts',
      description: 'Earn loyalty points with every purchase and send gift cards to friends'
    },
    {
      icon: Bell,
      title: 'Order Notifications',
      description: 'Get real-time updates when your order is ready for pickup'
    },
    {
      icon: Star,
      title: 'Save Favorites',
      description: 'Quickly reorder your go-to drinks with custom modifiers'
    },
    {
      icon: Award,
      title: 'Exclusive Offers',
      description: 'Access app-only promotions and seasonal specials'
    }
  ]

  return (
    <div className="pt-20 min-h-screen bg-kona-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-kona-brown/10 to-kona-teal/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-league-spartan text-4xl md:text-5xl lg:text-6xl font-bold text-kona-espresso mb-4">
                Aloha in Your Pocket
              </h1>
              <p className="text-lg md:text-xl text-kona-espresso/70 mb-8 leading-relaxed">
                Download the Kona Island Coffee app and experience the convenience of mobile ordering,
                real-time tracking, and exclusive rewards. Your favorite Hawaiian coffee, just a tap away.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="aloha"
                  size="lg"
                  className="text-lg px-8"
                  asChild
                >
                  <a href="#" aria-label="Download on the App Store">
                    <Download className="mr-2 w-5 h-5" />
                    App Store
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 border-kona-brown text-kona-brown hover:bg-kona-brown hover:text-white"
                  asChild
                >
                  <a href="#" aria-label="Get it on Google Play">
                    <Download className="mr-2 w-5 h-5" />
                    Google Play
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="font-league-spartan text-3xl font-bold text-kona-brown">50K+</div>
                  <div className="text-sm text-kona-espresso/60">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="font-league-spartan text-3xl font-bold text-kona-teal">4.9</div>
                  <div className="text-sm text-kona-espresso/60">Rating</div>
                </div>
                <div className="text-center">
                  <div className="font-league-spartan text-3xl font-bold text-kona-brown">100K+</div>
                  <div className="text-sm text-kona-espresso/60">Orders</div>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 lg:h-[600px] flex items-center justify-center">
                {/* Phone Mockup Placeholder */}
                <div className="w-64 h-[500px] bg-gradient-to-br from-kona-brown to-kona-teal rounded-[3rem] shadow-kona-medium p-3 relative overflow-hidden">
                  <div className="w-full h-full bg-kona-white rounded-[2.5rem] flex flex-col items-center justify-center p-6">
                    <Smartphone className="w-24 h-24 text-kona-brown mb-4" />
                    <p className="text-center text-kona-espresso font-semibold mb-2">
                      Kona Island Coffee
                    </p>
                    <p className="text-center text-sm text-kona-espresso/60">
                      Coming Soon
                    </p>
                  </div>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-kona-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
              Everything You Need
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              The Kona Island Coffee app brings the full aloha experience to your fingertips
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-kona-brown/10 rounded-full flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-kona-brown" />
                    </div>
                    <CardTitle className="text-xl text-kona-espresso">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-kona-espresso/70">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-kona-taupe/20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
              How It Works
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Ordering your favorite Hawaiian coffee has never been easier
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Browse & Customize', description: 'Explore our menu and personalize your drink with your favorite modifiers' },
                { step: '2', title: 'Place Order', description: 'Choose pickup time and location. Pay securely with Apple Pay, Google Pay, or card' },
                { step: '3', title: 'Pick Up', description: 'Get notified when your order is ready. Skip the line and enjoy!' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-kona-teal rounded-full flex items-center justify-center mx-auto mb-4 text-white font-league-spartan text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-league-spartan text-xl font-semibold text-kona-espresso mb-2">
                    {item.title}
                  </h3>
                  <p className="text-kona-espresso/70">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-kona-espresso text-kona-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience Mobile Aloha?
            </h2>
            <p className="text-lg text-kona-white/90 mb-8">
              Join thousands of coffee lovers who order their daily dose of Hawaiian sunshine through our app
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="teal"
                size="lg"
                className="text-lg px-8"
                asChild
              >
                <a href="#" aria-label="Download on the App Store">
                  <Download className="mr-2 w-5 h-5" />
                  Download Now
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 border-kona-white text-kona-white hover:bg-kona-white hover:text-kona-espresso"
                asChild
              >
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

export default AppPage
