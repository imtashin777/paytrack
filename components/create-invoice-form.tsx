"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createInvoice } from "@/lib/actions/invoices"
import { Alert, AlertDescription } from "@/components/ui/alert"
import toast from "react-hot-toast"
import { Mail, Send, Clock, Save, Calendar } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
}

export function CreateInvoiceForm({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailOption, setEmailOption] = useState<"send_now" | "save_only" | "schedule">("send_now")
  const [scheduledDateTime, setScheduledDateTime] = useState("")
  const [selectedClientId, setSelectedClientId] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const clientId = formData.get("clientId") as string
    const amount = parseFloat(formData.get("amount") as string)
    const dueDate = formData.get("dueDate") as string
    const notes = formData.get("notes") as string

    // Validate schedule date if scheduling
    if (emailOption === "schedule") {
      if (!scheduledDateTime) {
        setError("Please select a date and time for scheduling")
        toast.error("Please select a date and time for scheduling")
        setLoading(false)
        return
      }
      const scheduleDate = new Date(scheduledDateTime)
      if (scheduleDate <= new Date()) {
        setError("Scheduled time must be in the future")
        toast.error("Scheduled time must be in the future")
        setLoading(false)
        return
      }
    }

    try {
      const result = await createInvoice(
        clientId,
        amount,
        new Date(dueDate),
        notes || undefined,
        undefined, // logo
        undefined, // lineItems
        undefined, // taxRate
        undefined, // discount
        undefined, // shipping
        emailOption === "send_now", // sendEmail (backward compatibility)
        emailOption, // emailSendOption
        emailOption === "schedule" && scheduledDateTime ? new Date(scheduledDateTime) : undefined // emailScheduledAt
      )

      // Show success message
      if (emailOption === "send_now") {
        if (result.emailSent) {
          toast.success("Invoice created and sent successfully!")
        } else if (result.emailError) {
          toast.success("Invoice created successfully!")
          toast.error(`Email failed: ${result.emailError}`)
        } else {
          toast.success("Invoice created successfully!")
        }
      } else if (emailOption === "schedule") {
        toast.success(`Invoice created and scheduled for ${new Date(scheduledDateTime).toLocaleString()}!`)
      } else {
        toast.success("Invoice created successfully!")
      }

      // Redirect after a short delay to show toast
      setTimeout(() => {
        router.push("/invoices")
        router.refresh()
      }, 500)
    } catch (err: any) {
      setError(err.message || "Failed to create invoice")
      toast.error(err.message || "Failed to create invoice")
    } finally {
      setLoading(false)
    }
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Clients</CardTitle>
          <CardDescription>
            You need to create a client first before creating an invoice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/clients/new")}>
            Create Client
          </Button>
        </CardContent>
      </Card>
    )
  }

  const selectedClient = clients.find(c => c.id === selectedClientId)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">New Invoice</CardTitle>
        <CardDescription className="text-sm">
          Fill in the details to create a new invoice
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <select
              id="clientId"
              name="clientId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              id="notes"
              name="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Additional notes about this invoice..."
            />
          </div>

          {/* Email Options with Quick Action Buttons */}
          {selectedClient && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-md border">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Options
              </Label>
              
              {/* Quick Action Buttons - Fully Responsive */}
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button
                  type="button"
                  variant={emailOption === "send_now" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmailOption("send_now")}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto sm:flex-1"
                >
                  <Send className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Send Now</span>
                </Button>
                <Button
                  type="button"
                  variant={emailOption === "save_only" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmailOption("save_only")}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto sm:flex-1"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Save Only</span>
                </Button>
                <Button
                  type="button"
                  variant={emailOption === "schedule" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEmailOption("schedule")}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto sm:flex-1"
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Schedule</span>
                </Button>
              </div>

              {/* Radio Group (Hidden but keeps state) */}
              <RadioGroup value={emailOption} onValueChange={(value) => setEmailOption(value as typeof emailOption)} className="hidden">
                <RadioGroupItem value="send_now" id="send_now" />
                <RadioGroupItem value="save_only" id="save_only" />
                <RadioGroupItem value="schedule" id="schedule" />
              </RadioGroup>

              {/* Selected Option Info */}
              <div className="p-3 bg-background rounded-md border">
                {emailOption === "send_now" && (
                  <div className="flex items-start gap-2">
                    <Send className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Send Immediately</p>
                      <p className="text-xs text-muted-foreground">
                        Invoice will be sent to <strong>{selectedClient.email}</strong> immediately after creation
                      </p>
                    </div>
                  </div>
                )}
                {emailOption === "save_only" && (
                  <div className="flex items-start gap-2">
                    <Save className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Save Without Sending</p>
                      <p className="text-xs text-muted-foreground">
                        Invoice will be created but not sent. You can send it later from the invoice page.
                      </p>
                    </div>
                  </div>
                )}
                {emailOption === "schedule" && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Schedule Email</p>
                        <p className="text-xs text-muted-foreground">
                          Set a date and time to automatically send the invoice email
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduledDateTime" className="text-sm">Schedule Date & Time</Label>
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Input
                          id="scheduledDateTime"
                          type="datetime-local"
                          value={scheduledDateTime}
                          onChange={(e) => setScheduledDateTime(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          required
                          className="flex-1 w-full"
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Set to 1 hour from now
                              const oneHourLater = new Date()
                              oneHourLater.setHours(oneHourLater.getHours() + 1)
                              setScheduledDateTime(oneHourLater.toISOString().slice(0, 16))
                            }}
                            className="flex items-center justify-center gap-1 flex-1 sm:flex-initial"
                          >
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs sm:text-sm">+1 Hour</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Set to tomorrow same time
                              const tomorrow = new Date()
                              tomorrow.setDate(tomorrow.getDate() + 1)
                              setScheduledDateTime(tomorrow.toISOString().slice(0, 16))
                            }}
                            className="flex items-center justify-center gap-1 flex-1 sm:flex-initial"
                          >
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs sm:text-sm">Tomorrow</span>
                          </Button>
                        </div>
                      </div>
                      {scheduledDateTime && (
                        <p className="text-xs text-muted-foreground">
                          Email will be sent to <strong>{selectedClient.email}</strong> on{" "}
                          <strong>{new Date(scheduledDateTime).toLocaleString()}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <Button type="submit" disabled={loading} className="flex-1 w-full sm:w-auto">
              {loading ? (
                <span className="text-sm sm:text-base">
                  {emailOption === "send_now" ? "Creating & Sending..." : 
                   emailOption === "schedule" ? "Creating & Scheduling..." : 
                   "Creating..."}
                </span>
              ) : (
                <>
                  {emailOption === "send_now" ? (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      <span className="text-sm sm:text-base">Create & Send</span>
                    </>
                  ) : emailOption === "schedule" ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm sm:text-base">Create & Schedule</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      <span className="text-sm sm:text-base">Create Invoice</span>
                    </>
                  )}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <span className="text-sm sm:text-base">Cancel</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
