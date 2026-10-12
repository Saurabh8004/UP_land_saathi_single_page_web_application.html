-- ============================================================
-- MIGRATION: Make user_id nullable for anonymous submissions
-- ============================================================
-- This migration ensures the production database matches the
-- original schema design that supports anonymous property
-- verification requests.
--
-- IMPORTANT: Run this ONLY if the production database has
-- user_id UUID NOT NULL. If user_id is already nullable,
-- this migration will have no effect.
-- ============================================================

-- Drop NOT NULL constraint from user_id if it exists
-- This is safe because the original schema (001_initial_schema.sql)
-- already defines user_id as nullable
ALTER TABLE requests 
  ALTER COLUMN user_id DROP NOT NULL;

-- Verify the change
COMMENT ON COLUMN requests.user_id IS 'User ID for authenticated requests. NULL for anonymous Property Verification requests.';

-- ============================================================
-- VERIFICATION QUERY
-- ============================================================
-- Run this after the migration to verify user_id is nullable:
/*
SELECT 
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'requests'
  AND column_name = 'user_id';
*/

-- Expected result:
-- column_name | is_nullable | data_type
-- ------------+-------------+----------
-- user_id     | YES         | uuid
