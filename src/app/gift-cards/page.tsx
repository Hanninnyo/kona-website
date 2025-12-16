"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Gift, Heart, Coffee, Sparkles, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Image from 'next/image'

const GiftCardsPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()

  const occasions = [
    {
      icon: Heart,
      title: 'Show Appreciation',
      description: 'Say mahalo to someone special'
    },
    {
      icon: Sparkles,
      title: 'Celebrate',
      description: 'Perfect for birthdays and milestones'
    },
    {
      icon: Coffee,
      title: 'Share Aloha',
      description: 'Spread the island coffee love'
    }
  ]

  return (
    <div className="pt-20 min-h-screen bg-kona-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-kona-teal/10 to-kona-brown/10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-16 h-16 text-kona-teal" />
            </div>
            <h1 className="font-league-spartan text-4xl md:text-5xl lg:text-6xl font-bold text-kona-espresso mb-6">
              Give the Gift of Aloha
            </h1>
            <p className="text-lg md:text-xl text-kona-espresso/70 leading-relaxed mb-8">
              Share the warmth of Hawaiian coffee culture with someone you love. Kona Island Coffee
              gift cards are the perfect way to brighten anyone's day with authentic island flavors.
            </p>
            <Button
              variant="aloha"
              size="lg"
              className="text-xl px-10 py-6"
              asChild
            >
              <a
                href="https://app.squareup.com/gift/MLJAP1MDQXKAP/order"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Gift className="mr-2 w-6 h-6" />
                Buy Gift Cards Now
              </a>
            </Button>
          </motion.div>

          {/* Main Gift Card Display */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-0 shadow-kona-medium overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left Side - Content */}
                <div className="p-8 md:p-10 bg-kona-white flex flex-col justify-center">
                  <h2 className="font-league-spartan text-2xl md:text-3xl font-bold text-kona-espresso mb-4">
                    Why Gift Cards?
                  </h2>
                  <p className="text-kona-espresso/80 text-lg leading-relaxed mb-6">
                    Our gift cards are more than just a present — they're an invitation to experience
                    the aloha spirit. Perfect for coffee lovers, food enthusiasts, and anyone who
                    appreciates authentic Hawaiian flavors.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <span className="text-kona-teal mr-2 text-xl">✓</span>
                      <span className="text-kona-espresso/70">Valid at our mobile truck and upcoming storefront</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-kona-teal mr-2 text-xl">✓</span>
                      <span className="text-kona-espresso/70">Redeemable for any menu item</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-kona-teal mr-2 text-xl">✓</span>
                      <span className="text-kona-espresso/70">Easy to purchase and send digitally</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-kona-teal mr-2 text-xl">✓</span>
                      <span className="text-kona-espresso/70">No expiration date</span>
                    </li>
                  </ul>
                </div>

                {/* Right Side - Decorative */}
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-kona-brown to-kona-teal flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-7xl mb-4">🎁</div>
                    <p className="font-hawaiian-script text-4xl text-white mb-3">
                      Mahalo nui loa
                    </p>
                    <p className="text-white/90 text-base">
                      Thank you for spreading aloha
                    </p>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-6 left-6 text-4xl opacity-50">☕</div>
                  <div className="absolute bottom-6 right-6 text-4xl opacity-50">🌺</div>
                  <div className="absolute top-1/2 right-10 text-3xl opacity-30">🌴</div>
                  <div className="absolute bottom-1/3 left-10 text-2xl opacity-30">🏄‍♀️</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Perfect For Section */}
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
              Perfect for Any Occasion
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Whether it's a thank you, celebration, or just because — give the gift of aloha
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {occasions.map((occasion, index) => (
              <motion.div
                key={occasion.title}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full text-center border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-kona-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <occasion.icon className="w-8 h-8 text-kona-teal" />
                    </div>
                    <h3 className="font-league-spartan text-xl font-semibold text-kona-espresso mb-2">
                      {occasion.title}
                    </h3>
                    <p className="text-kona-espresso/70">
                      {occasion.description}
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
              Giving the gift of aloha is easy
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Choose Amount', description: 'Select the perfect gift card value' },
                { step: '2', title: 'Send or Print', description: 'Email it instantly or print at home' },
                { step: '3', title: 'They Enjoy', description: 'Recipient redeems for their favorite drinks' }
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
              Ready to Spread Aloha?
            </h2>
            <p className="text-lg text-kona-white/90 mb-8">
              Purchase a Kona Island Coffee gift card today and share the warmth of Hawaiian hospitality
            </p>

            <Button
              variant="teal"
              size="lg"
              className="text-xl px-10 py-6"
              asChild
            >
              <a
                href="https://app.squareup.com/gift/MLJAP1MDQXKAP/order"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Gift className="mr-2 w-6 h-6" />
                Buy Gift Cards Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </a>
            </Button>

            <p className="text-kona-white/60 text-sm mt-6">
              Questions? Contact us at{' '}
              <a href="mailto:contact@konaislandcoffee.com" className="text-kona-teal hover:underline">
                contact@konaislandcoffee.com
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default GiftCardsPage
