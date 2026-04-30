"use client"

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Receipt, 
  Clock, 
  CheckCircle,
  Coins,
  Package,
  Calendar,
  Download,
  Eye
} from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { paymentGateway } from '@/lib/payment-gateway'
import { invoiceGenerator, type Invoice } from '@/lib/invoice-generator'
import { InvoiceViewDialog } from '@/components/InvoiceViewDialog'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

type PurchaseHistoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PurchaseHistoryDialog({ open, onOpenChange }: PurchaseHistoryDialogProps) {
  const { language } = useLanguage()
  const [purchases, setPurchases] = useState<any[]>([])
  const [tokenBalance, setTokenBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)

  useEffect(() => {
    if (open) {
      loadPurchaseHistory()
    }
  }, [open])

  const loadPurchaseHistory = async () => {
    setLoading(true)
    try {
      const history = await paymentGateway.getPurchaseHistory()
      const balance = await paymentGateway.getTokenBalance()
      const allInvoices = await invoiceGenerator.getAllInvoices()
      setPurchases(history)
      setTokenBalance(balance)
      setInvoices(allInvoices)
    } catch (error) {
      console.error('Failed to load purchase history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewInvoice = (purchaseId: string) => {
    const invoice = invoices.find(inv => inv.transactionId === purchaseId)
    if (invoice) {
      setSelectedInvoice(invoice)
      setInvoiceDialogOpen(true)
    } else {
      toast.error(
        language === 'en'
          ? 'Invoice not found'
          : '未找到发票'
      )
    }
  }

  const handleDownloadInvoice = (purchaseId: string) => {
    const invoice = invoices.find(inv => inv.transactionId === purchaseId)
    if (invoice) {
      invoiceGenerator.downloadInvoice(invoice)
      toast.success(
        language === 'en'
          ? 'Invoice downloaded successfully'
          : '发票下载成功'
      )
    } else {
      toast.error(
        language === 'en'
          ? 'Invoice not found'
          : '未找到发票'
      )
    }
  }

  const getStatusBadge = (status: 'active' | 'expired') => {
    if (status === 'active') {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          {language === 'zh' ? '有效' : 'Active'}
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <Clock className="w-3 h-3 mr-1" />
        {language === 'zh' ? '已过期' : 'Expired'}
      </Badge>
    )
  }

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'token':
        return <Coins className="w-4 h-4 text-accent" />
      case 'bundle':
        return <Package className="w-4 h-4 text-primary" />
      default:
        return <Receipt className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {language === 'zh' ? '购买历史' : 'Purchase History'}
          </DialogTitle>
          <DialogDescription>
            {language === 'zh' ? '查看您的所有购买记录和token余额' : 'View all your purchases and token balance'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Coins className="w-5 h-5 text-accent" />
                {language === 'zh' ? '当前余额' : 'Current Balance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {tokenBalance.toLocaleString()} {language === 'zh' ? 'tokens' : 'tokens'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'zh' ? '可用于所有服务' : 'Available for all services'}
              </p>
            </CardContent>
          </Card>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  {language === 'zh' ? '加载中...' : 'Loading...'}
                </div>
              ) : purchases.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'zh' ? '暂无购买记录' : 'No purchase history yet'}
                  </p>
                </div>
              ) : (
                purchases.map((purchase, index) => (
                  <motion.div
                    key={purchase.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Receipt className="w-4 h-4" />
                              {language === 'zh' ? '订单' : 'Order'} #{purchase.id.slice(-8)}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(purchase.purchasedAt), 'MMM dd, yyyy HH:mm')}
                            </CardDescription>
                          </div>
                          {getStatusBadge(purchase.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          {purchase.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                {getItemTypeIcon(item.type)}
                                <span>{item.name}</span>
                                {item.quantity > 1 && (
                                  <span className="text-muted-foreground">
                                    × {item.quantity.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <span className="font-medium">₱{item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              {language === 'zh' ? '总计' : 'Total'}
                            </p>
                            {purchase.status === 'active' && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {language === 'zh' ? '有效至' : 'Valid until'} {format(new Date(purchase.validUntil), 'MMM dd, yyyy')}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              ${purchase.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleViewInvoice(purchase.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {language === 'zh' ? '查看发票' : 'View Invoice'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDownloadInvoice(purchase.id)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {language === 'zh' ? '下载' : 'Download'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>

      <InvoiceViewDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        invoice={selectedInvoice}
      />
    </Dialog>
  )
}
