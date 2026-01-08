# 🚀 Deploy Edge Function - Choose Your Method

## ✅ Secrets Already Configured

Your secrets are all set:
- ✅ `RESEND_API_KEY` - Added (Jan 4, 2026)
- ✅ `FROM_EMAIL` - Added (Jan 4, 2026 14:15:54)
- ✅ `FROM_NAME` - Added (Jan 4, 2026 14:16:40)

## 📦 Method 1: Deploy via Supabase Dashboard (Easiest)

### Step 1: Go to Edge Functions
1. Visit: [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click: **Edge Functions** (left sidebar)

### Step 2: Create/Deploy Function
1. Click: **"Create Function"** or **"New Function"**
2. Function Name: `send-invoice-email`
3. Copy the code from: `supabase/functions/send-invoice-email/index.ts`
4. Paste into the editor
5. Click: **"Deploy"** or **"Save"**

**OR**

If the function already exists:
1. Click on `send-invoice-email` function
2. Replace code with: `supabase/functions/send-invoice-email/index.ts`
3. Click: **"Deploy"**

---

## 💻 Method 2: Deploy via CLI (Faster for updates)

### Step 1: Install Supabase CLI
```powershell
npm install -g supabase
```

### Step 2: Login
```powershell
supabase login
```
(This opens browser for authentication)

### Step 3: Link Project
```powershell
# Get project-ref from Supabase Dashboard → Settings → General
supabase link --project-ref your-project-ref
```

### Step 4: Deploy Function
```powershell
supabase functions deploy send-invoice-email
```

---

## ✅ After Deployment

### Test Email Sending:
1. Go to: `/settings` in your app
2. Click: **"Send Test Email"** button
3. Check your inbox!

### Create Test Invoice:
1. Go to: `/invoices/new`
2. Create an invoice
3. Email will be sent **automatically**! ✨

---

## 🎯 Quick Checklist

- [x] Secrets configured (`RESEND_API_KEY`, `FROM_EMAIL`, `FROM_NAME`)
- [ ] Edge Function deployed (`send-invoice-email`)
- [ ] Test email sent from `/settings` page
- [ ] Test invoice created and email received

---

## 📝 Function Code Location

The Edge Function code is ready at:
**`supabase/functions/send-invoice-email/index.ts`**

Just copy-paste this into Supabase Dashboard or deploy via CLI!

---

**Status:** Secrets ✅ Ready | Function 🔄 Ready to Deploy





