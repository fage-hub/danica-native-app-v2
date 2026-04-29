"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface WaveTransitionProps {
  trigger: string
  color?: string
}

export function WaveTransition({ trigger, color = 'oklch(0.68 0.19 195)' }: WaveTransitionProps) {
  const [showWave, setShowWave] = useState(false)

  useEffect(() => {
    setShowWave(true)
    const timer = setTimeout(() => setShowWave(false), 1500)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!showWave) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`wave-ring-${i}`}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 60%)`,
          }}
          initial={{ 
            scale: 0,
            opacity: 0,
          }}
          animate={{ 
            scale: [0, 2 + i * 0.3, 3.5 + i * 0.3],
            opacity: [0, 0.12 - i * 0.015, 0]
          }}
          transition={{ 
            duration: 1.4,
            delay: i * 0.05,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      ))}
      
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180)
        const distance = 150
        const startX = Math.cos(angle) * distance
        const startY = Math.sin(angle) * distance
        
        return (
          <motion.div
            key={`wave-particle-${i}`}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              backgroundColor: color,
              filter: 'blur(2px)',
            }}
            initial={{ 
              x: 0,
              y: 0,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: [0, startX * 2, startX * 4],
              y: [0, startY * 2, startY * 4],
              scale: [0, 1.2, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 1.2,
              delay: i * 0.04,
              ease: 'easeOut'
            }}
          />
        )
      })}
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="w-96 h-96"
          style={{
            background: `conic-gradient(from 0deg, ${color}, transparent, ${color})`,
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1.5, 2.5],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.1, 0]
          }}
          transition={{ 
            duration: 1.3,
            ease: 'easeOut'
          }}
        />
      </motion.div>
    </div>
  )
}
