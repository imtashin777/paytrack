"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function signUp(
  email: string, 
  password: string,
  firstName?: string,
  lastName?: string
) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email already registered. Please sign in instead." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        plan: "FREE",
        // firstName and lastName can be stored here when schema is updated
      },
    })

    // Return only serializable data - don't return user object
    return { success: true }
  } catch (error: any) {
    console.error("Signup error:", error)
    
    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      return { error: "Email already registered. Please sign in instead." }
    }
    
    // Handle database connection errors
    if (error.message?.includes("Can't reach database") || error.message?.includes("connection")) {
      return { error: "Database connection failed. Please try again later." }
    }
    
    // Handle other Prisma errors
    if (error.code?.startsWith("P")) {
      return { error: "Database error occurred. Please try again." }
    }
    
    // Generic error
    return { error: error.message || "Failed to create account. Please try again." }
  }
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { error: "Invalid credentials" }
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return { error: "Invalid credentials" }
  }

  return { success: true }
}

