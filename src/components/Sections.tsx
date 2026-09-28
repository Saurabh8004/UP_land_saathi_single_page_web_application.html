import { t, type Lang } from '../config';
import { AlertTriangle, FileX, FileWarning, Scale, Send, CreditCard, Search, FileText, CheckCircle, Shield, Users, FileCheck, Lock, RefreshCw, Star } from 'lucide-react';

interface SectionsProps {
  lang: Lang;
}

// ============================================================
// PROBLEM SECTION
// ============================================================
export function ProblemSection({ lang }: SectionsProps) {
  const tr = t[lang];
  const icons = [AlertTriangle, FileX, FileWarning, Scale];
  const colors = ['bg-red-50 text-red-600', 'bg-orange-50 text-orange-600', 'bg-yellow-50 text-yellow-600', 'bg-purple-50 text-purple-600'];

  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate mb-12">
          {tr.problem.title}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tr.problem.cards.map((card, i) => (
            <div key={i} className="bg-bg rounded-2xl p-6 border border-gray-100 card-hover">
              <div className={`w-12 h-12 rounded-xl ${colors[i]} flex items-center justify-center mb-4`}>
                {(() => { const Icon = icons[i]; return <Icon size={24} />; })()}
              </div>
              <h3 className="font-bold text-lg text-slate mb-2">{card.title}</h3>
              <p className="text-sm text-slate-light leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HOW IT WORKS
// ============================================================
export function HowItWorks({ lang }: SectionsProps) {
  const tr = t[lang];
  const icons = [Send, CreditCard, Search, FileText];

  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate mb-12">
          {tr.howItWorks.title}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {tr.howItWorks.steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="relative inline-flex mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {(() => { const Icon = icons[i]; return <Icon size={28} className="text-primary" />; })()}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-accent text-slate rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate mb-2">{step.title}</h3>
              <p className="text-sm text-slate-light">{step.desc}</p>
            </div>
          ))}
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
  const icons = [Shield, Users, FileCheck, Lock, RefreshCw];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate mb-12">
          {tr.whyUs.title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Trust points */}
          <div className="space-y-4">
            {tr.whyUs.points.map((point, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-bg border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {(() => { const Icon = icons[i]; return <Icon size={20} className="text-primary" />; })()}
                </div>
                <span className="font-medium text-slate">{point}</span>
              </div>
            ))}
          </div>

          {/* What we don't do */}
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <h3 className="font-bold text-lg text-red-700 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              {tr.whyUs.notDo}
            </h3>
            <ul className="space-y-3">
              {tr.whyUs.notDoPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-red-700">
                  <span className="text-red-400 mt-1">✕</span>
                  <span className="text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS (PLACEHOLDER - Replace with real reviews)
// ============================================================
export function Testimonials({ lang }: SectionsProps) {
  const tr = t[lang];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate mb-4">
          {tr.testimonials.title}
        </h2>
        <p className="text-center text-sm text-amber-600 mb-12 font-medium">
          {tr.testimonials.note}
        </p>
        
        {/* Placeholder - will be replaced with real testimonials */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 opacity-50">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="text-accent fill-accent" />
                ))}
              </div>
              <p className="text-sm text-slate-light mb-4 italic">
                "{tr.testimonials.placeholder}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <p className="text-sm font-medium text-slate">User {i}</p>
                  <p className="text-xs text-slate-light">City, UP</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
