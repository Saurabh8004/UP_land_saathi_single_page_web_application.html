# Location Tables Migration - Investigation Report

## Executive Summary

**Root Cause Identified:** The "Failed to load districts" error occurs because migrations 004, 006, and 007 were created in the codebase but never executed in the production Supabase database.

**Current State:**
- ✅ `admin_users` table exists
- ✅ `property_requests` table exists  
- ❌ `districts` table missing
- ❌ `tehsils` table missing
- ❌ `villages` table missing
- ❌ RLS policies for location tables missing

**Solution:** Execute three migration files in strict order to create the missing tables and enable proper access controls.

---

## Investigation Findings

### 1. Migration File Analysis

#### Migration 004: `004_seed_districts.sql`
- **Status:** Not applied
- **Purpose:** Create `districts` table and seed 75 UP districts
- **Safety:** ✅ Uses `CREATE TABLE IF NOT EXISTS`
- **Dependencies:** None
- **Data:** 75 complete district records with codes, names (Hindi/English), divisions

#### Migration 006: `006_location_master_data.sql`
- **Status:** Not applied
- **Purpose:** Create `tehsils` and `villages` tables with sample data
- **Safety:** ✅ Uses `CREATE TABLE IF NOT EXISTS`
- **Dependencies:** ⚠️ Requires `districts` table (foreign key constraint)
- **Data:** 
  - 28 tehsils across 10 major districts
  - 12 sample villages (Amroha and Agra districts only)

#### Migration 007: `007_location_rls_policies.sql`
- **Status:** Not applied
- **Purpose:** Enable RLS and create access policies
- **Safety:** ✅ Uses conditional policy creation
- **Dependencies:** ⚠️ Requires all three location tables
- **Policies:** 12 total (SELECT public, INSERT/UPDATE/DELETE admin-only)

### 2. Dependency Chain

```
004_seed_districts.sql
    ↓ (creates districts table)
006_location_master_data.sql
    ↓ (creates tehsils + villages, references districts)
007_location_rls_policies.sql
    ↓ (adds RLS policies to all three tables)
```

**Critical:** Must execute in this exact order. Migration 006 has foreign key constraints that reference the `districts` table.

### 3. Schema Compatibility

All migrations use `CREATE TABLE IF NOT EXISTS`, making them safe to run even if partially applied. No conflicts with existing tables.

### 4. Data Coverage

**Districts:** ✅ Complete (75/75 UP districts)
**Tehsils:** ⚠️ Partial (28 tehsils in 10 major districts)
**Villages:** ⚠️ Sample data only (12 villages)

**Impact:** 
- District dropdown will work for all 75 districts
- Tehsil dropdown will work for 10 major districts, empty for others
- Village dropdown will work for sample villages, empty for others
- This is acceptable for MVP and can be expanded incrementally

---

## Execution Plan

### Required Files (In Order)

1. **`supabase/migrations/004_seed_districts.sql`**
   - Creates districts table
   - Seeds 75 UP districts
   - Creates indexes

2. **`supabase/migrations/006_location_master_data.sql`**
   - Creates tehsils table (references districts)
   - Creates villages table (references tehsils and districts)
   - Seeds 28 tehsils and 12 villages
   - Creates indexes

3. **`supabase/migrations/007_location_rls_policies.sql`**
   - Enables RLS on all three tables
   - Creates public SELECT policies
   - Creates admin-only INSERT/UPDATE/DELETE policies

### Execution Method

**Option 1: Supabase SQL Editor (Recommended)**
1. Open Supabase Dashboard → SQL Editor
2. Execute each migration file separately in order
3. Run verification queries after each step
4. Confirm success before proceeding to next migration

**Option 2: Supabase CLI**
```bash
supabase db push
```
This will apply all pending migrations automatically in the correct order.

---

## Pre-Execution Verification

Run these queries to confirm current state:

```sql
-- Check which tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('districts', 'tehsils', 'villages', 'admin_users', 'property_requests')
ORDER BY table_name;

-- Expected: admin_users, property_requests (others should be missing)
```

---

## Post-Execution Verification

### Step 1: Verify Tables Created

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('districts', 'tehsils', 'villages')
ORDER BY table_name;

-- Expected: districts, tehsils, villages
```

### Step 2: Verify Record Counts

```sql
SELECT 'districts' as table_name, COUNT(*) as count FROM districts
UNION ALL
SELECT 'tehsils', COUNT(*) FROM tehsils
UNION ALL
SELECT 'villages', COUNT(*) FROM villages;

-- Expected: districts=75, tehsils=28, villages=12
```

### Step 3: Verify Test Data (Critical)

```sql
-- Test: Amroha → Amroha → Atairana
SELECT 
  d.code as district_code,
  d.name_en as district_name,
  t.code as tehsil_code,
  t.name_en as tehsil_name,
  v.code as village_code,
  v.name_en as village_name
FROM districts d
JOIN tehsils t ON t.district_code = d.code
JOIN villages v ON v.tehsil_code = t.code AND v.district_code = d.code
WHERE d.name_en = 'Amroha' 
  AND t.name_en = 'Amroha'
  AND v.name_en = 'Atairana';

-- Expected: 1 row with codes AMP, AMP001, 117978
```

### Step 4: Verify RLS Policies

```sql
SELECT tablename, policyname, cmd, roles::text
FROM pg_policies 
WHERE tablename IN ('districts', 'tehsils', 'villages')
ORDER BY tablename, policyname;

-- Expected: 12 policies (4 per table)
```

### Step 5: Test Public Read Access

```sql
-- This should work without authentication
SELECT COUNT(*) FROM districts;
SELECT COUNT(*) FROM tehsils;
SELECT COUNT(*) FROM villages;

-- Expected: 75, 28, 12 respectively
```

---

## RLS Policy Summary

### Public Read Access (SELECT)
- **Policy:** `Anyone can view [table]`
- **Access:** Public (authenticated and anonymous)
- **Rationale:** Location data is public government information

### Admin-Only Write Access (INSERT/UPDATE/DELETE)
- **Policy:** `Admins can [action] [table]`
- **Access:** Only users in `admin_users` table with `is_active = true`
- **Rationale:** Prevents unauthorized modifications to reference data

---

## Risk Assessment

### Low Risk Factors
- ✅ All migrations use `IF NOT EXISTS` - safe to run multiple times
- ✅ No conflicts with existing tables
- ✅ No data loss risk
- ✅ Rollback possible (see below)

### Medium Risk Factors
- ⚠️ Foreign key constraints require strict execution order
- ⚠️ Partial data coverage (not all districts have tehsils/villages)

### Mitigation
- Execute migrations in exact order
- Run verification queries after each step
- Stop immediately if any error occurs

---

## Rollback Plan

If issues occur, rollback in reverse order:

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

-- Remove tables
DROP TABLE IF EXISTS villages;
DROP TABLE IF EXISTS tehsils;
DROP TABLE IF EXISTS districts;
```

---

## Expected Outcome

After successful execution:

1. ✅ District dropdown loads all 75 UP districts
2. ✅ Tehsil dropdown loads for 10 major districts
3. ✅ Village dropdown loads for sample villages
4. ✅ Test case works: Amroha → Amroha → Atairana
5. ✅ No "Failed to load districts" error
6. ✅ RLS properly configured
7. ✅ Public read access working
8. ✅ Admin write access restricted

---

## Next Steps

### Immediate Actions
1. Review this report
2. Backup existing data (optional but recommended)
3. Execute migrations in order using Supabase SQL Editor
4. Run all verification queries
5. Test UI functionality

### After Success
1. Test complete user flow in UI
2. Monitor for any errors
3. Consider expanding tehsil/village data for other districts
4. Document the migration in deployment notes

---

## Support Information

### If Errors Occur

**"relation already exists"**
- Migration was partially applied
- Check which tables exist and adjust accordingly

**"foreign key constraint violation"**
- Migrations executed in wrong order
- Must apply 004 before 006

**"permission denied"**
- Not running with sufficient privileges
- Use Supabase SQL Editor (has full permissions)

### Contact
Refer to `MIGRATION_EXECUTION_PLAN.md` for detailed step-by-step instructions.

---

## Conclusion

The root cause is confirmed: migrations exist but were never executed. The solution is straightforward - apply three migration files in the correct order. All migrations are safe, use conditional creation, and have no conflicts with existing data.

**Recommendation:** Proceed with execution following the detailed plan in `MIGRATION_EXECUTION_PLAN.md`.

**Estimated Time:** 5-10 minutes
**Risk Level:** Low
**Rollback:** Possible
