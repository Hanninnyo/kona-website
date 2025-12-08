"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Leaf, Users, Award, Globe, Coffee } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CoffeeBeanParticles, VolcanicSteam, OceanWaves } from '@/components/volcano-effects'

const StoryPage: React.FC = () => {
  const timeline = [
    {
      year: "2022",
      title: "The Big Island Discovery",
      description: "Our journey began during a trip to the Big Island where we first tasted the rich, smooth flavors of authentic Kona coffee - it was love at first sip."
    },
    {
      year: "2022",
      title: "The Coffee Truck Dream",
      description: "Inspired by the Hawaiian coffee culture and spirit of aloha, we decided to bring this exceptional coffee experience to the Bay Area through our mobile coffee truck."
    },
    {
      year: "2023",
      title: "First Coffee Truck Launch",
      description: "Launched our first Kona Island Coffee truck, starting with a single route and a mission to share authentic Hawaiian coffee with our community."
    },
    {
      year: "2023",
      title: "Valley Medical Partnership",
      description: "Established our flagship weekday location at Valley Medical Center, serving healthcare heroes with premium Kona coffee and island-inspired treats."
    },
    {
      year: "2024",
      title: "Saturday Bay Area Routes",
      description: "Expanded our service with Saturday routes throughout the Bay Area, bringing our mobile coffee experience to neighborhoods and communities."
    },
    {
      year: "2025",
      title: "Growing Kona ʻOhana, our first brick-and-mortar shop opening end of year at Mountain View San Antonio Village Center",
      description: "Continuing to roll through the Bay Area while preparing to open our first permanent location, expanding our coffee family."
    }
  ]

  const values = [
    {
      icon: Heart,
      title: "ʻOhana (Family)",
      description: "We treat every customer, farmer, and team member as family, building relationships that span generations.",
      hawaiianPhrase: "ʻOhana means nobody gets left behind"
    },
    {
      icon: Leaf,
      title: "Mālama ʻĀina (Care for the Land)",
      description: "Protecting and nurturing the environment that produces our coffee through sustainable farming practices.",
      hawaiianPhrase: "The land is our responsibility"
    },
    {
      icon: Users,
      title: "Lōkahi (Unity)",
      description: "Working together with farmers, communities, and customers to create something bigger than ourselves.",
      hawaiianPhrase: "In unity there is strength"
    },
    {
      icon: Award,
      title: "Hoʻokipa (Hospitality)",
      description: "Welcoming every guest with the genuine warmth and generosity of the Hawaiian spirit.",
      hawaiianPhrase: "Welcome with open arms"
    }
  ]

  // 📸 IMAGE INSTRUCTIONS:
  // To change farmer photos, upload your images to /public/images/farmers/ folder
  // and update the "image" paths below. Images should be:
  // - Square format (1:1 ratio, recommended 800x800px)
  // - JPG or PNG format
  // - Named descriptively (e.g., "keoni-nakamura.jpg")
  //
  // Example: To replace Keoni's photo:
  // 1. Upload your new photo to: /public/images/farmers/keoni-nakamura.jpg
  // 2. The path below ("/images/farmers/farming-ohana-1.jpg") will automatically load it
  //
  const farmers = [
    {
      name: "Keoni Nakamura",
      farm: "Nakamura Family Farm",
      generations: "4th Generation",
      specialty: "Traditional Natural Process",
      image: "/images/farmers/farming-ohana-1.jpg", // Replace with your farmer photo
      quote: "Our family has been growing coffee on these slopes for over 100 years. The partnership with Kona Island Coffee allows us to continue our tradition while reaching coffee lovers around the world."
    },
    {
      name: "Lei Tanaka",
      farm: "Mauka Coffee Estate",
      generations: "3rd Generation",
      specialty: "Organic Cultivation",
      image: "/images/farmers/farming-ohana-2.jpg", // Replace with your farmer photo
      quote: "Sustainability isn&apos;t just a practice for us—it&apos;s our kuleana (responsibility) to the land that has provided for our ʻohana for generations."
    },
    {
      name: "Paulo Silva",
      farm: "Silva Heritage Farm",
      generations: "5th Generation",
      specialty: "Honey Process Innovation",
      image: "/images/farmers/farming-ohana-3.jpg", // Replace with your farmer photo
      quote: "Innovation and tradition can work together. We honor our ancestors while finding new ways to bring out the best in every bean."
    }
  ]

  return (
    <div className="pt-20 min-h-screen bg-kona-white relative overflow-hidden">
      <CoffeeBeanParticles />
      <VolcanicSteam />
      <OceanWaves />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-kona-brown/20 to-kona-teal/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hawaiian-sunrise.jpg"
            alt="Hawaiian Coffee Farm at Sunrise"
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
              Our Story
            </h1>
            <p className="font-hawaiian-script text-2xl md:text-3xl text-kona-teal mb-6">
              E komo mai - Welcome to our ʻohana
            </p>
            <p className="text-kona-espresso/80 text-lg md:text-xl leading-relaxed">
              From the volcanic slopes of Hawaiʻi to the heart of the Bay Area, our journey is one of passion,
              tradition, and the enduring spirit of aloha that connects us all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16">
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
                  src="/images/founders-hawaii.jpg"
                  alt="Founders in Hawaii"
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
              <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso">
                Our Journey
              </h2>

              <p className="text-kona-espresso/80 text-lg leading-relaxed">
                Our coffee journey began with a shared love for two things: exceptional coffee and the enchanting spirit of Hawaiʻi. On a trip to the Big Island, we tasted 100% Kona coffee for the very first time — rich, smooth, and full of warmth — and it was love at first sip.
              </p>

              <p className="text-kona-espresso/80 text-lg leading-relaxed">
                On the flight home, we couldn't stop talking about it. What if we could bottle up that feeling of sunshine, ocean breeze, and aloha, and share it with our community in the Bay Area? That's where the dream of Kona Island Coffee was born.
              </p>

              <p className="text-kona-espresso/80 text-lg leading-relaxed">
                We're Hanna Mejia Hans and Jorge Mejia, the husband-and-wife team behind Kona Island Coffee. With a lot of heart and a little bit of courage, we turned that dream into a mobile coffee ʻohana on wheels. We spent months researching, designing our trailer, partnering with local Kona farmers, and crafting a menu that celebrates both authentic Hawaiian flavors and the diverse tastes of our Bay Area community.
              </p>

              <p className="text-kona-espresso/80 text-lg leading-relaxed">
                Every cup we serve is our way of saying "e komo mai" — welcome. From our weekday spot at Valley Medical Center to weekend events and future storefront in Mountain View, our goal is to bring a moment of island calm into your busy day.
              </p>

              <p className="text-kona-espresso/80 text-lg leading-relaxed">
                When you visit Kona Island Coffee, you're not just grabbing a drink. You're supporting small family farms in Hawaiʻi, a local family business here in California, and a vision built on love, resilience, and the spirit of aloha. We're so grateful you're here, and we can't wait to share a cup with you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
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
              Our Journey Through Time
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              From the first coffee plants to our thriving Bay Area community
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-kona-teal transform md:-translate-x-0.5"></div>

            {timeline.map((event, index) => (
              <motion.div
                key={`${event.year}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-kona-teal rounded-full border-4 border-kona-white shadow-lg transform md:-translate-x-1/2"></div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <Card className="border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <span className="bg-kona-brown text-kona-white px-3 py-1 rounded-full text-sm font-bold">
                          {event.year}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-kona-espresso">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-kona-espresso/80">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
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
              Our Hawaiian Values
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              These ancient Hawaiian principles guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-kona-brown/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-kona-brown" />
                    </div>
                    <CardTitle className="text-lg text-kona-espresso">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-kona-espresso/80 mb-4 leading-relaxed">
                      {value.description}
                    </p>
                    <p className="font-hawaiian-script text-kona-teal italic text-sm">
                      {value.hawaiianPhrase}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Farmer Partners */}
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
              Our Farming ʻOhana
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Meet the multi-generational families who grow our coffee with passion and tradition
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {farmers.map((farmer, index) => (
              <motion.div
                key={farmer.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow h-full">
                  <div className="relative h-64">
                    <Image
                      src={farmer.image}
                      alt={farmer.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-kona-espresso">
                      {farmer.name}
                    </CardTitle>
                    <p className="text-kona-brown font-medium">{farmer.farm}</p>
                    <p className="text-kona-espresso/70 text-sm">{farmer.generations} • {farmer.specialty}</p>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-kona-espresso/80 italic border-l-4 border-kona-teal pl-4">
                      &ldquo;{farmer.quote}&rdquo;
                    </blockquote>
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
            <Coffee className="w-12 h-12 text-kona-teal mx-auto mb-4" />
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold mb-4">
              Become Part of Our ʻOhana
            </h2>
            <p className="font-hawaiian-script text-2xl text-kona-teal mb-4">
              E kipa mai - Come find us
            </p>
            <p className="text-lg text-kona-white/90 mb-8">
              Follow our coffee truck around the Bay Area and experience authentic Hawaiian hospitality on wheels.
              Every cup helps support our farming families and strengthens our mobile community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="teal" size="lg" asChild>
                <a href="/locations">Find Our Truck</a>
              </Button>
              <Button variant="outline" size="lg" className="border-kona-white text-kona-white hover:bg-kona-white hover:text-kona-espresso" asChild>
                <a href="/coffee">Learn About Our Coffee</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default StoryPage