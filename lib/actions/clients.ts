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
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      // Only include invoice count, not full invoice data (faster)
      _count: {
        select: {
          invoices: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  
  // Map to match expected interface with invoice count
  return clients.map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    createdAt: client.createdAt,
    invoices: Array(client._count.invoices).fill(null), // Array with correct length for compatibility
  }))
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
        select: {
          id: true,
          amount: true,
          status: true,
          dueDate: true,
          createdAt: true,
        },
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









