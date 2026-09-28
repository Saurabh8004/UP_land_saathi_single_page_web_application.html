import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { t, type Lang } from '../config';
import { Check, ArrowRight, Zap, Shield, HeadphonesIcon } from 'lucide-react';
import { useInView, useReducedMotion, staggerContainer, staggerItem } from '../hooks/useAnimations';

interface PackagesProps {
  lang: Lang;
}

export default function Packages({ lang }: PackagesProps) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();
  const pkgs = [
    { ...tr.packages.quickCheck, badge: '', cta: '', icon: Zap },
    { ...tr.packages.verified, badge: tr.packages.verified.badge, cta: '', icon: Shield },
    { ...tr.packages.dealSupport, badge: '', cta: tr.packages.dealSupport.cta, icon: HeadphonesIcon }
  ];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/2 rounded-full blur-3xl pointer-events-none" />
      
      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
            {lang === 'hi' ? '💰 पैकेज' : '💰 PACKAGES'}
          </span>
          <h2 className="section-title text-text">
            {tr.packages.title}
          </h2>
        </motion.div>

        {/* Package cards */}
        <motion.div
          variants={staggerContainer}
          initial={reducedMotion ? {} : "hidden"}
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {pkgs.map((pkg, i) => {
            const isPopular = i === 1;
            const isLast = i === 2;
            const PkgIcon = pkg.icon;
            
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
                className={`relative rounded-2xl p-6 md:p-8 transition-all ${
                  isPopular
                    ? 'bg-primary text-white shadow-2xl shadow-primary/20 border-2 border-primary scale-[1.02]'
                    : 'bg-card border border-border hover:border-primary/20 hover:shadow-xl'
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent text-text text-xs font-bold rounded-full shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  isPopular ? 'bg-white/10' : 'bg-primary/5'
                }`}>
                  <PkgIcon size={22} className={isPopular ? 'text-white' : 'text-primary'} />
                </div>

                {/* Package name */}
                <h3 className={`text-xl font-bold mb-1 ${isPopular ? 'text-white' : 'text-text'}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm mb-4 ${isPopular ? 'text-white/70' : 'text-muted'}`}>
                  {pkg.desc}
                </p>

                {/* Price */}
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${isPopular ? 'text-white' : 'text-primary'}`}>
                    {pkg.price}
                  </span>
                </div>

                {/* Delivery */}
                <p className={`text-sm mb-6 flex items-center gap-1.5 ${isPopular ? 'text-white/70' : 'text-muted'}`}>
                  ⏱ {pkg.delivery}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isPopular ? 'bg-white/15' : 'bg-primary/5'
                      }`}>
                        <Check size={11} className={isPopular ? 'text-white' : 'text-primary'} />
                      </div>
                      <span className={isPopular ? 'text-white/90' : 'text-muted'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isLast ? (
                  <a
                    href="#b2b"
                    className={`block w-full text-center px-6 py-3.5 rounded-xl font-semibold transition-all ${
                      isPopular
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                        : 'border-2 border-primary text-primary hover:bg-primary/5'
                    }`}
                  >
                    {pkg.cta}
                  </a>
                ) : (
                  <Link
                    to={`/book?package=${isPopular ? 'verified-report' : 'quick-check'}`}
                    className={`block w-full text-center px-6 py-3.5 rounded-xl font-semibold transition-all ${
                      isPopular
                        ? 'bg-white text-primary hover:bg-white/90 shadow-lg'
                        : 'bg-primary text-white hover:bg-primary-light shadow-md shadow-primary/15'
                    }`}
                  >
                    {tr.nav.bookReport}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Field verification note */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <p className="inline-block text-sm text-text/70 bg-accent/5 rounded-xl px-5 py-3 border border-accent/10">
            ⚠️ {tr.packages.fieldNote}
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-14 overflow-x-auto rounded-2xl border border-border"
        >
          <table className="w-full text-sm border-collapse bg-card">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="text-left py-4 px-5 font-semibold text-text">{lang === 'hi' ? 'फीचर' : 'Feature'}</th>
                <th className="text-center py-4 px-5 font-semibold text-text">Quick Check</th>
                <th className="text-center py-4 px-5 font-semibold text-primary bg-primary/3">Verified Report</th>
                <th className="text-center py-4 px-5 font-semibold text-text">Deal Support</th>
              </tr>
            </thead>
            <tbody>
              {[
                { hi: 'खतौनी चेक', en: 'Khatauni check', qc: true, vr: true, ds: true },
                { hi: 'गाटा-रकबा मैच', en: 'Gata-rakba match', qc: true, vr: true, ds: true },
                { hi: 'रेड फ्लैग्स', en: 'Red flags', qc: true, vr: true, ds: true },
                { hi: 'नक्शा/बाउंड्री', en: 'Map/boundary', qc: false, vr: true, ds: true },
                { hi: 'कोर्ट केस (RCCMS)', en: 'Court case (RCCMS)', qc: false, vr: true, ds: true },
                { hi: 'एनकम्ब्रेंस', en: 'Encumbrance', qc: false, vr: true, ds: true },
                { hi: 'फील्ड वेरिफिकेशन', en: 'Field verification', qc: false, vr: true, ds: true },
                { hi: 'एडवोकेट रिव्यू', en: 'Advocate review', qc: false, vr: true, ds: true },
                { hi: 'बयानामा रिव्यू', en: 'Baiyanama review', qc: false, vr: false, ds: true },
                { hi: 'दाखिल-खारिज फॉलो-अप', en: 'Mutation follow-up', qc: false, vr: false, ds: true },
                { hi: 'डेडिकेटेड कोऑर्डिनेटर', en: 'Dedicated coordinator', qc: false, vr: false, ds: true },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-bg/30 transition-colors">
                  <td className="py-3.5 px-5 text-muted">{lang === 'hi' ? row.hi : row.en}</td>
                  <td className="text-center py-3.5 px-5">{row.qc ? <Check size={15} className="text-primary mx-auto" /> : <span className="text-gray-200">—</span>}</td>
                  <td className="text-center py-3.5 px-5 bg-primary/3">{row.vr ? <Check size={15} className="text-primary mx-auto" /> : <span className="text-gray-200">—</span>}</td>
                  <td className="text-center py-3.5 px-5">{row.ds ? <Check size={15} className="text-primary mx-auto" /> : <span className="text-gray-200">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary-light transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            {tr.nav.bookReport}
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
