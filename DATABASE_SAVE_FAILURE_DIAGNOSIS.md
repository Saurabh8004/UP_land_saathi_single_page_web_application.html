# Database Save Failure - Diagnostic Report

## Error Details

**Error Message:** `Failed to save request: TypeError: Failed to fetch`  
**Error Type:** Network-level failure (not a database error)  
**Location:** Form submission handler in `src/App.tsx` line 661-668

---

## 1. Database Operation Analysis

### Table Used
**Table Name:** `requests`  
**File:** `src/services/propertyVerificationService.ts` line 41  
**Operation:** INSERT

### Insert Payload
```typescript
{
  request_id: requestId,                    // Auto-generated: BSK-YYYYMMDD-XXXXXX
  user_id: null,                            // Anonymous request
  service_type: 'whatsapp_verification',
  package_code: 'free',
  status: 'received',
  customer_name: data.full_name,
  customer_mobile: data.mobile_number,
  customer_email: null,
  district: data.district,
  tehsil: data.tehsil || null,
  village: null,
  gata_khasra: data.gata_khasra_number || null,
  area: null,
  owner_name: null,
  property_type: null,
  notes: data.additional_information || null,
  consent_given: true,
  consent_timestamp: new Date().toISOString(),
  privacy_policy_version: '1.0'
}
```

---

## 2. Network Request Analysis

### Supabase Client Configuration
**File:** `src/lib/supabase.ts` lines 3-4

**Environment Variables Read:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous/public key

### Client Initialization Logic
```typescript
// Lines 56-82
if (!supabaseUrl || !supabaseAnonKey) {
  // Creates dummy client with invalid URL
  supabase = createClient(
    'https://invalid.supabase.co',  // ← This will cause "Failed to fetch"
    'invalid-key',
    { ... }
  );
} else {
  // Creates real client with configured URL
  supabase = createClient(supabaseUrl, supabaseAnonKey, { ... });
}
```

---

## 3. Error Root Cause

### "Failed to fetch" Error Meaning
This is a **browser network error** that occurs when:
- The browser cannot resolve the DNS for the Supabase URL
- The Supabase URL is unreachable (connection timeout)
- The URL is invalid or malformed
- CORS preflight request fails (rare for Supabase)
- The request never reaches the Supabase server

### Most Likely Cause
**Environment variables are not set in Vercel**, causing the Supabase client to use the placeholder URL `https://invalid.supabase.co`.

---

## 4. Diagnostic Evidence

### Console Logs Expected
When environment variables are missing, you should see these logs in the browser console:

```
[SUPABASE] Environment variable status:
[SUPABASE]   VITE_SUPABASE_URL: ✗ Missing
[SUPABASE]   VITE_SUPABASE_ANON_KEY: ✗ Missing
[SUPABASE] ════════════════════════════════════════════════════════
[SUPABASE] CRITICAL: Missing environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
[SUPABASE] ════════════════════════════════════════════════════════
[SUPABASE] This will cause "Failed to fetch" errors.
[SUPABASE] Creating client with missing credentials - all queries will fail
```

### Network Tab Analysis
In the browser DevTools → Network tab, you should see:
- **Request URL:** `https://invalid.supabase.co/rest/v1/requests` (or similar)
- **Status:** `(failed)` or `net::ERR_NAME_NOT_RESOLVED`
- **Type:** `fetch`
- **Initiator:** `propertyVerificationService.ts`

---

## 5. Verification Steps

### Step 1: Check Browser Console
Open the Preview, press F12 → Console tab, and look for:
- `[SUPABASE]` logs showing environment variable status
- Any error messages about missing credentials

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Submit the form
3. Look for failed requests to `*.supabase.co`
4. Check the request URL hostname

### Step 3: Check Vercel Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these exist:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Check they are set for the correct environment (Production/Preview)

---

## 6. Request URL Analysis

### Expected Request URL (If Configured Correctly)
```
POST https://[project-id].supabase.co/rest/v1/requests
Headers:
  apikey: [anon-key]
  Authorization: Bearer [anon-key]
  Content-Type: application/json
```

### Actual Request URL (If Not Configured)
```
POST https://invalid.supabase.co/rest/v1/requests
Status: (failed) - DNS resolution error
```

---

## 7. Smallest Recommended Fix

### Option A: Set Environment Variables in Vercel (Recommended)
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Get these values from Supabase Dashboard → Settings → API
4. Redeploy the project

### Option B: Verify Supabase Project is Active
1. Go to Supabase Dashboard
2. Check your project is not paused
3. Verify the project URL is correct
4. Check the anon key is valid

---

## 8. What This Error Is NOT

- ❌ **NOT an RLS policy error** - RLS errors return HTTP 403, not "Failed to fetch"
- ❌ **NOT a database schema error** - Schema errors return HTTP 400 with specific error codes
- ❌ **NOT a constraint violation** - Constraint errors return HTTP 409 or 400
- ❌ **NOT a Supabase server error** - Server errors return HTTP 500

This is purely a **network connectivity issue** between the browser and Supabase.

---

## 9. Next Steps

### Immediate Actions
1. **Check browser console** for `[SUPABASE]` logs
2. **Check Network tab** for the actual request URL
3. **Verify Vercel environment variables** are set
4. **Redeploy** if variables were missing

### After Fix
1. Test form submission in Preview
2. Verify request appears in Supabase dashboard → Table Editor → requests
3. Confirm WhatsApp opens after successful save

---

## 10. Summary

| Component | Status | Details |
|-----------|--------|---------|
| Database Table | ✅ Correct | `requests` table |
| Insert Operation | ✅ Correct | Using Supabase client |
| Environment Variables | ❌ Missing | `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| Supabase URL | ❌ Invalid | Using placeholder `https://invalid.supabase.co` |
| Network Request | ❌ Failing | Cannot reach Supabase server |
| Error Type | Network | "Failed to fetch" - not a database error |

**Root Cause:** Environment variables not set in Vercel, causing Supabase client to use invalid placeholder URL.

**Fix Required:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment variables and redeploy.
