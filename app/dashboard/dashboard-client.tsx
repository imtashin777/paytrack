"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCurrencySelector, formatCurrency, fetchExchangeRates, CURRENCIES } from "@/components/dashboard-currency-selector"
import dynamic from "next/dynamic"
import { DollarSign, FileText, AlertCircle, CheckCircle2 } from "lucide-react"

// Dynamically import chart to avoid SSR issues
const AreaChartAnalyticsCard = dynamic(
  () => import("@/components/ui/area-chart-analytics-card"),
  {
    ssr: false,
    loading: () => (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Invoice Analytics</CardTitle>
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
    // Load exchange rates
    fetchExchangeRates().then((rates) => {
      setExchangeRates(rates)
    })
  }, [])

  // Memoize converted stats
  const convertedStats = useMemo(() => {
    if (!mounted || !exchangeRates) {
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
    if (!mounted || !exchangeRates) {
      return initialChartData
    }

    const baseCurrency = "USD"
    return initialChartData.map((item) => ({
      ...item,
      spend: convertCurrencySync(item.spend, currency, baseCurrency, exchangeRates),
    }))
  }, [initialChartData, currency, exchangeRates, mounted])

  // Helper function for currency conversion (sync version)
  function convertCurrencySync(
    amount: number,
    targetCurrency: string,
    baseCurrency: string = "USD",
    rates?: Record<string, number> | null
  ): number {
    if (targetCurrency === baseCurrency || !rates) {
      return amount
    }

    const baseRate = rates[baseCurrency] || 1.0
    const targetRate = rates[targetCurrency] || 1.0

    const amountInUSD = amount / baseRate
    return amountInUSD * targetRate
  }

  // Calculate paid percentage
  const paidPercentage = useMemo(() => {
    if (convertedStats.totalRevenue === 0) return 0
    return Math.round((convertedStats.paidAmount / convertedStats.totalRevenue) * 100)
  }, [convertedStats])

  // Format amounts
  const formattedAmounts = useMemo(() => {
    return {
      totalRevenue: formatCurrency(convertedStats.totalRevenue, currency, "USD", exchangeRates || undefined),
      unpaidAmount: formatCurrency(convertedStats.unpaidAmount, currency, "USD", exchangeRates || undefined),
      paidAmount: formatCurrency(convertedStats.paidAmount, currency, "USD", exchangeRates || undefined),
      overdueAmount: formatCurrency(convertedStats.overdueAmount, currency, "USD", exchangeRates || undefined),
    }
  }, [convertedStats, currency, exchangeRates])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted animate-pulse rounded w-24" />
                <div className="h-8 bg-muted animate-pulse rounded w-32 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Currency Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userEmail}
          </p>
        </div>
        <DashboardCurrencySelector onCurrencyChange={setCurrency} />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedAmounts.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              From {convertedStats.total} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedAmounts.paidAmount}</div>
            <p className="text-xs text-muted-foreground">
              {convertedStats.paid} invoices ({paidPercentage}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedAmounts.unpaidAmount}</div>
            <p className="text-xs text-muted-foreground">
              {convertedStats.unpaid} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedAmounts.overdueAmount}</div>
            <p className="text-xs text-muted-foreground">
              {convertedStats.overdue} invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {convertedStats.totalRevenue > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>
              {paidPercentage}% of total revenue has been paid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SegmentedProgress
              value={paidPercentage}
              label="Paid"
              showDemo={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      <AreaChartAnalyticsCard
        key={currency}
        data={convertedChartData}
        currency={currency}
      />
    </div>
  )
}
