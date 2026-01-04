# 🚀 Quick Setup - Resend API Key

## ✅ Your Resend API Key

**API Key:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`

## 📝 Setup Steps

### Option 1: Using Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard:**
   - Visit: https://app.supabase.com
   - Select your project

2. **Add Secret:**
   - Navigate to: **Settings → Edge Functions → Secrets**
   - Click **"Add Secret"** or **"New Secret"**
   - Enter:
     - **Name:** `RESEND_API_KEY`
     - **Value:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`
   - Click **"Save"** or **"Add Secret"**

3. **Set Optional Secrets (Optional but Recommended):**
   - **Name:** `SUPABASE_FROM_EMAIL`
   - **Value:** `send@brnnd.com`
   - **Name:** `SUPABASE_FROM_NAME`
   - **Value:** `brnnd`

4. **Deploy Edge Function:**
   - Go to: **Edge Functions**
   - Click **"Deploy"** or use CLI:
     ```bash
     supabase functions deploy send-invoice-email
     ```

### Option 2: Using Supabase CLI

**Quick Commands:**

```bash
# 1. Install Supabase CLI (if not installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link your project (get project-ref from Supabase Dashboard → Settings → General)
supabase link --project-ref your-project-ref

# 4. Set Resend API Key Secret
supabase secrets set RESEND_API_KEY=re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7

# 5. Set sender email (optional)
supabase secrets set SUPABASE_FROM_EMAIL=send@brnnd.com

# 6. Set sender name (optional)
supabase secrets set SUPABASE_FROM_NAME=brnnd

# 7. Deploy Edge Function
supabase functions deploy send-invoice-email
```

## ✅ Verify Setup

1. **Check Secrets in Dashboard:**
   - Go to: **Settings → Edge Functions → Secrets**
   - You should see `RESEND_API_KEY` listed (value will be masked)

2. **Check Edge Function:**
   - Go to: **Edge Functions**
   - You should see `send-invoice-email` listed

3. **Test Email:**
   - Go to `/settings` in your app
   - Click **"Send Test Email"** button
   - Check your inbox!

## 🎉 After Setup

Once configured, **ALL invoices will automatically send emails** when created!

- ✅ Invoice created → Email sent automatically
- ✅ Email sent via Resend API (using your configured service)
- ✅ Status tracked in database (`emailSent`, `emailSentAt`)
- ✅ Professional HTML email template

## 🔒 Security

- ✅ API key stored securely in Supabase secrets
- ✅ Never exposed to client-side code
- ✅ Encrypted in Supabase database
- ✅ Only accessible from Edge Functions

## 📋 Checklist

- [ ] Added `RESEND_API_KEY` to Supabase Edge Function secrets
- [ ] Set `SUPABASE_FROM_EMAIL` (optional: `send@brnnd.com`)
- [ ] Set `SUPABASE_FROM_NAME` (optional: `brnnd`)
- [ ] Deployed Edge Function: `send-invoice-email`
- [ ] Tested email sending from `/settings` page
- [ ] Created test invoice to verify automatic email sending

---

**Your Resend API Key:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`

**Next Step:** Add this to Supabase Edge Function secrets!

**Dashboard Link:** https://app.supabase.com → Your Project → Settings → Edge Functions → Secrets

