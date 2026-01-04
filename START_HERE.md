# 🚀 START HERE - Launch PayTrack

## Quick Launch (3 Steps)

### 1️⃣ Install Dependencies

Open your terminal in this folder and run:

```bash
npm install
```

This will install all required packages (takes 1-2 minutes).

### 2️⃣ Set Up Environment Variables

Create a file named `.env` in this folder with this content:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/paytrack?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-string"
```

**For NEXTAUTH_SECRET**, use any random string like: `my-secret-key-12345`

**For DATABASE_URL**, you have two options:

**Option A: Use Supabase (Recommended - Free)**
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Go to Settings → Database
5. Copy "Connection string" → paste as `DATABASE_URL`

**Option B: Use Local PostgreSQL**
- If you have PostgreSQL installed, use: `postgresql://user:password@localhost:5432/paytrack`

### 3️⃣ Initialize Database & Start Server

Run these commands one by one:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Start the development server
npm run dev
```

### 4️⃣ Open Your Browser

Go to: **http://localhost:3000**

You should see the sign-in page! 🎉

---

## First Time Setup

1. Click **"Sign Up"** to create an account
2. After signing up, you'll be redirected to the dashboard
3. Click **"Add Client"** to add your first client
4. Click **"Create Invoice"** to create your first invoice

---

## Need Help?

- **Database errors?** Make sure your `DATABASE_URL` is correct
- **Port 3000 in use?** The server will automatically use port 3001
- **Module not found?** Run `npm install` again

---

## What's Next?

Once the site is running, you can:
- ✅ Create clients
- ✅ Create invoices
- ✅ Track payments
- ✅ View dashboard statistics
- ✅ Download invoice PDFs

Enjoy using PayTrack! 🚀









