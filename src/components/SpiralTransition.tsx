"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SpiralTransitionProps {
  trigger: string
  color?: string
}

export function SpiralTransition({ trigger, color = 'oklch(0.68 0.19 195)' }: SpiralTransitionProps) {
  const [showSpiral, setShowSpiral] = useState(false)

  useEffect(() => {
    setShowSpiral(true)
    const timer = setTimeout(() => setShowSpiral(false), 1600)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!showSpiral) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center perspective-2000">
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15) * (Math.PI / 180)
        const spiralRadius = i * 25
        const x = Math.cos(angle) * spiralRadius
        const y = Math.sin(angle) * spiralRadius
        
        return (
          <motion.div
            key={`spiral-element-${i}`}
            className="absolute w-8 h-8 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              border: `2px solid ${color}`,
              transformStyle: 'preserve-3d',
            }}
            initial={{ 
              x: 0,
              y: 0,
              z: 0,
              rotateZ: 0,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: [0, x * 0.5, x, x * 1.2],
              y: [0, y * 0.5, y, y * 1.2],
              z: [0, i * 10, i * 20, 0],
              rotateZ: [0, 180 * (i % 2 ? 1 : -1), 360 * (i % 2 ? 1 : -1), 720 * (i % 2 ? 1 : -1)],
              scale: [0, 1, 1.2, 0],
              opacity: [0, 0.6, 0.4, 0]
            }}
            transition={{ 
              duration: 1.4,
              delay: i * 0.02,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        )
      })}
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`spiral-ring-${i}`}
            className="absolute rounded-full border-2"
            style={{
              width: `${(i + 1) * 80}px`,
              height: `${(i + 1) * 80}px`,
              borderColor: color,
              opacity: 0.3,
            }}
            initial={{ 
              rotateX: 0,
              rotateY: 0,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              rotateX: [0, 360 + i * 60],
              rotateY: [0, 720 - i * 60],
              scale: [0, 1.2, 1.5, 0],
              opacity: [0, 0.4, 0.2, 0]
            }}
            transition={{ 
              duration: 1.5,
              delay: i * 0.08,
              ease: 'easeInOut'
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
