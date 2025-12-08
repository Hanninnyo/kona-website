"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Users, Coffee, Calendar, Mail, Phone, CheckCircle2, Cake, Briefcase, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Image from 'next/image'

const CateringPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()

  const services = [
    {
      icon: Briefcase,
      title: 'Corporate Events',
      description: 'Impress clients and energize your team with our premium Hawaiian coffee bar service'
    },
    {
      icon: Heart,
      title: 'Weddings',
      description: 'Add a touch of aloha to your special day with our authentic island coffee experience'
    },
    {
      icon: Cake,
      title: 'Private Parties',
      description: 'From birthdays to celebrations, bring the coffee truck experience to your event'
    },
    {
      icon: Users,
      title: 'Community Events',
      description: 'Serving festivals, farmers markets, and community gatherings with mobile aloha'
    }
  ]

  const packages = [
    {
      name: 'Essential',
      price: 'Starting at $500',
      features: [
        'Get our mobile coffee truck on-site',
        'Dedicated barista team',
        'Basic setup and cleanup',
        'Customers pay out of pocket',
        'Minimum guarantee of 100 paying customers'
      ]
    },
    {
      name: 'Premium',
      price: 'Starting at $1000',
      features: [
        'Mobile coffee truck on-site',
        'Up to 100 servings included',
        '5 signature drink options',
        '4-hour service window',
        'Custom branded signage',
        'Dedicated barista team'
      ],
      popular: true
    },
    {
      name: 'Deluxe',
      price: 'Custom Quote',
      features: [
        'Mobile coffee truck on-site',
        'Unlimited servings',
        'Full menu access',
        'Premium pastries & food options',
        'Full-day service',
        'Custom branded cups',
        'Dedicated barista team'
      ]
    }
  ]

  const process = [
    { step: '1', title: 'Contact Us', description: 'Fill out our inquiry form or call us directly' },
    { step: '2', title: 'Plan Together', description: 'We\'ll work with you to customize the perfect menu' },
    { step: '3', title: 'Confirm Details', description: 'Finalize date, time, location, and guest count' },
    { step: '4', title: 'Enjoy!', description: 'We handle everything while you enjoy your event' }
  ]

  return (
    <div className="pt-20 min-h-screen bg-kona-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-kona-brown/10 to-kona-teal/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-league-spartan text-4xl md:text-5xl lg:text-6xl font-bold text-kona-espresso mb-4">
                Catering & Events
              </h1>
              <p className="text-lg md:text-xl text-kona-espresso/70 mb-8 leading-relaxed">
                Bring the authentic Hawaiian coffee experience to your next event. Our mobile coffee truck
                delivers aloha wherever you need it in the Bay Area.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="aloha" size="lg" asChild>
                  <a href="#contact">
                    <Mail className="mr-2 w-5 h-5" />
                    Request Quote
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:+14085136455">
                    <Phone className="mr-2 w-5 h-5" />
                    (408) 513-6455
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-96 rounded-kona overflow-hidden shadow-kona-medium"
            >
              <Image
                src="/images/coffee-truck-event.jpg"
                alt="Kona Island Coffee truck at an event"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/placeholder-drink.jpg'
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
              From intimate gatherings to large corporate events, we bring the aloha spirit to every celebration
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full text-center border-0 shadow-kona-soft hover:shadow-kona-medium transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-kona-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <service.icon className="w-8 h-8 text-kona-brown" />
                    </div>
                    <CardTitle className="text-xl text-kona-espresso">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-kona-espresso/70">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
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
              Catering Packages
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Choose the package that fits your event, or let us create a custom experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-kona-teal text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full ${pkg.popular ? 'border-2 border-kona-teal shadow-kona-medium' : 'border-0 shadow-kona-soft'}`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-kona-espresso mb-2">
                      {pkg.name}
                    </CardTitle>
                    <div className="font-league-spartan text-3xl font-bold text-kona-brown">
                      {pkg.price}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-kona-teal flex-shrink-0 mt-0.5" />
                          <span className="text-kona-espresso/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={pkg.popular ? "aloha" : "outline"}
                      className="w-full mt-6"
                      asChild
                    >
                      <a href="#contact">Get Started</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              How It Works
            </h2>
            <p className="text-kona-espresso/70 text-lg max-w-2xl mx-auto">
              Planning your event catering is simple and stress-free
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {process.map((item, index) => (
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

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-kona-espresso text-kona-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-league-spartan text-3xl md:text-4xl font-bold mb-4">
              Let's Plan Your Event
            </h2>
            <p className="text-lg text-kona-white/90 mb-8">
              Contact us today to discuss your catering needs and get a custom quote
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-kona-white/10 border-kona-white/20 text-center">
                <CardContent className="p-6">
                  <Phone className="w-8 h-8 mx-auto mb-3 text-kona-teal" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <a href="tel:+14085136455" className="text-kona-white/90 hover:text-kona-teal transition-colors">
                    (408) 513-6455
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-kona-white/10 border-kona-white/20 text-center">
                <CardContent className="p-6">
                  <Mail className="w-8 h-8 mx-auto mb-3 text-kona-teal" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <a href="mailto:contact@konaislandcoffee.com" className="text-kona-white/90 hover:text-kona-teal transition-colors">
                    contact@konaislandcoffee.com
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-kona-white/10 border-kona-white/20 text-center">
                <CardContent className="p-6">
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-kona-teal" />
                  <h3 className="font-semibold mb-2">Book Ahead</h3>
                  <p className="text-kona-white/90 text-sm">
                    2-week minimum for event bookings
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button variant="teal" size="lg" className="text-lg px-8" asChild>
              <a href="mailto:contact@konaislandcoffee.com">
                <Mail className="mr-2 w-5 h-5" />
                Request a Quote
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CateringPage
