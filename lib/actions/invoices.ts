"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { InvoiceStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getInvoices() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: session.user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  })

  // Calculate overdue status
  const today = new Date()
  const invoicesWithStatus = invoices.map((invoice) => {
    let status = invoice.status
    if (
      invoice.status === InvoiceStatus.UNPAID &&
      invoice.dueDate < today
    ) {
      status = InvoiceStatus.OVERDUE
    }
    return { ...invoice, status }
  })

  return invoicesWithStatus
}

export async function getInvoice(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
    include: { client: true },
  })

  if (!invoice) {
    throw new Error("Invoice not found")
  }

  // Check if overdue
  const today = new Date()
  let status = invoice.status
  if (
    invoice.status === InvoiceStatus.UNPAID &&
    invoice.dueDate < today
  ) {
    status = InvoiceStatus.OVERDUE
  }

  return { ...invoice, status }
}

export async function createInvoice(
  clientId: string,
  amount: number,
  dueDate: Date,
  notes?: string,
  logo?: string,
  lineItems?: Array<{ description: string; quantity: number; rate: number; amount: number }>,
  taxRate?: number,
  discount?: number,
  shipping?: number
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Check invoice limit for free plan (1000 total invoices)
  if (session.user.plan === "FREE") {
    const invoiceCount = await prisma.invoice.count({
      where: {
        userId: session.user.id,
      },
    })

    if (invoiceCount >= 1000) {
      throw new Error(
        "Free plan limit reached (1000 invoices). Upgrade to Pro for unlimited invoices."
      )
    }
  }

  const invoice = await prisma.invoice.create({
    data: {
      userId: session.user.id,
      clientId,
      amount,
      dueDate,
      notes: notes || null,
      logo: logo || null,
      lineItems: lineItems ? JSON.stringify(lineItems) : null,
      taxRate: taxRate || 0,
      discount: discount || 0,
      shipping: shipping || 0,
      status: InvoiceStatus.UNPAID,
    },
    include: { client: true },
  })

  revalidatePath("/dashboard")
  revalidatePath("/invoices")

  return invoice
}

export async function markInvoiceAsPaid(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const invoice = await prisma.invoice.update({
    where: { id, userId: session.user.id },
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
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const invoices = await getInvoices()

  const total = invoices.length
  const unpaid = invoices.filter(
    (inv) => inv.status === InvoiceStatus.UNPAID
  ).length
  const overdue = invoices.filter(
    (inv) => inv.status === InvoiceStatus.OVERDUE
  ).length
  const paid = invoices.filter(
    (inv) => inv.status === InvoiceStatus.PAID
  ).length

  // Calculate financial totals - use actual invoice totals
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

  const totalRevenue = invoices.reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0)
  const unpaidAmount = invoices
    .filter((inv) => inv.status === InvoiceStatus.UNPAID || inv.status === InvoiceStatus.OVERDUE)
    .reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0)
  const paidAmount = invoices
    .filter((inv) => inv.status === InvoiceStatus.PAID)
    .reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0)
  const overdueAmount = invoices
    .filter((inv) => inv.status === InvoiceStatus.OVERDUE)
    .reduce((sum, inv) => sum + calculateInvoiceTotal(inv), 0)

  return { 
    total, 
    unpaid, 
    overdue, 
    paid,
    totalRevenue,
    unpaidAmount,
    paidAmount,
    overdueAmount,
    invoices // Return invoices for chart data
  }
}

