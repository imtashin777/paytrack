# Get Supabase Connection String - Quick Guide

## You're in the Supabase Dashboard! ✅

Your project is **active** and ready. Now let's get the connection string.

## Step-by-Step:

### 1. Click on "Settings" (Gear Icon)
- Look at the left sidebar
- Click the **Settings** icon (⚙️ gear)

### 2. Click "Database"
- In the settings menu, click **Database**

### 3. Scroll to "Connection string"
- Scroll down until you see **"Connection string"** section
- You'll see multiple tabs: **URI**, **JDBC**, **Connection pooling**

### 4. Get the Connection String

**Option A: Use Connection Pooling (Recommended)**
1. Click the **"Connection pooling"** tab
2. Select **"Session"** mode (not Transaction)
3. Copy the connection string
4. It should look like:
   ```
   postgresql://postgres.kjjnprsuwvlphjlijavq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

**Option B: Use Direct Connection (URI)**
1. Click the **"URI"** tab
2. Copy the connection string
3. It should look like:
   ```
   postgresql://postgres.kjjnprsuwvlphjlijavq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```

### 5. Update Your .env File

1. Open `.env` file in your project
2. Replace the `DATABASE_URL` line with the connection string you copied
3. **Important:** Make sure the password in the connection string matches your database password
4. Save the file

### 6. Initialize Database

Run this command:
```bash
npx prisma db push
```

This will create all the tables (users, clients, invoices) in your Supabase database.

---

## What You Should See

After running `npx prisma db push`, you should see:
- ✅ "Your database is now in sync with your Prisma schema"
- ✅ Tables created: users, clients, invoices

Then in Supabase dashboard → Table Editor, you'll see your tables!

---

## Quick Copy-Paste

Once you have the connection string from Supabase:
1. Open `.env` file
2. Replace this line:
   ```
   DATABASE_URL="your-connection-string-here"
   ```
3. Save
4. Run: `npx prisma db push`







