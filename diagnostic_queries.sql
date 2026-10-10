-- ============================================================
-- DIAGNOSTIC QUERY: Check Location Tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Check if tables exist and have data
SELECT 'districts' as table_name, COUNT(*) as record_count FROM districts
UNION ALL
SELECT 'tehsils', COUNT(*) FROM tehsils
UNION ALL
SELECT 'villages', COUNT(*) FROM villages;

-- 2. Check districts table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'districts'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('districts', 'tehsils', 'villages');

-- 4. Check RLS policies for districts
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'districts';

-- 5. Sample district data
SELECT code, name_en, name_hi, is_active
FROM districts
ORDER BY name_en
LIMIT 10;

-- 6. Check if Amroha exists
SELECT * FROM districts WHERE name_en = 'Amroha' OR code = 'AMR';
