"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, MapPin, Coffee, User, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useOnlineOrdering } from '@/hooks/useOnlineOrdering'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface HeaderProps {
  cartItemsCount?: number
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isOnlineOrderingEnabled, toggleOnlineOrdering, isLoaded } = useOnlineOrdering()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { label: 'Menu', href: '/menu', icon: Coffee },
    { label: 'Coffee', href: '/coffee', icon: Coffee },
    { label: 'Pastries & Crepes', href: '/pastries', icon: Coffee },
    { label: 'Our Story', href: '/story', icon: Coffee },
    { label: 'Locations', href: '/locations', icon: MapPin },
    { label: 'System Map', href: '/system-map', icon: Coffee },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-kona-white/95 backdrop-blur-md shadow-kona-soft"
          : "bg-transparent"
      )}
      initial={prefersReducedMotion ? { opacity: 0 } : { y: -100 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
      role="banner"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-kona-brown rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-kona-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-league-spartan text-xl font-bold text-kona-espresso">
                  Kona Island
                </span>
                <span className="font-league-spartan text-sm text-kona-brown -mt-1">
                  Coffee
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main menu">
            {navigationItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href={item.href}
                  className="font-mangabey text-kona-espresso hover:text-kona-brown transition-colors duration-200 relative group"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-kona-teal transition-all duration-200 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-kona-espresso hover:text-kona-brown"
            >
              <User className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative text-kona-espresso hover:text-kona-brown"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <Badge
                    variant="teal"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Online Ordering Toggle */}
            {isLoaded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleOnlineOrdering}
                className="relative text-kona-espresso hover:text-kona-brown"
                title={isOnlineOrderingEnabled ? "Disable Online Ordering" : "Enable Online Ordering"}
              >
                {isOnlineOrderingEnabled ? (
                  <ToggleRight className="w-5 h-5 text-kona-teal" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-kona-taupe" />
                )}
              </Button>
            )}

            {isLoaded && isOnlineOrderingEnabled && (
              <Button variant="aloha" asChild>
                <Link href="/order">Order Online</Link>
              </Button>
            )}

            {isLoaded && !isOnlineOrderingEnabled && (
              <Button variant="outline" disabled>
                Ordering Offline
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-kona-espresso"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <Badge
                    variant="teal"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-kona-espresso"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="lg:hidden bg-kona-white border-t border-kona-taupe/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            role="navigation"
            aria-label="Mobile menu"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 p-3 rounded-kona hover:bg-kona-taupe/20 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5 text-kona-brown" />
                      <span className="font-mangabey text-kona-espresso">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navigationItems.length * 0.1 }}
                  className="pt-4 border-t border-kona-taupe/20 space-y-3"
                >
                  {/* Online Ordering Toggle for Mobile */}
                  {isLoaded && (
                    <div className="flex items-center justify-between p-3 rounded-kona bg-kona-taupe/10">
                      <span className="font-mangabey text-kona-espresso">Online Ordering</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleOnlineOrdering}
                        className="text-kona-espresso"
                      >
                        {isOnlineOrderingEnabled ? (
                          <ToggleRight className="w-6 h-6 text-kona-teal" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-kona-taupe" />
                        )}
                      </Button>
                    </div>
                  )}

                  {isLoaded && isOnlineOrderingEnabled && (
                    <Button
                      variant="aloha"
                      className="w-full"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/order">Order Online</Link>
                    </Button>
                  )}

                  {isLoaded && !isOnlineOrderingEnabled && (
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled
                    >
                      Ordering Offline
                    </Button>
                  )}
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header