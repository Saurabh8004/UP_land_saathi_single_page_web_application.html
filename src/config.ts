// ============================================================
// BHUMI SAATHI - Brand Configuration
// Land Record Intelligence Platform
// ============================================================

export const BRAND = {
  name: 'Bhumi Saathi',
  nameHi: 'भूमि साथी',
  tagline: 'Know Your Property. Before You Invest.',
  taglineHi: 'निवेश से पहले अपनी प्रॉपर्टी को समझें।',
  taglineAlt: 'From Gata to Clarity.',
  description: 'Property intelligence platform that helps you understand land records, ownership, location potential, and risk indicators before making major property decisions.',
  descriptionHi: 'प्रॉपर्टी इंटेलिजेंस प्लेटफॉर्म जो आपको बड़े प्रॉपर्टी फैसले लेने से पहले भूमि अभिलेख, मालिकाना हक, लोकेशन पोटेंशियल और रिस्क इंडिकेटर्स को समझने में मदद करता है।',
  disclaimer: 'Bhumi Saathi is an independent technology platform and is not a government website. Information provided supports informed decision-making and does not constitute certified government documents or legal opinions.',
  disclaimerHi: 'भूमि साथी एक स्वतंत्र तकनीकी मंच है और सरकारी वेबसाइट नहीं है। प्रदान की गई जानकारी सूचित निर्णय लेने में सहायता करती है और प्रमाणित सरकारी दस्तावेज़ या कानूनी राय का गठन नहीं करती।',
  phone: '+91-XXXXXXXXXX',
  whatsapp: '919XXXXXXXXX',
  email: 'hello@bhumisaathi.in',
  website: 'https://bhumisaathi.in'
};

// ============================================================
// LANGUAGE
// ============================================================
export type Lang = 'hi' | 'en';

// ============================================================
// TRANSLATIONS
// ============================================================
export const t = {
  hi: {
    nav: {
      home: 'होम',
      howItWorks: 'कैसे काम करता है',
      features: 'विशेषताएं',
      search: 'प्रॉपर्टी खोजें',
      about: 'हमारे बारे में',
      login: 'लॉगिन',
      getStarted: 'प्रॉपर्टी रिपोर्ट पाएं',
      freeTools: 'मुफ्त टूल्स',
      expertConsultation: 'विशेषज्ञ परामर्श'
    },
    hero: {
      headline: 'निवेश से पहले अपनी प्रॉपर्टी को समझें।',
      sub: 'विस्तृत प्रॉपर्टी इनसाइट्स, भूमि अभिलेख, लोकेशन इंटेलिजेंस, रिस्क इंडिकेटर्स और भविष्य की सराहकरण क्षमता — सब एक जगह।',
      cta1: 'प्रॉपर्टी रिपोर्ट पाएं',
      cta2: 'मुफ्त टूल्स देखें',
      trust: 'आपको अधिक सूचित प्रॉपर्टी फैसले लेने में मदद करने के लिए बनाया गया।',
      disclaimer: 'भूमि साथी एक स्वतंत्र तकनीकी मंच है और सरकारी वेबसाइट नहीं है।'
    },
    search: {
      title: 'अपनी प्रॉपर्टी खोजें',
      sub: 'उपलब्ध भूमि-अभिलेख जानकारी चेक करने के लिए लोकेशन और प्रॉपर्टी विवरण दर्ज करें।',
      step1: 'लोकेशन चुनें',
      step2: 'प्रॉपर्टी विवरण',
      step3: 'समीक्षा',
      step4: 'खोजें',
      district: 'ज़िला',
      tehsil: 'तहसील',
      village: 'गाँव',
      gata: 'गाटा / खसरा नंबर',
      khata: 'खाता नंबर (वैकल्पिक)',
      search: 'खोजें',
      searching: 'खोज रहे हैं...',
      review: 'समीक्षा करें',
      back: 'पीछे',
      next: 'आगे'
    },
    result: {
      found: 'प्रॉपर्टी रिकॉर्ड मिला',
      partial: 'कुछ प्रॉपर्टी जानकारी मिली',
      notFound: 'हम यह प्रॉपर्टी नहीं ढूंढ पाए',
      unavailable: 'स्रोत अस्थायी रूप से अनुपलब्ध',
      overview: 'प्रॉपर्टी अवलोकन',
      owner: 'मालिक जानकारी',
      land: 'भूमि विवरण',
      status: 'रिकॉर्ड स्थिति',
      source: 'स्रोत'
    },
    howItWorks: {
      title: 'गाटा से स्पष्टता तक',
      step1Title: 'प्रॉपर्टी दर्ज करें',
      step1Desc: 'चुनें: ज़िला → तहसील → गाँव → गाटा',
      step2Title: 'समझें',
      step2Desc: 'भूमि साथी उपलब्ध प्रॉपर्टी जानकारी को सरल सेक्शन में व्यवस्थित करता है।',
      step3Title: 'वेरिफाई और ट्रैक करें',
      step3Desc: 'स्रोत स्थिति चेक करें, दस्तावेज़ों की तुलना करें और महत्वपूर्ण प्रॉपर्टी जानकारी ट्रैक करें।'
    },
    features: {
      title: 'अपनी प्रॉपर्टी समझने के लिए सब कुछ',
      search: 'प्रॉपर्टी खोज',
      searchDesc: 'लोकेशन और प्रॉपर्टी पहचानकर्ताओं का उपयोग करके अपनी प्रॉपर्टी खोजें।',
      intelligence: 'रिकॉर्ड इंटेलिजेंस',
      intelligenceDesc: 'जटिल भूमि-अभिलेख जानकारी को समझने में आसान विवरण में बदलें।',
      ownership: 'मालिक जानकारी',
      ownershipDesc: 'उपलब्ध मालिकाना हक और शेयर जानकारी समझें।',
      land: 'भूमि विवरण',
      landDesc: 'क्षेत्रफल, भूमि प्रकार और प्रॉपर्टी पहचानकर्ता देखें।',
      mutation: 'म्यूटेशन ट्रैकिंग',
      mutationDesc: 'उपलब्ध म्यूटेशन जानकारी ट्रैक करें।',
      litigation: 'मुकदमा संकेतक',
      litigationDesc: 'उपलब्ध मुकदमा/स्थिति जानकारी समझें।',
      documents: 'दस्तावेज़ सत्यापन',
      documentsDesc: 'प्रॉपर्टी दस्तावेज़ अपलोड करें और उन्हें उपलब्ध रिकॉर्ड जानकारी से तुलना करें।',
      reports: 'स्मार्ट रिपोर्ट',
      reportsDesc: 'एक सरल प्रॉपर्टी सारांश जनरेट करें जो समझने और शेयर करने में आसान हो।'
    },
    trust: {
      title: 'सरकारी भूमि अभिलेखों के इर्द-गिर्द बनाया गया',
      desc: 'भूमि साथी को सरकारी स्रोतों को प्रक्रिया के केंद्र में रखते हुए भूमि-अभिलेख जानकारी की पहुंच, व्याख्या और सत्यापन को सरल बनाने के लिए डिज़ाइन किया गया है।',
      sources: 'सरकारी स्रोत',
      sourcesDesc: 'आधिकारिक भूमि अभिलेख पोर्टल्स से जानकारी',
      transparent: 'पारदर्शी स्थिति',
      transparentDesc: 'हर जानकारी के लिए स्पष्ट स्रोत और सत्यापन स्थिति',
      verification: 'स्पष्ट सत्यापन',
      verificationDesc: 'जानिए कौन सी जानकारी वेरिफाई हुई है और कौन सी नहीं',
      secure: 'सुरक्षित डेटा',
      secureDesc: 'आपकी प्रॉपर्टी जानकारी सुरक्षित और निजी है'
    },
    faq: {
      title: 'अक्सर पूछे जाने वाले प्रश्न',
      q1: 'भूमि साथी क्या है?',
      a1: 'भूमि साथी एक स्वतंत्र तकनीकी मंच है जो भूमि अभिलेख जानकारी को खोजने, समझने और वेरिफाई करने की प्रक्रिया को सरल बनाता है।',
      q2: 'क्या भूमि साथी एक सरकारी वेबसाइट है?',
      a2: 'नहीं, भूमि साथी एक निजी तकनीकी मंच है। हम सरकारी विभाग या पोर्टल नहीं हैं।',
      q3: 'जानकारी कहां से आती है?',
      a3: 'हम उपलब्ध सरकारी भूमि अभिलेख स्रोतों से जानकारी प्राप्त करते हैं और इसे समझने में आसान format में प्रस्तुत करते हैं।',
      q4: 'क्या हर प्रॉपर्टी मिल सकती है?',
      a4: 'सभी प्रॉपर्टी रिकॉर्ड ऑनलाइन उपलब्ध नहीं होते हैं। कुछ रिकॉर्ड्स के लिए अतिरिक्त सत्यापन की आवश्यकता हो सकती है।',
      q5: 'रिकॉर्ड कभी-कभी अनुपलब्ध क्यों होता है?',
      a5: 'सभी रिकॉर्ड डिजिटल नहीं हैं। कुछ रिकॉर्ड्स अभी भी मैन्युअल प्रक्रिया में हैं या तकनीकी समस्याओं के कारण अस्थायी रूप से अनुपलब्ध हो सकते हैं।',
      q6: 'क्या मैं अपनी खतौनी अपलोड कर सकता हूं?',
      a6: 'हाँ, आप अपने दस्तावेज़ अपलोड कर सकते हैं और उन्हें उपलब्ध रिकॉर्ड जानकारी से तुलना कर सकते हैं।',
      q7: 'क्या भूमि साथी मालिकाना हक वेरिफाई कर सकता है?',
      a7: 'हम उपलब्ध रिकॉर्ड जानकारी प्रदान करते हैं, लेकिन कानूनी सलाह या टाइटल गारंटी नहीं देते।',
      q8: 'गाटा नंबर क्या है?',
      a8: 'गाटा (या खसरा) ज़मीन के एक विशिष्ट प्लॉट की पहचान संख्या है।',
      q9: 'खाता नंबर क्या है?',
      a9: 'खाता नंबर भूमि अभिलेखों में मालिकाना हक का रिकॉर्ड है।',
      q10: 'खाता और गाटा में क्या अंतर है?',
      a10: 'गाटा ज़मीन के प्लॉट की पहचान है, जबकि खाता मालिकाना हक का रिकॉर्ड है।'
    },
    footer: {
      product: 'प्रोडक्ट',
      resources: 'संसाधन',
      legal: 'कानूनी',
      help: 'सहायता',
      faqs: 'FAQs',
      privacy: 'गोपनीयता',
      terms: 'शर्तें',
      disclaimer: 'भूमि साथी एक स्वतंत्र तकनीकी मंच है और उत्तर प्रदेश सरकार से संबद्ध या संचालित नहीं है।'
    }
  },
  en: {
    nav: {
      home: 'Home',
      howItWorks: 'How It Works',
      features: 'Features',
      search: 'Property Search',
      about: 'About',
      login: 'Login',
      getStarted: 'Get Property Report',
      freeTools: 'Free Tools',
      expertConsultation: 'Expert Consultation'
    },
    hero: {
      headline: 'Know Your Property. Before You Invest.',
      sub: 'Get detailed property insights, land records, location intelligence, risk indicators and future appreciation potential — all in one place.',
      cta1: 'Get Property Report',
      cta2: 'Explore Free Tools',
      trust: 'Built to help you make more informed property decisions.',
      disclaimer: 'Bhumi Saathi is an independent technology platform and is not a government website.'
    },
    search: {
      title: 'Find Your Property',
      sub: 'Enter the location and property details to check available land-record information.',
      step1: 'Select Location',
      step2: 'Property Details',
      step3: 'Review',
      step4: 'Search',
      district: 'District',
      tehsil: 'Tehsil',
      village: 'Village',
      gata: 'Gata / Khasra Number',
      khata: 'Khata Number (optional)',
      search: 'Search',
      searching: 'Searching...',
      review: 'Review',
      back: 'Back',
      next: 'Next'
    },
    result: {
      found: 'Property Record Found',
      partial: 'Some Property Information Found',
      notFound: "We Couldn't Find This Property",
      unavailable: 'Source Temporarily Unavailable',
      overview: 'Property Overview',
      owner: 'Owner Information',
      land: 'Land Details',
      status: 'Record Status',
      source: 'Source'
    },
    howItWorks: {
      title: 'From Gata to Clarity',
      step1Title: 'Enter Property',
      step1Desc: 'Select: District → Tehsil → Village → Gata',
      step2Title: 'Understand',
      step2Desc: 'Bhumi Saathi organizes available property information into simple sections.',
      step3Title: 'Verify & Track',
      step3Desc: 'Check source status, compare documents and track important property information.'
    },
    features: {
      title: 'Everything You Need to Understand Your Property',
      search: 'Property Search',
      searchDesc: 'Find your property using location and property identifiers.',
      intelligence: 'Record Intelligence',
      intelligenceDesc: 'Turn complicated land-record information into easy-to-understand details.',
      ownership: 'Ownership Information',
      ownershipDesc: 'Understand available ownership and share information.',
      land: 'Land Details',
      landDesc: 'View area, land type and property identifiers.',
      mutation: 'Mutation Tracking',
      mutationDesc: 'Track available mutation information.',
      litigation: 'Litigation Indicators',
      litigationDesc: 'Understand available litigation/status information.',
      documents: 'Document Verification',
      documentsDesc: 'Upload property documents and compare them with available record information.',
      reports: 'Smart Reports',
      reportsDesc: 'Generate a simple property summary that is easier to understand and share.'
    },
    trust: {
      title: 'Built Around Official Land Records',
      desc: 'Bhumi Saathi is designed to simplify access, interpretation and verification of land-record information while keeping official government sources at the centre of the process.',
      sources: 'Official Sources',
      sourcesDesc: 'Information from official land record portals',
      transparent: 'Transparent Status',
      transparentDesc: 'Clear source and verification status for every piece of information',
      verification: 'Clear Verification',
      verificationDesc: 'Know which information is verified and which is not',
      secure: 'Secure Data',
      secureDesc: 'Your property information is secure and private'
    },
    faq: {
      title: 'Frequently Asked Questions',
      q1: 'What is Bhumi Saathi?',
      a1: 'Bhumi Saathi is an independent technology platform that simplifies the process of finding, understanding and verifying land-record information.',
      q2: 'Is Bhumi Saathi a government website?',
      a2: 'No, Bhumi Saathi is a private technology platform. We are not a government department or portal.',
      q3: 'Where does the information come from?',
      a3: 'We retrieve information from available official land-record sources and present it in an easy-to-understand format.',
      q4: 'Can every property be found?',
      a4: 'Not all property records are available online. Some records may require additional verification.',
      q5: 'Why can a record sometimes be unavailable?',
      a5: 'Not all records are digitized. Some records are still in manual processes or may be temporarily unavailable due to technical issues.',
      q6: 'Can I upload my Khatauni?',
      a6: 'Yes, you can upload your documents and compare them with available record information.',
      q7: 'Can Bhumi Saathi verify ownership?',
      a7: 'We provide available record information, but we do not provide legal advice or title guarantees.',
      q8: 'What is a Gata number?',
      a8: 'Gata (or Khasra) is the unique identification number of a specific plot of land.',
      q9: 'What is a Khata number?',
      a9: 'Khata number is the record of ownership in land records.',
      q10: 'What is the difference between Khata and Gata?',
      a10: 'Gata identifies the land plot, while Khata is the record of ownership.'
    },
    footer: {
      product: 'Product',
      resources: 'Resources',
      legal: 'Legal',
      help: 'Help',
      faqs: 'FAQs',
      privacy: 'Privacy',
      terms: 'Terms',
      disclaimer: 'Bhumi Saathi is an independent technology platform and is not affiliated with or operated by the Government of Uttar Pradesh.'
    }
  }
};

// ============================================================
// 75 UTTAR PRADESH DISTRICTS
// ============================================================
export const DISTRICTS = [
  { code: '001', name_hi: 'आगरा', name_en: 'Agra' },
  { code: '002', name_hi: 'अलीगढ़', name_en: 'Aligarh' },
  { code: '003', name_hi: 'इलाहाबाद', name_en: 'Allahabad' },
  { code: '004', name_hi: 'अम्बेडकर नगर', name_en: 'Ambedkar Nagar' },
  { code: '005', name_hi: 'अमेठी', name_en: 'Amethi' },
  { code: '006', name_hi: 'अमरोहा', name_en: 'Amroha' },
  { code: '007', name_hi: 'औरैया', name_en: 'Auraiya' },
  { code: '008', name_hi: 'आज़मगढ़', name_en: 'Azamgarh' },
  { code: '009', name_hi: 'बागपत', name_en: 'Baghpat' },
  { code: '010', name_hi: 'बहराइच', name_en: 'Bahraich' },
  { code: '011', name_hi: 'बलिया', name_en: 'Ballia' },
  { code: '012', name_hi: 'बलरामपुर', name_en: 'Balrampur' },
  { code: '013', name_hi: 'बांदा', name_en: 'Banda' },
  { code: '014', name_hi: 'बारबंकी', name_en: 'Barabanki' },
  { code: '015', name_hi: 'बरेली', name_en: 'Bareilly' },
  { code: '016', name_hi: 'बस्ती', name_en: 'Basti' },
  { code: '017', name_hi: 'बिजनौर', name_en: 'Bijnor' },
  { code: '018', name_hi: 'बदायूं', name_en: 'Budaun' },
  { code: '019', name_hi: 'बुलंदशहर', name_en: 'Bulandshahr' },
  { code: '020', name_hi: 'चंदौली', name_en: 'Chandauli' },
  { code: '021', name_hi: 'चित्रकूट', name_en: 'Chitrakoot' },
  { code: '022', name_hi: 'देवरिया', name_en: 'Deoria' },
  { code: '023', name_hi: 'इटावा', name_en: 'Etawah' },
  { code: '024', name_hi: 'फैजाबाद', name_en: 'Faizabad' },
  { code: '025', name_hi: 'फर्रुखाबाद', name_en: 'Farrukhabad' },
  { code: '026', name_hi: 'फतेहपुर', name_en: 'Fatehpur' },
  { code: '027', name_hi: 'फिरोजाबाद', name_en: 'Firozabad' },
  { code: '028', name_hi: 'गौतम बुद्ध नगर', name_en: 'Gautam Buddha Nagar' },
  { code: '029', name_hi: 'गाजियाबाद', name_en: 'Ghaziabad' },
  { code: '030', name_hi: 'गाजीपुर', name_en: 'Ghazipur' },
  { code: '031', name_hi: 'गोंडा', name_en: 'Gonda' },
  { code: '032', name_hi: 'गोरखपुर', name_en: 'Gorakhpur' },
  { code: '033', name_hi: 'हमीरपुर', name_en: 'Hamirpur' },
  { code: '034', name_hi: 'हापुर', name_en: 'Hapur' },
  { code: '035', name_hi: 'हरदोई', name_en: 'Hardoi' },
  { code: '036', name_hi: 'हाथरस', name_en: 'Hathras' },
  { code: '037', name_hi: 'जालौन', name_en: 'Jalaun' },
  { code: '038', name_hi: 'जौनपुर', name_en: 'Jaunpur' },
  { code: '039', name_hi: 'झांसी', name_en: 'Jhansi' },
  { code: '040', name_hi: 'कन्नौज', name_en: 'Kannauj' },
  { code: '041', name_hi: 'कानपुर देहात', name_en: 'Kanpur Dehat' },
  { code: '042', name_hi: 'कानपुर नगर', name_en: 'Kanpur Nagar' },
  { code: '043', name_hi: 'कासगंज', name_en: 'Kasganj' },
  { code: '044', name_hi: 'कौशाम्बी', name_en: 'Kaushambi' },
  { code: '045', name_hi: 'कुशीनगर', name_en: 'Kushinagar' },
  { code: '046', name_hi: 'लखीमपुर खीरी', name_en: 'Lakhimpur Kheri' },
  { code: '047', name_hi: 'ललितपुर', name_en: 'Lalitpur' },
  { code: '048', name_hi: 'लखनऊ', name_en: 'Lucknow' },
  { code: '049', name_hi: 'महराजगंज', name_en: 'Maharajganj' },
  { code: '050', name_hi: 'महोबा', name_en: 'Mahoba' },
  { code: '051', name_hi: 'मैनपुरी', name_en: 'Mainpuri' },
  { code: '052', name_hi: 'मथुरा', name_en: 'Mathura' },
  { code: '053', name_hi: 'मऊ', name_en: 'Mau' },
  { code: '054', name_hi: 'मेरठ', name_en: 'Meerut' },
  { code: '055', name_hi: 'मिर्जापुर', name_en: 'Mirzapur' },
  { code: '056', name_hi: 'मुरादाबाद', name_en: 'Moradabad' },
  { code: '057', name_hi: 'मुजफ्फरनगर', name_en: 'Muzaffarnagar' },
  { code: '058', name_hi: 'पीलीभीत', name_en: 'Pilibhit' },
  { code: '059', name_hi: 'प्रतापगढ़', name_en: 'Pratapgarh' },
  { code: '060', name_hi: 'रायबरेली', name_en: 'Raebareli' },
  { code: '061', name_hi: 'रामपुर', name_en: 'Rampur' },
  { code: '062', name_hi: 'सहारनपुर', name_en: 'Saharanpur' },
  { code: '063', name_hi: 'सम्भल', name_en: 'Sambhal' },
  { code: '064', name_hi: 'संत कबीर नगर', name_en: 'Sant Kabir Nagar' },
  { code: '065', name_hi: 'शाहजहांपुर', name_en: 'Shahjahanpur' },
  { code: '066', name_hi: 'शामली', name_en: 'Shamli' },
  { code: '067', name_hi: 'श्रावस्ती', name_en: 'Shravasti' },
  { code: '068', name_hi: 'सिद्धार्थनगर', name_en: 'Siddharthnagar' },
  { code: '069', name_hi: 'सीतापुर', name_en: 'Sitapur' },
  { code: '070', name_hi: 'सोनभद्र', name_en: 'Sonbhadra' },
  { code: '071', name_hi: 'सुल्तानपुर', name_en: 'Sultanpur' },
  { code: '072', name_hi: 'उन्नाव', name_en: 'Unnao' },
  { code: '073', name_hi: 'वाराणसी', name_en: 'Varanasi' },
  { code: '074', name_hi: 'बुलंदशहर', name_en: 'Bulandshahr' },
  { code: '075', name_hi: 'हथरस', name_en: 'Hathras' }
];

// ============================================================
// LEGAL TERMS (with tooltips)
// ============================================================
export const LEGAL_TERMS = {
  gata: {
    hi: 'गाटा/खसरा — ज़मीन के एक विशिष्ट प्लॉट की पहचान संख्या',
    en: 'Gata/Khasra — Unique identification number of a specific plot of land'
  },
  khata: {
    hi: 'खाता — भूमि अभिलेखों में मालिकाना हक का रिकॉर्ड',
    en: 'Khata — Record of ownership in land records'
  },
  khatauni: {
    hi: 'खतौनी — भूमि अभिलेख दस्तावेज़',
    en: 'Khatauni — Land record document'
  },
  mutation: {
    hi: 'म्यूटेशन — मालिकाना हक में परिवर्तन का रिकॉर्ड',
    en: 'Mutation — Record of change in ownership'
  },
  litigation: {
    hi: 'मुकदमा — कानूनी विवाद या मामले की स्थिति',
    en: 'Litigation — Status of legal dispute or case'
  }
};
