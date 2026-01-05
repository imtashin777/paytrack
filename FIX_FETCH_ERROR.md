# 🔧 Fix "fetch failed" Error

## ❌ Problem

When clicking "Send Test Email", you see a "fetch failed" error. This is because the Edge Function URL cannot be reached.

## ✅ Solution: Set Environment Variables

You need to add these environment variables to your Next.js app:

### **Required Environment Variables:**

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - Get from: Supabase Dashboard → Settings → API → Project URL
   - Example: `https://xxxxx.supabase.co`

2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - Get from: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📝 How to Add

### **If Running Locally:**

1. **Create/Edit `.env.local` file:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

### **If Deployed on Vercel:**

1. **Go to Vercel Dashboard:**
   - Visit: [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Add Environment Variables:**
   - Go to: **Settings** → **Environment Variables**
   - Click: **"Add New"**
   - Add:
     - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
     - **Value:** `https://xxxxx.supabase.co` (your Supabase project URL)
     - **Environment:** Production, Preview, Development (select all)
   - Click: **"Save"**
   
   - **Add Second Variable:**
     - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **Value:** Your Supabase anon key (from Supabase Dashboard)
     - **Environment:** Production, Preview, Development (select all)
     - Click: **"Save"**

3. **Redeploy:**
   - Go to: **Deployments** tab
   - Click: **"..."** (three dots) on latest deployment
   - Click: **"Redeploy"**

## 🔍 How to Get Supabase URL and Key

1. **Go to Supabase Dashboard:**
   - Visit: [app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Get Project URL:**
   - Go to: **Settings** → **API**
   - Copy: **Project URL** (under "Project URL")
   - Example: `https://xxxxxxxxxxxxx.supabase.co`

3. **Get Anon Key:**
   - Same page: **Settings** → **API**
   - Under **"Project API keys"**
   - Copy: **`anon` `public`** key (starts with `eyJhbG...`)
   - ⚠️ **DO NOT** use `service_role` key (it's secret!)

## ✅ Verification

After setting environment variables:

1. **Restart server** (if local) or **redeploy** (if Vercel)
2. **Go to:** `/settings` page
3. **Click:** "Send Test Email"
4. **Should work!** ✅

## 🔗 Quick Links

- **Supabase Dashboard:** [app.supabase.com](https://app.supabase.com) → Settings → API
- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard) → Settings → Environment Variables

---

**After adding these variables, the "fetch failed" error will be fixed!** ✅


