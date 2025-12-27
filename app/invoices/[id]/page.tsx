import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getInvoice } from "@/lib/actions/invoices"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InvoiceStatus } from "@prisma/client"
import { format } from "date-fns"
import { MarkAsPaidButton } from "@/components/mark-as-paid-button"
import { DownloadPDFButton } from "@/components/download-pdf-button"

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const { id } = await params
  const invoice = await getInvoice(id)

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invoice Details</h1>
            <p className="text-muted-foreground">
              Invoice #{invoice.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex gap-2">
            <DownloadPDFButton invoice={invoice} />
            {invoice.status === InvoiceStatus.UNPAID && (
              <MarkAsPaidButton invoiceId={invoice.id} />
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">
                  ${invoice.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
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

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{invoice.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

