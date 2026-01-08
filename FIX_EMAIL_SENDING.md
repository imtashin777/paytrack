# Fix Email Sending Issues

## Problem
Website says "email sent" but emails are not actually being delivered.

## Solutions

### 1. Check SMTP Configuration

**Verify your `.env` file has:**
```env
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7
SMTP_FROM_EMAIL=send@brnnd.com
SMTP_FROM_NAME=brnnd
```

**Or configure in Settings:**
- Go to `/settings`
- Choose "Custom SMTP" or "Default SMTP"
- Enter your credentials

### 2. Check Server Logs

After trying to send an email, check your terminal/console for:
- `"Starting email send process..."`
- `"SMTP transporter created"`
- `"Sending email to: [email]"`
- `"Email sent successfully"` or error messages

**Look for errors like:**
- `"SMTP credentials not configured"`
- `"Invalid login"`
- `"Connection timeout"`
- `"Authentication failed"`

### 3. Test SMTP Connection

**Verify Resend credentials:**
1. Go to [Resend Dashboard](https://resend.com/emails)
2. Check if your API key is active
3. Verify `send@brnnd.com` is a verified sender domain

### 4. Common Issues

#### Issue: "SMTP credentials not configured"
**Fix:** Add SMTP credentials to `.env` or configure in Settings

#### Issue: "Invalid login" or "Authentication failed"
**Fix:** 
- Verify `SMTP_USER` is `resend`
- Verify `SMTP_PASSWORD` is your Resend API key (starts with `re_`)
- Check API key hasn't been revoked

#### Issue: "Connection timeout"
**Fix:**
- Check internet connection
- Verify `SMTP_HOST` is `smtp.resend.com`
- Verify `SMTP_PORT` is `465`

#### Issue: Email sent but not received
**Fix:**
- Check spam folder
- Verify recipient email is correct
- Check Resend dashboard for delivery status
- Verify sender domain is verified in Resend

### 5. Test Email Sending

1. **Create a test invoice:**
   - Go to `/invoices/new`
   - Select a client
   - Choose "Send Now"
   - Create invoice

2. **Check console logs:**
   - Look for email sending logs
   - Check for any errors

3. **Check invoice status:**
   - Go to invoice detail page
   - Check if `emailSent` is `true`
   - Check `emailSentAt` timestamp

### 6. Debug Steps

1. **Check environment variables:**
   ```bash
   # In your terminal, verify .env file exists and has correct values
   ```

2. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Try sending again:**
   - Create new invoice
   - Choose "Send Now"
   - Watch console for logs

4. **Check Resend Dashboard:**
   - Go to https://resend.com/emails
   - See if emails are being sent
   - Check delivery status

## New Features Added

### Email Options
- **Send Now**: Email sent immediately
- **Save Only**: Create invoice without sending
- **Schedule**: Set date/time to send email later

### Scheduling
- Select "Schedule" option when creating invoice
- Choose date and time
- Email will be sent automatically at scheduled time
- Requires cron job setup (see `SCHEDULED_EMAILS_SETUP.md`)

## Next Steps

1. **Verify SMTP credentials** in `.env` or Settings
2. **Test email sending** with "Send Now" option
3. **Check server logs** for detailed error messages
4. **Set up cron job** for scheduled emails (optional)

---

**If emails still don't send after checking all above, share the error message from server logs!**



