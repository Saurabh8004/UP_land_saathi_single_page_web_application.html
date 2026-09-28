import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRAND, t, type Lang } from '../config';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { useInView, useReducedMotion } from '../hooks/useAnimations';

interface FooterProps {
  lang: Lang;
}

export default function Footer({ lang }: FooterProps) {
  const tr = t[lang];
  const { ref, isInView } = useInView();
  const reducedMotion = useReducedMotion();

  return (
    <footer ref={ref} className="bg-primary-dark text-white pt-16 pb-24 md:pb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Disclaimer */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-white/5 rounded-xl p-4 mb-12 border border-white/10 backdrop-blur-sm"
        >
          <p className="text-sm text-white/70 leading-relaxed">
            ⚠️ {BRAND.disclaimer[lang]}
          </p>
        </motion.div>

        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {/* About */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-lg">ज़</span>
              </div>
              <span className="font-bold text-lg">{BRAND.name}</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{tr.footer.about}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white/90">{tr.footer.quickLinks}</h4>
            <ul className="space-y-2.5">
              <li><a href="#services" className="text-sm text-white/60 hover:text-white transition-colors">{tr.nav.services}</a></li>
              <li><a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">{tr.nav.howItWorks}</a></li>
              <li><a href="#sample-report" className="text-sm text-white/60 hover:text-white transition-colors">{tr.nav.sampleReport}</a></li>
              <li><a href="#free-tools" className="text-sm text-white/60 hover:text-white transition-colors">{tr.nav.freeTools}</a></li>
              <li><Link to="/book" className="text-sm text-white/60 hover:text-white transition-colors">{tr.nav.bookReport}</Link></li>
              <li><Link to="/track" className="text-sm text-white/60 hover:text-white transition-colors">{tr.nav.track}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-white/90">{tr.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-white/60">
                <Phone size={14} className="text-white/40" />
                <a href={`tel:${BRAND.phone}`} className="hover:text-white transition-colors">{BRAND.phone}</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/60">
                <MessageCircle size={14} className="text-white/40" />
                <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/60">
                <Mail size={14} className="text-white/40" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors">{BRAND.email}</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/60">
                <MapPin size={14} className="text-white/40" />
                <span>Uttar Pradesh, India</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-white/90">{tr.footer.legal}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">{tr.footer.privacy}</Link></li>
              <li><Link to="/terms" className="text-sm text-white/60 hover:text-white transition-colors">{tr.footer.terms}</Link></li>
              <li><Link to="/refund" className="text-sm text-white/60 hover:text-white transition-colors">{tr.footer.refund}</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-white/60 hover:text-white transition-colors">{tr.footer.disclaimer}</Link></li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">{tr.footer.rights}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all" aria-label="Twitter">𝕏</a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all" aria-label="Facebook">f</a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all" aria-label="Instagram">📷</a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all" aria-label="LinkedIn">in</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
