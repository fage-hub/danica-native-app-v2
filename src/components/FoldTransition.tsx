"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface FoldTransitionProps {
  trigger: string
  color?: string
}

export function FoldTransition({ trigger, color = 'oklch(0.68 0.19 195)' }: FoldTransitionProps) {
  const [showFold, setShowFold] = useState(false)

  useEffect(() => {
    setShowFold(true)
    const timer = setTimeout(() => setShowFold(false), 1400)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!showFold) return null

  const panels = 6

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden perspective-2000">
      {[...Array(panels)].map((_, i) => (
        <motion.div
          key={`fold-panel-${i}`}
          className="absolute top-0 bottom-0"
          style={{
            left: `${(i / panels) * 100}%`,
            width: `${100 / panels}%`,
            background: `linear-gradient(to bottom, ${color} 0%, transparent 50%, ${color} 100%)`,
            transformOrigin: i % 2 === 0 ? 'left center' : 'right center',
            transformStyle: 'preserve-3d',
            border: `1px solid ${color}`,
            opacity: 0.2,
          }}
          initial={{ 
            rotateY: 0,
            opacity: 0,
            z: 0
          }}
          animate={{ 
            rotateY: [0, i % 2 === 0 ? 90 : -90, i % 2 === 0 ? 180 : -180],
            opacity: [0, 0.3, 0],
            z: [0, 100, 0]
          }}
          transition={{ 
            duration: 1.2,
            delay: i * 0.08,
            ease: [0.22, 1, 0.36, 1]
          }}
        />
      ))}
      
      {[...Array(panels)].map((_, i) => (
        <motion.div
          key={`fold-shadow-${i}`}
          className="absolute top-0 bottom-0"
          style={{
            left: `${(i / panels) * 100}%`,
            width: `${100 / panels}%`,
            background: `linear-gradient(to ${i % 2 === 0 ? 'right' : 'left'}, rgba(0,0,0,0.2), transparent)`,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: 1.2,
            delay: i * 0.08,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {[...Array(4)].map((_, i) => {
          const rotation = i * 90
          
          return (
            <motion.div
              key={`fold-plane-${i}`}
              className="absolute w-96 h-96"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
                border: `2px solid ${color}`,
                transformOrigin: 'center center',
                transformStyle: 'preserve-3d',
                opacity: 0.15,
              }}
              initial={{ 
                rotateZ: rotation,
                rotateX: 0,
                rotateY: 0,
                scale: 0
              }}
              animate={{ 
                rotateX: [0, 90, 180],
                rotateY: [0, 180, 360],
                scale: [0, 1, 0],
                opacity: [0, 0.2, 0]
              }}
              transition={{ 
                duration: 1.3,
                delay: i * 0.1,
                ease: 'easeInOut'
              }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}
