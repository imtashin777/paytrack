import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If user has valid session, allow access
    if (req.nextauth.token) {
      return NextResponse.next()
    }
    
    // If no session, redirect to signin
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  },
  {
    pages: {
      signIn: "/auth/signin",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/invoices/:path*",
    "/billing/:path*",
    "/settings/:path*",
  ],
}













