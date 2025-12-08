"use client"

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Coffee, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const MenuPreviewPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()

  // Redirect to Square ordering page after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://kona-island-coffee-llc.square.site/'
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="pt-20 min-h-screen bg-kona-white relative overflow-hidden">
      {/* Centered Message */}
      <section className="py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Coffee className="w-16 h-16 text-kona-brown mx-auto mb-6 animate-pulse" />

            <h1 className="font-league-spartan text-4xl md:text-5xl font-bold text-kona-espresso mb-6">
              View Our Full Menu
            </h1>

            <p className="text-kona-espresso/70 text-lg mb-8">
              Our complete menu with online ordering is now available through Square.
              You'll be automatically redirected in a moment, or click the button below to go there now.
            </p>

            <Card className="mb-8 border-0 shadow-kona-soft">
              <CardContent className="p-8">
                <p className="text-kona-espresso/80 mb-6">
                  ✨ Browse our full selection of Hawaiian coffee, specialty drinks, pastries, and more
                </p>
                <p className="text-kona-espresso/80 mb-6">
                  🛒 Order online for pickup
                </p>
                <p className="text-kona-espresso/80">
                  ☕ Enjoy authentic Kona coffee wherever you are
                </p>
              </CardContent>
            </Card>

            <Button
              variant="aloha"
              size="lg"
              className="text-lg px-8"
              onClick={() => window.location.href = 'https://kona-island-coffee-llc.square.site/'}
            >
              <ExternalLink className="mr-2 w-5 h-5" />
              Order Online Now
            </Button>

            <p className="text-kona-espresso/50 text-sm mt-6">
              Redirecting automatically in 3 seconds...
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default MenuPreviewPage
