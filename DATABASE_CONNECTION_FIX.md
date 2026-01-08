# 🔧 Database Connection Fix

## Current Error
"Can't reach database server at `db.aws-1-ap-south-1.supabase.co:5432`"

## Problem
The auto-conversion from pooler to direct connection is failing because `aws-1-ap-south-1` is not the project reference - it's just the pooler hostname.

## ✅ Solution: Use Direct Connection String

You need to get the **actual direct connection string** from Supabase:

### Step 1: Get Direct Connection String

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**  
3. Scroll to **Connection string** section
4. Look for **"URI"** (NOT "Session Mode" or "Transaction Mode")
5. Copy that connection string

It should look like:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**OR the direct connection:**
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### Step 2: Update .env File

Open `.env` in your project root and update:

```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres"
```

**Important:**
- Use the connection string from Supabase Dashboard
- Make sure it has `db.` and port `5432`
- NOT the pooler connection (port 6543)

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Alternative: Keep Pooler But Fix It

If you must use pooler, update `.env` to include proper params:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

But **direct connection works better for local development!** ✅





