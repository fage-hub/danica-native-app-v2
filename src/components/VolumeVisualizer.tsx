"use client"

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type VolumeVisualizerProps = {
  volume: number
  isActive?: boolean
  variant?: 'bars' | 'waves'
}

export function VolumeVisualizer({ volume, isActive = false, variant = 'bars' }: VolumeVisualizerProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (isActive) {
      setAnimationKey((prev) => prev + 1)
    }
  }, [isActive])

  if (variant === 'waves') {
    return <WaveVisualizer volume={volume} isActive={isActive} animationKey={animationKey} />
  }

  return <BarVisualizer volume={volume} isActive={isActive} animationKey={animationKey} />
}

function BarVisualizer({ volume, isActive, animationKey }: { volume: number; isActive: boolean; animationKey: number }) {
  const barCount = 12
  const bars = Array.from({ length: barCount }, (_, i) => i)

  const getBarColor = (index: number) => {
    const threshold = (index + 1) / barCount
    if (threshold <= 0.33) return 'bg-green-500'
    if (threshold <= 0.66) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getBarOpacity = (index: number) => {
    const threshold = (index + 1) / barCount
    return volume >= threshold ? 1 : 0.15
  }

  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((index) => {
        const threshold = (index + 1) / barCount
        const isActive = volume >= threshold
        const delay = index * 0.03

        return (
          <motion.div
            key={`${animationKey}-${index}`}
            className={`w-1.5 rounded-sm transition-all duration-300 ${getBarColor(index)}`}
            style={{
              opacity: getBarOpacity(index),
            }}
            initial={{ height: '20%' }}
            animate={{
              height: isActive && animationKey > 0
                ? ['20%', `${40 + Math.random() * 60}%`, '20%']
                : `${20 + (threshold * 80)}%`,
            }}
            transition={{
              duration: isActive && animationKey > 0 ? 0.6 : 0.3,
              delay: isActive && animationKey > 0 ? delay : 0,
              ease: 'easeInOut',
              repeat: isActive && animationKey > 0 ? 0 : 0,
            }}
          />
        )
      })}
    </div>
  )
}

function WaveVisualizer({ volume, isActive, animationKey }: { volume: number; isActive: boolean; animationKey: number }) {
  const waveCount = 5
  const waves = Array.from({ length: waveCount }, (_, i) => i)

  const getWaveColor = (index: number) => {
    if (volume <= 0.33) return 'bg-green-500/60'
    if (volume <= 0.66) return 'bg-yellow-500/60'
    return 'bg-red-500/60'
  }

  const getWaveScale = (index: number) => {
    const baseScale = 0.3 + (volume * 0.7)
    const offset = index * 0.15
    return Math.min(baseScale + offset, 1)
  }

  return (
    <div className="relative h-8 w-full flex items-center justify-center">
      {waves.map((index) => {
        const delay = index * 0.1

        return (
          <motion.div
            key={`${animationKey}-wave-${index}`}
            className={`absolute rounded-full border-2 ${getWaveColor(index)}`}
            style={{
              width: '2rem',
              height: '2rem',
              borderColor: volume <= 0.33 
                ? 'rgb(34 197 94)' 
                : volume <= 0.66 
                ? 'rgb(234 179 8)' 
                : 'rgb(239 68 68)',
            }}
            initial={{ scale: 0.3, opacity: 0.8 }}
            animate={
              isActive && animationKey > 0
                ? {
                    scale: [0.3, getWaveScale(index) * 1.5, 0.3],
                    opacity: [0.8, 0, 0.8],
                  }
                : {
                    scale: getWaveScale(index),
                    opacity: 0.4,
                  }
            }
            transition={{
              duration: isActive && animationKey > 0 ? 1.2 : 0.3,
              delay: isActive && animationKey > 0 ? delay : 0,
              ease: 'easeOut',
            }}
          />
        )
      })}
      <div 
        className={`absolute w-3 h-3 rounded-full transition-colors duration-300 ${
          volume <= 0.33 
            ? 'bg-green-500' 
            : volume <= 0.66 
            ? 'bg-yellow-500' 
            : 'bg-red-500'
        }`}
      />
    </div>
  )
}
