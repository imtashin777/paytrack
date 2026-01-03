import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getInvoice } from "@/lib/actions/invoices"
import { InvoiceDetailClient } from "./invoice-detail-client"

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

  return (
    <DashboardLayout>
      <InvoiceDetailClient invoice={invoice} />
    </DashboardLayout>
  )
}

