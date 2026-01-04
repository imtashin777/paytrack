import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmailSettingsClient } from "./email-settings-client"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Check if SMTP is configured
  const smtpUser = process.env.SMTP_USER || process.env.SMTP_USERNAME
  const smtpPassword = process.env.SMTP_PASSWORD || process.env.SMTP_PASS
  const isEmailConfigured = !!(smtpUser && smtpPassword)
  const fromEmail = process.env.SMTP_FROM_EMAIL || "send@brnnd.com"

  // Ensure port is a valid number
  const smtpPort = process.env.SMTP_PORT || "465"
  const portNumber = parseInt(smtpPort, 10)
  const validPort = isNaN(portNumber) ? 465 : portNumber

  const defaultSMTP = {
    host: process.env.SMTP_HOST || "smtp.resend.com",
    port: validPort,
    username: smtpUser || "resend",
    fromEmail,
    fromName: process.env.SMTP_FROM_NAME || "brnnd",
  }

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-background text-foreground space-y-8 md:space-y-10 py-8 md:py-10 px-6 lg:px-10">
        <div className="max-w-[1600px] mx-auto w-full space-y-8 md:space-y-10">
          {/* Unified Header with premium spacing */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border">
            {/* Left: Title Section */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Settings
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-2">
                Manage your account settings and integrations
              </p>
            </div>
          </div>

          <EmailSettingsClient 
            isEmailConfigured={isEmailConfigured}
            fromEmail={fromEmail}
            defaultSMTP={defaultSMTP}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

