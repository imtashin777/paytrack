# PayTrack System Architecture

## Overview

PayTrack is a simple invoice and payment tracker built with Next.js 14 (App Router), TypeScript, and PostgreSQL. It follows a server-first architecture with Server Actions for data mutations.

## System Architecture

### High-Level Flow

```
User Request → Next.js Middleware → Page Component → Server Actions → Prisma → PostgreSQL
                                                      ↓
                                              NextAuth (Session)
```

### Key Architectural Decisions

1. **Server Actions over API Routes**: We use Server Actions for data mutations because:
   - Type-safe by default
   - Simpler code (no need for separate API route handlers)
   - Better integration with React Server Components
   - Automatic request deduplication

2. **NextAuth for Authentication**: 
   - JWT-based sessions (no database sessions needed)
   - Credentials provider for email/password
   - Middleware for route protection

3. **Prisma ORM**:
   - Type-safe database queries
   - Automatic migrations
   - Easy to switch databases

4. **No Cron Jobs for Overdue Detection**:
   - Calculated on-the-fly when fetching invoices
   - Simpler architecture
   - Always up-to-date without background jobs

## Data Flow

### Invoice Creation Flow

```
1. User fills form → CreateInvoiceForm (Client Component)
2. Form submission → createInvoice() Server Action
3. Server Action:
   - Validates session
   - Checks invoice limit (if FREE plan)
   - Creates invoice in database
   - Revalidates cache
4. Redirect to invoices list
```

### Invoice Status Calculation

```typescript
// Calculated in getInvoices() and getInvoice()
const today = new Date()
if (invoice.status === "UNPAID" && invoice.dueDate < today) {
  status = "OVERDUE"
}
```

This happens:
- When fetching invoice list
- When viewing single invoice
- No background jobs needed

## Database Schema

### Relationships

```
User (1) ──< (Many) Client
User (1) ──< (Many) Invoice
Client (1) ──< (Many) Invoice
```

### Key Constraints

- `User.email`: Unique
- `Invoice.createdAt`: Immutable (never updated)
- Cascade deletes: Deleting user deletes all their clients and invoices

## Authentication Flow

```
1. User signs in → signIn() from next-auth/react
2. NextAuth calls authorize() in CredentialsProvider
3. authorize() checks credentials against database
4. Returns JWT token with user info
5. Middleware protects routes based on session
```

## Subscription Gating

### Free Plan Limit

```typescript
// In createInvoice() Server Action
if (session.user.plan === "FREE") {
  const currentMonth = new Date()
  currentMonth.setDate(1) // First day of month
  
  const invoiceCount = await prisma.invoice.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: currentMonth }
    }
  })
  
  if (invoiceCount >= 5) {
    throw new Error("Free plan limit reached")
  }
}
```

### Stripe Integration (Placeholder)

- Webhook handler should update `User.plan` when subscription changes
- Checkout session creation for upgrades
- Webhook verification for security

## File Structure

```
app/
  ├── api/auth/[...nextauth]/  # NextAuth API route
  ├── auth/                     # Auth pages (signin, signup)
  ├── dashboard/               # Dashboard page
  ├── invoices/                # Invoice pages
  │   ├── page.tsx            # List view
  │   ├── new/page.tsx         # Create form
  │   └── [id]/page.tsx        # Detail view
  └── clients/                 # Client pages

lib/
  ├── actions/                 # Server Actions
  │   ├── auth.ts             # Sign up/in
  │   ├── invoices.ts         # Invoice CRUD
  │   └── clients.ts          # Client CRUD
  ├── auth.ts                  # NextAuth config
  ├── prisma.ts                # Prisma client singleton
  └── pdf.ts                   # PDF generation

components/
  ├── ui/                      # shadcn/ui components
  └── ...                      # Custom components
```

## Security Considerations

1. **Password Hashing**: bcryptjs with salt rounds
2. **Route Protection**: Middleware checks session
3. **Data Isolation**: All queries filter by `userId`
4. **Input Validation**: Server-side validation in Server Actions
5. **SQL Injection**: Prisma prevents SQL injection

## Performance Optimizations

1. **Database Indexes**: Should add indexes on:
   - `User.email` (already unique)
   - `Invoice.userId`
   - `Invoice.clientId`
   - `Invoice.dueDate` (for overdue queries)

2. **Caching**: Next.js automatically caches:
   - Server Components
   - Server Actions results
   - Revalidation on mutations

3. **Future Optimizations**:
   - Add pagination for invoice lists
   - Implement database connection pooling
   - Add Redis for session caching (if needed)

## Scaling Considerations

### Current Limitations

- No pagination (will break with 1000+ invoices)
- No database connection pooling (single connection)
- No caching layer (all queries hit database)

### Scaling Path

1. **Database**:
   - Add indexes
   - Connection pooling (Prisma supports this)
   - Read replicas for read-heavy workloads

2. **Application**:
   - Add pagination
   - Implement caching (Redis)
   - Add rate limiting

3. **Infrastructure**:
   - Use Vercel Edge Functions for static pages
   - CDN for static assets
   - Database on Supabase (already recommended)

## Testing Strategy (Future)

1. **Unit Tests**: Server Actions
2. **Integration Tests**: API routes
3. **E2E Tests**: Critical user flows (signup, create invoice, mark as paid)

## Deployment

### Recommended Stack

- **Hosting**: Vercel (optimized for Next.js)
- **Database**: Supabase (PostgreSQL with good DX)
- **Payments**: Stripe (industry standard)
- **Monitoring**: Vercel Analytics + Sentry

### Environment Variables

All sensitive data in `.env`:
- Database connection string
- NextAuth secret
- Stripe keys
- Webhook secrets

## Conclusion

PayTrack follows a simple, server-first architecture that prioritizes:
- **Simplicity**: No unnecessary complexity
- **Type Safety**: TypeScript + Prisma
- **Developer Experience**: Server Actions, RSC
- **Performance**: Built-in Next.js optimizations

The architecture can scale to thousands of users with minimal changes (pagination, indexes, connection pooling).










