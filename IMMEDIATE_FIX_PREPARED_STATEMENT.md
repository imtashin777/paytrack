# 🚨 IMMEDIATE FIX: Prepared Statement Error

## The Problem
Error: `prepared statement "s2" already exists`

This happens because **Supabase pooler (pgbouncer) doesn't support prepared statements** that Prisma uses.

## ✅ SOLUTION: Use Direct Connection for Local Development

### Step 1: Get Your Direct Connection String

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**
3. Scroll to **Connection string**
4. Select **URI** (NOT "Session Mode" or "Transaction Mode")
5. Copy the connection string

It should look like:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**OR better yet, use the direct connection:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### Step 2: Update Your `.env` File

**Open `.env` in your project root** and update `DATABASE_URL`:

```env
# Use DIRECT connection (port 5432) - NOT pooler (port 6543)
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres"

# Keep these as they are
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

**Important:** 
- Use `db.[PROJECT].supabase.co` (NOT `pooler.supabase.com`)
- Use port `5432` (NOT `6543`)
- This is the DIRECT connection, not the pooler

### Step 3: Regenerate Prisma Client

```bash
npx prisma generate
```

### Step 4: Restart Dev Server

1. Stop current server (Ctrl+C)
2. Run:
   ```bash
   npm run dev
   ```

### Step 5: Try Signing Up Again

The error should be gone! ✅

---

## 🔄 For Production (Vercel)

**Use pooler connection** in Vercel environment variables:
```
postgresql://postgres:[PASSWORD]@[PROJECT].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**Why different?**
- **Local Dev:** Direct connection (5432) = no pooling issues
- **Vercel:** Pooler connection (6543) = better for serverless

---

## 📝 Quick Check

After updating `.env`, verify:
- ✅ `DATABASE_URL` uses `db.` not `pooler.`
- ✅ Port is `5432` not `6543`
- ✅ Ran `npx prisma generate`
- ✅ Restarted server

**This will fix the error immediately!** 🚀


