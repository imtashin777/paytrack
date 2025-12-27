"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function signUp(email: string, password: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new Error("Email already registered. Please sign in instead.")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        plan: "FREE",
      },
    })

    return user
  } catch (error: any) {
    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      throw new Error("Email already registered. Please sign in instead.")
    }
    throw error
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

