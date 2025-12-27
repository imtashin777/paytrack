import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Free Plan</CardTitle>
                {session.user.plan === "FREE" && (
                  <Badge>Current Plan</Badge>
                )}
              </div>
              <CardDescription>
                Perfect for getting started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">$0<span className="text-lg text-muted-foreground">/month</span></div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>1,000 invoices total</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Client management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>PDF export</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className={session.user.plan === "PRO" ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pro Plan</CardTitle>
                {session.user.plan === "PRO" && (
                  <Badge className="bg-primary">Current Plan</Badge>
                )}
              </div>
              <CardDescription>
                For serious freelancers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">$5<span className="text-lg text-muted-foreground">/month</span></div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Unlimited invoices</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Client management</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>PDF export</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              {session.user.plan === "FREE" && (
                <Button className="w-full">
                  Upgrade to Pro
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stripe Integration</CardTitle>
            <CardDescription>
              Stripe integration for subscription management is set up in the codebase.
              To enable it, configure your Stripe keys and set up webhook handlers.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  )
}

