"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getClients() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return clients
}

export async function getClient(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const client = await prisma.client.findFirst({
    where: { id, userId: session.user.id },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!client) {
    throw new Error("Client not found")
  }

  return client
}

export async function createClient(name: string, email: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const client = await prisma.client.create({
    data: {
      userId: session.user.id,
      name,
      email,
    },
  })

  revalidatePath("/clients")
  revalidatePath("/dashboard")

  return client
}







