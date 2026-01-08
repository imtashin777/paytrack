# Invoice Email Feature - Setup Guide

## 📧 Overview

The "Send Invoice via Email" feature allows users to automatically send professional invoice emails to clients with invoice details and secure view links.

## 🔧 Prerequisites

### 1. Install Dependencies

The following packages have been installed:
- `resend` - Transactional email service
- `react-hot-toast` - Toast notifications

### 2. Database Migration

Run the following command to update your database schema:

```bash
npx prisma db push
```

Or if using migrations:

```bash
npx prisma migrate dev --name add_invoice_email_fields
```

This adds two new fields to the Invoice model:
- `emailSent: Boolean @default(false)` - Tracks if email was sent
- `emailSentAt: DateTime?` - Timestamp when email was sent

### 3. Environment Variables

Add the following to your `.env` file:

```bash
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7

# From Email (must be from a verified domain in Resend)
# For testing, you can use onboarding@resend.dev (only works for test emails)
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Base URL for invoice view links
NEXTAUTH_URL=https://yourdomain.com
```

## 📝 Resend Setup

### Step 1: Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email

### Step 2: Get API Key

1. Navigate to **API Keys** in Resend dashboard
2. Click **Create API Key**
3. Name it (e.g., "PayTrack Production")
4. Copy the API key (starts with `re_`)
5. Add to `.env` as `RESEND_API_KEY`

### Step 3: Verify Domain (Optional but Recommended)

For production emails:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Add your domain (e.g., `yourdomain.com`)
4. Follow DNS setup instructions
5. Wait for domain verification
6. Update `RESEND_FROM_EMAIL` to use your domain

**For Development/Testing:**
- You can use `onboarding@resend.dev` without domain verification
- This only works for sending emails, not receiving

## 🚀 Features

### 1. **Send Invoice on Creation**

When creating a new invoice:
- Checkbox: "Send invoice to client via email"
- If checked, email is sent immediately after invoice creation
- Invoice is still created even if email fails
- Success/error toast notifications

### 2. **Resend Invoice Email**

On invoice detail page:
- "Resend Invoice Email" button
- Allows re-sending invoice to client
- Updates `emailSentAt` timestamp

### 3. **Email Content**

Each email includes:
- Professional HTML template
- Client name and invoice number
- Total amount (formatted currency)
- Due date
- Line items table (if available)
- Tax, discount, shipping breakdown
- Notes section
- Secure invoice view link
- PDF attachment (optional, can be added later)

### 4. **Secure Invoice View Links**

- Protected route: `/invoices/[id]/view`
- Currently requires authentication
- Future: Can implement signed URL tokens for client access without login

## 🔒 Security Features

1. **Authorization**: Only invoice owner can send emails
2. **Server-Side Only**: All email logic runs on server
3. **Protected Routes**: Invoice view links require authentication
4. **No Client Secrets**: API keys stored in environment variables only

## 📊 Database Schema Changes

```prisma
model Invoice {
  // ... existing fields ...
  emailSent Boolean       @default(false)
  emailSentAt DateTime?
}
```

## 🧪 Testing

### Test Email Sending:

1. **Local Development:**
   ```bash
   # Set in .env
   RESEND_API_KEY=re_your_test_key
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

2. **Create Invoice with Email:**
   - Go to `/invoices/new`
   - Fill in invoice details
   - Check "Send invoice to client via email"
   - Submit
   - Check Resend dashboard for sent emails

3. **Resend Email:**
   - Go to any invoice detail page
   - Click "Resend Invoice Email"
   - Verify email is sent

### Check Email Status:

- Database: Check `emailSent` and `emailSentAt` fields
- Resend Dashboard: View sent emails and delivery status
- Client Email: Verify email received with correct content

## 🐛 Error Handling

### Common Issues:

1. **"RESEND_API_KEY is not configured"**
   - Solution: Add `RESEND_API_KEY` to `.env` file

2. **Email fails to send**
   - Check Resend API key is valid
   - Verify `RESEND_FROM_EMAIL` is from verified domain
   - Check Resend dashboard for error logs
   - Invoice is still created (fail-safe)

3. **Invoice view link doesn't work**
   - Verify `NEXTAUTH_URL` is set correctly
   - Check invoice ID exists in database
   - Ensure user is authenticated

## 📧 Email Template

The email template includes:
- Responsive HTML design
- Invoice details table
- Line items breakdown
- Tax/discount/shipping calculations
- Professional styling
- Mobile-friendly layout
- Plain text fallback

## 🔮 Future Enhancements

1. **Signed URL Tokens**: Allow client access without login
2. **PDF Attachments**: Attach generated PDF to emails
3. **Email Tracking**: Track email opens and link clicks
4. **Templates**: Customizable email templates
5. **Scheduled Sending**: Send invoices at specific times
6. **Bulk Email**: Send multiple invoices at once

## 📚 Code Structure

```
lib/
  email.ts                    # Email sending utility
  actions/
    invoices.ts               # Updated with email support

components/
  create-invoice-form.tsx     # Updated with email checkbox
  resend-invoice-email-button.tsx  # Resend button component

app/
  invoices/
    [id]/
      invoice-detail-client.tsx  # Updated with resend button
      view/
        page.tsx              # Protected invoice view route
```

## ✅ Verification Checklist

- [ ] `RESEND_API_KEY` added to `.env`
- [ ] `RESEND_FROM_EMAIL` configured
- [ ] `NEXTAUTH_URL` set correctly
- [ ] Database migration completed (`npx prisma db push`)
- [ ] Resend domain verified (for production)
- [ ] Test email sent successfully
- [ ] Toast notifications working
- [ ] Resend button visible on invoice detail page
- [ ] Invoice view link accessible

## 🎉 Success!

Your invoice email feature is now fully functional! Users can:
- Send invoices automatically when creating
- Resend invoices from the detail page
- Clients receive professional invoice emails
- All emails are tracked in the database

---

**Need Help?** Check Resend documentation: https://resend.com/docs





