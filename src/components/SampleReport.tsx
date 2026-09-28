import { t, type Lang } from '../config';
import { Download, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface SampleReportProps {
  lang: Lang;
}

export default function SampleReport({ lang }: SampleReportProps) {
  const tr = t[lang];

  return (
    <section id="sample-report" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate mb-4">
          {tr.sampleReport.title}
        </h2>
        <p className="text-center text-slate-light mb-12">{tr.sampleReport.desc}</p>

        {/* Sample Report Preview (HTML mock) */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Report Header */}
          <div className="gradient-primary p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">ZameenSaathi Property Report</h3>
                <p className="text-sm opacity-80">Request #ZS-2024-XXXX</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">{lang === 'hi' ? 'दिनांक' : 'Date'}: 15-Jan-2024</p>
                <p className="text-sm opacity-80">{lang === 'hi' ? 'पैकेज' : 'Package'}: Verified Report</p>
              </div>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-6 space-y-6">
            {/* Risk Score */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-bg border border-gray-100">
              <span className="font-bold text-slate">{tr.sampleReport.sections.riskScore}</span>
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700">
                {tr.sampleReport.riskLevels.medium}
              </span>
            </div>

            {/* Owner & Share */}
            <div className="border border-gray-100 rounded-xl p-4">
              <h4 className="font-bold text-slate mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                {tr.sampleReport.sections.owner}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-light">{lang === 'hi' ? 'मालिक' : 'Owner'}:</span>
                  <span className="ml-2 font-medium">श्री राम प्रसाद *****</span>
                </div>
                <div>
                  <span className="text-slate-light">{lang === 'hi' ? 'हिस्सा' : 'Share'}:</span>
                  <span className="ml-2 font-medium">100%</span>
                </div>
                <div>
                  <span className="text-slate-light">{lang === 'hi' ? 'प्रकार' : 'Type'}:</span>
                  <span className="ml-2 font-medium">{lang === 'hi' ? 'आबादी' : 'Abadi'}</span>
                </div>
                <div>
                  <span className="text-slate-light">{lang === 'hi' ? 'स्थिति' : 'Status'}:</span>
                  <span className="ml-2 font-medium text-primary">{lang === 'hi' ? 'सही' : 'Clear'}</span>
                </div>
              </div>
            </div>

            {/* Gata/Rakba */}
            <div className="border border-gray-100 rounded-xl p-4">
              <h4 className="font-bold text-slate mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                {tr.sampleReport.sections.gata}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-light">{lang === 'hi' ? 'गाटा' : 'Gata'}:</span>
                  <span className="ml-2 font-medium">1234/5</span>
                </div>
                <div>
                  <span className="text-slate-light">{lang === 'hi' ? 'रकबा' : 'Rakba'}:</span>
                  <span className="ml-2 font-medium">500 वर्ग मीटर</span>
                </div>
                <div>
                  <span className="text-slate-light">{lang === 'hi' ? 'मैच' : 'Match'}:</span>
                  <span className="ml-2 font-medium text-primary">✓ {lang === 'hi' ? 'सही' : 'Matched'}</span>
                </div>
              </div>
            </div>

            {/* Court Cases */}
            <div className="border border-gray-100 rounded-xl p-4">
              <h4 className="font-bold text-slate mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-yellow-500" />
                {tr.sampleReport.sections.court}
              </h4>
              <div className="text-sm">
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <Info size={14} className="text-yellow-600" />
                  <span className="text-yellow-700">
                    {lang === 'hi' ? '1 संभावित मैच मिला - RCCMS पर आगे जाँच करें' : '1 potential match found - Verify further on RCCMS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Encumbrance */}
            <div className="border border-gray-100 rounded-xl p-4">
              <h4 className="font-bold text-slate mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                {tr.sampleReport.sections.encumbrance}
              </h4>
              <p className="text-sm text-slate-light">
                {lang === 'hi' ? 'कोई बैंक लोन या चार्ज नहीं मिला। (पिछले 12 वर्ष)' : 'No bank loan or charge found. (Last 12 years)'}
              </p>
            </div>

            {/* Advocate Note */}
            <div className="border border-gray-100 rounded-xl p-4 bg-green-50">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                ⚖️ {tr.sampleReport.sections.advocateNote}
              </h4>
              <p className="text-sm text-slate-light leading-relaxed">
                {lang === 'hi'
                  ? 'ज़मीन के मालिक की जानकारी खतौनी से मैच करती है। RCCMS में एक संभावित मैच है जिसे आगे वेरिफाई करना चाहिए। फील्ड चेक में प्लॉट खाली मिला, कोई विवाद नहीं। सलाह: RCCMS का रिजल्ट कन्फर्म करें, उसके बाद डील आगे बढ़ाएं।'
                  : 'Owner details match khatauni. One potential match in RCCMS needs further verification. Field check shows plot is vacant, no dispute visible. Advice: Confirm RCCMS result before proceeding with deal.'}
              </p>
            </div>

            {/* Next Steps */}
            <div className="border border-gray-100 rounded-xl p-4">
              <h4 className="font-bold text-slate mb-3">{tr.sampleReport.sections.nextSteps}</h4>
              <ol className="text-sm text-slate-light space-y-2 list-decimal list-inside">
                {lang === 'hi' ? (
                  <>
                    <li>RCCMS पर केस की पुष्टि करें</li>
                    <li>मालिक से बात करके केस के बारे में पूछें</li>
                    <li>एनकम्ब्रेंस सर्टिफिकेट लगवाएं</li>
                    <li>बयानामा तैयार करने से पहले एडवोकेट से सलाह लें</li>
                  </>
                ) : (
                  <>
                    <li>Verify case on RCCMS</li>
                    <li>Ask owner about the case</li>
                    <li>Get encumbrance certificate</li>
                    <li>Consult advocate before preparing baiyanama</li>
                  </>
                )}
              </ol>
            </div>
          </div>

          {/* Report Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-slate-light">
              {lang === 'hi'
                ? 'यह रिपोर्ट उपलब्ध रिकॉर्ड्स पर आधारित एक प्रोफेशनल राय है, टाइटल की गारंटी नहीं।'
                : 'This report is a professional opinion based on available records, not a title guarantee.'}
            </p>
          </div>
        </div>

        {/* Download button */}
        <div className="text-center mt-8">
          <button
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors"
            onClick={() => alert(lang === 'hi' ? 'सैंपल PDF जल्द उपलब्ध होगा' : 'Sample PDF coming soon')}
          >
            <Download size={18} />
            {tr.sampleReport.download}
          </button>
        </div>
      </div>
    </section>
  );
}
