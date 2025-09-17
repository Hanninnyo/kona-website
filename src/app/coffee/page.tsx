"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Coffee, Mountain, Leaf, Award, Heart, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CoffeeBeanParticles } from '@/components/volcano-effects'

const CoffeePage: React.FC = () => {
  const coffeeOrigins = [
    {
      name: "Hualalai Estate",
      region: "North Kona",
      altitude: "1,500-2,000 ft",
      notes: "Chocolate, caramel, citrus",
      process: "Washed",
      image: "/images/hualalai-estate.jpg"
    },
    {
      name: "Mauna Loa Slopes",
      region: "South Kona",
      altitude: "2,000-3,000 ft",
      notes: "Nutty, smooth, vanilla",
      process: "Natural",
      image: "/images/mauna-loa-slopes.jpg"
    },
    {
      name: "Holualoa Village",
      region: "Central Kona",
      altitude: "1,400-1,800 ft",
      notes: "Floral, bright, honey",
      process: "Honey",
      image: "/images/holualoa-village.jpg"
    }
  ]

  const roastProfiles = [
    {
      name: "Light Roast",
      hawaiianName: "Lā Hou (New Day)",
      description: "Bright and crisp with pronounced acidity and floral notes",
      temperature: "385-400°F",
      color: "bg-amber-200",
      characteristics: ["Floral", "Bright", "Fruity", "High Acidity"]
    },
    {
      name: "Medium Roast",
      hawaiianName: "Lā Awakea (Midday)",
      description: "Balanced sweetness with chocolate and caramel undertones",
      temperature: "410-430°F",
      color: "bg-amber-600",
      characteristics: ["Balanced", "Chocolate", "Caramel", "Smooth"]
    },
    {
      name: "Dark Roast",
      hawaiianName: "Lā Ahiahi (Evening)",
      description: "Rich and bold with deep, smoky flavors",
      temperature: "440-450°F",
      color: "bg-amber-900",
      characteristics: ["Bold", "Smoky", "Low Acidity", "Full Body"]
    }
  ]

  const brewGuides = [
    {
      method: "Pour Over",
      hawaiianName: "Wai Ninini (Pouring Water)",
      ratio: "1:15",
      time: "3-4 minutes",
      grind: "Medium-fine",
      icon: Coffee
    },
    {
      method: "French Press",
      hawaiianName: "Kaomi (Press)",
      ratio: "1:12",
      time: "4 minutes",
      grind: "Coarse",
      icon: Coffee
    },
    {
      method: "Cold Brew",
      hawaiianName: "Kope Anu (Cold Coffee)",
      ratio: "1:8",
      time: "12-24 hours",
      grind: "Extra coarse",
      icon: Coffee
    }
  ]

  return (
    <div className="pt-20 min-h-screen bg-kona-white relative overflow-hidden">
      <CoffeeBeanParticles />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-kona-brown/20 to-kona-teal/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/kona-coffee-plantation.jpg"
            alt="Kona Coffee Plantation"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-league-spartan text-4xl md:text-6xl font-bold text-kona-espresso mb-6">
              100% Hawaiian Kona Coffee
            </h1>
            <p className="text-kona-espresso/80 text-lg md:text-xl mb-8 leading-relaxed">
              From the volcanic slopes of Mauna Loa to your cup, experience the world&apos;s most exclusive coffee terroir
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="default" className="text-sm px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Estate Grown
              </Badge>
              <Badge variant="teal" className="text-sm px-4 py-2">
                <Leaf className="w-4 h-4 mr-2" />
                Sustainably Sourced
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Mountain className="w-4 h-4 mr-2" />
                Single Origin
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coffee Origins */}
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
              Our Partner Farms
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Direct relationships with multigenerational Hawaiian families who have perfected the art of Kona coffee cultivation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coffeeOrigins.map((origin, index) => (
              <motion.div
                key={origin.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={origin.image}
                      alt={origin.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-kona-espresso">
                      {origin.name}
                    </CardTitle>
                    <p className="text-kona-brown font-medium">{origin.region}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-kona-espresso/70">Altitude:</span>
                        <span className="text-sm font-medium">{origin.altitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-kona-espresso/70">Process:</span>
                        <span className="text-sm font-medium">{origin.process}</span>
                      </div>
                      <div>
                        <span className="text-sm text-kona-espresso/70">Tasting Notes:</span>
                        <p className="text-sm font-medium text-kona-brown">{origin.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roast Profiles */}
      <section className="py-16 bg-kona-taupe/10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso mb-4">
              Roast Profiles
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Each roast level reveals different characteristics of our premium Kona beans
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roastProfiles.map((roast, index) => (
              <motion.div
                key={roast.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow h-full">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 ${roast.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <Coffee className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-kona-espresso">
                      {roast.name}
                    </CardTitle>
                    <p className="font-hawaiian-script text-kona-teal">
                      {roast.hawaiianName}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-kona-espresso/80 mb-4">{roast.description}</p>
                    <div className="mb-4">
                      <span className="text-sm text-kona-espresso/70">Temperature: </span>
                      <span className="text-sm font-medium">{roast.temperature}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {roast.characteristics.map((char) => (
                        <Badge key={char} variant="secondary" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brew Guides */}
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
              Brewing Guides
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Unlock the full potential of your Kona coffee with these time-tested brewing methods
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brewGuides.map((guide, index) => (
              <motion.div
                key={guide.method}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow text-center h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-kona-brown/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <guide.icon className="w-8 h-8 text-kona-brown" />
                    </div>
                    <CardTitle className="text-xl text-kona-espresso">
                      {guide.method}
                    </CardTitle>
                    <p className="font-hawaiian-script text-kona-teal">
                      {guide.hawaiianName}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-sm text-kona-espresso/70">Ratio:</span>
                        <span className="text-sm font-medium">{guide.ratio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-kona-espresso/70">Time:</span>
                        <span className="text-sm font-medium">{guide.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-kona-espresso/70">Grind:</span>
                        <span className="text-sm font-medium">{guide.grind}</span>
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
      <section className="py-16 bg-kona-espresso text-kona-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Heart className="w-12 h-12 text-kona-teal mx-auto mb-4" />
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold mb-4">
              Experience True Kona Coffee
            </h2>
            <p className="text-lg text-kona-white/90 mb-8">
              Taste the difference that authentic Hawaiian terroir makes. Order our premium single-origin Kona coffee today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="teal" size="lg" asChild>
                <a href="/menu">Shop Kona Coffee</a>
              </Button>
              <Button variant="outline" size="lg" className="border-kona-white text-kona-white hover:bg-kona-white hover:text-kona-espresso">
                Learn About Subscription
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CoffeePage