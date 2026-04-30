"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendUp, TrendDown, Clock, CheckCircle, CurrencyDollar, Ticket } from '@phosphor-icons/react'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

type Project = {
  id: string
  name: string
  status: 'active' | 'pending' | 'completed'
  progress: number
  dueDate: string
  budget?: number
  spent?: number
}

type Invoice = {
  id: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  date: string
}

type AnalyticsCardProps = {
  projects: Project[]
  invoices: Invoice[]
  tickets: any[]
}

export function AnalyticsCard({ projects, invoices, tickets }: AnalyticsCardProps) {
  const { t } = useLanguage()
  const activeProjects = projects.filter((p) => p.status === 'active').length
  const completedProjects = projects.filter((p) => p.status === 'completed').length
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0)
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidInvoices = invoices.filter((inv) => inv.status === 'paid')
  const paidRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const pendingRevenue = totalRevenue - paidRevenue

  const openTickets = tickets.filter((t) => t.status !== 'resolved').length
  const highPriorityTickets = tickets.filter((t) => t.priority === 'high' && t.status !== 'resolved').length

  const avgProjectProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendUp size={20} weight="duotone" className="text-accent" />
          {t.dashboard.analytics.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{t.dashboard.analytics.projectCompletion}</span>
              </div>
              <span className="text-sm font-semibold">{avgProjectProgress}%</span>
            </div>
            <Progress value={avgProjectProgress} className="h-2" />
            <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
              <span>{activeProjects} {t.dashboard.analytics.active}</span>
              <span>{completedProjects} {t.dashboard.analytics.completed}</span>
            </div>
          </div>

          {totalBudget > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CurrencyDollar size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{t.dashboard.analytics.budgetUtilization}</span>
                </div>
                <span className="text-sm font-semibold">{Math.round(budgetUtilization)}%</span>
              </div>
              <Progress value={budgetUtilization} className="h-2" />
              <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                <span>₱{totalSpent.toLocaleString()} {t.dashboard.analytics.spent}</span>
                <span>₱{totalBudget.toLocaleString()} {t.dashboard.analytics.total}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-3 border border-green-500/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} weight="fill" className="text-green-500" />
                <span className="text-xs font-medium text-muted-foreground">{t.dashboard.analytics.revenuePaid}</span>
              </div>
              <p className="text-xl font-bold">₱{(paidRevenue / 1000).toFixed(1)}k</p>
              <p className="text-xs text-muted-foreground">{paidInvoices.length} {t.dashboard.analytics.invoices}</p>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-lg p-3 border border-yellow-500/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} weight="fill" className="text-yellow-500" />
                <span className="text-xs font-medium text-muted-foreground">{t.dashboard.analytics.pending}</span>
              </div>
              <p className="text-xl font-bold">₱{(pendingRevenue / 1000).toFixed(1)}k</p>
              <p className="text-xs text-muted-foreground">{invoices.length - paidInvoices.length} {t.dashboard.analytics.invoices}</p>
            </motion.div>
          </div>

          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket size={16} weight="duotone" className="text-accent" />
                <span className="text-sm font-medium">{t.dashboard.analytics.supportStatus}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{openTickets} {t.dashboard.analytics.open}</span>
                {highPriorityTickets > 0 && (
                  <span className="text-xs font-semibold text-red-500">{highPriorityTickets} {t.dashboard.analytics.urgent}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
