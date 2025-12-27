import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Clock,
  Users,
  Settings2,
  Command,
  Plus,
  LogIn,
  User,
  Shield,
  Zap
} from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import all client-side components to avoid SSR/hydration issues
const InfiniteGrid = dynamic(
  () => import("@/components/ui/infinite-grid-integration"),
  { 
    ssr: false
  }
)

const BentoGridShowcase = dynamic(
  () => import("@/components/ui/bento-product-features").then((mod) => ({ default: mod.BentoGridShowcase })),
  { ssr: false }
)

const EstimatedDateBadge = dynamic(
  () => import("@/components/ui/estimated-arrival"),
  { ssr: false }
)

const TestimonialsSection = dynamic(
  () => import("@/components/home-testimonials").then((mod) => ({ default: mod.TestimonialsSection })),
  { ssr: false }
)

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section - Infinite Grid (includes navbar) */}
      <section className="relative">
        <InfiniteGrid />
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Track Payments
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simple features designed for freelancers who just want to get paid. 
            No complex accounting, no confusing terms. Just invoices and payments.
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
                Export as PDF and send to clients instantly.
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
                Never forget who owes you money.
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
                Visual charts show your invoice trends over time. Know your revenue at a glance. 
                Track your financial health with simple, clear metrics.
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
                Get alerts for unpaid invoices so you can follow up.
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
                Download professional PDF invoices for your records or to send to clients. 
                Clean, minimal design that looks professional.
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
                Keep track of all your clients in one place. View their invoice history, 
                contact information, and payment status easily.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Bento Product Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why PayTrack Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built specifically for freelancers in Asia. Simple, fast, and reliable.
          </p>
        </div>

        <BentoGridShowcase
          integration={
            <Card className="flex h-full flex-col">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Quick Setup</CardTitle>
                <CardDescription>
                  Get started in minutes. No complex setup, no confusing forms. 
                  Just sign up, add your first client, and create your first invoice.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href="/auth/signup">
                  <Button variant="outline" size="sm" className="w-full">
                    Start Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          }
          trackers={
            <Card className="h-full">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div>
                  <CardTitle className="text-base font-medium">
                    Multi-Currency Support
                  </CardTitle>
                  <CardDescription>USD, EUR, GBP, INR, BDT</CardDescription>
                </div>
                <div className="flex -space-x-2 overflow-hidden mt-4">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-primary/20 flex items-center justify-center text-xs font-bold">$</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-primary/20 flex items-center justify-center text-xs font-bold">€</div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-primary/20 flex items-center justify-center text-xs font-bold">₹</div>
                </div>
              </CardContent>
            </Card>
          }
          statistic={
            <Card className="relative h-full w-full overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
              />
              <CardContent className="relative z-10 flex h-full items-center justify-center p-6">
                <div className="text-center">
                  <span className="text-4xl md:text-6xl font-bold text-foreground/90">1,000</span>
                  <p className="text-xs md:text-sm text-muted-foreground mt-2">Free Invoices Total</p>
                </div>
              </CardContent>
            </Card>
          }
          focus={
            <Card className="h-full">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Payment Rate</CardTitle>
                    <CardDescription>Track your success</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-green-300 text-green-600">
                    Real-time
                  </Badge>
                </div>
                <div>
                  <span className="text-6xl font-bold">100%</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>When you use PayTrack</span>
                  <span>Never miss a payment</span>
                </div>
              </CardContent>
            </Card>
          }
          productivity={
            <Card className="h-full">
              <CardContent className="flex h-full flex-col justify-end p-6">
                <CardTitle className="text-base font-medium">
                  Built for Freelancers
                </CardTitle>
                <CardDescription>
                  No complex accounting terms. Just invoices, payments, and due dates. 
                  Simple enough for anyone to use.
                </CardDescription>
              </CardContent>
            </Card>
          }
          shortcuts={
            <Card className="h-full">
              <CardContent className="flex h-full flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <CardTitle className="text-base font-medium">Fast & Secure</CardTitle>
                  <CardDescription>
                    Your data is encrypted and secure. Fast performance, reliable uptime.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Secure</span>
                </div>
              </CardContent>
            </Card>
          }
        />
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
              <CardTitle className="text-3xl mb-4">Why Choose PayTrack?</CardTitle>
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
                      No ledgers, no complex tax calculations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Free to Start</h3>
                    <p className="text-muted-foreground text-sm">
                      1,000 invoices total free. Perfect for testing the waters. 
                      Upgrade to Pro for unlimited invoices at just $5/month.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Multi-Currency Support</h3>
                    <p className="text-muted-foreground text-sm">
                      USD, EUR, GBP, INR, BDT - switch currencies with one click. 
                      Perfect for freelancers working with international clients.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Secure & Private</h3>
                    <p className="text-muted-foreground text-sm">
                      Your data is encrypted and secure. We never share your information. 
                      Built with privacy in mind.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that works for you. No hidden fees, no surprises.
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
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Multi-currency support</span>
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
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Multi-currency support</span>
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
                Built for Asia, used worldwide.
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
                <li>Simple, fast, reliable</li>
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
