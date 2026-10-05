import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND, DISTRICTS, t, type Lang } from './config';
import { supabase } from './lib/supabase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  Search, MapPin, FileText, Shield, CheckCircle, AlertCircle, Clock,
  ChevronDown, ChevronRight, Menu, X, ArrowRight, Globe, Loader2,
  Building2, Scale, FileCheck, Users, BookOpen, HelpCircle, Lock,
  Eye, Download, RefreshCw, Home as HomeIcon
} from 'lucide-react';

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const tr = t[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: tr.nav.home, href: '/' },
    { label: tr.nav.howItWorks, href: '#how-it-works' },
    { label: tr.nav.features, href: '#features' },
    { label: tr.nav.search, href: '#search' },
    { label: tr.nav.about, href: '#about' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-navy">{BRAND.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-navy transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang === 'hi' ? 'EN' : 'हि'}
            </button>
            <Link to="/login" className="hidden md:inline-flex text-sm font-medium text-slate-600 hover:text-navy transition-colors">
              {tr.nav.login}
            </Link>
            <a
              href="#search"
              className="hidden md:inline-flex items-center px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition-colors"
            >
              {tr.nav.getStarted}
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 border-t border-slate-100"
          >
            <nav className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-2 px-4 pt-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium">
                  {tr.nav.login}
                </Link>
                <a href="#search" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-2.5 bg-navy text-white rounded-lg text-sm font-medium">
                  {tr.nav.getStarted}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}

// ============================================================
// HERO
// ============================================================
function Hero({ lang }: { lang: Lang }) {
  const tr = t[lang];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-subtle">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#1a2332 1px, transparent 1px), linear-gradient(90deg, #1a2332 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-navy/5 rounded-full text-xs font-medium text-navy mb-6"
            >
              <Shield className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'स्वतंत्र तकनीकी मंच' : 'Independent Technology Platform'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-6"
            >
              {tr.hero.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed"
            >
              {tr.hero.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-6"
            >
              <a
                href="#search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors shadow-lg shadow-navy/20"
              >
                {tr.hero.cta1}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-navy rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                {tr.hero.cta2}
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xs text-slate-500"
            >
              {tr.hero.trust}
            </motion.p>
          </div>

          {/* Right: Property Intelligence Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <PropertyIntelligenceVisual lang={lang} />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-xs text-slate-500 mt-12 pt-8 border-t border-slate-100"
        >
          {tr.hero.disclaimer}
        </motion.p>
      </div>
    </section>
  );
}

// ============================================================
// PROPERTY INTELLIGENCE VISUAL
// ============================================================
function PropertyIntelligenceVisual({ lang }: { lang: Lang }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl shadow-navy/10 border border-slate-100 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center">
            <FileText className="w-4 h-4 text-navy" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {lang === 'hi' ? 'प्रॉपर्टी अवलोकन' : 'PROPERTY OVERVIEW'}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          {lang === 'hi' ? 'उपलब्ध' : 'Available'}
        </span>
      </div>

      {/* Location */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{lang === 'hi' ? 'स्थान' : 'Location'}</span>
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-navy">Amroha</p>
          <p className="text-sm text-slate-600">Amroha Tehsil • Atairana Village</p>
        </div>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'गाटा' : 'Gata'}</p>
          <p className="text-lg font-bold text-navy">123</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'खाता' : 'Khata'}</p>
          <p className="text-lg font-bold text-navy">00040</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'क्षेत्रफल' : 'Area'}</p>
          <p className="text-lg font-bold text-navy">0.105</p>
          <p className="text-xs text-slate-500">{lang === 'hi' ? 'हेक्टेयर' : 'hectares'}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'स्थिति' : 'Status'}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-sm font-medium text-emerald-700">
              {lang === 'hi' ? 'सत्यापन उपलब्ध' : 'Verification Available'}
            </p>
          </div>
        </div>
      </div>

      {/* Source */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">{lang === 'hi' ? 'स्रोत' : 'Source'}</span>
          </div>
          <span className="text-xs font-medium text-navy bg-navy/5 px-2 py-1 rounded">
            {lang === 'hi' ? 'आधिकारिक स्रोत' : 'Official Source'}
          </span>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-navy/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
    </div>
  );
}

// ============================================================
// PROPERTY SEARCH WIZARD
// ============================================================
function PropertySearch({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<'idle' | 'searching' | 'success' | 'partial' | 'notfound' | 'unavailable'>('idle');
  const [formData, setFormData] = useState({
    district: '',
    tehsil: '',
    village: '',
    gata: '',
    khata: ''
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearchState('searching');
    
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Demo: Show success state for test property
    if (formData.district && formData.gata) {
      setSearchState('success');
    } else {
      setSearchState('notfound');
    }
    
    setLoading(false);
  };

  const resetSearch = () => {
    setSearchState('idle');
    setStep(1);
  };

  return (
    <section id="search" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">{tr.search.title}</h2>
          <p className="text-lg text-slate-600">{tr.search.sub}</p>
        </motion.div>

        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
          {searchState === 'idle' && (
            <>
              {/* Step indicators */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      s <= step ? 'bg-navy text-white' : 'bg-white text-slate-400 border border-slate-200'
                    }`}>
                      {s < step ? <CheckCircle className="w-4 h-4" /> : s}
                    </div>
                    {s < 3 && <div className={`w-12 h-0.5 ${s < step ? 'bg-navy' : 'bg-slate-200'}`} />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Location */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-navy mb-4">{tr.search.step1}</h3>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{tr.search.district} *</label>
                      <select
                        value={formData.district}
                        onChange={(e) => updateField('district', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy"
                      >
                        <option value="">{lang === 'hi' ? 'ज़िला चुनें' : 'Select District'}</option>
                        {DISTRICTS.map((d) => (
                          <option key={d.code} value={d.code}>
                            {lang === 'hi' ? d.name_hi : d.name_en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{tr.search.tehsil} *</label>
                      <input
                        type="text"
                        value={formData.tehsil}
                        onChange={(e) => updateField('tehsil', e.target.value)}
                        placeholder={lang === 'hi' ? 'तहसील दर्ज करें' : 'Enter Tehsil'}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{tr.search.village} *</label>
                      <input
                        type="text"
                        value={formData.village}
                        onChange={(e) => updateField('village', e.target.value)}
                        placeholder={lang === 'hi' ? 'गाँव दर्ज करें' : 'Enter Village'}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy"
                      />
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      disabled={!formData.district || !formData.tehsil || !formData.village}
                      className="w-full mt-6 px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {tr.search.next}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Property Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-navy mb-4">{tr.search.step2}</h3>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{tr.search.gata} *</label>
                      <input
                        type="text"
                        value={formData.gata}
                        onChange={(e) => updateField('gata', e.target.value)}
                        placeholder={lang === 'hi' ? 'गाटा नंबर दर्ज करें' : 'Enter Gata Number'}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">{tr.search.khata}</label>
                      <input
                        type="text"
                        value={formData.khata}
                        onChange={(e) => updateField('khata', e.target.value)}
                        placeholder={lang === 'hi' ? 'खाता नंबर (वैकल्पिक)' : 'Enter Khata Number (optional)'}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy"
                      />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                      >
                        {tr.search.back}
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!formData.gata}
                        className="flex-1 px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {tr.search.next}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-navy mb-4">{tr.search.step3}</h3>
                    <div className="bg-white rounded-lg p-4 border border-slate-200 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">{tr.search.district}:</span>
                        <span className="text-sm font-medium text-navy">
                          {DISTRICTS.find(d => d.code === formData.district)?.[lang === 'hi' ? 'name_hi' : 'name_en']}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">{tr.search.tehsil}:</span>
                        <span className="text-sm font-medium text-navy">{formData.tehsil}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">{tr.search.village}:</span>
                        <span className="text-sm font-medium text-navy">{formData.village}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">{tr.search.gata}:</span>
                        <span className="text-sm font-medium text-navy">{formData.gata}</span>
                      </div>
                      {formData.khata && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">{tr.search.khata}:</span>
                          <span className="text-sm font-medium text-navy">{formData.khata}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                      >
                        {tr.search.back}
                      </button>
                      <button
                        onClick={handleSearch}
                        className="flex-1 px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
                      >
                        <Search className="w-4 h-4" />
                        {tr.search.search}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Searching State */}
          {searchState === 'searching' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <Loader2 className="w-12 h-12 text-navy animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-navy">{tr.search.searching}</p>
              <p className="text-sm text-slate-500 mt-2">{lang === 'hi' ? 'कृपया प्रतीक्षा करें...' : 'Please wait...'}</p>
            </motion.div>
          )}

          {/* Success State */}
          {searchState === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">{tr.result.found}</h3>
                  <p className="text-sm text-slate-500">{lang === 'hi' ? 'प्रॉपर्टी रिकॉर्ड उपलब्ध है' : 'Property record is available'}</p>
                </div>
              </div>

              {/* Property Overview */}
              <div className="bg-white rounded-lg p-5 border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{tr.result.overview}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{tr.search.district}</p>
                    <p className="font-medium text-navy">{DISTRICTS.find(d => d.code === formData.district)?.[lang === 'hi' ? 'name_hi' : 'name_en']}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{tr.search.tehsil}</p>
                    <p className="font-medium text-navy">{formData.tehsil}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{tr.search.village}</p>
                    <p className="font-medium text-navy">{formData.village}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{tr.search.gata}</p>
                    <p className="font-medium text-navy">{formData.gata}</p>
                  </div>
                </div>
              </div>

              {/* Source Badge */}
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium text-emerald-900">{lang === 'hi' ? 'आधिकारिक स्रोत से उपलब्ध' : 'Available from Official Source'}</p>
                    <p className="text-xs text-emerald-700">{lang === 'hi' ? 'यह जानकारी आधिकारिक भूमि अभिलेख से प्राप्त की गई है' : 'This information is retrieved from official land records'}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={resetSearch}
                className="w-full px-6 py-3 border border-slate-200 text-navy rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {lang === 'hi' ? 'नई खोज करें' : 'New Search'}
              </button>
            </motion.div>
          )}

          {/* Not Found State */}
          {searchState === 'notfound' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">{tr.result.notFound}</h3>
              <p className="text-slate-600 mb-6">{lang === 'hi' ? 'दर्ज की गई जानकारी के लिए कोई रिकॉर्ड नहीं मिला।' : 'No matching record was returned for the information provided.'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={resetSearch}
                  className="px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors"
                >
                  {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HOW IT WORKS
// ============================================================
function HowItWorks({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const steps = [
    { num: '01', title: tr.howItWorks.step1Title, desc: tr.howItWorks.step1Desc, icon: MapPin },
    { num: '02', title: tr.howItWorks.step2Title, desc: tr.howItWorks.step2Desc, icon: BookOpen },
    { num: '03', title: tr.howItWorks.step3Title, desc: tr.howItWorks.step3Desc, icon: Shield }
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">{tr.howItWorks.title}</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-navy/10 via-navy/20 to-navy/10" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-white rounded-xl p-6 border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-navy" />
                </div>
                <span className="text-3xl font-bold text-navy/10">{step.num}</span>
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FEATURES
// ============================================================
function Features({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const features = [
    { title: tr.features.search, desc: tr.features.searchDesc, icon: Search },
    { title: tr.features.intelligence, desc: tr.features.intelligenceDesc, icon: FileText },
    { title: tr.features.ownership, desc: tr.features.ownershipDesc, icon: Users },
    { title: tr.features.land, desc: tr.features.landDesc, icon: MapPin },
    { title: tr.features.mutation, desc: tr.features.mutationDesc, icon: RefreshCw },
    { title: tr.features.litigation, desc: tr.features.litigationDesc, icon: Scale },
    { title: tr.features.documents, desc: tr.features.documentsDesc, icon: FileCheck },
    { title: tr.features.reports, desc: tr.features.reportsDesc, icon: BookOpen }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">{tr.features.title}</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl border border-slate-100 hover:border-navy/20 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-4 group-hover:bg-navy/10 transition-colors">
                <feature.icon className="w-5 h-5 text-navy" />
              </div>
              <h3 className="font-semibold text-navy mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TRUST SECTION
// ============================================================
function TrustSection({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const cards = [
    { title: tr.trust.sources, desc: tr.trust.sourcesDesc, icon: Shield },
    { title: tr.trust.transparent, desc: tr.trust.transparentDesc, icon: Eye },
    { title: tr.trust.verification, desc: tr.trust.verificationDesc, icon: CheckCircle },
    { title: tr.trust.secure, desc: tr.trust.secureDesc, icon: Lock }
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{tr.trust.title}</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">{tr.trust.desc}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <card.icon className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-white/60">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FAQ
// ============================================================
function FAQ({ lang }: { lang: Lang }) {
  const tr = t[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: tr.faq.q1, a: tr.faq.a1 },
    { q: tr.faq.q2, a: tr.faq.a2 },
    { q: tr.faq.q3, a: tr.faq.a3 },
    { q: tr.faq.q4, a: tr.faq.a4 },
    { q: tr.faq.q5, a: tr.faq.a5 },
    { q: tr.faq.q6, a: tr.faq.a6 },
    { q: tr.faq.q7, a: tr.faq.a7 },
    { q: tr.faq.q8, a: tr.faq.a8 },
    { q: tr.faq.q9, a: tr.faq.a9 },
    { q: tr.faq.q10, a: tr.faq.a10 }
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy">{tr.faq.title}</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-navy pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
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

// ============================================================
// FOOTER
// ============================================================
function Footer({ lang }: { lang: Lang }) {
  const tr = t[lang];

  return (
    <footer className="bg-navy-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-bold">{BRAND.name}</span>
            </div>
            <p className="text-sm text-white/60">{BRAND.description}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{tr.footer.product}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{tr.nav.howItWorks}</a></li>
              <li><a href="#search" className="hover:text-white transition-colors">{tr.nav.search}</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">{tr.nav.features}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{tr.footer.resources}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">{tr.footer.help}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{tr.footer.faqs}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{tr.footer.legal}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="/privacy" className="hover:text-white transition-colors">{tr.footer.privacy}</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">{tr.footer.terms}</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">{tr.footer.disclaimer}</p>
          <p className="text-xs text-white/40 mt-2">© 2024 {BRAND.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <Hero lang={lang} />
      <PropertySearch lang={lang} />
      <HowItWorks lang={lang} />
      <Features lang={lang} />
      <TrustSection lang={lang} />
      <FAQ lang={lang} />
    </>
  );
}

// ============================================================
// SIMPLE AUTH PAGES
// ============================================================
function SimpleLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-xl p-8 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-navy mb-6">Login</h1>
        <p className="text-slate-600">Authentication coming soon.</p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [lang, setLang] = useState<Lang>('en');

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <Navbar lang={lang} setLang={setLang} />
            <Routes>
              <Route path="/" element={<HomePage lang={lang} />} />
              <Route path="/login" element={<SimpleLogin />} />
            </Routes>
            <Footer lang={lang} />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
