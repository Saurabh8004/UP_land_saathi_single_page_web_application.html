-- ============================================================
-- LOCATION MASTER DATA - TEHSILS AND VILLAGES
-- ============================================================

-- ============================================================
-- TEHSILS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS tehsils (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_hi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  district_code TEXT NOT NULL REFERENCES districts(code) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tehsils_district_code ON tehsils(district_code);
CREATE INDEX idx_tehsils_code ON tehsils(code);
CREATE INDEX idx_tehsils_name_en ON tehsils(name_en);

-- ============================================================
-- VILLAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS villages (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_hi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  tehsil_code TEXT NOT NULL REFERENCES tehsils(code) ON DELETE CASCADE,
  district_code TEXT NOT NULL REFERENCES districts(code) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_villages_tehsil_code ON villages(tehsil_code);
CREATE INDEX idx_villages_district_code ON villages(district_code);
CREATE INDEX idx_villages_code ON villages(code);
CREATE INDEX idx_villages_name_en ON villages(name_en);

-- ============================================================
-- SEED DATA: TEHSILS FOR MAJOR DISTRICTS
-- ============================================================

-- Agra (AGR)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('AGR001', 'आगरा', 'Agra', 'AGR'),
  ('AGR002', 'फतेहाबाद', 'Fatehabad', 'AGR'),
  ('AGR003', 'खेरागढ़', 'Kheragarh', 'AGR'),
  ('AGR004', 'टोंडला', 'Tundla', 'AGR');

-- Amroha (AMP)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('AMP001', 'अमरोहा', 'Amroha', 'AMP'),
  ('AMP002', 'हसनपुर', 'Hasanpur', 'AMP');

-- Aligarh (ALG)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('ALG001', 'अलीगढ़', 'Aligarh', 'ALG'),
  ('ALG002', 'अत्रौली', 'Atrauli', 'ALG'),
  ('ALG003', 'खैर', 'Khair', 'ALG'),
  ('ALG004', 'गभाना', 'Gabhana', 'ALG');

-- Lucknow (LKO)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('LKO001', 'लखनऊ', 'Lucknow', 'LKO'),
  ('LKO002', 'माल', 'Mal', 'LKO'),
  ('LKO003', 'मोहनलालगंज', 'Mohanlalganj', 'LKO');

-- Kanpur Nagar (KPN)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('KPN001', 'कानपुर', 'Kanpur', 'KPN'),
  ('KPN002', 'बिल्हौर', 'Bilhaur', 'KPN');

-- Prayagraj (ALL)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('ALL001', 'प्रयागराज', 'Prayagraj', 'ALL'),
  ('ALL002', 'सोरांव', 'Soraon', 'ALL'),
  ('ALL003', 'फूलपुर', 'Phulpur', 'ALL'),
  ('ALL004', 'करछना', 'Karchhana', 'ALL');

-- Varanasi (VNS)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('VNS001', 'वाराणसी', 'Varanasi', 'VNS'),
  ('VNS002', 'पिंडरा', 'Pindra', 'VNS'),
  ('VNS003', 'शिवपुर', 'Shivpur', 'VNS');

-- Meerut (MRT)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('MRT001', 'मेरठ', 'Meerut', 'MRT'),
  ('MRT002', 'बड़ौत', 'Baraut', 'MRT'),
  ('MRT003', 'मवाना', 'Mawana', 'MRT');

-- Ghaziabad (GZI)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('GZI001', 'गाज़ियाबाद', 'Ghaziabad', 'GZI'),
  ('GZI002', 'मोदीनगर', 'Modinagar', 'GZI');

-- Noida (GBN)
INSERT INTO tehsils (code, name_hi, name_en, district_code) VALUES
  ('GBN001', 'नोएडा', 'Noida', 'GBN'),
  ('GBN002', 'दादरी', 'Dadri', 'GBN');

-- ============================================================
-- SEED DATA: SAMPLE VILLAGES FOR AMROHA
-- ============================================================

-- Amroha Tehsil Villages
INSERT INTO villages (code, name_hi, name_en, tehsil_code, district_code) VALUES
  ('117978', 'अटेरना', 'Atairana', 'AMP001', 'AMP'),
  ('117979', 'भीखमपुर', 'Bhikhpur', 'AMP001', 'AMP'),
  ('117980', 'चांदपुर', 'Chandpur', 'AMP001', 'AMP'),
  ('117981', 'गंगोही', 'Gangohi', 'AMP001', 'AMP'),
  ('117982', 'जलालपुर', 'Jalalpur', 'AMP001', 'AMP');

-- Hasanpur Tehsil Villages
INSERT INTO villages (code, name_hi, name_en, tehsil_code, district_code) VALUES
  ('118001', 'सेमरा', 'Semra', 'AMP002', 'AMP'),
  ('118002', 'बाबूगढ़', 'Babugarh', 'AMP002', 'AMP');

-- ============================================================
-- SEED DATA: SAMPLE VILLAGES FOR AGRA
-- ============================================================

-- Agra Tehsil Villages
INSERT INTO villages (code, name_hi, name_en, tehsil_code, district_code) VALUES
  ('200001', 'आगरा', 'Agra', 'AGR001', 'AGR'),
  ('200002', 'किचोका', 'Kichoka', 'AGR001', 'AGR'),
  ('200003', 'बड़ौली', 'Barauli', 'AGR001', 'AGR');

-- Fatehabad Tehsil Villages
INSERT INTO villages (code, name_hi, name_en, tehsil_code, district_code) VALUES
  ('200101', 'फतेहाबाद', 'Fatehabad', 'AGR002', 'AGR'),
  ('200102', 'पिनाहट', 'Pinahat', 'AGR002', 'AGR');
