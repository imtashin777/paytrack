"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { InvoiceStatus } from "@prisma/client"
import { format } from "date-fns"
import { ProjectDataTable, type Project } from "@/components/ui/project-data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCurrencySelector, formatCurrency, fetchExchangeRates, CURRENCIES } from "@/components/dashboard-currency-selector"
import dynamic from "next/dynamic"

// Suppress console errors from browser extensions
if (typeof window !== "undefined") {
  const originalError = console.error
  console.error = (...args: any[]) => {
    const errorString = args.join(" ")
    // Filter out extension-related errors
    if (
      errorString.includes("Minified React error #299") ||
      errorString.includes("embed script.js") ||
      errorString.includes("chrome-extension://") ||
      errorString.includes("moz-extension://")
    ) {
      return // Suppress these errors
    }
    originalError.apply(console, args)
  }
}

// Dynamically import currency selector
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
  notes?: string | null
  logo?: string | null
  lineItems?: string | null
  taxRate?: number | null
  discount?: number | null
  shipping?: number | null
  client: {
    name: string
    email: string
  }
}

interface InvoicesClientProps {
  initialInvoices: Invoice[]
}

export function InvoicesClient({ initialInvoices }: InvoicesClientProps) {
  const [currency, setCurrency] = useState("USD")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const baseCurrency = "USD" // Assuming all invoices are stored in USD

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch exchange rates on mount - optimized
  useEffect(() => {
    if (!mounted) return

    // Set loading to false immediately, fetch rates in background
    setLoading(false)
    
    // Load saved currency preference first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("dashboard-currency")
      if (saved && CURRENCIES.find(c => c.code === saved)) {
        setCurrency(saved)
      }
    }

    // Fetch rates asynchronously without blocking
    const loadExchangeRates = async () => {
      try {
        const rates = await fetchExchangeRates()
        setExchangeRates(rates)
      } catch (error) {
        // Silently fail - will use USD rates
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to load exchange rates:", error)
        }
      }
    }

    // Small delay to prioritize UI rendering
    const timer = setTimeout(loadExchangeRates, 200)
    return () => clearTimeout(timer)
  }, [mounted])

  // Calculate invoice total including line items, tax, discount, shipping
  const calculateInvoiceTotal = (invoice: Invoice): number => {
    let invoiceTotal = invoice.amount || 0
    
    if (invoice.lineItems) {
      try {
        const lineItems = JSON.parse(invoice.lineItems as string)
        if (Array.isArray(lineItems) && lineItems.length > 0) {
          const subtotal = lineItems.reduce((s: number, item: any) => s + (item.amount || 0), 0)
          const taxRate = invoice.taxRate || 0
          const taxAmount = (subtotal * taxRate) / 100
          const discount = invoice.discount || 0
          const shipping = invoice.shipping || 0
          invoiceTotal = subtotal + taxAmount + shipping - discount
        }
      } catch (e) {
        // If parsing fails, use the stored amount
      }
    }
    
    return invoiceTotal
  }

  // Transform invoices with currency conversion
  const tableData: Project[] = useMemo(() => {
    if (!mounted) {
      return []
    }

    if (!exchangeRates && loading) {
      // Show original amounts while loading
      return initialInvoices.map((invoice) => {
        let statusVariant: "active" | "inProgress" | "onHold" = "inProgress"
        if (invoice.status === InvoiceStatus.PAID) {
          statusVariant = "active"
        } else if (invoice.status === InvoiceStatus.OVERDUE) {
          statusVariant = "onHold"
        }

        const invoiceTotal = calculateInvoiceTotal(invoice)

        return {
          id: invoice.id,
          name: `Invoice #${invoice.id.slice(0, 8)}`,
          repository: `/invoices/${invoice.id}`,
          team: invoice.client.name,
          tech: formatCurrency(invoiceTotal, currency, baseCurrency),
          createdAt: format(new Date(invoice.dueDate), "MMM dd, yyyy"),
          contributors: [],
          status: {
            text: invoice.status,
            variant: statusVariant,
          },
          invoiceData: {
            id: invoice.id,
            amount: invoiceTotal,
            dueDate: invoice.dueDate,
            createdAt: invoice.createdAt,
            notes: invoice.notes,
            logo: invoice.logo,
            lineItems: invoice.lineItems,
            taxRate: invoice.taxRate,
            discount: invoice.discount,
            shipping: invoice.shipping,
            client: {
              name: invoice.client.name,
              email: invoice.client.email,
            },
          },
        }
      })
    }

    return initialInvoices.map((invoice) => {
      let statusVariant: "active" | "inProgress" | "onHold" = "inProgress"
      if (invoice.status === InvoiceStatus.PAID) {
        statusVariant = "active"
      } else if (invoice.status === InvoiceStatus.OVERDUE) {
        statusVariant = "onHold"
      }

      const invoiceTotal = calculateInvoiceTotal(invoice)
      // Format with converted currency
      const formattedAmount = formatCurrency(invoiceTotal, currency, baseCurrency, exchangeRates || undefined)

      return {
        id: invoice.id,
        name: `Invoice #${invoice.id.slice(0, 8)}`,
        repository: `/invoices/${invoice.id}`,
        team: invoice.client.name,
        tech: formattedAmount,
        createdAt: format(new Date(invoice.dueDate), "MMM dd, yyyy"),
        contributors: [],
        status: {
          text: invoice.status,
          variant: statusVariant,
        },
        invoiceData: {
          id: invoice.id,
          amount: invoiceTotal,
          dueDate: invoice.dueDate,
          createdAt: invoice.createdAt,
          notes: invoice.notes,
          logo: invoice.logo,
          lineItems: invoice.lineItems,
          taxRate: invoice.taxRate,
          discount: invoice.discount,
          shipping: invoice.shipping,
          client: {
            name: invoice.client.name,
            email: invoice.client.email,
          },
        },
      }
    })
  }, [initialInvoices, currency, exchangeRates, loading, baseCurrency, mounted])

  const visibleColumns: Array<keyof Project> = [
    "name",
    "team",
    "tech",
    "createdAt",
    "status",
  ]

  if (!mounted) {
    return (
      <div className="space-y-6 md:space-y-8">
        <div className="h-8 bg-muted animate-pulse rounded w-64" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground space-y-8 md:space-y-10 py-8 md:py-10 px-6 lg:px-10">
      <div className="max-w-[1600px] mx-auto w-full space-y-8 md:space-y-10">
        {/* Unified Header with premium spacing */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border">
          {/* Left: Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Invoices
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">
              Manage all your invoices in one place
            </p>
          </div>
        
        {/* Right: Actions Section - Aligned to same baseline */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-shrink-0">
          <div className="flex-shrink-0">
            <CurrencySelector onCurrencyChange={setCurrency} />
          </div>
          <Link href="/invoices/new" className="flex-shrink-0">
            <Button className="w-full sm:w-auto whitespace-nowrap" size="default">
              Create Invoice
            </Button>
          </Link>
          </div>
        </div>

        {initialInvoices.length === 0 ? (
          <Card className="relative overflow-hidden p-6 md:p-8">
          <CardHeader>
            <CardTitle>No Invoices Yet</CardTitle>
            <CardDescription>
              Create your first invoice to get started tracking payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/invoices/new">
              <Button>Create Your First Invoice</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {loading && (
            <div className="text-sm text-muted-foreground mb-4">
              Loading exchange rates...
            </div>
          )}
            <ProjectDataTable projects={tableData} visibleColumns={visibleColumns} />
          </div>
        )}
      </div>
    </div>
  )
}
