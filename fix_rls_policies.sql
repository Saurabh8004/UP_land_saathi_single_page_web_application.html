-- ============================================================
-- FIX: Apply RLS Policies for Location Tables
-- Run this in Supabase SQL Editor if migration 007 wasn't applied
-- ============================================================

-- Enable RLS on location master tables (if not already enabled)
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tehsils ENABLE ROW LEVEL SECURITY;
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
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

-- ============================================================
-- DISTRICTS POLICIES
-- ============================================================

-- Public read access (anyone can view districts)
CREATE POLICY "Anyone can view districts" ON districts
  FOR SELECT
  TO public
  USING (true);

-- Admin write access
CREATE POLICY "Admins can insert districts" ON districts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update districts" ON districts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete districts" ON districts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- ============================================================
-- TEHSILS POLICIES
-- ============================================================

-- Public read access
CREATE POLICY "Anyone can view tehsils" ON tehsils
  FOR SELECT
  TO public
  USING (true);

-- Admin write access
CREATE POLICY "Admins can insert tehsils" ON tehsils
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update tehsils" ON tehsils
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete tehsils" ON tehsils
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- ============================================================
-- VILLAGES POLICIES
-- ============================================================

-- Public read access
CREATE POLICY "Anyone can view villages" ON villages
  FOR SELECT
  TO public
  USING (true);

-- Admin write access
CREATE POLICY "Admins can insert villages" ON villages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update villages" ON villages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete villages" ON villages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- ============================================================
-- VERIFICATION: Check that policies were created
-- ============================================================

SELECT 
  tablename,
  policyname,
  cmd,
  roles::text
FROM pg_policies
WHERE tablename IN ('districts', 'tehsils', 'villages')
ORDER BY tablename, policyname;
