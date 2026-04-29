import type { PaymentItem } from './payment-gateway'

export type Invoice = {
  id: string
  invoiceNumber: string
  date: Date
  dueDate: Date
  items: Array<{
    name: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  taxRate: number
  total: number
  currency: string
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  paymentMethod?: string
  transactionId?: string
  customer: {
    name: string
    email: string
    company?: string
    address?: string
  }
  vendor: {
    name: string
    email: string
    address: string
    taxId: string
    phone: string
  }
  notes?: string
}

const VENDOR_INFO = {
  name: 'Danica IT Solutions',
  email: 'billing@danicait.com',
  address: '123 Tech Street, Innovation District, San Francisco, CA 94105, USA',
  taxId: 'TAX-123456789',
  phone: '+1 (555) 123-4567'
}

export class InvoiceGenerator {
  private static instance: InvoiceGenerator

  private constructor() {}

  static getInstance(): InvoiceGenerator {
    if (!InvoiceGenerator.instance) {
      InvoiceGenerator.instance = new InvoiceGenerator()
    }
    return InvoiceGenerator.instance
  }

  async generateInvoice(
    transactionId: string,
    items: PaymentItem[],
    total: number,
    paymentMethod: string,
    customerInfo: {
      name: string
      email: string
      company?: string
      address?: string
    },
    options?: {
      taxRate?: number
      currency?: string
      notes?: string
    }
  ): Promise<Invoice> {
    const invoiceNumber = this.generateInvoiceNumber()
    const now = new Date()
    const taxRate = options?.taxRate || 0.08
    const currency = options?.currency || 'USD'

    const invoiceItems = items.map(item => ({
      name: item.name,
      description: this.getItemDescription(item),
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity
    }))

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * taxRate

    const invoice: Invoice = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber,
      date: now,
      dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      items: invoiceItems,
      subtotal,
      tax,
      taxRate,
      total,
      currency,
      status: 'paid',
      paymentMethod,
      transactionId,
      customer: customerInfo,
      vendor: VENDOR_INFO,
      notes: options?.notes
    }

    await this.saveInvoice(invoice)

    return invoice
  }

  private getItemDescription(item: PaymentItem): string {
    switch (item.type) {
      case 'token':
        return `AI Processing Tokens - ${item.quantity.toLocaleString()} tokens`
      case 'bundle':
        return 'AI Service Bundle Package with premium features'
      case 'service':
        return 'AI Service Subscription'
      default:
        return 'Digital Product'
    }
  }

  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
    return `INV-${year}${month}-${random}`
  }

  async getInvoice(invoiceId: string): Promise<Invoice | null> {
    const invoices = await spark.kv.get<Invoice[]>('invoices') || []
    return invoices.find(inv => inv.id === invoiceId) || null
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
    const invoices = await spark.kv.get<Invoice[]>('invoices') || []
    return invoices.find(inv => inv.invoiceNumber === invoiceNumber) || null
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await spark.kv.get<Invoice[]>('invoices') || []
  }

  async getUserInvoices(userEmail: string): Promise<Invoice[]> {
    const invoices = await this.getAllInvoices()
    return invoices.filter(inv => inv.customer.email === userEmail)
  }

  private async saveInvoice(invoice: Invoice): Promise<void> {
    const invoices = await spark.kv.get<Invoice[]>('invoices') || []
    invoices.push(invoice)
    await spark.kv.set('invoices', invoices)
  }

  async updateInvoiceStatus(
    invoiceId: string,
    status: Invoice['status']
  ): Promise<void> {
    const invoices = await spark.kv.get<Invoice[]>('invoices') || []
    const index = invoices.findIndex(inv => inv.id === invoiceId)
    if (index !== -1) {
      invoices[index].status = status
      await spark.kv.set('invoices', invoices)
    }
  }

  generateInvoicePDF(invoice: Invoice): string {
    return this.generateInvoiceHTML(invoice)
  }

  private generateInvoiceHTML(invoice: Invoice): string {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: invoice.currency
      }).format(amount)
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f9fafb;
      padding: 40px 20px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #e5e7eb;
    }
    .company-info h1 {
      font-size: 28px;
      font-weight: 700;
      color: #6366f1;
      margin-bottom: 8px;
    }
    .company-info p {
      font-size: 14px;
      color: #6b7280;
      margin: 2px 0;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-meta h2 {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
    }
    .invoice-meta p {
      font-size: 14px;
      color: #6b7280;
      margin: 4px 0;
    }
    .invoice-meta .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .status.paid {
      background: #d1fae5;
      color: #065f46;
    }
    .status.pending {
      background: #fef3c7;
      color: #92400e;
    }
    .parties {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      gap: 40px;
    }
    .party {
      flex: 1;
    }
    .party h3 {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .party p {
      font-size: 14px;
      color: #374151;
      margin: 4px 0;
    }
    .party .name {
      font-weight: 600;
      font-size: 16px;
      color: #111827;
      margin-bottom: 8px;
    }
    .items-table {
      width: 100%;
      margin-bottom: 30px;
      border-collapse: collapse;
    }
    .items-table thead {
      background: #f9fafb;
    }
    .items-table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      border-bottom: 2px solid #e5e7eb;
      letter-spacing: 0.5px;
    }
    .items-table th:last-child {
      text-align: right;
    }
    .items-table td {
      padding: 16px 12px;
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }
    .items-table td:last-child {
      text-align: right;
      font-weight: 600;
      color: #111827;
    }
    .items-table .item-name {
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }
    .items-table .item-description {
      font-size: 13px;
      color: #6b7280;
    }
    .totals {
      margin-left: auto;
      width: 300px;
      margin-top: 20px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 14px;
    }
    .totals-row.subtotal,
    .totals-row.tax {
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
    }
    .totals-row.total {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      padding-top: 16px;
      border-top: 2px solid #e5e7eb;
    }
    .payment-info {
      margin-top: 40px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 6px;
    }
    .payment-info h3 {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
    }
    .payment-info p {
      font-size: 13px;
      color: #6b7280;
      margin: 6px 0;
    }
    .notes {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid #e5e7eb;
    }
    .notes h3 {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
    }
    .notes p {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.6;
    }
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .invoice-container {
        box-shadow: none;
        padding: 40px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="company-info">
        <h1>${invoice.vendor.name}</h1>
        <p>${invoice.vendor.email}</p>
        <p>${invoice.vendor.phone}</p>
        <p>Tax ID: ${invoice.vendor.taxId}</p>
      </div>
      <div class="invoice-meta">
        <h2>INVOICE</h2>
        <p><strong>${invoice.invoiceNumber}</strong></p>
        <p>Date: ${formatDate(invoice.date)}</p>
        <p>Due Date: ${formatDate(invoice.dueDate)}</p>
        <span class="status ${invoice.status}">${invoice.status}</span>
      </div>
    </div>

    <div class="parties">
      <div class="party">
        <h3>Billed To</h3>
        <p class="name">${invoice.customer.name}</p>
        ${invoice.customer.company ? `<p>${invoice.customer.company}</p>` : ''}
        <p>${invoice.customer.email}</p>
        ${invoice.customer.address ? `<p>${invoice.customer.address}</p>` : ''}
      </div>
      <div class="party">
        <h3>From</h3>
        <p class="name">${invoice.vendor.name}</p>
        <p>${invoice.vendor.address}</p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Quantity</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items.map(item => `
        <tr>
          <td>
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
          </td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
          <td>${formatCurrency(item.total)}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row subtotal">
        <span>Subtotal</span>
        <span>${formatCurrency(invoice.subtotal)}</span>
      </div>
      <div class="totals-row tax">
        <span>Tax (${(invoice.taxRate * 100).toFixed(1)}%)</span>
        <span>${formatCurrency(invoice.tax)}</span>
      </div>
      <div class="totals-row total">
        <span>Total</span>
        <span>${formatCurrency(invoice.total)}</span>
      </div>
    </div>

    ${invoice.paymentMethod || invoice.transactionId ? `
    <div class="payment-info">
      <h3>Payment Information</h3>
      ${invoice.paymentMethod ? `<p><strong>Payment Method:</strong> ${invoice.paymentMethod}</p>` : ''}
      ${invoice.transactionId ? `<p><strong>Transaction ID:</strong> ${invoice.transactionId}</p>` : ''}
      <p><strong>Payment Status:</strong> ${invoice.status.toUpperCase()}</p>
    </div>
    ` : ''}

    ${invoice.notes ? `
    <div class="notes">
      <h3>Notes</h3>
      <p>${invoice.notes}</p>
    </div>
    ` : ''}

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>For any questions about this invoice, please contact ${invoice.vendor.email}</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  }

  downloadInvoice(invoice: Invoice): void {
    const html = this.generateInvoiceHTML(invoice)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${invoice.invoiceNumber}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  printInvoice(invoice: Invoice): void {
    const html = this.generateInvoiceHTML(invoice)
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }
}

export const invoiceGenerator = InvoiceGenerator.getInstance()
