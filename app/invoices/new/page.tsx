import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getClients } from "@/lib/actions/clients"
import { InvoiceForm } from "@/components/invoice-form"

export default async function NewInvoicePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const clients = await getClients()

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Create Invoice</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Fill in the details to create a new invoice
            </p>
          </div>
        </div>
        <InvoiceForm clients={clients} />
      </div>
    </DashboardLayout>
  )
}

