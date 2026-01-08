# ✅ Add SMTP Credentials to Your .env File

## 📝 Add These Lines to Your `.env` or `.env.local` File

```env
# SMTP Configuration (Resend)
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASSWORD=re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7
SMTP_FROM_EMAIL=send@brnnd.com
SMTP_FROM_NAME=brnnd
```

## 🚀 Quick Steps

1. **Open your `.env` file** (or create `.env.local` if it doesn't exist)
2. **Add the SMTP credentials above**
3. **Save the file**
4. **Restart your dev server** (if running):
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

## ✅ That's It!

After adding these credentials:
- ✅ All invoices will automatically send emails via SMTP
- ✅ Uses your Resend SMTP configuration
- ✅ Professional HTML emails with invoice details
- ✅ Status tracked in database

## 🔒 For Production (Vercel)

When deploying to Vercel, add these same environment variables:
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add each variable:
   - `SMTP_HOST` = `smtp.resend.com`
   - `SMTP_PORT` = `465`
   - `SMTP_USER` = `resend`
   - `SMTP_PASSWORD` = `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`
   - `SMTP_FROM_EMAIL` = `send@brnnd.com`
   - `SMTP_FROM_NAME` = `brnnd`
3. **Redeploy** your project

---

**Your SMTP is now configured!** 🎉



