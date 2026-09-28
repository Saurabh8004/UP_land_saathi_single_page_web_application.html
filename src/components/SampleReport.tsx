import { motion } from 'framer-motion';
import { t, type Lang } from '../config';
import { Download, AlertCircle, CheckCircle, Info, Shield } from 'lucide-react';
import { useInView, useReducedMotion, staggerContainer, staggerItem } from '../hooks/useAnimations';

interface SampleReportProps {
  lang: Lang;
}

export default function SampleReport({ lang }: SampleReportProps) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();

  return (
    <section id="sample-report" className="py-20 md:py-28 relative">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-semibold mb-4">
            {lang === 'hi' ? '📄 प्रीव्यू' : '📄 PREVIEW'}
          </span>
          <h2 className="section-title text-text mb-3">{tr.sampleReport.title}</h2>
          <p className="text-muted">{tr.sampleReport.desc}</p>
        </motion.div>

        {/* Sample Report Preview */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 40, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        >
          {/* Report Header */}
          <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">ZameenSaathi Property Report</h3>
                <p className="text-sm opacity-70 mt-0.5">Request #ZS-2024-XXXX</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-70">{lang === 'hi' ? 'दिनांक' : 'Date'}: 15-Jan-2024</p>
                <p className="text-sm opacity-70">{lang === 'hi' ? 'पैकेज' : 'Package'}: Verified Report</p>
              </div>
            </div>
          </div>

          {/* Report Body */}
          <motion.div
            variants={staggerContainer}
            initial={reducedMotion ? {} : "hidden"}
            animate={isInView ? "visible" : "hidden"}
            className="p-6 space-y-5"
          >
            {/* Risk Score */}
            <motion.div variants={staggerItem} className="flex items-center justify-between p-4 rounded-xl bg-bg border border-border">
              <span className="font-bold text-text flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                {tr.sampleReport.sections.riskScore}
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                {tr.sampleReport.riskLevels.medium}
              </span>
            </motion.div>

            {/* Owner & Share */}
            <motion.div variants={staggerItem} className="border border-border rounded-xl p-4 hover:border-primary/20 transition-colors">
              <h4 className="font-bold text-text mb-3 flex items-center gap-2">
                <CheckCircle size={15} className="text-success" />
                {tr.sampleReport.sections.owner}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted">{lang === 'hi' ? 'मालिक' : 'Owner'}:</span><span className="ml-2 font-medium">श्री राम प्रसाद *****</span></div>
                <div><span className="text-muted">{lang === 'hi' ? 'हिस्सा' : 'Share'}:</span><span className="ml-2 font-medium">100%</span></div>
                <div><span className="text-muted">{lang === 'hi' ? 'प्रकार' : 'Type'}:</span><span className="ml-2 font-medium">{lang === 'hi' ? 'आबादी' : 'Abadi'}</span></div>
                <div><span className="text-muted">{lang === 'hi' ? 'स्थिति' : 'Status'}:</span><span className="ml-2 font-medium text-success">✓ {lang === 'hi' ? 'सही' : 'Clear'}</span></div>
              </div>
            </motion.div>

            {/* Gata/Rakba */}
            <motion.div variants={staggerItem} className="border border-border rounded-xl p-4 hover:border-primary/20 transition-colors">
              <h4 className="font-bold text-text mb-3 flex items-center gap-2">
                <CheckCircle size={15} className="text-success" />
                {tr.sampleReport.sections.gata}
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted">{lang === 'hi' ? 'गाटा' : 'Gata'}:</span><span className="ml-2 font-medium">1234/5</span></div>
                <div><span className="text-muted">{lang === 'hi' ? 'रकबा' : 'Rakba'}:</span><span className="ml-2 font-medium">500 वर्ग मीटर</span></div>
                <div><span className="text-muted">{lang === 'hi' ? 'मैच' : 'Match'}:</span><span className="ml-2 font-medium text-success">✓ {lang === 'hi' ? 'सही' : 'Matched'}</span></div>
              </div>
            </motion.div>

            {/* Court Cases */}
            <motion.div variants={staggerItem} className="border border-border rounded-xl p-4 hover:border-warning/20 transition-colors">
              <h4 className="font-bold text-text mb-3 flex items-center gap-2">
                <AlertCircle size={15} className="text-warning" />
                {tr.sampleReport.sections.court}
              </h4>
              <div className="flex items-center gap-2 p-3 bg-warning/5 rounded-lg border border-warning/10">
                <Info size={14} className="text-warning flex-shrink-0" />
                <span className="text-sm text-warning">
                  {lang === 'hi' ? '1 संभावित मैच मिला - RCCMS पर आगे जाँच करें' : '1 potential match found - Verify further on RCCMS'}
                </span>
              </div>
            </motion.div>

            {/* Advocate Note */}
            <motion.div variants={staggerItem} className="border border-success/20 rounded-xl p-4 bg-success/3">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                ⚖️ {tr.sampleReport.sections.advocateNote}
              </h4>
              <p className="text-sm text-muted leading-relaxed">
                {lang === 'hi'
                  ? 'ज़मीन के मालिक की जानकारी खतौनी से मैच करती है। RCCMS में एक संभावित मैच है जिसे आगे वेरिफाई करना चाहिए। फील्ड चेक में प्लॉट खाली मिला, कोई विवाद नहीं।'
                  : 'Owner details match khatauni. One potential match in RCCMS needs further verification. Field check shows plot is vacant, no dispute visible.'}
              </p>
            </motion.div>
          </motion.div>

          {/* Report Footer */}
          <div className="p-4 bg-bg border-t border-border text-center">
            <p className="text-xs text-muted">
              {lang === 'hi'
                ? 'यह रिपोर्ट उपलब्ध रिकॉर्ड्स पर आधारित एक प्रोफेशनल राय है, टाइटल की गारंटी नहीं।'
                : 'This report is a professional opinion based on available records, not a title guarantee.'}
            </p>
          </div>
        </motion.div>

        {/* Download button */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={reducedMotion ? {} : { scale: 1.03 }}
            whileTap={reducedMotion ? {} : { scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all shadow-lg shadow-primary/15"
            onClick={() => alert(lang === 'hi' ? 'सैंपल PDF जल्द उपलब्ध होगा' : 'Sample PDF coming soon')}
          >
            <Download size={18} />
            {tr.sampleReport.download}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
