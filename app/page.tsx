import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
            Professional Invoice Management SaaS Platform
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cloud-based invoice tracking software designed for modern freelancers and small businesses. 
            Manage your invoices online, track payments in real-time, and get paid faster with our web-based platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Online Invoice Creation</CardTitle>
              <CardDescription>
                Create professional invoices directly in your web browser. Our cloud-based platform lets you build invoices with line items, tax calculations, and custom branding. 
                Generate PDFs instantly and send via email or shareable links.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Real-Time Payment Tracking</CardTitle>
              <CardDescription>
                Monitor payment status from anywhere with our web dashboard. View paid invoices, outstanding balances, and overdue accounts in real-time. 
                Access your payment data from any device with an internet connection.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Web-Based Analytics Dashboard</CardTitle>
              <CardDescription>
                Interactive charts and graphs visualize your invoice data in real-time. Track revenue trends, payment rates, and business performance metrics. 
                All accessible through your web browser with live data updates.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 4 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Automated Overdue Notifications</CardTitle>
              <CardDescription>
                Our SaaS platform automatically detects and marks overdue invoices in real-time. No manual tracking required. 
                Receive email notifications and web alerts for unpaid invoices so you never miss a payment.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 5 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Cloud PDF Generation</CardTitle>
              <CardDescription>
                Generate professional PDF invoices instantly from your web dashboard. Download or email PDFs directly to clients. 
                All PDFs are stored securely in the cloud for easy access and archival.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 6 */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Online Client Database</CardTitle>
              <CardDescription>
                Manage all your clients from a centralized web interface. Access client profiles, invoice history, 
                payment records, and contact information anywhere, anytime. Cloud-synced data ensures you&apos;re always up to date.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Bento Product Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Modern SaaS Invoice Platform</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Web-based invoice management software built for the modern freelancer. Cloud-hosted, secure, and accessible from anywhere.
          </p>
        </div>

        <BentoGridShowcase
          integration={
            <Card className="flex h-full flex-col">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Instant Web Access</CardTitle>
                <CardDescription>
                  Start using our SaaS platform in seconds. No software installation required. 
                  Simply sign up online, verify your email, and access your invoice dashboard immediately through any web browser.
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
                    Multi-Currency SaaS Platform
                  </CardTitle>
                  <CardDescription>Real-time currency conversion via web API: USD, EUR, GBP, INR, BDT</CardDescription>
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
                  <p className="text-xs md:text-sm text-muted-foreground mt-2">Free Tier - Cloud Storage</p>
                </div>
              </CardContent>
            </Card>
          }
          focus={
            <Card className="h-full">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Live Payment Tracking</CardTitle>
                    <CardDescription>Web-based real-time updates</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-green-300 text-green-600">
                    Cloud-Synced
                  </Badge>
                </div>
                <div>
                  <span className="text-6xl font-bold">100%</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Online access anytime</span>
                  <span>Never lose data</span>
                </div>
              </CardContent>
            </Card>
          }
          productivity={
            <Card className="h-full">
              <CardContent className="flex h-full flex-col justify-end p-6">
                <CardTitle className="text-base font-medium">
                  Cloud-Based SaaS Solution
                </CardTitle>
                <CardDescription>
                  No software downloads or complex installations. Access your invoice platform from any browser. 
                  Simple web interface designed for modern freelancers and remote teams.
                </CardDescription>
              </CardContent>
            </Card>
          }
          shortcuts={
            <Card className="h-full">
              <CardContent className="flex h-full flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <CardTitle className="text-base font-medium">Secure Cloud Hosting</CardTitle>
                  <CardDescription>
                    Enterprise-grade security with SSL encryption. Fast global CDN, 99.9% uptime SLA. 
                    Your data is backed up automatically in secure cloud servers.
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
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Why Choose PayTrack SaaS?</CardTitle>
              <CardDescription className="text-lg">
                Professional invoice management software accessible from any web browser worldwide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Web-Based Platform</h3>
                    <p className="text-muted-foreground text-sm">
                      Access your invoice management system from any device with a web browser. 
                      No desktop software required. All your data syncs automatically in the cloud.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Freemium SaaS Model</h3>
                    <p className="text-muted-foreground text-sm">
                      Start free with 1,000 invoices stored in the cloud. Test our platform risk-free. 
                      Upgrade to Pro plan ($5/month) for unlimited cloud storage and advanced features.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Live Currency API Integration</h3>
                    <p className="text-muted-foreground text-sm">
                      Real-time exchange rates via web API. Switch between USD, EUR, GBP, INR, BDT instantly. 
                      Automatic currency conversion for global freelancers using our cloud platform.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Enterprise Cloud Security</h3>
                    <p className="text-muted-foreground text-sm">
                      Your data is encrypted with SSL/TLS in transit and at rest. Regular automated backups. 
                      GDPR-compliant SaaS platform with SOC 2 security standards. Your privacy is our priority.
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent SaaS Pricing</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simple subscription-based pricing. Pay monthly or annually. Cancel anytime. No setup fees, no hidden costs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Start free, upgrade when you need more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-4xl font-bold">$0</div>
                <div className="text-muted-foreground">forever</div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>1,000 invoices cloud storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited clients database</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Online PDF generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Web dashboard analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Live currency API</span>
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
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <Badge className="bg-primary">Popular</Badge>
              </div>
              <CardDescription>Unlimited cloud storage & features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-4xl font-bold">$5</div>
                <div className="text-muted-foreground">per month</div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited cloud invoice storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Unlimited client database</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Advanced PDF templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Advanced web analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>24/7 priority email support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Real-time currency API</span>
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
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Ready to Start Using Our SaaS Platform?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Join thousands of freelancers using our cloud-based invoice management system. Sign up free and access your dashboard instantly.
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
                Cloud-based SaaS platform for invoice and payment management. 
                Web-accessible from anywhere, trusted by freelancers worldwide.
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
                <li>Cloud-hosted SaaS platform</li>
                <li>Web-based, secure, reliable</li>
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
