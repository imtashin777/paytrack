"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Save,
  Trash2,
} from "lucide-react"
import { saveUserSMTP, deleteUserSMTP, getUserSMTP } from "@/lib/actions/smtp"
import toast from "react-hot-toast"

interface EmailSettingsClientProps {
  isEmailConfigured: boolean
  fromEmail: string
  defaultSMTP: {
    host: string
    port: number
    username: string
    fromEmail: string
    fromName: string
  }
}

export function EmailSettingsClient({
  isEmailConfigured,
  fromEmail,
  defaultSMTP,
}: EmailSettingsClientProps) {
  const [smtpType, setSmtpType] = useState<"default" | "custom">("default")
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [customSMTP, setCustomSMTP] = useState({
    host: "",
    port: 465,
    username: "",
    password: "",
    fromEmail: "",
    fromName: "",
  })

  useEffect(() => {
    const fetchUserSMTP = async () => {
      try {
        const userSMTP = await getUserSMTP()
        if (userSMTP && userSMTP.useCustom) {
          setSmtpType("custom")
          setCustomSMTP({
            host: userSMTP.host,
            port: userSMTP.port,
            username: userSMTP.username,
            password: "", // Don't show password
            fromEmail: userSMTP.fromEmail,
            fromName: userSMTP.fromName || "",
          })
        }
      } catch (error) {
        console.error("Error fetching user SMTP:", error)
      } finally {
        setFetching(false)
      }
    }
    fetchUserSMTP()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      if (smtpType === "default") {
        await deleteUserSMTP()
        toast.success("Using default SMTP configuration")
      } else {
        if (!customSMTP.host || !customSMTP.username || !customSMTP.password || !customSMTP.fromEmail) {
          toast.error("Please fill in all required fields")
          return
        }
        await saveUserSMTP({
          host: customSMTP.host,
          port: customSMTP.port,
          username: customSMTP.username,
          password: customSMTP.password,
          fromEmail: customSMTP.fromEmail,
          fromName: customSMTP.fromName || undefined,
          useCustom: true,
        })
        toast.success("Custom SMTP saved successfully")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save SMTP configuration")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>
                  Choose default SMTP or configure your own custom SMTP
                </CardDescription>
              </div>
            </div>
            {isEmailConfigured ? (
              <Badge className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Not Configured
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEmailConfigured && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>SMTP Not Configured</AlertTitle>
              <AlertDescription>
                Default SMTP is not configured. Please configure custom SMTP or set up default SMTP in environment variables.
              </AlertDescription>
            </Alert>
          )}

          <RadioGroup value={smtpType} onValueChange={(value) => setSmtpType(value as "default" | "custom")}>
            <div className="space-y-4">
              {/* Default SMTP Option */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="default" id="default" className="mt-1" />
                <Label htmlFor="default" className="flex-1 cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Default SMTP</span>
                      {smtpType === "default" && (
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use the default SMTP configuration (configured in environment variables)
                    </p>
                    {smtpType === "default" && (
                      <div className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Host:</span>
                          <span className="font-mono">{defaultSMTP.host}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Port:</span>
                          <span className="font-mono">{defaultSMTP.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Username:</span>
                          <span className="font-mono">{defaultSMTP.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">From:</span>
                          <span className="font-mono">{defaultSMTP.fromEmail}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Label>
              </div>

              {/* Custom SMTP Option */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="custom" id="custom" className="mt-1" />
                <Label htmlFor="custom" className="flex-1 cursor-pointer">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Custom SMTP</span>
                      {smtpType === "custom" && (
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Configure your own SMTP server (saved securely in database)
                    </p>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>

          {/* Custom SMTP Form */}
          {smtpType === "custom" && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">SMTP Host *</Label>
                  <Input
                    id="host"
                    value={customSMTP.host}
                    onChange={(e) => setCustomSMTP({ ...customSMTP, host: e.target.value })}
                    placeholder="smtp.example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port *</Label>
                  <Input
                    id="port"
                    type="number"
                    value={customSMTP.port}
                    onChange={(e) => setCustomSMTP({ ...customSMTP, port: parseInt(e.target.value) || 465 })}
                    placeholder="465"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={customSMTP.username}
                  onChange={(e) => setCustomSMTP({ ...customSMTP, username: e.target.value })}
                  placeholder="your-smtp-username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={customSMTP.password}
                  onChange={(e) => setCustomSMTP({ ...customSMTP, password: e.target.value })}
                  placeholder="your-smtp-password"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email *</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={customSMTP.fromEmail}
                    onChange={(e) => setCustomSMTP({ ...customSMTP, fromEmail: e.target.value })}
                    placeholder="noreply@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name (Optional)</Label>
                  <Input
                    id="fromName"
                    value={customSMTP.fromName}
                    onChange={(e) => setCustomSMTP({ ...customSMTP, fromName: e.target.value })}
                    placeholder="Your Company Name"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
            {smtpType === "custom" && customSMTP.host && (
              <Button
                variant="outline"
                onClick={async () => {
                  if (confirm("Are you sure you want to delete custom SMTP and use default?")) {
                    setLoading(true)
                    try {
                      await deleteUserSMTP()
                      setSmtpType("default")
                      setCustomSMTP({
                        host: "",
                        port: 465,
                        username: "",
                        password: "",
                        fromEmail: "",
                        fromName: "",
                      })
                      toast.success("Custom SMTP deleted, using default")
                    } catch (error: any) {
                      toast.error(error.message || "Failed to delete custom SMTP")
                    } finally {
                      setLoading(false)
                    }
                  }
                }}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Custom SMTP
              </Button>
            )}
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>How It Works</AlertTitle>
            <AlertDescription className="text-sm space-y-2 mt-2">
              <p>
                When you create an invoice and check "Send invoice via email":
              </p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Invoice is created in the database</li>
                <li>Professional HTML email is sent to the client</li>
                <li>Email includes invoice details, HTML table, and PDF attachment</li>
                <li>Email status is tracked in the database</li>
              </ol>
              <p className="mt-2 text-xs text-muted-foreground">
                Custom SMTP credentials are stored securely in your database and encrypted in production.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
