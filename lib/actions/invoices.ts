"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InvoiceStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sendInvoiceEmail } from "@/lib/email"

export async function createInvoice(
  clientId: string,
  amount: number,
  dueDate: Date,
  notes?: string,
  logo?: string,
  lineItems?: Array<{ description: string; quantity: number; rate: number; amount: number }>,
  taxRate?: number,
  discount?: number,
  shipping?: number,
  sendEmail: boolean = false,
  emailSendOption?: string,
  emailScheduledAt?: Date
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Calculate total from line items if provided
  let calculatedAmount = amount
  if (lineItems && lineItems.length > 0) {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0)
    const tax = taxRate ? (subtotal * taxRate) / 100 : 0
    const shippingCost = shipping || 0
    const discountAmount = discount || 0
    calculatedAmount = subtotal + tax + shippingCost - discountAmount
  }

  const invoice = await prisma.invoice.create({
    data: {
      userId: session.user.id,
      clientId,
      amount: calculatedAmount,
      dueDate,
      notes,
      logo,
      lineItems: lineItems ? JSON.stringify(lineItems) : null,
      taxRate: taxRate || 0,
      discount: discount || 0,
      shipping: shipping || 0,
      status: InvoiceStatus.UNPAID,
      emailSendOption: emailSendOption || (sendEmail ? "send_now" : "save_only"),
      emailScheduledAt: emailScheduledAt || null,
    },
    include: {
      client: true,
    },
  })

  let emailSent = false
  let emailError: string | null = null

  // Send email if requested
  if (emailSendOption === "send_now" || sendEmail) {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || "http://localhost:3000"
      const invoiceViewUrl = `${baseUrl}/invoices/${invoice.id}/view`

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
            lineItems: lineItems,
            taxRate: invoice.taxRate,
            discount: invoice.discount,
            shipping: invoice.shipping,
          },
          invoiceViewUrl,
        },
        session.user.id
      )

      if (emailResult.success) {
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            emailSent: true,
            emailSentAt: new Date(),
          },
        })
        emailSent = true
      } else {
        emailError = emailResult.error || "Failed to send email"
      }
    } catch (error: any) {
      console.error("Error sending invoice email:", error)
      emailError = error.message || "Failed to send email"
    }
  }

  revalidatePath("/dashboard")
  revalidatePath("/invoices")
  revalidatePath(`/invoices/${invoice.id}`)

  return { invoice, emailSent, emailError }
}

export async function getInvoices() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: {
      client: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return invoices
}

export async function getInvoice(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      client: true,
    },
  })

  if (!invoice) {
    throw new Error("Invoice not found")
  }

  return invoice
}

export async function markInvoiceAsPaid(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const invoice = await prisma.invoice.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      status: InvoiceStatus.PAID,
      paidAt: new Date(),
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/invoices")
  revalidatePath(`/invoices/${id}`)

  return invoice
}

export async function getInvoiceStats() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    // Optimize: Only fetch what we need for stats, not full client data
    const invoices = await prisma.invoice.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        amount: true,
        status: true,
        dueDate: true,
        lineItems: true,
        taxRate: true,
        discount: true,
        shipping: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Calculate overdue status efficiently
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const invoicesWithStatus = invoices.map((invoice) => {
      let status = invoice.status
      const dueDate = new Date(invoice.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      
      if (
        invoice.status === InvoiceStatus.UNPAID &&
        dueDate < today
      ) {
        status = InvoiceStatus.OVERDUE
      }
      return { ...invoice, status }
    })

    const total = invoicesWithStatus.length
    const unpaid = invoicesWithStatus.filter(
      (inv) => inv.status === InvoiceStatus.UNPAID
    ).length
    const overdue = invoicesWithStatus.filter(
      (inv) => inv.status === InvoiceStatus.OVERDUE
    ).length
    const paid = invoicesWithStatus.filter(
      (inv) => inv.status === InvoiceStatus.PAID
    ).length

    // Calculate financial totals - use actual invoice totals (100% accurate)
    const calculateInvoiceTotal = (inv: any) => {
      // If invoice has line items, calculate from line items
      if (inv.lineItems) {
        try {
          const lineItems = JSON.parse(inv.lineItems as string)
          if (Array.isArray(lineItems) && lineItems.length > 0) {
            const subtotal = lineItems.reduce((s: number, item: any) => s + (item.amount || 0), 0)
            const taxRate = inv.taxRate || 0
            const taxAmount = (subtotal * taxRate) / 100
            const discount = inv.discount || 0
            const shipping = inv.shipping || 0
            return subtotal + taxAmount + shipping - discount
          }
        } catch (e) {
          // If parsing fails, use the stored amount
        }
      }
      return inv.amount || 0
    }

    // Calculate totals in a single pass for better performance (100% accurate)
    let totalRevenue = 0
    let unpaidAmount = 0
    let paidAmount = 0
    let overdueAmount = 0

    for (const inv of invoicesWithStatus) {
      const invoiceTotal = calculateInvoiceTotal(inv)
      totalRevenue += invoiceTotal
      
      if (inv.status === InvoiceStatus.PAID) {
        paidAmount += invoiceTotal
      } else if (inv.status === InvoiceStatus.OVERDUE) {
        overdueAmount += invoiceTotal
        unpaidAmount += invoiceTotal
      } else if (inv.status === InvoiceStatus.UNPAID) {
        unpaidAmount += invoiceTotal
      }
    }

    return { 
      total, 
      unpaid, 
      overdue, 
      paid,
      totalRevenue,
      unpaidAmount,
      paidAmount,
      overdueAmount,
      invoices: invoicesWithStatus // Return invoices for chart data
    }
  } catch (error: any) {
    console.error("Error in getInvoiceStats:", error)
    // Return default stats instead of throwing
    return {
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
  }
}

export async function sendInvoiceEmailAction(invoiceId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      userId: session.user.id,
    },
    include: {
      client: true,
    },
  })

  if (!invoice) {
    throw new Error("Invoice not found")
  }

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
      session.user.id
    )

    if (emailResult.success) {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          emailSent: true,
          emailSentAt: new Date(),
        },
      })
      revalidatePath("/invoices")
      revalidatePath(`/invoices/${invoice.id}`)
      return { success: true }
    } else {
      return { success: false, error: emailResult.error || "Failed to send email" }
    }
  } catch (error: any) {
    console.error("Error sending invoice email:", error)
    return { success: false, error: error.message || "Failed to send email" }
  }
}

export async function scheduleInvoiceEmail(invoiceId: string, scheduledDateTime: Date) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Validate scheduled time is in the future (add 1 minute buffer)
  const now = new Date()
  const minFutureTime = new Date(now.getTime() + 60000) // 1 minute from now
  if (scheduledDateTime <= minFutureTime) {
    throw new Error("Scheduled time must be at least 1 minute in the future")
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      userId: session.user.id,
    },
  })

  if (!invoice) {
    throw new Error("Invoice not found")
  }

  // Update invoice with schedule
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      emailSendOption: "schedule",
      emailScheduledAt: scheduledDateTime,
    },
  })

  revalidatePath("/invoices")
  revalidatePath(`/invoices/${invoiceId}`)

  return { success: true, scheduledAt: scheduledDateTime }
}
