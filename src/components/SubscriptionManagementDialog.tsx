"use client"

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  ArrowsClockwise,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  CreditCard,
  CalendarBlank,
  Coins,
  Warning,
  Clock,
  Trash,
  Package
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useLanguage } from '@/contexts/LanguageContext'
import { subscriptionManager, type Subscription, type SubscriptionHistory } from '@/lib/subscription-manager'
import { format, formatDistanceToNow } from 'date-fns'

type SubscriptionManagementDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusColors = {
  active: 'bg-success/10 text-success border-success/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  expired: 'bg-muted text-muted-foreground border-muted',
  paused: 'bg-warning/10 text-warning border-warning/20'
}

const statusIcons = {
  active: CheckCircle,
  cancelled: XCircle,
  expired: Clock,
  paused: Pause
}

const intervalLabels = {
  en: {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly'
  },
  zh: {
    monthly: '每月',
    quarterly: '每季度',
    yearly: '每年'
  }
}

export function SubscriptionManagementDialog({ open, onOpenChange }: SubscriptionManagementDialogProps) {
  const { language } = useLanguage()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [renewalHistory, setRenewalHistory] = useState<SubscriptionHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'active' | 'history'>('active')
  const [upcomingRenewals, setUpcomingRenewals] = useState<Subscription[]>([])

  useEffect(() => {
    if (open) {
      loadSubscriptions()
    }
  }, [open])

  const loadSubscriptions = async () => {
    setLoading(true)
    try {
      const subs = await subscriptionManager.getSubscriptions()
      const history = await subscriptionManager.getRenewalHistory()
      const upcoming = await subscriptionManager.getUpcomingRenewals(7)
      
      setSubscriptions(subs)
      setRenewalHistory(history)
      setUpcomingRenewals(upcoming)
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
      toast.error(language === 'zh' ? '加载订阅失败' : 'Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async (subscriptionId: string) => {
    const result = await subscriptionManager.cancelSubscription(subscriptionId)
    
    if (result.success) {
      toast.success(language === 'zh' ? '订阅已取消' : 'Subscription cancelled')
      loadSubscriptions()
    } else {
      toast.error(result.error || (language === 'zh' ? '取消失败' : 'Failed to cancel'))
    }
  }

  const handlePauseSubscription = async (subscriptionId: string) => {
    const result = await subscriptionManager.pauseSubscription(subscriptionId)
    
    if (result.success) {
      toast.success(language === 'zh' ? '订阅已暂停' : 'Subscription paused')
      loadSubscriptions()
    } else {
      toast.error(result.error || (language === 'zh' ? '暂停失败' : 'Failed to pause'))
    }
  }

  const handleResumeSubscription = async (subscriptionId: string) => {
    const result = await subscriptionManager.resumeSubscription(subscriptionId)
    
    if (result.success) {
      toast.success(language === 'zh' ? '订阅已恢复' : 'Subscription resumed')
      loadSubscriptions()
    } else {
      toast.error(result.error || (language === 'zh' ? '恢复失败' : 'Failed to resume'))
    }
  }

  const getStatusBadge = (status: Subscription['status']) => {
    const StatusIcon = statusIcons[status]
    const labels = {
      active: language === 'zh' ? '进行中' : 'Active',
      cancelled: language === 'zh' ? '已取消' : 'Cancelled',
      expired: language === 'zh' ? '已过期' : 'Expired',
      paused: language === 'zh' ? '已暂停' : 'Paused'
    }

    return (
      <Badge className={statusColors[status]}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {labels[status]}
      </Badge>
    )
  }

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  const inactiveSubscriptions = subscriptions.filter(s => s.status !== 'active')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowsClockwise className="w-5 h-5 text-primary" />
            {language === 'zh' ? '订阅管理' : 'Subscription Management'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh' 
              ? '管理您的自动续订和订阅计划' 
              : 'Manage your auto-renewals and subscription plans'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {upcomingRenewals.length > 0 && (
            <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Warning className="w-4 h-4 text-accent" />
                  {language === 'zh' ? '即将续订' : 'Upcoming Renewals'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcomingRenewals.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{sub.packageName}</span>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarBlank className="w-3 h-3" />
                      {format(new Date(sub.nextChargeDate), 'MMM dd, yyyy')}
                      <span className="text-primary font-semibold">${sub.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 border-b">
            <Button
              variant={selectedTab === 'active' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('active')}
            >
              {language === 'zh' ? '订阅' : 'Subscriptions'}
              {activeSubscriptions.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeSubscriptions.length}
                </Badge>
              )}
            </Button>
            <Button
              variant={selectedTab === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTab('history')}
            >
              {language === 'zh' ? '续订历史' : 'Renewal History'}
            </Button>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <AnimatePresence mode="wait">
              {selectedTab === 'active' && (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  {loading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      {language === 'zh' ? '加载中...' : 'Loading...'}
                    </div>
                  ) : subscriptions.length === 0 ? (
                    <div className="text-center py-12">
                      <ArrowsClockwise className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'zh' ? '暂无订阅' : 'No subscriptions yet'}
                      </p>
                    </div>
                  ) : (
                    <>
                      {activeSubscriptions.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            {language === 'zh' ? '活跃订阅' : 'Active Subscriptions'}
                          </h3>
                          {activeSubscriptions.map((subscription, index) => (
                            <SubscriptionCard
                              key={subscription.id}
                              subscription={subscription}
                              index={index}
                              language={language}
                              onCancel={handleCancelSubscription}
                              onPause={handlePauseSubscription}
                              onResume={handleResumeSubscription}
                              getStatusBadge={getStatusBadge}
                            />
                          ))}
                        </div>
                      )}

                      {inactiveSubscriptions.length > 0 && (
                        <div className="space-y-3 mt-6">
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            {language === 'zh' ? '已停用订阅' : 'Inactive Subscriptions'}
                          </h3>
                          {inactiveSubscriptions.map((subscription, index) => (
                            <SubscriptionCard
                              key={subscription.id}
                              subscription={subscription}
                              index={index}
                              language={language}
                              onCancel={handleCancelSubscription}
                              onPause={handlePauseSubscription}
                              onResume={handleResumeSubscription}
                              getStatusBadge={getStatusBadge}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {selectedTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-3"
                >
                  {renewalHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'zh' ? '暂无续订历史' : 'No renewal history yet'}
                      </p>
                    </div>
                  ) : (
                    renewalHistory
                      .sort((a, b) => new Date(b.renewalDate).getTime() - new Date(a.renewalDate).getTime())
                      .map((history, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {history.status === 'success' ? (
                                      <CheckCircle className="w-4 h-4 text-success" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-destructive" />
                                    )}
                                    <span className="font-medium text-sm">
                                      {subscriptions.find(s => s.id === history.subscriptionId)?.packageName || 'Unknown Package'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    <p className="flex items-center gap-2">
                                      <CalendarBlank className="w-3 h-3" />
                                      {format(new Date(history.renewalDate), 'MMM dd, yyyy HH:mm')}
                                    </p>
                                    {history.status === 'success' && (
                                      <p className="flex items-center gap-2">
                                        <Coins className="w-3 h-3" />
                                        +{history.tokensAdded.toLocaleString()} tokens
                                      </p>
                                    )}
                                    {history.status === 'failed' && history.failureReason && (
                                      <p className="text-destructive flex items-center gap-2">
                                        <Warning className="w-3 h-3" />
                                        {history.failureReason}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`text-lg font-bold ${history.status === 'success' ? 'text-success' : 'text-destructive'}`}>
                                    ${history.amount.toFixed(2)}
                                  </p>
                                  <Badge variant={history.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                                    {history.status === 'success' 
                                      ? (language === 'zh' ? '成功' : 'Success')
                                      : (language === 'zh' ? '失败' : 'Failed')
                                    }
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SubscriptionCard({
  subscription,
  index,
  language,
  onCancel,
  onPause,
  onResume,
  getStatusBadge
}: {
  subscription: Subscription
  index: number
  language: 'en' | 'zh'
  onCancel: (id: string) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
  getStatusBadge: (status: Subscription['status']) => JSX.Element
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'token':
        return <Coins className="w-4 h-4 text-accent" />
      case 'bundle':
        return <Package className="w-4 h-4 text-primary" />
      default:
        return <CreditCard className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                {getTypeIcon(subscription.packageType)}
                {subscription.packageName}
              </CardTitle>
              <CardDescription className="mt-1">
                {intervalLabels[language][subscription.billingInterval]} • {subscription.tokenAmount.toLocaleString()} tokens
              </CardDescription>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">
                {language === 'zh' ? '费用' : 'Price'}
              </p>
              <p className="font-semibold text-lg text-primary">
                ${subscription.price.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">
                {language === 'zh' ? '下次扣款' : 'Next Charge'}
              </p>
              <p className="font-medium">
                {subscription.status === 'active' || subscription.status === 'paused'
                  ? format(new Date(subscription.nextChargeDate), 'MMM dd, yyyy')
                  : '-'
                }
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">
                {language === 'zh' ? '已续订次数' : 'Total Renewals'}
              </p>
              <p className="font-medium">{subscription.totalRenewals}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">
                {language === 'zh' ? '支付方式' : 'Payment Method'}
              </p>
              <p className="font-medium text-xs flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                {subscription.paymentDetails.cardLast4
                  ? `****${subscription.paymentDetails.cardLast4}`
                  : subscription.paymentDetails.email || subscription.paymentMethod
                }
              </p>
            </div>
          </div>

          {subscription.lastRenewalAt && (
            <p className="text-xs text-muted-foreground">
              {language === 'zh' ? '最后续订：' : 'Last renewed: '}
              {formatDistanceToNow(new Date(subscription.lastRenewalAt), { addSuffix: true })}
            </p>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={subscription.autoRenew}
                disabled={subscription.status !== 'active'}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    onPause(subscription.id)
                  } else {
                    onResume(subscription.id)
                  }
                }}
              />
              <Label className="text-sm cursor-pointer">
                {language === 'zh' ? '自动续订' : 'Auto-Renew'}
              </Label>
            </div>

            <div className="flex gap-2">
              {subscription.status === 'paused' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResume(subscription.id)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  {language === 'zh' ? '恢复' : 'Resume'}
                </Button>
              )}
              {subscription.status === 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(subscription.id)}
                >
                  <Trash className="w-4 h-4 mr-1" />
                  {language === 'zh' ? '取消' : 'Cancel'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
