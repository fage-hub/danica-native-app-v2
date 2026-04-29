"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

interface SparkleEffectProps {
  trigger: string
  count?: number
  colors?: {
    primary: string
    secondary: string
  }
}

const pageColorThemes = {
  home: {
    primary: 'oklch(0.68 0.19 195)',
    secondary: 'oklch(0.42 0.16 260)',
  },
  services: {
    primary: 'oklch(0.75 0.22 150)',
    secondary: 'oklch(0.65 0.18 160)',
  },
  demos: {
    primary: 'oklch(0.72 0.20 85)',
    secondary: 'oklch(0.68 0.16 70)',
  },
  compare: {
    primary: 'oklch(0.70 0.24 320)',
    secondary: 'oklch(0.60 0.20 300)',
  },
  portal: {
    primary: 'oklch(0.65 0.22 28)',
    secondary: 'oklch(0.70 0.18 40)',
  },
}

export function SparkleEffect({ trigger, count = 20, colors }: SparkleEffectProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  const currentColors = colors || pageColorThemes[trigger as keyof typeof pageColorThemes] || pageColorThemes.home

  useEffect(() => {
    const newSparkles: Sparkle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 0.4,
      duration: Math.random() * 0.7 + 0.5,
    }))

    setSparkles(newSparkles)

    const timer = setTimeout(() => {
      setSparkles([])
    }, 1700)

    return () => clearTimeout(timer)
  }, [trigger, count])

  if (sparkles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <svg
            width={sparkle.size * 4}
            height={sparkle.size * 4}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill={currentColors.primary}
              opacity="0.8"
            />
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill={currentColors.secondary}
              opacity="0.4"
              transform="scale(0.6) translate(4, 4)"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
