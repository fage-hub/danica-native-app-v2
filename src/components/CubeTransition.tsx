"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CubeTransitionProps {
  trigger: string
  color?: string
}

export function CubeTransition({ trigger, color = 'oklch(0.65 0.22 28)' }: CubeTransitionProps) {
  const [showCube, setShowCube] = useState(false)

  useEffect(() => {
    setShowCube(true)
    const timer = setTimeout(() => setShowCube(false), 1400)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!showCube) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center perspective-1000">
      {[...Array(6)].map((_, i) => {
        const angle = (i * 60) * (Math.PI / 180)
        const radius = 150
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        return (
          <motion.div
            key={`cube-face-${i}`}
            className="absolute w-32 h-32"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
              transformStyle: 'preserve-3d',
              border: `2px solid ${color}`,
              opacity: 0.2,
            }}
            initial={{ 
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: [0, x, 0],
              y: [0, y, 0],
              rotateX: [0, 360, 720],
              rotateY: [0, 360, 720],
              rotateZ: [0, 180, 360],
              scale: [0, 1.2, 0],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 1.2,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1]
            }}
          />
        )
      })}
      
      <motion.div
        className="absolute"
        style={{
          transformStyle: 'preserve-3d',
        }}
        initial={{ rotateX: 0, rotateY: 0, scale: 0 }}
        animate={{ 
          rotateX: [0, 180, 360],
          rotateY: [0, 360, 720],
          scale: [0, 1, 2],
          opacity: [0.4, 0.2, 0]
        }}
        transition={{ 
          duration: 1.2,
          ease: [0.34, 1.56, 0.64, 1]
        }}
      >
        {[0, 90, 180, 270].map((rotation, i) => (
          <div
            key={`cube-side-${i}`}
            className="absolute w-40 h-40"
            style={{
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              border: `1px solid ${color}`,
              opacity: 0.3,
              transform: `rotateY(${rotation}deg) translateZ(80px)`,
              backfaceVisibility: 'hidden',
            }}
          />
        ))}
        <div
          className="absolute w-40 h-40"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            border: `1px solid ${color}`,
            opacity: 0.3,
            transform: 'rotateX(90deg) translateZ(80px)',
            backfaceVisibility: 'hidden',
          }}
        />
        <div
          className="absolute w-40 h-40"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            border: `1px solid ${color}`,
            opacity: 0.3,
            transform: 'rotateX(-90deg) translateZ(80px)',
            backfaceVisibility: 'hidden',
          }}
        />
      </motion.div>
    </div>
  )
}
