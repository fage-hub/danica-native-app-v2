import { useCallback } from 'react'

export function useMicroInteractions() {
  const createHapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10)
    }
  }, [])

  return {
    createHapticFeedback
  }
}
