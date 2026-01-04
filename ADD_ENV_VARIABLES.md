# 🔧 Fix "fetch failed" - Add Missing Environment Variables

## ❌ Problem

The "fetch failed" error happens because your Next.js app doesn't know where your Supabase project is.

## ✅ Solution: Add 2 Environment Variables

### **Step 1: Get Values from Supabase**

1. **Go to Supabase Dashboard:**
   - Visit: [app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Get Project URL:**
   - Go to: **Settings** → **API**
   - Copy: **Project URL** (looks like `https://xxxxx.supabase.co`)

3. **Get Anon Key:**
   - Same page: **Settings** → **API**
   - Under **"Project API keys"**
   - Copy: **`anon` `public`** key (starts with `eyJhbG...`)
   - ⚠️ **DO NOT** use `service_role` key (it's secret!)

### **Step 2: Add to Your App**

#### **If Running Locally:**

1. **Create `.env.local` file** in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

#### **If Deployed on Vercel:**

1. **Go to Vercel Dashboard:**
   - Visit: [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project (`invoice` or `paytrack`)

2. **Add Environment Variables:**
   - Go to: **Settings** → **Environment Variables**
   - Click: **"Add New"**
   
   **Add First Variable:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://xxxxx.supabase.co` (paste your Supabase URL)
   - **Environment:** ✅ Production ✅ Preview ✅ Development (check all)
   - Click: **"Save"**
   
   **Add Second Variable:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbG...` (paste your anon key)
   - **Environment:** ✅ Production ✅ Preview ✅ Development (check all)
   - Click: **"Save"**

3. **Redeploy:**
   - Go to: **Deployments** tab
   - Click: **"..."** (three dots) on latest deployment
   - Click: **"Redeploy"**
   - Wait for deployment to complete (~1-2 minutes)

### **Step 3: Test Again**

1. **Go to:** `/settings` page
2. **Click:** "Send Test Email"
3. **Should work!** ✅ No more "fetch failed" error!

## 📋 Quick Checklist

- [ ] Got Supabase URL from Settings → API
- [ ] Got Supabase Anon Key from Settings → API
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to environment variables
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to environment variables
- [ ] Redeployed (if on Vercel) or restarted dev server (if local)
- [ ] Tested "Send Test Email" button

## 🔗 Direct Links

- **Supabase API Settings:** [app.supabase.com](https://app.supabase.com) → Your Project → Settings → API
- **Vercel Environment Variables:** [vercel.com/dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

---

**After adding these 2 variables, everything will work!** ✅

