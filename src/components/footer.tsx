"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Coffee, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ]

  const quickLinks = [
    { label: 'Menu', href: '/menu' },
    { label: 'Coffee', href: '/coffee' },
    { label: 'Pastries & Crepes', href: '/pastries' },
    { label: 'Our Story', href: '/story' },
    { label: 'Locations', href: '/locations' },
    { label: 'Order Online', href: '/order' },
  ]

  const supportLinks = [
    { label: 'Gift Cards', href: '/gift-cards' },
    { label: 'Loyalty Program', href: '/loyalty' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]

  return (
    <footer className="bg-kona-espresso text-kona-white">
      {/* Wave divider */}
      <div className="relative">
        <svg
          className="w-full h-12 text-kona-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="wave-animation"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="wave-animation"
            style={{ animationDelay: '-1s' }}
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="wave-animation"
            style={{ animationDelay: '-2s' }}
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              className="flex items-center space-x-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-kona-brown rounded-full flex items-center justify-center">
                <Coffee className="w-7 h-7 text-kona-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-league-spartan text-2xl font-bold">
                  Kona Island
                </span>
                <span className="font-league-spartan text-kona-teal -mt-1">
                  Coffee
                </span>
              </div>
            </motion.div>

            <motion.p
              className="text-kona-white/80 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Bringing the authentic flavors of Hawaiian Kona coffee to the Bay Area.
              Experience the warmth of aloha in every cup.
            </motion.p>

            {/* Social Links */}
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="text-kona-white/80 hover:text-kona-teal hover:bg-kona-white/10"
                  asChild
                >
                  <Link href={social.href} aria-label={social.label}>
                    <social.icon className="w-5 h-5" />
                  </Link>
                </Button>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-league-spartan text-lg font-semibold mb-6 text-kona-teal">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-kona-white/80 hover:text-kona-teal transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="font-league-spartan text-lg font-semibold mb-6 text-kona-teal">
              Support
            </h3>
            <nav className="space-y-3">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-kona-white/80 hover:text-kona-teal transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="font-league-spartan text-lg font-semibold mb-6 text-kona-teal">
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-kona-teal mt-0.5 flex-shrink-0" />
                <div className="text-kona-white/80">
                  <p>Monday–Friday 7:30am–4:00pm at Valley Medical Center</p>
                  <p>Saturday Bay Area trips</p>
                  <Link href="/locations" className="text-kona-teal hover:underline">
                    View all locations
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-kona-teal flex-shrink-0" />
                <a
                  href="tel:+1-555-KONA-123"
                  className="text-kona-white/80 hover:text-kona-teal transition-colors"
                >
                  (555) KONA-123
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-kona-teal flex-shrink-0" />
                <a
                  href="mailto:aloha@konaislandcoffee.com"
                  className="text-kona-white/80 hover:text-kona-teal transition-colors"
                >
                  aloha@konaislandcoffee.com
                </a>
              </div>
            </div>

            {/* Hawaiian Greeting */}
            <div className="mt-6 p-4 bg-kona-brown/20 rounded-kona">
              <p className="font-hawaiian-script text-kona-teal text-lg">
                Mahalo nui loa!
              </p>
              <p className="text-kona-white/80 text-sm mt-1">
                Thank you very much for choosing us
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-kona-white/20 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-kona-white/60 text-sm">
            © {currentYear} Kona Island Coffee. All rights reserved.
          </p>
          <p className="text-kona-white/60 text-sm mt-2 md:mt-0">
            Made with ❤️ and lots of ☕ in the Bay Area
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer