# PayTrack Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

#### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings → Database
4. Add to `.env` as `DATABASE_URL`

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE paytrack;
   ```
3. Add connection string to `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/paytrack?schema=public"
   ```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Stripe (Optional - for subscriptions)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Steps

1. **Sign Up**: Create an account at `/auth/signup`
2. **Add a Client**: Go to Clients → Add Client
3. **Create an Invoice**: Go to Invoices → Create Invoice
4. **View Dashboard**: See your invoice statistics

## Stripe Setup (Optional)

To enable subscription features:

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Add them to `.env`
4. Set up webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

## Troubleshooting

### Database Connection Issues

- Check your `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify database credentials

### Authentication Issues

- Make sure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your app URL
- Clear browser cookies and try again

### Build Errors

- Run `npx prisma generate` after schema changes
- Delete `.next` folder and rebuild
- Check Node.js version (18+ required)

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Vercel automatically:
- Detects Next.js
- Runs `prisma generate`
- Handles database migrations

### Other Platforms

1. Set environment variables
2. Run `npm run build`
3. Run `npx prisma generate`
4. Deploy the `.next` folder

## Next Steps

- Customize the UI to match your brand
- Set up email notifications (optional)
- Add more features as needed
- Integrate the provided UI components for enhanced visuals










