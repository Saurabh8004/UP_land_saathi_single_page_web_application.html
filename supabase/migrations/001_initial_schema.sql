-- ============================================================
-- BHUMI SEVA KENDRA - Database Schema
-- PostgreSQL / Supabase
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  email TEXT,
  whatsapp_opt_in BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'reviewer', 'field_agent')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REQUESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Service details
  service_type TEXT NOT NULL,
  package_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN (
    'received', 'payment_pending', 'paid', 'in_verification',
    'field_visit_scheduled', 'field_visit_done', 'advocate_review',
    'report_processing', 'report_ready', 'completed', 'cancelled', 'refunded'
  )),
  
  -- Customer details
  customer_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  customer_email TEXT,
  
  -- Property details
  district TEXT NOT NULL,
  tehsil TEXT,
  village TEXT,
  gata_khasra TEXT NOT NULL,
  area TEXT,
  owner_name TEXT,
  property_type TEXT,
  notes TEXT,
  
  -- Consent
  consent_given BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  privacy_policy_version TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_requests_user_id ON requests(user_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_district ON requests(district);
CREATE INDEX idx_requests_created_at ON requests(created_at DESC);
CREATE INDEX idx_requests_request_id ON requests(request_id);

-- ============================================================
-- REQUEST DOCUMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS request_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  document_type TEXT,
  
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by TEXT,
  
  -- Analysis
  analysis_status TEXT DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
  analysis_summary TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_request_documents_request_id ON request_documents(request_id);
CREATE INDEX idx_request_documents_user_id ON request_documents(user_id);

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  
  -- Razorpay details
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  
  -- Amount
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'created', 'authorized', 'captured', 'failed', 'refunded')),
  
  -- Raw response for debugging
  raw_response JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX idx_payments_request_id ON payments(request_id);
CREATE INDEX idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================
-- REPORTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  
  report_number TEXT UNIQUE,
  storage_path TEXT NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'ready', 'superseded')),
  version INTEGER DEFAULT 1,
  
  uploaded_by UUID REFERENCES admin_users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  ready_at TIMESTAMPTZ
);

CREATE INDEX idx_reports_request_id ON reports(request_id);
CREATE INDEX idx_reports_status ON reports(status);

-- ============================================================
-- REPORT DOWNLOADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS report_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  ip_hash TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_report_downloads_report_id ON report_downloads(report_id);
CREATE INDEX idx_report_downloads_request_id ON report_downloads(request_id);

-- ============================================================
-- VERIFICATION UPDATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS verification_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL,
  public_message TEXT NOT NULL,
  internal_message TEXT,
  
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verification_updates_request_id ON verification_updates(request_id);
CREATE INDEX idx_verification_updates_created_at ON verification_updates(created_at DESC);

-- ============================================================
-- INTERNAL NOTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS internal_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  
  note TEXT NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_internal_notes_request_id ON internal_notes(request_id);

-- ============================================================
-- FIELD VISITS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS field_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  
  assigned_to UUID REFERENCES admin_users(id),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_field_visits_request_id ON field_visits(request_id);
CREATE INDEX idx_field_visits_status ON field_visits(status);

-- ============================================================
-- FIELD EVIDENCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS field_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_visit_id UUID NOT NULL REFERENCES field_visits(id) ON DELETE CASCADE,
  
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  description TEXT,
  
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES admin_users(id)
);

CREATE INDEX idx_field_evidence_field_visit_id ON field_evidence(field_visit_id);

-- ============================================================
-- LEADS B2B TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS leads_b2b (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  monthly_volume TEXT,
  city TEXT NOT NULL,
  
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'lost')),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_b2b_status ON leads_b2b(status);
CREATE INDEX idx_leads_b2b_created_at ON leads_b2b(created_at DESC);

-- ============================================================
-- OTP VERIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  mobile TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  
  expires_at TIMESTAMPTZ NOT NULL,
  attempt_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  
  verified_at TIMESTAMPTZ,
  is_used BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otp_verifications_mobile ON otp_verifications(mobile);
CREATE INDEX idx_otp_verifications_expires_at ON otp_verifications(expires_at);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN (
    'booking_received', 'payment_success', 'verification_started',
    'field_visit_scheduled', 'report_ready', 'booking_cancelled'
  )),
  
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_request_id ON notifications(request_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- ============================================================
-- AUDIT LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  actor_id UUID,
  actor_type TEXT CHECK (actor_type IN ('customer', 'admin', 'system')),
  
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  
  metadata JSONB,
  
  ip_address TEXT,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================
-- REFUNDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  
  razorpay_refund_id TEXT,
  
  amount INTEGER NOT NULL,
  reason TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX idx_refunds_request_id ON refunds(request_id);

-- ============================================================
-- UPDATED AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_field_visits_updated_at BEFORE UPDATE ON field_visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_b2b_updated_at BEFORE UPDATE ON leads_b2b
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
