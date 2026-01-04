"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getUserSMTP() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    // Use Prisma client - model name is UserSMTP, accessed as userSMTP
    const userSMTP = await (prisma as any).userSMTP.findUnique({
      where: { userId: session.user.id },
    })
    return userSMTP
  } catch (error: any) {
    // If model doesn't exist yet (Prisma not regenerated), return null
    if (error.message?.includes("userSMTP") || error.message?.includes("Unknown arg")) {
      return null
    }
    throw error
  }
}

export async function saveUserSMTP(data: {
  host: string
  port: number
  username: string
  password: string
  fromEmail: string
  fromName?: string
  useCustom: boolean
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    // Use Prisma client - model name is UserSMTP, accessed as userSMTP
    const userSMTP = await (prisma as any).userSMTP.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        host: data.host,
        port: data.port,
        username: data.username,
        password: data.password, // In production, encrypt this
        fromEmail: data.fromEmail,
        fromName: data.fromName || null,
        useCustom: data.useCustom,
      },
      update: {
        host: data.host,
        port: data.port,
        username: data.username,
        password: data.password, // In production, encrypt this
        fromEmail: data.fromEmail,
        fromName: data.fromName || null,
        useCustom: data.useCustom,
      },
    })
    revalidatePath("/settings")
    return userSMTP
  } catch (error: any) {
    if (error.message?.includes("userSMTP") || error.message?.includes("Unknown arg")) {
      throw new Error("SMTP model not available. Please restart your dev server after running 'npx prisma generate'")
    }
    throw new Error(`Failed to save SMTP: ${error.message}`)
  }
}

export async function deleteUserSMTP() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    // Use Prisma client - model name is UserSMTP, accessed as userSMTP
    await (prisma as any).userSMTP.deleteMany({
      where: { userId: session.user.id },
    })
  } catch (error: any) {
    // If model doesn't exist, that's fine - nothing to delete
    if (error.message?.includes("userSMTP") || error.message?.includes("Unknown arg")) {
      // Model not available yet, but that's okay for delete operation
      return { success: true }
    }
    throw error
  }

  revalidatePath("/settings")
  return { success: true }
}

