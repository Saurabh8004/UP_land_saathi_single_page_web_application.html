import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND, t, DISTRICTS, type Lang } from '../config';
import { Shield, Clock, MapPin, CreditCard, ChevronDown } from 'lucide-react';

interface HeroProps {
  lang: Lang;
}

export default function Hero({ lang }: HeroProps) {
  const tr = t[lang];
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [gata, setGata] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to backend API for free risk check
    alert(lang === 'hi' ? 'धन्यवाद! हम जल्द संपर्क करेंगे।' : 'Thank you! We will contact you soon.');
  };

  const trustIcons = [
    { icon: Shield, text: tr.trust[0] },
    { icon: MapPin, text: tr.trust[1] },
    { icon: Clock, text: tr.trust[2] },
    { icon: CreditCard, text: tr.trust[3] },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Headline & CTAs */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate leading-tight mb-4">
              {tr.hero.headline}
            </h1>
            <p className="text-lg md:text-xl text-slate-light mb-8 leading-relaxed">
              {tr.hero.sub}
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                to="/book"
                className="inline-flex items-center px-7 py-3.5 bg-primary text-white rounded-xl font-semibold text-base hover:bg-primary-light transition-colors shadow-lg shadow-primary/20"
              >
                {tr.hero.cta1}
              </Link>
              <a
                href="#sample-report"
                className="inline-flex items-center px-7 py-3.5 border-2 border-primary text-primary rounded-xl font-semibold text-base hover:bg-primary/5 transition-colors"
              >
                {tr.hero.cta2}
              </a>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {trustIcons.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-light">
                  <item.icon size={16} className="text-primary flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Quick-start form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-slate mb-1">{tr.hero.formTitle}</h3>
            <p className="text-sm text-slate-light mb-5">{lang === 'hi' ? BRAND.taglineHi : BRAND.taglineEn}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* District */}
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base appearance-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                >
                  <option value="">{tr.hero.district}</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Tehsil */}
              <input
                type="text"
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                placeholder={tr.hero.tehsil}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />

              {/* Gata */}
              <input
                type="text"
                value={gata}
                onChange={(e) => setGata(e.target.value)}
                placeholder={tr.hero.gata}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />

              {/* Mobile */}
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder={tr.hero.mobile}
                pattern="[0-9]{10}"
                maxLength={10}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />

              <button
                type="submit"
                className="w-full px-6 py-4 bg-accent text-slate rounded-xl font-bold text-base hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
              >
                {tr.hero.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
