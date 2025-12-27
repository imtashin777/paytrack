# Supabase Database Setup - Step by Step

## Get the Correct Connection String

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `kjjnprsuwvlphjlijavq`

### Step 2: Get Connection String
1. Click **Settings** (gear icon) in the left sidebar
2. Click **Database** in the settings menu
3. Scroll down to **Connection string** section
4. You'll see multiple options - use **URI** (not JDBC or other formats)

### Step 3: Copy the Correct Format

You should see something like:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Important:** 
- Make sure you're copying the **URI** format
- The password should be your database password (the one you set when creating the project)
- If the password has special characters, they might need to be URL-encoded

### Step 4: Update .env File

1. Open `.env` file in your project
2. Replace the `DATABASE_URL` line with the connection string from Supabase
3. Make sure it looks like this format:
   ```
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
   ```

### Step 5: Test Connection

Run this command:
```bash
npx prisma db push
```

If it works, you'll see:
```
✅ Your database is now in sync with your Prisma schema
```

---

## Alternative: Use Transaction Mode (More Reliable)

If the pooler doesn't work, try the **Transaction** mode connection string from Supabase:

1. In Supabase Settings → Database
2. Look for **Connection string** → **Transaction** mode
3. Copy that connection string
4. Update `.env` file

---

## Troubleshooting

### "Can't reach database server"
- Check if your Supabase project is active (not paused)
- Verify the connection string is correct
- Try the Transaction mode connection string instead

### "Tenant or user not found"
- Make sure you're using the correct project reference
- Verify the password is correct
- Try resetting your database password in Supabase

### "Connection timeout"
- Check your internet connection
- Verify Supabase project is not paused
- Try using the direct connection (port 5432) instead of pooler (port 6543)

---

## Quick Test

After updating `.env`, test with:
```bash
npx prisma db push
```

If successful, restart your server:
```bash
npm run dev
```

Then try signing up at: http://localhost:3000/auth/signup




