# 🔄 Restart Server - Quick Guide

## The .env file has been created! ✅

Now you need to restart your development server.

## Steps to Restart:

### 1. Stop Current Server
In your terminal where `npm run dev` is running:
- Press `Ctrl + C` to stop the server

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Start Server Again
```bash
npm run dev
```

### 4. Open Browser
Go to: **http://localhost:3000**

---

## ⚠️ Important: Database Setup

The `.env` file has a placeholder database URL. You need to:

**Option A: Use Supabase (Recommended - Free)**
1. Go to https://supabase.com
2. Sign up and create project
3. Get connection string from Settings → Database
4. Update `DATABASE_URL` in `.env` file

**Option B: Use Local PostgreSQL**
- Make sure PostgreSQL is running
- Update `DATABASE_URL` in `.env` with your credentials

**Option C: Test Without Database (Limited)**
- The app will start but you'll get errors when trying to sign up
- This is just for testing the UI

---

## After Restart

You should see:
- ✅ Server starts without errors
- ✅ Browser connects successfully
- ✅ Sign-in page loads

Then you can:
1. Sign up for an account
2. Add clients
3. Create invoices

---

**If you still see connection errors:**
- Make sure you stopped the old server (Ctrl+C)
- Wait 5 seconds before starting again
- Check that port 3000 is not used by another app









