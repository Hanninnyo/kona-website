"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Coffee, Heart, Leaf, Users, Star, ArrowRight, MapPin, Clock, Award, Download, Gift } from 'lucide-react'
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
    description:
      "Our signature espresso latte with authentic Kona coffee and a hint of tropical vanilla",
    price: { amount: 6.49, currency: "USD" },
    category: "espresso",
    image: "/images/menu/kona-island-latte-hot.jpg",
    tags: ["signature", "espresso", "macadamia", "kona"],
    modifiers: [],
    inStock: true,
    isPopular: true,
  },
  {
    id: "2",
    posExternalId: "POS-002",
    name: "Oʻahu Crepe",
    description:
      "Delicate French crepe filled with fresh tropical fruits and topped with coconut whipped cream",
    price: { amount: 14.49, currency: "USD" },
    category: "pastries",
    image: "/images//menu/oahu-nutella-crepe.jpg",
    tags: ["crepe", "tropical", "macadamia", "fresh"],
    modifiers: [],
    inStock: true,
    isNew: true,
  },
  {
    id: "3",
    posExternalId: "POS-003",
    name: "Ube-Banana Bread",
    description:
      "Hawaiian-style banana bread with purple ube swirl, perfectly moist and naturally sweet",
    price: { amount: 4.50, currency: "USD" },
    category: "pastries",
    image: "/images/menu/ube-banana-bread.jpg",
    tags: ["banana", "ube", "hawaiian", "sweet"],
    modifiers: [],
    inStock: true,
    isSeasonal: true,
  },
];

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    location: "Valley Medical Center",
    rating: 5,
    text: "Having Kona Island Coffee at our hospital brightens everyone's day! Their Kona Island Latte gives me the energy to care for patients.",
    avatar: "/images/avatar-sarah",
  },
  {
    name: "Marcus Rodriguez",
    location: "Bay Area",
    rating: 5,
    text: "I follow their truck around on Saturdays! The authentic Hawaiian flavors and mobile aloha experience is unmatched.",
    avatar: "/images/avatar-marcus.jpg",
  },
  {
    name: "Emily Wang",
    location: "Healthcare Worker",
    rating: 5,
    text: "The Haupia Matcha Latte from their truck is my favorite pick-me-up between shifts. True Hawaiian hospitality on wheels!",
    avatar: "/images/avatar-emily.jpg",
  },
];

export default function HomePage() {
  const handleAddToCart = (item: MenuItem) => {
    console.log("Item preview:", item);
    // No cart functionality on the marketing site
  };

  return (
    <div className="pt-20">
      {/* Storefront Now Open — Premium Hero */}
{homepageContent.announcement.enabled && (
  <section
    className="relative overflow-hidden bg-kona-espresso"
    style={{ minHeight: '88vh' }}
  >
    {/* Full-bleed storefront photo — object-contain so nothing is cropped */}
    <div className="absolute inset-0">
      <Image
        src="/images/storefront-open.jpg"
        alt="Kona Island Coffee storefront now open in Mountain View"
        fill
        className="object-contain"
        priority
        sizes="100vw"
      />
      {/* Bottom fade — merges photo into card zone */}
      <div className="absolute inset-0 bg-gradient-to-t from-kona-espresso via-kona-espresso/40 to-transparent" />
      {/* Subtle side vignettes */}
      <div className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-kona-espresso/50 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-kona-espresso/50 to-transparent" />
    </div>

    {/* Glassmorphism card — floats over the lower image */}
    <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-10 md:pb-14">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-3xl border border-white/10 p-8 md:p-10 text-center"
          style={{
            background: 'rgba(31, 19, 17, 0.58)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-kona-teal px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-teal-glow">
            Now Open ✨
          </div>

          {/* Headline */}
          <h2 className="mb-1 font-league-spartan text-3xl font-bold text-kona-white md:text-4xl">
            Now Open in Mountain View
          </h2>

          {/* Address */}
          <p className="mb-6 text-sm leading-relaxed text-white/50">
            2565 California Street STE 84<br />Mountain View, CA 94040
          </p>

          {/* Hairline divider */}
          <div className="mb-5 h-px w-full bg-white/10" />

          {/* Hours — two-column label / value grid */}
          <div className="mb-7 mx-auto grid max-w-[230px] grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm">
            <span className="text-right font-medium text-white/40">Mon–Thu</span>
            <span className="text-white/80">6:30am–5:00pm</span>
            <span className="text-right font-medium text-white/40">Fri</span>
            <span className="text-white/80">6:30am–6:00pm</span>
            <span className="text-right font-medium text-white/40">Sat</span>
            <span className="text-white/80">7:30am–6:00pm</span>
            <span className="text-right font-medium text-white/40">Sun</span>
            <span className="text-white/80">7:30am–5:00pm</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="teal"
              className="rounded-xl px-6 shadow-teal-glow hover:opacity-90"
              asChild
            >
              <a
                href="https://www.google.com/maps/search/?api=1&query=2565+California+Street+STE+84+Mountain+View+CA+94040"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="mr-2 w-4 h-4" />
                Get Directions
              </a>
            </Button>
            <Button
              className="rounded-xl border border-white/20 bg-white/10 px-6 text-kona-white shadow-none hover:bg-white/20 hover:text-kona-white"
              asChild
            >
              <a
                href="https://kona-island-coffee.square.site/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Order Online
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
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
              Discover our most beloved Hawaiian-inspired drinks and treats,
              crafted with authentic island ingredients
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
                <MenuItemCard item={item} onAddToCart={handleAddToCart} />
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
              <a
                href="https://kona-island-coffee.square.site/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Order Online
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
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
                  src="/images/coffee-truck.jpg"
                  alt="Our Kona Island Coffee truck in the Bay Area"
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
                  Our mobile ʻohana brings authentic Hawaiian coffee culture
                  directly to the Bay Area. From our flagship weekday spot at
                  Valley Medical Center to our Saturday routes throughout the
                  community, we share the spirit of aloha one cup at a time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-kona-white rounded-kona">
                  <Coffee className="w-8 h-8 text-kona-brown mx-auto mb-2" />
                  <h3 className="font-league-spartan font-bold text-kona-espresso">
                    Mobile Truck
                  </h3>
                  <p className="text-sm text-kona-espresso/70">We come to you</p>
                </div>
                <div className="text-center p-4 bg-kona-white rounded-kona">
                  <Heart className="w-8 h-8 text-kona-teal mx-auto mb-2" />
                  <h3 className="font-league-spartan font-bold text-kona-espresso">
                    Community
                  </h3>
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
              Real stories from real people who&apos;ve experienced the aloha
              spirit
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
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-kona-espresso/80 mb-4 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-kona-brown rounded-full flex items-center justify-center">
                        <span className="text-kona-white font-bold text-sm">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
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

      {/* Gift Cards Section */}
      <section className="py-16 bg-gradient-to-br from-kona-teal/10 to-kona-brown/10">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-0 shadow-kona-medium overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left Side - Content */}
                <div className="p-8 md:p-10 bg-kona-white flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <Gift className="w-10 h-10 text-kona-teal mr-3" />
                    <h2 className="font-league-spartan text-3xl md:text-4xl font-bold text-kona-espresso">
                      Gift Cards
                    </h2>
                  </div>
                  <p className="text-kona-espresso/80 text-lg leading-relaxed mb-6">
                    Share the aloha spirit with someone special! Our gift cards are the perfect way to
                    brighten someone's day with authentic Hawaiian coffee and island-inspired treats.
                    Whether it's a mahalo, celebration, or just because — give the gift of aloha. 🌺
                  </p>
                  <p className="text-kona-espresso/70 text-base leading-relaxed mb-6">
                    Gift cards can be used at our mobile coffee truck, weekend events, and our upcoming
                    Mountain View storefront. Valid for all menu items and redeemable through our Square
                    ordering system.
                  </p>
                  <div>
                    <Button
                      variant="aloha"
                      size="lg"
                      className="text-lg px-8"
                      asChild
                    >
                      <a
                        href="https://app.squareup.com/gift/MLJAP1MDQXKAP/order"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Gift className="mr-2 w-5 h-5" />
                        Buy Gift Cards
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Right Side - Decorative */}
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-kona-brown to-kona-teal flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎁</div>
                    <p className="font-hawaiian-script text-3xl text-white mb-2">
                      Mahalo nui loa
                    </p>
                    <p className="text-white/90 text-sm">
                      Thank you for spreading aloha
                    </p>
                  </div>
                  {/* Decorative coffee beans */}
                  <div className="absolute top-4 left-4 text-3xl opacity-50">☕</div>
                  <div className="absolute bottom-4 right-4 text-3xl opacity-50">🌺</div>
                  <div className="absolute top-1/2 right-8 text-2xl opacity-30">🌴</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-kona-espresso text-kona-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">🌺</div>
          <div className="absolute top-20 right-20 text-4xl">🌺</div>
          <div className="absolute bottom-20 left-20 text-5xl">🌺</div>
          <div className="absolute bottom-10 right-10 text-3xl">🌺</div>
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
              Ready to experience authentic Hawaiian coffee culture? Visit us
              today and taste the difference that true aloha makes in every cup.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
  variant="outline"
  size="lg"
  className="text-lg px-8 border-kona-white text-kona-white/80 cursor-default"
  disabled
>
  <Download className="mr-2 w-5 h-5" />
  App Coming Soon
</Button>


              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 border-kona-white text-kona-white hover:bg-kona-white hover:text-kona-espresso"
                asChild
              >
                <Link href="/locations">
                  <MapPin className="mr-2 w-5 h-5" />
                  Find a Location
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-kona-white/70">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Monday–Friday 7:30am–4:00pm at Valley Medical Center • Saturday
                Bay Area trips
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

