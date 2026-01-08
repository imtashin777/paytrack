# Scheduled Email Setup

## Overview

Invoices can now be:
1. **Sent Now** - Email sent immediately after creation
2. **Save Only** - Invoice created without sending email
3. **Schedule** - Email scheduled to send at a specific date/time

## How It Works

### 1. Creating Invoices

When creating an invoice, you can choose:
- **Send Now**: Email sent immediately
- **Save Only**: Just create, no email
- **Schedule**: Set a date/time for email to be sent

### 2. Scheduled Emails

Scheduled emails are processed by a cron job that checks for invoices ready to be sent.

## Setup Cron Job

### Option 1: Vercel Cron (Recommended)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-scheduled-emails",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This runs every 5 minutes. Adjust schedule as needed.

### Option 2: External Cron Service

Use a service like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [UptimeRobot](https://uptimerobot.com)

Set up to call: `https://your-domain.com/api/cron/send-scheduled-emails`

**Schedule:** Every 1-5 minutes

**Optional:** Add `CRON_SECRET` environment variable and use:
```
Authorization: Bearer YOUR_CRON_SECRET
```

## Environment Variables

Add to `.env` (optional, for security):

```env
CRON_SECRET=your-secret-key-here
```

## Testing

1. Create an invoice with "Schedule" option
2. Set time to 1-2 minutes in the future
3. Wait and check if email is sent
4. Check invoice detail page for `emailSent` status

## Troubleshooting

### Emails Not Sending

1. **Check SMTP Configuration:**
   - Go to `/settings`
   - Verify SMTP is configured
   - Test with "Send Now" option first

2. **Check Cron Job:**
   - Verify cron is running
   - Check logs in Vercel dashboard
   - Manually call `/api/cron/send-scheduled-emails` to test

3. **Check Server Logs:**
   - Look for email sending errors
   - Check SMTP connection errors
   - Verify credentials are correct

### Scheduled Emails Not Processing

1. **Verify Cron is Set Up:**
   - Check `vercel.json` (if using Vercel)
   - Verify external cron service is calling the endpoint

2. **Check Database:**
   - Verify `emailScheduledAt` is set correctly
   - Check `emailSendOption` is "schedule"
   - Ensure `emailSent` is still `false`

3. **Test Endpoint:**
   - Manually call: `GET /api/cron/send-scheduled-emails`
   - Should return list of processed invoices

---

**Note:** Scheduled emails are processed in batches. The cron job runs every few minutes, so emails may be sent slightly after the scheduled time (within the cron interval).



