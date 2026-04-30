"use client"

import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@/lib/spark-shim'
import { useNotificationSound, type NotificationSoundType } from './use-notification-sound'

export type NotificationType = 'project' | 'invoice' | 'ticket' | 'system'
export type NotificationPriority = 'normal' | 'high' | 'critical'

export type Notification = {
  id: string
  type: NotificationType
  title: string
  description: string
  time: string
  timestamp: number
  icon: 'project' | 'invoice' | 'ticket' | 'check' | 'warning' | 'info' | 'error'
  priority?: NotificationPriority
  read: boolean
  relatedId?: string
  action?: {
    label: string
    handler: () => void
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useKV<Notification[]>('user-notifications-v2', [])
  const [unreadCount, setUnreadCount] = useState(0)
  const { playSound } = useNotificationSound()

  useEffect(() => {
    const count = (notifications || []).filter(n => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
      priority: notification.priority || 'normal',
    }

    setNotifications((current) => {
      const updated = [newNotification, ...(current || [])]
      return updated.slice(0, 100)
    })

    let soundType: NotificationSoundType = 'default'
    
    if (notification.priority === 'critical') {
      soundType = 'critical'
    } else if (notification.priority === 'high') {
      soundType = 'warning'
    } else if (notification.icon === 'error') {
      soundType = 'error'
    } else if (notification.icon === 'check') {
      soundType = 'success'
    } else if (notification.icon === 'warning') {
      soundType = 'warning'
    } else if (notification.icon === 'info') {
      soundType = 'info'
    }
    
    playSound(soundType)

    return newNotification.id
  }, [setNotifications, playSound])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((current) =>
      (current || []).map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }, [setNotifications])

  const markAllAsRead = useCallback(() => {
    setNotifications((current) =>
      (current || []).map((n) => ({ ...n, read: true }))
    )
  }, [setNotifications])

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((current) =>
      (current || []).filter((n) => n.id !== notificationId)
    )
  }, [setNotifications])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [setNotifications])

  const clearRead = useCallback(() => {
    setNotifications((current) =>
      (current || []).filter((n) => !n.read)
    )
  }, [setNotifications])

  return {
    notifications: notifications || [],
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    clearRead,
  }
}
