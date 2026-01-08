# 🔐 FIX: Login System Not Working

## Common Issues & Solutions

### Issue 1: Environment Variables Missing ❌

**Symptoms:**
- 500 errors when trying to login/signup
- "There is a problem with the server configuration" error

**Fix:**
Make sure these are set in Vercel Environment Variables:
1. `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
2. `NEXTAUTH_URL` - Your Vercel URL (e.g., `https://paytrack-phi.vercel.app`)
3. `DATABASE_URL` - Your PostgreSQL connection string

**After adding:** Redeploy your Vercel project

---

### Issue 2: Database Not Set Up ❌

**Symptoms:**
- "Can't reach database server" error
- Signup fails silently

**Fix:**
1. Make sure database is accessible
2. Push Prisma schema:
   ```bash
   npx prisma db push
   ```
3. Or add to Vercel build command:
   ```
   npm run db:push && npm run build
   ```

---

### Issue 3: API Route Not Working ❌

**Check:**
- Visit: `https://your-vercel-url/api/auth/providers`
- Should show JSON with providers

**If 404:**
- Check `app/api/auth/[...nextauth]/route.ts` exists
- Check NextAuth is properly configured

---

### Issue 4: Form Not Submitting ❌

**Check:**
- Open browser console (F12)
- Look for JavaScript errors
- Check Network tab for failed requests

**Common fixes:**
- Make sure form validation passes
- Check email format is valid
- Password must be 6+ characters

---

### Issue 5: Session Not Persisting ❌

**Symptoms:**
- Login succeeds but redirects back to login
- Dashboard shows "not authenticated"

**Fix:**
1. Check `app/providers.tsx` wraps your app
2. Check `NEXTAUTH_SECRET` is set correctly
3. Clear browser cookies and try again

---

## 🔍 Debug Steps

### Step 1: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → Logs
2. Try to login/signup
3. Check for error messages

### Step 2: Test Database Connection
```bash
npx prisma studio
```
Should open database browser. If it fails, DATABASE_URL is wrong.

### Step 3: Test API Route
Visit: `https://your-vercel-url/api/auth/providers`
Should return JSON, not 404 or 500.

### Step 4: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Try to login
4. Look for errors

### Step 5: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check `/api/auth/callback/credentials` request
5. Look at response status and body

---

## ✅ Quick Checklist

- [ ] `NEXTAUTH_SECRET` is set in Vercel
- [ ] `NEXTAUTH_URL` is set in Vercel (your Vercel URL)
- [ ] `DATABASE_URL` is set in Vercel
- [ ] Database schema is pushed (`npx prisma db push`)
- [ ] Vercel project is redeployed after adding env vars
- [ ] No errors in browser console
- [ ] No 500 errors in Vercel logs

---

## 🚀 Quick Test

Try this in browser console on your site:
```javascript
fetch('/api/auth/providers')
  .then(r => r.json())
  .then(console.log)
```

Should show:
```json
{
  "credentials": {
    "id": "credentials",
    "name": "Credentials",
    ...
  }
}
```

If this fails, NextAuth is not configured correctly.

---

## 💡 Most Common Fix

**90% of login issues are because:**
1. `NEXTAUTH_SECRET` is not set → Add it in Vercel
2. `DATABASE_URL` is wrong → Check connection string
3. Database schema not pushed → Run `npx prisma db push`

**Fix these 3 things first!** ✅





