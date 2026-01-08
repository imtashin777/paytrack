import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getInvoice } from "@/lib/actions/invoices"
import { InvoiceDetailClient } from "../invoice-detail-client"

/**
 * Protected invoice view route for email links
 * Clients can view invoices via signed links from email
 * For now, we'll require authentication but in the future we can add signed URL tokens
 */
export default async function InvoiceViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  
  // For now, require authentication
  // TODO: In the future, implement signed URL tokens for client access without login
  if (!session) {
    redirect("/auth/signin?callbackUrl=/invoices/" + (await params).id + "/view")
  }

  const { id } = await params
  
  try {
    // Verify invoice exists and user has access
    const invoice = await getInvoice(id)

    // Render the invoice detail view
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Invoice view link from email
            </p>
          </div>
          <InvoiceDetailClient invoice={invoice} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Invoice view error:", error)
    notFound()
  }
}





