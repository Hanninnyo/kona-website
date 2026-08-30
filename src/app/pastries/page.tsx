"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Coffee, Heart, Leaf, ChefHat } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VolcanicSteam } from '@/components/volcano-effects'

const PastriesPage: React.FC = () => {
  const pastries = [
    {
      name: "Malasada",
      hawaiianName: "Malassada",
      description: "Traditional Portuguese-Hawaiian donuts, light and fluffy, rolled in cinnamon sugar",
      price: "$3.25",
      image: null as string | null,
      tags: ["Traditional", "Sweet", "Fresh Daily"],
      pairsWith: ["Kona Estate Blend", "Hawaiian Latte"]
    },
    {
      name: "Haupia Tart",
      hawaiianName: "Haupia Tart",
      description: "Coconut pudding tart with macadamia nut crust and tropical fruit garnish",
      price: "$5.95",
      image: null,
      tags: ["Coconut", "Gluten-Free Option", "Signature"],
      pairsWith: ["Cold Brew", "Tropical Latte"]
    },
    {
      name: "Kona Coffee Cake",
      hawaiianName: "Keke Kope Kona",
      description: "Moist coffee cake infused with our signature Kona blend and streusel topping",
      price: "$4.50",
      image: null,
      tags: ["Coffee Infused", "House Made", "Popular"],
      pairsWith: ["Any Espresso Drink", "French Press"]
    },
    {
      name: "Pineapple Upside Down Cake",
      hawaiianName: "Keke Hala Kahuli",
      description: "Classic Hawaiian dessert with caramelized pineapple and maraschino cherries",
      price: "$4.25",
      image: null,
      tags: ["Tropical", "Seasonal", "Island Classic"],
      pairsWith: ["Medium Roast", "Iced Coffee"]
    }
  ]

  /*
    Sweet crepes only, and only from the truck. Kona does not serve savory
    crepes, and the Mountain View café does not serve crepes at all — the
    savory menu that used to sit in this array described neither. Both facts
    are owner-confirmed, and the labelling below exists so this page cannot
    send someone to the storefront for a crepe.
  */
  const crepes = [
    {
      category: "Sweet Crepes",
      hawaiianName: "Crepe Mea ʻAi",
      items: [
        {
          name: "Tropical Paradise",
          description: "Fresh mango, pineapple, coconut flakes, and passion fruit coulis",
          price: "$9.95",
          tags: ["Vegan Option", "Fresh Fruit"]
        },
        {
          name: "Macadamia Nut Chocolate",
          description: "Dark chocolate, roasted macadamia nuts, and vanilla bean ice cream",
          price: "$10.95",
          tags: ["Signature", "Indulgent"]
        },
        {
          name: "Haupia Dream",
          description: "Coconut cream, toasted coconut, fresh berries, and honey drizzle",
          price: "$9.50",
          tags: ["Coconut", "Popular"]
        }
      ]
    }
  ]

  const pairings = [
    {
      pastry: "Malasada",
      coffee: "Kona Estate Blend",
      reason: "The caramelized sugar pairs beautifully with chocolate notes"
    },
    {
      pastry: "Haupia Tart",
      coffee: "Cold Brew",
      reason: "Coconut cream balances the smooth, bold cold brew perfectly"
    },
    {
      pastry: "Kona Coffee Cake",
      coffee: "Espresso",
      reason: "Coffee on coffee creates a harmonious flavor symphony"
    }
  ]

  return (
    <div className="pt-20 min-h-screen bg-kona-white relative overflow-hidden">
      <VolcanicSteam />
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-kona-brown/20 to-kona-teal/20 relative overflow-hidden">
        {/* No authentic pastries-hero photograph exists; the section keeps its
            gradient ground rather than a broken image path. */}
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-league-spartan text-4xl md:text-6xl font-bold text-kona-espresso mb-6">
              Island-Inspired Pastries & Crepes
            </h1>
            <p className="text-kona-espresso/80 text-lg md:text-xl mb-8 leading-relaxed">
              Handcrafted daily with island flavors and the finest local ingredients.
              Availability varies between the Mountain View café and the Kona Coffee
              Truck — sweet crepes are served from the truck.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="default" className="text-sm px-4 py-2">
                <ChefHat className="w-4 h-4 mr-2" />
                Made Fresh Daily
              </Badge>
              <Badge variant="teal" className="text-sm px-4 py-2">
                <Leaf className="w-4 h-4 mr-2" />
                Local Ingredients
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Island Traditions
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Traditional Pastries */}
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
              Hawaiian Pastries
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Traditional island treats made with authentic recipes and local ingredients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastries.map((pastry, index) => (
              <motion.div
                key={pastry.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow h-full">
                  {pastry.image ? (
                    <div className="relative h-48">
                      <Image
                        src={pastry.image}
                        alt={pastry.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    // No authentic photograph exists for this item. A deliberate
                    // typographic panel, not a broken image path or an empty box.
                    <div className="flex h-48 flex-col items-center justify-center gap-2 bg-kona-brown/10 text-kona-espresso/50">
                      <ChefHat className="h-8 w-8" aria-hidden="true" />
                      <span className="font-hawaiian-script text-sm">Photo coming soon</span>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-kona-espresso">
                          {pastry.name}
                        </CardTitle>
                        <p className="font-hawaiian-script text-kona-teal text-sm">
                          {pastry.hawaiianName}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-kona-brown">
                        {pastry.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-kona-espresso/80 text-sm mb-4">
                      {pastry.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {pastry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-xs text-kona-espresso/60 mb-1">Perfect with:</p>
                      <p className="text-xs font-medium text-kona-brown">
                        {pastry.pairsWith.join(', ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Crepes */}
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
              Sweet Crepes — at the Coffee Truck
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              French technique meets Hawaiian flavors in our handcrafted sweet crepes,
              served from the Kona Coffee Truck. Crepes are not available at the
              Mountain View café.
            </p>
          </motion.div>

          {crepes.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className="mb-12"
            >
              <div className="text-center mb-8">
                <h3 className="font-league-spartan text-2xl font-bold text-kona-espresso mb-2">
                  {category.category}
                </h3>
                <p className="font-hawaiian-script text-kona-teal text-lg">
                  {category.hawaiianName}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <Card
                    key={item.name}
                    className="border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg text-kona-espresso">
                          {item.name}
                        </CardTitle>
                        <span className="text-lg font-bold text-kona-brown">
                          {item.price}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-kona-espresso/80 mb-4">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perfect Pairings */}
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
              Perfect Pairings
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Our chef&apos;s recommended combinations for the ultimate taste experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pairings.map((pairing, index) => (
              <motion.div
                key={pairing.pastry}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-kona-brown to-kona-teal rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg text-kona-espresso">
                      {pairing.pastry} + {pairing.coffee}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-kona-espresso/80 italic">
                      &ldquo;{pairing.reason}&rdquo;
                    </p>
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
            <ChefHat className="w-12 h-12 text-kona-teal mx-auto mb-4" />
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold mb-4">
              Fresh Daily, Made with Aloha
            </h2>
            <p className="text-lg text-kona-white/90 mb-8">
              Experience the perfect combination of French technique and Hawaiian
              flavors, made fresh each morning. Sweet crepes are served from the Kona
              Coffee Truck.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/*
                The truck's ordering site, not the café's. This page's crepes
                are served from the truck only, and the button that sits under
                them has to go to the place that makes them — the other Square
                address on this site redirects to Mountain View ordering, which
                would take someone to a counter that has no crepes.
              */}
              <Button variant="teal" size="lg" asChild>
                <a
                  href="https://kona-island-coffee.square.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order from the Truck
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-kona-white text-kona-white hover:bg-kona-white hover:text-kona-espresso" asChild>
                <a href="/locations">Visit Us Today</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PastriesPage
