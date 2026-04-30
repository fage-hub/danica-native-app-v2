"use client"

import { House, Brain, Lock, ChartBarHorizontal, Play, Package } from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useButtonRipple } from '@/hooks/use-button-ripple'

type NavItem = {
  id: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { id: 'home', icon: House },
  { id: 'products', icon: Package },
  { id: 'demos', icon: Play },
  { id: 'compare', icon: ChartBarHorizontal },
  { id: 'portal', icon: Lock },
]

const getTabThemeColor = (tab: string) => {
  switch (tab) {
    case 'home':
      return {
        primary: 'oklch(0.68 0.19 195)',
        secondary: 'oklch(0.42 0.16 260)',
        glow: 'oklch(0.68 0.19 195 / 0.3)',
      }
    case 'products':
      return {
        primary: 'oklch(0.72 0.22 270)',
        secondary: 'oklch(0.62 0.18 260)',
        glow: 'oklch(0.67 0.20 265 / 0.3)',
      }
    case 'demos':
      return {
        primary: 'oklch(0.72 0.20 85)',
        secondary: 'oklch(0.68 0.16 70)',
        glow: 'oklch(0.70 0.18 78 / 0.3)',
      }
    case 'compare':
      return {
        primary: 'oklch(0.70 0.24 320)',
        secondary: 'oklch(0.60 0.20 300)',
        glow: 'oklch(0.65 0.22 310 / 0.3)',
      }
    case 'portal':
      return {
        primary: 'oklch(0.65 0.22 28)',
        secondary: 'oklch(0.70 0.18 40)',
        glow: 'oklch(0.68 0.20 34 / 0.3)',
      }
    default:
      return {
        primary: 'oklch(0.68 0.19 195)',
        secondary: 'oklch(0.42 0.16 260)',
        glow: 'oklch(0.68 0.19 195 / 0.3)',
      }
  }
}

type BottomNavProps = {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage()
  const currentTheme = getTabThemeColor(activeTab)
  const { ripples, createRipple } = useButtonRipple()
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t shadow-lg z-50 safe-area-inset-bottom overflow-hidden bg-card/95"
      style={{
        borderColor: 'var(--border)',
        willChange: 'auto'
      }}
    >
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
          boxShadow: `0 0 6px ${currentTheme.glow}`
        }}
      />
      <div className="flex items-center justify-around h-20 px-2 max-w-2xl lg:max-w-5xl mx-auto relative">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const itemTheme = getTabThemeColor(item.id)
          
          return (
            <button
              key={item.id}
              onClick={(e) => {
                createRipple(e)
                onTabChange(item.id)
              }}
              className="flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-2xl transition-all min-w-[60px] min-h-[60px] relative flex-1 touch-manipulation overflow-hidden active:scale-95"
              style={{
                WebkitTapHighlightColor: 'transparent',
                willChange: isActive ? 'transform' : 'auto'
              }}
            >
              <div
                className="relative transition-all duration-300"
                style={{
                  transform: isActive ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                  color: isActive ? currentTheme.primary : 'oklch(0.52 0.06 250)'
                }}
              >
                <Icon 
                  size={30} 
                  weight={isActive ? 'fill' : 'regular'} 
                  className="drop-shadow-sm"
                />
                {isActive && (
                  <div
                    className="absolute -inset-3 rounded-full -z-10 blur-md transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle, ${itemTheme.glow} 0%, transparent 70%)`,
                      opacity: 0.5
                    }}
                  />
                )}
              </div>
              <span
                className="text-[10px] relative z-10 transition-all duration-300"
                style={{ 
                  letterSpacing: '-0.01em',
                  opacity: isActive ? 1 : 0.7,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? currentTheme.primary : 'oklch(0.52 0.06 250)'
                }}
              >
                {t.nav[item.id as keyof typeof t.nav]}
              </span>
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: ripple.size,
                    height: ripple.size,
                    background: `radial-gradient(circle, ${itemTheme.primary}40 0%, transparent 70%)`,
                    animation: 'ripple-expand 0.5s ease-out forwards'
                  }}
                />
              ))}
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 w-12 h-1 rounded-full shadow-md transition-all duration-300"
                  style={{
                    transform: 'translateX(-50%)',
                    background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                    boxShadow: `0 0 8px ${currentTheme.glow}`
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
