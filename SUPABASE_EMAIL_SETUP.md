# Supabase Email Setup Guide

## 📧 Overview

All invoices are **automatically sent via email** to clients using your configured Supabase email service. No manual action needed - every invoice creation triggers an email to the client.

## ⚙️ Configuration

### Step 1: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** (`https://xxx.supabase.co`)
   - **anon/public key** (JWT secret)

### Step 2: Configure SMTP in Supabase

1. In Supabase Dashboard, go to **Settings → Auth → SMTP Settings**
2. Enable **"Enable Custom SMTP"**
3. Configure your SMTP server:
   - **Gmail**: Use App Password
   - **SendGrid**: Use API credentials
   - **AWS SES**: Use SMTP credentials
   - **Other**: Use standard SMTP settings
4. Test the connection
5. Save configuration

### Step 3: Set Environment Variables

Add to your `.env` file:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# From Email (Optional - defaults to SMTP configured email)
SUPABASE_FROM_EMAIL=noreply@yourdomain.com

# Edge Function URL (Optional - if using Edge Function)
SUPABASE_EDGE_FUNCTION_EMAIL_URL=https://your-project.supabase.co/functions/v1/send-invoice-email
```

### Step 4: Deploy Edge Function (Optional but Recommended)

For better control and reliability:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the Edge Function
supabase functions deploy send-invoice-email
```

## 🔄 How It Works

### Automatic Email Sending

1. **Invoice Creation**: When an invoice is created
2. **Email Trigger**: Automatically sends email to client
3. **No Action Needed**: No checkbox or button needed - happens automatically
4. **Email Content**: Professional HTML email with:
   - Invoice details
   - Total amount
   - Due date
   - Line items (if any)
   - Secure invoice view link

### Email Flow

```
Invoice Created → Supabase Email Service → Client Email Inbox
                      ↓
                 Status Tracked
                  (emailSent: true)
```

## 📋 Features

### ✅ Automatic Sending
- **All invoices** are sent automatically when created
- No manual checkbox or button needed
- Works for both simple and advanced invoice forms

### ✅ Status Tracking
- `emailSent`: Boolean (true if sent)
- `emailSentAt`: DateTime (when sent)
- Visible in invoice details

### ✅ Fail-Safe
- Invoice is **always created** even if email fails
- Errors are logged but don't block invoice creation
- Toast notification shows success/failure

### ✅ Resend Capability
- "Resend Invoice Email" button on invoice detail page
- Allows re-sending if email failed
- Updates `emailSentAt` timestamp

## 🎯 Email Configuration Methods

### Method 1: SMTP Configuration (Recommended)

1. Configure SMTP in Supabase Dashboard
2. Add Supabase credentials to `.env`
3. Done! Emails work automatically

### Method 2: Edge Function (Advanced)

1. Deploy Edge Function (see Step 4 above)
2. Configure email service in Edge Function
3. Set `SUPABASE_EDGE_FUNCTION_EMAIL_URL` in `.env`

## 📧 Email Template

Each email includes:
- Professional HTML design
- Client name and invoice number
- Total amount (formatted currency)
- Due date
- Line items table (if available)
- Tax, discount, shipping breakdown
- Notes section
- Secure invoice view link (`/invoices/[id]/view`)

## 🔒 Security

- Only invoice owner can send emails
- Protected invoice view links
- Server-side email sending only
- No client-side secrets exposed

## 🐛 Troubleshooting

### Email Not Sending

1. **Check SMTP Configuration**
   - Verify SMTP settings in Supabase Dashboard
   - Test SMTP connection
   - Check SMTP credentials

2. **Check Environment Variables**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is set
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
   - Restart server after adding variables

3. **Check Email Status**
   - Go to invoice detail page
   - Check `emailSent` status in database
   - Use "Resend Invoice Email" if needed

4. **Check Logs**
   - Server console for email errors
   - Supabase Dashboard logs
   - Check Edge Function logs (if using)

### Common Issues

- **"Email service is not configured"**
  - Solution: Add Supabase credentials to `.env`

- **"SMTP connection failed"**
  - Solution: Verify SMTP settings in Supabase Dashboard

- **"Email sent but not received"**
  - Check spam folder
  - Verify client email address
  - Check SMTP delivery logs

## ✅ Verification

1. **Create a test invoice**
   - Go to `/invoices/new`
   - Fill in details
   - Submit
   - Check client email inbox

2. **Check invoice status**
   - Go to invoice detail page
   - Verify email was sent
   - Check `emailSentAt` timestamp

3. **Test resend**
   - Click "Resend Invoice Email"
   - Verify email is received again

## 📚 Resources

- [Supabase SMTP Documentation](https://supabase.com/docs/guides/auth/auth-smtp)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Dashboard](https://app.supabase.com)

---

**Note**: All invoices are sent automatically via your configured Supabase email service. Make sure SMTP is properly configured in your Supabase project settings.



