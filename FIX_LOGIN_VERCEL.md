# 🔐 FIX: Login Not Working on Vercel

## Quick Diagnosis

If login is not working on your Vercel deployment, check these in order:

### 1. Check Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Required Variables:**
- ✅ `NEXTAUTH_SECRET` - Must be 32+ characters
- ✅ `NEXTAUTH_URL` - Must be your Vercel URL (e.g., `https://invoice-8njb6jfcc-tashin360s-projects.vercel.app`)
- ✅ `DATABASE_URL` - Your PostgreSQL connection string

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Or visit: https://generate-secret.vercel.app/32

### 2. Check Vercel Deployment Logs

1. Go to **Vercel Dashboard → Your Project → Deployments**
2. Click on the latest deployment
3. Check the **Logs** tab for any errors
4. Look for:
   - Database connection errors
   - Missing environment variable warnings
   - NextAuth configuration errors

### 3. Test Database Connection

The login requires a working database connection. Make sure:
- `DATABASE_URL` is correct
- Database is accessible from Vercel
- If using Supabase, use the **pooler connection** (port 6543)

### 4. Verify User Exists

Make sure you have created a user account:
- Try signing up first at `/auth/signup`
- Or check your database to see if users exist

### 5. Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Try to login
4. Look for any JavaScript errors
5. Check the **Network** tab for failed API requests

### 6. Common Issues & Solutions

#### Issue: "Invalid email or password"
- **Solution:** User doesn't exist or password is wrong
- **Fix:** Create account or reset password

#### Issue: "Unable to connect to the server"
- **Solution:** API route is failing
- **Fix:** Check Vercel logs, verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set

#### Issue: Login succeeds but redirects back to login
- **Solution:** Session not being created
- **Fix:** Check `NEXTAUTH_SECRET` is set correctly, clear browser cookies

#### Issue: 500 Internal Server Error
- **Solution:** Server-side error (usually missing env vars or database issue)
- **Fix:** Check Vercel logs, verify all environment variables are set

### 7. After Fixing Environment Variables

**IMPORTANT:** After adding/changing environment variables:
1. Go to **Deployments** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (~1-2 minutes)

### 8. Test Checklist

After redeploying:
- [ ] Can access login page: `/auth/signin`
- [ ] Can see login form (no 500 errors)
- [ ] Can submit login form
- [ ] Error messages appear if credentials are wrong
- [ ] Successful login redirects to `/dashboard`
- [ ] Session persists after page refresh

## Still Not Working?

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Look for `/api/auth/[...nextauth]` function
   - Check for errors

2. **Test API Route Directly:**
   - Visit: `https://your-vercel-url.vercel.app/api/auth/providers`
   - Should return JSON with providers list
   - If 404 or 500, there's a configuration issue

3. **Verify Database Schema:**
   - Make sure Prisma schema is pushed to database
   - Run: `npx prisma db push` (locally or via Vercel CLI)

## Quick Test Commands

```bash
# Test if environment variables are set (run locally with Vercel CLI)
vercel env ls

# Pull environment variables to verify
vercel env pull .env.local
```

---

**Most Common Fix:** Add `NEXTAUTH_URL` environment variable in Vercel with your exact Vercel URL!

