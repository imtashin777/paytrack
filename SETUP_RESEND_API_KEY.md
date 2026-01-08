# Setup Resend API Key in Supabase

## 🔑 Your Resend API Key

Your Resend API key is: `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`

## ✅ Quick Setup Steps

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard:**
   - Visit [https://app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Add Secret:**
   - Go to **Settings → Edge Functions → Secrets**
   - Click **"Add Secret"**
   - Enter:
     - **Name:** `RESEND_API_KEY`
     - **Value:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`
   - Click **"Save"**

3. **Deploy Edge Function:**
   ```bash
   supabase functions deploy send-invoice-email
   ```

### Option 2: Using Supabase CLI

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link Your Project:**
   ```bash
   # Get project ref from Supabase Dashboard → Settings → General
   supabase link --project-ref your-project-ref
   ```

4. **Set Resend API Key Secret:**
   ```bash
   supabase secrets set RESEND_API_KEY=re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7
   ```

5. **Set Optional Secrets:**
   ```bash
   supabase secrets set SUPABASE_FROM_EMAIL=send@brnnd.com
   supabase secrets set SUPABASE_FROM_NAME=brnnd
   ```

6. **Deploy Edge Function:**
   ```bash
   supabase functions deploy send-invoice-email
   ```

## ✅ Verify Setup

1. **Check Secrets:**
   - Go to Supabase Dashboard → Edge Functions → Secrets
   - Verify `RESEND_API_KEY` is listed (value will be masked)

2. **Check Edge Function:**
   - Go to Supabase Dashboard → Edge Functions
   - Verify `send-invoice-email` is deployed

3. **Test Email:**
   - Go to `/settings` in your app
   - Click "Send Test Email"
   - Check your inbox

## 🎉 After Setup

Once configured, **all invoices will automatically send emails** when created!

- ✅ Invoice created → Email sent automatically
- ✅ Email sent via Resend API (using your configured SMTP)
- ✅ Status tracked in database (`emailSent`, `emailSentAt`)
- ✅ Professional HTML email template

## 🔒 Security Notes

- API key is stored securely in Supabase secrets
- Never commit API keys to git
- Keys are encrypted in Supabase database
- Only accessible from Edge Functions

---

**Your Resend API Key:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`

**Next Step:** Add this to Supabase Edge Function secrets and deploy the function!





