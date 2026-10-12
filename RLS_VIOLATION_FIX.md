# RLS Violation Fix - Session Persistence Issue

## 🔴 Root Cause Identified

**The Problem:** Supabase client session persistence causes RLS violations for anonymous submissions.

### Technical Details

1. **Supabase Client Configuration:**
   - `persistSession: true` - Sessions persist in localStorage
   - `detectSessionInUrl: true` - Detects session from URL parameters

2. **The Issue:**
   - When a user logs in, their session is stored in localStorage
   - When they log out via the UI, the AuthContext `user` state becomes `null`
   - BUT the Supabase client may still have a valid session in localStorage
   - When the anonymous form submits, the Supabase client uses the `authenticated` role (because of the persisted session)
   - The RLS policy for `authenticated` role (`requests_insert_own`) requires `user_id = auth.uid()`
   - But the code sends `user_id: null`
   - Result: RLS violation

3. **Why This Happens:**
   - AuthContext and Supabase client maintain separate session states
   - AuthContext can show `user = null` while Supabase client still has a valid session
   - The form checks AuthContext's `user` state, but the insert uses Supabase client's session

## ✅ The Fix

### Code Change in `src/App.tsx`

```typescript
// Before submitting, check actual Supabase session state
const { data: { session: currentSession } } = await supabase.auth.getSession();

// If we want to submit anonymously but there's a persisted session, sign out first
if (!user && currentSession) {
  console.log('[PROPERTY_VERIFICATION] Clearing persisted session for anonymous submission');
  await supabase.auth.signOut();
}

// Now submit with user_id: null
const result = await savePropertyVerificationRequest({
  user_id: user?.id || null,
  // ... other fields
});
```

### How It Works

1. **Check Supabase Session:** Before submitting, we check the actual Supabase session state (not just AuthContext)
2. **Clear if Needed:** If the user is anonymous (`!user`) but there's a persisted session (`currentSession`), we sign out
3. **Submit Anonymously:** Now the Supabase client will use the `anon` role, and the RLS policy will allow `user_id: null`

## 🔒 Security Analysis

### What This Fix Does

✅ **Ensures correct role usage:**
- Anonymous submissions use `anon` role
- Authenticated submissions use `authenticated` role

✅ **Preserves RLS security:**
- Anonymous policy still requires all conditions
- Authenticated policy still requires `user_id = auth.uid()`
- No RLS policies are weakened

✅ **No security risks:**
- We're not bypassing authentication
- We're not exposing service-role keys
- We're not modifying RLS policies
- We're just ensuring the correct role is used

### What This Fix Does NOT Do

❌ Does not allow anonymous users to:
- View other users' requests
- Update or delete any requests
- Access authenticated-only features

❌ Does not weaken the anonymous policy:
- Still requires `user_id IS NULL`
- Still requires `service_type = 'whatsapp_verification'`
- Still requires `package_code = 'free'`
- Still requires all other conditions

## 🧪 Testing

### Test 1: Anonymous Submission After Logout

**Scenario:** User logs in, then logs out, then submits anonymous form

**Before Fix:**
1. User logs in → session stored in localStorage
2. User logs out → AuthContext `user` becomes `null`
3. User submits anonymous form
4. Supabase client still has persisted session
5. Uses `authenticated` role
6. RLS violation: `user_id = null` doesn't match `user_id = auth.uid()`
7. ❌ Error: "new row violates row-level security policy"

**After Fix:**
1. User logs in → session stored in localStorage
2. User logs out → AuthContext `user` becomes `null`
3. User submits anonymous form
4. Code checks Supabase session → finds persisted session
5. Code calls `signOut()` → clears persisted session
6. Supabase client now uses `anon` role
7. RLS policy allows `user_id: null` for `anon` role
8. ✅ Success: Request saved with `user_id = NULL`

### Test 2: Anonymous Submission (Never Logged In)

**Scenario:** User visits site, never logs in, submits anonymous form

**Before Fix:**
1. User never logs in → no session in localStorage
2. User submits anonymous form
3. Supabase client uses `anon` role (no session)
4. RLS policy allows `user_id: null`
5. ✅ Success (this case already worked)

**After Fix:**
1. User never logs in → no session in localStorage
2. User submits anonymous form
3. Code checks Supabase session → no session found
4. No signOut() needed
5. Supabase client uses `anon` role
6. RLS policy allows `user_id: null`
7. ✅ Success (still works)

### Test 3: Authenticated Submission

**Scenario:** User logs in and submits authenticated form

**Before Fix:**
1. User logs in → session stored
2. User submits authenticated form
3. Supabase client uses `authenticated` role
4. Code sends `user_id: user.id`
5. RLS policy allows `user_id = auth.uid()`
6. ✅ Success

**After Fix:**
1. User logs in → session stored
2. User submits authenticated form
3. Code checks: `user` is not null → no signOut()
4. Supabase client uses `authenticated` role
5. Code sends `user_id: user.id`
6. RLS policy allows `user_id = auth.uid()`
7. ✅ Success (still works)

## 📊 Verification Queries

### Check for Persisted Sessions

```sql
-- This query shows recent anonymous submissions
SELECT 
  request_id,
  user_id,
  customer_name,
  mobile,
  service_type,
  package_code,
  created_at
FROM requests
WHERE user_id IS NULL
  AND service_type = 'whatsapp_verification'
ORDER BY created_at DESC
LIMIT 10;
```

**Expected:** Anonymous submissions should now succeed and appear here.

### Check RLS Policies

```sql
SELECT 
  policyname,
  cmd,
  roles::text,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'requests'
ORDER BY policyname;
```

**Expected:**
- `Allow anonymous property verification` - INSERT, anon role
- `requests_insert_own` - INSERT, authenticated role
- `requests_select_own` - SELECT, authenticated role
- `requests_update_own` - UPDATE, authenticated role

## 🚀 Deployment Steps

### Step 1: Apply Code Fix

The fix has been applied to `src/App.tsx`. The key change:

```typescript
// Check actual Supabase session state
const { data: { session: currentSession } } = await supabase.auth.getSession();

// Clear persisted session for anonymous submissions
if (!user && currentSession) {
  console.log('[PROPERTY_VERIFICATION] Clearing persisted session for anonymous submission');
  await supabase.auth.signOut();
}
```

### Step 2: Build and Deploy

```bash
# Build the project
npm run build

# Commit the changes
git add src/App.tsx
git commit -m "fix: clear persisted session for anonymous Property Verification submissions

- Check actual Supabase session state before anonymous submission
- Clear persisted session if user is anonymous but session exists
- Ensures anon role is used for anonymous submissions
- Prevents RLS violations from session persistence
- Preserves authenticated submission flow"

# Push and deploy
git push
```

### Step 3: Test in Production

1. **Test Anonymous After Logout:**
   - Login to the site
   - Logout
   - Submit Property Verification form (anonymous)
   - ✅ Should succeed

2. **Test Anonymous (Never Logged In):**
   - Open incognito window
   - Submit Property Verification form
   - ✅ Should succeed

3. **Test Authenticated:**
   - Login to the site
   - Submit Booking form (authenticated)
   - ✅ Should succeed

4. **Verify Database:**
   ```sql
   SELECT request_id, user_id, customer_name
   FROM requests
   WHERE service_type = 'whatsapp_verification'
   ORDER BY created_at DESC
   LIMIT 5;
   ```
   - Anonymous submissions should have `user_id = NULL`
   - Authenticated submissions should have `user_id = <UUID>`

## 📝 Summary

### The Problem
Supabase client session persistence caused RLS violations for anonymous submissions. When a user logged out via the UI, the AuthContext showed `user = null`, but the Supabase client still had a valid session in localStorage. This caused the client to use the `authenticated` role instead of the `anon` role, triggering RLS violations.

### The Solution
Before submitting an anonymous request, check the actual Supabase session state. If there's a persisted session but the user is anonymous, sign out to clear the session. This ensures the Supabase client uses the correct `anon` role for anonymous submissions.

### The Impact
- ✅ Anonymous submissions now work correctly
- ✅ Authenticated submissions still work
- ✅ No security risks
- ✅ No RLS policy changes needed
- ✅ No database schema changes needed

### Files Changed
- `src/App.tsx` - Added session check and signOut for anonymous submissions

### Build Status
✅ Build successful (6.76s)

---

**Status:** ✅ Fix applied, build successful, ready for deployment and testing
