"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface HelixTransitionProps {
  trigger: string
  color?: string
}

export function HelixTransition({ trigger, color = 'oklch(0.68 0.19 195)' }: HelixTransitionProps) {
  const [showHelix, setShowHelix] = useState(false)

  useEffect(() => {
    setShowHelix(true)
    const timer = setTimeout(() => setShowHelix(false), 1800)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!showHelix) return null

  const helixPoints = 48

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center perspective-2000">
      {[0, 1].map((strand) => (
        <div key={`helix-strand-${strand}`}>
          {[...Array(helixPoints)].map((_, i) => {
            const progress = i / helixPoints
            const angle = progress * Math.PI * 6 + (strand * Math.PI)
            const radius = 120
            const x = Math.cos(angle) * radius
            const y = (i - helixPoints / 2) * 15
            const z = Math.sin(angle) * radius
            
            return (
              <motion.div
                key={`helix-${strand}-${i}`}
                className="absolute w-6 h-6 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                  border: `2px solid ${color}`,
                  transformStyle: 'preserve-3d',
                }}
                initial={{ 
                  x: 0,
                  y: 0,
                  z: 0,
                  scale: 0,
                  opacity: 0
                }}
                animate={{ 
                  x: [0, x, x * 1.2, 0],
                  y: [0, y, y * 1.2, 0],
                  z: [0, z, z * 1.2, 0],
                  scale: [0, 1, 1.2, 0],
                  opacity: [0, 0.7, 0.5, 0]
                }}
                transition={{ 
                  duration: 1.6,
                  delay: i * 0.015,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />
            )
          })}
        </div>
      ))}
      
      {[...Array(12)].map((_, i) => {
        const progress = i / 12
        const angle = progress * Math.PI * 2
        
        return (
          <motion.div
            key={`helix-connector-${i}`}
            className="absolute"
            style={{
              width: '240px',
              height: '2px',
              background: `linear-gradient(to right, transparent, ${color}, transparent)`,
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
            }}
            initial={{ 
              rotateZ: angle * (180 / Math.PI),
              rotateX: 0,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              rotateX: [0, 180, 360],
              scale: [0, 1, 1.5, 0],
              opacity: [0, 0.6, 0.4, 0]
            }}
            transition={{ 
              duration: 1.5,
              delay: i * 0.05,
              ease: 'easeInOut'
            }}
          />
        )
      })}
      
      <motion.div
        className="absolute"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`helix-orbit-${i}`}
            className="absolute w-64 h-64 rounded-full border-2"
            style={{
              borderColor: color,
              opacity: 0.2,
            }}
            initial={{ 
              rotateY: i * 30,
              rotateX: 0,
              scale: 0
            }}
            animate={{ 
              rotateX: [0, 360],
              scale: [0, 1, 1.5, 0],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 1.6,
              delay: i * 0.08,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>
      
      <motion.div
        className="absolute w-96 h-96"
        style={{
          background: `conic-gradient(from 0deg, ${color}, transparent, ${color}, transparent)`,
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
        initial={{ scale: 0, rotate: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1, 2],
          rotate: [0, 360, 720],
          opacity: [0, 0.15, 0]
        }}
        transition={{ 
          duration: 1.5,
          ease: 'easeOut'
        }}
      />
    </div>
  )
}
