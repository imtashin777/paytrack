"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, DollarSign, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SegmentedProgress } from "@/components/ui/progress-bar"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import dynamic from "next/dynamic"
import { formatCurrency, convertCurrency } from "@/components/dashboard-currency-selector"

// Dynamically import currency selector to avoid hydration issues
const DashboardCurrencySelector = dynamic(
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

// Dynamically import chart to avoid SSR issues with recharts
const AreaChartAnalyticsCard = dynamic(
  () => import("@/components/ui/area-chart-analytics-card").then((mod) => ({ default: mod.AreaChartAnalyticsCard })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-[200px] items-center justify-center rounded-lg border">
        <div className="text-sm text-muted-foreground">Loading chart...</div>
      </div>
    )
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
  userPlan: string
}

export function DashboardClient({ 
  initialStats, 
  initialChartData,
  userEmail,
  userPlan 
}: DashboardClientProps) {
  const [currency, setCurrency] = useState("USD")
  const [stats] = useState(initialStats)
  const baseCurrency = "USD" // Assuming all data is stored in USD
  
  // Convert chart data when currency changes
  const chartData = useMemo(() => {
    return initialChartData.map(d => ({
      day: d.day,
      spend: convertCurrency(d.spend || 0, currency, baseCurrency)
    }))
  }, [initialChartData, currency, baseCurrency])

  useEffect(() => {
    // Load saved currency preference after mount to avoid hydration issues
    const saved = typeof window !== 'undefined' ? localStorage.getItem("dashboard-currency") : null
    if (saved && ["USD", "EUR", "GBP", "INR", "BDT"].includes(saved)) {
      setCurrency(saved)
    }
  }, [])

  const paidPercentage = stats.total > 0 ? (stats.paid / stats.total) * 100 : 0

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Welcome back, {userEmail}
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto">
          <DashboardCurrencySelector onCurrencyChange={setCurrency} />
        </div>
      </div>

      {/* Stats Cards with Glowing Effect */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unpaid Invoices
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unpaid}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-destructive/50">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue Invoices
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-green-500/50">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.paid}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar and Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative overflow-hidden">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <CardHeader>
            <CardTitle>Payment Progress</CardTitle>
            <CardDescription>
              Track your invoice payment completion rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SegmentedProgress
              value={paidPercentage}
              label="Paid Invoices"
              showPercentage={true}
              showDemo={false}
            />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Payment Rate</span>
              <span className="text-lg font-bold">{Math.round(paidPercentage)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Revenue</span>
              <span className="text-lg font-bold">
                {formatCurrency(stats.totalRevenue || 0, currency, baseCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Unpaid Amount</span>
              <span className="text-lg font-bold text-yellow-600">
                {formatCurrency(stats.unpaidAmount || 0, currency, baseCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Paid Amount</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(stats.paidAmount || 0, currency, baseCurrency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Overdue Amount</span>
              <span className="text-lg font-bold text-destructive">
                {formatCurrency(stats.overdueAmount || 0, currency, baseCurrency)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <AreaChartAnalyticsCard 
        data={chartData}
        totalAmount={convertCurrency(stats.totalRevenue || 0, currency, baseCurrency)}
        period="Last 28 days"
        currency={currency}
      />

      <div className="flex gap-4">
        <Link href="/invoices/new">
          <Button>Create Invoice</Button>
        </Link>
        <Link href="/clients/new">
          <Button variant="outline">Add Client</Button>
        </Link>
      </div>

      {userPlan === "FREE" && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Upgrade to Pro</CardTitle>
            <CardDescription>
              You&apos;re on the free plan (1,000 invoices total). Upgrade to Pro for
              unlimited invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/billing">
              <Button>Upgrade Now</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

