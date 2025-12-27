"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { generatePDF } from "@/lib/pdf"

interface Invoice {
  id?: string
  amount: number
  dueDate: Date | string
  createdAt: Date | string
  notes?: string | null
  logo?: string | null
  lineItems?: string | null
  taxRate?: number | null
  discount?: number | null
  shipping?: number | null
  client: {
    name: string
    email: string
  }
}

export function DownloadPDFButton({ invoice }: { invoice: Invoice }) {
  const handleDownload = async () => {
    // Convert date strings to Date objects if needed
    const invoiceData = {
      ...invoice,
      dueDate: invoice.dueDate instanceof Date ? invoice.dueDate : new Date(invoice.dueDate),
      createdAt: invoice.createdAt instanceof Date ? invoice.createdAt : new Date(invoice.createdAt),
    }
    await generatePDF(invoiceData)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-1" />
      PDF
    </Button>
  )
}

