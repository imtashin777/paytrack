# Send Invoice Email - Supabase Edge Function

This Edge Function handles sending invoice emails via Supabase's configured email service.

## Setup

1. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy send-invoice-email
   ```

2. **Set Environment Variables in Supabase Dashboard:**
   - Go to Project Settings > Edge Functions
   - Add secrets:
     - `SUPABASE_URL` (automatically available)
     - `SUPABASE_SERVICE_ROLE_KEY` (automatically available)
     - `SUPABASE_FROM_EMAIL` - Your from email address
     - `EMAIL_SERVICE_URL` (optional) - Custom email service endpoint
     - `EMAIL_SERVICE_API_KEY` (optional) - API key for custom email service

3. **Configure SMTP in Supabase:**
   - Go to Project Settings > Auth > SMTP Settings
   - Configure your SMTP server
   - Or use Supabase's email templates feature

## Usage

The function is called automatically when `sendInvoiceEmail` is used in the application.

## Configuration

Set these in your `.env` file or Supabase dashboard:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_EDGE_FUNCTION_EMAIL_URL=https://your-project.supabase.co/functions/v1/send-invoice-email
```





