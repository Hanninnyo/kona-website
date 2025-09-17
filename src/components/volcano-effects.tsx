"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Volcano Particles Component
export const VolcanoParticles: React.FC<{ trigger?: boolean }> = ({ trigger = false }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 20 + 80,
        delay: Math.random() * 0.5
      }))
      setParticles(newParticles)

      // Clear particles after animation
      setTimeout(() => setParticles([]), 3000)
    }
  }, [trigger])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 0.5, 0],
            y: [-50, -100, -150, -200],
            x: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: 2,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

// Floating Coffee Bean Particles
export const CoffeeBeanParticles: React.FC = () => {
  const beans = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 6 + Math.random() * 4
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {beans.map((bean) => (
        <motion.div
          key={bean.id}
          className="absolute text-kona-brown/20"
          style={{ left: `${bean.x}%` }}
          initial={{ y: '110vh', rotate: 0, opacity: 0 }}
          animate={{
            y: '-10vh',
            rotate: 360,
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: bean.duration,
            delay: bean.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          ☕
        </motion.div>
      ))}
    </div>
  )
}

// Volcano Background with Glow Effect
export const VolcanoBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Volcano Silhouette */}
      <svg
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 text-kona-brown/10"
        viewBox="0 0 400 100"
        preserveAspectRatio="xMidYEnd slice"
      >
        <motion.path
          d="M0,100 L100,100 L150,60 L170,55 L190,60 L200,50 L210,60 L250,100 L400,100 Z"
          fill="currentColor"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Crater Glow */}
        <motion.circle
          cx="200"
          cy="50"
          r="8"
          fill="url(#volcanoGlow)"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        <defs>
          <radialGradient id="volcanoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f7931e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffdc00" stopOpacity="0.1" />
          </radialGradient>
        </defs>
      </svg>

      {/* Subtle Heat Waves */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gradient-to-t from-orange-200/20 to-transparent rounded-full blur-sm"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

// Sparkle Effect for Buttons and Interactive Elements
export const SparkleEffect: React.FC<{ children: React.ReactNode; intensity?: 'low' | 'medium' | 'high' }> = ({
  children,
  intensity = 'medium'
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const sparkleCount = intensity === 'low' ? 3 : intensity === 'medium' ? 5 : 8

  const sparkles = Array.from({ length: sparkleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5
  }))

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 0.6,
                delay: sparkle.delay,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Lava Flow Border Animation
export const LavaFlowBorder: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-inherit"
        style={{
          background: 'linear-gradient(45deg, #ff6b35, #f7931e, #ffdc00, #ff6b35)',
          backgroundSize: '300% 300%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="absolute inset-0.5 bg-white rounded-inherit" />
    </div>
  )
}

// Volcanic Steam Effect
export const VolcanicSteam: React.FC = () => {
  const steamPuffs = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: 45 + Math.random() * 10, // Center around the crater
    delay: i * 0.3,
    duration: 3 + Math.random()
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {steamPuffs.map((puff) => (
        <motion.div
          key={puff.id}
          className="absolute bottom-16 w-4 h-4 bg-white/30 rounded-full blur-sm"
          style={{ left: `${puff.x}%` }}
          initial={{ y: 0, scale: 0.5, opacity: 0.6 }}
          animate={{
            y: -60,
            scale: [0.5, 1, 1.5, 0],
            opacity: [0.6, 0.8, 0.4, 0],
          }}
          transition={{
            duration: puff.duration,
            delay: puff.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

// Photo-realistic Volcano with Lava Flow
export const PhotoRealisticVolcano: React.FC<{ scrollProgress?: number }> = ({ scrollProgress = 0 }) => {
  const [eruptionIntensity, setEruptionIntensity] = useState(0.3)

  useEffect(() => {
    // Increase eruption intensity based on scroll
    setEruptionIntensity(0.3 + (scrollProgress * 0.7))
  }, [scrollProgress])

  const lavaFlows = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    x: 45 + (i - 2) * 8,
    width: 3 + Math.random() * 2,
    delay: i * 0.2
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Volcano Mountain */}
      <svg
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-96 text-gray-800"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYEnd slice"
      >
        {/* Mountain Shadow */}
        <motion.path
          d="M0,400 L200,400 L300,120 L340,100 L380,120 L400,80 L420,120 L500,400 L800,400 Z"
          fill="url(#mountainGradient)"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Crater */}
        <motion.ellipse
          cx="400"
          cy="80"
          rx="25"
          ry="8"
          fill="url(#craterGlow)"
          animate={{
            opacity: [0.8, 1, 0.8],
            ry: [8, 12, 8]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Lava Eruption */}
        <motion.g>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={400 + (Math.random() - 0.5) * 40}
              cy={80}
              r={2 + Math.random() * 3}
              fill={`hsl(${10 + Math.random() * 20}, 100%, ${60 + Math.random() * 20}%)`}
              initial={{ y: 0, opacity: 1 }}
              animate={{
                y: [-20, -60 - Math.random() * 40],
                x: [(Math.random() - 0.5) * 30],
                opacity: [1, 0.8, 0],
                scale: [1, 0.5, 0]
              }}
              transition={{
                duration: 1.5 + Math.random(),
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.g>

        <defs>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d1810" />
            <stop offset="40%" stopColor="#4a2c17" />
            <stop offset="80%" stopColor="#6b3e07" />
            <stop offset="100%" stopColor="#8b4513" />
          </linearGradient>

          <radialGradient id="craterGlow" cx="50%" cy="50%" r="100%">
            <stop offset="0%" stopColor="#ff4500" />
            <stop offset="30%" stopColor="#ff6347" />
            <stop offset="70%" stopColor="#ffa500" />
            <stop offset="100%" stopColor="#ffff00" />
          </radialGradient>
        </defs>
      </svg>

      {/* Lava Flows */}
      {lavaFlows.map((flow) => (
        <motion.div
          key={flow.id}
          className="absolute bottom-0 bg-gradient-to-b from-red-500 via-orange-500 to-yellow-400 rounded-t-lg"
          style={{
            left: `${flow.x}%`,
            width: `${flow.width}%`,
            transformOrigin: 'bottom center'
          }}
          animate={{
            height: [`0px`, `${100 + Math.random() * 100}px`, `${80 + Math.random() * 80}px`],
            opacity: [0, eruptionIntensity, eruptionIntensity * 0.8]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: flow.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Heat Shimmer Effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-32"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(255,69,0,0.1), transparent)',
          filter: 'blur(2px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

// Flying Hawaiian Flowers
export const HawaiianFlowers: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use deterministic values to avoid hydration mismatches
  const flowers = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: ['🌺', '🌸', '🌼', '🌻'][i % 4],
    x: ((i * 13 + 7) % 100),
    y: ((i * 17 + 11) % 100),
    duration: 8 + ((i * 5) % 6),
    delay: (i * 0.5) % 4
  }))

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-5">
      {flowers.map((flower) => (
        <motion.div
          key={flower.id}
          className="absolute text-2xl"
          style={{
            left: `${flower.x}%`,
            top: `${flower.y}%`
          }}
          animate={{
            x: [0, 50, -30, 20],
            y: [0, -20, 10, -30],
            rotate: [0, 180, 360],
            opacity: [0.8, 1, 0.9, 0.8]
          }}
          transition={{
            duration: flower.duration,
            delay: flower.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {flower.emoji}
        </motion.div>
      ))}
    </div>
  )
}

// Photo-realistic Ocean Waves
export const OceanWaves: React.FC<{ scrollProgress?: number }> = ({ scrollProgress = 0 }) => {
  const waveIntensity = 0.5 + (scrollProgress * 0.5)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ocean Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #191970 100%)',
          opacity: 0.3
        }}
      />

      {/* Wave Layers */}
      <svg
        className="absolute bottom-0 w-full h-64"
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYEnd slice"
      >
        {/* Back Wave */}
        <motion.path
          d="M0,150 Q300,100 600,150 T1200,150 L1200,300 L0,300 Z"
          fill="rgba(135, 206, 235, 0.3)"
          animate={{
            d: [
              "M0,150 Q300,100 600,150 T1200,150 L1200,300 L0,300 Z",
              "M0,160 Q300,110 600,140 T1200,160 L1200,300 L0,300 Z",
              "M0,150 Q300,100 600,150 T1200,150 L1200,300 L0,300 Z"
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Front Wave */}
        <motion.path
          d="M0,200 Q300,160 600,200 T1200,200 L1200,300 L0,300 Z"
          fill="rgba(70, 130, 180, 0.4)"
          animate={{
            d: [
              "M0,200 Q300,160 600,200 T1200,200 L1200,300 L0,300 Z",
              "M0,190 Q300,150 600,190 T1200,190 L1200,300 L0,300 Z",
              "M0,200 Q300,160 600,200 T1200,200 L1200,300 L0,300 Z"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Foam */}
        <motion.path
          d="M0,220 Q300,180 600,220 T1200,220 L1200,300 L0,300 Z"
          fill="rgba(255, 255, 255, 0.6)"
          animate={{
            d: [
              "M0,220 Q300,180 600,220 T1200,220 L1200,300 L0,300 Z",
              "M0,210 Q300,170 600,210 T1200,210 L1200,300 L0,300 Z",
              "M0,220 Q300,180 600,220 T1200,220 L1200,300 L0,300 Z"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>

      {/* Water Droplets */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-300 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            bottom: '20%'
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.7, 1, 0.7],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Coffee Cherries
export const CoffeeCherries: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use a fixed seed-based approach to avoid hydration mismatches
  const cherries = Array.from({ length: 15 }, (_, i) => {
    // Use index-based calculations for consistent SSR/CSR
    const seedX = (i * 7 + 13) % 100
    const seedSide = i % 2 === 0 ? 'left' : 'right'
    const seedDuration = 10 + ((i * 3) % 8)
    const seedDelay = (i * 2) % 6

    return {
      id: i,
      x: seedX,
      side: seedSide,
      duration: seedDuration,
      delay: seedDelay
    }
  })

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-5">
      {cherries.map((cherry) => (
        <motion.div
          key={cherry.id}
          className="absolute text-xl"
          style={{
            [cherry.side]: '5%',
            top: `${cherry.x}%`
          }}
          animate={{
            y: [0, -30, 20, -10],
            x: cherry.side === 'left' ? [0, 20, -10, 15] : [0, -20, 10, -15],
            rotate: [0, 90, 180, 270, 360],
            scale: [0.8, 1.2, 1, 1.1, 0.9]
          }}
          transition={{
            duration: cherry.duration,
            delay: cherry.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🍒
        </motion.div>
      ))}
    </div>
  )
}

// Mouse Trail Sparkles
export const MouseTrailSparkles: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })

      // Add new sparkle to trail
      const newSparkle = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      }

      setTrail(prevTrail => [...prevTrail, newSparkle].slice(-10)) // Keep last 10 sparkles
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Clean up old sparkles
    const interval = setInterval(() => {
      setTrail(prevTrail => prevTrail.filter(sparkle => Date.now() - sparkle.timestamp < 1000))
    }, 100)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((sparkle, index) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          style={{
            left: sparkle.x - 2,
            top: sparkle.y - 2,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}