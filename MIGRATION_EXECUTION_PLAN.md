# Migration Execution Plan - Location Tables Fix

## Executive Summary

The location dropdown failure is caused by missing database tables. Migrations 004, 006, and 007 were created but never executed in the production Supabase database.

**Current State:**
- ✅ `admin_users` table exists (migration 001 applied)
- ✅ `property_requests` table exists (migration 005 applied)
- ❌ `districts` table missing (migration 004 NOT applied)
- ❌ `tehsils` table missing (migration 006 NOT applied)
- ❌ `villages` table missing (migration 006 NOT applied)
- ❌ RLS policies for location tables missing (migration 007 NOT applied)

---

## Migration Analysis

### Migration 004: `004_seed_districts.sql`
**Purpose:** Create districts table and seed 75 UP districts

**Schema:**
```sql
CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_hi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  division TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Seed Data:** 75 districts (Agra, Aligarh, Amroha, Lucknow, etc.)

**Indexes:**
- `idx_districts_code` on `code`
- `idx_districts_name_en` on `name_en`
- `idx_districts_division` on `division`

**Safety:** ✅ Uses `CREATE TABLE IF NOT EXISTS` - safe to run multiple times

**Dependencies:** None

---

### Migration 006: `006_location_master_data.sql`
**Purpose:** Create tehsils and villages tables with sample data

**Schema - Tehsils:**
```sql
CREATE TABLE IF NOT EXISTS tehsils (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_hi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  district_code TEXT NOT NULL REFERENCES districts(code) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Schema - Villages:**
```sql
CREATE TABLE IF NOT EXISTS villages (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_hi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  tehsil_code TEXT NOT NULL REFERENCES tehsils(code) ON DELETE CASCADE,
  district_code TEXT NOT NULL REFERENCES districts(code) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Seed Data:**
- **Tehsils:** 28 tehsils across 10 major districts (Agra, Amroha, Aligarh, Lucknow, Kanpur, Prayagraj, Varanasi, Meerut, Ghaziabad, Noida)
- **Villages:** 12 villages (5 in Amroha, 2 in Hasanpur, 3 in Agra, 2 in Fatehabad)

**Indexes:**
- `idx_tehsils_district_code` on `district_code`
- `idx_tehsils_code` on `code`
- `idx_tehsils_name_en` on `name_en`
- `idx_villages_tehsil_code` on `tehsil_code`
- `idx_villages_district_code` on `district_code`
- `idx_villages_code` on `code`
- `idx_villages_name_en` on `name_en`

**Safety:** ✅ Uses `CREATE TABLE IF NOT EXISTS` - safe to run multiple times

**Dependencies:** ⚠️ **Requires `districts` table to exist first** (foreign key constraint)

---

### Migration 007: `007_location_rls_policies.sql`
**Purpose:** Enable RLS and create access policies for location tables

**Operations:**
1. Enable RLS on `districts`, `tehsils`, `villages`
2. Create SELECT policies (public read access)
3. Create INSERT/UPDATE/DELETE policies (admin-only write access)

**Policies Created:**
- `Anyone can view districts` - SELECT (public)
- `Admins can insert districts` - INSERT (admin only)
- `Admins can update districts` - UPDATE (admin only)
- `Admins can delete districts` - DELETE (admin only)
- Same pattern for `tehsils` and `villages`

**Safety:** ⚠️ **Requires all three tables to exist first**

**Dependencies:** ⚠️ Requires migrations 004 and 006 to be applied first

---

## Execution Order

### Required Order (Strict)
```
1. 004_seed_districts.sql          ← Creates districts table
2. 006_location_master_data.sql    ← Creates tehsils + villages (depends on districts)
3. 007_location_rls_policies.sql   ← Adds RLS policies (depends on all three tables)
```

**Why This Order?**
- Migration 006 has foreign key: `district_code TEXT NOT NULL REFERENCES districts(code)`
- Migration 007 references all three tables in ALTER TABLE statements
- Running out of order will cause foreign key constraint errors

---

## Pre-Execution Checklist

### Step 1: Verify Current Database State
Run these queries in Supabase SQL Editor to confirm current state:

```sql
-- Check which tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('districts', 'tehsils', 'villages', 'admin_users', 'property_requests')
ORDER BY table_name;

-- Expected result: admin_users, property_requests (districts, tehsils, villages should be missing)
```

### Step 2: Backup Existing Data (Optional but Recommended)
```sql
-- Backup property_requests if it has data
SELECT COUNT(*) FROM property_requests;

-- If count > 0, consider exporting data first
-- Supabase Dashboard → Table Editor → property_requests → Export
```

### Step 3: Verify No Conflicts
```sql
-- Check if any tables with similar names exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%district%' 
       OR table_name LIKE '%tehsil%' 
       OR table_name LIKE '%village%');

-- Expected result: empty (no conflicts)
```

---

## Execution Procedure

### Step 1: Apply Migration 004 (Districts)

**File:** `supabase/migrations/004_seed_districts.sql`

**Action:**
1. Open Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy entire contents of `004_seed_districts.sql`
4. Paste into SQL Editor
5. Click "Run" (or press Ctrl+Enter)

**Expected Output:**
```
Success. No rows returned
```

**Verification:**
```sql
-- Verify districts table was created
SELECT COUNT(*) as district_count FROM districts;
-- Expected: 75

-- Verify sample data
SELECT code, name_en, name_hi, division 
FROM districts 
WHERE name_en IN ('Agra', 'Amroha', 'Lucknow')
ORDER BY name_en;
-- Expected: 3 rows with correct data
```

---

### Step 2: Apply Migration 006 (Tehsils + Villages)

**File:** `supabase/migrations/006_location_master_data.sql`

**Action:**
1. Open Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy entire contents of `006_location_master_data.sql`
4. Paste into SQL Editor
5. Click "Run"

**Expected Output:**
```
Success. No rows returned
```

**Verification:**
```sql
-- Verify tehsils table was created
SELECT COUNT(*) as tehsil_count FROM tehsils;
-- Expected: 28

-- Verify villages table was created
SELECT COUNT(*) as village_count FROM villages;
-- Expected: 12

-- Verify Amroha tehsils
SELECT code, name_en, name_hi, district_code 
FROM tehsils 
WHERE district_code = 'AMP'
ORDER BY name_en;
-- Expected: 2 rows (Amroha, Hasanpur)

-- Verify Amroha villages
SELECT code, name_en, name_hi, tehsil_code, district_code 
FROM villages 
WHERE district_code = 'AMP'
ORDER BY name_en;
-- Expected: 7 rows (5 in Amroha tehsil, 2 in Hasanpur tehsil)

-- Verify foreign key constraints work
SELECT t.code as tehsil_code, t.name_en as tehsil_name, d.name_en as district_name
FROM tehsils t
JOIN districts d ON t.district_code = d.code
WHERE d.name_en = 'Amroha';
-- Expected: 2 rows
```

---

### Step 3: Apply Migration 007 (RLS Policies)

**File:** `supabase/migrations/007_location_rls_policies.sql`

**Action:**
1. Open Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy entire contents of `007_location_rls_policies.sql`
4. Paste into SQL Editor
5. Click "Run"

**Expected Output:**
```
Success. No rows returned
```

**Verification:**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('districts', 'tehsils', 'villages');
-- Expected: all three tables should have rowsecurity = true

-- Verify policies were created
SELECT tablename, policyname, cmd, roles::text
FROM pg_policies 
WHERE tablename IN ('districts', 'tehsils', 'villages')
ORDER BY tablename, policyname;
-- Expected: 12 rows (4 policies per table)

-- Verify public read access works (test as anonymous user)
-- This should return data without authentication
SELECT COUNT(*) FROM districts;
-- Expected: 75 (if RLS is working correctly)
```

---

## Post-Execution Verification

### Complete Verification Suite

Run all these queries to confirm everything is working:

```sql
-- 1. Verify all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('districts', 'tehsils', 'villages')
ORDER BY table_name;
-- Expected: districts, tehsils, villages

-- 2. Verify record counts
SELECT 'districts' as table_name, COUNT(*) as count FROM districts
UNION ALL
SELECT 'tehsils', COUNT(*) FROM tehsils
UNION ALL
SELECT 'villages', COUNT(*) FROM villages;
-- Expected: districts=75, tehsils=28, villages=12

-- 3. Verify Amroha test data (critical for UI testing)
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
-- Expected: 1 row with codes: AMP, AMP001, 117978

-- 4. Verify RLS policies
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('districts', 'tehsils', 'villages')
ORDER BY tablename, cmd;
-- Expected: 12 policies (SELECT, INSERT, UPDATE, DELETE for each table)

-- 5. Verify indexes exist
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('districts', 'tehsils', 'villages')
ORDER BY tablename, indexname;
-- Expected: 10 indexes total
```

---

## RLS Policy Explanation

### Public Read Access (SELECT)
```sql
CREATE POLICY "Anyone can view districts" ON districts
  FOR SELECT USING (true);
```
**Meaning:** Anyone (authenticated or anonymous) can read district data.

**Why Safe?**
- Location data is public government information
- No sensitive personal data
- Required for frontend dropdown functionality
- Standard practice for reference data

### Admin-Only Write Access (INSERT/UPDATE/DELETE)
```sql
CREATE POLICY "Admins can insert districts" ON districts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );
```
**Meaning:** Only users in `admin_users` table with `is_active = true` can modify location data.

**Why Safe?**
- Prevents unauthorized modifications
- Maintains data integrity
- Requires explicit admin role assignment
- Uses existing `admin_users` table (already exists in production)

---

## Data Coverage Analysis

### What's Included

**Districts:** ✅ All 75 UP districts
- Complete coverage of Uttar Pradesh
- Official district codes
- Hindi and English names
- Division information

**Tehsils:** ⚠️ Partial coverage (28 tehsils in 10 districts)
- Agra (4 tehsils)
- Amroha (2 tehsils)
- Aligarh (4 tehsils)
- Lucknow (3 tehsils)
- Kanpur Nagar (2 tehsils)
- Prayagraj (4 tehsils)
- Varanasi (3 tehsils)
- Meerut (3 tehsils)
- Ghaziabad (2 tehsils)
- Noida (2 tehsils)

**Villages:** ⚠️ Sample data only (12 villages)
- Amroha district: 7 villages
- Agra district: 5 villages

### What's Missing

**Tehsils:** 65 districts have no tehsil data
- Users selecting these districts will see empty Tehsil dropdown
- This is acceptable for MVP - can be expanded later

**Villages:** Most tehsils have no village data
- Users selecting these tehsils will see empty Village dropdown
- This is acceptable for MVP - can be expanded later

**Impact on UI:**
- District dropdown: ✅ Works for all 75 districts
- Tehsil dropdown: ✅ Works for 10 major districts, empty for others
- Village dropdown: ✅ Works for sample villages, empty for others
- User experience: Clear empty states, no errors

---

## Rollback Plan (If Needed)

If something goes wrong, you can rollback:

```sql
-- Rollback migration 007 (remove RLS policies)
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

-- Rollback migration 006 (remove tehsils and villages tables)
DROP TABLE IF EXISTS villages;
DROP TABLE IF EXISTS tehsils;

-- Rollback migration 004 (remove districts table)
DROP TABLE IF EXISTS districts;
```

**Warning:** This will delete all location data. Only use if absolutely necessary.

---

## Expected Outcome

After successful execution:

1. ✅ `districts` table exists with 75 records
2. ✅ `tehsils` table exists with 28 records
3. ✅ `villages` table exists with 12 records
4. ✅ RLS enabled on all three tables
5. ✅ Public read access working
6. ✅ Admin write access restricted
7. ✅ District dropdown loads in UI
8. ✅ Tehsil dropdown loads for supported districts
9. ✅ Village dropdown loads for supported tehsils
10. ✅ Test case works: Amroha → Amroha → Atairana

---

## Next Steps After Migration

Once migrations are applied successfully:

1. **Test the UI:**
   - Open Property Search page
   - Select Amroha district
   - Select Amroha tehsil
   - Select Atairana village
   - Verify codes are correct

2. **Monitor for errors:**
   - Check browser console for any Supabase errors
   - Verify no "Failed to load districts" message
   - Confirm dropdowns populate correctly

3. **Expand data (future):**
   - Add tehsils for remaining 65 districts
   - Add villages for all tehsils
   - This can be done incrementally without code changes

---

## Support

If you encounter errors during execution:

**Error: "relation already exists"**
- Migration was already applied partially
- Check which tables exist and skip that migration

**Error: "foreign key constraint violation"**
- Migrations applied in wrong order
- Must apply 004 before 006

**Error: "permission denied"**
- Not running as database owner
- Use Supabase SQL Editor (has full permissions)

**Error: "column does not exist"**
- Schema mismatch
- Verify migration files match expected schema

---

## Summary

**Files to Apply:**
1. `supabase/migrations/004_seed_districts.sql`
2. `supabase/migrations/006_location_master_data.sql`
3. `supabase/migrations/007_location_rls_policies.sql`

**Order:** Strict (004 → 006 → 007)

**Safety:** All migrations use `IF NOT EXISTS` - safe to run multiple times

**Time Required:** ~5 minutes

**Risk Level:** Low (no data loss, no schema conflicts)

**Rollback:** Possible (see rollback plan above)
