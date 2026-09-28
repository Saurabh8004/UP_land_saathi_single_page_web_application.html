import { t, type Lang } from '../config';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';

interface GuidesProps {
  lang: Lang;
  slug?: string;
}

export default function GuidePage({ lang, slug }: GuidesProps) {
  const tr = t[lang];

  // Guide content based on slug
  const guides: Record<string, { title: string; content: string[] }> = {
    'khatauni-kaise-nikale': {
      title: lang === 'hi' ? 'खतौनी कैसे निकालें - पूरी गाइड' : 'How to Get Khatauni - Complete Guide',
      content: lang === 'hi' ? [
        'खतौनी ज़मीन की मालिकी का सबसे ज़रूरी दस्तावेज़ है।',
        'आप ऑनलाइन UP Bhulekh (upbhulekh.gov.in) से खतौनी देख सकते हैं।',
        'ज़िला, तहसील, गाँव और गाटा नंबर डालकर सर्च करें।',
        'अगर ऑनलाइन न मिले तो लेखपाल या तहसील दफ्तर से संपर्क करें।',
        'खतौनी में मालिक का नाम, हिस्सा, रकबा और ज़मीन का प्रकार लिखा होता है।',
        'खतौनी की सही कॉपी के लिए IGRSUP से भी वेरिफाई करें।'
      ] : [
        'Khatauni is the most important document for land ownership.',
        'You can view khatauni online at UP Bhulekh (upbhulekh.gov.in).',
        'Search by district, tehsil, village and gata number.',
        'If not available online, contact the lekhpal or tehsil office.',
        'Khatauni contains owner name, share, area and land type.',
        'Verify the correct copy through IGRSUP as well.'
      ]
    },
    'zameen-kharidne-se-pehle': {
      title: lang === 'hi' ? 'ज़मीन खरीदने से पहले क्या करें' : 'What to Do Before Buying Land',
      content: lang === 'hi' ? [
        'खतौनी चेक करें - मालिक का नाम और हिस्सा सही है या नहीं।',
        'नक्शा देखें - बाउंड्री और रकबा मैच करता है या नहीं।',
        'RCCMS पर कोर्ट केस सर्च करें।',
        'एनकम्ब्रेंस सर्टिफिकेट लगवाएं (पिछले 12-30 साल)।',
        'ज़मीन सरकारी/ग्राम सभा की तो नहीं।',
        'फील्ड विज़िट करें - ज़मीन की असली स्थिति देखें।',
        'पड़ोसियों से पूछें - कोई विवाद तो नहीं।',
        'एडवोकेट से दस्तावेज़ रिव्यू करवाएं।'
      ] : [
        'Check khatauni - verify owner name and share.',
        'View map - match boundary and area.',
        'Search court cases on RCCMS.',
        'Get encumbrance certificate (last 12-30 years).',
        'Check if land is government/gram sabha property.',
        'Visit the field - see actual condition.',
        'Ask neighbors - any disputes?',
        'Get documents reviewed by an advocate.'
      ]
    },
    'vairasat-process': {
      title: lang === 'hi' ? 'विरासत प्रोसेस - पूरी जानकारी' : 'Vairasat (Inheritance) Process - Complete Info',
      content: lang === 'hi' ? [
        'विरासत का मतलब है मृत व्यक्ति की संपत्ति वारिसों में ट्रांसफर करना।',
        'सबसे पहले मृत्यु प्रमाण पत्र लगवाएं।',
        'विरासत प्रमाण पत्र या वारिसाना बनवाएं।',
        'दाखिल-खारिज (म्यूटेशन) के लिए तहसील में आवेदन दें।',
        'सभी वारिसों की सहमति ज़रूरी है (NOC)।',
        'अगर वसीयत है तो probate करवाएं।',
        'कोर्ट केस हो तो पहले केस खत्म होने दें।',
        'पूरा प्रोसेस 2-4 महीने लग सकते हैं।'
      ] : [
        'Vairasat means transferring deceased person\'s property to heirs.',
        'First get the death certificate.',
        'Get succession certificate or varisan.',
        'Apply for dakhil-kharij (mutation) at tehsil.',
        'Consent of all heirs is required (NOC).',
        'If there is a will, get probate.',
        'If there is a court case, let it resolve first.',
        'The entire process can take 2-4 months.'
      ]
    }
  };

  // If no slug, show guide listing
  if (!slug || !guides[slug]) {
    return (
      <div className="min-h-screen bg-bg py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-slate mb-8 flex items-center gap-3">
            <BookOpen size={28} className="text-primary" />
            {lang === 'hi' ? 'गाइड्स' : 'Guides'}
          </h1>
          <div className="space-y-4">
            {Object.entries(guides).map(([key, guide]) => (
              <Link
                key={key}
                to={`/guides/${key}`}
                className="block p-5 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate">{guide.title}</h2>
                  <ChevronRight size={18} className="text-primary" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/" className="text-primary font-medium hover:underline">
              ← {lang === 'hi' ? 'होम पेज पर वापस' : 'Back to home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const guide = guides[slug];

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <article>
          <h1 className="text-2xl md:text-3xl font-bold text-slate mb-8">{guide.title}</h1>
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="prose prose-sm max-w-none">
              {guide.content.map((para, i) => (
                <p key={i} className="text-slate-light leading-relaxed mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-8 bg-primary/5 rounded-xl p-6 text-center border border-primary/10">
          <p className="font-bold text-slate mb-2">
            {lang === 'hi' ? 'ज़मीन खरीद रहे हैं? जाँच कराएँ।' : 'Buying land? Get it verified.'}
          </p>
          <Link
            to="/book"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors"
          >
            {tr.nav.bookReport}
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link to="/guides" className="text-primary font-medium hover:underline">
            ← {lang === 'hi' ? 'सभी गाइड्स' : 'All Guides'}
          </Link>
        </div>
      </div>
    </div>
  );
}
