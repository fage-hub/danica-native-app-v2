import { useCallback, useState } from 'react'

export type Ripple = {
  id: number
  x: number
  y: number
  size: number
}

export type RippleVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

const rippleColors: Record<RippleVariant, string> = {
  default: 'oklch(1 0 0 / 0.5)',
  destructive: 'oklch(1 0 0 / 0.5)',
  outline: 'oklch(0.68 0.19 195 / 0.3)',
  secondary: 'oklch(0.42 0.16 260 / 0.35)',
  ghost: 'oklch(0.68 0.19 195 / 0.25)',
  link: 'oklch(0.42 0.16 260 / 0.2)',
}

export function useButtonRipple(variant: RippleVariant = 'default') {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    
    const size = Math.max(rect.width, rect.height) * 2
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size,
    }
    
    setRipples((prev) => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)
  }, [])

  const rippleColor = rippleColors[variant]

  return { ripples, createRipple, rippleColor }
}
