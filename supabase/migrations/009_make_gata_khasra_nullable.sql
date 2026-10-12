-- ============================================================
-- MIGRATION: Make gata_khasra nullable in requests table
-- ============================================================
-- The property verification form allows gata_khasra to be optional,
-- but the original schema required it. This migration makes it nullable.

-- Drop the NOT NULL constraint from gata_khasra
ALTER TABLE requests 
  ALTER COLUMN gata_khasra DROP NOT NULL;

-- Verify the change
COMMENT ON COLUMN requests.gata_khasra IS 'Gata/Khasra number - optional for property verification requests';
