"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { generatePDF } from "@/lib/pdf"

interface Invoice {
  id: string
  amount: number
  dueDate: Date
  createdAt: Date
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
    await generatePDF(invoice)
  }

  return (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" />
      Download PDF
    </Button>
  )
}

