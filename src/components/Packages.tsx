import { Link } from 'react-router-dom';
import { t, type Lang } from '../config';
import { Check, Star, ArrowRight } from 'lucide-react';

interface PackagesProps {
  lang: Lang;
}

export default function Packages({ lang }: PackagesProps) {
  const tr = t[lang];
  const pkgs = [
    { ...tr.packages.quickCheck, badge: '', cta: '' },
    { ...tr.packages.verified, badge: tr.packages.verified.badge, cta: '' },
    { ...tr.packages.dealSupport, badge: '', cta: tr.packages.dealSupport.cta }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate mb-4">
          {tr.packages.title}
        </h2>
        
        {/* Package cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {pkgs.map((pkg, i) => {
            const isPopular = i === 1;
            const isLast = i === 2;
            
            return (
              <div
                key={i}
                className={`relative rounded-2xl p-6 md:p-8 border-2 transition-all card-hover ${
                  isPopular
                    ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10'
                    : 'border-gray-100 bg-white'
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-slate text-xs font-bold rounded-full">
                    {(pkg as typeof tr.packages.verified).badge}
                  </div>
                )}

                {/* Package name */}
                <h3 className="text-xl font-bold text-slate mb-1">{pkg.name}</h3>
                <p className="text-sm text-slate-light mb-4">{pkg.desc}</p>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                </div>

                {/* Delivery */}
                <p className="text-sm text-slate-light mb-6 flex items-center gap-1">
                  ⏱ {pkg.delivery}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-slate-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isLast ? (
                  <a
                    href="#b2b"
                    className="block w-full text-center px-6 py-3.5 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors"
                  >
                    {(pkg as typeof tr.packages.dealSupport).cta}
                  </a>
                ) : (
                  <Link
                    to={`/book?package=${isPopular ? 'verified-report' : 'quick-check'}`}
                    className={`block w-full text-center px-6 py-3.5 rounded-xl font-semibold transition-colors ${
                      isPopular
                        ? 'bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {tr.nav.bookReport}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Field verification note */}
        <p className="text-center text-sm text-slate-light mt-8 bg-amber-50 rounded-xl p-4 border border-amber-100">
          ⚠️ {tr.packages.fieldNote}
        </p>

        {/* Comparison table */}
        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-slate">{lang === 'hi' ? 'फीचर' : 'Feature'}</th>
                <th className="text-center py-3 px-4 font-semibold text-slate">Quick Check</th>
                <th className="text-center py-3 px-4 font-semibold text-primary">Verified Report</th>
                <th className="text-center py-3 px-4 font-semibold text-slate">Deal Support</th>
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
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-slate-light">{lang === 'hi' ? row.hi : row.en}</td>
                  <td className="text-center py-3 px-4">{row.qc ? <Check size={16} className="text-primary mx-auto" /> : <span className="text-gray-300">—</span>}</td>
                  <td className="text-center py-3 px-4 bg-primary/5">{row.vr ? <Check size={16} className="text-primary mx-auto" /> : <span className="text-gray-300">—</span>}</td>
                  <td className="text-center py-3 px-4">{row.ds ? <Check size={16} className="text-primary mx-auto" /> : <span className="text-gray-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary-light transition-colors shadow-lg shadow-primary/20"
          >
            {tr.nav.bookReport}
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
