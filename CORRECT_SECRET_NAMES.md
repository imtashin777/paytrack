# ✅ Correct Secret Names for Supabase Edge Functions

## ⚠️ Important: Supabase Prefix Restriction

**Supabase reserves the `SUPABASE_` prefix** for system secrets. You cannot use secret names starting with `SUPABASE_`.

## ✅ Correct Secret Names

Use these names in Supabase Edge Function Secrets:

### Required Secret:
- **Name:** `RESEND_API_KEY` ✅
- **Value:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`

### Optional Secrets:
- **Name:** `FROM_EMAIL` ✅ (NOT `SUPABASE_FROM_EMAIL` ❌)
- **Value:** `send@brnnd.com`

- **Name:** `FROM_NAME` ✅ (NOT `SUPABASE_FROM_NAME` ❌)
- **Value:** `brnnd`

## 📝 How to Add in Dashboard

1. Go to **Supabase Dashboard → Settings → Edge Functions → Secrets**

2. **Add Required Secret:**
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7`
   - ✅ Save

3. **Add Optional Secrets:**
   - **Name:** `FROM_EMAIL` (⚠️ NOT `SUPABASE_FROM_EMAIL`)
   - **Value:** `send@brnnd.com`
   - ✅ Save

   - **Name:** `FROM_NAME` (⚠️ NOT `SUPABASE_FROM_NAME`)
   - **Value:** `brnnd`
   - ✅ Save

## ✅ What You Already Have

Based on your screenshot:
- ✅ `RESEND_API_KEY` - Already added (Jan 4, 2026)
- ❌ `SUPABASE_FROM_EMAIL` - Cannot use (causes error)
- ✅ Need to add `FROM_EMAIL` instead
- ✅ Need to add `FROM_NAME` (optional)

## 🎯 Quick Fix

**Remove the error:**
1. Change secret name from `SUPABASE_FROM_EMAIL` to `FROM_EMAIL`
2. Keep the value: `send@brnnd.com`
3. Save

---

**Your secrets should be:**
- ✅ `RESEND_API_KEY` = `re_GMUEmNzz_4b6T2P3CWJ2HA7vLyTU9Nfo7` (already added)
- ✅ `FROM_EMAIL` = `send@brnnd.com` (use this name, NOT SUPABASE_FROM_EMAIL)
- ✅ `FROM_NAME` = `brnnd` (optional)

**After adding correct secrets, deploy the Edge Function!**

