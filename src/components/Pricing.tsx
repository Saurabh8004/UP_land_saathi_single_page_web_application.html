import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PRICING, ADD_ONS, COMPARISON_MATRIX, type Lang } from '../config';
import { ArrowRight, ChevronDown, ChevronRight, Check, X, MessageCircle, Upload, Shield, CreditCard, FileText, MapPin, Users, HelpCircle } from 'lucide-react';
import { useInView, useReducedMotion, staggerContainer, staggerItem } from '../hooks/useAnimations';

interface PricingProps {
  lang: Lang;
}

type ChoiceKey = 'document' | 'propertyCheck' | 'verification' | 'fieldVerification';

const CHOICES: { key: ChoiceKey; icon: string; label: { hi: string; en: string }; context: { hi: string; en: string } }[] = [
  { key: 'document', icon: '📄', label: { hi: 'एक डॉक्यूमेंट', en: 'Ek Document' }, context: { hi: 'पुरानी रजिस्ट्री, खतौनी या किसी प्रॉपर्टी डॉक्यूमेंट को समझना है?', en: 'Purani registry, khatauni ya kisi property document ko samajhna hai?' } },
  { key: 'propertyCheck', icon: '🏠', label: { hi: 'पूरी प्रॉपर्टी', en: 'Puri Property' }, context: { hi: 'डील से पहले प्रॉपर्टी का बेसिक चेक करवाना है?', en: 'Deal se pehle property ka basic check karwana hai?' } },
  { key: 'verification', icon: '🔍', label: { hi: 'कंप्लीट वेरिफिकेशन', en: 'Complete Verification' }, context: { hi: 'प्रॉपर्टी खरीदने का सीरियस प्लान है, पूरी जाँच चाहिए?', en: 'Property kharidne ka serious plan hai, puri jaanch chahiye?' } },
  { key: 'fieldVerification', icon: '📍', label: { hi: 'फिजिकल वेरिफिकेशन', en: 'Physical Verification' }, context: { hi: 'ऑनलाइन के साथ-साथ ग्राउंड पर भी चेक करवाना है?', en: 'Online ke saath-saath ground par bhi check karwana hai?' } }
];

export default function Pricing({ lang }: PricingProps) {
  const [selectedChoice, setSelectedChoice] = useState<ChoiceKey | null>(null);
  const [addOnsOpen, setAddOnsOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpSelection, setHelpSelection] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: viewRef, isInView } = useInView();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const handleChoiceSelect = (key: ChoiceKey) => {
    setSelectedChoice(key);
    if (key === 'fieldVerification') {
      setTimeout(() => {
        document.getElementById('field-verification')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  const getRecommendation = () => {
    if (!helpSelection) return null;
    const map: Record<string, ChoiceKey> = {
      'sirf-document': 'document',
      'property-dekh': 'propertyCheck',
      'deal-final': 'verification',
      'physical-chahiye': 'fieldVerification'
    };
    return map[helpSelection];
  };

  return (
    <section id="pricing" ref={sectionRef} className="relative py-20 md:py-28 bg-bg overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div ref={viewRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center mb-14">
          <motion.span
            initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold tracking-wider text-primary uppercase mb-5"
          >
            ZAMEENSAATHI • VERIFICATION PLANS
          </motion.span>
          <motion.h2
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-text leading-tight mb-4"
          >
            {lang === 'hi' ? 'अपनी ज़रूरत के हिसाब से जाँच चुनें' : 'Apni zarurat ke hisaab se jaanch chunein'}
          </motion.h2>
          <motion.p
            initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-muted max-w-2xl mx-auto leading-relaxed"
          >
            {lang === 'hi'
              ? 'एक डॉक्यूमेंट समझना है, प्रॉपर्टी का इनिशियल चेक करना है, या कंप्लीट वेरिफिकेशन करवानी है — जो चाहिए, वही चुनें।'
              : 'Ek document samajhna hai, property ka initial check karna hai, ya complete verification karwani hai — jo chahiye, wahi choose karein.'}
          </motion.p>
        </div>

        {/* INTERACTIVE SELECTOR */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-14"
        >
          <h3 className="text-center text-lg md:text-xl font-semibold text-text mb-6">
            {lang === 'hi' ? 'आपको क्या चेक करना है?' : 'Aapko kya check karna hai?'}
          </h3>
          
          {/* Desktop: 4 pills */}
          <div className="hidden md:grid grid-cols-4 gap-3 max-w-3xl mx-auto">
            {CHOICES.map((choice, i) => (
              <motion.button
                key={choice.key}
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                whileHover={reducedMotion ? {} : { y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleChoiceSelect(choice.key)}
                className={`relative p-4 rounded-2xl border-2 text-center transition-all ${
                  selectedChoice === choice.key
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <span className="text-2xl mb-2 block">{choice.icon}</span>
                <span className={`text-sm font-semibold ${selectedChoice === choice.key ? 'text-primary' : 'text-text'}`}>
                  {choice.label[lang]}
                </span>
                {selectedChoice === choice.key && (
                  <motion.div
                    layoutId="selectedPill"
                    className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 w-max">
              {CHOICES.map((choice, i) => (
                <motion.button
                  key={choice.key}
                  initial={reducedMotion ? {} : { opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChoiceSelect(choice.key)}
                  className={`flex-shrink-0 px-5 py-3 rounded-xl border-2 flex items-center gap-2 transition-all ${
                    selectedChoice === choice.key
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <span className="text-xl">{choice.icon}</span>
                  <span className={`text-sm font-semibold whitespace-nowrap ${selectedChoice === choice.key ? 'text-primary' : 'text-text'}`}>
                    {choice.label[lang]}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Context text */}
          <AnimatePresence mode="wait">
            {selectedChoice && (
              <motion.div
                key={selectedChoice}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center mt-5 text-sm text-muted italic"
              >
                {CHOICES.find(c => c.key === selectedChoice)?.context[lang]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* PRIMARY PRICING CARDS */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 items-start">
          {/* Card 1: Document Intelligence */}
          <PricingCard
            plan={PRICING.document}
            lang={lang}
            isInView={isInView}
            reducedMotion={reducedMotion}
            isSelected={selectedChoice === 'document'}
            isDimmed={selectedChoice !== null && selectedChoice !== 'document'}
            index={0}
          />

          {/* Card 2: Property Check */}
          <PricingCard
            plan={PRICING.propertyCheck}
            lang={lang}
            isInView={isInView}
            reducedMotion={reducedMotion}
            isSelected={selectedChoice === 'propertyCheck'}
            isDimmed={selectedChoice !== null && selectedChoice !== 'propertyCheck'}
            index={1}
          />

          {/* Card 3: Property Verification (HERO) */}
          <PricingCard
            plan={PRICING.verification}
            lang={lang}
            isInView={isInView}
            reducedMotion={reducedMotion}
            isSelected={selectedChoice === 'verification'}
            isDimmed={selectedChoice !== null && selectedChoice !== 'verification'}
            index={2}
            isHero
          />
        </div>

        {/* Confused CTA */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mb-16"
        >
          <button
            onClick={() => setHelpModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-sm font-medium text-muted hover:border-primary/30 hover:text-primary transition-all"
          >
            <HelpCircle size={16} />
            {lang === 'hi' ? 'कन्फ्यूज़ हैं? चुनने में मदद लें →' : 'Confused which one to choose? Help me choose →'}
          </button>
        </motion.div>

        {/* FIELD VERIFICATION - Premium Section */}
        <FieldVerificationSection lang={lang} isInView={isInView} reducedMotion={reducedMotion} />

        {/* ADD-ONS */}
        <AddOnsSection
          lang={lang}
          isOpen={addOnsOpen}
          onToggle={() => setAddOnsOpen(!addOnsOpen)}
          isInView={isInView}
          reducedMotion={reducedMotion}
        />

        {/* COMPARISON TABLE */}
        <ComparisonSection lang={lang} isInView={isInView} reducedMotion={reducedMotion} />

        {/* TRUST STRIP */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-16 py-6 border-t border-b border-border"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[
              { icon: FileText, text: lang === 'hi' ? 'क्लियर स्कोप' : 'Clear scope' },
              { icon: Shield, text: lang === 'hi' ? 'प्राइवेट सर्विस' : 'Private service' },
              { icon: CreditCard, text: lang === 'hi' ? 'सेक्योर पेमेंट' : 'Secure payment' },
              { icon: FileText, text: lang === 'hi' ? 'रिपोर्ट विद फाइंडिंग्स' : 'Report with findings' },
              { icon: Users, text: lang === 'hi' ? 'ह्यूमन रिव्यू अवेलेबल' : 'Human review available' },
              { icon: MapPin, text: lang === 'hi' ? 'फील्ड वेरिफिकेशन (सेलेक्टेड ज़िले)' : 'Field verification (selected districts)' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-muted">
                <item.icon size={13} className="text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* TRANSPARENCY NOTE */}
        <motion.p
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.1 }}
          className="mt-8 text-center text-xs text-muted/80 max-w-3xl mx-auto leading-relaxed"
        >
          {lang === 'hi'
            ? 'Important: ZameenSaathi एक प्राइवेट कंसल्टेंसी है, सरकारी पोर्टल नहीं। रिपोर्ट अवेलेबल रिकॉर्ड्स और डॉक्यूमेंट्स पर आधारित प्रोफेशनल ओपिनियन है; टाइटल की गारंटी नहीं।'
            : 'Important: ZameenSaathi ek private consultancy hai, sarkari portal nahi. Report available records aur documents par aadharit professional opinion hai; title ki guarantee nahi.'}
        </motion.p>
      </div>

      {/* HELP MODAL */}
      <AnimatePresence>
        {helpModalOpen && (
          <HelpModal
            lang={lang}
            onClose={() => { setHelpModalOpen(false); setHelpSelection(null); }}
            selection={helpSelection}
            onSelect={setHelpSelection}
            recommendation={getRecommendation()}
            reducedMotion={reducedMotion}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ============================================================
// PRICING CARD COMPONENT
// ============================================================
interface PricingCardProps {
  plan: {
    id: string;
    name: { hi: string; en: string };
    price?: number;
    priceLabel?: { hi: string; en: string };
    headline: { hi: string; en: string };
    description: { hi: string; en: string };
    features: { hi: string[]; en: string[] };
    delivery?: { hi: string; en: string };
    cta: { hi: string; en: string };
    disclaimer?: string | { hi: string; en: string };
    icon: string;
    popular?: boolean;
  };
  lang: Lang;
  isInView: boolean;
  reducedMotion: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  index: number;
  isHero?: boolean;
}

function PricingCard({ plan, lang, isInView, reducedMotion, isSelected, isDimmed, index, isHero }: PricingCardProps) {
  const price = 'price' in plan ? plan.price : null;

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={isInView ? { 
        opacity: isDimmed ? 0.5 : 1, 
        y: 0,
        scale: isHero ? 1.02 : 1
      } : {}}
      transition={{ duration: 0.6, delay: 0.4 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${isHero ? 'md:-mt-4 md:mb-0' : ''}`}
    >
      {/* Most Popular Badge */}
      {isHero && (
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="px-4 py-1.5 bg-accent text-text text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
            <span>⭐</span>
            <span>{lang === 'hi' ? 'सबसे ज़्यादा चुना गया' : 'MOST POPULAR'}</span>
          </div>
        </motion.div>
      )}

      <motion.div
        whileHover={reducedMotion ? {} : { y: -8, transition: { duration: 0.3 } }}
        className={`relative h-full rounded-2xl p-6 md:p-7 border-2 transition-all ${
          isHero
            ? 'bg-card border-primary shadow-2xl shadow-primary/10'
            : isSelected
              ? 'bg-card border-primary shadow-xl shadow-primary/5'
              : 'bg-card border-border hover:border-primary/20 hover:shadow-lg'
        }`}
      >
        {/* Animated border glow for hero */}
        {isHero && !reducedMotion && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
          </div>
        )}

        <div className="relative">
          {/* Icon & Label */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-2xl mb-2 block">{plan.icon}</span>
              <h3 className="text-xs font-bold tracking-wider text-primary uppercase">{plan.name[lang]}</h3>
            </div>
            {plan.priceLabel && (
              <span className="text-xs text-muted bg-bg px-2 py-1 rounded-md">
                {plan.priceLabel[lang]}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <motion.span
              key={price}
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-text"
            >
              ₹{price?.toLocaleString('en-IN')}
            </motion.span>
          </div>

          {/* Headline */}
          <h4 className="text-base font-bold text-text mb-2 leading-snug">
            {plan.headline[lang]}
          </h4>
          <p className="text-sm text-muted mb-5 leading-relaxed">
            {plan.description[lang]}
          </p>

          {/* Features */}
          <ul className="space-y-2.5 mb-6">
            {plan.features[lang].map((feature, i) => (
              <motion.li
                key={i}
                initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.15 + i * 0.05 }}
                className="flex items-start gap-2 text-sm"
              >
                <Check size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-text/80">{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* Delivery */}
          <div className="flex items-center gap-1.5 text-xs text-muted mb-5 pb-5 border-b border-border">
            <span>⏱</span>
            <span>{plan.delivery?.[lang]}</span>
          </div>

          {/* CTA */}
          <Link
            to={`/book?package=${plan.id}`}
            className={`block w-full text-center px-5 py-3.5 rounded-xl font-semibold text-sm transition-all ${
              isHero
                ? 'bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-bg text-text border border-border hover:border-primary/30 hover:text-primary hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {plan.cta[lang]}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Disclaimer */}
          {plan.disclaimer && (
            <p className="text-[10px] text-muted/70 mt-3 text-center leading-relaxed">
              {typeof plan.disclaimer === 'string' ? plan.disclaimer : plan.disclaimer[lang]}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// FIELD VERIFICATION SECTION
// ============================================================
function FieldVerificationSection({ lang, isInView, reducedMotion }: { lang: Lang; isInView: boolean; reducedMotion: boolean }) {
  const plan = PRICING.fieldVerification;

  return (
    <motion.div
      id="field-verification"
      initial={reducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl overflow-hidden mb-16"
    >
      {/* Dark green background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark" />
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
          <pattern id="fieldGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
          <rect width="800" height="400" fill="url(#fieldGrid)" />
        </svg>
      </div>

      <div className="relative grid lg:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16 items-center">
        {/* Left: Content */}
        <div>
          <motion.span
            initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold mb-4"
          >
            📍 {lang === 'hi' ? 'फील्ड सर्विस' : 'FIELD SERVICE'}
          </motion.span>

          <motion.h3
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight"
          >
            {plan.headline[lang]}
          </motion.h3>

          <motion.p
            initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-white/70 mb-6 leading-relaxed"
          >
            {plan.description[lang]}
          </motion.p>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <span className="text-xs text-white/50 uppercase tracking-wider">{plan.priceLabel[lang]}</span>
            <div className="text-3xl md:text-4xl font-bold text-white mt-1">
              ₹{plan.startingPrice.toLocaleString('en-IN')}+
            </div>
          </motion.div>

          {/* Features */}
          <motion.ul
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="grid sm:grid-cols-2 gap-2.5 mb-8"
          >
            {plan.features[lang].map((feature, i) => (
              <motion.li
                key={i}
                initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.06 }}
                className="flex items-start gap-2 text-sm text-white/80"
              >
                <Check size={14} className="text-accent mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/book?package=fieldVerification"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary rounded-xl font-semibold text-sm hover:bg-white/90 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {plan.cta[lang]}
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          {plan.disclaimer && (
            <p className="text-[11px] text-white/40 mt-4 leading-relaxed">
              {plan.disclaimer[lang]}
            </p>
          )}
        </div>

        {/* Right: Animated Property Visual */}
        <div className="hidden lg:block">
          <FieldVerificationVisual reducedMotion={reducedMotion} lang={lang} />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// FIELD VERIFICATION VISUAL (Animated SVG)
// ============================================================
function FieldVerificationVisual({ reducedMotion, lang }: { reducedMotion: boolean; lang: Lang }) {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square">
      {/* Background glow */}
      <div className="absolute inset-0 bg-white/5 rounded-3xl blur-xl" />

      <svg className="relative w-full h-full" viewBox="0 0 300 300" fill="none">
        {/* Property boundary - animated draw */}
        <motion.path
          d="M 80 80 L 220 70 L 240 150 L 220 230 L 90 240 L 60 160 Z"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          strokeDasharray="600"
          fill="rgba(255,255,255,0.03)"
          initial={reducedMotion ? {} : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />

        {/* Grid lines inside */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 2 }}
        >
          {[100, 130, 160, 190].map((y) => (
            <line key={`h-${y}`} x1="70" y1={y} x2="230" y2={y} stroke="white" strokeWidth="0.3" strokeDasharray="3 3" />
          ))}
          {[100, 130, 160, 190].map((x) => (
            <line key={`v-${x}`} x1={x} y1="80" x2={x} y2="230" stroke="white" strokeWidth="0.3" strokeDasharray="3 3" />
          ))}
        </motion.g>

        {/* Location pin - pulsing */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
        >
          <circle cx="150" cy="150" r="20" fill="rgba(245, 158, 11, 0.1)" />
          {!reducedMotion && (
            <motion.circle
              cx="150"
              cy="150"
              r="8"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          )}
          <circle cx="150" cy="150" r="6" fill="#F59E0B" />
          <circle cx="150" cy="150" r="2.5" fill="white" />
        </motion.g>

        {/* Document card floating */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <motion.g animate={reducedMotion ? {} : { y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <rect x="30" y="40" width="60" height="45" rx="6" fill="rgba(255,255,255,0.9)" />
            <rect x="38" y="50" width="30" height="3" rx="1.5" fill="#0F5132" opacity="0.3" />
            <rect x="38" y="57" width="40" height="3" rx="1.5" fill="#0F5132" opacity="0.2" />
            <rect x="38" y="64" width="25" height="3" rx="1.5" fill="#0F5132" opacity="0.15" />
            <circle cx="75" cy="72" r="6" fill="#15803D" opacity="0.2" />
            <path d="M 72 72 L 74 74 L 78 70" stroke="#15803D" strokeWidth="1.5" fill="none" />
          </motion.g>
        </motion.g>

        {/* Photo/evidence card */}
        <motion.g
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
        >
          <motion.g animate={reducedMotion ? {} : { y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }}>
            <rect x="210" y="180" width="65" height="50" rx="6" fill="rgba(255,255,255,0.9)" />
            <rect x="216" y="186" width="53" height="28" rx="3" fill="#E8EBE9" />
            <circle cx="230" cy="200" r="4" fill="#0F5132" opacity="0.2" />
            <path d="M 220 210 L 235 200 L 250 208 L 260 204 L 265 210" stroke="#0F5132" strokeWidth="1" fill="none" opacity="0.3" />
            <rect x="216" y="219" width="35" height="3" rx="1.5" fill="#0F5132" opacity="0.2" />
            <rect x="216" y="225" width="25" height="3" rx="1.5" fill="#0F5132" opacity="0.15" />
          </motion.g>
        </motion.g>

        {/* Verification check badge */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 3, type: 'spring', stiffness: 200 }}
        >
          <circle cx="240" cy="80" r="18" fill="rgba(21, 128, 61, 0.9)" />
          <path d="M 232 80 L 238 86 L 248 74" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* Connecting lines */}
        <motion.path
          d="M 90 65 Q 120 100 140 140"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={reducedMotion ? {} : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        />
        <motion.path
          d="M 160 160 Q 190 180 215 195"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={reducedMotion ? {} : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3, duration: 1 }}
        />
      </svg>
    </div>
  );
}

// ============================================================
// ADD-ONS SECTION
// ============================================================
function AddOnsSection({ lang, isOpen, onToggle, isInView, reducedMotion }: { lang: Lang; isOpen: boolean; onToggle: () => void; isInView: boolean; reducedMotion: boolean }) {
  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.9 }}
      className="mb-16"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">✨</span>
          <span className="font-semibold text-text">
            {lang === 'hi' ? 'कुछ एक्स्ट्रा चाहिए?' : 'Need something extra?'}
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} className="text-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
              {ADD_ONS.map((addon, i) => (
                <motion.div
                  key={i}
                  initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-bg border border-border hover:border-primary/15 transition-all"
                >
                  <span className="text-sm text-text font-medium">{addon.name[lang]}</span>
                  <span className="text-sm font-bold text-primary">
                    ₹{addon.price.toLocaleString('en-IN')}{addon.unit[lang]}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================
// COMPARISON SECTION
// ============================================================
function ComparisonSection({ lang, isInView, reducedMotion }: { lang: Lang; isInView: boolean; reducedMotion: boolean }) {
  const plans = [
    { key: 'document' as const, name: PRICING.document.name[lang], price: PRICING.document.price },
    { key: 'propertyCheck' as const, name: PRICING.propertyCheck.name[lang], price: PRICING.propertyCheck.price },
    { key: 'verification' as const, name: PRICING.verification.name[lang], price: PRICING.verification.price },
    { key: 'fieldVerification' as const, name: PRICING.fieldVerification.name[lang], price: PRICING.fieldVerification.startingPrice }
  ];

  const getCellValue = (planKey: keyof typeof COMPARISON_MATRIX, rowKey: string) => {
    const matrix = COMPARISON_MATRIX[planKey as keyof typeof COMPARISON_MATRIX];
    if (!matrix) return null;
    const value = (matrix as Record<string, boolean | string>)[rowKey];
    return value;
  };

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 1 }}
      className="mb-16"
    >
      <h3 className="text-xl md:text-2xl font-bold text-text text-center mb-8">
        {lang === 'hi' ? 'एक नज़र में डिफरेंस समझें' : 'Ek nazar mein difference samjhein'}
      </h3>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/50">
              <th className="text-left py-4 px-5 font-semibold text-text w-1/3">
                {lang === 'hi' ? 'फीचर' : 'Feature'}
              </th>
              {plans.map((plan) => (
                <th key={plan.key} className="text-center py-4 px-4 font-semibold text-text">
                  <div className="text-xs text-muted mb-0.5">{plan.name}</div>
                  <div className="text-primary font-bold">₹{plan.price.toLocaleString('en-IN')}{plan.key === 'fieldVerification' ? '+' : ''}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_MATRIX.rows.map((row, i) => (
              <tr key={row.key} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-bg/20' : ''}`}>
                <td className="py-3 px-5 text-muted">{row[lang]}</td>
                {plans.map((plan) => {
                  const value = getCellValue(plan.key, row.key);
                  return (
                    <td key={plan.key} className="text-center py-3 px-4">
                      {value === true && <Check size={15} className="text-primary mx-auto" />}
                      {value === false && <span className="text-gray-300">—</span>}
                      {value === 'addon' && <span className="text-xs text-accent font-medium">{lang === 'hi' ? 'एड-ऑन' : 'Add-on'}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: horizontal scroll cards */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex gap-4 w-max pb-4">
          {plans.map((plan) => (
            <div key={plan.key} className="snap-center w-72 flex-shrink-0 bg-card rounded-2xl border border-border p-5">
              <h4 className="font-bold text-text mb-1">{plan.name}</h4>
              <p className="text-lg font-bold text-primary mb-4">₹{plan.price.toLocaleString('en-IN')}{plan.key === 'fieldVerification' ? '+' : ''}</p>
              <ul className="space-y-2">
                {COMPARISON_MATRIX.rows.map((row) => {
                  const value = getCellValue(plan.key, row.key);
                  return (
                    <li key={row.key} className="flex items-center gap-2 text-sm">
                      {value === true && <Check size={13} className="text-primary" />}
                      {value === false && <span className="text-gray-300 w-3.5 text-center">—</span>}
                      {value === 'addon' && <span className="text-accent text-xs font-medium">+</span>}
                      <span className={value ? 'text-text/80' : 'text-muted/50'}>{row[lang]}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted mt-2">← {lang === 'hi' ? 'स्वाइप करें' : 'Swipe'} →</p>
      </div>
    </motion.div>
  );
}

// ============================================================
// HELP MODAL
// ============================================================
function HelpModal({ lang, onClose, selection, onSelect, recommendation, reducedMotion }: {
  lang: Lang;
  onClose: () => void;
  selection: string | null;
  onSelect: (s: string) => void;
  recommendation: ChoiceKey | null;
  reducedMotion: boolean;
}) {
  const options = [
    { key: 'sirf-document', label: { hi: 'सिर्फ डॉक्यूमेंट', en: 'Sirf document' }, icon: '📄' },
    { key: 'property-dekh', label: { hi: 'प्रॉपर्टी देख रहा हूं', en: 'Property dekh raha hoon' }, icon: '🏠' },
    { key: 'deal-final', label: { hi: 'डील लगभग फाइनल है', en: 'Deal almost final hai' }, icon: '🔍' },
    { key: 'physical-chahiye', label: { hi: 'फिजिकल वेरिफिकेशन चाहिए', en: 'Physical verification chahiye' }, icon: '📍' }
  ];

  const getRecommendedPlan = (): any => {
    if (!recommendation) return null;
    const planMap: Record<ChoiceKey, any> = {
      document: PRICING.document,
      propertyCheck: PRICING.propertyCheck,
      verification: PRICING.verification,
      fieldVerification: PRICING.fieldVerification
    };
    return planMap[recommendation];
  };

  const recommended = getRecommendedPlan();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={reducedMotion ? {} : { opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-text">
            {lang === 'hi' ? 'आपकी ज़रूरत बताइए' : 'Tell us your need'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-bg transition-colors">
            <X size={18} className="text-muted" />
          </button>
        </div>

        <p className="text-sm text-muted mb-5">
          {lang === 'hi' ? 'प्रॉपर्टी खरीदने वाली है या सिर्फ डॉक्यूमेंट चेक करना है?' : 'Property kharidne wali hai ya sirf document check karna hai?'}
        </p>

        <div className="space-y-2.5 mb-6">
          {options.map((opt) => (
            <motion.button
              key={opt.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(opt.key)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                selection === opt.key
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/20'
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <span className={`text-sm font-medium ${selection === opt.key ? 'text-primary' : 'text-text'}`}>
                {opt.label[lang]}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Recommendation */}
        <AnimatePresence>
          {recommended && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-primary/5 rounded-xl p-4 border border-primary/10"
            >
              <p className="text-xs text-primary font-semibold mb-2 uppercase tracking-wider">
                {lang === 'hi' ? 'आपकी सेलेक्शन के आधार पर सुझाव' : 'Recommended based on your selection'}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-text">{recommended.name[lang]}</p>
                  <p className="text-sm text-muted">
                    ₹{'price' in recommended ? recommended.price : recommended.startingPrice}
                    {'startingPrice' in recommended ? '+' : ''}
                  </p>
                </div>
                <Link
                  to={`/book?package=${recommended.id}`}
                  onClick={onClose}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-all"
                >
                  {lang === 'hi' ? 'बुक करें' : 'Book'}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
