# Migration from Resend to Supabase Email

## 🔄 What Changed

The email system has been updated to use **Supabase's configured email service** instead of Resend.

### Key Changes:

1. **Automatic Email Sending**
   - All invoices are **automatically sent** when created
   - No checkbox needed - happens automatically
   - Email is sent via your Supabase SMTP configuration

2. **Email Service Provider**
   - Changed from Resend to Supabase Email Service
   - Uses Supabase Edge Functions or SMTP configuration
   - All emails go through your Supabase project

3. **Configuration**
   - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - No Resend API key needed anymore
   - Configure SMTP in Supabase Dashboard instead

## 📝 Migration Steps

### Remove Resend Dependencies (Optional)

```bash
# Optional: Remove Resend package (if not using it elsewhere)
npm uninstall resend
```

### Update Environment Variables

**Remove (if you had these):**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**Add (if not already present):**
```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# From Email (Optional)
SUPABASE_FROM_EMAIL=noreply@yourdomain.com
```

### Configure SMTP in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings → Auth → SMTP Settings**
4. Enable **"Enable Custom SMTP"**
5. Configure your SMTP server:
   - **Gmail**: Use App Password
   - **SendGrid**: Use SMTP credentials
   - **AWS SES**: Use SMTP credentials
   - Or any other SMTP provider
6. Test the connection
7. Save configuration

### Deploy Edge Function (Optional)

For better control, deploy the Edge Function:

```bash
supabase functions deploy send-invoice-email
```

## ✅ What Still Works

- ✅ Invoice creation works the same
- ✅ Email sending happens automatically
- ✅ Email status tracking (`emailSent`, `emailSentAt`)
- ✅ Resend invoice email button
- ✅ Professional email templates
- ✅ Invoice view links

## 🎯 Benefits

1. **Unified Platform**: Everything in one place (database + email)
2. **No Additional Service**: Use existing Supabase infrastructure
3. **Automatic Sending**: All invoices sent automatically
4. **Better Integration**: Seamless integration with Supabase

## 📚 Documentation

- **Setup Guide**: See `SUPABASE_EMAIL_SETUP.md`
- **Settings Page**: Go to `/settings` for configuration status
- **Supabase Docs**: [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)

---

**Migration Complete!** All invoices now use Supabase email service automatically.



