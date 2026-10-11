-- ============================================================
-- SEED DATA: 75 UTTAR PRADESH DISTRICTS
-- ============================================================

CREATE TABLE IF NOT EXISTS districts (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_hi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  division TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent insert: updates names/division if they differ, preserves existing correct data
INSERT INTO districts (code, name_hi, name_en, division) VALUES
  ('AGR', 'आगरा', 'Agra', 'Agra'),
  ('ALG', 'अलीगढ़', 'Aligarh', 'Aligarh'),
  ('ALL', 'प्रयागराज', 'Prayagraj', 'Prayagraj'),
  ('ABN', 'अम्बेडकर नगर', 'Ambedkar Nagar', 'Ayodhya'),
  ('AMR', 'अमेठी', 'Amethi', 'Ayodhya'),
  ('AMP', 'अमरोहा', 'Amroha', 'Moradabad'),
  ('AUR', 'औरैया', 'Auraiya', 'Kanpur'),
  ('AZM', 'आज़मगढ़', 'Azamgarh', 'Azamgarh'),
  ('BAG', 'बागपत', 'Baghpat', 'Meerut'),
  ('BHD', 'भदोही', 'Bhadohi', 'Varanasi'),
  ('BHR', 'बहराइच', 'Bahraich', 'Devipatan'),
  ('BLI', 'बलिया', 'Ballia', 'Azamgarh'),
  ('BLP', 'बलरामपुर', 'Balrampur', 'Devipatan'),
  ('BAN', 'बांदा', 'Banda', 'Chitrakoot'),
  ('BBI', 'बाराबंकी', 'Barabanki', 'Lucknow'),
  ('BRM', 'बरेली', 'Bareilly', 'Bareilly'),
  ('BST', 'बस्ती', 'Basti', 'Basti'),
  ('BJR', 'बिजनौर', 'Bijnor', 'Moradabad'),
  ('BDN', 'बदायूं', 'Budaun', 'Bareilly'),
  ('BUL', 'बुलंदशहर', 'Bulandshahr', 'Aligarh'),
  ('CNM', 'चंदौली', 'Chandauli', 'Varanasi'),
  ('CTK', 'चित्रकूट', 'Chitrakoot', 'Chitrakoot'),
  ('DEV', 'देवरिया', 'Deoria', 'Gorakhpur'),
  ('ETA', 'एटा', 'Etah', 'Agra'),
  ('ETW', 'इटावा', 'Etawah', 'Agra'),
  ('FBD', 'अयोध्या', 'Ayodhya', 'Ayodhya'),  -- Legacy code FBD (formerly Faizabad), do not change without coordinated migration
  ('FRK', 'फर्रुखाबाद', 'Farrukhabad', 'Kanpur'),
  ('FTP', 'फतेहपुर', 'Fatehpur', 'Kanpur'),
  ('FZR', 'फिरोजाबाद', 'Firozabad', 'Agra'),
  ('GBN', 'गौतम बुद्ध नगर', 'Gautam Buddha Nagar', 'Meerut'),
  ('GZI', 'गाज़ियाबाद', 'Ghaziabad', 'Meerut'),
  ('GZP', 'गाजीपुर', 'Ghazipur', 'Varanasi'),
  ('GND', 'गोंडा', 'Gonda', 'Devipatan'),
  ('GKP', 'गोरखपुर', 'Gorakhpur', 'Gorakhpur'),
  ('HMP', 'हमीरपुर', 'Hamirpur', 'Chitrakoot'),
  ('HPR', 'हापुर', 'Hapur', 'Meerut'),
  ('HRD', 'हरदोई', 'Hardoi', 'Lucknow'),
  ('HRS', 'हाथरस', 'Hathras', 'Aligarh'),
  ('JLN', 'जालौन', 'Jalaun', 'Kanpur'),
  ('JNP', 'जौनपुर', 'Jaunpur', 'Varanasi'),
  ('JHS', 'झांसी', 'Jhansi', 'Jhansi'),
  ('KNJ', 'कन्नौज', 'Kannauj', 'Kanpur'),
  ('KPD', 'कानपुर देहात', 'Kanpur Dehat', 'Kanpur'),
  ('KPN', 'कानपुर नगर', 'Kanpur Nagar', 'Kanpur'),
  ('KSG', 'कासगंज', 'Kasganj', 'Aligarh'),
  ('KSM', 'कौशाम्बी', 'Kaushambi', 'Prayagraj'),
  ('KSN', 'कुशीनगर', 'Kushinagar', 'Gorakhpur'),
  ('LKP', 'लखीमपुर खीरी', 'Lakhimpur Kheri', 'Lucknow'),
  ('LTP', 'ललितपुर', 'Lalitpur', 'Jhansi'),
  ('LKO', 'लखनऊ', 'Lucknow', 'Lucknow'),
  ('MRG', 'महराजगंज', 'Maharajganj', 'Gorakhpur'),
  ('MBA', 'महोबा', 'Mahoba', 'Chitrakoot'),
  ('MPR', 'मैनपुरी', 'Mainpuri', 'Agra'),
  ('MTH', 'मथुरा', 'Mathura', 'Agra'),
  ('MAU', 'मऊ', 'Mau', 'Azamgarh'),
  ('MRT', 'मेरठ', 'Meerut', 'Meerut'),
  ('MZP', 'मिर्जापुर', 'Mirzapur', 'Varanasi'),
  ('MDB', 'मुरादाबाद', 'Moradabad', 'Moradabad'),
  ('MZF', 'मुजफ्फरनगर', 'Muzaffarnagar', 'Saharanpur'),
  ('PLB', 'पीलीभीत', 'Pilibhit', 'Bareilly'),
  ('PTG', 'प्रतापगढ़', 'Pratapgarh', 'Prayagraj'),
  ('RBR', 'रायबरेली', 'Rae Bareli', 'Lucknow'),
  ('RMP', 'रामपुर', 'Rampur', 'Moradabad'),
  ('SHN', 'सहारनपुर', 'Saharanpur', 'Saharanpur'),
  ('SMB', 'संभल', 'Sambhal', 'Moradabad'),
  ('SKN', 'संत कबीर नगर', 'Sant Kabir Nagar', 'Basti'),
  ('SHP', 'शाहजहांपुर', 'Shahjahanpur', 'Bareilly'),
  ('SML', 'शामली', 'Shamli', 'Saharanpur'),
  ('SVI', 'श्रावस्ती', 'Shravasti', 'Devipatan'),
  ('SDN', 'सिद्धार्थनगर', 'Siddharthnagar', 'Basti'),
  ('STP', 'सीतापुर', 'Sitapur', 'Lucknow'),
  ('SNB', 'सोनभद्र', 'Sonbhadra', 'Varanasi'),
  ('SLP', 'सुल्तानपुर', 'Sultanpur', 'Ayodhya'),
  ('UNO', 'उन्नाव', 'Unnao', 'Lucknow'),
  ('VNS', 'वाराणसी', 'Varanasi', 'Varanasi')
ON CONFLICT (code) DO UPDATE SET
  name_hi = EXCLUDED.name_hi,
  name_en = EXCLUDED.name_en,
  division = EXCLUDED.division
WHERE districts.name_hi IS DISTINCT FROM EXCLUDED.name_hi
   OR districts.name_en IS DISTINCT FROM EXCLUDED.name_en
   OR districts.division IS DISTINCT FROM EXCLUDED.division;

-- Create indexes (safe to rerun)
CREATE INDEX IF NOT EXISTS idx_districts_code ON districts(code);
CREATE INDEX IF NOT EXISTS idx_districts_name_en ON districts(name_en);
CREATE INDEX IF NOT EXISTS idx_districts_division ON districts(division);
