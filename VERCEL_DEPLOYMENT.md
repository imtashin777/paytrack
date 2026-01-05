# Vercel Deployment - Environment Variables Setup

## The Problem
If you're seeing **500 Internal Server Error** with "There is a problem with the server configuration" on Vercel, it's because required environment variables are missing.

## Required Environment Variables

You **MUST** add these environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
1. Open your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

### 2. Required Variables:

```env
NEXTAUTH_SECRET=your-secret-key-here-min-32-characters-long
NEXTAUTH_URL=https://your-domain.vercel.app
DATABASE_URL=your-postgresql-connection-string
```

### 3. How to Generate NEXTAUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

**Important:** The secret must be at least 32 characters long!

### 4. NEXTAUTH_URL Format

- **For production:** `https://your-project-name.vercel.app`
- **For preview deployments:** Vercel auto-sets this, but you can override if needed

### 5. DATABASE_URL Format

If using **Supabase**:
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1
```

Make sure to use the **Session Mode** connection string (port 6543) for Supabase with connection pooling.

### 6. After Adding Variables

1. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click the **three dots** (...) on the latest deployment
   - Click **Redeploy**

2. Or push a new commit to trigger automatic redeployment

## Quick Checklist

- [ ] `NEXTAUTH_SECRET` is set (32+ characters)
- [ ] `NEXTAUTH_URL` is set to your Vercel URL
- [ ] `DATABASE_URL` is set correctly
- [ ] Redeployed after adding variables

## Testing

After redeploying, visit:
- `https://your-domain.vercel.app` - Should show landing page
- `https://your-domain.vercel.app/auth/signin` - Should show login page
- `https://your-domain.vercel.app/auth/signup` - Should show signup page

If you still get 500 errors, check the Vercel logs for more specific error messages.




