import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getInvoices } from "@/lib/actions/invoices"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { InvoiceStatus } from "@prisma/client"
import { format } from "date-fns"
import { ProjectDataTable, type Project } from "@/components/ui/project-data-table"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const invoices = await getInvoices()

  // Transform invoices to match ProjectDataTable format
  const tableData: Project[] = invoices.map((invoice) => {
    let statusVariant: "active" | "inProgress" | "onHold" = "inProgress"
    if (invoice.status === InvoiceStatus.PAID) {
      statusVariant = "active"
    } else if (invoice.status === InvoiceStatus.OVERDUE) {
      statusVariant = "onHold"
    }

    return {
      id: invoice.id,
      name: `Invoice #${invoice.id.slice(0, 8)}`,
      repository: `/invoices/${invoice.id}`,
      team: invoice.client.name,
      tech: `$${invoice.amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      createdAt: format(new Date(invoice.dueDate), "MMM dd, yyyy"),
      contributors: [],
      status: {
        text: invoice.status,
        variant: statusVariant,
      },
      invoiceData: {
        id: invoice.id,
        amount: invoice.amount,
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

  const visibleColumns: Array<keyof Project> = [
    "name",
    "team",
    "tech",
    "createdAt",
    "status",
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Invoices</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage all your invoices in one place
            </p>
          </div>
          <Link href="/invoices/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Create Invoice</Button>
          </Link>
        </div>

        {invoices.length === 0 ? (
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
            <ProjectDataTable projects={tableData} visibleColumns={visibleColumns} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

