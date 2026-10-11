# Migration Fixes Implementation Report

## Summary
All reviewed migration fixes have been implemented in the project files. **No SQL has been executed against production.**

## Files Modified

### 1. `supabase/migrations/004_seed_districts.sql`
**Changes Applied:**
- ✅ Fixed district code `PRY` → `ALL` (Prayagraj)
- ✅ Fixed district code `AMR` → `AMP` (Amroha)
- ✅ Fixed district code `GZB` → `GZI` (Ghaziabad)
- ✅ Fixed Etah Hindi name: `'इटावा'` → `'एटा'`
- ✅ Fixed FBD entry: Faridabad → Ayodhya (`'अयोध्या'`, `'Ayodhya'`)
- ✅ Added `IF NOT EXISTS` to all 3 CREATE INDEX statements
- ✅ Added `ON CONFLICT (code) DO UPDATE SET ...` for idempotent inserts
- ✅ Updated header comment to reflect 74 districts (not 75)
- ✅ Added note about missing Bhadohi district

**Idempotency Strategy:**
```sql
ON CONFLICT (code) DO UPDATE SET
  name_hi = EXCLUDED.name_hi,
  name_en = EXCLUDED.name_en,
  division = EXCLUDED.division
WHERE districts.name_hi IS DISTINCT FROM EXCLUDED.name_hi
   OR districts.name_en IS DISTINCT FROM EXCLUDED.name_en
   OR districts.division IS DISTINCT FROM EXCLUDED.division;
```
This approach:
- Updates names/division only if they differ from existing data
- Preserves correct existing data (no blind overwrites)
- Fixes incorrect data if it exists
- Safe to rerun multiple times

### 2. `supabase/migrations/006_location_master_data.sql`
**Changes Applied:**
- ✅ Added `IF NOT EXISTS` to all 7 CREATE INDEX statements (3 for tehsils, 4 for villages)
- ✅ Added `ON CONFLICT (code) DO UPDATE SET ...` to all 10 INSERT statements
- ✅ No code changes needed (already uses correct frontend-compatible codes)

**Idempotency for Tehsils:**
```sql
ON CONFLICT (code) DO UPDATE SET
  name_hi = EXCLUDED.name_hi,
  name_en = EXCLUDED.name_en,
  district_code = EXCLUDED.district_code
WHERE tehsils.name_hi IS DISTINCT FROM EXCLUDED.name_hi
   OR tehsils.name_en IS DISTINCT FROM EXCLUDED.name_en
   OR tehsils.district_code IS DISTINCT FROM EXCLUDED.district_code;
```

**Idempotency for Villages:**
```sql
ON CONFLICT (code) DO UPDATE SET
  name_hi = EXCLUDED.name_hi,
  name_en = EXCLUDED.name_en,
  tehsil_code = EXCLUDED.tehsil_code,
  district_code = EXCLUDED.district_code
WHERE villages.name_hi IS DISTINCT FROM EXCLUDED.name_hi
   OR villages.name_en IS DISTINCT FROM EXCLUDED.name_en
   OR villages.tehsil_code IS DISTINCT FROM EXCLUDED.tehsil_code
   OR villages.district_code IS DISTINCT FROM EXCLUDED.district_code;
```

### 3. `supabase/migrations/007_location_rls_policies.sql`
**Changes Applied:**
- ✅ Added `DROP POLICY IF EXISTS` before each of the 12 CREATE POLICY statements
- ✅ Preserved all intended access rules (public read, admin-only write)

**Pattern Applied:**
```sql
DROP POLICY IF EXISTS "Anyone can view districts" ON districts;
CREATE POLICY "Anyone can view districts" ON districts
  FOR SELECT USING (true);
```

This ensures policies can be recreated without errors on re-run while maintaining the same access rules.

### 4. `src/config/districts.ts`
**Changes Applied:**
- ✅ Fixed Etah Hindi name: `'इटावा'` → `'एटा'` (line 32)
- ✅ Fixed FBD entry: Faridabad → Ayodhya (line 34)
- ✅ Added comment documenting legacy code FBD

## Admin Policy Verification

**Schema Inspection (from migration 001):**
```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'reviewer', 'field_agent')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Conclusion:** ✅ **Schema is correct.**
- The `id` column is the primary key that directly references `auth.users(id)`
- Policy condition `WHERE id = auth.uid()` correctly matches authenticated user to admin record
- No `user_id` column exists in the schema
- **No changes needed** to migration 007

**Note:** The `admin_users` table currently has zero rows, so no admin is configured. The schema is correct, but an admin record must be inserted separately for the policies to work.

## Critical Issue: Missing Bhadohi District

**Status:** ⚠️ **BLOCKED**

**Finding:** Bhadohi (Sant Ravidas Nagar) district is missing from:
- Frontend file: `src/config/districts.ts` (74 districts)
- Migration 004: `004_seed_districts.sql` (74 districts)

**Action Required:** 
1. Assign a district code for Bhadohi in the frontend
2. Add the district to `src/config/districts.ts`
3. Add the district to migration 004
4. Only then will we have the complete 75 districts

**Recommendation:** Use code `BHD` or `SRN` (Sant Ravidas Nagar) - to be decided by frontend team.

## Verification Queries

After applying migrations to production, run these queries to verify:

### 1. Verify District Count
```sql
SELECT COUNT(*) as district_count FROM districts;
-- Expected: 74 (until Bhadohi is added)
```

### 2. Verify Critical District Codes
```sql
SELECT code, name_en, name_hi 
FROM districts 
WHERE code IN ('ALL', 'AMP', 'GZI', 'GBN', 'ETA', 'FBD')
ORDER BY code;
```
**Expected:**
| code | name_en | name_hi |
|------|---------|---------|
| ALL | Prayagraj | प्रयागराज |
| AMP | Amroha | अमरोहा |
| ETA | Etah | एटा |
| FBD | Ayodhya | अयोध्या |
| GBN | Gautam Buddha Nagar | गौतम बुद्ध नगर |
| GZI | Ghaziabad | गाज़ियाबाद |

### 3. Verify Tehsil Foreign Keys
```sql
SELECT t.code, t.name_en, t.district_code, d.name_en as district_name
FROM tehsils t
JOIN districts d ON t.district_code = d.code
WHERE t.district_code IN ('ALL', 'AMP', 'GZI', 'GBN')
ORDER BY t.district_code, t.code;
```
**Expected:** All tehsils should have valid district references.

### 4. Verify Village Foreign Keys
```sql
SELECT v.code, v.name_en, v.tehsil_code, v.district_code, 
       t.name_en as tehsil_name, d.name_en as district_name
FROM villages v
JOIN tehsils t ON v.tehsil_code = t.code
JOIN districts d ON v.district_code = d.code
ORDER BY v.district_code, v.tehsil_code, v.code;
```
**Expected:** All villages should have valid tehsil and district references.

### 5. Verify RLS Policies
```sql
SELECT tablename, policyname, cmd, roles::text
FROM pg_policies 
WHERE tablename IN ('districts', 'tehsils', 'villages')
ORDER BY tablename, policyname;
```
**Expected:** 12 policies (4 per table: SELECT, INSERT, UPDATE, DELETE)

### 6. Verify Public Read Access
```sql
-- This should work without authentication
SELECT COUNT(*) FROM districts;
SELECT COUNT(*) FROM tehsils;
SELECT COUNT(*) FROM villages;
```
**Expected:** 74, 28, 12 respectively

### 7. Verify Indexes
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('districts', 'tehsils', 'villages')
ORDER BY tablename, indexname;
```
**Expected:** 13 indexes total (3 for districts, 3 for tehsils, 4 for villages, plus primary keys)

### 8. Verify Idempotency (Rerun Test)
```sql
-- Run migrations again, then verify no duplicates
SELECT code, COUNT(*) as count 
FROM districts 
GROUP BY code 
HAVING COUNT(*) > 1;
-- Expected: 0 rows (no duplicates)

SELECT code, COUNT(*) as count 
FROM tehsils 
GROUP BY code 
HAVING COUNT(*) > 1;
-- Expected: 0 rows (no duplicates)

SELECT code, COUNT(*) as count 
FROM villages 
GROUP BY code 
HAVING COUNT(*) > 1;
-- Expected: 0 rows (no duplicates)
```

## Complete Diff Summary

### Migration 004 Changes:
- Lines 1-4: Updated header comment (75 → 74 districts, added Bhadohi note)
- Line 22: `PRY` → `ALL`
- Line 25: `AMR` → `AMP`
- Line 32: `'इटावा'` → `'एटा'` (Etah)
- Line 40: `'फरीदाबाद', 'Faizabad'` → `'अयोध्या', 'Ayodhya'` (with legacy code comment)
- Line 49: `GZB` → `GZI`
- Lines 92-94: Added `IF NOT EXISTS` to indexes
- Lines 15-89: Added `ON CONFLICT DO UPDATE` clause

### Migration 006 Changes:
- Lines 18-20: Added `IF NOT EXISTS` to tehsil indexes
- Lines 36-39: Added `IF NOT EXISTS` to village indexes
- All INSERT statements: Added `ON CONFLICT DO UPDATE` clauses

### Migration 007 Changes:
- Added 12 `DROP POLICY IF EXISTS` statements (one before each CREATE POLICY)

### Frontend Changes:
- Line 32: `'इटावा'` → `'एटा'` (Etah)
- Line 34: `'फरीदाबाद', 'Faridabad'` → `'अयोध्या', 'Ayodhya'` (with legacy code comment)

## Execution Instructions

**IMPORTANT:** These migrations have NOT been executed against production. To apply:

1. Open Supabase Dashboard → SQL Editor
2. Execute migration 004 first:
   ```sql
   -- Copy entire contents of supabase/migrations/004_seed_districts.sql
   ```
3. Verify with query #1 and #2 above
4. Execute migration 006:
   ```sql
   -- Copy entire contents of supabase/migrations/006_location_master_data.sql
   ```
5. Verify with query #3 and #4 above
6. Execute migration 007:
   ```sql
   -- Copy entire contents of supabase/migrations/007_location_rls_policies.sql
   ```
7. Verify with query #5 and #6 above
8. Run all verification queries to confirm success

## Rollback Plan (If Needed)

```sql
-- Remove RLS policies
DROP POLICY IF EXISTS "Anyone can view districts" ON districts;
DROP POLICY IF EXISTS "Admins can insert districts" ON districts;
DROP POLICY IF EXISTS "Admins can update districts" ON districts;
DROP POLICY IF EXISTS "Admins can delete districts" ON districts;

DROP POLICY IF EXISTS "Anyone can view tehsils" ON tehsils;
DROP POLICY IF EXISTS "Admins can insert tehsils" ON tehsils;
DROP POLICY IF EXISTS "Admins can update tehsils" ON tehsils;
DROP POLICY IF EXISTS "Admins can delete tehsils" ON tehsils;

DROP POLICY IF EXISTS "Anyone can view villages" ON villages;
DROP POLICY IF EXISTS "Admins can insert villages" ON villages;
DROP POLICY IF EXISTS "Admins can update villages" ON villages;
DROP POLICY IF EXISTS "Admins can delete villages" ON villages;

-- Remove tables (in reverse order due to foreign keys)
DROP TABLE IF EXISTS villages;
DROP TABLE IF EXISTS tehsils;
DROP TABLE IF EXISTS districts;
```

## Next Steps

1. ✅ Migration fixes implemented in project files
2. ⏳ **BLOCKED:** Assign code for Bhadohi district in frontend
3. ⏳ Execute migrations in production (manual step)
4. ⏳ Run verification queries
5. ⏳ Add Bhadohi district once code is assigned
6. ⏳ Test UI functionality

## Status

**Migration Files:** ✅ Ready for execution  
**Frontend:** ✅ Fixed (except missing Bhadohi)  
**Production Database:** ⏳ Not yet updated  
**Bhadohi District:** ⚠️ Blocked - needs code assignment
