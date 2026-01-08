"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { sendInvoiceEmailAction } from "@/lib/actions/invoices"
import { Mail } from "lucide-react"
import toast from "react-hot-toast"

export function ResendInvoiceEmailButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const result = await sendInvoiceEmailAction(invoiceId)

      if (result.success) {
        toast.success("Invoice email sent successfully!")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to send invoice email")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send invoice email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={loading}
    >
      <Mail className="h-4 w-4 mr-2" />
      {loading ? "Sending..." : "Resend Invoice Email"}
    </Button>
  )
}





