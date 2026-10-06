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
CREATE POLICY "Anyone can view districts" ON districts
  FOR SELECT USING (true);

-- Only admins can modify districts
CREATE POLICY "Admins can insert districts" ON districts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update districts" ON districts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

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
CREATE POLICY "Anyone can view tehsils" ON tehsils
  FOR SELECT USING (true);

-- Only admins can modify tehsils
CREATE POLICY "Admins can insert tehsils" ON tehsils
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update tehsils" ON tehsils
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

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
CREATE POLICY "Anyone can view villages" ON villages
  FOR SELECT USING (true);

-- Only admins can modify villages
CREATE POLICY "Admins can insert villages" ON villages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update villages" ON villages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can delete villages" ON villages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );
