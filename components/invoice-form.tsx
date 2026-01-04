"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Download, RefreshCw, Upload, X, Mail } from "lucide-react"
import { createInvoice } from "@/lib/actions/invoices"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

interface Client {
  id: string
  name: string
  email: string
}

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

export function InvoiceForm({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  
  // Invoice fields
  const [invoiceNumber, setInvoiceNumber] = useState("1")
  const [fromName, setFromName] = useState("")
  const [fromEmail, setFromEmail] = useState("")
  const [billTo, setBillTo] = useState("")
  const [shipTo, setShipTo] = useState("")
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentTerms, setPaymentTerms] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [poNumber, setPoNumber] = useState("")
  const [notes, setNotes] = useState("Notes - any relevant information not already covered")
  const [terms, setTerms] = useState("Terms and conditions - late fees, payment methods, delivery schedule")
  
  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, amount: 0 }
  ])
  
  // Financials
  const [taxRate, setTaxRate] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [amountPaid, setAmountPaid] = useState(0)
  
  // Currency
  const [currency, setCurrency] = useState("USD")

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount + shipping - discount
  const balanceDue = total - amountPaid

  // Update line item amount when quantity or rate changes
  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(items =>
      items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      })
    )
  }

  // Add new line item
  const addLineItem = () => {
    setLineItems([...lineItems, {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    }])
  }

  // Remove line item
  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id))
    }
  }

  // Calculate due date from payment terms
  useEffect(() => {
    if (paymentTerms && invoiceDate) {
      const days = parseInt(paymentTerms)
      if (!isNaN(days)) {
        const date = new Date(invoiceDate)
        date.setDate(date.getDate() + days)
        setDueDate(date.toISOString().split('T')[0])
      }
    }
  }, [paymentTerms, invoiceDate])

  // Set selected client details
  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    if (client) {
      setBillTo(`${client.name}\n${client.email}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!billTo) {
      setError("Please select a client (Bill To)")
      setLoading(false)
      return
    }

    if (lineItems.some(item => !item.description)) {
      setError("Please fill in all line item descriptions")
      setLoading(false)
      return
    }

    if (total <= 0) {
      setError("Invoice total must be greater than 0")
      setLoading(false)
      return
    }

    try {
      const clientId = clients.find(c => billTo.includes(c.name))?.id || clients[0]?.id
      if (!clientId) {
        throw new Error("Please select a client")
      }

      const result = await createInvoice(
        clientId,
        total,
        dueDate ? new Date(dueDate) : new Date(),
        notes || undefined,
        logo || undefined,
        lineItems.filter(item => item.description), // Only save items with descriptions
        taxRate,
        discount,
        shipping,
        true // Send email if checkbox is checked
      )

      // Show success message
      if (result.emailSent) {
        toast.success("Invoice created and sent successfully!")
      } else if (result.emailError) {
        toast.success("Invoice created successfully!")
        toast.error("Invoice created, but email failed to send")
      } else {
        toast.success("Invoice created successfully!")
      }

      // Redirect after a short delay to show toast
      setTimeout(() => {
        router.push("/invoices")
        router.refresh()
      }, 500)
    } catch (err: any) {
      setError(err.message || "Failed to create invoice")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB")
      return
    }

    // Read file as data URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogo(reader.result as string)
      setError("")
    }
    reader.onerror = () => {
      setError("Failed to read image file")
    }
    reader.readAsDataURL(file)
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLogo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-2">No Clients</h3>
        <p className="text-muted-foreground mb-4">
          You need to create a client first before creating an invoice.
        </p>
        <Button onClick={() => router.push("/clients/new")}>
          Create Client
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-full max-w-full overflow-x-hidden">
      {/* Main Invoice Form */}
      <div className="flex-1 space-y-4 md:space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
            <div
              className="relative w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors group flex-shrink-0"
              onClick={handleLogoClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              {logo ? (
                <>
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-contain rounded-lg p-2"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-100"
                    title="Remove logo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-2">
                  <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">+ Add Your Logo</span>
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">INVOICE</h1>
              <div className="flex items-center gap-2">
                <Label htmlFor="invoiceNumber" className="text-sm">#</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-20 sm:w-24"
                />
              </div>
            </div>
          </div>

          {/* Sender and Recipient */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label>Who is this from?</Label>
              <Input
                placeholder="Your name/company"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Bill To</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={(e) => handleClientChange(e.target.value)}
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={billTo}
                onChange={(e) => setBillTo(e.target.value)}
                placeholder="Client name and address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ship To <span className="text-muted-foreground">(optional)</span></Label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={shipTo}
              onChange={(e) => setShipTo(e.target.value)}
              placeholder="Shipping address"
            />
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Input
                placeholder="e.g., 30"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>PO Number</Label>
              <Input
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="hidden sm:grid grid-cols-12 gap-2 bg-primary/10 p-2 rounded-md font-medium text-sm">
              <div className="col-span-5">Item</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1"></div>
            </div>
            {lineItems.map((item) => (
              <div key={item.id} className="space-y-2 sm:space-y-0">
                {/* Mobile Layout */}
                <div className="sm:hidden space-y-2 border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Item</span>
                    {lineItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeLineItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Description of item/service..."
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Qty</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Rate</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="$ 0"
                        value={item.rate || ""}
                        onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Amount</Label>
                      <div className="h-10 flex items-center justify-end font-medium px-3 border rounded-md bg-muted">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Desktop Layout */}
                <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                  <Input
                    className="col-span-5"
                    placeholder="Description of item/service..."
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  />
                  <Input
                    type="number"
                    className="col-span-2"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    min="0"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    className="col-span-2"
                    placeholder="$ 0"
                    value={item.rate || ""}
                    onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                    min="0"
                  />
                  <div className="col-span-2 text-right font-medium">
                    {formatCurrency(item.amount)}
                  </div>
                  {lineItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="col-span-1"
                      onClick={() => removeLineItem(item.id)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addLineItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              + Line Item
            </Button>
          </div>

          {/* Financial Summary - Fully Responsive */}
          <div className="flex justify-end w-full">
            <div className="w-full max-w-full sm:w-80 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>Tax:</span>
                  <Input
                    type="number"
                    className="w-20 h-8"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                  />
                  <span>%</span>
                  <RefreshCw className="h-3 w-3 text-muted-foreground" />
                </div>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDiscount(discount === 0 ? 10 : 0)}
                  className="w-full sm:w-auto sm:flex-1"
                >
                  + Discount
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShipping(shipping === 0 ? 10 : 0)}
                  className="w-full sm:w-auto sm:flex-1"
                >
                  + Shipping
                </Button>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <Input
                    type="number"
                    className="w-24 h-8"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              )}
              {shipping > 0 && (
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <Input
                    type="number"
                    className="w-24 h-8"
                    value={shipping}
                    onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <Input
                  type="number"
                  className="w-24 h-8"
                  placeholder="$ 0"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="flex justify-between font-semibold">
                <span>Balance Due:</span>
                <span>{formatCurrency(balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label>Notes</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Terms</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button - Fully Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            {/* Email Info - All invoices are sent automatically */}
            <div className="flex items-start sm:items-center space-x-2 p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800 w-full sm:flex-1">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="flex-1 min-w-0">
                <Label className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100 block">
                  Invoice will be automatically sent via email
                </Label>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  This invoice will be sent to the selected client via email
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 sm:flex-initial"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 sm:flex-initial">
                {loading ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-64 space-y-4 order-first lg:order-last">
        <Button className="w-full" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        <div className="space-y-2">
          <Label>Theme</Label>
          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option>Classic</option>
            <option>Modern</option>
            <option>Minimal</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Currency</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
            <option value="BDT">BDT (৳)</option>
          </select>
        </div>

        <Button variant="outline" className="w-full">
          Save Default
        </Button>
      </div>
    </div>
  )
}

