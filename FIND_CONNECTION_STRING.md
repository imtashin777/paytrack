# Find Connection String in Supabase

## You're on Database Settings - Now Get Connection String

### Step 1: Go to Connection String Section

From where you are (Database Settings page):

**Option A: Look for "Connection string" link**
- On the Database Settings page, look for a link or button that says **"Connection string"** or **"Connection info"**
- It might be at the top of the page or in a sidebar

**Option B: Go to Database Overview**
1. Click **"Database"** in the left sidebar (the database icon, not Settings)
2. This should take you to the Database overview page
3. Look for **"Connection string"** section on that page

**Option C: Direct Path**
1. In the left sidebar, click **"Database"** (main database icon)
2. You should see tabs or sections like:
   - Overview
   - Tables
   - Functions
   - **Connection string** ← Look for this!

### Step 2: Get the Connection String

Once you find the "Connection string" section:

1. You'll see multiple connection options:
   - **URI** (Direct connection)
   - **JDBC**
   - **Connection pooling** ← **Use this one!**

2. Click on **"Connection pooling"** tab

3. Select **"Session"** mode (not Transaction)

4. You'll see a connection string that looks like:
   ```
   postgresql://postgres.kjjnprsuwvlphjlijavq:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

5. **Copy this entire string**

### Step 3: Update .env File

1. Your `.env` file is already open
2. Find the line: `DATABASE_URL="..."`
3. Replace everything between the quotes with the connection string you copied
4. **Important:** The connection string should include `pooler.supabase.com:6543` (not the direct `db.kjjnprsuwvlphjlijavq.supabase.co:5432`)
5. Save the file

### Step 4: Test Connection

Run:
```bash
npx prisma db push
```

---

## Quick Visual Guide

**What to look for:**
- Connection string section usually shows:
  - Multiple tabs: URI | JDBC | Connection pooling
  - A text box with the connection string
  - A "Copy" button next to it

**The connection string should:**
- Start with `postgresql://`
- Include `pooler.supabase.com` (for connection pooling)
- Have port `6543` (for pooler) or `5432` (for direct)
- Include your project reference: `kjjnprsuwvlphjlijavq`

---

## Alternative: Use Direct Connection

If you can't find Connection Pooling, use the **URI** tab:
- Copy that connection string
- It should work, but pooler is more reliable













