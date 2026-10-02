-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads_b2b ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin(auth.uid()));

-- ============================================================
-- REQUESTS POLICIES
-- ============================================================
-- Users can view their own requests
CREATE POLICY "Users can view own requests" ON requests
  FOR SELECT USING (
    auth.uid() = user_id 
    OR (user_id IS NULL AND customer_mobile = current_setting('app.current_mobile', true))
  );

-- Users can create requests
CREATE POLICY "Users can create requests" ON requests
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all requests
CREATE POLICY "Admins can view all requests" ON requests
  FOR SELECT USING (is_admin(auth.uid()));

-- Admins can update all requests
CREATE POLICY "Admins can update all requests" ON requests
  FOR UPDATE USING (is_admin(auth.uid()));

-- ============================================================
-- REQUEST DOCUMENTS POLICIES
-- ============================================================
-- Users can view their own documents
CREATE POLICY "Users can view own documents" ON request_documents
  FOR SELECT USING (
    user_id = auth.uid()
    OR request_id IN (
      SELECT id FROM requests WHERE user_id = auth.uid()
    )
  );

-- Users can upload documents
CREATE POLICY "Users can upload documents" ON request_documents
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR request_id IN (
      SELECT id FROM requests WHERE user_id = auth.uid()
    )
  );

-- Admins can view all documents
CREATE POLICY "Admins can view all documents" ON request_documents
  FOR SELECT USING (is_admin(auth.uid()));

-- ============================================================
-- PAYMENTS POLICIES
-- ============================================================
-- Users can view their own payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM requests WHERE user_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (is_admin(auth.uid()));

-- Admins can update payments
CREATE POLICY "Admins can update payments" ON payments
  FOR UPDATE USING (is_admin(auth.uid()));

-- ============================================================
-- REPORTS POLICIES
-- ============================================================
-- Users can view reports for their requests
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM requests WHERE user_id = auth.uid()
    )
  );

-- Admins can view all reports
CREATE POLICY "Admins can view all reports" ON reports
  FOR SELECT USING (is_admin(auth.uid()));

-- Admins can create/update reports
CREATE POLICY "Admins can manage reports" ON reports
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================
-- VERIFICATION UPDATES POLICIES
-- ============================================================
-- Users can view updates for their requests (public messages only)
CREATE POLICY "Users can view own updates" ON verification_updates
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM requests WHERE user_id = auth.uid()
    )
  );

-- Admins can view and create updates
CREATE POLICY "Admins can manage updates" ON verification_updates
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================
-- INTERNAL NOTES POLICIES
-- ============================================================
-- Only admins can access internal notes
CREATE POLICY "Admins can view internal notes" ON internal_notes
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can create internal notes" ON internal_notes
  FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- ============================================================
-- FIELD VISITS POLICIES
-- ============================================================
-- Users can view field visits for their requests
CREATE POLICY "Users can view own field visits" ON field_visits
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM requests WHERE user_id = auth.uid()
    )
  );

-- Admins can manage field visits
CREATE POLICY "Admins can manage field visits" ON field_visits
  FOR ALL USING (is_admin(auth.uid()));

-- ============================================================
-- NOTIFICATIONS POLICIES
-- ============================================================
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications" ON notifications
  FOR SELECT USING (is_admin(auth.uid()));

-- System can create notifications
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- LEADS B2B POLICIES
-- ============================================================
-- Anyone can create B2B leads
CREATE POLICY "Anyone can create B2B leads" ON leads_b2b
  FOR INSERT WITH CHECK (true);

-- Only admins can view B2B leads
CREATE POLICY "Admins can view B2B leads" ON leads_b2b
  FOR SELECT USING (is_admin(auth.uid()));

-- Admins can update B2B leads
CREATE POLICY "Admins can update B2B leads" ON leads_b2b
  FOR UPDATE USING (is_admin(auth.uid()));

-- ============================================================
-- AUDIT LOGS POLICIES
-- ============================================================
-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (is_admin(auth.uid()));

-- System can create audit logs
CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);
