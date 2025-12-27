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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground">{client.email}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
          </CardHeader>
          <CardContent>
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
    </DashboardLayout>
  )
}

