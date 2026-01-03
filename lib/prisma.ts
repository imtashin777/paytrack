import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Fix for Supabase connection - convert pooler to direct connection for local dev
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error("⚠️ DATABASE_URL is not set in environment variables")
  if (process.env.NODE_ENV === "development") {
    throw new Error("DATABASE_URL is required. Please add it to your .env file")
  }
}

let fixedDatabaseUrl = databaseUrl

// For pooler connections, ensure proper parameters are set
if (databaseUrl?.includes('pooler.supabase.com')) {
  // Ensure port is 6543 (not 5432)
  fixedDatabaseUrl = databaseUrl.replace(/pooler\.supabase\.com:5432/, 'pooler.supabase.com:6543')
  fixedDatabaseUrl = fixedDatabaseUrl.replace(/:5432\//, ':6543/')
  
  // Remove any existing query params to rebuild them
  const urlParts = fixedDatabaseUrl.split('?')
  const baseUrl = urlParts[0]
  const existingParams = urlParts[1] ? new URLSearchParams(urlParts[1]) : new URLSearchParams()
  
  // Set required pooler parameters
  existingParams.set('pgbouncer', 'true')
  existingParams.set('connection_limit', '1')
  
  // Reconstruct URL with proper params
  fixedDatabaseUrl = baseUrl + '?' + existingParams.toString()
}

// For production with pooler, ensure correct params
if (process.env.NODE_ENV === "production" && databaseUrl?.includes('pooler.supabase.com')) {
  // Replace port 5432 with 6543 for pooler connections
  fixedDatabaseUrl = databaseUrl.replace(/pooler\.supabase\.com:5432/, 'pooler.supabase.com:6543')
  fixedDatabaseUrl = fixedDatabaseUrl.replace(/:5432\//, ':6543/')
  
  // Ensure pgbouncer params are in the URL
  if (!fixedDatabaseUrl?.includes('pgbouncer=true')) {
    fixedDatabaseUrl = fixedDatabaseUrl + (fixedDatabaseUrl.includes('?') ? '&' : '?') + 'pgbouncer=true&connection_limit=1'
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
    datasources: {
      db: {
        url: fixedDatabaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

