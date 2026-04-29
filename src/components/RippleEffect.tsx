"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface RipplePoint {
  id: number
  x: number
  y: number
  delay: number
}

interface RippleEffectProps {
  trigger: string
  duration?: number
  color?: string
}

const pageColorThemes = {
  home: 'oklch(0.68 0.19 195)',
  services: 'oklch(0.75 0.22 150)',
  demos: 'oklch(0.72 0.20 85)',
  compare: 'oklch(0.70 0.24 320)',
  portal: 'oklch(0.65 0.22 28)',
}

export function RippleEffect({ 
  trigger, 
  duration = 1.4,
  color
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<RipplePoint[]>([])

  const currentColor = color || pageColorThemes[trigger as keyof typeof pageColorThemes] || pageColorThemes.home

  useEffect(() => {
    const newRipples: RipplePoint[] = [
      { id: Date.now(), x: 50, y: 50, delay: 0 },
      { id: Date.now() + 1, x: 20, y: 80, delay: 0.1 },
      { id: Date.now() + 2, x: 80, y: 20, delay: 0.15 },
      { id: Date.now() + 3, x: 30, y: 30, delay: 0.08 },
      { id: Date.now() + 4, x: 70, y: 70, delay: 0.12 },
    ]
    
    setRipples(newRipples)

    const timer = setTimeout(() => {
      setRipples([])
    }, duration * 1000)

    return () => clearTimeout(timer)
  }, [trigger, duration])

  if (ripples.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`${ripple.id}-ring-${i}`}
              className="absolute rounded-full border-2"
              style={{
                borderColor: `${currentColor} / ${0.4 - i * 0.1}`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ 
                scale: 0, 
                opacity: 0.7,
                width: 20,
                height: 20
              }}
              animate={{ 
                scale: [0, 2.8, 3.8],
                opacity: [0.7, 0.3, 0],
                width: [20, 140, 190],
                height: [20, 140, 190]
              }}
              transition={{ 
                duration: duration * 0.85,
                delay: ripple.delay + i * 0.09,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
