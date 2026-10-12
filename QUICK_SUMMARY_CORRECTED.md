# Schema Reconciliation - Quick Summary

## ✅ Code is CORRECT

**Column name `mobile` is correct** - matches production schema exactly.

No code changes needed.

---

## 🔴 Actual Blockers (2 issues)

### Blocker #1: user_id NOT NULL Constraint

**Production:** `user_id UUID NOT NULL`  
**Code:** `user_id: data.user_id || null` (tries to insert NULL for anonymous)  
**Result:** ❌ Will fail with constraint violation

**Fix:** Apply migration 010
```sql
ALTER TABLE requests ALTER COLUMN user_id DROP NOT NULL;
```

---

### Blocker #2: RLS Policy Blocks Anonymous

**Production:** Policy only allows `authenticated` role  
**Code:** Anonymous users have `anon` role  
**Result:** ❌ Will fail with RLS violation

**Fix:** Add new policy
```sql
CREATE POLICY "Allow anonymous property verification" ON requests
  FOR INSERT TO anon
  WITH CHECK (
    user_id IS NULL 
    AND service_type = 'whatsapp_verification'
    AND package_code = 'free'
    AND customer_name IS NOT NULL
    AND mobile IS NOT NULL
    AND district IS NOT NULL
  );
```

---

## 📊 Verification

### Code Payload ✅
```typescript
{
  mobile: data.mobile_number,  // ✅ CORRECT (matches production)
  user_id: data.user_id || null,  // ❌ BLOCKED (user_id NOT NULL)
  service_type: 'whatsapp_verification',  // ✅ CORRECT
  package_code: 'free',  // ✅ CORRECT
  customer_name: data.full_name,  // ✅ CORRECT
  district: data.district,  // ✅ CORRECT
  // ... other fields
}
```

### Production Schema ✅
```sql
mobile TEXT NOT NULL  -- ✅ Code uses correct column name
user_id UUID NOT NULL  -- ❌ Must be made nullable
```

---

## 🎯 Required Actions

### Step 1: Apply Migration 010
```sql
ALTER TABLE requests ALTER COLUMN user_id DROP NOT NULL;
```

### Step 2: Add Anonymous Policy
```sql
CREATE POLICY "Allow anonymous property verification" ON requests
  FOR INSERT TO anon
  WITH CHECK (
    user_id IS NULL 
    AND service_type = 'whatsapp_verification'
    AND package_code = 'free'
    AND customer_name IS NOT NULL
    AND mobile IS NOT NULL
    AND district IS NOT NULL
  );
```

### Step 3: Test
- Anonymous submission → `user_id = NULL` ✅
- Authenticated submission → `user_id = UUID` ✅
- WhatsApp opens after success ✅

---

## ✅ What's Already Correct

- ✅ Code uses `mobile` column (not `customer_mobile`)
- ✅ All column names match production schema
- ✅ `service_type` and `package_code` match policy requirements
- ✅ Frontend code already updated for anonymous submissions
- ✅ No code changes needed

---

## ❌ What Needs Fixing

- 🔴 `user_id` NOT NULL constraint (migration 010)
- 🔴 RLS policy for anonymous inserts (new policy)

---

## 📝 Summary

**Code Status:** ✅ CORRECT (no changes needed)  
**Column Names:** ✅ CORRECT (`mobile` matches production)  
**Blockers:** 🔴 2 database issues (user_id constraint + RLS policy)  
**Solution:** Apply migration 010 + add anonymous policy  
**Time:** ~5 minutes to fix  

---

**Status:** ⏳ Ready for database changes (no code changes required)
