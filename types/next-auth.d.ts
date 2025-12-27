import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      plan: "FREE" | "PRO"
    }
  }

  interface User {
    id: string
    email: string
    plan: "FREE" | "PRO"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    plan: "FREE" | "PRO"
  }
}



