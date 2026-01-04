import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PayTrack</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold mb-4">Terms & Conditions</CardTitle>
            <p className="text-muted-foreground">
              Last updated: January 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using PayTrack (&quot;the Service&quot;), a cloud-based SaaS platform for invoice management, 
                you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to 
                abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">2. Description of Service</h2>
              <p>
                PayTrack is a web-based Software as a Service (SaaS) platform that provides invoice creation, 
                payment tracking, and client management tools. The Service is accessible via web browsers and 
                is hosted on cloud infrastructure. We reserve the right to modify, suspend, or discontinue 
                the Service at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">3. User Accounts</h2>
              <p>
                To use our Service, you must create an account by providing accurate and complete information. 
                You are responsible for maintaining the confidentiality of your account credentials and for all 
                activities that occur under your account. You agree to notify us immediately of any unauthorized 
                use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">4. Subscription Plans</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2">Free Plan</h3>
              <p>
                The Free plan includes access to create up to 1,000 invoices total. Once this limit is reached, 
                you must upgrade to a paid plan to continue using the Service.
              </p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Pro Plan</h3>
              <p>
                The Pro plan is a subscription-based service billed monthly at $5 USD per month. Subscriptions 
                automatically renew unless cancelled. You may cancel your subscription at any time through your 
                account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">5. Payment Terms</h2>
              <p>
                Pro plan subscriptions are billed in advance on a monthly basis. All fees are non-refundable 
                except as required by law. If payment fails, we may suspend or terminate your account. Prices 
                may be changed with 30 days notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">6. Data and Privacy</h2>
              <p>
                Your data is stored securely in our cloud infrastructure with encryption in transit and at rest. 
                We implement industry-standard security measures to protect your information. By using the Service, 
                you consent to the collection and use of your data as described in our Privacy Policy.
              </p>
              <p>
                You retain ownership of all data you upload to the Service. We will not share your data with 
                third parties except as necessary to provide the Service or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">7. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to the Service or its related systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Upload malicious code, viruses, or harmful data</li>
                <li>Use the Service to send spam or unsolicited messages</li>
                <li>Impersonate any person or entity</li>
                <li>Violate any intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">8. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are owned by PayTrack and 
                are protected by international copyright, trademark, patent, trade secret, and other intellectual 
                property laws. You may not copy, modify, or create derivative works of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">9. Service Availability</h2>
              <p>
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted access to the Service. 
                The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond 
                our control. We are not liable for any damages resulting from Service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">10. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice, for any breach of 
                these Terms. Upon termination, your right to use the Service will cease immediately. You may 
                terminate your account at any time by contacting support or using the account deletion feature 
                in your settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">11. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, PayTrack shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting 
                from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">12. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless PayTrack, its affiliates, officers, directors, employees, 
                and agents from any claims, damages, losses, liabilities, and expenses arising out of your use 
                of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of material changes 
                via email or through the Service. Your continued use of the Service after changes become effective 
                constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">14. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                in which PayTrack operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-4">15. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> support@paytrack.com
              </p>
            </section>

            <div className="pt-8 border-t mt-8">
              <p className="text-sm text-muted-foreground">
                By using PayTrack, you acknowledge that you have read, understood, and agree to be bound by 
                these Terms & Conditions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PayTrack. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-6">
              <Link href="/terms" className="hover:text-foreground">Terms & Conditions</Link>
              <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



