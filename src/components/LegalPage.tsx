import { BRAND, t, type Lang } from '../config';
import { Link } from 'react-router-dom';

interface LegalPageProps {
  lang: Lang;
  type: 'privacy' | 'terms' | 'refund' | 'disclaimer';
}

export default function LegalPage({ lang, type }: LegalPageProps) {
  const tr = t[lang];

  const content: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
    privacy: {
      title: lang === 'hi' ? 'Privacy Policy' : 'Privacy Policy',
      sections: [
        {
          heading: lang === 'hi' ? 'परिचय' : 'Introduction',
          body: lang === 'hi'
            ? 'ZameenSaathi ("हम", "हमारा") आपकी प्राइवेसी का सम्मान करता है। यह पॉलिसी बताती है कि हम आपकी जानकारी कैसे इकट्ठा करते हैं, इस्तेमाल करते हैं और सुरक्षित रखते हैं।'
            : 'ZameenSaathi ("we", "our") respects your privacy. This policy explains how we collect, use, and protect your information.'
        },
        {
          heading: lang === 'hi' ? 'कौन सी जानकारी इकट्ठा करते हैं' : 'What information we collect',
          body: lang === 'hi'
            ? 'नाम, मोबाइल नंबर, ईमेल, प्रॉपर्टी डिटेल्स (ज़िला, तहसील, गाटा नंबर), अपलोड किए गए दस्तावेज़। हम Aadhaar नंबर नहीं मांगते और नहीं स्टोर करते।'
            : 'Name, mobile number, email, property details (district, tehsil, gata number), uploaded documents. We do NOT ask for or store Aadhaar numbers.'
        },
        {
          heading: lang === 'hi' ? 'क्यों इकट्ठा करते हैं' : 'Why we collect',
          body: lang === 'hi'
            ? 'आपकी रिपोर्ट तैयार करने, वेरिफिकेशन प्रोसेस, WhatsApp/email अपडेट, और सर्विस इम्प्रूव करने के लिए।'
            : 'To prepare your report, verification process, WhatsApp/email updates, and to improve our service.'
        },
        {
          heading: lang === 'hi' ? 'डेटा कितने दिन रखते हैं' : 'Data retention',
          body: lang === 'hi'
            ? 'रिपोर्ट डिलीवरी के बाद 1 साल। आप कभी भी डेटा डिलीशन रिक्वेस्ट कर सकते हैं।'
            : '1 year after report delivery. You can request data deletion at any time.'
        },
        {
          heading: lang === 'hi' ? 'आपके अधिकार (DPDP Act 2023)' : 'Your rights (DPDP Act 2023)',
          body: lang === 'hi'
            ? 'आप अपनी जानकारी देख सकते हैं, करेक्ट करवा सकते हैं, डिलीट करवा सकते हैं, और शिकायत कर सकते हैं। संपर्क: ' + BRAND.email
            : 'You can view, correct, delete your information, and file a grievance. Contact: ' + BRAND.email
        },
        {
          heading: lang === 'hi' ? 'शिकायत निवारण' : 'Grievance',
          body: lang === 'hi'
            ? 'कोई शिकायत हो तो ' + BRAND.email + ' पर संपर्क करें। 30 दिन में जवाब देंगे।'
            : 'For any grievance, contact ' + BRAND.email + '. We will respond within 30 days.'
        }
      ]
    },
    terms: {
      title: lang === 'hi' ? 'Terms of Service' : 'Terms of Service',
      sections: [
        {
          heading: lang === 'hi' ? 'सेवा का विवरण' : 'Service Description',
          body: lang === 'hi'
            ? 'ZameenSaathi ज़मीन की वेरिफिकेशन सर्विस प्रदान करता है। हम उपलब्ध रिकॉर्ड्स और दस्तावेज़ों के आधार पर रिपोर्ट तैयार करते हैं।'
            : 'ZameenSaathi provides land verification services. We prepare reports based on available records and documents.'
        },
        {
          heading: lang === 'hi' ? 'ज़िम्मेदारी' : 'Liability',
          body: lang === 'hi'
            ? 'हमारी रिपोर्ट एक प्रोफेशनल राय है, टाइटल की गारंटी नहीं। किसी भी डील का फाइनल फैसला आपकी अपनी ज़िम्मेदारी है।'
            : 'Our report is a professional opinion, not a title guarantee. Final decision on any deal is your own responsibility.'
        },
        {
          heading: lang === 'hi' ? 'पेमेंट' : 'Payment',
          body: lang === 'hi'
            ? 'पेमेंट Razorpay के ज़रिए होती है। सभी कीमतें GST सहित हैं (अगर लागू हो)।'
            : 'Payment is via Razorpay. All prices include GST (if applicable).'
        },
        {
          heading: lang === 'hi' ? 'नोट: यह डॉक्यूमेंट लॉयर से रिव्यू करवाएं' : 'NOTE: Get this document reviewed by a lawyer',
          body: lang === 'hi'
            ? '⚠️ यह Terms of Service एक प्लेसहोल्डर है। लॉन्च से पहले किसी वकील से रिव्यू करवाएं।'
            : '⚠️ This Terms of Service is a placeholder. Get it reviewed by a lawyer before launch.'
        }
      ]
    },
    refund: {
      title: lang === 'hi' ? 'Refund Policy' : 'Refund Policy',
      sections: [
        {
          heading: lang === 'hi' ? 'रिफंड कब मिलेगा' : 'When you get a refund',
          body: lang === 'hi'
            ? 'अगर हम रिपोर्ट डिलीवर नहीं कर पाए (तकनीकी कारण, रिकॉर्ड उपलब्ध नहीं) तो फुल रिफंड 5-7 वर्किंग डेज़ में।'
            : 'If we cannot deliver the report (technical reasons, records unavailable), full refund within 5-7 working days.'
        },
        {
          heading: lang === 'hi' ? 'रिफंड कब नहीं मिलेगा' : 'When no refund',
          body: lang === 'hi'
            ? 'रिपोर्ट डिलीवर होने के बाद। अगर गलत जानकारी आपने दी हो। अगर रिपोर्ट में कोई red flag मिले (यह सर्विस का हिस्सा है)।'
            : 'After report delivery. If you provided incorrect information. If report shows red flags (this is part of the service).'
        },
        {
          heading: lang === 'hi' ? 'प्रोसेस' : 'Process',
          body: lang === 'hi'
            ? 'रिफंड रिक्वेस्ट WhatsApp या email पर भेजें। 48 घंटे में जवाब देंगे।'
            : 'Send refund request via WhatsApp or email. We will respond within 48 hours.'
        }
      ]
    },
    disclaimer: {
      title: lang === 'hi' ? 'Disclaimer' : 'Disclaimer',
      sections: [
        {
          heading: lang === 'hi' ? 'प्राइवेट कंसल्टेंसी' : 'Private Consultancy',
          body: lang === 'hi'
            ? 'ZameenSaathi एक प्राइवेट कंसल्टेंसी है। हम किसी सरकारी विभाग या पोर्टल से जुड़े नहीं हैं।'
            : 'ZameenSaathi is a private consultancy. We are not affiliated with any government department or portal.'
        },
        {
          heading: lang === 'hi' ? 'रिपोर्ट की सीमा' : 'Report Limitations',
          body: lang === 'hi'
            ? 'हमारी रिपोर्ट उपलब्ध रिकॉर्ड्स पर आधारित है। अगर कोई रिकॉर्ड ऑनलाइन उपलब्ध नहीं है या दफ्तर से नहीं मिला, तो रिपोर्ट में यह बताया जाएगा।'
            : 'Our report is based on available records. If any record is not available online or from offices, this will be mentioned in the report.'
        },
        {
          heading: lang === 'hi' ? 'कानूनी सलाह नहीं' : 'Not Legal Advice',
          body: lang === 'hi'
            ? 'हमारी रिपोर्ट कानूनी सलाह नहीं है। "एडवोकेट रिव्यू" सिर्फ तब होता है जब एक एनरोल्ड एडवोकेट शामिल हो।'
            : 'Our report is not legal advice. "Advocate Review" is only when an enrolled advocate is involved.'
        },
        {
          heading: lang === 'hi' ? 'टाइटल गारंटी नहीं' : 'No Title Guarantee',
          body: lang === 'hi'
            ? 'हम ज़मीन के टाइटल की गारंटी नहीं देते। खरीदने से पहले अपना due diligence करें।'
            : 'We do not guarantee land title. Do your own due diligence before purchasing.'
        }
      ]
    }
  };

  const page = content[type];

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate mb-8">{page.title}</h1>
        
        <div className="space-y-8">
          {page.sections.map((section, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="font-bold text-slate mb-3">{section.heading}</h2>
              <p className="text-sm text-slate-light leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Last updated */}
        <p className="text-xs text-slate-light mt-8 text-center">
          {lang === 'hi' ? 'आखिरी अपडेट: जनवरी 2024' : 'Last updated: January 2024'}
        </p>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-primary font-medium hover:underline">
            ← {lang === 'hi' ? 'होम पेज पर वापस' : 'Back to home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
