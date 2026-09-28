// ============================================================
// ZameenSaathi - Complete Configuration
// ============================================================

// BRAND
export const BRAND = {
  name: 'ZameenSaathi',
  taglineHi: 'ज़मीन खरीदने से पहले, सच जानिए',
  taglineEn: 'Know the truth before buying land',
  phone: '+91-XXXXXXXXXX',
  whatsapp: '919XXXXXXXXX', // WhatsApp number without +
  email: 'info@zameensaathi.in',
  website: 'https://zameensaathi.in',
  disclaimer: {
    hi: 'ZameenSaathi एक प्राइवेट कंसल्टेंसी है, सरकारी पोर्टल नहीं। रिपोर्ट उपलब्ध रिकॉर्ड्स और दस्तावेज़ों पर आधारित एक प्रोफेशनल राय है, टाइटल की गारंटी नहीं।',
    en: 'ZameenSaathi is a private consultancy, not a government portal. The report is a professional opinion based on available records and documents, not a title guarantee.'
  }
};

// LANGUAGE
export type Lang = 'hi' | 'en';

// ============================================================
// TRANSLATIONS
// ============================================================
export const t = {
  hi: {
    // Header
    nav: {
      services: 'सेवाएं',
      howItWorks: 'कैसे काम करता है',
      sampleReport: 'सैंपल रिपोर्ट',
      freeTools: 'मुफ्त टूल्स',
      forBrokers: 'ब्रोकर और बिल्डर के लिए',
      faq: 'FAQ',
      bookReport: 'रिपोर्ट बुक करें',
      track: 'स्टेटस देखें'
    },
    // Hero
    hero: {
      headline: 'ज़मीन का सौदा करने से पहले उसकी पूरी जाँच कराएँ',
      sub: 'खतौनी, नक्शा, कोर्ट केस और भार की जाँच, आसान रिपोर्ट में। उत्तर प्रदेश के लिए।',
      cta1: 'रिपोर्ट बुक करें',
      cta2: 'सैंपल रिपोर्ट देखें',
      formTitle: 'फ्री रिस्क चेक शुरू करें',
      district: 'ज़िला चुनें',
      tehsil: 'तहसील',
      gata: 'गाटा/खसरा नंबर',
      mobile: 'मोबाइल नंबर',
      submit: 'फ्री रिस्क चेक शुरू करें'
    },
    trust: ['एडवोकेट रिव्यू', 'फील्ड वेरिफिकेशन उपलब्ध', '24-48 घंटे में रिपोर्ट', 'सेक्योर पेमेंट'],
    // Problem
    problem: {
      title: 'ये गलतियाँ महँगी पड़ती हैं',
      cards: [
        { title: 'नकली/डबल रजिस्ट्री', desc: 'एक ही ज़मीन दो-तीन लोगों के नाम बिक चुकी होती है। उदाहरण: लखनऊ में एक प्लॉट तीन लोगों को बेचा गया, खरीदार को बाद में पता चला।' },
        { title: 'सरकारी/ग्राम सभा ज़मीन', desc: 'सरकारी या ग्राम सभा की ज़मीन का बिकना गैरकानूनी है। उदाहरण: कानपुर में ग्राम सभा की ज़मीन पर अवैध कब्ज़ा।' },
        { title: 'खतौनी-बयाना में नाम/रकबा mismatch', desc: 'कागज़ में नाम या रकबा अलग-अलग लिखा हो। उदाहरण: बयाने में 500 वर्ग मीटर लिखा, खतौनी में 300।' },
        { title: 'कोर्ट केस या स्टे ऑर्डर', desc: 'ज़मीन पर कोर्ट का केस या स्टे ऑर्डर चल रहा हो। उदाहरण: प्रयागराज में विरासत के केस में ज़मीन पर स्टे था, खरीदार को नहीं पता चला।' }
      ]
    },
    // How it works
    howItWorks: {
      title: 'कैसे काम करता है',
      steps: [
        { title: 'डिटेल्स भेजें', desc: 'ज़िला, तहसील, गाटा नंबर और ज़रूरी दस्तावेज़ भेजें' },
        { title: 'पैकेज चुनें और पेमेंट करें', desc: 'अपनी ज़रूरत के हिसाब से पैकेज चुनें, ऑनलाइन पेमेंट करें' },
        { title: 'हमारी टीम वेरिफाई करती है', desc: 'ऑनलाइन रिकॉर्ड्स + फील्ड वेरिफिकेशन (पैकेज के हिसाब से)' },
        { title: 'PDF रिपोर्ट + कॉल पर समझाया', desc: 'आसान भाषा में रिपोर्ट, कॉल पर पूरी समझाई' }
      ]
    },
    // Packages
    packages: {
      title: 'पैकेज और कीमत',
      fieldNote: 'फील्ड वेरिफिकेशन सिर्फ सेलेक्ट ज़िलों में। बुकिंग पर अवेलेबिलिटी कन्फर्म होगी।',
      quickCheck: {
        name: 'Quick Check',
        price: '₹499',
        desc: 'ऑनलाइन बेसिक चेक',
        delivery: '24 घंटे में',
        features: ['खतौनी ओनर/शेयर चेक', 'गाटा-रकबा मैच', 'बेसिक रेड फ्लैग्स']
      },
      verified: {
        name: 'Verified Report',
        price: '₹1,999',
        badge: 'सबसे ज़्यादा चुना गया',
        desc: 'पूरी जाँच + फील्ड वेरिफिकेशन',
        delivery: '48-72 घंटे में',
        features: ['Quick Check की सब चीज़ें', 'नक्शा/बाउंड्री चेक', 'कोर्ट केस सर्च (RCCMS)', 'बैंक चार्ज/एनकम्ब्रेंस पॉइंटर्स', 'सरकारी/ग्राम सभा कैटेगरी रिस्क', 'ऑन-ग्राउंड फील्ड वेरिफिकेशन', 'एडवोकेट रिव्यू नोट']
      },
      dealSupport: {
        name: 'Deal Support',
        price: '₹4,999 से',
        desc: 'पूरी डील में साथ',
        delivery: 'कस्टम टाइमलाइन',
        features: ['Verified Report की सब चीज़ें', 'बयानामा ड्राफ्ट रिव्यू', 'रजिस्ट्री और स्टांप गाइडेंस', 'दाखिल-खारिज फॉलो-अप', 'डेडिकेटेड कोऑर्डिनेटर'],
        cta: 'कोट पाएँ'
      }
    },
    // Sample Report
    sampleReport: {
      title: 'सैंपल रिपोर्ट',
      desc: 'एक अनोनाइम्ड रिपोर्ट का प्रीव्यू',
      download: 'सैंपल PDF डाउनलोड करें',
      sections: {
        owner: 'ओनर और शेयर',
        gata: 'गाटा/रकबा',
        map: 'मैप समरी',
        court: 'कोर्ट केसेस',
        encumbrance: 'एनकम्ब्रेंस',
        riskScore: 'रिस्क स्कोर',
        advocateNote: 'एडवोकेट नोट',
        nextSteps: 'आगे क्या करें'
      },
      riskLevels: { low: 'कम', medium: 'मध्यम', high: 'ज़्यादा' }
    },
    // Free Tools
    freeTools: {
      title: 'मुफ्त टूल्स और लिंक्स',
      portals: 'सरकारी पोर्टल्स (Official govt site, हमारी साइट नहीं)',
      stampDuty: 'स्टैंप ड्यूटी कैलकुलेटर',
      checklist: 'दस्तावेज़ चेकलिस्ट',
      calculator: {
        title: 'स्टैंप ड्यूटी और रजिस्ट्रेशन फीस',
        propertyValue: 'प्रॉपर्टी वैल्यू (₹)',
        buyerType: 'खरीदार का प्रकार',
        male: 'पुरुष',
        female: 'महिला',
        joint: 'जॉइंट',
        areaType: 'एरिया टाइप',
        urban: 'शहरी',
        rural: 'ग्रामीण',
        calculate: 'कैलकुलेट करें',
        result: 'अनुमानित स्टैंप ड्यूटी',
        regFee: 'रजिस्ट्रेशन फीस',
        total: 'कुल',
        note: 'अनुमानित। लेटेस्ट के लिए IGRSUP चेक करें।'
      },
      checklistTool: {
        title: 'दस्तावेज़ चेकलिस्ट',
        buy: 'खरीदने के लिए',
        sell: 'बेचने के लिए',
        inherit: 'विरासत के लिए',
        print: 'प्रिंट करें'
      }
    },
    // B2B
    b2b: {
      title: 'ब्रोकर, बिल्डर और फाइनेंसियर्स के लिए',
      subtitle: 'Bulk verification for your deals',
      benefits: ['वॉल्यूम प्राइसिंग', 'डेडिकेटेड मैनेजर', 'मंथली इनवॉइस', 'व्हाइट-लेबल रिपोर्ट'],
      form: {
        company: 'कंपनी का नाम',
        contact: 'संपर्क व्यक्ति',
        mobile: 'मोबाइल',
        email: 'ईमेल',
        volume: 'मंथली वॉल्यूम',
        city: 'शहर',
        submit: 'भेजें'
      }
    },
    // Why Us
    whyUs: {
      title: 'हम पर भरोसा क्यों?',
      points: ['एडवोकेट पैनल', 'लोकल फील्ड टीम', 'लिखित में क्लियर स्कोप', 'डेटा प्राइवेसी', 'रिफंड पॉलिसी'],
      notDo: 'हम क्या नहीं करते',
      notDoPoints: [
        'हम टाइटल की गारंटी नहीं देते',
        'हम सरकारी दफ्तर नहीं हैं',
        'हमारी रिपोर्ट उपलब्ध रिकॉर्ड्स पर आधारित एक राय है'
      ]
    },
    // Testimonials
    testimonials: {
      title: 'लोग क्या कहते हैं',
      note: '⚠️ REPLACE WITH REAL REVIEWS ONLY',
      placeholder: 'असली रिव्यू जल्द जोड़े जाएंगे'
    },
    // FAQ
    faq: {
      title: 'अक्सर पूछे जाने वाले सवाल',
      questions: [
        { q: 'क्या यह सरकारी साइट है?', a: 'नहीं, ZameenSaathi एक प्राइवेट कंसल्टेंसी है। हम सरकारी पोर्टल नहीं हैं।' },
        { q: 'कौन से डॉक्यूमेंट्स चाहिए?', a: 'गाटा/खसरा नंबर, ज़िला, तहसील। अगर आपके पास खतौनी या बयानामा है तो वो भी भेज सकते हैं।' },
        { q: 'रिपोर्ट कितने दिन में मिलती है?', a: 'Quick Check 24 घंटे में, Verified Report 48-72 घंटे में, Deal Support कस्टम टाइमलाइन पर।' },
        { q: 'क्या आप टाइटल गारंटी करते हो?', a: 'नहीं। हमारी रिपोर्ट उपलब्ध रिकॉर्ड्स पर आधारित एक प्रोफेशनल राय है। टाइटल की गारंटी कोई नहीं दे सकता।' },
        { q: 'फील्ड वेरिफिकेशन कहाँ होती है?', a: 'फील्ड वेरिफिकेशन सिर्फ सेलेक्ट ज़िलों में उपलब्ध है। बुकिंग पर कन्फर्म होगा।' },
        { q: 'रिफंड कब मिलेगा?', a: 'अगर हम रिपोर्ट नहीं दे पाए तो फुल रिफंड। रिपोर्ट देने के बाद रिफंड नहीं। डिटेल रिफंड पॉलिसी में पढ़ें।' },
        { q: 'मेरी जानकारी सेफ है?', a: 'हाँ। हम आपकी जानकारी DPDP Act 2023 के अनुसार सुरक्षित रखते हैं। आप कभी भी डेटा डिलीट करवा सकते हैं।' },
        { q: 'क्या NRIs यूज़ कर सकते हैं?', a: 'हाँ, बिल्कुल। आप ऑनलाइन बुक कर सकते हैं, रिपोर्ट PDF में मिलेगी।' },
        { q: 'रिपोर्ट में गलत निकली तो?', a: 'हमें बताएं, हम दोबारा चेक करेंगे। अगर हमारी गलती है तो फ्री री-चेक होगा।' },
        { q: 'क्या एडवोकेट से बात हो सकती है?', a: 'Verified Report और Deal Support पैकेज में एडवोकेट रिव्यू शामिल है। आप अलग से भी एडवोकेट कंसल्टेशन बुक कर सकते हैं।' }
      ]
    },
    // Booking
    booking: {
      title: 'रिपोर्ट बुक करें',
      steps: ['पैकेज चुनें', 'प्रॉपर्टी डिटेल्स', 'दस्तावेज़ अपलोड', 'संपर्क जानकारी', 'पेमेंट'],
      package: 'पैकेज',
      district: 'ज़िला',
      tehsil: 'तहसील',
      village: 'गाँव',
      gata: 'गाटा/खसरा नंबर',
      area: 'रकबा (वर्ग मीटर)',
      ownerName: 'मालिक का नाम (अगर पता हो)',
      uploadDocs: 'दस्तावेज़ अपलोड करें (वैकल्पिक)',
      uploadNote: 'PDF या JPG, ज़्यादा से ज़्यादा 10 MB',
      name: 'आपका नाम',
      mobile: 'मोबाइल नंबर',
      email: 'ईमेल (वैकल्पिक)',
      whatsapp: 'WhatsApp पर अपडेट चाहते हैं',
      consent: 'मैं Privacy Policy से सहमत हूं और अपनी जानकारी देने की अनुमति देता/देती हूं',
      pay: 'पेमेंट करें',
      next: 'आगे',
      back: 'पीछे',
      thankYou: 'धन्यवाद! आपकी बुकिंग हो गई है',
      requestId: 'Request ID',
      delivery: 'अनुमानित डिलीवरी',
      whatsappBtn: 'WhatsApp पर बात करें'
    },
    // Track
    track: {
      title: 'रिपोर्ट स्टेटस देखें',
      requestId: 'Request ID',
      mobile: 'मोबाइल नंबर',
      check: 'स्टेटस देखें',
      statuses: ['Received', 'Verification में', 'फील्ड विज़िट हुआ', 'एडवोकेट रिव्यू', 'रिपोर्ट तैयार']
    },
    // Footer
    footer: {
      about: 'ZameenSaathi उत्तर प्रदेश में ज़मीन की जाँच करने वाली एक प्राइवेट कंसल्टेंसी है।',
      quickLinks: 'क्विक लिंक्स',
      contact: 'संपर्क',
      legal: 'कानूनी',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      refund: 'Refund Policy',
      disclaimer: 'Disclaimer',
      rights: '© 2024 ZameenSaathi. All rights reserved.'
    },
    // Guides
    guides: {
      khatauni: 'खतौनी कैसे निकालें',
      beforeBuying: 'ज़मीन खरीदने से पहले क्या करें',
      vairasat: 'विरासत प्रोसेस'
    },
    // Common
    common: {
      loading: 'लोड हो रहा है...',
      error: 'कुछ गड़बड़ हो गई। दोबारा कोशिश करें।',
      required: 'यह ज़रूरी है',
      invalidMobile: 'सही मोबाइल नंबर डालें',
      success: 'सफल!',
      officialSite: 'Official govt site, हमारी साइट नहीं'
    }
  },
  en: {
    nav: {
      services: 'Services',
      howItWorks: 'How it works',
      sampleReport: 'Sample Report',
      freeTools: 'Free Tools',
      forBrokers: 'For Brokers & Builders',
      faq: 'FAQ',
      bookReport: 'Book Report',
      track: 'Track Status'
    },
    hero: {
      headline: 'Get your land fully verified before making a deal',
      sub: 'Khatauni, map, court case and encumbrance check — in a simple report. For Uttar Pradesh.',
      cta1: 'Book Report',
      cta2: 'View Sample Report',
      formTitle: 'Start Free Risk Check',
      district: 'Select District',
      tehsil: 'Tehsil',
      gata: 'Gata/Khasra Number',
      mobile: 'Mobile Number',
      submit: 'Start Free Risk Check'
    },
    trust: ['Advocate-reviewed', 'Field verification available', 'Report in 24-48 hrs', 'Secure payment'],
    problem: {
      title: 'Mistakes that cost dearly',
      cards: [
        { title: 'Fake/Double Registry', desc: 'Same land sold to multiple people. Example: A plot in Lucknow was sold to three buyers, discovered later.' },
        { title: 'Government/Gram Sabha Land', desc: 'Selling government or gram sabha land is illegal. Example: Illegal occupation of gram sabha land in Kanpur.' },
        { title: 'Name/Area Mismatch in Documents', desc: 'Different names or areas in different documents. Example: Baiyanama says 500 sqm, khatauni says 300.' },
        { title: 'Hidden Court Case or Stay Order', desc: 'Court case or stay order on the land. Example: Stay order in inheritance case in Prayagraj, buyer was unaware.' }
      ]
    },
    howItWorks: {
      title: 'How it works',
      steps: [
        { title: 'Send Details', desc: 'District, tehsil, gata number and required documents' },
        { title: 'Choose Package & Pay', desc: 'Select package as per your need, pay online' },
        { title: 'Our Team Verifies', desc: 'Online records + field verification (as per package)' },
        { title: 'PDF Report + Call Explanation', desc: 'Easy-to-understand report, explained on call' }
      ]
    },
    packages: {
      title: 'Packages & Pricing',
      fieldNote: 'Field verification only in select districts. Availability confirmed on booking.',
      quickCheck: {
        name: 'Quick Check',
        price: '₹499',
        desc: 'Online basic check',
        delivery: 'Within 24 hrs',
        features: ['Khatauni owner/share check', 'Gata-rakba match', 'Basic red flags']
      },
      verified: {
        name: 'Verified Report',
        price: '₹1,999',
        badge: 'Most Popular',
        desc: 'Full check + field verification',
        delivery: '48-72 hrs',
        features: ['Everything in Quick Check', 'Naksha/boundary check', 'Court case search (RCCMS)', 'Bank charge/encumbrance pointers', 'Government/gram sabha category risk', 'On-ground field verification', 'Advocate review note']
      },
      dealSupport: {
        name: 'Deal Support',
        price: 'From ₹4,999',
        desc: 'Full deal support',
        delivery: 'Custom timeline',
        features: ['Everything in Verified Report', 'Baiyanama draft review', 'Registry & stamp guidance', 'Dakhil-kharij (mutation) follow-up', 'Dedicated coordinator'],
        cta: 'Get Quote'
      }
    },
    sampleReport: {
      title: 'Sample Report',
      desc: 'Preview of an anonymised report',
      download: 'Download Sample PDF',
      sections: {
        owner: 'Owner & Share',
        gata: 'Gata/Rakba',
        map: 'Map Summary',
        court: 'Court Cases',
        encumbrance: 'Encumbrance',
        riskScore: 'Risk Score',
        advocateNote: 'Advocate Note',
        nextSteps: 'Next Steps'
      },
      riskLevels: { low: 'Low', medium: 'Medium', high: 'High' }
    },
    freeTools: {
      title: 'Free Tools & Links',
      portals: 'Government Portals (Official govt site, not ours)',
      stampDuty: 'Stamp Duty Calculator',
      checklist: 'Document Checklist',
      calculator: {
        title: 'Stamp Duty & Registration Fee',
        propertyValue: 'Property Value (₹)',
        buyerType: 'Buyer Type',
        male: 'Male',
        female: 'Female',
        joint: 'Joint',
        areaType: 'Area Type',
        urban: 'Urban',
        rural: 'Rural',
        calculate: 'Calculate',
        result: 'Estimated Stamp Duty',
        regFee: 'Registration Fee',
        total: 'Total',
        note: 'Approximate. Check IGRSUP for latest rates.'
      },
      checklistTool: {
        title: 'Document Checklist',
        buy: 'For Buying',
        sell: 'For Selling',
        inherit: 'For Inheritance',
        print: 'Print'
      }
    },
    b2b: {
      title: 'For Brokers, Builders & Financiers',
      subtitle: 'Bulk verification for your deals',
      benefits: ['Volume pricing', 'Dedicated manager', 'Monthly invoice', 'White-label report option'],
      form: {
        company: 'Company Name',
        contact: 'Contact Person',
        mobile: 'Mobile',
        email: 'Email',
        volume: 'Monthly Volume',
        city: 'City',
        submit: 'Submit'
      }
    },
    whyUs: {
      title: 'Why trust us?',
      points: ['Advocate panel', 'Local field team', 'Clear scope in writing', 'Data privacy', 'Refund policy'],
      notDo: 'What we do NOT do',
      notDoPoints: [
        'We don\'t guarantee title',
        'We are not a government office',
        'Our report is an opinion based on available records'
      ]
    },
    testimonials: {
      title: 'What people say',
      note: '⚠️ REPLACE WITH REAL REVIEWS ONLY',
      placeholder: 'Real reviews coming soon'
    },
    faq: {
      title: 'Frequently Asked Questions',
      questions: [
        { q: 'Is this a government site?', a: 'No, ZameenSaathi is a private consultancy. We are not a government portal.' },
        { q: 'What documents are needed?', a: 'Gata/khasra number, district, tehsil. If you have khatauni or baiyanama, you can send those too.' },
        { q: 'How long does the report take?', a: 'Quick Check in 24 hrs, Verified Report in 48-72 hrs, Deal Support on custom timeline.' },
        { q: 'Do you guarantee title?', a: 'No. Our report is a professional opinion based on available records. No one can guarantee title.' },
        { q: 'Where is field verification available?', a: 'Field verification is available only in select districts. Confirmed on booking.' },
        { q: 'When will I get a refund?', a: 'Full refund if we cannot deliver the report. No refund after report delivery. See Refund Policy for details.' },
        { q: 'Is my information safe?', a: 'Yes. We keep your information secure as per DPDP Act 2023. You can request data deletion anytime.' },
        { q: 'Can NRIs use this?', a: 'Yes, absolutely. You can book online and receive the report as PDF.' },
        { q: 'What if the report is wrong?', a: 'Tell us, we will re-check. If it is our mistake, re-check is free.' },
        { q: 'Can I talk to an advocate?', a: 'Advocate review is included in Verified Report and Deal Support packages. You can also book separate advocate consultation.' }
      ]
    },
    booking: {
      title: 'Book Report',
      steps: ['Choose Package', 'Property Details', 'Upload Documents', 'Contact Info', 'Payment'],
      package: 'Package',
      district: 'District',
      tehsil: 'Tehsil',
      village: 'Village',
      gata: 'Gata/Khasra Number',
      area: 'Area (sq meters)',
      ownerName: 'Owner name (if known)',
      uploadDocs: 'Upload Documents (optional)',
      uploadNote: 'PDF or JPG, max 10 MB each',
      name: 'Your Name',
      mobile: 'Mobile Number',
      email: 'Email (optional)',
      whatsapp: 'Want updates on WhatsApp',
      consent: 'I agree to the Privacy Policy and consent to sharing my information',
      pay: 'Make Payment',
      next: 'Next',
      back: 'Back',
      thankYou: 'Thank you! Your booking is confirmed',
      requestId: 'Request ID',
      delivery: 'Expected Delivery',
      whatsappBtn: 'Chat on WhatsApp'
    },
    track: {
      title: 'Track Report Status',
      requestId: 'Request ID',
      mobile: 'Mobile Number',
      check: 'Check Status',
      statuses: ['Received', 'In Verification', 'Field Visit Done', 'Advocate Review', 'Report Ready']
    },
    footer: {
      about: 'ZameenSaathi is a private consultancy for land verification in Uttar Pradesh.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      refund: 'Refund Policy',
      disclaimer: 'Disclaimer',
      rights: '© 2024 ZameenSaathi. All rights reserved.'
    },
    guides: {
      khatauni: 'How to get Khatauni',
      beforeBuying: 'Before buying land',
      vairasat: 'Vairasat (Inheritance) Process'
    },
    common: {
      loading: 'Loading...',
      error: 'Something went wrong. Please try again.',
      required: 'This is required',
      invalidMobile: 'Enter valid mobile number',
      success: 'Success!',
      officialSite: 'Official govt site, not ours'
    }
  }
};

// ============================================================
// 75 UTTAR PRADESH DISTRICTS
// ============================================================
export const DISTRICTS = [
  'Agra', 'Aligarh', 'Prayagraj', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya',
  'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki',
  'Bareilly', 'Basti', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot',
  'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad',
  'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur',
  'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat',
  'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur',
  'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur',
  'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Rae Bareli', 'Rampur',
  'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti',
  'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
].sort();

// ============================================================
// PACKAGE CONFIG
// ============================================================
export const PACKAGES = [
  {
    id: 'quick-check',
    priceHi: '₹499',
    priceEn: '₹499',
    priceNum: 499,
    delivery: '24 hrs'
  },
  {
    id: 'verified-report',
    priceHi: '₹1,999',
    priceEn: '₹1,999',
    priceNum: 1999,
    delivery: '48-72 hrs',
    popular: true
  },
  {
    id: 'deal-support',
    priceHi: '₹4,999 से',
    priceEn: 'From ₹4,999',
    priceNum: 4999,
    delivery: 'Custom'
  }
];

// ============================================================
// STAMP DUTY RATES (UP - Approximate, for calculator)
// ============================================================
export const STAMP_DUTY_RATES = {
  // Rates as percentage of property value
  male: { urban: 7, rural: 6 },
  female: { urban: 6, rural: 5 },
  joint: { urban: 6.5, rural: 5.5 }
};

export const REGISTRATION_FEE_RATE = 1; // 1% of property value (approximate)

// ============================================================
// EXTERNAL PORTAL LINKS
// ============================================================
export const PORTALS = [
  {
    name: { hi: 'UP भूलेख', en: 'UP Bhulekh' },
    url: 'https://upbhulekh.gov.in',
    desc: { hi: 'खतौनी और खतौनी की कॉपी देखें', en: 'View khatauni and records' }
  },
  {
    name: { hi: 'भू-नक्शा UP', en: 'Bhu-Naksha UP' },
    url: 'https://upnmap.up.nic.in',
    desc: { hi: 'ज़मीन का नक्शा देखें', en: 'View land maps' }
  },
  {
    name: { hi: 'IGRSUP', en: 'IGRSUP' },
    url: 'https://igrsup.gov.in',
    desc: { hi: 'रजिस्ट्रेशन और स्टांप ड्यूटी', en: 'Registration & stamp duty' }
  },
  {
    name: { hi: 'RCCMS / वाद', en: 'RCCMS / Vaad' },
    url: 'https://rccms.up.nic.in',
    desc: { hi: 'कोर्ट केस की जानकारी', en: 'Court case information' }
  },
  {
    name: { hi: 'निवेश मित्र', en: 'Nivesh Mitra' },
    url: 'https://niveshmitra.up.nic.in',
    desc: { hi: 'बизнес और निवेश संबंधी जानकारी', en: 'Business & investment info' }
  }
];

// ============================================================
// DOCUMENT CHECKLISTS
// ============================================================
export const CHECKLISTS = {
  buy: {
    hi: [
      'खतौनी की नकल',
      'नक्शा / भू-नक्शा',
      'पिछली रजिस्ट्री / बयानामा',
      'दाखिल-खारिज की नकल',
      'कोर्ट केस की जानकारी (RCCMS)',
      'एनकम्ब्रेंस सर्टिफिकेट',
      'आधार कार्ड (मालिक का)',
      'पासपोर्ट साइज़ फोटो',
      'NOC (अगर लागू हो)',
      'टैक्स रसीद'
    ],
    en: [
      'Khatauni copy',
      'Map / Bhu-Naksha',
      'Previous registry / baiyanama',
      'Dakhil-kharij copy (mutation)',
      'Court case info (RCCMS)',
      'Encumbrance certificate',
      'Aadhaar of owner',
      'Passport size photo',
      'NOC (if applicable)',
      'Tax receipt'
    ]
  },
  sell: {
    hi: [
      'खतौनी',
      'रजिस्ट्री / बयानामा (जिससे आपने खरीदा)',
      'दाखिल-खारिज',
      'नक्शा',
      'आधार कार्ड',
      'PAN कार्ड',
      'टैक्स रसीद',
      'NOC (अगर लागू हो)',
      'पासपोर्ट साइज़ फोटो',
      'बैंक NOC (अगर लोन था)'
    ],
    en: [
      'Khatauni',
      'Registry / baiyanama (by which you bought)',
      'Dakhil-kharij',
      'Map',
      'Aadhaar',
      'PAN card',
      'Tax receipt',
      'NOC (if applicable)',
      'Passport size photo',
      'Bank NOC (if there was a loan)'
    ]
  },
  inherit: {
    hi: [
      'मृत्यु प्रमाण पत्र',
      'विरासत प्रमाण पत्र / वारिसाना',
      'खतौनी (मृतक के नाम)',
      'दाखिल-खारिज के लिए आवेदन',
      'सभी वारिसों का आधार',
      'सभी वारिसों का PAN',
      'अगर वसीयत है तो वसीयत',
      'कोर्ट ऑर्डर (अगर कोई केस हो)',
      'NOC अन्य वारिसों से',
      'पासपोर्ट साइज़ फोटो'
    ],
    en: [
      'Death certificate',
      'Succession certificate / varisan',
      'Khatauni (in deceased name)',
      'Application for dakhil-kharij',
      'Aadhaar of all heirs',
      'PAN of all heirs',
      'Will (if exists)',
      'Court order (if any case)',
      'NOC from other heirs',
      'Passport size photo'
    ]
  }
};

// ============================================================
// TOOLTIPS FOR LEGAL TERMS
// ============================================================
export const LEGAL_TERMS: Record<string, { hi: string; en: string }> = {
  khatauni: { hi: 'खतौनी — ज़मीन के मालिक और हिस्से की सरकारी रिकॉर्ड', en: 'Khatauni — Government record of land ownership and shares' },
  gata: { hi: 'गाटा/खसरा — ज़मीन का यूनिक नंबर', en: 'Gata/Khasra — Unique number of a land parcel' },
  baiyanama: { hi: 'बयानामा — बिक्री का ड्राफ्ट दस्तावेज़', en: 'Baiyanama — Draft sale document' },
  vairasat: { hi: 'विरासत — मृत व्यक्ति की संपत्ति वारिसों में बांटना', en: 'Vairasat — Transfer of deceased person\'s property to heirs' },
  'dakhil-kharij': { hi: 'दाखिल-खारिज — रिकॉर्ड में मालिक का नाम बदलना (म्यूटेशन)', en: 'Dakhil-kharij — Mutation, changing owner name in records' },
  naksha: { hi: 'नक्शा — ज़मीन का मैप', en: 'Naksha — Map of the land' },
  rccms: { hi: 'RCCMS — राजस्व कोर्ट केस मैनेजमेंट सिस्टम', en: 'RCCMS — Revenue Court Case Management System' }
};
