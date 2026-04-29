"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@/lib/spark-shim'
import { useLanguage } from '@/contexts/LanguageContext'

type Ticket = {
  id: string
  subject: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  created: string
}

export function NewTicketDialog() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [tickets, setTickets] = useKV<Ticket[]>('user-tickets', [])
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newTicket: Ticket = {
      id: `TKT-${Math.floor(Math.random() * 1000)}`,
      subject: formData.subject,
      status: 'open',
      priority: formData.priority,
      created: new Date().toISOString().split('T')[0],
    }

    setTickets((currentTickets) => [...(currentTickets || []), newTicket])

    toast.success(t.newTicket.ticketCreated, {
      description: `${t.newTicket.ticketSubmitted} ${newTicket.id} ${t.newTicket.ticketSubmitted}`,
    })

    setFormData({ subject: '', description: '', priority: 'medium' })
    setOpen(false)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus size={20} className="mr-2" />
          {t.newTicket.createNewTicket}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.newTicket.createSupportTicket}</DialogTitle>
          <DialogDescription>
            {t.newTicket.submitNewRequest}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="subject">{t.newTicket.subject}</Label>
            <Input
              id="subject"
              placeholder={t.newTicket.subjectPlaceholder}
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.newTicket.description}</Label>
            <Textarea
              id="description"
              placeholder={t.newTicket.descriptionPlaceholder}
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">{t.newTicket.priority}</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder={t.newTicket.selectPriority} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">{t.newTicket.low}</SelectItem>
                <SelectItem value="medium">{t.newTicket.medium}</SelectItem>
                <SelectItem value="high">{t.newTicket.high}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              {t.newTicket.cancel}
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? t.newTicket.submitting : t.newTicket.submitTicket}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
