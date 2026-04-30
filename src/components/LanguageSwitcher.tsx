"use client"

import { Translate } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const isMobile = useIsMobile()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: 0.1,
        type: 'spring',
        stiffness: 240,
        damping: 20,
        mass: 0.8
      }}
      whileHover={{ scale: isMobile ? 1 : 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="relative"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        aria-label="Toggle language"
        className={`
          gap-1.5 font-medium shadow-sm hover:shadow transition-shadow
          border-border/70 hover:border-accent/50 backdrop-blur-md bg-card/85
          h-9 px-3 text-xs
          touch-manipulation select-none
        `}
        style={{
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <motion.div
          animate={{ rotate: language === 'en' ? 0 : 180 }}
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Translate size={16} weight="duotone" />
        </motion.div>
        <span className="hidden sm:inline">{language === 'en' ? '中文' : 'English'}</span>
      </Button>
      
      {isMobile && (
        <div 
          className="absolute inset-0 -m-2"
          style={{ 
            pointerEvents: 'none',
            touchAction: 'manipulation'
          }}
        />
      )}
    </motion.div>
  )
}
