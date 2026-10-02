import { useState } from 'react';
import { motion } from 'framer-motion';
import { t, PORTALS, STAMP_DUTY_RATES, REGISTRATION_FEE_RATE, CHECKLISTS, type Lang } from '../config';
import { ExternalLink, Calculator, ClipboardList } from 'lucide-react';
import { useInView, useReducedMotion, staggerContainer, staggerItem } from '../hooks/useAnimations';

interface FreeToolsProps {
  lang: Lang;
}

export default function FreeTools({ lang }: FreeToolsProps) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();

  return (
    <section id="free-tools" className="py-20 md:py-28 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-semibold mb-4">
            {lang === 'hi' ? '🛠️ मुफ्त टूल्स' : '🛠️ FREE TOOLS'}
          </span>
          <h2 className="section-title text-text">{tr.freeTools.title}</h2>
        </motion.div>

        {/* Government Portals */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-14"
        >
          <h3 className="text-lg font-bold text-text mb-5 flex items-center gap-2">
            <ExternalLink size={18} className="text-primary" />
            {tr.freeTools.portals}
          </h3>
          <motion.div
            variants={staggerContainer}
            initial={reducedMotion ? {} : "hidden"}
            animate={isInView ? "visible" : "hidden"}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {PORTALS.map((portal, i) => (
              <motion.a
                key={i}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={staggerItem}
                whileHover={reducedMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <ExternalLink size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-text text-sm group-hover:text-primary transition-colors">{portal.name[lang]}</h4>
                  <p className="text-xs text-muted mt-0.5">{portal.desc[lang]}</p>
                  <p className="text-xs text-accent mt-1 font-medium">{tr.common.officialSite}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <StampDutyCalculator lang={lang} isInView={isInView} reducedMotion={reducedMotion} />
          <DocumentChecklist lang={lang} isInView={isInView} reducedMotion={reducedMotion} />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// STAMP DUTY CALCULATOR
// ============================================================
function StampDutyCalculator({ lang, isInView, reducedMotion }: { lang: Lang; isInView: boolean; reducedMotion: boolean }) {
  const tr = t[lang];
  const [value, setValue] = useState('');
  const [buyerType, setBuyerType] = useState<'male' | 'female' | 'joint'>('male');
  const [areaType, setAreaType] = useState<'urban' | 'rural'>('urban');
  const [result, setResult] = useState<{ stampDuty: number; regFee: number; total: number } | null>(null);

  const calculate = () => {
    const propValue = parseFloat(value);
    if (!propValue || propValue <= 0) return;
    const rate = STAMP_DUTY_RATES[buyerType][areaType];
    const stampDuty = Math.round(propValue * rate / 100);
    const regFee = Math.round(propValue * REGISTRATION_FEE_RATE / 100);
    setResult({ stampDuty, regFee, total: stampDuty + regFee });
  };

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="premium-card p-6"
    >
      <h3 className="text-lg font-bold text-text mb-5 flex items-center gap-2">
        <Calculator size={18} className="text-primary" />
        {tr.freeTools.calculator.title}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text mb-1.5">{tr.freeTools.calculator.propertyValue}</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="₹ 10,00,000"
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{tr.freeTools.calculator.buyerType}</label>
            <select
              value={buyerType}
              onChange={(e) => setBuyerType(e.target.value as 'male' | 'female' | 'joint')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg/50 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option value="male">{tr.freeTools.calculator.male}</option>
              <option value="female">{tr.freeTools.calculator.female}</option>
              <option value="joint">{tr.freeTools.calculator.joint}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">{tr.freeTools.calculator.areaType}</label>
            <select
              value={areaType}
              onChange={(e) => setAreaType(e.target.value as 'urban' | 'rural')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg/50 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            >
              <option value="urban">{tr.freeTools.calculator.urban}</option>
              <option value="rural">{tr.freeTools.calculator.rural}</option>
            </select>
          </div>
        </div>
        <motion.button
          whileHover={reducedMotion ? {} : { scale: 1.01 }}
          whileTap={reducedMotion ? {} : { scale: 0.99 }}
          onClick={calculate}
          className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all shadow-md shadow-primary/15"
        >
          {tr.freeTools.calculator.calculate}
        </motion.button>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg rounded-xl p-4 border border-border space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted">{tr.freeTools.calculator.result}:</span>
              <span className="font-bold text-text">₹{result.stampDuty.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">{tr.freeTools.calculator.regFee}:</span>
              <span className="font-bold text-text">₹{result.regFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="font-bold text-text">{tr.freeTools.calculator.total}:</span>
              <span className="font-bold text-primary text-lg">₹{result.total.toLocaleString('en-IN')}</span>
            </div>
          </motion.div>
        )}
        <p className="text-xs text-accent">⚠️ {tr.freeTools.calculator.note}</p>
      </div>
    </motion.div>
  );
}

// ============================================================
// DOCUMENT CHECKLIST
// ============================================================
function DocumentChecklist({ lang, isInView, reducedMotion }: { lang: Lang; isInView: boolean; reducedMotion: boolean }) {
  const tr = t[lang];
  const [type, setType] = useState<'buy' | 'sell' | 'inherit'>('buy');

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="premium-card p-6"
    >
      <h3 className="text-lg font-bold text-text mb-5 flex items-center gap-2">
        <ClipboardList size={18} className="text-primary" />
        {tr.freeTools.checklistTool.title}
      </h3>
      <div className="flex gap-2 mb-5">
        {(['buy', 'sell', 'inherit'] as const).map((t_type) => (
          <motion.button
            key={t_type}
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            whileTap={reducedMotion ? {} : { scale: 0.98 }}
            onClick={() => setType(t_type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              type === t_type
                ? 'bg-primary text-white shadow-md shadow-primary/15'
                : 'bg-bg text-text border border-border hover:border-primary/20'
            }`}
          >
            {t_type === 'buy' ? tr.freeTools.checklistTool.buy : t_type === 'sell' ? tr.freeTools.checklistTool.sell : tr.freeTools.checklistTool.inherit}
          </motion.button>
        ))}
      </div>
      <ul className="space-y-2.5 mb-5">
        {CHECKLISTS[type][lang].map((item, i) => (
          <motion.li
            key={`${type}-${i}`}
            initial={reducedMotion ? {} : { opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3 text-sm"
          >
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
              id={`check-${type}-${i}`}
            />
            <label htmlFor={`check-${type}-${i}`} className="text-muted cursor-pointer hover:text-text transition-colors">
              {item}
            </label>
          </motion.li>
        ))}
      </ul>
      <motion.button
        whileHover={reducedMotion ? {} : { scale: 1.02 }}
        whileTap={reducedMotion ? {} : { scale: 0.98 }}
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-bg border border-border rounded-lg text-sm font-medium text-text hover:border-primary/20 transition-all no-print"
      >
        🖨️ {tr.freeTools.checklistTool.print}
      </motion.button>
    </motion.div>
  );
}
