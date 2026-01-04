"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCurrencySelector, formatCurrency, fetchExchangeRates } from "@/components/dashboard-currency-selector"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { DollarSign, FileText, AlertCircle, CheckCircle2, TrendingUp, Calendar, Plus } from "lucide-react"
import Link from "next/link"

// Dynamically import chart to avoid SSR issues
const AreaChartAnalyticsCard = dynamic(
  () => import("@/components/ui/area-chart-analytics-card"),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    ),
  }
)

// Dynamically import SegmentedProgress
const SegmentedProgress = dynamic(
  () => import("@/components/ui/progress-bar").then((mod) => mod.SegmentedProgress),
  {
    ssr: false,
    loading: () => (
      <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
    ),
  }
)

interface DashboardClientProps {
  initialStats: {
    total: number
    unpaid: number
    overdue: number
    paid: number
    totalRevenue: number
    unpaidAmount: number
    paidAmount: number
    overdueAmount: number
  }
  initialChartData: Array<{ day: string; spend: number }>
  userEmail: string
  userPlan: "FREE" | "PRO"
}

export function DashboardClient({
  initialStats,
  initialChartData,
  userEmail,
  userPlan,
}: DashboardClientProps) {
  const [currency, setCurrency] = useState("USD")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fetch exchange rates in background - don't block rendering
    // Set initial empty object to allow immediate rendering
    setExchangeRates({})
    
    // Fetch rates asynchronously
    const fetchRates = async () => {
      try {
        const rates = await fetchExchangeRates()
        setExchangeRates(rates)
      } catch {
        // Fallback to empty - will use USD
        setExchangeRates({})
      }
    }
    
    // Small delay to not block initial render
    const timer = setTimeout(fetchRates, 100)
    return () => clearTimeout(timer)
  }, [])

  // Helper function for currency conversion
  function convertCurrencySync(
    amount: number,
    targetCurrency: string,
    baseCurrency: string = "USD",
    rates?: Record<string, number> | null
  ): number {
    if (targetCurrency === baseCurrency || !rates || Object.keys(rates).length === 0) {
      return amount
    }
    const baseRate = rates[baseCurrency] || 1.0
    const targetRate = rates[targetCurrency] || 1.0
    return (amount / baseRate) * targetRate
  }

  // Memoize converted stats
  const convertedStats = useMemo(() => {
    if (!mounted || !exchangeRates || Object.keys(exchangeRates).length === 0) {
      return initialStats
    }
    const baseCurrency = "USD"
    return {
      ...initialStats,
      totalRevenue: convertCurrencySync(initialStats.totalRevenue, currency, baseCurrency, exchangeRates),
      unpaidAmount: convertCurrencySync(initialStats.unpaidAmount, currency, baseCurrency, exchangeRates),
      paidAmount: convertCurrencySync(initialStats.paidAmount, currency, baseCurrency, exchangeRates),
      overdueAmount: convertCurrencySync(initialStats.overdueAmount, currency, baseCurrency, exchangeRates),
    }
  }, [initialStats, currency, exchangeRates, mounted])

  // Memoize converted chart data
  const convertedChartData = useMemo(() => {
    if (!mounted || !exchangeRates || Object.keys(exchangeRates).length === 0) {
      return initialChartData
    }
    const baseCurrency = "USD"
    return initialChartData.map((item) => ({
      ...item,
      spend: convertCurrencySync(item.spend, currency, baseCurrency, exchangeRates),
    }))
  }, [initialChartData, currency, exchangeRates, mounted])

  // Calculate percentages
  const paidPercentage = useMemo(() => {
    if (convertedStats.totalRevenue === 0) return 0
    return Math.round((convertedStats.paidAmount / convertedStats.totalRevenue) * 100 * 100) / 100
  }, [convertedStats])

  const unpaidPercentage = useMemo(() => {
    if (convertedStats.totalRevenue === 0) return 0
    return Math.round((convertedStats.unpaidAmount / convertedStats.totalRevenue) * 100 * 100) / 100
  }, [convertedStats])

  const overduePercentage = useMemo(() => {
    if (convertedStats.totalRevenue === 0) return 0
    return Math.round((convertedStats.overdueAmount / convertedStats.totalRevenue) * 100 * 100) / 100
  }, [convertedStats])

  const averageInvoiceValue = useMemo(() => {
    if (convertedStats.total === 0) return 0
    return convertedStats.totalRevenue / convertedStats.total
  }, [convertedStats])

  const collectionRate = useMemo(() => {
    if (convertedStats.total === 0) return 0
    return Math.round((convertedStats.paid / convertedStats.total) * 100 * 100) / 100
  }, [convertedStats])

  // Format amounts
  const formattedAmounts = useMemo(() => {
    return {
      totalRevenue: formatCurrency(convertedStats.totalRevenue, currency, "USD", exchangeRates || undefined),
      unpaidAmount: formatCurrency(convertedStats.unpaidAmount, currency, "USD", exchangeRates || undefined),
      paidAmount: formatCurrency(convertedStats.paidAmount, currency, "USD", exchangeRates || undefined),
      overdueAmount: formatCurrency(convertedStats.overdueAmount, currency, "USD", exchangeRates || undefined),
      averageInvoice: formatCurrency(averageInvoiceValue, currency, "USD", exchangeRates || undefined),
    }
  }, [convertedStats, currency, exchangeRates, averageInvoiceValue])

  return (
    <div className="w-full min-h-screen bg-background text-foreground space-y-8 md:space-y-10 py-8 md:py-10 px-6 lg:px-10">
      <div className="max-w-[1600px] mx-auto w-full space-y-8 md:space-y-10">
        {/* Unified Header with premium spacing */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border">
          {/* Left: Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">
              Welcome back, {userEmail || "User"}
            </p>
          </div>
          
          {/* Right: Actions Section - Aligned to same baseline */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-shrink-0">
            <div className="flex-shrink-0">
              <DashboardCurrencySelector onCurrencyChange={setCurrency} />
            </div>
            <Button asChild className="w-full sm:w-auto whitespace-nowrap" size="default">
              <Link href="/invoices/new">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">New Invoice</span>
                <span className="sm:hidden">New</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Financial Metrics - Premium Grid with better spacing */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <Card className="w-full p-6 md:p-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0 pt-0">
            <CardTitle className="text-base font-semibold text-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-2xl sm:text-3xl font-bold break-words text-foreground">{formattedAmounts.totalRevenue}</div>
            <p className="text-sm text-muted-foreground mt-2 break-words">
              {convertedStats.total} invoices • Avg: {formattedAmounts.averageInvoice}
            </p>
          </CardContent>
        </Card>

        <Card className="w-full p-6 md:p-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0 pt-0">
            <CardTitle className="text-base font-semibold text-foreground">Paid</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 break-words">{formattedAmounts.paidAmount}</div>
            <p className="text-sm text-muted-foreground mt-2 break-words">
              {convertedStats.paid} invoices ({paidPercentage.toFixed(1)}% of revenue)
            </p>
          </CardContent>
        </Card>

        <Card className="w-full p-6 md:p-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0 pt-0">
            <CardTitle className="text-base font-semibold text-foreground">Unpaid</CardTitle>
            <FileText className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600 break-words">{formattedAmounts.unpaidAmount}</div>
            <p className="text-sm text-muted-foreground mt-2 break-words">
              {convertedStats.unpaid} invoices ({unpaidPercentage.toFixed(1)}% of revenue)
            </p>
          </CardContent>
        </Card>

        <Card className="w-full p-6 md:p-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0 pt-0">
            <CardTitle className="text-base font-semibold text-foreground">Overdue</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-2xl sm:text-3xl font-bold text-red-600 break-words">{formattedAmounts.overdueAmount}</div>
            <p className="text-sm text-muted-foreground mt-2 break-words">
              {convertedStats.overdue} invoices ({overduePercentage.toFixed(1)}% of revenue)
            </p>
          </CardContent>
        </Card>
        </div>

        {/* Payment Status & Quick Stats - Premium spacing */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 w-full">
            <Card className="w-full p-6 md:p-8">
              <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="text-xl font-semibold">Payment Status</CardTitle>
                <CardDescription className="text-base mt-2">
                  {paidPercentage.toFixed(1)}% of total revenue has been paid
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-6">
                {mounted ? (
                  <SegmentedProgress
                    value={paidPercentage}
                    label="Paid"
                    showDemo={false}
                  />
                ) : (
                  <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Collection Rate</p>
                    <p className="text-lg font-semibold">{collectionRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground break-words">
                      {convertedStats.paid} of {convertedStats.total} invoices paid
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                    <p className="text-lg font-semibold text-yellow-600 break-words">{formattedAmounts.unpaidAmount}</p>
                    <p className="text-xs text-muted-foreground break-words">
                      {convertedStats.unpaid} invoices pending
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full p-6 md:p-8">
              <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="text-xl font-semibold">Quick Stats</CardTitle>
                <CardDescription className="text-base mt-2">Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">Average Invoice Value</span>
                    </div>
                    <span className="font-semibold text-sm sm:text-base whitespace-nowrap ml-2">{formattedAmounts.averageInvoice}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">Total Invoices</span>
                    </div>
                    <span className="font-semibold text-sm sm:text-base whitespace-nowrap ml-2">{convertedStats.total}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm truncate">Paid Invoices</span>
                    </div>
                    <span className="font-semibold text-green-600 text-sm sm:text-base whitespace-nowrap ml-2">{convertedStats.paid}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span className="text-sm truncate">Overdue Invoices</span>
                    </div>
                    <span className="font-semibold text-red-600 text-sm sm:text-base whitespace-nowrap ml-2">{convertedStats.overdue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Revenue Trend Chart - Premium spacing */}
        <Card className="w-full p-6 md:p-8">
            <CardHeader className="px-0 pt-0 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-semibold">Invoice Analytics</CardTitle>
                  <CardDescription className="text-base mt-2">Revenue over the last 28 days</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last 28 days</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 w-full overflow-x-auto">
              {mounted ? (
                <div className="w-full min-w-[300px]">
                  <AreaChartAnalyticsCard
                    key={currency}
                    data={convertedChartData}
                    currency={currency}
                    totalAmount={convertedStats.totalRevenue}
                  />
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center w-full">
                  <div className="text-muted-foreground">Loading chart...</div>
                </div>
              )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
