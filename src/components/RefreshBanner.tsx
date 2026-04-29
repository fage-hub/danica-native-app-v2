"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowsClockwise, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useLanguage } from '@/contexts/LanguageContext'

type RefreshBannerProps = {
  visible: boolean
  isRefreshing: boolean
  autoRefreshEnabled: boolean
  lastRefreshTime: Date
  onRefresh: () => void
  onDismiss: () => void
  onToggleAutoRefresh: () => void
}

function getTimeAgo(date: Date, t: ReturnType<typeof useLanguage>['t']): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  if (diffMins < 1) {
    return t.dashboard.dataRefresh.justNow
  } else if (diffMins < 60) {
    return `${diffMins} ${t.dashboard.dataRefresh.minutesAgo}`
  } else {
    return `${diffHours} ${t.dashboard.dataRefresh.hoursAgo}`
  }
}

export function RefreshBanner({
  visible,
  isRefreshing,
  autoRefreshEnabled,
  lastRefreshTime,
  onRefresh,
  onDismiss,
  onToggleAutoRefresh,
}: RefreshBannerProps) {
  const { t } = useLanguage()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md"
        >
          <div className="bg-gradient-to-r from-accent to-primary text-white rounded-xl shadow-2xl p-4 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <motion.div
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{
                    duration: 1,
                    repeat: isRefreshing ? Infinity : 0,
                    ease: 'linear',
                  }}
                >
                  <ArrowsClockwise size={24} weight="bold" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">
                    {isRefreshing ? t.dashboard.dataRefresh.refreshing : t.dashboard.dataRefresh.newDataAvailable}
                  </p>
                  <p className="text-xs opacity-90 truncate">
                    {t.dashboard.dataRefresh.clickToRefresh}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!isRefreshing && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onRefresh}
                    className="h-8 px-3 text-xs font-semibold"
                  >
                    {t.dashboard.dataRefresh.refreshNow}
                  </Button>
                )}
                <button
                  onClick={onDismiss}
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} weight="bold" />
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-refresh-toggle"
                  checked={autoRefreshEnabled}
                  onCheckedChange={onToggleAutoRefresh}
                  className="data-[state=checked]:bg-white/30"
                />
                <label htmlFor="auto-refresh-toggle" className="text-xs font-medium cursor-pointer">
                  {t.dashboard.dataRefresh.autoRefresh}
                </label>
              </div>
              <p className="text-xs opacity-75">
                {t.dashboard.dataRefresh.lastUpdated}: {getTimeAgo(lastRefreshTime, t)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
