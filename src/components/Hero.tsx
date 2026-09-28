import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND, t, DISTRICTS, type Lang } from '../config';
import { Shield, Clock, MapPin, CreditCard, ChevronDown, ArrowRight, Check, Loader2, FileText, Search, ScanLine } from 'lucide-react';
import { staggerContainer, staggerItem, useReducedMotion } from '../hooks/useAnimations';

interface HeroProps {
  lang: Lang;
}

export default function Hero({ lang }: HeroProps) {
  const tr = t[lang];
  const reducedMotion = useReducedMotion();
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [village, setVillage] = useState('');
  const [gata, setGata] = useState('');
  const [mobile, setMobile] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkStep, setCheckStep] = useState(0);
  const [checkComplete, setCheckComplete] = useState(false);

  const checkSteps = lang === 'hi' 
    ? ['प्रॉपर्टी डिटेल्स मिलीं', 'रिकॉर्ड्स चेक हो रहे हैं...', 'रिस्क सिग्नल्स तैयार हो रहे हैं...', 'रिजल्ट तैयार!']
    : ['Property details received', 'Checking available records...', 'Preparing risk signals...', 'Result ready!'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setCheckStep(0);
    setCheckComplete(false);

    // Simulated checking sequence
    const stepTimings = [800, 1600, 2400, 3200];
    stepTimings.forEach((time, i) => {
      setTimeout(() => {
        setCheckStep(i + 1);
        if (i === 3) {
          setTimeout(() => {
            setCheckComplete(true);
            setIsChecking(false);
          }, 600);
        }
      }, time);
    });
  };

  const trustIcons = [
    { icon: Shield, text: tr.trust[0] },
    { icon: MapPin, text: tr.trust[1] },
    { icon: Clock, text: tr.trust[2] },
    { icon: CreditCard, text: tr.trust[3] },
  ];

  const headline = tr.hero.headline;
  const headlineWords = headline.split(' ');

  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] hero-gradient overflow-hidden noise-overlay">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: Headline & CTAs */}
          <div className="order-2 lg:order-1">
            {/* Eyebrow */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                {lang === 'hi' ? 'प्रॉपर्टी इंटेलिजेंस • उत्तर प्रदेश' : 'PROPERTY INTELLIGENCE • UTTAR PRADESH'}
              </span>
            </motion.div>

            {/* Headline with word-by-word reveal */}
            <h1 className="hero-headline font-bold text-text mb-6">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={reducedMotion ? {} : { opacity: 0, y: 40, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subheading */}
            <motion.p
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-lg md:text-xl text-muted mb-8 leading-relaxed max-w-xl"
            >
              {tr.hero.sub}
            </motion.p>
            
            {/* CTAs */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-wrap gap-4 mb-6"
            >
              <Link
                to="/book"
                className="btn-primary text-base shadow-lg shadow-primary/20"
              >
                {tr.hero.cta1}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#sample-report"
                className="btn-secondary text-base"
              >
                {tr.hero.cta2}
              </a>
            </motion.div>

            {/* Under CTA text */}
            <motion.p
              initial={reducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="text-sm text-muted/70 mb-10"
            >
              {lang === 'hi' ? 'प्राइवेट सर्विस • पारदर्शी स्कोप • सेक्योर पेमेंट' : 'Private service • Transparent scope • Secure payment'}
            </motion.p>

            {/* Trust strip */}
            <motion.div
              variants={staggerContainer}
              initial={reducedMotion ? {} : "hidden"}
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {trustIcons.map((item, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-primary" />
                  </div>
                  <span className="leading-tight">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Animated Property Verification Visual */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <PropertyVerificationVisual lang={lang} />
          </motion.div>
        </div>

        {/* QUICK CHECK FORM - Floating card */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="premium-card p-6 md:p-8 shadow-xl relative overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" style={{ width: '50%' }} />
            </div>

            <div className="relative">
              <h3 className="text-xl font-bold text-text mb-1">
                {lang === 'hi' ? 'अपनी प्रॉपर्टी चेक करें' : 'Check Your Property'}
              </h3>
              <p className="text-sm text-muted mb-5">
                {lang === 'hi' ? 'फ्री रिस्क चेक — 30 सेकंड में' : 'Free risk check — in 30 seconds'}
              </p>
              
              <AnimatePresence mode="wait">
                {!isChecking && !checkComplete ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg/50 text-base appearance-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          required
                        >
                          <option value="">{tr.hero.district}</option>
                          {DISTRICTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                      </div>
                      <input
                        type="text"
                        value={tehsil}
                        onChange={(e) => setTehsil(e.target.value)}
                        placeholder={tr.hero.tehsil}
                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={gata}
                        onChange={(e) => setGata(e.target.value)}
                        placeholder={tr.hero.gata}
                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                      />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder={tr.hero.mobile}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-primary text-white rounded-xl font-bold text-base hover:bg-primary-light transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      {tr.hero.submit}
                      <ArrowRight size={18} />
                    </button>
                  </motion.form>
                ) : isChecking ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8"
                  >
                    <div className="space-y-4">
                      {checkSteps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0.3, x: -10 }}
                          animate={{
                            opacity: checkStep > i ? 1 : 0.3,
                            x: 0
                          }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            checkStep > i ? 'bg-success/10' : 'bg-gray-100'
                          }`}>
                            {checkStep > i ? (
                              <Check size={12} className="text-success" />
                            ) : checkStep === i + 1 ? (
                              <Loader2 size={12} className="text-primary animate-spin" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-300" />
                            )}
                          </div>
                          <span className={`text-sm ${checkStep > i ? 'text-text font-medium' : 'text-muted'}`}>
                            {step}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-6 text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <Check size={24} className="text-success" />
                    </div>
                    <h4 className="font-bold text-text text-lg mb-2">
                      {lang === 'hi' ? 'प्रीलिमिनरी रिजल्ट तैयार' : 'Preliminary Result Ready'}
                    </h4>
                    <p className="text-sm text-muted mb-4">
                      {lang === 'hi' ? 'पूरी रिपोर्ट के लिए पैकेज चुनें' : 'Choose a package for the full report'}
                    </p>
                    <Link
                      to="/book"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
                    >
                      {tr.hero.cta1}
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// PROPERTY VERIFICATION VISUAL (Animated)
// ============================================================
function PropertyVerificationVisual({ lang }: { lang: Lang }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl blur-2xl" />
      
      {/* Main composition */}
      <div className="relative w-full h-full">
        {/* Property Map Card */}
        <motion.div
          animate={reducedMotion ? {} : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 left-4 right-12 bg-white rounded-2xl shadow-lg border border-border p-4 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-primary" />
            <span className="text-xs font-semibold text-text">GATA 125/A</span>
            <span className="ml-auto text-xs px-2 py-0.5 bg-success/10 text-success rounded-full font-medium">
              {lang === 'hi' ? 'मैच' : 'Match'}
            </span>
          </div>
          {/* Animated map visualization */}
          <div className="relative h-28 bg-bg rounded-xl overflow-hidden border border-border">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(15,81,50,0.05)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="200" height="120" fill="url(#grid)" />
              {/* Property boundary */}
              <motion.path
                d="M 60 30 L 140 30 L 150 50 L 140 90 L 60 90 L 50 70 Z"
                fill="rgba(15, 81, 50, 0.08)"
                stroke="var(--primary)"
                strokeWidth="1.5"
                strokeDasharray="300"
                initial={reducedMotion ? {} : { strokeDashoffset: 300 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
              />
              {/* Animated pin */}
              <motion.circle
                cx="100"
                cy="60"
                r="4"
                fill="var(--accent)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 2.5 }}
              />
              {/* Pulse ring */}
              <motion.circle
                cx="100"
                cy="60"
                r="4"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, delay: 3 }}
              />
              {/* Area label */}
              <text x="100" y="110" textAnchor="middle" fontSize="8" fill="var(--muted)">500 sq.m</text>
            </svg>
            {/* Scan line */}
            {!reducedMotion && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </motion.div>

        {/* Khatauni Document Card */}
        <motion.div
          animate={reducedMotion ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 left-0 w-44 bg-white rounded-xl shadow-lg border border-border p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText size={12} className="text-primary" />
            <span className="text-xs font-semibold text-text">{lang === 'hi' ? 'खतौनी' : 'Khatauni'}</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 bg-gray-100 rounded-full w-full" />
            <div className="h-1.5 bg-gray-100 rounded-full w-3/4" />
            <div className="h-1.5 bg-primary/10 rounded-full w-1/2" />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-success/20 flex items-center justify-center">
              <Check size={8} className="text-success" />
            </div>
            <span className="text-[10px] text-success font-medium">{lang === 'hi' ? 'वेरिफाइड' : 'Verified'}</span>
          </div>
        </motion.div>

        {/* Risk Badge */}
        <motion.div
          animate={reducedMotion ? {} : { y: [0, -10, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-16 right-0 bg-white rounded-xl shadow-lg border border-border p-3"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Search size={14} className="text-accent" />
            </div>
            <div>
              <p className="text-[10px] text-muted">{lang === 'hi' ? 'रिस्क स्कोर' : 'Risk Score'}</p>
              <p className="text-sm font-bold text-text">{lang === 'hi' ? 'कम' : 'Low'}</p>
            </div>
          </div>
        </motion.div>

        {/* Verification Check Card */}
        <motion.div
          animate={reducedMotion ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg border border-border p-3"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <Check size={14} className="text-success" />
              </div>
              {!reducedMotion && (
                <div className="absolute inset-0 rounded-full border-2 border-success/30 animate-pulse-ring" />
              )}
            </div>
            <div>
              <p className="text-[10px] text-muted">{lang === 'hi' ? 'वेरिफिकेशन' : 'Verification'}</p>
              <p className="text-xs font-bold text-success">{lang === 'hi' ? 'पूर्ण' : 'Complete'}</p>
            </div>
          </div>
        </motion.div>

        {/* Report Preview Card */}
        <motion.div
          animate={reducedMotion ? {} : { y: [0, -7, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-0 left-16 w-40 bg-white rounded-xl shadow-lg border border-border p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <ScanLine size={12} className="text-primary" />
            <span className="text-xs font-semibold text-text">{lang === 'hi' ? 'रिपोर्ट' : 'Report'}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <div className="h-1 bg-gray-100 rounded-full flex-1" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              <div className="h-1 bg-gray-100 rounded-full flex-1" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <div className="h-1 bg-gray-100 rounded-full flex-1" />
            </div>
          </div>
        </motion.div>

        {/* Connecting lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <motion.path
            d="M 200 180 C 200 220 120 240 120 280"
            fill="none"
            stroke="rgba(15,81,50,0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={reducedMotion ? {} : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 2 }}
          />
          <motion.path
            d="M 200 180 C 200 220 300 250 300 300"
            fill="none"
            stroke="rgba(15,81,50,0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={reducedMotion ? {} : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 2.5 }}
          />
        </svg>
      </div>
    </div>
  );
}
