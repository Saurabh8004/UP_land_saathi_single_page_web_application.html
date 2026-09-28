import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BRAND, t, type Lang } from '../config';
import { Menu, X, Globe } from 'lucide-react';

interface HeaderProps {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const tr = t[lang];

  const navItems = [
    { label: tr.nav.services, href: '#services' },
    { label: tr.nav.howItWorks, href: '#how-it-works' },
    { label: tr.nav.sampleReport, href: '#sample-report' },
    { label: tr.nav.freeTools, href: '#free-tools' },
    { label: tr.nav.forBrokers, href: '#b2b' },
    { label: tr.nav.faq, href: '#faq' },
  ];

  const isActive = (href: string) => {
    if (location.pathname === '/' && href.startsWith('#')) return false;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">ज़</span>
            </div>
            <span className="font-bold text-xl text-primary">{BRAND.name}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium hover:text-primary transition-colors ${
                  isActive(item.href) ? 'text-primary' : 'text-slate-light'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
              aria-label="Toggle language"
            >
              <Globe size={14} />
              <span>{lang === 'hi' ? 'EN' : 'हि'}</span>
            </button>

            {/* Track Status */}
            <Link
              to="/track"
              className="hidden md:inline-flex text-sm font-medium text-primary hover:text-primary-light"
            >
              {tr.nav.track}
            </Link>

            {/* Book Report CTA */}
            <Link
              to="/book"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-light transition-colors"
            >
              {tr.nav.bookReport}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 mobile-menu-enter">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium text-slate hover:bg-gray-50"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/track"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-base font-medium text-primary hover:bg-gray-50"
              >
                {tr.nav.track}
              </Link>
              <Link
                to="/book"
                onClick={() => setMobileOpen(false)}
                className="mx-4 mt-2 px-5 py-3 bg-primary text-white rounded-xl font-semibold text-center"
              >
                {tr.nav.bookReport}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
