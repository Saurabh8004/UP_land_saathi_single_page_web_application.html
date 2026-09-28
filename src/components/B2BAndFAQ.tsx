import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t, type Lang } from '../config';
import { Building2, TrendingUp, UserCheck, FileText, Tag, ChevronDown, CheckCircle } from 'lucide-react';
import { useInView, useReducedMotion, staggerContainer, staggerItem } from '../hooks/useAnimations';

interface B2BProps {
  lang: Lang;
}

export function B2BSection({ lang }: B2BProps) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    company: '', contact: '', mobile: '', email: '', volume: '', city: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('B2B Lead:', formData);
    setSubmitted(true);
  };

  const benefits = [
    { icon: Tag, text: tr.b2b.benefits[0] },
    { icon: UserCheck, text: tr.b2b.benefits[1] },
    { icon: FileText, text: tr.b2b.benefits[2] },
    { icon: TrendingUp, text: tr.b2b.benefits[3] },
  ];

  return (
    <section id="b2b" className="py-20 md:py-28">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-semibold mb-4">
            {lang === 'hi' ? '🏢 B2B' : '🏢 B2B'}
          </span>
          <h2 className="section-title text-text mb-3">{tr.b2b.title}</h2>
          <p className="text-muted text-lg">{tr.b2b.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Benefits */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={reducedMotion ? {} : { y: -3 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0">
                    <b.icon size={18} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-text">{b.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="premium-card p-6 md:p-8 shadow-xl"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle size={28} className="text-success" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-text mb-2">
                    {lang === 'hi' ? 'धन्यवाद!' : 'Thank you!'}
                  </h3>
                  <p className="text-muted">{lang === 'hi' ? 'हम जल्द संपर्क करेंगे।' : 'We will contact you soon.'}</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">{tr.b2b.form.company}</label>
                    <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">{tr.b2b.form.contact}</label>
                      <input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">{tr.b2b.form.mobile}</label>
                      <input type="tel" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} pattern="[0-9]{10}" maxLength={10} className="w-full px-4 py-3 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">{tr.b2b.form.email}</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">{tr.b2b.form.volume}</label>
                      <select value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required>
                        <option value="">—</option>
                        <option value="1-5">1-5</option>
                        <option value="6-20">6-20</option>
                        <option value="21-50">21-50</option>
                        <option value="50+">50+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">{tr.b2b.form.city}</label>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-bg/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" required />
                  </div>
                  <motion.button
                    whileHover={reducedMotion ? {} : { scale: 1.01 }}
                    whileTap={reducedMotion ? {} : { scale: 0.99 }}
                    type="submit"
                    className="w-full px-6 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all shadow-lg shadow-primary/15"
                  >
                    {tr.b2b.form.submit}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FAQ SECTION
// ============================================================
export function FAQ({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-semibold mb-4">
            {lang === 'hi' ? '❓ FAQ' : '❓ FAQ'}
          </span>
          <h2 className="section-title text-text">{tr.faq.title}</h2>
        </motion.div>

        <div className="space-y-3">
          {tr.faq.questions.map((item, i) => (
            <motion.div
              key={i}
              initial={reducedMotion ? {} : { opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="border border-border rounded-xl overflow-hidden bg-card hover:border-primary/15 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-bg/50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-text pr-4 text-[15px]">{item.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown size={18} className="text-primary" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <p className="text-sm text-muted leading-relaxed">{item.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
