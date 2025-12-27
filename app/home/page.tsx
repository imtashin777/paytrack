import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Clock,
  Users
} from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">PayTrack</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            <span>Simple Invoice & Payment Tracking</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Never Forget Who Paid
            <br />
            <span className="text-primary">Track Invoices Like a Pro</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            PayTrack helps freelancers in Asia manage invoices and payments effortlessly. 
            No complex accounting. Just simple, honest tracking.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            Free plan: 1,000 invoices total • No credit card required
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Track Payments
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple features for freelancers who just want to get paid
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Create Invoices Fast</CardTitle>
              <CardDescription>
                Build professional invoices in minutes. Add line items, tax, discounts, and your logo.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Track Payments</CardTitle>
              <CardDescription>
                See who paid, who didn&apos;t, and which invoices are overdue. All in one dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Smart Analytics</CardTitle>
              <CardDescription>
                Visual charts show your invoice trends. Know your revenue at a glance.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 4 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Auto Overdue Detection</CardTitle>
              <CardDescription>
                Invoices automatically mark as overdue when past due date. No manual checking needed.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 5 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>PDF Export</CardTitle>
              <CardDescription>
                Download professional PDF invoices. Send them to clients instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 6 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Keep track of all your clients. View their invoice history in one place.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-2">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Why PayTrack?</CardTitle>
              <CardDescription className="text-lg">
                Built specifically for freelancers in Asia (Bangladesh/India)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">No Complex Accounting</h3>
                    <p className="text-muted-foreground text-sm">
                      We skip the confusing stuff. Just invoices, payments, and due dates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Free to Start</h3>
                    <p className="text-muted-foreground text-sm">
                      1,000 invoices total free. Perfect for testing the waters.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Multi-Currency Support</h3>
                    <p className="text-muted-foreground text-sm">
                      USD, EUR, GBP, INR, BDT - switch currencies with one click.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Secure & Private</h3>
                    <p className="text-muted-foreground text-sm">
                      Your data is encrypted and secure. We never share your information.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that works for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative overflow-hidden">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-4xl font-bold">$0</div>
                <div className="text-muted-foreground">forever</div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>1,000 invoices total</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>PDF export</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Dashboard analytics</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative overflow-hidden border-primary/50">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <Badge className="bg-primary">Popular</Badge>
              </div>
              <CardDescription>For serious freelancers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-4xl font-bold">$5</div>
                <div className="text-muted-foreground">per month</div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited invoices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited clients</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>PDF export</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/auth/signup" className="block">
                <Button className="w-full">
                  Upgrade to Pro
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="relative overflow-hidden bg-primary text-primary-foreground border-0">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join freelancers who never forget who paid. Start tracking invoices today.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold">PayTrack</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Simple invoice and payment tracking for freelancers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/invoices" className="hover:text-foreground">Invoices</Link></li>
                <li><Link href="/clients" className="hover:text-foreground">Clients</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/auth/signup" className="hover:text-foreground">Sign Up</Link></li>
                <li><Link href="/auth/signin" className="hover:text-foreground">Sign In</Link></li>
                <li><Link href="/billing" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@paytrack.com</li>
                <li>Built for freelancers in Asia</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PayTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

