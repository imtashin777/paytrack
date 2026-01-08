# 🔍 DEBUG LOGIN - Step by Step

## Quick Checks (Do These First)

### 1. Check Browser Console (F12)
1. Open DevTools (F12)
2. Go to **Console** tab
3. Try to login
4. **What do you see?**
   - Any error messages?
   - "Attempting to sign in with email: ..." message?
   - "Sign in result: ..." message?

### 2. Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for a request to `/api/auth/callback/credentials` or `/api/auth/signin`
5. **Click on it** and check:
   - Status code (should be 200, not 500 or 401)
   - Response tab - what does it say?
   - Headers - any errors?

### 3. Test API Endpoint Directly
Open this URL in your browser:
```
https://invoice-puce-ten.vercel.app/api/auth/providers
```

**Expected:** Should show JSON like:
```json
{
  "credentials": {
    "id": "credentials",
    "name": "Credentials",
    ...
  }
}
```

**If 404 or 500:** The API route isn't working - check environment variables

---

## Check Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Verify these 3 are set:**
- [ ] `NEXTAUTH_SECRET` - Must be set
- [ ] `NEXTAUTH_URL` - Should be `https://invoice-puce-ten.vercel.app`
- [ ] `DATABASE_URL` - Your Supabase connection string

**After checking/adding variables:**
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to finish

---

## Check Vercel Function Logs

1. Go to **Vercel Dashboard → Your Project → Logs**
2. Try to login
3. Check the logs for errors:
   - Database connection errors?
   - Missing environment variable errors?
   - NextAuth errors?

---

## Test Database Connection

The login needs to query the database. Check if database is accessible:

1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Verify `DATABASE_URL` is correct
3. Check Vercel logs for database connection errors

---

## Common Issues

### Issue: "Invalid email or password"
- **Check:** Does the user exist in the database?
- **Fix:** Try signing up first at `/auth/signup`

### Issue: Page just refreshes (no error)
- **Check:** Browser console for errors
- **Check:** Network tab for failed requests
- **Check:** Environment variables are set

### Issue: 500 Error
- **Check:** Vercel logs
- **Check:** All environment variables are set
- **Check:** `NEXTAUTH_SECRET` is 32+ characters

### Issue: "Unable to connect to the server"
- **Check:** `/api/auth/providers` endpoint works
- **Check:** Vercel deployment is successful
- **Check:** No errors in Vercel logs

---

## What to Share

If login still doesn't work, share:
1. **Console errors** (from F12 → Console)
2. **Network request status** (from F12 → Network → click on the auth request)
3. **Vercel logs** (any errors when you try to login)
4. **Response from** `https://invoice-puce-ten.vercel.app/api/auth/providers`

