import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getInvoiceStats } from "@/lib/actions/invoices"
import { format, subDays } from "date-fns"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Initialize with default values
  let stats = {
    total: 0,
    unpaid: 0,
    overdue: 0,
    paid: 0,
    totalRevenue: 0,
    unpaidAmount: 0,
    paidAmount: 0,
    overdueAmount: 0,
    invoices: []
  }
  let chartData: Array<{ day: string; spend: number }> = []
  
  try {
    const fetchedStats = await getInvoiceStats()
    if (fetchedStats) {
      stats = fetchedStats
    }
    const invoices = stats.invoices || []
    
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to start of day
    
    // Optimize: Pre-calculate invoice totals once
    const invoiceTotals = new Map<string, number>()
    invoices.forEach((inv) => {
      let invoiceTotal = inv.amount || 0
      if (inv.lineItems) {
        try {
          const lineItems = JSON.parse(inv.lineItems as string)
          if (Array.isArray(lineItems) && lineItems.length > 0) {
            const subtotal = lineItems.reduce((s: number, item: any) => s + (item.amount || 0), 0)
            const taxRate = inv.taxRate || 0
            const taxAmount = (subtotal * taxRate) / 100
            const discount = inv.discount || 0
            const shipping = inv.shipping || 0
            invoiceTotal = subtotal + taxAmount + shipping - discount
          }
        } catch (e) {
          // If parsing fails, use the stored amount
        }
      }
      invoiceTotals.set(inv.id, invoiceTotal)
    })

    // Generate chart data for last 28 days (optimized)
    for (let i = 27; i >= 0; i--) {
      const date = subDays(today, i)
      date.setHours(0, 0, 0, 0)
      const dateKey = date.getTime()
      
      // Use Map for faster lookups
      const dayTotal = invoices
        .filter((inv) => {
          const invDate = new Date(inv.createdAt)
          invDate.setHours(0, 0, 0, 0)
          return invDate.getTime() === dateKey
        })
        .reduce((sum, inv) => sum + (invoiceTotals.get(inv.id) || 0), 0)
      
      try {
        chartData.push({
          day: format(date, "MMM dd"),
          spend: dayTotal || 0,
        })
      } catch (formatError) {
        // Fallback if date formatting fails
        chartData.push({
          day: date.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
          spend: dayTotal || 0,
        })
      }
    }
  } catch (error) {
    console.error("Error in dashboard page:", error)
    // Stats already have default values, chartData is already empty
  }

  return (
    <DashboardLayout>
      <DashboardClient
        initialStats={{
          total: stats.total || 0,
          unpaid: stats.unpaid || 0,
          overdue: stats.overdue || 0,
          paid: stats.paid || 0,
          totalRevenue: stats.totalRevenue || 0,
          unpaidAmount: stats.unpaidAmount || 0,
          paidAmount: stats.paidAmount || 0,
          overdueAmount: stats.overdueAmount || 0,
        }}
        initialChartData={chartData || []}
        userEmail={session.user.email || ""}
        userPlan={(session.user.plan as "FREE" | "PRO") || "FREE"}
      />
    </DashboardLayout>
  )
}
