"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface VortexTransitionProps {
  trigger: string
  color?: string
}

export function VortexTransition({ trigger, color = 'oklch(0.68 0.19 195)' }: VortexTransitionProps) {
  const [showVortex, setShowVortex] = useState(false)

  useEffect(() => {
    setShowVortex(true)
    const timer = setTimeout(() => setShowVortex(false), 1800)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!showVortex) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center perspective-2000">
      {[...Array(30)].map((_, i) => {
        const angle = (i * 12) * (Math.PI / 180)
        const radius = 50 + i * 15
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        return (
          <motion.div
            key={`vortex-particle-${i}`}
            className="absolute"
            style={{
              width: `${20 - i * 0.5}px`,
              height: `${20 - i * 0.5}px`,
              background: `linear-gradient(135deg, ${color}, transparent)`,
              borderRadius: '50%',
              transformStyle: 'preserve-3d',
              filter: 'blur(1px)',
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
              x: [0, x * 0.3, x * 0.6, 0],
              y: [0, y * 0.3, y * 0.6, 0],
              z: [0, -i * 8, -i * 15, 0],
              rotateZ: [0, 360 + i * 30, 720 + i * 60, 1080 + i * 90],
              scale: [0, 1.2, 0.8, 0],
              opacity: [0, 0.7, 0.5, 0]
            }}
            transition={{ 
              duration: 1.6,
              delay: i * 0.015,
              ease: [0.22, 1, 0.36, 1]
            }}
          />
        )
      })}
      
      {[...Array(4)].map((_, layer) => (
        <motion.div
          key={`vortex-layer-${layer}`}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className="absolute"
            style={{
              width: `${400 - layer * 80}px`,
              height: `${400 - layer * 80}px`,
              background: `conic-gradient(from 0deg, ${color}, transparent, ${color}, transparent, ${color})`,
              borderRadius: '50%',
              filter: 'blur(20px)',
              opacity: 0.2,
            }}
            initial={{ 
              rotateZ: 0,
              rotateX: 0,
              scale: 0
            }}
            animate={{ 
              rotateZ: [0, 360 * (layer % 2 ? 1 : -1), 720 * (layer % 2 ? 1 : -1)],
              rotateX: [0, 180, 360],
              scale: [0, 1.2 + layer * 0.1, 2 + layer * 0.2],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 1.5,
              delay: layer * 0.1,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      ))}
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 40%)`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.5, 3],
          opacity: [0, 0.15, 0]
        }}
        transition={{ 
          duration: 1.2,
          ease: 'easeOut'
        }}
      />
    </div>
  )
}
