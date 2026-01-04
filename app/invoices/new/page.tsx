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
      <div className="w-full min-h-screen bg-background text-foreground space-y-8 md:space-y-10 py-8 md:py-10 px-6 lg:px-10">
        <div className="max-w-[1600px] mx-auto w-full space-y-8 md:space-y-10">
          {/* Unified Header with premium spacing */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border">
            {/* Left: Title Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Create Invoice
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">
                Fill in the details to create a new invoice
              </p>
            </div>
          </div>
          <div className="w-full">
            <InvoiceForm clients={clients} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

