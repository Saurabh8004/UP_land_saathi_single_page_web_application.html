-- ============================================================
-- RLS POLICIES FOR LOCATION MASTER TABLES
-- ============================================================

-- Enable RLS on location master tables
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tehsils ENABLE ROW LEVEL SECURITY;
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- DISTRICTS POLICIES
-- ============================================================
-- Anyone can read districts (public reference data)
DROP POLICY IF EXISTS "Anyone can view districts" ON districts;
CREATE POLICY "Anyone can view districts" ON districts
  FOR SELECT USING (true);

-- Only admins can modify districts
DROP POLICY IF EXISTS "Admins can insert districts" ON districts;
CREATE POLICY "Admins can insert districts" ON districts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can update districts" ON districts;
CREATE POLICY "Admins can update districts" ON districts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete districts" ON districts;
CREATE POLICY "Admins can delete districts" ON districts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- ============================================================
-- TEHSILS POLICIES
-- ============================================================
-- Anyone can read tehsils (public reference data)
DROP POLICY IF EXISTS "Anyone can view tehsils" ON tehsils;
CREATE POLICY "Anyone can view tehsils" ON tehsils
  FOR SELECT USING (true);

-- Only admins can modify tehsils
DROP POLICY IF EXISTS "Admins can insert tehsils" ON tehsils;
CREATE POLICY "Admins can insert tehsils" ON tehsils
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can update tehsils" ON tehsils;
CREATE POLICY "Admins can update tehsils" ON tehsils
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete tehsils" ON tehsils;
CREATE POLICY "Admins can delete tehsils" ON tehsils
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- ============================================================
-- VILLAGES POLICIES
-- ============================================================
-- Anyone can read villages (public reference data)
DROP POLICY IF EXISTS "Anyone can view villages" ON villages;
CREATE POLICY "Anyone can view villages" ON villages
  FOR SELECT USING (true);

-- Only admins can modify villages
DROP POLICY IF EXISTS "Admins can insert villages" ON villages;
CREATE POLICY "Admins can insert villages" ON villages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can update villages" ON villages;
CREATE POLICY "Admins can update villages" ON villages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete villages" ON villages;
CREATE POLICY "Admins can delete villages" ON villages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );
