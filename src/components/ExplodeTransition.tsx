"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ExplodeTransitionProps {
  trigger: string
  color?: string
}

export function ExplodeTransition({ trigger, color = 'oklch(0.68 0.19 195)' }: ExplodeTransitionProps) {
  const [showExplode, setShowExplode] = useState(false)

  useEffect(() => {
    setShowExplode(true)
    const timer = setTimeout(() => setShowExplode(false), 1500)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!showExplode) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center perspective-2000">
      {[...Array(36)].map((_, i) => {
        const angle = (i * 10) * (Math.PI / 180)
        const distance = 300 + Math.random() * 200
        const endX = Math.cos(angle) * distance
        const endY = Math.sin(angle) * distance
        const size = 8 + Math.random() * 16
        
        return (
          <motion.div
            key={`explode-fragment-${i}`}
            className="absolute"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: `linear-gradient(135deg, ${color}, transparent)`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              transformStyle: 'preserve-3d',
              border: `1px solid ${color}`,
            }}
            initial={{ 
              x: 0,
              y: 0,
              z: 0,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: [0, endX * 0.3, endX],
              y: [0, endY * 0.3, endY],
              z: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 400],
              rotateX: [0, Math.random() * 360, Math.random() * 720],
              rotateY: [0, Math.random() * 360, Math.random() * 720],
              rotateZ: [0, Math.random() * 360, Math.random() * 720],
              scale: [0, 1.2, 0.6],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 1.3,
              delay: Math.random() * 0.2,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          />
        )
      })}
      
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`explode-shockwave-${i}`}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 50%)`,
            border: `2px solid ${color}`,
            borderRadius: '50%',
          }}
          initial={{ 
            scale: 0,
            opacity: 0,
          }}
          animate={{ 
            scale: [0, 1 + i * 0.3, 2.5 + i * 0.3],
            opacity: [0, 0.3, 0]
          }}
          transition={{ 
            duration: 1.2,
            delay: i * 0.05,
            ease: 'easeOut'
          }}
        />
      ))}
      
      <motion.div
        className="absolute w-32 h-32"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(30px)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 2, 8],
          opacity: [0, 0.8, 0]
        }}
        transition={{ 
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1]
        }}
      />
      
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180)
        
        return (
          <motion.div
            key={`explode-ray-${i}`}
            className="absolute"
            style={{
              width: '4px',
              height: '200px',
              background: `linear-gradient(to bottom, ${color}, transparent)`,
              transformOrigin: 'top center',
              filter: 'blur(2px)',
            }}
            initial={{ 
              scale: 0,
              rotate: angle * (180 / Math.PI),
              opacity: 0
            }}
            animate={{ 
              scale: [0, 1, 2],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 1,
              delay: i * 0.03,
              ease: 'easeOut'
            }}
          />
        )
      })}
    </div>
  )
}
