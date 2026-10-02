import { motion } from 'framer-motion';
import { t, type Lang } from '../config';
import { AlertTriangle, FileX, FileWarning, Scale, Send, CreditCard, Search, FileText, CheckCircle, Shield, Users, FileCheck, Lock, RefreshCw, Star } from 'lucide-react';
import { useInView, useReducedMotion, staggerContainer, staggerItem } from '../hooks/useAnimations';

interface SectionsProps {
  lang: Lang;
}

// ============================================================
// PROBLEM SECTION
// ============================================================
export function ProblemSection({ lang }: SectionsProps) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();
  const icons = [AlertTriangle, FileX, FileWarning, Scale];
  const colors = ['bg-red-50 text-red-600 border-red-100', 'bg-orange-50 text-orange-600 border-orange-100', 'bg-yellow-50 text-yellow-600 border-yellow-100', 'bg-purple-50 text-purple-600 border-purple-100'];

  return (
    <section id="services" className="py-20 md:py-28 bg-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-bg/50 to-transparent h-32" />
      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-danger/5 text-danger text-xs font-semibold mb-4">
            {lang === 'hi' ? '⚠️ सावधानी' : '⚠️ BE AWARE'}
          </span>
          <h2 className="section-title text-text">
            {tr.problem.title}
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial={reducedMotion ? {} : "hidden"}
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {tr.problem.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                className="premium-card p-6 group cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${colors[i]} border flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-lg text-text mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// HOW IT WORKS
// ============================================================
export function HowItWorks({ lang }: SectionsProps) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();
  const icons = [Send, CreditCard, Search, FileText];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-semibold mb-4">
            {lang === 'hi' ? '📋 प्रोसेस' : '📋 PROCESS'}
          </span>
          <h2 className="section-title text-text">
            {tr.howItWorks.title}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10" />
          
          {tr.howItWorks.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-center relative"
              >
                <div className="relative inline-flex mb-5">
                  <motion.div
                    whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center relative z-10"
                  >
                    <Icon size={26} className="text-primary" />
                  </motion.div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-accent text-text rounded-full flex items-center justify-center text-sm font-bold shadow-md z-20">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-text mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// WHY US / TRUST
// ============================================================
export function WhyUs({ lang }: SectionsProps) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();
  const icons = [Shield, Users, FileCheck, Lock, RefreshCw];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-semibold mb-4">
            {lang === 'hi' ? '🤝 भरोसा' : '🤝 TRUST'}
          </span>
          <h2 className="section-title text-text">
            {tr.whyUs.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Trust points */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {tr.whyUs.points.map((point, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-bg border border-border hover:border-primary/20 hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="font-medium text-text">{point}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* What we don't do */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-red-50/50 rounded-2xl p-6 border border-red-100"
          >
            <h3 className="font-bold text-lg text-danger mb-5 flex items-center gap-2">
              <AlertTriangle size={20} />
              {tr.whyUs.notDo}
            </h3>
            <ul className="space-y-4">
              {tr.whyUs.notDoPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-danger text-xs">✕</span>
                  </span>
                  <span className="text-sm text-text/80 leading-relaxed">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS (PLACEHOLDER)
// ============================================================
export function Testimonials({ lang }: SectionsProps) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-28">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h2 className="section-title text-text">{tr.testimonials.title}</h2>
        </motion.div>
        <motion.p
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center text-sm text-warning mb-12 font-medium"
        >
          {tr.testimonials.note}
        </motion.p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="premium-card p-6 opacity-60"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-accent fill-accent" />
                ))}
              </div>
              <p className="text-sm text-muted mb-4 italic">"{tr.testimonials.placeholder}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div>
                  <p className="text-sm font-medium text-text">User {i}</p>
                  <p className="text-xs text-muted">City, UP</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
