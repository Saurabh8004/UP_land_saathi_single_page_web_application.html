-- ============================================================
-- FIX: Grant INSERT privilege to anon role for requests table
-- ============================================================
-- RLS policies control row-level access, but the role must also
-- have basic table privileges. This grants INSERT to anon role.

-- Grant INSERT privilege to anon role
GRANT INSERT ON public.requests TO anon;

-- Also grant USAGE on the schema (required for table access)
GRANT USAGE ON SCHEMA public TO anon;

-- Grant SELECT for authenticated users to view their own requests
GRANT SELECT ON public.requests TO authenticated;

-- Grant INSERT for authenticated users to create their own requests
GRANT INSERT ON public.requests TO authenticated;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Verify anon role has INSERT privilege
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'requests'
  AND table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- Expected result:
-- grantee      | privilege_type
-- -------------+----------------
-- anon         | INSERT
-- authenticated| INSERT
-- authenticated| SELECT

-- Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'requests';

-- Expected: rowsecurity = true

-- Verify all policies exist
SELECT 
  policyname,
  cmd,
  roles::text,
  qual IS NOT NULL as has_using,
  with_check IS NOT NULL as has_check
FROM pg_policies
WHERE tablename = 'requests'
ORDER BY policyname;

-- Expected: 4 policies
-- - Allow anonymous property verification (INSERT, anon)
-- - requests_insert_own (INSERT, authenticated)
-- - requests_select_own (SELECT, authenticated)
-- - requests_update_own (UPDATE, authenticated)

-- ============================================================
-- TEST: Verify anonymous insert works
-- ============================================================

-- Test as anon role (simulates anonymous user)
SET ROLE anon;

-- This should succeed now
INSERT INTO requests (
  request_id,
  user_id,
  service_type,
  package_code,
  status,
  customer_name,
  mobile,
  district,
  consent_given,
  consent_timestamp,
  privacy_policy_version
) VALUES (
  'TEST-ANON-001',
  NULL,
  'whatsapp_verification',
  'free',
  'received',
  'Test Anonymous User',
  '9999999999',
  'Test District',
  true,
  NOW(),
  '1.0'
);

-- Check if insert succeeded
SELECT request_id, user_id, customer_name, mobile, district
FROM requests
WHERE request_id = 'TEST-ANON-001';

-- Clean up test record
DELETE FROM requests WHERE request_id = 'TEST-ANON-001';

-- Reset role
RESET ROLE;

-- ============================================================
-- SUMMARY
-- ============================================================
-- After running this script:
-- 1. anon role has INSERT privilege on requests table
-- 2. RLS policy "Allow anonymous property verification" will work
-- 3. Anonymous submissions should succeed
-- 4. Authenticated submissions continue to work as before
