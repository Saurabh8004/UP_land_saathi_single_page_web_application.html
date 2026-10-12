# RLS Violation Fix - Quick Summary

## 🔴 Problem

Anonymous Property Verification submissions fail with:
```
Failed to save request: new row violates row-level security policy for table "requests"
```

## 🔍 Root Cause

**Supabase client session persistence causes role mismatch.**

When a user logs out via the UI:
- AuthContext `user` becomes `null` ✅
- BUT Supabase client still has persisted session in localStorage ❌
- Form submits with `user_id: null`
- Supabase client uses `authenticated` role (because of persisted session)
- RLS policy for `authenticated` requires `user_id = auth.uid()`
- But we're sending `user_id: null`
- Result: RLS violation ❌

## ✅ Solution

**Check actual Supabase session state and clear if needed.**

```typescript
// Check actual Supabase session
const { data: { session: currentSession } } = await supabase.auth.getSession();

// If anonymous but session exists, sign out
if (!user && currentSession) {
  await supabase.auth.signOut();
}

// Now submit with user_id: null
```

## 📁 Files Changed

- `src/App.tsx` - Added session check before anonymous submission

## 🧪 Testing

### Test 1: Anonymous After Logout
1. Login → Logout → Submit anonymous form
2. ✅ Should succeed (was failing before)

### Test 2: Anonymous (Never Logged In)
1. Open incognito → Submit anonymous form
2. ✅ Should succeed (already worked)

### Test 3: Authenticated
1. Login → Submit authenticated form
2. ✅ Should succeed (still works)

## 🔒 Security

✅ **No security risks:**
- RLS policies unchanged
- No service-role keys exposed
- No authentication bypass
- Correct role usage enforced

✅ **What's preserved:**
- Anonymous policy still requires all conditions
- Authenticated policy still requires `user_id = auth.uid()`
- No unauthorized access possible

## 🚀 Deployment

```bash
# Build
npm run build

# Commit
git add src/App.tsx
git commit -m "fix: clear persisted session for anonymous submissions"

# Push
git push
```

## 📊 Verification

After deployment, check database:
```sql
SELECT request_id, user_id, customer_name
FROM requests
WHERE service_type = 'whatsapp_verification'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected:**
- Anonymous: `user_id = NULL` ✅
- Authenticated: `user_id = <UUID>` ✅

## 📝 Summary

| Aspect | Status |
|--------|--------|
| Root cause identified | ✅ Session persistence |
| Fix implemented | ✅ Check and clear session |
| Build successful | ✅ 6.76s |
| Security maintained | ✅ No risks |
| Ready to deploy | ✅ Yes |

---

**Status:** ✅ Fix complete, ready for deployment
