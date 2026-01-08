# 📋 VERCEL ENVIRONMENT VARIABLES - COPY & PASTE

## 🚀 Quick Setup: Copy these into Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Then add each variable below (one at a time):

---

## ✅ REQUIRED VARIABLES (Add All 5)

### 1. NEXTAUTH_SECRET
**Key:**
```
NEXTAUTH_SECRET
```

**Value:**
```
Rt9O3yF7eVBKV2LwqMT2lsSIzXM95vzydbYE1GjsjeY=
```

**Environment:** ✅ Production ✅ Preview ✅ Development

---

### 2. NEXTAUTH_URL
**Key:**
```
NEXTAUTH_URL
```

**Value:**
```
https://invoice-8njb6jfcc-tashin360s-projects.vercel.app
```
*(Replace with your actual Vercel URL if different)*

**Environment:** ✅ Production ✅ Preview ✅ Development

---

### 3. DATABASE_URL
**Key:**
```
DATABASE_URL
```

**Value:**
```
postgresql://postgres:[YOUR_PASSWORD]@[YOUR_PROJECT].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**⚠️ REPLACE:**
- `[YOUR_PASSWORD]` - Your Supabase database password
- `[YOUR_PROJECT]` - Your Supabase project reference (e.g., `abcdefghijklmnop`)

**How to get this:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Under **Connection string**, select **Session mode** (port 6543)
5. Copy the connection string
6. Make sure it includes `?pgbouncer=true&connection_limit=1`

**Environment:** ✅ Production ✅ Preview ✅ Development

---

### 4. NEXT_PUBLIC_SUPABASE_URL
**Key:**
```
NEXT_PUBLIC_SUPABASE_URL
```

**Value:**
```
https://[YOUR_PROJECT].supabase.co
```

**⚠️ REPLACE:**
- `[YOUR_PROJECT]` - Your Supabase project reference

**How to get this:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL**

**Environment:** ✅ Production ✅ Preview ✅ Development

---

### 5. NEXT_PUBLIC_SUPABASE_ANON_KEY
**Key:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Value:**
```
[YOUR_ANON_KEY]
```

**⚠️ REPLACE:**
- `[YOUR_ANON_KEY]` - Your Supabase anon/public key (starts with `eyJhbG...`)

**How to get this:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Under **Project API keys**, copy the **`anon` `public`** key
5. ⚠️ **DO NOT** use the `service_role` key (it's secret!)

**Environment:** ✅ Production ✅ Preview ✅ Development

---

## 📝 Step-by-Step Instructions

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your project

2. **Open Environment Variables:**
   - Click **Settings** → **Environment Variables**

3. **Add Each Variable:**
   - Click **"Add New"** button
   - Paste the **Key** from above
   - Paste the **Value** from above (replace placeholders)
   - Check all three environments: **Production**, **Preview**, **Development**
   - Click **"Save"**
   - Repeat for all 5 variables

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** (three dots) on latest deployment
   - Click **"Redeploy"**
   - Wait ~1-2 minutes for deployment to complete

---

## ✅ Quick Checklist

After adding all variables, verify:
- [ ] `NEXTAUTH_SECRET` added (32+ characters)
- [ ] `NEXTAUTH_URL` added (your Vercel URL)
- [ ] `DATABASE_URL` added (Supabase pooler connection, port 6543)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` added (your Supabase URL)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` added (anon/public key)
- [ ] All variables enabled for Production, Preview, and Development
- [ ] Redeployed after adding variables

---

## 🔗 Helpful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Generate NEXTAUTH_SECRET:** https://generate-secret.vercel.app/32

---

**After adding all variables and redeploying, your login should work!** ✅

