import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

// Auto-detect NEXTAUTH_URL for Vercel
// Note: Vercel automatically sets VERCEL_URL, but NEXTAUTH_URL should be explicitly set
// for production deployments to ensure proper callback URLs

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error(
    "⚠️ NEXTAUTH_SECRET is not set. Please add it to your environment variables.\n" +
    "Run: openssl rand -base64 32\n" +
    "Or visit: https://generate-secret.vercel.app/32"
  )
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing email or password")
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            console.error(`User not found: ${credentials.email}`)
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.error(`Invalid password for user: ${credentials.email}`)
            return null
          }

          return {
            id: user.id,
            email: user.email,
            plan: user.plan,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',
        // Don't set domain - let browser handle it automatically
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.plan = (user as any).plan || "FREE"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) || ""
        session.user.plan = (token.plan as "FREE" | "PRO") || "FREE"
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

