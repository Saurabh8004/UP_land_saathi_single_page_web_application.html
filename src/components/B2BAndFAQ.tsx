import { useState } from 'react';
import { t, type Lang } from '../config';
import { Building2, TrendingUp, UserCheck, FileText, Tag, ChevronDown } from 'lucide-react';

interface B2BProps {
  lang: Lang;
}

export function B2BSection({ lang }: B2BProps) {
  const tr = t[lang];
  const [formData, setFormData] = useState({
    company: '', contact: '', mobile: '', email: '', volume: '', city: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to leads_b2b table and email admin
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
    <section id="b2b" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate mb-2">
              {tr.b2b.title}
            </h2>
            <p className="text-lg text-slate-light mb-8">{tr.b2b.subtitle}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <b.icon size={18} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-slate">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate mb-2">
                  {lang === 'hi' ? 'धन्यवाद!' : 'Thank you!'}
                </h3>
                <p className="text-slate-light">
                  {lang === 'hi' ? 'हम जल्द संपर्क करेंगे।' : 'We will contact you soon.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">{tr.b2b.form.company}</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">{tr.b2b.form.contact}</label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">{tr.b2b.form.mobile}</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">{tr.b2b.form.email}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">{tr.b2b.form.volume}</label>
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">—</option>
                      <option value="1-5">1-5</option>
                      <option value="6-20">6-20</option>
                      <option value="21-50">21-50</option>
                      <option value="50+">50+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">{tr.b2b.form.city}</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors"
                >
                  {tr.b2b.form.submit}
                </button>
              </form>
            )}
          </div>
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate mb-12">
          {tr.faq.title}
        </h2>

        <div className="space-y-3">
          {tr.faq.questions.map((item, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl overflow-hidden bg-bg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span className="font-medium text-slate pr-4">{item.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-primary flex-shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 md:px-5 pb-4 md:pb-5">
                  <p className="text-sm text-slate-light leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
