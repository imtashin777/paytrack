# Deploy Supabase Edge Function for Email

## 📧 Overview

This guide shows how to deploy the Supabase Edge Function that sends invoice emails using your configured Resend SMTP service.

## 🚀 Quick Setup

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Or use npx:
```bash
npx supabase --version
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### Step 3: Link Your Project

```bash
# Get your project reference from Supabase Dashboard → Settings → General
supabase link --project-ref your-project-ref
```

### Step 4: Set Resend API Key as Secret

**Option A: Using CLI**
```bash
# Get your Resend API key from https://resend.com/api-keys
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Option B: Using Dashboard**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → Edge Functions → Secrets**
4. Add secret:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Your Resend API key (starts with `re_`)

### Step 5: Set Optional Environment Variables

```bash
# Set sender email (should match your SMTP config: send@brnnd.com)
supabase secrets set SUPABASE_FROM_EMAIL=send@brnnd.com

# Set sender name
supabase secrets set SUPABASE_FROM_NAME=brnnd
```

### Step 6: Deploy Edge Function

```bash
supabase functions deploy send-invoice-email
```

### Step 7: Test the Function

```bash
# Test locally first (optional)
supabase functions serve send-invoice-email

# Or test deployed function
curl -X POST https://your-project.supabase.co/functions/v1/send-invoice-email \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<p>Test</p>",
    "text": "Test"
  }'
```

## ✅ Verification

1. **Check Deployment:**
   - Go to Supabase Dashboard → Edge Functions
   - You should see `send-invoice-email` listed

2. **Test Email:**
   - Go to `/settings` in your app
   - Click "Send Test Email"
   - Check your inbox

3. **Create Invoice:**
   - Create a new invoice
   - Email should be sent automatically
   - Check invoice detail page for `emailSent` status

## 🔧 Configuration

### Environment Variables Needed:

**In Supabase Edge Function Secrets:**
- `RESEND_API_KEY` - Your Resend API key (required)
- `SUPABASE_FROM_EMAIL` - Sender email (defaults to `send@brnnd.com`)
- `SUPABASE_FROM_NAME` - Sender name (defaults to `PayTrack`)

**In Your Next.js `.env`:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_EDGE_FUNCTION_EMAIL_URL` - (Optional) Override Edge Function URL

## 📝 How It Works

1. Invoice is created in your app
2. App calls Supabase Edge Function: `/functions/v1/send-invoice-email`
3. Edge Function uses Resend API to send email
4. Email is sent via your configured Resend service (smtp.resend.com)
5. Status is tracked in database (`emailSent`, `emailSentAt`)

## 🔒 Security

- Resend API key stored securely in Supabase secrets
- Edge Function requires authentication
- Only invoice owner can trigger emails
- No API keys exposed to client

## 🐛 Troubleshooting

### Function Not Found
- **Error:** `Function not found`
- **Solution:** Deploy the function using `supabase functions deploy send-invoice-email`

### Missing API Key
- **Error:** `RESEND_API_KEY is not configured`
- **Solution:** Set the secret in Supabase: `supabase secrets set RESEND_API_KEY=re_xxx`

### Email Not Sending
- Check Resend API key is valid
- Check sender email (`send@brnnd.com`) is verified in Resend
- Check Edge Function logs in Supabase Dashboard
- Verify client email address is correct

### Check Logs
```bash
# View Edge Function logs
supabase functions logs send-invoice-email
```

Or in Dashboard: **Edge Functions → send-invoice-email → Logs**

## 📚 Files

- **Edge Function:** `supabase/functions/send-invoice-email/index.ts`
- **Email Utility:** `lib/email.ts`
- **Server Actions:** `lib/actions/invoices.ts`

---

**Once deployed, all invoices will automatically send emails via your configured Supabase/Resend email service!** 🎉



