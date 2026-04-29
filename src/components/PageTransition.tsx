"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  color: string
}

interface PageTransitionProps {
  children: React.ReactNode
  trigger: string
}

export function PageTransition({ children, trigger }: PageTransitionProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [showRipple, setShowRipple] = useState(false)

  useEffect(() => {
    setShowRipple(true)
    
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 0.25,
      duration: Math.random() * 0.9 + 0.7,
      color: i % 3 === 0 
        ? 'oklch(0.68 0.19 195)' 
        : i % 3 === 1 
        ? 'oklch(0.42 0.16 260)' 
        : 'oklch(0.58 0.24 28)'
    }))
    
    setParticles(newParticles)

    const timer = setTimeout(() => {
      setShowRipple(false)
      setParticles([])
    }, 1400)

    return () => clearTimeout(timer)
  }, [trigger])

  return (
    <div className="relative">
      {showRipple && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{
                borderColor: i === 0 
                  ? 'oklch(0.68 0.19 195 / 0.3)' 
                  : i === 1 
                  ? 'oklch(0.42 0.16 260 / 0.3)' 
                  : 'oklch(0.58 0.24 28 / 0.2)'
              }}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ 
                scale: [0, 2.3, 2.8],
                opacity: [0.6, 0.3, 0]
              }}
              transition={{ 
                duration: 0.9,
                delay: i * 0.12,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            />
          ))}

          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                filter: 'blur(1px)'
              }}
              initial={{ 
                scale: 0, 
                opacity: 0,
                y: 0
              }}
              animate={{ 
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
                y: [0, -50, -100]
              }}
              transition={{ 
                duration: particle.duration,
                delay: particle.delay,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}
      {children}
    </div>
  )
}
