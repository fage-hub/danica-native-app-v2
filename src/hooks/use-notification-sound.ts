import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'

export type NotificationSoundType = 'default' | 'success' | 'warning' | 'info' | 'critical' | 'error'

type SoundSettings = {
  enabled: boolean
  volume: number
}

export function useNotificationSound() {
  const [soundSettings, setSoundSettings] = useKV<SoundSettings>('notification-sound-settings', {
    enabled: true,
    volume: 0.5,
  })

  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [])

  const playSound = (type: NotificationSoundType = 'default') => {
    if (!soundSettings || !soundSettings.enabled || !audioContextRef.current) return

    const ctx = audioContextRef.current

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const now = ctx.currentTime
    const gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
    gainNode.gain.setValueAtTime(soundSettings.volume * 0.3, now)

    switch (type) {
      case 'success': {
        const osc1 = ctx.createOscillator()
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(523.25, now)
        osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.1)
        osc1.connect(gainNode)
        osc1.start(now)
        osc1.stop(now + 0.15)

        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
        break
      }

      case 'warning': {
        const osc1 = ctx.createOscillator()
        osc1.type = 'triangle'
        osc1.frequency.setValueAtTime(440, now)
        osc1.connect(gainNode)
        osc1.start(now)
        osc1.stop(now + 0.1)

        const osc2 = ctx.createOscillator()
        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(440, now + 0.12)
        osc2.connect(gainNode)
        osc2.start(now + 0.12)
        osc2.stop(now + 0.22)

        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
        break
      }

      case 'info': {
        const osc1 = ctx.createOscillator()
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(659.25, now)
        osc1.connect(gainNode)
        osc1.start(now)
        osc1.stop(now + 0.08)

        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
        break
      }

      case 'critical': {
        gainNode.gain.setValueAtTime(soundSettings.volume * 0.4, now)
        
        const osc1 = ctx.createOscillator()
        osc1.type = 'sawtooth'
        osc1.frequency.setValueAtTime(880, now)
        osc1.connect(gainNode)
        osc1.start(now)
        osc1.stop(now + 0.12)

        const osc2 = ctx.createOscillator()
        osc2.type = 'sawtooth'
        osc2.frequency.setValueAtTime(880, now + 0.15)
        osc2.connect(gainNode)
        osc2.start(now + 0.15)
        osc2.stop(now + 0.27)

        const osc3 = ctx.createOscillator()
        osc3.type = 'sawtooth'
        osc3.frequency.setValueAtTime(880, now + 0.3)
        osc3.connect(gainNode)
        osc3.start(now + 0.3)
        osc3.stop(now + 0.42)

        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        break
      }

      case 'error': {
        gainNode.gain.setValueAtTime(soundSettings.volume * 0.35, now)
        
        const osc1 = ctx.createOscillator()
        osc1.type = 'square'
        osc1.frequency.setValueAtTime(329.63, now)
        osc1.frequency.exponentialRampToValueAtTime(246.94, now + 0.25)
        osc1.connect(gainNode)
        osc1.start(now)
        osc1.stop(now + 0.3)

        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
        break
      }

      case 'default':
      default: {
        const osc1 = ctx.createOscillator()
        osc1.type = 'sine'
        osc1.frequency.setValueAtTime(587.33, now)
        osc1.connect(gainNode)

        const osc2 = ctx.createOscillator()
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(783.99, now)
        osc2.connect(gainNode)

        osc1.start(now)
        osc2.start(now + 0.05)

        osc1.stop(now + 0.1)
        osc2.stop(now + 0.15)

        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
        break
      }
    }
  }

  const toggleSound = () => {
    setSoundSettings((current) => ({
      enabled: !((current || soundSettings)?.enabled ?? true),
      volume: (current || soundSettings)?.volume ?? 0.5,
    }))
  }

  const setVolume = (volume: number) => {
    setSoundSettings((current) => ({
      enabled: (current || soundSettings)?.enabled ?? true,
      volume: Math.max(0, Math.min(1, volume)),
    }))
  }

  return {
    playSound,
    soundEnabled: soundSettings?.enabled ?? true,
    volume: soundSettings?.volume ?? 0.5,
    toggleSound,
    setVolume,
  }
}
