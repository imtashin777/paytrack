# ✅ Resend API Key Setup Complete

## 🔑 Your Resend API Key

**API Key:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`

## 📝 Setup Instructions

### **Method 1: Supabase Dashboard (Recommended - No CLI needed)**

1. **Go to Supabase Dashboard:**
   - Visit: https://app.supabase.com
   - Select your project

2. **Navigate to Secrets:**
   - Click: **Settings** (left sidebar)
   - Click: **Edge Functions**
   - Click: **Secrets** tab

3. **Add Secret:**
   - Click: **"Add Secret"** or **"New Secret"** button
   - Enter:
     - **Name:** `RESEND_API_KEY`
     - **Value:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`
   - Click: **"Save"** or **"Add Secret"**

4. **Add Optional Secrets (Recommended):**
   - **Name:** `FROM_EMAIL` (⚠️ NOT `SUPABASE_FROM_EMAIL` - prefix is reserved)
   - **Value:** `send@brnnd.com`
   - **Name:** `FROM_NAME` (⚠️ NOT `SUPABASE_FROM_NAME` - prefix is reserved)
   - **Value:** `brnnd`
   
   **Important:** Supabase reserves the `SUPABASE_` prefix for system secrets. Use `FROM_EMAIL` and `FROM_NAME` instead.

5. **Deploy Edge Function:**
   - Go to: **Edge Functions** (left sidebar)
   - Click: **"Deploy Function"** or upload the function
   - Or use CLI (see Method 2)

### **Method 2: Using Supabase CLI**

**Step 1: Install Supabase CLI**
```bash
npm install -g supabase
```

**Step 2: Login**
```bash
supabase login
```

**Step 3: Link Project**
```bash
# Get project-ref from Supabase Dashboard → Settings → General
supabase link --project-ref your-project-ref
```

**Step 4: Set Secrets**
```bash
supabase secrets set RESEND_API_KEY=re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7
supabase secrets set FROM_EMAIL=send@brnnd.com
supabase secrets set FROM_NAME=brnnd
```

⚠️ **Important:** Do NOT use `SUPABASE_` prefix - it's reserved by Supabase. Use `FROM_EMAIL` and `FROM_NAME` instead.

**Step 5: Deploy Function**
```bash
supabase functions deploy send-invoice-email
```

Or use the provided PowerShell script:
```powershell
.\setup-resend-key.ps1
```

## ✅ Verification

1. **Check Secrets:**
   - Go to: **Settings → Edge Functions → Secrets**
   - You should see `RESEND_API_KEY` listed (value masked)

2. **Test Email:**
   - Go to: `/settings` in your app
   - Click: **"Send Test Email"** button
   - Check your inbox!

3. **Create Invoice:**
   - Create a new invoice
   - Email will be sent automatically
   - Check invoice detail page for `emailSent` status

## 🎉 What Happens Now

Once configured, **ALL invoices will automatically send emails** when created!

- ✅ Invoice created → Email sent automatically
- ✅ Email sent via Resend API (`re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`)
- ✅ Using your configured SMTP (`smtp.resend.com`)
- ✅ From: `brnnd <send@brnnd.com>`
- ✅ Status tracked: `emailSent`, `emailSentAt`

## 📋 Quick Checklist

- [ ] Added `RESEND_API_KEY` secret in Supabase Dashboard
- [ ] Set `SUPABASE_FROM_EMAIL` (optional: `send@brnnd.com`)
- [ ] Set `SUPABASE_FROM_NAME` (optional: `brnnd`)
- [ ] Deployed Edge Function: `send-invoice-email`
- [ ] Tested email from `/settings` page
- [ ] Created test invoice to verify automatic sending

## 🔗 Direct Links

- **Supabase Dashboard:** https://app.supabase.com
- **Edge Functions Secrets:** https://app.supabase.com/project/_/settings/functions
- **Resend API Keys:** https://resend.com/api-keys

---

**Your API Key:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`

**Status:** Ready to configure in Supabase! ✅

