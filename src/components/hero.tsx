"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Coffee, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getHawaiianGreeting } from '@/lib/utils'
import { VolcanoBackground, VolcanoParticles } from '@/components/volcano-effects'

interface HeroProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  showCTA?: boolean
}

const Hero: React.FC<HeroProps> = ({
  title = "Rolling Aloha to the Bay Area",
  subtitle = "Our mobile ʻohana brings authentic Hawaiian coffee culture directly to your community",
  backgroundImage = "/images/hero-coffee-beans.jpg",
  showCTA = true
}) => {
  const hawaiianGreeting = getHawaiianGreeting()

  const floatingElements = [
    { icon: Coffee, delay: 0, x: "10%", y: "20%", size: "w-16 h-16" },
    { icon: Waves, delay: 0.5, x: "80%", y: "30%", size: "w-12 h-12" },
    { icon: Coffee, delay: 1, x: "20%", y: "70%", size: "w-20 h-20" },
    { icon: Waves, delay: 1.5, x: "70%", y: "80%", size: "w-12 h-12" },
    { icon: Coffee, delay: 0.7, x: "85%", y: "15%", size: "w-14 h-14" },
    { icon: Coffee, delay: 1.8, x: "5%", y: "75%", size: "w-18 h-18" },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <VolcanoBackground />
      <VolcanoParticles trigger={true} />
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Hawaiian Kona Coffee"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-kona-espresso/70 via-kona-espresso/50 to-transparent" />
      </div>

      {/* Floating Background Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-kona-teal/20"
          style={{
            left: element.x,
            top: element.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <element.icon className={element.size} />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hawaiian Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-hawaiian-script text-kona-teal text-2xl md:text-3xl mb-4"
          >
            {hawaiianGreeting}! 🌺
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-league-spartan text-4xl md:text-6xl lg:text-7xl font-bold text-kona-white mb-6 leading-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-kona-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* Call to Actions */}
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                variant="aloha"
                size="lg"
                className="text-lg px-8 py-3 group"
                asChild
              >
                <Link href="/locations">
                  Find Our Truck
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-3 bg-kona-white/10 backdrop-blur-sm border-kona-white/30 text-kona-white hover:bg-kona-white hover:text-kona-espresso"
                asChild
              >
                <Link href="/menu">
                  View Menu
                </Link>
              </Button>
            </motion.div>
          )}

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-6 h-10 border-2 border-kona-white/50 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1 h-3 bg-kona-white/50 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Wave at Bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-20 text-kona-white"
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
    </section>
  )
}

export default Hero