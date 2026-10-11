# Location Tables - Complete Investigation Report

## Executive Summary

**Status:** Migration files exist in the project but were never applied to the production database.

**Root Cause:** The frontend expects `districts`, `tehsils`, and `villages` tables in Supabase, but these tables don't exist in the production database because migrations 004, 006, and 007 were never executed.

---

## Investigation Results

### 1. Migration Files Status

✅ **All migration files exist in the project:**

```
supabase/migrations/
├── 001_initial_schema.sql          ✅ Applied (admin_users exists)
├── 002_rls_policies.sql            ✅ Applied (RLS enabled on existing tables)
├── 003_storage_policies.sql        ✅ Applied (storage buckets configured)
├── 004_seed_districts.sql          ❌ NOT APPLIED (districts table missing)
├── 005_property_requests.sql       ✅ Applied (property_requests exists)
├── 006_location_master_data.sql    ❌ NOT APPLIED (tehsils/villages missing)
└── 007_location_rls_policies.sql   ❌ NOT APPLIED (RLS policies missing)
```

### 2. Frontend Schema Expectations

**File:** `src/services/locationService.ts`

The frontend expects these exact table structures:

#### Districts Table
```sql
SELECT code, name_en, name_hi
FROM districts
WHERE is_active = true
ORDER BY name_en;
```

**Required columns:**
- `code` (TEXT, UNIQUE) - District code (e.g., 'AMP', 'AGR')
- `name_en` (TEXT) - English name
- `name_hi` (TEXT) - Hindi name
- `is_active` (BOOLEAN) - Active flag

#### Tehsils Table
```sql
SELECT code, name_en, name_hi, district_code
FROM tehsils
WHERE district_code = $1
  AND is_active = true
ORDER BY name_en;
```

**Required columns:**
- `code` (TEXT, UNIQUE) - Tehsil code
- `name_en` (TEXT) - English name
- `name_hi` (TEXT) - Hindi name
- `district_code` (TEXT) - Foreign key to districts.code
- `is_active` (BOOLEAN) - Active flag

#### Villages Table
```sql
SELECT code, name_en, name_hi, tehsil_code, district_code
FROM villages
WHERE district_code = $1
  AND tehsil_code = $2
  AND is_active = true
ORDER BY name_en;
```

**Required columns:**
- `code` (TEXT, UNIQUE) - Village code
- `name_en` (TEXT) - English name
- `name_hi` (TEXT) - Hindi name
- `tehsil_code` (TEXT) - Foreign key to tehsils.code
- `district_code` (TEXT) - Foreign key to districts.code
- `is_active` (BOOLEAN) - Active flag

### 3. Static District Data

**File:** `src/config/districts.ts`

Contains 75 verified UP districts with codes:

```typescript
export const DISTRICTS: District[] = [
  { code: 'AGR', name_hi: 'आगरा', name_en: 'Agra' },
  { code: 'ALG', name_hi: 'अलीगढ़', name_en: 'Aligarh' },
  { code: 'ALL', name_hi: 'प्रयागराज', name_en: 'Prayagraj' },
  { code: 'AMP', name_hi: 'अमरोहा', name_en: 'Amroha' },
  // ... 71 more districts
];
```

**Total:** 75 districts with verified codes

### 4. Migration File Contents

#### Migration 004: `004_seed_districts.sql`
- Creates `districts` table
- Seeds 75 UP districts from verified data
- Creates indexes on code, name_en, division
- **Status:** File exists, not applied to database

#### Migration 006: `006_location_master_data.sql`
- Creates `tehsils` table (references districts)
- Creates `villages` table (references tehsils and districts)
- Seeds 28 tehsils across 10 major districts
- Seeds 12 sample villages (Amroha and Agra only)
- Creates indexes
- **Status:** File exists, not applied to database

#### Migration 007: `007_location_rls_policies.sql`
- Enables RLS on all three location tables
- Creates public SELECT policies (anyone can read)
- Creates admin-only INSERT/UPDATE/DELETE policies
- **Status:** File exists, not applied to database

### 5. Data Coverage Analysis

#### Districts: ✅ Complete
- All 75 UP districts included
- Verified codes match static data
- Hindi and English names included

#### Tehsils: ⚠️ Partial Coverage
**Included (10 districts, 28 tehsils):**
- Agra (4 tehsils)
- Amroha (2 tehsils)
- Aligarh (4 tehsils)
- Lucknow (3 tehsils)
- Kanpur Nagar (2 tehsils)
- Prayagraj (4 tehsils)
- Varanasi (3 tehsils)
- Meerut (3 tehsils)
- Ghaziabad (2 tehsils)
- Noida/Gautam Buddha Nagar (2 tehsils)

**Missing:** 65 districts have no tehsil data

#### Villages: ⚠️ Sample Data Only
**Included (2 districts, 12 villages):**
- Amroha district: 7 villages
  - Amroha tehsil: 5 villages (including Atairana - 117978)
  - Hasanpur tehsil: 2 villages
- Agra district: 5 villages
  - Agra tehsil: 3 villages
  - Fatehabad tehsil: 2 villages

**Missing:** Most tehsils have no village data

---

## Solution: Apply Missing Migrations

### Execution Order (Strict)

```
Step 1: Apply 004_seed_districts.sql
   ↓
Step 2: Apply 006_location_master_data.sql
   ↓
Step 3: Apply 007_location_rls_policies.sql
```

**Why this order?**
- Migration 006 has foreign key: `district_code REFERENCES districts(code)`
- Migration 007 references all three tables
- Running out of order will cause constraint errors

### Step-by-Step Execution

#### Step 1: Apply Districts Migration

**File:** `supabase/migrations/004_seed_districts.sql`

**Action:**
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `004_seed_districts.sql`
3. Paste and execute

**Verification:**
```sql
SELECT COUNT(*) FROM districts;
-- Expected: 75

SELECT code, name_en, name_hi 
FROM districts 
WHERE name_en = 'Amroha';
-- Expected: 1 row (code: AMP)
```

#### Step 2: Apply Tehsils and Villages Migration

**File:** `supabase/migrations/006_location_master_data.sql`

**Action:**
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `006_location_master_data.sql`
3. Paste and execute

**Verification:**
```sql
SELECT COUNT(*) FROM tehsils;
-- Expected: 28

SELECT COUNT(*) FROM villages;
-- Expected: 12

SELECT t.code, t.name_en, d.name_en as district
FROM tehsils t
JOIN districts d ON t.district_code = d.code
WHERE d.name_en = 'Amroha';
-- Expected: 2 rows (Amroha, Hasanpur)
```

#### Step 3: Apply RLS Policies

**File:** `supabase/migrations/007_location_rls_policies.sql`

**Action:**
1. Open Supabase Dashboard → SQL Editor
2. Copy entire contents of `007_location_rls_policies.sql`
3. Paste and execute

**Verification:**
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('districts', 'tehsils', 'villages');
-- Expected: 12 policies (4 per table)

-- Test public read access
SELECT COUNT(*) FROM districts;
-- Expected: 75 (should work without authentication)
```

---

## Expected Outcome

After applying all three migrations:

### ✅ District Dropdown
- Loads all 75 UP districts
- Sorted alphabetically by English name
- Shows both English and Hindi names

### ✅ Tehsil Dropdown
- Loads when district is selected
- Shows tehsils for 10 major districts
- Empty for 65 districts (no data yet)

### ✅ Village Dropdown
- Loads when tehsil is selected
- Shows villages for sample tehsils
- Empty for most tehsils (no data yet)

### ✅ Test Case: Amroha → Amroha → Atairana
```
District: Amroha (code: AMP)
  ↓
Tehsil: Amroha (code: AMP001)
  ↓
Village: Atairana (code: 117978)
```

---

## Important Notes

### What's Included
- ✅ All 75 UP districts with verified codes
- ✅ 28 tehsils for 10 major districts
- ✅ 12 sample villages (Amroha and Agra)
- ✅ Proper foreign key relationships
- ✅ RLS policies for security
- ✅ Indexes for performance

### What's Missing
- ⚠️ Tehsil data for 65 districts
- ⚠️ Village data for most tehsils

**Impact:** 
- District dropdown works perfectly
- Tehsil/Village dropdowns work for major cities
- Empty dropdowns for other areas (acceptable for MVP)
- Can be expanded incrementally without code changes

### Data Integrity
- ✅ All district codes verified against static data
- ✅ No fabricated codes
- ✅ Real UP location data
- ✅ Proper Hindi/English names
- ✅ Foreign key constraints enforced

---

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

---

## Verification Checklist

After applying migrations, verify:

- [ ] `districts` table exists with 75 records
- [ ] `tehsils` table exists with 28 records
- [ ] `villages` table exists with 12 records
- [ ] Foreign key constraints working
- [ ] RLS enabled on all three tables
- [ ] 12 RLS policies created
- [ ] Public read access working
- [ ] District dropdown loads in UI
- [ ] Tehsil dropdown loads for Amroha
- [ ] Village dropdown loads for Amroha tehsil
- [ ] Test case works: Amroha → Amroha → Atairana
- [ ] No "Failed to load districts" error
- [ ] Browser console shows successful queries

---

## Summary

**Problem:** Migration files exist but were never applied to production database.

**Solution:** Apply three migration files in strict order (004 → 006 → 007).

**Time Required:** ~5 minutes

**Risk Level:** Low (all migrations use `IF NOT EXISTS`, safe to re-run)

**Data Coverage:** Complete for districts, partial for tehsils/villages (MVP scope)

**Next Steps:** Execute migrations, verify tables, test UI functionality.

---

## Files Reference

### Migration Files (Apply in Order)
1. `supabase/migrations/004_seed_districts.sql`
2. `supabase/migrations/006_location_master_data.sql`
3. `supabase/migrations/007_location_rls_policies.sql`

### Frontend Files (No Changes Needed)
- `src/services/locationService.ts` - Already expects correct schema
- `src/config/districts.ts` - Contains verified district data
- `src/App.tsx` - PropertySearch component uses locationService

### Documentation
- `MIGRATION_EXECUTION_PLAN.md` - Detailed execution guide
- `INVESTIGATION_REPORT.md` - Previous investigation summary
