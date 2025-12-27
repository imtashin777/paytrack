# Use Session Pooler Connection

## The Issue
The "Direct connection" shows an IPv4 compatibility warning. You need to use **Session Pooler** instead.

## Quick Fix (2 Steps)

### Step 1: Change to Session Pooler

In the modal you're seeing:

1. Look at the **"Method"** dropdown (currently shows "Direct connection")
2. Click the dropdown and select **"Session Pooler"** or **"Connection Pooling"**
3. The connection string will automatically update

OR

1. Click the **"Pooler settings"** button (next to the IPv4 warning)
2. This will show you the pooler connection string

### Step 2: Copy the Connection String

After changing to Session Pooler, you'll see a connection string like:
```
postgresql://postgres.kjjnprsuwvlphjlijavq:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Key differences:**
- Uses `pooler.supabase.com` (not `db.kjjnprsuwvlphjlijavq.supabase.co`)
- Uses port `6543` (not `5432`)
- Has `.kjjnprsuwvlphjlijavq` after `postgres.`

**Copy this connection string!**

### Step 3: Update .env File

1. Your `.env` file is open
2. Replace the `DATABASE_URL` line with the pooler connection string
3. Make sure to replace `[YOUR-PASSWORD]` with your actual password: `zy4Vny9DMBfW*wF`
4. Save the file

### Step 4: Test Connection

```bash
npx prisma db push
```

---

## What You Should See

After switching to Session Pooler:
- ✅ No IPv4 warning
- ✅ Connection string with `pooler.supabase.com:6543`
- ✅ Works with IPv4 networks

---

## Quick Action

1. **Change "Method" dropdown** → Select "Session Pooler"
2. **Copy the connection string** (replace [YOUR-PASSWORD] with your password)
3. **Update .env file**
4. **Run:** `npx prisma db push`




