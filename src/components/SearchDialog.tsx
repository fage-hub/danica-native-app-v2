"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, ClipboardText, FileText, Ticket, X } from '@phosphor-icons/react'

type Project = {
  id: string
  name: string
  status: 'active' | 'pending' | 'completed'
  progress: number
  dueDate: string
  description?: string
  assignedTo?: string
  startDate?: string
  milestones?: { name: string; completed: boolean; date: string }[]
  budget?: number
  spent?: number
}

type Invoice = {
  id: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  date: string
  dueDate?: string
  description?: string
  items?: { description: string; amount: number }[]
}

type SearchTicket = {
  id: string
  subject: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  created: string
  description?: string
  messages?: { sender: string; message: string; time: string; isSupport: boolean }[]
}

type SearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: Project[]
  invoices: Invoice[]
  tickets: SearchTicket[]
  onSelectProject: (project: Project) => void
  onSelectInvoice: (invoice: Invoice) => void
  onSelectTicket: (ticket: SearchTicket) => void
}

export function SearchDialog({
  open,
  onOpenChange,
  projects,
  invoices,
  tickets,
  onSelectProject,
  onSelectInvoice,
  onSelectTicket,
}: SearchDialogProps) {
  const [query, setQuery] = useState('')

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
  )

  const filteredInvoices = invoices.filter(
    (i) =>
      i.id.toLowerCase().includes(query.toLowerCase()) ||
      i.description?.toLowerCase().includes(query.toLowerCase())
  )

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(query.toLowerCase()) ||
      t.subject.toLowerCase().includes(query.toLowerCase())
  )

  const hasResults =
    filteredProjects.length > 0 || filteredInvoices.length > 0 || filteredTickets.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="flex items-center gap-2">
            <MagnifyingGlass size={24} weight="duotone" className="text-accent" />
            Search Everything
          </DialogTitle>
          <DialogDescription>
            Search across projects, invoices, and support tickets
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-3">
          <div className="relative">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-[400px] px-6 pb-6">
          {!query ? (
            <div className="text-center py-12 text-muted-foreground">
              <MagnifyingGlass size={48} weight="duotone" className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">Start typing to search</p>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-12 text-muted-foreground">
              <MagnifyingGlass size={48} weight="duotone" className="mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Projects ({filteredProjects.length})
                  </h3>
                  {filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        onSelectProject(project)
                        onOpenChange(false)
                        setQuery('')
                      }}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <ClipboardText size={20} weight="duotone" className="text-accent shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{project.name}</p>
                          {project.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {project.status}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}

              {filteredInvoices.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Invoices ({filteredInvoices.length})
                  </h3>
                  {filteredInvoices.map((invoice) => (
                    <button
                      key={invoice.id}
                      onClick={() => {
                        onSelectInvoice(invoice)
                        onOpenChange(false)
                        setQuery('')
                      }}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText size={20} weight="duotone" className="text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{invoice.id}</p>
                          {invoice.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {invoice.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <p className="font-semibold text-sm">${invoice.amount.toLocaleString()}</p>
                        <Badge variant="secondary" className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {filteredTickets.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Support Tickets ({filteredTickets.length})
                  </h3>
                  {filteredTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => {
                        onSelectTicket(ticket)
                        onOpenChange(false)
                        setQuery('')
                      }}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Ticket size={20} weight="duotone" className="text-accent shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground">{ticket.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {ticket.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ticket.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
