// ============================================================
// DISTRICTS CONFIGURATION
// 75 Districts of Uttar Pradesh
// ============================================================

export interface District {
  code: string;
  name_hi: string;
  name_en: string;
  division: string;
}

export const DISTRICTS: District[] = [
  { code: 'AGR', name_hi: 'आगरा', name_en: 'Agra', division: 'Agra' },
  { code: 'ALG', name_hi: 'अलीगढ़', name_en: 'Aligarh', division: 'Aligarh' },
  { code: 'PRY', name_hi: 'प्रयागराज', name_en: 'Prayagraj', division: 'Prayagraj' },
  { code: 'ABN', name_hi: 'अम्बेडकर नगर', name_en: 'Ambedkar Nagar', division: 'Ayodhya' },
  { code: 'AME', name_hi: 'अमेठी', name_en: 'Amethi', division: 'Ayodhya' },
  { code: 'AMR', name_hi: 'अमरोहा', name_en: 'Amroha', division: 'Moradabad' },
  { code: 'AUR', name_hi: 'औरैया', name_en: 'Auraiya', division: 'Kanpur' },
  { code: 'AZM', name_hi: 'आज़मगढ़', name_en: 'Azamgarh', division: 'Azamgarh' },
  { code: 'BGP', name_hi: 'बागपत', name_en: 'Baghpat', division: 'Meerut' },
  { code: 'BRH', name_hi: 'बहराइच', name_en: 'Bahraich', division: 'Devipatan' },
  { code: 'BLI', name_hi: 'बलिया', name_en: 'Ballia', division: 'Azamgarh' },
  { code: 'BLP', name_hi: 'बलरामपुर', name_en: 'Balrampur', division: 'Devipatan' },
  { code: 'BND', name_hi: 'बांदा', name_en: 'Banda', division: 'Chitrakoot' },
  { code: 'BBI', name_hi: 'बारابंकी', name_en: 'Barabanki', division: 'Lucknow' },
  { code: 'BRM', name_hi: 'बरेली', name_en: 'Bareilly', division: 'Bareilly' },
  { code: 'BST', name_hi: 'बस्ती', name_en: 'Basti', division: 'Basti' },
  { code: 'BJR', name_hi: 'बिजनौर', name_en: 'Bijnor', division: 'Moradabad' },
  { code: 'BDN', name_hi: 'बदायूं', name_en: 'Budaun', division: 'Bareilly' },
  { code: 'BLS', name_hi: 'बुलंदशहर', name_en: 'Bulandshahr', division: 'Aligarh' },
  { code: 'CDL', name_hi: 'चंदौली', name_en: 'Chandauli', division: 'Varanasi' },
  { code: 'CTK', name_hi: 'चित्रकूट', name_en: 'Chitrakoot', division: 'Chitrakoot' },
  { code: 'DRM', name_hi: 'देवरिया', name_en: 'Deoria', division: 'Gorakhpur' },
  { code: 'ETA', name_hi: 'इटावा', name_en: 'Etah', division: 'Agra' },
  { code: 'ETW', name_hi: 'इटावा', name_en: 'Etawah', division: 'Agra' },
  { code: 'FBD', name_hi: 'फैजाबाद', name_en: 'Faizabad', division: 'Ayodhya' },
  { code: 'FRK', name_hi: 'फर्रुखाबाद', name_en: 'Farrukhabad', division: 'Kanpur' },
  { code: 'FTP', name_hi: 'फतेहपुर', name_en: 'Fatehpur', division: 'Kanpur' },
  { code: 'FZR', name_hi: 'फिरोजाबाद', name_en: 'Firozabad', division: 'Agra' },
  { code: 'GBN', name_hi: 'गौतम बुद्ध नगर', name_en: 'Gautam Buddha Nagar', division: 'Meerut' },
  { code: 'GZB', name_hi: 'गाजियाबाद', name_en: 'Ghaziabad', division: 'Meerut' },
  { code: 'GZP', name_hi: 'गाजीपुर', name_en: 'Ghazipur', division: 'Varanasi' },
  { code: 'GND', name_hi: 'गोंडा', name_en: 'Gonda', division: 'Devipatan' },
  { code: 'GKP', name_hi: 'गोरखपुर', name_en: 'Gorakhpur', division: 'Gorakhpur' },
  { code: 'HMP', name_hi: 'हमीरपुर', name_en: 'Hamirpur', division: 'Chitrakoot' },
  { code: 'HPR', name_hi: 'हापुर', name_en: 'Hapur', division: 'Meerut' },
  { code: 'HRD', name_hi: 'हरदोई', name_en: 'Hardoi', division: 'Lucknow' },
  { code: 'HRS', name_hi: 'हाथरस', name_en: 'Hathras', division: 'Aligarh' },
  { code: 'JLN', name_hi: 'जालौन', name_en: 'Jalaun', division: 'Kanpur' },
  { code: 'JNP', name_hi: 'जौनपुर', name_en: 'Jaunpur', division: 'Varanasi' },
  { code: 'JHS', name_hi: 'झांसी', name_en: 'Jhansi', division: 'Jhansi' },
  { code: 'KNJ', name_hi: 'कन्नौज', name_en: 'Kannauj', division: 'Kanpur' },
  { code: 'KPD', name_hi: 'कानपुर देहात', name_en: 'Kanpur Dehat', division: 'Kanpur' },
  { code: 'KPN', name_hi: 'कानपुर नगर', name_en: 'Kanpur Nagar', division: 'Kanpur' },
  { code: 'KSG', name_hi: 'कासगंज', name_en: 'Kasganj', division: 'Aligarh' },
  { code: 'KSM', name_hi: 'कौशाम्बी', name_en: 'Kaushambi', division: 'Prayagraj' },
  { code: 'KSN', name_hi: 'कुशीनगर', name_en: 'Kushinagar', division: 'Gorakhpur' },
  { code: 'LKK', name_hi: 'लखीमपुर खीरी', name_en: 'Lakhimpur Kheri', division: 'Lucknow' },
  { code: 'LTP', name_hi: 'ललितपुर', name_en: 'Lalitpur', division: 'Jhansi' },
  { code: 'LKO', name_hi: 'लखनऊ', name_en: 'Lucknow', division: 'Lucknow' },
  { code: 'MRG', name_hi: 'महराजगंज', name_en: 'Maharajganj', division: 'Gorakhpur' },
  { code: 'MBA', name_hi: 'महोबा', name_en: 'Mahoba', division: 'Chitrakoot' },
  { code: 'MPR', name_hi: 'मैनपुरी', name_en: 'Mainpuri', division: 'Agra' },
  { code: 'MTH', name_hi: 'मथुरा', name_en: 'Mathura', division: 'Agra' },
  { code: 'MAU', name_hi: 'मऊ', name_en: 'Mau', division: 'Azamgarh' },
  { code: 'MRT', name_hi: 'मेरठ', name_en: 'Meerut', division: 'Meerut' },
  { code: 'MZP', name_hi: 'मिर्जापुर', name_en: 'Mirzapur', division: 'Varanasi' },
  { code: 'MDB', name_hi: 'मुरादाबाद', name_en: 'Moradabad', division: 'Moradabad' },
  { code: 'MZF', name_hi: 'मुजफ्फरनगर', name_en: 'Muzaffarnagar', division: 'Saharanpur' },
  { code: 'PLB', name_hi: 'पीलीभीत', name_en: 'Pilibhit', division: 'Bareilly' },
  { code: 'PTG', name_hi: 'प्रतापगढ़', name_en: 'Pratapgarh', division: 'Prayagraj' },
  { code: 'RBR', name_hi: 'रायबरेली', name_en: 'Rae Bareli', division: 'Lucknow' },
  { code: 'RMP', name_hi: 'रामपुर', name_en: 'Rampur', division: 'Moradabad' },
  { code: 'SHN', name_hi: 'सहारनपुर', name_en: 'Saharanpur', division: 'Saharanpur' },
  { code: 'SMB', name_hi: 'संभल', name_en: 'Sambhal', division: 'Moradabad' },
  { code: 'SKN', name_hi: 'संत कबीर नगर', name_en: 'Sant Kabir Nagar', division: 'Basti' },
  { code: 'SHP', name_hi: 'शाहजहांपुर', name_en: 'Shahjahanpur', division: 'Bareilly' },
  { code: 'SML', name_hi: 'शामली', name_en: 'Shamli', division: 'Saharanpur' },
  { code: 'SVI', name_hi: 'श्रावस्ती', name_en: 'Shravasti', division: 'Devipatan' },
  { code: 'SDN', name_hi: 'सिद्धार्थनगर', name_en: 'Siddharthnagar', division: 'Basti' },
  { code: 'STP', name_hi: 'सीतापुर', name_en: 'Sitapur', division: 'Lucknow' },
  { code: 'SNB', name_hi: 'सोनभद्र', name_en: 'Sonbhadra', division: 'Varanasi' },
  { code: 'SLP', name_hi: 'सुल्तानपुर', name_en: 'Sultanpur', division: 'Ayodhya' },
  { code: 'UNO', name_hi: 'उन्नाव', name_en: 'Unnao', division: 'Lucknow' },
  { code: 'VNS', name_hi: 'वाराणसी', name_en: 'Varanasi', division: 'Varanasi' }
];

// Helper to get district by code
export function getDistrictByCode(code: string): District | undefined {
  return DISTRICTS.find(d => d.code === code);
}

// Helper to get district by name (English)
export function getDistrictByName(name: string): District | undefined {
  return DISTRICTS.find(d => d.name_en.toLowerCase() === name.toLowerCase());
}

// Helper to get all district names (English)
export function getDistrictNames(): string[] {
  return DISTRICTS.map(d => d.name_en).sort();
}

// Helper to get all district names (Hindi)
export function getDistrictNamesHi(): string[] {
  return DISTRICTS.map(d => d.name_hi).sort();
}
