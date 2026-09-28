import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND, t, type Lang } from '../config';
import { Menu, X, Globe } from 'lucide-react';
import { useScrollProgress, useReducedMotion } from '../hooks/useAnimations';

interface HeaderProps {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const tr = t[lang];
  const reducedMotion = useReducedMotion();
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: tr.nav.services, href: '#services' },
    { label: tr.nav.howItWorks, href: '#how-it-works' },
    { label: tr.nav.sampleReport, href: '#sample-report' },
    { label: tr.nav.freeTools, href: '#free-tools' },
    { label: tr.nav.forBrokers, href: '#b2b' },
    { label: tr.nav.faq, href: '#faq' },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <motion.header
        initial={reducedMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-border/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-lg">ज़</span>
              </div>
              <span className="font-bold text-xl text-text">{BRAND.name}</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-2 text-sm font-medium text-muted hover:text-text transition-colors rounded-lg hover:bg-primary/5"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2.5">
              {/* Language Toggle */}
              <motion.button
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
                onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-primary/5 hover:border-primary/20 transition-all"
                aria-label="Toggle language"
              >
                <Globe size={14} className="text-muted" />
                <span className="text-text">{lang === 'hi' ? 'EN' : 'हि'}</span>
              </motion.button>

              {/* Track Status */}
              <Link
                to="/track"
                className="hidden md:inline-flex text-sm font-medium text-muted hover:text-primary transition-colors px-3 py-2"
              >
                {tr.nav.track}
              </Link>

              {/* Book Report CTA */}
              <motion.div whileHover={reducedMotion ? {} : { scale: 1.02 }} whileTap={reducedMotion ? {} : { scale: 0.98 }}>
                <Link
                  to="/book"
                  className="hidden md:inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-light transition-all shadow-md shadow-primary/15"
                >
                  {tr.nav.bookReport}
                </Link>
              </motion.div>

              {/* Mobile menu button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X size={22} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu size={22} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="lg:hidden overflow-hidden"
              >
                <nav className="flex flex-col gap-1 pb-4 pt-2">
                  {navItems.map((item, i) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-4 py-3 rounded-xl text-base font-medium text-text hover:bg-primary/5 transition-colors"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-2 mt-3 pt-3 border-t border-border"
                  >
                    <Link
                      to="/track"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-xl text-base font-medium text-primary hover:bg-primary/5"
                    >
                      {tr.nav.track}
                    </Link>
                    <Link
                      to="/book"
                      onClick={() => setMobileOpen(false)}
                      className="mx-4 px-5 py-3 bg-primary text-white rounded-xl font-semibold text-center"
                    >
                      {tr.nav.bookReport}
                    </Link>
                  </motion.div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
