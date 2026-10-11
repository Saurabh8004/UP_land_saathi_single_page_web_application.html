-- ============================================================
-- PRODUCTION-SAFE UPDATE: District Data Corrections
-- ============================================================
-- This script corrects district names and adds Bhadohi district.
-- Safe to run against existing production database.
-- Does not delete any records or break foreign key relationships.
-- ============================================================

-- 1. Correct Barabanki (BBI) - Fix corrupted Hindi name
UPDATE districts
SET name_hi = 'बाराबंकी'
WHERE code = 'BBI'
  AND name_hi != 'बाराबंकी';

-- 2. Correct Etah (ETA) - Fix Hindi name (was incorrectly showing Etawah's name)
UPDATE districts
SET name_hi = 'एटा'
WHERE code = 'ETA'
  AND name_hi != 'एटा';

-- 3. Correct Ayodhya (FBD) - Fix English name (was incorrectly showing Faridabad)
UPDATE districts
SET name_en = 'Ayodhya'
WHERE code = 'FBD'
  AND name_en != 'Ayodhya';

-- 4. Add Bhadohi (BHD) - Insert only if not exists
INSERT INTO districts (code, name_hi, name_en, division, is_active)
VALUES ('BHD', 'भदोही', 'Bhadohi', 'Varanasi', true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Verify total district count (should be 75)
SELECT COUNT(*) as total_districts FROM districts;

-- Verify no duplicate codes
SELECT code, COUNT(*) as count
FROM districts
GROUP BY code
HAVING COUNT(*) > 1;

-- Verify the four corrected/added districts
SELECT 
  code,
  name_hi,
  name_en,
  division,
  is_active,
  CASE 
    WHEN code = 'BBI' AND name_hi = 'बाराबंकी' THEN '✓ Correct'
    WHEN code = 'ETA' AND name_hi = 'एटा' THEN '✓ Correct'
    WHEN code = 'FBD' AND name_en = 'Ayodhya' THEN '✓ Correct'
    WHEN code = 'BHD' AND name_en = 'Bhadohi' THEN '✓ Added'
    ELSE '✗ Issue'
  END as status
FROM districts
WHERE code IN ('BBI', 'ETA', 'FBD', 'BHD')
ORDER BY code;

-- Verify all districts have required fields
SELECT COUNT(*) as districts_with_missing_data
FROM districts
WHERE code IS NULL 
   OR name_hi IS NULL 
   OR name_en IS NULL 
   OR is_active IS NULL;

-- Verify foreign key integrity (tehsils reference valid districts)
SELECT COUNT(*) as orphaned_tehsils
FROM tehsils t
LEFT JOIN districts d ON t.district_code = d.code
WHERE d.code IS NULL;

-- Verify foreign key integrity (villages reference valid districts and tehsils)
SELECT COUNT(*) as orphaned_villages_district
FROM villages v
LEFT JOIN districts d ON v.district_code = d.code
WHERE d.code IS NULL;

SELECT COUNT(*) as orphaned_villages_tehsil
FROM villages v
LEFT JOIN tehsils t ON v.tehsil_code = t.code
WHERE t.code IS NULL;

-- List all districts sorted by English name (for manual verification)
SELECT code, name_en, name_hi, division
FROM districts
WHERE is_active = true
ORDER BY name_en;
