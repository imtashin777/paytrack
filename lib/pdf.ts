"use client"

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Invoice {
  id?: string
  amount: number
  dueDate: Date | string
  createdAt: Date | string
  notes?: string | null
  logo?: string | null
  lineItems?: string | null // JSON string
  taxRate?: number | null
  discount?: number | null
  shipping?: number | null
  client: {
    name: string
    email: string
  }
}

export async function generatePDF(invoice: Invoice) {
  const invoiceId = invoice.id?.slice(0, 8) || "INV"
  const dueDate = invoice.dueDate instanceof Date ? invoice.dueDate : new Date(invoice.dueDate)
  const createdDate = invoice.createdAt instanceof Date ? invoice.createdAt : new Date(invoice.createdAt)
  
  // Parse line items
  let lineItems: LineItem[] = []
  if (invoice.lineItems) {
    try {
      const parsed = JSON.parse(invoice.lineItems)
      if (Array.isArray(parsed) && parsed.length > 0) {
        lineItems = parsed
      }
    } catch (e) {
      console.error("Failed to parse line items:", e)
    }
  }
  
  // If no line items, create a default one from the total amount
  if (lineItems.length === 0) {
    lineItems = [{
      description: "Invoice Payment",
      quantity: 1,
      rate: invoice.amount,
      amount: invoice.amount
    }]
  }
  
  const taxRate = invoice.taxRate || 0
  const discount = invoice.discount || 0
  const shipping = invoice.shipping || 0
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount + shipping - discount
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceId}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #ffffff;
            padding: 60px 40px;
            color: #000000;
            line-height: 1.6;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
          }
          
          .invoice-header {
            border-bottom: 1px solid #000000;
            padding-bottom: 30px;
            margin-bottom: 50px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .header-left {
            flex: 1;
          }
          
          .logo-container {
            width: 120px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0;
          }
          
          .logo-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          
          .invoice-title {
            font-size: 32px;
            font-weight: 400;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          
          .invoice-number {
            font-size: 14px;
            color: #666666;
            font-weight: 400;
          }
          
          .invoice-body {
            padding: 0;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            margin-bottom: 60px;
          }
          
          .info-section h3 {
            font-size: 11px;
            text-transform: uppercase;
            color: #000000;
            letter-spacing: 1px;
            margin-bottom: 20px;
            font-weight: 400;
          }
          
          .info-section p {
            font-size: 14px;
            color: #000000;
            margin: 4px 0;
            line-height: 1.8;
          }
          
          .info-section .name {
            font-size: 16px;
            font-weight: 400;
            color: #000000;
            margin-bottom: 8px;
          }
          
          .divider {
            height: 1px;
            background: #000000;
            margin: 50px 0;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 40px 0;
          }
          
          .items-table thead {
            border-bottom: 1px solid #000000;
          }
          
          .items-table th {
            text-align: left;
            padding: 12px 0;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 400;
            color: #000000;
          }
          
          .items-table td {
            padding: 12px 0;
            border-bottom: 1px solid #e5e5e5;
            font-size: 14px;
            color: #000000;
          }
          
          .items-table td:last-child,
          .items-table th:last-child {
            text-align: right;
          }
          
          .items-table tbody tr:last-child td {
            border-bottom: none;
          }
          
          .amount-section {
            margin: 50px 0;
            text-align: right;
          }
          
          .amount-row {
            display: flex;
            justify-content: flex-end;
            gap: 40px;
            padding: 12px 0;
            border-bottom: 1px solid #e5e5e5;
          }
          
          .amount-row:last-child {
            border-bottom: 2px solid #000000;
            margin-top: 10px;
            padding-top: 20px;
          }
          
          .amount-label {
            font-size: 14px;
            color: #000000;
            font-weight: 400;
            min-width: 120px;
            text-align: left;
          }
          
          .amount-value {
            font-size: 14px;
            color: #000000;
            font-weight: 400;
            min-width: 100px;
            text-align: right;
          }
          
          .total-row .amount-value {
            font-size: 18px;
            font-weight: 400;
          }
          
          .notes-section {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 1px solid #e5e5e5;
          }
          
          .notes-section h3 {
            font-size: 11px;
            text-transform: uppercase;
            color: #000000;
            letter-spacing: 1px;
            margin-bottom: 15px;
            font-weight: 400;
          }
          
          .notes-section p {
            font-size: 13px;
            color: #000000;
            line-height: 1.8;
            white-space: pre-wrap;
          }
          
          .invoice-footer {
            margin-top: 80px;
            padding-top: 30px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
          }
          
          .footer-text {
            font-size: 12px;
            color: #666666;
            line-height: 1.6;
          }
          
          @media print {
            body {
              padding: 40px 30px;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="header-left">
              ${invoice.logo ? `
                <div class="logo-container">
                  <img src="${invoice.logo}" alt="Logo" />
                </div>
              ` : ''}
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">#${invoiceId}</div>
            </div>
          </div>
          
          <div class="invoice-body">
            <div class="info-grid">
              <div class="info-section">
                <h3>Bill To</h3>
                <p class="name">${invoice.client.name}</p>
                <p>${invoice.client.email}</p>
              </div>
              
              <div class="info-section">
                <h3>Invoice Details</h3>
                <p>Invoice Date: ${createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>Due Date: ${dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>Invoice #: ${invoiceId}</p>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${lineItems.map(item => `
                  <tr>
                    <td>${item.description || "Item"}</td>
                    <td>${item.quantity || 1}</td>
                    <td>$${(item.rate || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</td>
                    <td>$${(item.amount || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="divider"></div>
            
            <div class="amount-section">
              <div class="amount-row">
                <div class="amount-label">Subtotal</div>
                <div class="amount-value">$${subtotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</div>
              </div>
              ${taxRate > 0 ? `
                <div class="amount-row">
                  <div class="amount-label">Tax (${taxRate}%)</div>
                  <div class="amount-value">$${taxAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</div>
                </div>
              ` : ''}
              ${shipping > 0 ? `
                <div class="amount-row">
                  <div class="amount-label">Shipping</div>
                  <div class="amount-value">$${shipping.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</div>
                </div>
              ` : ''}
              ${discount > 0 ? `
                <div class="amount-row">
                  <div class="amount-label">Discount</div>
                  <div class="amount-value">-$${discount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</div>
                </div>
              ` : ''}
              <div class="amount-row total-row">
                <div class="amount-label">Total</div>
                <div class="amount-value">$${total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</div>
              </div>
            </div>
            
            ${invoice.notes ? `
              <div class="notes-section">
                <h3>Notes</h3>
                <p>${invoice.notes}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="invoice-footer">
            <div class="footer-text">
              <p>Thank you for your business.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `

  // Create a new window for printing/downloading
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    
    // Wait for content to load, then trigger print
    setTimeout(() => {
      printWindow.print()
      // Also provide download option
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${invoiceId}-${new Date().getTime()}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 250)
  }
}

