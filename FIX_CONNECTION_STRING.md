# 🔧 Fix Connection String

## Your Current Connection String
```
postgresql://postgres.kjjnprsuwvlphjlijavq:zy4Vny9DMBfW@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

## Issues Found:
1. ❌ Port is **5432** - should be **6543** for pooler
2. ❌ Missing `pgbouncer=true` parameter
3. ❌ Missing `connection_limit=1` parameter

## ✅ Corrected Connection String

### For Pooler (Production/Serverless):
```
postgresql://postgres.kjjnprsuwvlphjlijavq:zy4Vny9DMBfW@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### Or Try Direct Connection (Local Dev):
```
postgresql://postgres:zy4Vny9DMBfW@db.kjjnprsuwvlphjlijavq.supabase.co:5432/postgres
```

## Update Your .env File

Change your `DATABASE_URL` in `.env` to:

**Option 1: Pooler (with correct port)**
```env
DATABASE_URL="postgresql://postgres.kjjnprsuwvlphjlijavq:zy4Vny9DMBfW@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

**Option 2: Direct Connection**
```env
DATABASE_URL="postgresql://postgres:zy4Vny9DMBfW@db.kjjnprsuwvlphjlijavq.supabase.co:5432/postgres"
```

## After Updating .env:

1. Test connection:
   ```bash
   npx prisma db push
   ```

2. If successful, restart server:
   ```bash
   npm run dev
   ```

**The code will automatically fix the port if you use 5432 with pooler, but the authentication might still fail if credentials are wrong.**




