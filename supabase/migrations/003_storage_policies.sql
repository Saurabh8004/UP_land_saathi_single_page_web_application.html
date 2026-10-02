-- ============================================================
-- STORAGE BUCKETS & POLICIES
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('property-documents', 'property-documents', false),
  ('reports', 'reports', false),
  ('field-evidence', 'field-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PROPERTY DOCUMENTS POLICIES
-- ============================================================

-- Users can upload to their own request folders
CREATE POLICY "Users can upload property documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-documents'
  AND (
    -- User is authenticated and uploading to their request
    (auth.uid() IS NOT NULL AND storage.foldername(name)[1] IN (
      SELECT request_id::text FROM requests WHERE user_id = auth.uid()
    ))
    -- Or uploading via service role (API)
    OR auth.role() = 'service_role'
  )
);

-- Users can view their own documents
CREATE POLICY "Users can view own property documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'property-documents'
  AND (
    storage.foldername(name)[1] IN (
      SELECT request_id::text FROM requests WHERE user_id = auth.uid()
    )
    OR auth.role() = 'service_role'
  )
);

-- Admins can view all documents
CREATE POLICY "Admins can view all property documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'property-documents'
  AND is_admin(auth.uid())
);

-- Admins can delete documents
CREATE POLICY "Admins can delete property documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-documents'
  AND is_admin(auth.uid())
);

-- ============================================================
-- REPORTS POLICIES
-- ============================================================

-- Only admins/service role can upload reports
CREATE POLICY "Admins can upload reports"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'reports'
  AND (is_admin(auth.uid()) OR auth.role() = 'service_role')
);

-- Users can view reports for their requests
CREATE POLICY "Users can view own reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'reports'
  AND (
    storage.foldername(name)[1] IN (
      SELECT request_id::text FROM requests WHERE user_id = auth.uid()
    )
    OR auth.role() = 'service_role'
  )
);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'reports'
  AND is_admin(auth.uid())
);

-- ============================================================
-- FIELD EVIDENCE POLICIES
-- ============================================================

-- Only admins/service role can upload field evidence
CREATE POLICY "Admins can upload field evidence"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'field-evidence'
  AND (is_admin(auth.uid()) OR auth.role() = 'service_role')
);

-- Users can view field evidence for their requests
CREATE POLICY "Users can view own field evidence"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'field-evidence'
  AND (
    storage.foldername(name)[1] IN (
      SELECT fv.id::text 
      FROM field_visits fv
      JOIN requests r ON fv.request_id = r.id
      WHERE r.user_id = auth.uid()
    )
    OR auth.role() = 'service_role'
  )
);

-- Admins can view all field evidence
CREATE POLICY "Admins can view all field evidence"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'field-evidence'
  AND is_admin(auth.uid())
);
