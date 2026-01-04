import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getClient } from "@/lib/actions/clients"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { InvoiceStatus } from "@prisma/client"
import { format } from "date-fns"

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const { id } = await params
  const client = await getClient(id)

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

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unified Header with proper baseline alignment */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 pb-4 border-b border-border">
          {/* Left: Title Section */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight break-words">
              {client.name}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1.5 break-all">
              {client.email}
            </p>
          </div>
        </div>

          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0 pb-6">
              <CardTitle className="text-xl font-semibold">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="font-medium">{client.invoices.length}</p>
            </div>
          </CardContent>
        </Card>

          <Card className="p-6 md:p-8">
            <CardHeader className="px-0 pt-0 pb-6">
              <CardTitle className="text-xl font-semibold">Invoice History</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
            {client.invoices.length === 0 ? (
              <p className="text-muted-foreground">No invoices yet for this client.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.invoices.map((invoice) => {
                    // Calculate overdue status
                    const today = new Date()
                    let status = invoice.status
                    if (
                      invoice.status === InvoiceStatus.UNPAID &&
                      invoice.dueDate < today
                    ) {
                      status = InvoiceStatus.OVERDUE
                    }

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          ${invoice.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                        <TableCell>
                          <Link href={`/invoices/${invoice.id}`}>
                            <span className="text-primary hover:underline text-sm">
                              View
                            </span>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

