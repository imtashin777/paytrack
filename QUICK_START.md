# Quick Start - Get PayTrack Running in 5 Minutes

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Environment File

Create a `.env` file in the root directory with these values:

```env
# Database (Use Supabase free tier or local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/paytrack?schema=public"

# NextAuth (Generate a random secret)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"

# Stripe (Optional - can add later)
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

**Quick way to generate NEXTAUTH_SECRET:**
- Windows PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`
- Mac/Linux: `openssl rand -base64 32`

## Step 3: Set Up Database

### Option A: Supabase (Easiest - Free)

1. Go to https://supabase.com
2. Sign up and create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. Paste it as `DATABASE_URL` in your `.env` file

### Option B: Local PostgreSQL

1. Install PostgreSQL
2. Create database: `CREATE DATABASE paytrack;`
3. Update `DATABASE_URL` in `.env`

## Step 4: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Step 5: Start the Development Server

```bash
npm run dev
```

## Step 6: Open Your Browser

Go to: **http://localhost:3000**

## First Steps After Launch

1. **Sign Up**: Click "Sign Up" and create an account
2. **Add a Client**: Go to Clients → Add Client
3. **Create Invoice**: Go to Invoices → Create Invoice
4. **View Dashboard**: See your statistics

## Troubleshooting

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection errors
- Check your `DATABASE_URL` is correct
- Ensure PostgreSQL is running (if local)
- Verify Supabase project is active (if using Supabase)

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

## Ready to Deploy?

See `SETUP.md` for production deployment instructions (Vercel recommended).













