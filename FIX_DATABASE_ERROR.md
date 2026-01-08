# 🔧 Fix DATABASE_URL Error

## The Problem
The error shows: `Environment variable not found: DATABASE_URL`

This means the server needs to be restarted OR you need to set up a database.

## Quick Fix (2 Options)

### Option 1: Set Up Supabase Database (5 minutes - Recommended)

**Step 1: Create Supabase Account**
1. Go to https://supabase.com
2. Click "Start your project" (free)
3. Sign up with GitHub/Google/Email

**Step 2: Create Project**
1. Click "New Project"
2. Choose organization (or create one)
3. Fill in:
   - **Name**: PayTrack (or any name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait 2 minutes for setup

**Step 3: Get Connection String**
1. Go to **Settings** (gear icon in sidebar)
2. Click **Database**
3. Scroll to **Connection string** section
4. Find **URI** (not JDBC or other)
5. Copy the connection string

It looks like:
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Step 4: Update .env File**
1. Open `.env` file in your project
2. Replace the `DATABASE_URL` line with your Supabase connection string
3. Save the file

**Step 5: Initialize Database**
```bash
npx prisma db push
```

**Step 6: Restart Server**
- Stop server (Ctrl+C)
- Start again: `npm run dev`

### Option 2: Use Local PostgreSQL (If you have it installed)

1. Make sure PostgreSQL is running
2. Create database:
   ```sql
   CREATE DATABASE paytrack;
   ```
3. Update `.env` file with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/paytrack?schema=public"
   ```
4. Run: `npx prisma db push`
5. Restart server

---

## After Fixing

1. ✅ Server should start without errors
2. ✅ Go to http://localhost:3000/auth/signup
3. ✅ Fill in the form and click "Sign Up"
4. ✅ You should be redirected to dashboard!

---

## Still Having Issues?

**Make sure:**
- ✅ `.env` file is in the root folder (same as `package.json`)
- ✅ No extra spaces in `DATABASE_URL`
- ✅ Server was restarted after changing `.env`
- ✅ Database connection string is correct

**Test your connection string:**
- Supabase: Should start with `postgresql://postgres.`
- Local: Should start with `postgresql://`











