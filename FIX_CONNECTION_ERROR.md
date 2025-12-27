# Fix Connection Error - Quick Fix

## The Problem
The server can't connect because the `.env` file is missing.

## Solution (2 Steps)

### Step 1: Create `.env` File

Create a file named `.env` in the root folder (same folder as `package.json`) with this content:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/paytrack?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paytrack-secret-key-12345"
```

**Important:** 
- If you're using **Supabase**, replace `DATABASE_URL` with your Supabase connection string
- If you don't have a database yet, the app will still start but you'll get database errors when trying to sign up

### Step 2: Restart the Server

1. **Stop the current server** (Press `Ctrl+C` in the terminal)
2. **Run these commands:**
   ```bash
   npx prisma generate
   npm run dev
   ```

## Quick Database Setup (Supabase - Free)

1. Go to https://supabase.com
2. Sign up (free account)
3. Create new project
4. Wait 2 minutes for project to be ready
5. Go to **Settings** → **Database**
6. Scroll to **Connection string** → **URI**
7. Copy the connection string
8. Paste it as `DATABASE_URL` in your `.env` file

Example Supabase URL format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

## After Fixing

1. The server should start successfully
2. Go to http://localhost:3000
3. You should see the sign-in page
4. Click "Sign Up" to create your first account

---

**Note:** If you see database errors after creating the `.env` file, you need to set up your database first (see Supabase steps above).




