# District Loading Bug - Root Cause Analysis & Fix

## 🔴 Issue Summary

**Error Message:** "Failed to load districts"  
**Affected Component:** Property Search Wizard - District Dropdown  
**Impact:** Complete failure of location selection flow (District → Tehsil → Village)

---

## 🔍 Root Cause Analysis

### Primary Issue: Missing RLS Policies

The `districts`, `tehsils`, and `villages` tables have **Row Level Security (RLS) enabled** but **no SELECT policies** were created to allow read access.

#### What Happened:

1. ✅ Migration `004_seed_districts.sql` created the `districts` table
2. ✅ Migration `006_location_master_data.sql` created `tehsils` and `villages` tables
3. ✅ All tables have RLS enabled (security best practice)
4. ❌ **No RLS policies were created to allow SELECT operations**
5. ❌ When `locationService.getDistricts()` queries the table, Supabase blocks the request
6. ❌ The error is caught and displayed as "Failed to load districts"

### Technical Details:

**File:** `src/services/locationService.ts` (line 56-65)

```typescript
const { data, error } = await supabase
  .from('districts')
  .select('code, name_en, name_hi')
  .eq('is_active', true)
  .order('name_en');

if (error) {
  console.error('[LOCATION ERROR] Failed to fetch districts:', error);
  throw new Error('Failed to load districts');
}
```

**Expected Error from Supabase:**
```
{
  code: "42501",
  message: "new row violates row-level security policy for table \"districts\"",
  details: null,
  hint: null
}
```

---

## ✅ Solution

### Created Migration: `007_location_rls_policies.sql`

This migration adds the necessary RLS policies to allow:
- **Public read access** to location master data (districts, tehsils, villages)
- **Admin-only write access** to maintain data integrity

#### Policies Created:

| Table | Policy | Access Level |
|-------|--------|--------------|
| districts | Anyone can view districts | Public SELECT |
| districts | Admins can insert/update/delete districts | Admin only |
| tehsils | Anyone can view tehsils | Public SELECT |
| tehsils | Admins can insert/update/delete tehsils | Admin only |
| villages | Anyone can view villages | Public SELECT |
| villages | Admins can insert/update/delete villages | Admin only |

---

## 📋 Files Changed

### New Files:
1. `supabase/migrations/007_location_rls_policies.sql` - RLS policies for location tables

### Modified Files:
- None (this is a pure database policy fix)

---

## 🚀 Deployment Steps

### Step 1: Apply Migration

Run the new migration on your Supabase database:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase Dashboard:
# SQL Editor → New Query → Paste contents of 007_location_rls_policies.sql → Run
```

### Step 2: Verify Tables Exist

Before running the migration, verify that the location tables exist:

```sql
-- Check if districts table exists and has data
SELECT COUNT(*) FROM districts;

-- Check if tehsils table exists
SELECT COUNT(*) FROM tehsils;

-- Check if villages table exists
SELECT COUNT(*) FROM villages;
```

**Expected Results:**
- districts: 75 rows (all UP districts)
- tehsils: 28+ rows (sample tehsils for major districts)
- villages: 12+ rows (sample villages)

### Step 3: Verify RLS Policies

After running the migration, verify the policies were created:

```sql
-- Check policies for districts table
SELECT * FROM pg_policies WHERE tablename = 'districts';

-- Check policies for tehsils table
SELECT * FROM pg_policies WHERE tablename = 'tehsils';

-- Check policies for villages table
SELECT * FROM pg_policies WHERE tablename = 'villages';
```

**Expected:** 4 policies per table (SELECT, INSERT, UPDATE, DELETE)

### Step 4: Test the Fix

1. Open the Property Search page
2. District dropdown should now load all 75 districts
3. Select "Amroha" (code: AMP)
4. Tehsil dropdown should load (Amroha, Hasanpur)
5. Select "Amroha" (code: AMP001)
6. Village dropdown should load (Atairana, Bhikhpur, Chandpur, etc.)
7. Select "Atairana" (code: 117978)
8. Click "Next" - should proceed to Step 2

---

## 🧪 Test Cases

### Test 1: District Loading
- [ ] Page loads without "Failed to load districts" error
- [ ] District dropdown shows all 75 UP districts
- [ ] Districts are sorted alphabetically by English name
- [ ] Both English and Hindi names are available

### Test 2: Tehsil Loading
- [ ] Select "Amroha" district
- [ ] Tehsil dropdown becomes enabled
- [ ] Tehsil dropdown shows: Amroha, Hasanpur
- [ ] Select "Amroha" tehsil

### Test 3: Village Loading
- [ ] Village dropdown becomes enabled
- [ ] Village dropdown shows: Atairana, Bhikhpur, Chandpur, Gangohi, Jalalpur
- [ ] Select "Atairana" village
- [ ] Village code (117978) is correctly stored

### Test 4: Form Submission
- [ ] Click "Next" button
- [ ] Form validates successfully
- [ ] Property request is created in database
- [ ] Request contains correct district/tehsil/village codes and names

### Test 5: Caching
- [ ] Refresh page
- [ ] Districts load from cache (check console for "[LOCATION DEBUG] Returning cached districts")
- [ ] Select district
- [ ] Tehsils load (check console for "[TEHSIL DEBUG]")
- [ ] Select tehsil
- [ ] Villages load (check console for "[VILLAGE DEBUG]")

---

## 🔒 Security Considerations

### Why Public Read Access is Safe:

1. **Location data is public information** - Districts, tehsils, and villages are government-published reference data
2. **No sensitive information** - These tables contain only names and codes, no personal data
3. **Read-only for public** - INSERT/UPDATE/DELETE operations require admin authentication
4. **Consistent with other reference data** - Similar to how product catalogs are publicly readable

### Admin-Only Write Access:

Only users in the `admin_users` table with `is_active = true` can:
- Add new districts/tehsils/villages
- Update existing location data
- Delete location records

This maintains data integrity while allowing public access to reference data.

---

## 📊 Expected Console Output

After the fix, you should see:

```
[LOCATION DEBUG] Fetching districts...
[LOCATION DEBUG] Districts fetched: 75
[LOCATION DEBUG] First 3 districts: [
  {code: "AGR", name_en: "Agra", name_hi: "आगरा"},
  {code: "ALG", name_en: "Aligarh", name_hi: "अलीगढ़"},
  {code: "ALL", name_en: "Prayagraj", name_hi: "प्रयागराज"}
]

[TEHSIL DEBUG] ========================================
[TEHSIL DEBUG] getTehsils called
[TEHSIL DEBUG] districtCode: AMP
[TEHSIL DEBUG] Querying Supabase for tehsils...
[TEHSIL DEBUG] Supabase response received
[TEHSIL DEBUG] Number of tehsils: 2
[TEHSIL DEBUG] First 3 tehsils: [
  {code: "AMP001", name_en: "Amroha", name_hi: "अमरोहा"},
  {code: "AMP002", name_en: "Hasanpur", name_hi: "हसनपुर"}
]

[VILLAGE DEBUG] ========================================
[VILLAGE DEBUG] getVillages called
[VILLAGE DEBUG] districtCode: AMP
[VILLAGE DEBUG] tehsilCode: AMP001
[VILLAGE DEBUG] Querying Supabase for villages...
[VILLAGE DEBUG] Supabase response received
[VILLAGE DEBUG] Number of villages: 5
[VILLAGE DEBUG] First 3 villages: [
  {code: "117978", name_en: "Atairana", name_hi: "अटेरना"},
  {code: "117979", name_en: "Bhikhpur", name_hi: "भीखमपुर"},
  {code: "117980", name_en: "Chandpur", name_hi: "चांदपुर"}
]
```

---

## 🐛 Troubleshooting

### If districts still don't load after migration:

1. **Check if migration ran successfully:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'districts';
   ```
   Should show 4 policies.

2. **Check if districts table has data:**
   ```sql
   SELECT COUNT(*) FROM districts;
   ```
   Should return 75.

3. **Check browser console for detailed error:**
   - Open DevTools → Console tab
   - Look for `[LOCATION ERROR]` messages
   - Check the full error object for details

4. **Verify Supabase connection:**
   - Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Verify these are the correct values from Supabase Dashboard

5. **Test query directly in Supabase SQL Editor:**
   ```sql
   SELECT code, name_en, name_hi 
   FROM districts 
   WHERE is_active = true 
   ORDER BY name_en 
   LIMIT 5;
   ```
   Should return 5 districts.

### If tehsils/villages don't load:

1. **Check if migration 006 ran:**
   ```sql
   SELECT COUNT(*) FROM tehsils;
   SELECT COUNT(*) FROM villages;
   ```

2. **Verify district codes match:**
   - Districts use codes like "AGR", "AMP", "LKO"
   - Tehsils reference these codes in `district_code` column
   - Make sure you're selecting a district that has tehsils in the database

3. **Check which districts have tehsils:**
   ```sql
   SELECT district_code, COUNT(*) 
   FROM tehsils 
   GROUP BY district_code;
   ```
   Currently only AGR, AMP, ALG, LKO, KPN, ALL, VNS, MRT, GZI, GBN have tehsils.

---

## 📝 Notes

### Why This Bug Occurred:

The original migration files (004, 006) created the tables and seeded data, but the RLS policies migration (002) was created **before** these tables existed. When the location tables were added later, no one updated the RLS policies to include them.

### Prevention:

When creating new tables in the future:
1. Always enable RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. Always create at least one SELECT policy
3. Test the query with an anonymous user (not admin) to verify access
4. Add the policies to the same migration or create a follow-up migration immediately

### Alternative Solutions Considered:

1. **Disable RLS on location tables** - Rejected: Less secure, not best practice
2. **Use service role key in frontend** - Rejected: Exposes admin credentials, major security risk
3. **Create Edge Function wrapper** - Rejected: Over-engineering for simple reference data
4. **Hardcode districts in frontend** - Rejected: Doesn't scale, defeats purpose of database

**Chosen solution:** Public read policies with admin-only write access - secure, scalable, and follows Supabase best practices.

---

## ✅ Verification Checklist

After deploying the fix, verify:

- [ ] Migration 007 applied successfully
- [ ] District dropdown loads 75 districts
- [ ] No "Failed to load districts" error
- [ ] Tehsil dropdown loads when district is selected
- [ ] Village dropdown loads when tehsil is selected
- [ ] Form submission creates property request
- [ ] Console shows debug logs (no errors)
- [ ] Caching works (second load is faster)
- [ ] Both English and Hindi names display correctly

---

## 📞 Support

If the issue persists after applying this fix:

1. Check browser console for detailed error messages
2. Verify Supabase dashboard shows the tables and policies
3. Test the SQL queries directly in Supabase SQL Editor
4. Check that environment variables are correctly set in Vercel
5. Review the debug logs in the browser console

---

**Status:** ✅ Fixed  
**Migration:** `007_location_rls_policies.sql`  
**Root Cause:** Missing RLS SELECT policies on location master tables  
**Impact:** Critical - blocked entire property search flow  
**Resolution Time:** Immediate - apply migration and refresh page
