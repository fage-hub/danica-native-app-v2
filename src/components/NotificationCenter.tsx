"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Bell, CheckCircle, CreditCard, Ticket, ClipboardText, Warning, Info, X, Check, Trash, SpeakerHigh, SpeakerSlash, XCircle } from '@phosphor-icons/react'
import { useNotifications, Notification } from '@/hooks/use-notifications'
import { useNotificationSound } from '@/hooks/use-notification-sound'
import { VolumeVisualizer } from '@/components/VolumeVisualizer'
import { toast } from 'sonner'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type NotificationCenterProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProject?: (projectId: string) => void
  onSelectInvoice?: (invoiceId: string) => void
  onSelectTicket?: (ticketId: string) => void
}

export function NotificationCenter({
  open,
  onOpenChange,
  onSelectProject,
  onSelectInvoice,
  onSelectTicket,
}: NotificationCenterProps) {
  const { t } = useLanguage()
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    clearRead,
  } = useNotifications()

  const { soundEnabled, volume, toggleSound, setVolume, playSound } = useNotificationSound()
  const [isPlayingSound, setIsPlayingSound] = useState(false)
  const [visualizerVariant, setVisualizerVariant] = useState<'bars' | 'waves'>('bars')

  const getNotificationIcon = (icon: Notification['icon']) => {
    switch (icon) {
      case 'project':
        return <ClipboardText size={20} weight="duotone" className="text-accent" />
      case 'invoice':
        return <CreditCard size={20} weight="duotone" className="text-primary" />
      case 'ticket':
        return <Ticket size={20} weight="duotone" className="text-accent" />
      case 'check':
        return <CheckCircle size={20} weight="fill" className="text-green-500" />
      case 'warning':
        return <Warning size={20} weight="fill" className="text-yellow-500" />
      case 'info':
        return <Info size={20} weight="fill" className="text-blue-500" />
      case 'error':
        return <XCircle size={20} weight="fill" className="text-red-500" />
      default:
        return <Bell size={20} weight="duotone" className="text-muted-foreground" />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.relatedId) {
      switch (notification.type) {
        case 'project':
          onSelectProject?.(notification.relatedId)
          break
        case 'invoice':
          onSelectInvoice?.(notification.relatedId)
          break
        case 'ticket':
          onSelectTicket?.(notification.relatedId)
          break
      }
      onOpenChange(false)
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return t.notifications.justNow
    if (minutes < 60) return `${minutes}${t.notifications.minutesAgo}`
    if (hours < 24) return `${hours}${t.notifications.hoursAgo}`
    if (days < 7) return `${days}${t.notifications.daysAgo}`
    return new Date(timestamp).toLocaleDateString()
  }

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  const projectNotifications = notifications.filter((n) => n.type === 'project')
  const invoiceNotifications = notifications.filter((n) => n.type === 'invoice')
  const ticketNotifications = notifications.filter((n) => n.type === 'ticket')

  const handleClearAll = () => {
    clearAll()
    toast.success(t.notifications.allCleared)
  }

  const handleClearRead = () => {
    clearRead()
    toast.success(t.notifications.readCleared)
  }

  const handleMarkAllRead = () => {
    markAllAsRead()
    toast.success(t.notifications.allMarkedRead)
  }

  const handlePlaySound = (type: 'default' | 'success' | 'warning' | 'info' | 'critical' | 'error') => {
    setIsPlayingSound(true)
    playSound(type)
    setTimeout(() => setIsPlayingSound(false), 600)
  }

  const renderNotificationList = (notificationList: Notification[]) => {
    if (notificationList.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Bell size={48} weight="duotone" className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">{t.notifications.noNotifications}</p>
          <p className="text-xs mt-1">{t.notifications.allCaughtUp}</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {notificationList.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative rounded-lg border transition-all ${
                notification.read
                  ? 'bg-background hover:bg-muted/30 border-border/50'
                  : 'bg-accent/5 hover:bg-accent/10 border-accent/30'
              }`}
            >
              <button
                onClick={() => handleNotificationClick(notification)}
                className="w-full flex items-start gap-3 p-4 text-left"
              >
                <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.icon)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-accent rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{notification.description}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              </button>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
                      toast.success(t.notifications.markedAsRead)
                    }}
                  >
                    <Check size={14} />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notification.id)
                    toast.success(t.notifications.notificationDeleted)
                  }}
                >
                  <Trash size={14} />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Bell size={24} weight="duotone" className="text-accent" />
              </div>
              <div>
                <DialogTitle className="text-xl">{t.notifications.title}</DialogTitle>
                <DialogDescription className="mt-0.5">
                  {t.notifications.subtitle}
                </DialogDescription>
              </div>
            </div>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2.5 py-1">
                {unreadCount} {t.notifications.newCount}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-3 space-y-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="h-8"
            >
              <Check size={16} className="mr-1" />
              {t.notifications.markAllRead}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearRead}
              disabled={readNotifications.length === 0}
              className="h-8"
            >
              <Trash size={16} className="mr-1" />
              {t.notifications.clearRead}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className="h-8"
            >
              <X size={16} className="mr-1" />
              {t.notifications.clearAll}
            </Button>
          </div>

          <div className="flex flex-col gap-3 p-3 rounded-lg border bg-background/50">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1">
                {soundEnabled ? (
                  <SpeakerHigh size={18} weight="duotone" className="text-accent flex-shrink-0" />
                ) : (
                  <SpeakerSlash size={18} weight="duotone" className="text-muted-foreground flex-shrink-0" />
                )}
                <span className="text-xs font-medium text-foreground">{t.notifications.sound}</span>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={toggleSound}
                  className="scale-75"
                />
              </div>
              
              {soundEnabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisualizerVariant(visualizerVariant === 'bars' ? 'waves' : 'bars')}
                  className="h-7 text-xs px-2"
                >
                  {visualizerVariant === 'bars' ? t.notifications.bars : t.notifications.waves}
                </Button>
              )}
            </div>
            
            {soundEnabled && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{t.notifications.volume}</span>
                    <Slider
                      value={[volume * 100]}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs font-medium text-foreground tabular-nums min-w-[2.5rem] text-right">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center px-2 py-1 rounded-md bg-muted/50">
                  <VolumeVisualizer 
                    volume={volume} 
                    isActive={isPlayingSound}
                    variant={visualizerVariant}
                  />
                </div>
              </>
            )}
          </div>
          
          {soundEnabled && (
            <div className="flex flex-col gap-2 p-2.5 rounded-lg border bg-background/50">
              <span className="text-xs font-medium text-foreground mb-1">{t.notifications.testSounds}</span>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlaySound('default')}
                  className="h-7 text-xs"
                >
                  <Bell size={14} className="mr-1" />
                  {t.notifications.normal}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlaySound('success')}
                  className="h-7 text-xs"
                >
                  <CheckCircle size={14} className="mr-1" />
                  {t.notifications.success}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlaySound('info')}
                  className="h-7 text-xs"
                >
                  <Info size={14} className="mr-1" />
                  {t.notifications.info}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlaySound('warning')}
                  className="h-7 text-xs"
                >
                  <Warning size={14} className="mr-1 text-yellow-500" />
                  {t.notifications.warning}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlaySound('error')}
                  className="h-7 text-xs"
                >
                  <XCircle size={14} className="mr-1 text-red-500" />
                  {t.notifications.error}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlaySound('critical')}
                  className="h-7 text-xs border-red-500/30 bg-red-50/50"
                >
                  <Warning size={14} weight="fill" className="mr-1 text-red-600" />
                  {t.notifications.critical}
                </Button>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs relative">
                {t.notifications.all}
                {notifications.length > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-70">({notifications.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs relative">
                {t.notifications.unread}
                {unreadCount > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-70">({unreadCount})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-xs">
                {t.notifications.projects}
                {projectNotifications.length > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-70">({projectNotifications.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="invoices" className="text-xs">
                {t.notifications.invoices}
                {invoiceNotifications.length > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-70">({invoiceNotifications.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="tickets" className="text-xs">
                {t.notifications.tickets}
                {ticketNotifications.length > 0 && (
                  <span className="ml-1.5 text-[10px] opacity-70">({ticketNotifications.length})</span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="flex-1 mt-0 px-6 pb-6 min-h-0">
            <ScrollArea className="h-full pr-4">
              {renderNotificationList(notifications)}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="flex-1 mt-0 px-6 pb-6 min-h-0">
            <ScrollArea className="h-full pr-4">
              {renderNotificationList(unreadNotifications)}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="projects" className="flex-1 mt-0 px-6 pb-6 min-h-0">
            <ScrollArea className="h-full pr-4">
              {renderNotificationList(projectNotifications)}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="invoices" className="flex-1 mt-0 px-6 pb-6 min-h-0">
            <ScrollArea className="h-full pr-4">
              {renderNotificationList(invoiceNotifications)}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tickets" className="flex-1 mt-0 px-6 pb-6 min-h-0">
            <ScrollArea className="h-full pr-4">
              {renderNotificationList(ticketNotifications)}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
