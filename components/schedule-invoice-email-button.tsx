"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Calendar } from "lucide-react"
import { scheduleInvoiceEmail } from "@/lib/actions/invoices"
import toast from "react-hot-toast"

interface ScheduleInvoiceEmailButtonProps {
  invoiceId: string
  clientEmail: string
  onScheduled?: () => void
}

export function ScheduleInvoiceEmailButton({
  invoiceId,
  clientEmail,
  onScheduled,
}: ScheduleInvoiceEmailButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scheduledDateTime, setScheduledDateTime] = useState("")

  const handleSchedule = async () => {
    if (!scheduledDateTime) {
      toast.error("Please select a date and time")
      return
    }

    // Parse datetime-local value and create date in local timezone
    const scheduleDate = new Date(scheduledDateTime)
    const now = new Date()
    
    // Add 1 minute buffer to account for any timing issues
    const minFutureTime = new Date(now.getTime() + 60000) // 1 minute from now
    
    if (scheduleDate <= minFutureTime) {
      toast.error("Scheduled time must be at least 1 minute in the future")
      return
    }

    setLoading(true)
    try {
      await scheduleInvoiceEmail(invoiceId, scheduleDate)
      toast.success(`Email scheduled for ${scheduleDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`)
      setOpen(false)
      setScheduledDateTime("")
      if (onScheduled) {
        onScheduled()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Schedule</span>
          <span className="sm:hidden">Schedule</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-full max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Schedule Invoice Email</DialogTitle>
          <DialogDescription className="text-sm">
            Set a date and time to automatically send this invoice to{" "}
            <span className="font-medium text-foreground">{clientEmail}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="scheduledDateTime" className="text-sm font-medium">
              Schedule Date & Time
            </Label>
            <Input
              id="scheduledDateTime"
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              required
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const oneHourLater = new Date()
                oneHourLater.setHours(oneHourLater.getHours() + 1)
                // Set minutes to 0 for cleaner times
                oneHourLater.setMinutes(0, 0, 0)
                setScheduledDateTime(oneHourLater.toISOString().slice(0, 16))
              }}
              className="flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs sm:text-sm">+1 Hour</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                tomorrow.setHours(9, 0, 0, 0) // Set to 9 AM tomorrow
                setScheduledDateTime(tomorrow.toISOString().slice(0, 16))
              }}
              className="flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs sm:text-sm">Tomorrow</span>
            </Button>
          </div>
          {scheduledDateTime && (
            <div className="rounded-lg bg-muted/50 p-3 border border-border">
              <p className="text-xs text-muted-foreground mb-1">
                Email will be sent on:
              </p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(scheduledDateTime).toLocaleString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false)
              setScheduledDateTime("")
            }}
            disabled={loading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSchedule}
            disabled={loading || !scheduledDateTime}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {loading ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2" />
                Schedule Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

