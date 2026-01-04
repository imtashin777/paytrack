# PayTrack - Invoice & Payment Tracker

A simple, honest invoice and payment tracker for freelancers in Asia (Bangladesh/India).

## 🎯 Features

- **Authentication**: Email + password authentication with NextAuth
- **Client Management**: Create and manage clients
- **Invoice System**: Create invoices with automatic overdue detection
- **Dashboard**: View invoice statistics at a glance
- **PDF Export**: Download invoices as PDF
- **Stripe Integration**: Subscription-based monetization (Free: 5 invoices/month, Pro: unlimited)

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** (ORM)
- **PostgreSQL** (Supabase)
- **NextAuth** (Authentication)
- **Stripe** (Subscriptions)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase)
- Stripe account (for subscriptions)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd invoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000`)
   - `NEXTAUTH_SECRET`: Generate a random secret (e.g., `openssl rand -base64 32`)
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
paytrack/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── invoices/          # Invoice pages
│   └── clients/           # Client pages
├── components/             # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions
│   ├── actions/          # Server actions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/               # Prisma schema
└── types/                # TypeScript type definitions
```

## 🗄️ Database Schema

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `plan`: FREE or PRO
- `createdAt`: Account creation timestamp

### Client
- `id`: Unique identifier
- `userId`: Foreign key to User
- `name`: Client name
- `email`: Client email
- `createdAt`: Client creation timestamp

### Invoice
- `id`: Unique identifier
- `userId`: Foreign key to User
- `clientId`: Foreign key to Client
- `amount`: Invoice amount
- `status`: UNPAID, PAID, or OVERDUE
- `dueDate`: Payment due date
- `notes`: Optional notes
- `createdAt`: Invoice creation timestamp (immutable)
- `paidAt`: Payment timestamp (nullable)

## 🔐 Authentication

The app uses NextAuth with credentials provider. Passwords are hashed using bcryptjs.

## 💳 Stripe Integration

Stripe is used for subscription management only:
- **Free Plan**: 5 invoices per month
- **Pro Plan**: $5/month, unlimited invoices

Webhook handlers should be set up to update user plans when subscriptions change.

## 📄 Invoice Status Logic

Invoices are automatically marked as "overdue" if:
- Status is `UNPAID` AND
- `dueDate` < today

This is calculated on-the-fly (no cron jobs needed).

## 🚀 Deployment

1. **Set up your database** (Supabase recommended)
2. **Deploy to Vercel** (recommended for Next.js)
3. **Configure environment variables** in your hosting platform
4. **Set up Stripe webhooks** pointing to your domain

## 📝 Notes

- This is NOT full accounting software
- No tax, GST, or ledger calculations
- No payment gateways per invoice (subscriptions only)
- Simple, clean UI focused on usability

## 🔄 Future Scaling Considerations

- Add database indexes for better query performance
- Implement caching for frequently accessed data
- Add pagination for large invoice lists
- Consider Redis for session management at scale
- Add rate limiting for API routes
- Implement proper PDF generation library (e.g., @react-pdf/renderer)

## 📄 License

MIT









