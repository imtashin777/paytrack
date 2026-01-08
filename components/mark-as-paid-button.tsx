"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { markInvoiceAsPaid } from "@/lib/actions/invoices"

export function MarkAsPaidButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!confirm("Mark this invoice as paid?")) return

    setLoading(true)
    try {
      await markInvoiceAsPaid(invoiceId)
      router.refresh()
    } catch (error) {
      alert("Failed to mark invoice as paid")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? "Marking..." : "Mark as Paid"}
    </Button>
  )
}













