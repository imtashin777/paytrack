import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendInvoiceEmail } from "@/lib/email"

/**
 * Cron job to send scheduled invoice emails
 * Call this endpoint periodically (e.g., every minute via Vercel Cron or external service)
 */
export async function GET(request: Request) {
  // Verify cron secret (optional but recommended)
  const authHeader = request.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
    
    // Find invoices scheduled to be sent now or in the past (that haven't been sent yet)
    const scheduledInvoices = await prisma.invoice.findMany({
      where: {
        emailSendOption: "schedule",
        emailScheduledAt: {
          lte: now, // Scheduled time has passed
        },
        emailSent: false, // Not sent yet
      },
      include: {
        client: true,
      },
    })

    const results = []

    for (const invoice of scheduledInvoices) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3000"
        const invoiceViewUrl = `${baseUrl}/invoices/${invoice.id}/view`

        // Parse line items
        let parsedLineItems: Array<{ description: string; quantity: number; rate: number; amount: number }> | undefined
        if (invoice.lineItems) {
          try {
            parsedLineItems = JSON.parse(invoice.lineItems)
          } catch (e) {
            console.error("Failed to parse line items:", e)
          }
        }

        // Send email
        const emailResult = await sendInvoiceEmail(
          {
            invoice: {
              id: invoice.id,
              invoiceNumber: invoice.id.slice(0, 8).toUpperCase(),
              clientName: invoice.client.name,
              clientEmail: invoice.client.email,
              amount: invoice.amount,
              dueDate: invoice.dueDate,
              createdAt: invoice.createdAt,
              notes: invoice.notes,
              lineItems: parsedLineItems,
              taxRate: invoice.taxRate,
              discount: invoice.discount,
              shipping: invoice.shipping,
            },
            invoiceViewUrl,
          },
          invoice.userId
        )

        // Update invoice status
        if (emailResult.success) {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
              emailSent: true,
              emailSentAt: new Date(),
            },
          })
          results.push({ invoiceId: invoice.id, status: "sent" })
        } else {
          results.push({ invoiceId: invoice.id, status: "failed", error: emailResult.error })
        }
      } catch (error: any) {
        console.error(`Error processing scheduled invoice ${invoice.id}:`, error)
        results.push({ invoiceId: invoice.id, status: "error", error: error.message })
      }
    }

    return NextResponse.json({
      success: true,
      processed: scheduledInvoices.length,
      results,
    })
  } catch (error: any) {
    console.error("Error in scheduled email cron:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

