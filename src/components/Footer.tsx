import { Link } from 'react-router-dom';
import { BRAND, t, type Lang } from '../config';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  lang: Lang;
}

export default function Footer({ lang }: FooterProps) {
  const tr = t[lang];

  return (
    <footer className="bg-slate text-white pt-16 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Disclaimer */}
        <div className="bg-white/10 rounded-xl p-4 mb-12 border border-white/10">
          <p className="text-sm text-white/80 leading-relaxed">
            ⚠️ {BRAND.disclaimer[lang]}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold">ज़</span>
              </div>
              <span className="font-bold text-lg">{BRAND.name}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{tr.footer.about}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">{tr.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-sm text-white/70 hover:text-white transition-colors">{tr.nav.services}</a></li>
              <li><a href="#how-it-works" className="text-sm text-white/70 hover:text-white transition-colors">{tr.nav.howItWorks}</a></li>
              <li><a href="#sample-report" className="text-sm text-white/70 hover:text-white transition-colors">{tr.nav.sampleReport}</a></li>
              <li><a href="#free-tools" className="text-sm text-white/70 hover:text-white transition-colors">{tr.nav.freeTools}</a></li>
              <li><Link to="/book" className="text-sm text-white/70 hover:text-white transition-colors">{tr.nav.bookReport}</Link></li>
              <li><Link to="/track" className="text-sm text-white/70 hover:text-white transition-colors">{tr.nav.track}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">{tr.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone size={14} />
                <a href={`tel:${BRAND.phone}`} className="hover:text-white transition-colors">{BRAND.phone}</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <MessageCircle size={14} />
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail size={14} />
                <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">{BRAND.email}</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <MapPin size={14} />
                <span>Uttar Pradesh, India</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">{tr.footer.legal}</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-white/70 hover:text-white transition-colors">{tr.footer.privacy}</Link></li>
              <li><Link to="/terms" className="text-sm text-white/70 hover:text-white transition-colors">{tr.footer.terms}</Link></li>
              <li><Link to="/refund" className="text-sm text-white/70 hover:text-white transition-colors">{tr.footer.refund}</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-white/70 hover:text-white transition-colors">{tr.footer.disclaimer}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">{tr.footer.rights}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Twitter">𝕏</a>
            <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Facebook">f</a>
            <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Instagram">📷</a>
            <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
