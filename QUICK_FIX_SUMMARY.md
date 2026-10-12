# Anonymous RLS Fix - Quick Summary

## 🔴 Problem
Anonymous Property Verification submissions fail with RLS violation after user logout.

## 🔍 Root Cause
Supabase client session persistence causes role mismatch. Even after `signOut()`, the client may still use `authenticated` role instead of `anon`.

## ✅ Solution
Created separate `supabaseAnon` client with `persistSession: false` for anonymous operations.

## 📁 Files Changed
1. `src/lib/supabase.ts` - Added `supabaseAnon` client
2. `src/services/propertyVerificationService.ts` - Use appropriate client
3. `src/App.tsx` - Removed problematic `signOut()` logic

## 🧪 How It Works

### Anonymous Submission
```
user_id = null
  ↓
Use supabaseAnon client (persistSession: false)
  ↓
Always uses 'anon' role
  ↓
Matches anonymous RLS policy
  ↓
✅ Success
```

### Authenticated Submission
```
user_id = <UUID>
  ↓
Use supabase client (with session)
  ↓
Uses 'authenticated' role
  ↓
Matches authenticated RLS policy
  ↓
✅ Success
```

## 🚀 Deploy

```bash
git add src/lib/supabase.ts src/services/propertyVerificationService.ts src/App.tsx
git commit -m "fix: use separate anonymous client for Property Verification"
git push
```

## ✅ Build Status
- Build successful (6.91s)
- No TypeScript errors
- Ready for deployment

## 📚 Full Documentation
See `FINAL_FIX_ANONYMOUS_RLS.md` for complete technical details.
