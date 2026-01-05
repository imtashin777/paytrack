# Deployment Guide - Free Hosting Options

## 🚀 Recommended: Vercel + Supabase (Best for Next.js)

### Why This Combo?
- **Vercel**: Made by Next.js creators, zero-config deployment
- **Supabase**: Free PostgreSQL database (500MB storage, 2GB bandwidth)

### Step 1: Deploy Database (Supabase)

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create a new project
4. Wait for database to initialize (~2 minutes)
5. Go to **Settings** → **Database**
6. Copy your **Connection String** (URI format)
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
   - Replace `[PASSWORD]` with your database password

### Step 2: Deploy App (Vercel)

1. Push your code to GitHub (if not already)
2. Go to [vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Click **"Add New Project"**
5. Import your repository
6. Configure environment variables:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   NEXTAUTH_SECRET=your-random-secret-here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
   - Generate `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` in terminal
7. Click **Deploy**
8. After deployment, run migrations:
   - Go to Vercel project → **Deployments** → Click on deployment
   - Open **Functions** tab → Run terminal command:
     ```bash
     npx prisma db push
     npx prisma generate
     ```

### Step 3: Update Supabase Connection

1. In Supabase dashboard → **Settings** → **Database**
2. Under **Connection Pooling**, enable it
3. Use the pooled connection string for production (better performance)

---

## 🚂 Alternative: Railway (All-in-One)

### Why Railway?
- Includes PostgreSQL database
- Simple deployment
- $5 free credit/month (usually enough)

### Steps:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect Next.js
6. Add PostgreSQL:
   - Click **"+ New"** → **"Database"** → **"PostgreSQL"**
7. Add environment variables:
   - `DATABASE_URL` (auto-generated from PostgreSQL service)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your Railway app URL)
8. Deploy will start automatically
9. Run migrations:
   - Open terminal in Railway dashboard
   - Run: `npx prisma db push && npx prisma generate`

---

## 🎨 Alternative: Render

### Steps:

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create **New Web Service**
4. Connect your repository
5. Settings:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
6. Add PostgreSQL:
   - Create **New PostgreSQL** database
   - Copy connection string
7. Environment variables:
   - `DATABASE_URL` (from PostgreSQL)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
8. Deploy

**Note**: Free tier spins down after 15 min inactivity (takes ~30s to wake up)

---

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables Needed

Create `.env.production` (don't commit this):

```env
# Database
DATABASE_URL=your-postgres-connection-string

# NextAuth
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-app-domain.com

# Stripe (if using)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

### 2. Update next.config.js (if needed)

Make sure it's configured for production:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your config
}

module.exports = nextConfig
```

### 3. Database Migrations

Before first deployment, ensure your database schema is ready:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Or create migration (for production)
npx prisma migrate dev --name init
```

### 4. Build Test

Test your build locally:

```bash
npm run build
npm start
```

---

## 📝 Post-Deployment Steps

### 1. Run Database Migrations

After first deployment, you need to run migrations. Options:

**Option A: Via Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull
npx prisma db push
```

**Option B: Via Platform Terminal**
- Most platforms (Railway, Render) have a terminal/console
- Run: `npx prisma db push && npx prisma generate`

**Option C: Add to Build Command**
- In Vercel: Add `npx prisma generate` to build command
- In Railway: Add to start script

### 2. Verify Environment Variables

Check that all env vars are set correctly in your hosting platform.

### 3. Test Your App

- Sign up flow
- Create invoice
- Check database connection
- Test authentication

---

## 🆓 Free Tier Limits Comparison

| Platform | Free Tier | Limits |
|----------|--------|
| **Vercel** | Unlimited projects, 100GB bandwidth/month, Serverless functions |
| **Supabase** | 500MB database, 2GB bandwidth, 50K monthly active users |
| **Railway** | $5 credit/month (~500 hours runtime) |
| **Render** | Free tier with 15min spin-down, 750 hours/month |
| **Fly.io** | 3 shared VMs, 3GB storage |

---

## 🎯 Recommended Setup for Your App

**Best Choice: Vercel + Supabase**

1. **Vercel** for hosting (perfect Next.js support)
2. **Supabase** for database (free PostgreSQL)
3. **Stripe** for payments (separate account)

**Why?**
- Zero-config Next.js deployment
- Free tier is generous
- Easy to scale
- Great developer experience

---

## 🐛 Common Issues & Solutions

### Issue: Database connection fails
**Solution**: 
- Check `DATABASE_URL` format
- Ensure database is accessible (not blocked by firewall)
- For Supabase: Use connection pooling string

### Issue: Build fails
**Solution**:
- Check build logs
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally first

### Issue: Prisma client not found
**Solution**:
- Add `npx prisma generate` to build command
- Or run it in postinstall script (already in package.json)

### Issue: Environment variables not working
**Solution**:
- Restart deployment after adding env vars
- Check variable names (case-sensitive)
- Ensure no trailing spaces

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Supabase Getting Started](https://supabase.com/docs/guides/getting-started)
- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## ✅ Quick Start (Vercel + Supabase)

1. **Supabase**: Create project → Copy `DATABASE_URL`
2. **GitHub**: Push your code
3. **Vercel**: Import repo → Add env vars → Deploy
4. **Terminal**: Run `npx prisma db push` via Vercel CLI or dashboard
5. **Done!** 🎉

Your app will be live at `https://your-app.vercel.app`






