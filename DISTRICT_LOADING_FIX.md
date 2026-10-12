# District Loading Error - Root Cause Analysis & Fix

## 🔍 Investigation Summary

After inspecting the code, I've identified the most likely cause of the "Failed to load districts" error.

---

## Root Cause Analysis

### Issue #1: Error Details Are Being Hidden

**File:** `src/services/locationService.ts` (lines 62-64)

```typescript
if (error) {
  console.error('[LOCATION ERROR] Failed to fetch districts:', error);
  throw new Error('Failed to load districts');  // ❌ Generic error hides actual cause
}
```

**Problem:** The actual Supabase error is logged but then a generic error is thrown. This makes debugging impossible in production.

### Issue #2: Fallback Client in Production

**File:** `src/lib/supabase.ts` (lines 18-30)

```typescript
} else {
  // Fallback for development/build time - will show error in UI
  console.warn('Supabase environment variables not set. Using fallback client.');
  supabase = createClient(
    'https://placeholder.supabase.co',  // ❌ Fake URL
    'placeholder-key',                    // ❌ Fake key
    ...
  );
}
```

**Problem:** If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing in Vercel, the app uses a fake client that will always fail.

### Issue #3: Most Likely - Missing Database Grants

Even though RLS policies exist, PostgreSQL requires explicit grants:

```sql
-- These grants are REQUIRED even with RLS policies
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
```

**Without these grants, RLS policies alone will not allow access.**

---

## Diagnostic Steps

### Step 1: Check Browser Console

Open the production website and check the browser console (F12 → Console tab).

**Look for:**
- `[LOCATION DEBUG] Fetching districts...` - Confirms code is running
- `[LOCATION ERROR] Failed to fetch districts: { ... }` - Shows actual error
- `Supabase environment variables not set` - Confirms missing env vars

**Expected error messages:**
- `"relation does not exist"` → Table not created
- `"permission denied"` → Missing grants
- `"new row violates row-level security policy"` → RLS issue
- `"Invalid API key"` → Wrong environment variables

### Step 2: Check Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Verify these exist:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Important:** 
- Must have `VITE_` prefix
- Must be set for **Production** environment
- After adding, must **redeploy**

### Step 3: Check Database Grants in Supabase

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Check if grants exist
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'districts'
  AND grantee IN ('anon', 'authenticated');
```

**Expected result:** Should show SELECT privileges for both roles.

If empty or missing SELECT, that's the problem!

---

## The Fix

### Fix #1: Improve Error Messages (Code Change)

**File:** `src/services/locationService.ts`

Replace the error handling to show actual Supabase errors:

```typescript
if (error) {
  console.error('[LOCATION ERROR] Failed to fetch districts:', error);
  // Show actual error details for debugging
  throw new Error(`Failed to load districts: ${error.message} (Code: ${error.code})`);
}
```

### Fix #2: Add Database Grants (SQL)

**Run this in Supabase SQL Editor:**

```sql
-- ============================================================
-- GRANT DATABASE ACCESS FOR LOCATION TABLES
-- ============================================================
-- This is REQUIRED even with RLS policies

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant SELECT on all location tables
GRANT SELECT ON districts TO anon, authenticated;
GRANT SELECT ON tehsils TO anon, authenticated;
GRANT SELECT ON villages TO anon, authenticated;

-- Grant SELECT on all future tables in public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO anon, authenticated;

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Verify grants were applied
SELECT 
  table_name,
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('districts', 'tehsils', 'villages')
  AND grantee IN ('anon', 'authenticated')
  AND privilege_type = 'SELECT'
ORDER BY table_name, grantee;

-- Expected: 6 rows (3 tables × 2 roles)

-- Test query as anon role
SET ROLE anon;
SELECT COUNT(*) FROM districts;
-- Should return 75

-- Reset role
RESET ROLE;
```

### Fix #3: Verify Environment Variables (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these for **Production**:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Click "Save"
4. Go to Deployments → Latest deployment → Click "Redeploy"

---

## Files to Change

### Code Changes (2 files):

1. **`src/services/locationService.ts`**
   - Line 64: Change error message to include actual error details
   - Line 80: Change error message to include actual error details

2. **`src/lib/supabase.ts`**
   - Lines 18-30: Add better error handling for missing env vars
   - Consider throwing error in production instead of using fallback

### Database Changes (SQL only):

3. **Supabase SQL Editor**
   - Run the GRANT statements above
   - Verify with the verification queries

---

## Verification Steps

After applying fixes:

### 1. Verify Database Grants
```sql
SELECT COUNT(*) FROM districts;
-- Expected: 75

SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'districts'
  AND grantee IN ('anon', 'authenticated');
-- Expected: 2 rows with SELECT privilege
```

### 2. Verify Environment Variables
- Check Vercel dashboard for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Redeploy if changed

### 3. Test in Browser
- Open production website
- Open browser console (F12)
- Navigate to property search
- Check for:
  - `[LOCATION DEBUG] Districts fetched: 75`
  - No error messages
  - District dropdown populates

### 4. Check Network Tab
- Open DevTools → Network tab
- Look for Supabase API calls
- Should see successful 200 responses
- No 401/403 errors

---

## Most Likely Cause

Based on the code inspection, the most likely cause is:

**Missing database grants for anon/authenticated roles**

Even though RLS policies exist, PostgreSQL requires explicit GRANT statements. Without these, the queries will fail with "permission denied" even if RLS policies allow access.

**Second most likely:**
- Environment variables not set in Vercel production
- Fallback client being used with fake credentials

---

## Action Plan

### Immediate (Do This First):

1. **Run the GRANT SQL in Supabase SQL Editor**
   - This is the most likely fix
   - Takes 30 seconds
   - No code changes needed

2. **Test the district dropdown**
   - If it works, problem solved!
   - If not, continue to step 3

3. **Check browser console for actual error**
   - Look for the specific error message
   - This will tell us exactly what's wrong

### If Still Failing:

4. **Update error handling in code**
   - Show actual Supabase errors
   - Rebuild and redeploy

5. **Verify Vercel environment variables**
   - Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
   - Redeploy if changed

---

## SQL to Run First

**Copy and paste this into Supabase SQL Editor:**

```sql
-- Grant access to location tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON districts TO anon, authenticated;
GRANT SELECT ON tehsils TO anon, authenticated;
GRANT SELECT ON villages TO anon, authenticated;

-- Verify grants
SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('districts', 'tehsils', 'villages')
  AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee;

-- Test access
SET ROLE anon;
SELECT COUNT(*) as district_count FROM districts;
RESET ROLE;
```

**Expected result:**
- 6 rows in verification query (3 tables × 2 roles)
- district_count = 75

---

## Status

**Diagnosis:** Complete  
**Root Cause:** Most likely missing database grants  
**Fix:** SQL GRANT statements (no code changes needed initially)  
**Risk:** Low - GRANT statements are safe and reversible  
**Time to Fix:** 2 minutes  

**Next Step:** Run the GRANT SQL in Supabase SQL Editor and test the district dropdown.
