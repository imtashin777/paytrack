"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InvoiceStatus } from "@prisma/client"
import { format } from "date-fns"
import { MarkAsPaidButton } from "@/components/mark-as-paid-button"
import { DownloadPDFButton } from "@/components/download-pdf-button"
import { ResendInvoiceEmailButton } from "@/components/resend-invoice-email-button"
import { DashboardCurrencySelector, formatCurrency, fetchExchangeRates, CURRENCIES } from "@/components/dashboard-currency-selector"
import dynamic from "next/dynamic"

const CurrencySelector = dynamic(
  () => import("@/components/dashboard-currency-selector").then((mod) => mod.DashboardCurrencySelector),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm">
        <span className="text-sm font-semibold whitespace-nowrap">Currency:</span>
        <div className="h-10 w-[150px] rounded-md border border-input bg-background" />
      </div>
    )
  }
)

interface Invoice {
  id: string
  amount: number
  status: InvoiceStatus
  dueDate: Date
  createdAt: Date
  paidAt?: Date | null
  notes?: string | null
  logo?: string | null
  lineItems?: string | null
  taxRate?: number | null
  discount?: number | null
  shipping?: number | null
  emailSent?: boolean
  emailSentAt?: Date | null
  client: {
    name: string
    email: string
  }
}

interface InvoiceDetailClientProps {
  invoice: Invoice
}

export function InvoiceDetailClient({ invoice }: InvoiceDetailClientProps) {
  const [currency, setCurrency] = useState("USD")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null)
  const baseCurrency = "USD" // Assuming all invoices are stored in USD

  // Fetch exchange rates on mount
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates()
        setExchangeRates(rates)
      } catch (error) {
        console.error("Failed to load exchange rates:", error)
      }
    }

    loadExchangeRates()

    // Load saved currency preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("dashboard-currency")
      if (saved && CURRENCIES.find(c => c.code === saved)) {
        setCurrency(saved)
      }
    }
  }, [])

  // Calculate invoice total including line items, tax, discount, shipping
  const invoiceTotal = useMemo(() => {
    let total = invoice.amount || 0
    
    if (invoice.lineItems) {
      try {
        const lineItems = JSON.parse(invoice.lineItems as string)
        if (Array.isArray(lineItems) && lineItems.length > 0) {
          const subtotal = lineItems.reduce((s: number, item: any) => s + (item.amount || 0), 0)
          const taxRate = invoice.taxRate || 0
          const taxAmount = (subtotal * taxRate) / 100
          const discount = invoice.discount || 0
          const shipping = invoice.shipping || 0
          total = subtotal + taxAmount + shipping - discount
        }
      } catch (e) {
        // If parsing fails, use the stored amount
      }
    }
    
    return total
  }, [invoice])

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return <Badge className="bg-green-500">Paid</Badge>
      case InvoiceStatus.OVERDUE:
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="secondary">Unpaid</Badge>
    }
  }

  const formattedAmount = formatCurrency(invoiceTotal, currency, baseCurrency, exchangeRates || undefined)

  return (
    <div className="w-full min-h-screen bg-background text-foreground space-y-8 md:space-y-10 py-8 md:py-10 px-6 lg:px-10">
      <div className="max-w-[1600px] mx-auto w-full space-y-8 md:space-y-10">
        {/* Unified Header with premium spacing */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border">
          {/* Left: Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Invoice Details
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">
              Invoice #{invoice.id.slice(0, 8)}
            </p>
          </div>
        
        {/* Right: Actions Section - Aligned to same baseline */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-shrink-0">
          <div className="flex-shrink-0">
            <CurrencySelector onCurrencyChange={setCurrency} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <DownloadPDFButton invoice={invoice} />
            <ResendInvoiceEmailButton invoiceId={invoice.id} />
            {invoice.status === InvoiceStatus.UNPAID && (
              <MarkAsPaidButton invoiceId={invoice.id} />
            )}
          </div>
        </div>
      </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0 pb-6">
              <CardTitle className="text-xl font-semibold">Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">
                  {formattedAmount}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">
                  {format(new Date(invoice.dueDate), "MMMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {format(new Date(invoice.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
              {invoice.paidAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Paid At</p>
                  <p className="font-medium">
                    {format(new Date(invoice.paidAt), "MMMM dd, yyyy")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0 pb-6">
              <CardTitle className="text-xl font-semibold">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-6">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{invoice.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{invoice.client.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {invoice.notes && (
          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0 pb-6">
              <CardTitle className="text-xl font-semibold">Notes</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <p className="whitespace-pre-wrap text-base leading-relaxed">{invoice.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}



