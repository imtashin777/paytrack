# 🔧 Fix: Prisma "prepared statement already exists" Error

## The Problem
Error: `prepared statement "s0" already exists`

This happens when using Supabase connection pooler with Prisma. The pooler doesn't support prepared statements well.

## ✅ Solution 1: Use Direct Connection (Recommended for Development)

Instead of using the pooler connection string, use the **direct connection** string from Supabase:

1. Go to Supabase Dashboard → Settings → Database
2. Find **Connection string** → **URI** (NOT Session Mode)
3. Use that connection string in your `.env`

**Direct connection format:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

**NOT the pooler:**
```
postgresql://postgres:[PASSWORD]@[PROJECT].pooler.supabase.com:6543/postgres
```

## ✅ Solution 2: Fix Pooler Connection (For Production)

If you must use the pooler, ensure your `DATABASE_URL` includes these parameters:

```
postgresql://postgres:[PASSWORD]@[PROJECT].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

The code has been updated to automatically add these parameters.

## ✅ Solution 3: Restart Server

After fixing the connection string:

1. **Stop the server** (Ctrl+C)
2. **Clear Prisma cache:**
   ```bash
   npx prisma generate
   ```
3. **Restart server:**
   ```bash
   npm run dev
   ```

## 🔍 Quick Check

**For Development (Local):**
- Use **direct connection** (port 5432)
- Faster, no pooling issues

**For Production (Vercel):**
- Use **pooler connection** (port 6543) 
- Better for serverless, handles connections better
- Make sure `pgbouncer=true&connection_limit=1` is in URL

## 📝 Updated Files

- ✅ `lib/prisma.ts` - Auto-adds pooler params
- ✅ `prisma/schema.prisma` - Updated generator config

**Try signing up again after restarting the server!** ✅


