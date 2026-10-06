-- ============================================================
-- PROPERTY REQUESTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS property_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Location details
  district_code TEXT NOT NULL,
  district_name TEXT NOT NULL,
  tehsil_code TEXT NOT NULL,
  tehsil_name TEXT NOT NULL,
  village_code TEXT NOT NULL,
  village_name TEXT NOT NULL,
  
  -- Property identifiers
  gata_number TEXT,
  khata_number TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN (
    'created', 'searching', 'found', 'not_found', 'error', 'completed'
  )),
  
  -- Error handling
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_property_requests_user_id ON property_requests(user_id);
CREATE INDEX idx_property_requests_request_id ON property_requests(request_id);
CREATE INDEX idx_property_requests_district_code ON property_requests(district_code);
CREATE INDEX idx_property_requests_status ON property_requests(status);
CREATE INDEX idx_property_requests_created_at ON property_requests(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_property_requests_location ON property_requests(district_code, tehsil_code, village_code);

-- ============================================================
-- TRIGGER: Update updated_at timestamp
-- ============================================================

CREATE TRIGGER update_property_requests_updated_at
  BEFORE UPDATE ON property_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE property_requests IS 'Stores property search requests with location and property identifiers';
COMMENT ON COLUMN property_requests.request_id IS 'Unique request identifier (e.g., BSK-1234567890-ABC123)';
COMMENT ON COLUMN property_requests.status IS 'Current status of the property request';
COMMENT ON COLUMN property_requests.district_code IS 'Official district code from UP Bhulekh';
COMMENT ON COLUMN property_requests.tehsil_code IS 'Official tehsil code from UP Bhulekh';
COMMENT ON COLUMN property_requests.village_code IS 'Official village code from UP Bhulekh';
