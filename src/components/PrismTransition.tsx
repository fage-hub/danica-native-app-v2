"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PrismTransitionProps {
  trigger: string
  color?: string
}

export function PrismTransition({ trigger, color = 'oklch(0.68 0.19 195)' }: PrismTransitionProps) {
  const [showPrism, setShowPrism] = useState(false)

  useEffect(() => {
    setShowPrism(true)
    const timer = setTimeout(() => setShowPrism(false), 1600)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!showPrism) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center perspective-2000">
      {[...Array(6)].map((_, i) => {
        const angle = (i * 60) * (Math.PI / 180)
        
        return (
          <motion.div
            key={`prism-face-${i}`}
            className="absolute"
            style={{
              width: '200px',
              height: '300px',
              background: `linear-gradient(${angle * (180 / Math.PI)}deg, ${color} 0%, transparent 100%)`,
              border: `2px solid ${color}`,
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
              opacity: 0.2,
            }}
            initial={{ 
              rotateY: 0,
              rotateZ: i * 60,
              scale: 0,
              opacity: 0,
              z: 0
            }}
            animate={{ 
              rotateY: [0, 180, 360],
              scale: [0, 1, 1.5],
              opacity: [0, 0.3, 0],
              z: [0, 100, 200]
            }}
            transition={{ 
              duration: 1.4,
              delay: i * 0.08,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        )
      })}
      
      <motion.div
        className="absolute"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`prism-core-${i}`}
            className="absolute w-48 h-48"
            style={{
              background: `conic-gradient(from ${i * 120}deg, ${color}, transparent, ${color})`,
              border: `3px solid ${color}`,
              transformStyle: 'preserve-3d',
              opacity: 0.25,
            }}
            initial={{ 
              rotateX: 0,
              rotateY: 0,
              rotateZ: i * 120,
              scale: 0
            }}
            animate={{ 
              rotateX: [0, 360],
              rotateY: [0, 720],
              rotateZ: [i * 120, i * 120 + 360],
              scale: [0, 1.2, 2],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 1.5,
              delay: i * 0.15,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>
      
      {[...Array(18)].map((_, i) => {
        const angle = (i * 20) * (Math.PI / 180)
        const radius = 200
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        return (
          <motion.div
            key={`prism-particle-${i}`}
            className="absolute w-4 h-12"
            style={{
              background: `linear-gradient(to bottom, ${color}, transparent)`,
              transformOrigin: 'center center',
              filter: 'blur(1px)',
            }}
            initial={{ 
              x: 0,
              y: 0,
              rotateZ: angle * (180 / Math.PI),
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: [0, x * 0.5, x],
              y: [0, y * 0.5, y],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 1.2,
              delay: i * 0.03,
              ease: 'easeOut'
            }}
          />
        )
      })}
      
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`prism-ring-${i}`}
          className="absolute"
          style={{
            width: `${(i + 1) * 100}px`,
            height: `${(i + 1) * 100}px`,
            border: `3px solid ${color}`,
            borderRadius: '50%',
            transformStyle: 'preserve-3d',
          }}
          initial={{ 
            scale: 0,
            rotateX: 0,
            opacity: 0
          }}
          animate={{ 
            scale: [0, 1.2, 2],
            rotateX: [0, 180, 360],
            opacity: [0, 0.4, 0]
          }}
          transition={{ 
            duration: 1.4,
            delay: i * 0.1,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}
