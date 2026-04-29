"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PaperPlaneRight, User } from '@phosphor-icons/react'
import { toast } from 'sonner'

type Ticket = {
  id: string
  subject: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  created: string
  description?: string
  messages?: { sender: string; message: string; time: string; isSupport: boolean }[]
}

type TicketDetailDialogProps = {
  ticket: Ticket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TicketDetailDialog({ ticket, open, onOpenChange }: TicketDetailDialogProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  if (!ticket) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-500 text-white'
      case 'in-progress':
        return 'bg-accent text-accent-foreground'
      case 'resolved':
        return 'bg-green-500 text-white'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white'
      case 'medium':
        return 'bg-yellow-500 text-white'
      case 'low':
        return 'bg-green-500 text-white'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  const messages = ticket.messages || [
    {
      sender: 'You',
      message: ticket.description || 'Initial ticket description...',
      time: ticket.created,
      isSupport: false,
    },
    {
      sender: 'Support Team',
      message: "Thank you for reaching out. We're looking into this issue and will update you shortly.",
      time: ticket.created,
      isSupport: true,
    },
  ]

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast.success('Message sent', {
      description: 'Your message has been added to the ticket.',
    })

    setNewMessage('')
    setIsSending(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <DialogTitle className="text-lg">{ticket.id}</DialogTitle>
                <Badge className={`${getStatusColor(ticket.status)} text-xs`}>
                  {ticket.status}
                </Badge>
                <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
                  {ticket.priority}
                </Badge>
              </div>
              <DialogDescription>{ticket.subject}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 mt-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.isSupport ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={
                    msg.isSupport
                      ? 'bg-accent/10 text-accent text-xs'
                      : 'bg-primary/10 text-primary text-xs'
                  }
                >
                  {msg.isSupport ? 'ST' : 'YO'}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${msg.isSupport ? 'text-left' : 'text-right'}`}>
                <div
                  className={`inline-block max-w-[85%] rounded-lg p-3 ${
                    msg.isSupport ? 'bg-muted' : 'bg-accent/10'
                  }`}
                >
                  <p className="text-xs font-medium mb-1 text-muted-foreground">
                    {msg.sender}
                  </p>
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{msg.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
            disabled={isSending || ticket.status === 'resolved'}
          />
          <Button
            className="w-full"
            onClick={handleSendMessage}
            disabled={isSending || !newMessage.trim() || ticket.status === 'resolved'}
          >
            {isSending ? (
              'Sending...'
            ) : (
              <>
                <PaperPlaneRight size={20} className="mr-2" />
                Send Message
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
