"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface FlipTransitionProps {
  trigger: string
  color?: string
}

export function FlipTransition({ trigger, color = 'oklch(0.42 0.16 260)' }: FlipTransitionProps) {
  const [showFlip, setShowFlip] = useState(false)

  useEffect(() => {
    setShowFlip(true)
    const timer = setTimeout(() => setShowFlip(false), 1200)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!showFlip) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden perspective-1000">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`flip-card-${i}`}
          className="absolute"
          style={{
            left: `${(i % 4) * 25}%`,
            top: `${Math.floor(i / 4) * 50}%`,
            width: '25%',
            height: '50%',
            background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
          initial={{ 
            rotateY: 0,
            opacity: 0.3,
            z: 0
          }}
          animate={{ 
            rotateY: [0, 180, 360],
            opacity: [0.3, 0.15, 0],
            z: [0, 100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 0.9,
            delay: i * 0.05,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        />
      ))}
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="w-64 h-64 rounded-full border-4"
          style={{ 
            borderColor: color,
            transformStyle: 'preserve-3d'
          }}
          initial={{ rotateX: 0, rotateY: 0, scale: 0 }}
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, 720],
            scale: [0, 1.5, 2],
            opacity: [0.5, 0.2, 0]
          }}
          transition={{ 
            duration: 1,
            ease: 'easeOut'
          }}
        />
      </motion.div>
    </div>
  )
}
