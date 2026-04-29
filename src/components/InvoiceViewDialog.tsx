"use client"

/**
 * Stub: invoice viewer. Original Spark used a client-side PDF generator.
 * The real PayMongo hosted checkout already emails invoices; this view is
 * surfaced as a placeholder until the full PDF download endpoint ships.
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function InvoiceViewDialog({
  open,
  onOpenChange,
  orderId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId?: string | null
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice</DialogTitle>
          <DialogDescription>
            Order {orderId ? orderId.slice(0, 8).toUpperCase() : ""}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          PayMongo emails the official receipt directly to your inbox after each successful charge.
          A downloadable invoice PDF endpoint ships in the next iteration.
        </p>
      </DialogContent>
    </Dialog>
  )
}
