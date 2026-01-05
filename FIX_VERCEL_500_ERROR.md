# 🔴 FIX: Vercel 500 Error - Server Configuration Problem

## The Problem
You're seeing: "Error: There is a problem with the server configuration."

This means **environment variables are missing** in Vercel.

---

## ✅ SOLUTION: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Click on your **paytrack** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These 3 Variables

#### 1. NEXTAUTH_SECRET (REQUIRED)
**Generate a secret:**
- Option A: Run in terminal:
  ```bash
  openssl rand -base64 32
  ```
- Option B: Visit: https://generate-secret.vercel.app/32

**Add in Vercel:**
- Key: `NEXTAUTH_SECRET`
- Value: (paste the generated secret - must be 32+ characters)
- Environment: Select **Production**, **Preview**, and **Development**

#### 2. NEXTAUTH_URL (REQUIRED)
**Add in Vercel:**
- Key: `NEXTAUTH_URL`
- Value: `https://paytrack-phi.vercel.app` (or your actual Vercel URL)
- Environment: Select **Production**, **Preview**, and **Development**

#### 3. DATABASE_URL (REQUIRED)
**Add in Vercel:**
- Key: `DATABASE_URL`
- Value: Your PostgreSQL connection string
  - For Supabase: `postgresql://postgres:[PASSWORD]@[PROJECT].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
  - Make sure to use **port 6543** (pooler mode) for Supabase
- Environment: Select **Production**, **Preview**, and **Development**

---

## 🚀 After Adding Variables

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the **three dots (...)** on your latest deployment
3. Click **Redeploy**
4. Or just push a new commit to trigger redeploy

### Step 4: Push Database Schema (If Not Done)
After redeploy, you need to run:
```bash
npx prisma db push
```

Or add this to your Vercel build command:
```
npm run db:push && npm run build
```

---

## ✅ Quick Checklist

Before redeploying, make sure:
- [ ] `NEXTAUTH_SECRET` is added (32+ characters)
- [ ] `NEXTAUTH_URL` is added (your Vercel URL)
- [ ] `DATABASE_URL` is added (correct connection string)
- [ ] All variables are enabled for Production environment

---

## 🔍 Verify It's Fixed

After redeploy:
1. Visit your Vercel URL: `https://paytrack-phi.vercel.app`
2. Should see landing page (not 500 error)
3. Try `/auth/signup` - should work
4. Check Vercel logs - no more 500 errors

---

## 🐛 Still Getting Errors?

### If still seeing 500 errors:

1. **Check Vercel Logs:**
   - Go to **Logs** tab in Vercel
   - Look for specific error messages
   - Check if it's still about missing `NEXTAUTH_SECRET`

2. **Verify Variables:**
   - Make sure variable names are EXACTLY as shown (case-sensitive)
   - Make sure they're enabled for Production environment
   - Check for typos in values

3. **Database Connection:**
   - Verify `DATABASE_URL` is correct
   - For Supabase: Make sure using port 6543 (pooler)
   - Test connection locally first

4. **Clear Cache:**
   - Sometimes Vercel caches old config
   - Create a new deployment (push a small change)

---

## 📞 Need Help?

If errors persist, check:
- Vercel deployment logs for specific error
- Make sure all environment variables are set
- Verify database is accessible from Vercel
- Check that Prisma schema is pushed to database

**The error should be fixed once all 3 environment variables are added!** ✅




