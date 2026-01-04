# 🔍 Check Database Connection Status

## Current Issue
Can't reach database server at `db.kjjnprsuwvlphjlijavq.supabase.co:5432`

## ✅ Quick Checks

### 1. Check Supabase Project Status

Go to: https://supabase.com/dashboard/project/kjjnprsuwvlphjlijavq

**Verify:**
- ✅ Is the project **Active**? (Not paused)
- ✅ Does it show "Healthy" status?
- ✅ Can you see the dashboard?

**If paused:** Click "Resume" and wait 1-2 minutes

### 2. Check Connection String Format

Your connection string should be one of these formats:

**Option A: Direct Connection (Recommended for Dev)**
```
postgresql://postgres:[PASSWORD]@db.kjjnprsuwvlphjlijavq.supabase.co:5432/postgres
```

**Option B: Pooler Connection (For Production)**
```
postgresql://postgres.kjjnprsuwvlphjlijavq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### 3. Verify in Supabase Dashboard

1. Go to Supabase Dashboard → Settings → Database
2. Look at **Connection string** section
3. Try **URI** tab (direct connection)
4. Try **Connection pooling** → **Session** mode tab

### 4. Test Connection

Try this in terminal:
```bash
npx prisma db push
```

If it fails, the database might be:
- Paused
- Network blocked
- Wrong credentials

## 🔧 Quick Fix

**If project is paused:**
1. Resume it in Supabase dashboard
2. Wait 2 minutes
3. Try again

**If connection string is wrong:**
1. Copy the exact string from Supabase Dashboard
2. Update `.env` file
3. Restart server

Let me know what you see in Supabase dashboard! 🔍



