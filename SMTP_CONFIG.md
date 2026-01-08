# SMTP Configuration for Invoice Emails

## Setup

Invoices are automatically sent to clients using your configured SMTP (same as verification emails).

### Environment Variables

Add these to your `.env` file or Vercel environment variables:

```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=send@brnnd.com
SMTP_FROM_NAME=brnnd
```

**Note:** These should match your Supabase SMTP configuration (Settings → Auth → SMTP Settings).

### How It Works

1. Invoice created → Email automatically sent via SMTP
2. Uses your configured SMTP credentials
3. Professional HTML email with invoice details
4. Status tracked in database (`emailSent`, `emailSentAt`)

That's it. No testing features, no debugging. Just works.





