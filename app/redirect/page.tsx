import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Central redirect hub after authentication.
 *
 * We no longer rely on the `callbackUrl` query parameter.
 * Instead, NextAuth redirects here after successful login,
 * and this page decides where to send the user next.
 */
export default async function RedirectPage() {
  const session = await getServerSession(authOptions)

  // If the user has a valid session, send them to the dashboard
  if (session) {
    redirect("/dashboard")
  }

  // If no session, send them back to sign-in
  redirect("/auth/signin")
}


