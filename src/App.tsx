import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND, DISTRICTS, t, type Lang } from './config';
import { supabase } from './lib/supabase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Booking from './pages/Booking';
import {
  Search, MapPin, FileText, Shield, CheckCircle, AlertCircle, Clock,
  ChevronDown, ChevronRight, Menu, X, ArrowRight, Globe, Loader2,
  Building2, Scale, FileCheck, Users, BookOpen, HelpCircle, Lock,
  Eye, Download, RefreshCw, Home as HomeIcon, TrendingUp
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
    { label: tr.nav.freeTools, href: '#free-tools' },
    { label: 'Property Report', href: '#property-report' },
    { label: tr.nav.expertConsultation, href: '#expert-consultation' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-blue to-teal flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-lg ${scrolled ? 'text-navy' : 'text-white'}`}>{BRAND.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-slate-600 hover:text-royal-blue' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Globe className="w-4 h-4" />
              {lang === 'hi' ? 'EN' : 'हि'}
            </button>
            <Link to="/login" className={`hidden md:inline-flex text-sm font-medium transition-colors ${
              scrolled ? 'text-slate-600 hover:text-royal-blue' : 'text-white/80 hover:text-white'
            }`}>
              {tr.nav.login}
            </Link>
            <a
              href="#search"
              className="hidden md:inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-royal-blue to-teal text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-royal-blue/30 transition-all hover:scale-105"
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
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-hero animated-gradient">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-royal-blue/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-float-slow" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-medium text-white mb-6"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald" />
              {lang === 'hi' ? 'प्रॉपर्टी इंटेलिजेंस प्लेटफॉर्म' : 'Property Intelligence Platform'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              {lang === 'hi' ? (
                <>
                  निवेश से पहले
                  <br />
                  <span className="bg-gradient-to-r from-gold to-orange bg-clip-text text-transparent">
                    अपनी प्रॉपर्टी को समझें।
                  </span>
                </>
              ) : (
                <>
                  Know Your Property.
                  <br />
                  <span className="bg-gradient-to-r from-gold to-orange bg-clip-text text-transparent">
                    Before You Invest.
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed"
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
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-blue to-teal text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-royal-blue/50 transition-all hover:scale-105"
              >
                {tr.hero.cta1}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#free-tools"
                className="inline-flex items-center gap-2 px-8 py-4 glass text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                {tr.hero.cta2}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-6 text-sm text-white/70"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
                <span>{lang === 'hi' ? 'प्रॉपर्टी इंटेलिजेंस' : 'Property Intelligence'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span>{lang === 'hi' ? 'फिजिकल वेरिफिकेशन' : 'Physical Verification'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span>{lang === 'hi' ? 'विशेषज्ञ' : 'Experts'}</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Animated Property Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <AnimatedPropertyMap lang={lang} />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-xs text-white/50 mt-12 pt-8 border-t border-white/10"
        >
          {tr.hero.disclaimer}
        </motion.p>
      </div>
    </section>
  );
}

// ============================================================
// ANIMATED PROPERTY MAP
// ============================================================
function AnimatedPropertyMap({ lang }: { lang: Lang }) {
  return (
    <div className="relative w-full h-[500px]">
      {/* Map background */}
      <div className="absolute inset-0 glass rounded-3xl overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 500 500" fill="none">
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(11,31,58,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="500" height="500" fill="url(#grid)" />
          
          {/* Animated property boundary */}
          <motion.path
            d="M 150 150 L 350 150 L 350 350 L 150 350 Z"
            stroke="#2563EB"
            strokeWidth="3"
            fill="rgba(37,99,235,0.1)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          
          {/* Location marker */}
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
          >
            <circle cx="250" cy="250" r="30" fill="rgba(15,157,138,0.2)" />
            <motion.circle
              cx="250"
              cy="250"
              r="15"
              fill="#0F9D8A"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="250" cy="250" r="6" fill="white" />
          </motion.g>
          
          {/* Connecting lines */}
          <motion.path
            d="M 250 250 L 100 100"
            stroke="#D4A72C"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2, duration: 1 }}
          />
          <motion.path
            d="M 250 250 L 400 100"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
          />
          <motion.path
            d="M 250 250 L 400 400"
            stroke="#16A34A"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.4, duration: 1 }}
          />
        </svg>
      </div>

      {/* Floating data cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="absolute top-10 left-10 glass rounded-xl p-4 shadow-xl animate-float"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-royal-blue/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-royal-blue" />
          </div>
          <div>
            <p className="text-xs text-muted">{lang === 'hi' ? 'लैंड रिकॉर्ड' : 'Land Record'}</p>
            <p className="text-sm font-bold text-navy">{lang === 'hi' ? 'वेरिफाइड' : 'Verified'}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute top-20 right-10 glass rounded-xl p-4 shadow-xl animate-float-slow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-teal" />
          </div>
          <div>
            <p className="text-xs text-muted">{lang === 'hi' ? 'लोकेशन' : 'Location'}</p>
            <p className="text-sm font-bold text-navy">Amroha, UP</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-20 left-20 glass rounded-xl p-4 shadow-xl animate-float"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald" />
          </div>
          <div>
            <p className="text-xs text-muted">{lang === 'hi' ? 'क्षमता' : 'Potential'}</p>
            <p className="text-sm font-bold text-navy">{lang === 'hi' ? 'मध्यम' : 'Moderate'}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="absolute bottom-10 right-20 glass rounded-xl p-4 shadow-xl animate-float-slow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-xs text-muted">{lang === 'hi' ? 'रिस्क' : 'Risk'}</p>
            <p className="text-sm font-bold text-navy">{lang === 'hi' ? 'समीक्षा' : 'Review'}</p>
          </div>
        </div>
      </motion.div>

      {/* Center property info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-dark rounded-2xl p-6 shadow-2xl"
      >
        <div className="text-center text-white">
          <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
            {lang === 'hi' ? 'प्रॉपर्टी' : 'Property'}
          </p>
          <p className="text-3xl font-bold mb-1">0.105</p>
          <p className="text-sm text-white/70">{lang === 'hi' ? 'हेक्टेयर' : 'Hectare'}</p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// PROPERTY INTELLIGENCE VISUAL
// ============================================================
function PropertyIntelligenceVisual({ lang }: { lang: Lang }) {
  return (
    <div className="relative">
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-white rounded-2xl shadow-2xl shadow-navy/10 border border-slate-100 p-6 overflow-hidden"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(#1a2332 1px, transparent 1px), linear-gradient(90deg, #1a2332 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative flex items-center justify-between mb-6 pb-4 border-b border-slate-100"
        >
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
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            {lang === 'hi' ? 'उपलब्ध' : 'Available'}
          </motion.span>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{lang === 'hi' ? 'स्थान' : 'Location'}</span>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-navy">Amroha</p>
            <p className="text-sm text-slate-600">Amroha Tehsil • Atairana Village</p>
          </div>
        </motion.div>

        {/* Property Details Grid */}
        <div className="relative grid grid-cols-2 gap-4 mb-6">
          {[
            { label: lang === 'hi' ? 'गाटा' : 'Gata', value: '123', delay: 0.5 },
            { label: lang === 'hi' ? 'खाता' : 'Khata', value: '00040', delay: 0.6 },
            { label: lang === 'hi' ? 'क्षेत्रफल' : 'Area', value: '0.105', sub: lang === 'hi' ? 'हेक्टेयर' : 'hectares', delay: 0.7 },
            { label: lang === 'hi' ? 'स्थिति' : 'Status', isStatus: true, delay: 0.8 }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: item.delay }}
              className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors"
            >
              <p className="text-xs text-slate-500 mb-1">{item.label}</p>
              {item.isStatus ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-emerald-500" 
                  />
                  <p className="text-sm font-medium text-emerald-700">
                    {lang === 'hi' ? 'सत्यापन उपलब्ध' : 'Verification Available'}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-lg font-bold text-navy">{item.value}</p>
                  {item.sub && <p className="text-xs text-slate-500">{item.sub}</p>}
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Source */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="relative pt-4 border-t border-slate-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500">{lang === 'hi' ? 'स्रोत' : 'Source'}</span>
            </div>
            <span className="text-xs font-medium text-navy bg-navy/5 px-2 py-1 rounded">
              {lang === 'hi' ? 'आधिकारिक स्रोत' : 'Official Source'}
            </span>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-navy/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-slate-100"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-navy">{lang === 'hi' ? 'सत्यापित' : 'Verified'}</p>
            <p className="text-[10px] text-slate-500">{lang === 'hi' ? 'आधिकारिक' : 'Official'}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-slate-100"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-navy" />
          </div>
          <div>
            <p className="text-xs font-medium text-navy">{lang === 'hi' ? 'सुरक्षित' : 'Secure'}</p>
            <p className="text-[10px] text-slate-500">{lang === 'hi' ? 'एन्क्रिप्टेड' : 'Encrypted'}</p>
          </div>
        </div>
      </motion.div>
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
    
    // Demo: Show different states based on input
    // For demo purposes, we'll show different states
    const demoStates = ['success', 'partial', 'notfound', 'unavailable'] as const;
    const randomState = demoStates[Math.floor(Math.random() * demoStates.length)];
    
    // For the test property (Amroha, Gata 123), always show success
    if (formData.district === '137' && formData.gata === '123') {
      setSearchState('success');
    } else if (formData.district && formData.gata) {
      setSearchState(randomState);
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
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'खाता' : 'Khata'}</p>
                    <p className="font-medium text-navy">00040</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'क्षेत्रफल' : 'Area'}</p>
                    <p className="font-medium text-navy">0.105 {lang === 'hi' ? 'हेक्टेयर' : 'hectares'}</p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-white rounded-lg p-5 border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{tr.result.owner}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'मालिक का नाम' : 'Owner Name'}</p>
                      <p className="font-medium text-navy">Saurabh Awasthi</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {lang === 'hi' ? 'आधिकारिक स्रोत' : 'Official Source'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'पिता/पति का नाम' : 'Father/Husband Name'}</p>
                    <p className="font-medium text-navy">Ramesh Awasthi</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'हिस्सा' : 'Share'}</p>
                    <p className="font-medium text-navy">100%</p>
                  </div>
                </div>
              </div>

              {/* Land Details */}
              <div className="bg-white rounded-lg p-5 border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{tr.result.land}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'भूमि प्रकार' : 'Land Type'}</p>
                    <p className="font-medium text-navy">{lang === 'hi' ? 'आबादी' : 'Abadi'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'भूमि स्थिति' : 'Land Status'}</p>
                    <p className="font-medium text-navy">{lang === 'hi' ? 'मुक्त' : 'Freehold'}</p>
                  </div>
                </div>
              </div>

              {/* Record Status */}
              <div className="bg-white rounded-lg p-5 border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{tr.result.status}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'म्यूटेशन स्थिति' : 'Mutation Status'}</p>
                      <p className="font-medium text-navy">{lang === 'hi' ? 'अपडेटेड' : 'Updated'}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
                      {lang === 'hi' ? 'स्पष्ट' : 'Clear'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'मुकदमा स्थिति' : 'Litigation Status'}</p>
                      <p className="font-medium text-navy">{lang === 'hi' ? 'कोई मुकदमा नहीं' : 'No Litigation'}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
                      {lang === 'hi' ? 'स्पष्ट' : 'Clear'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Source Information */}
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-emerald-900 mb-1">{lang === 'hi' ? 'आधिकारिक स्रोत से उपलब्ध' : 'Available from Official Source'}</p>
                    <p className="text-xs text-emerald-700 mb-2">{lang === 'hi' ? 'यह जानकारी आधिकारिक भूमि अभिलेख से प्राप्त की गई है' : 'This information is retrieved from official land records'}</p>
                    <div className="flex items-center gap-2 text-xs text-emerald-600">
                      <Clock className="w-3 h-3" />
                      <span>{lang === 'hi' ? 'अंतिम अपडेट: आज' : 'Last updated: Today'}</span>
                    </div>
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

          {/* Partial Data State */}
          {searchState === 'partial' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">{tr.result.partial}</h3>
                  <p className="text-sm text-slate-500">{lang === 'hi' ? 'कुछ जानकारी उपलब्ध है, लेकिन कुछ विवरणों को अतिरिक्त सत्यापन की आवश्यकता है' : 'Some information is available, but some details require additional verification'}</p>
                </div>
              </div>

              {/* Available Information */}
              <div className="bg-white rounded-lg p-5 border border-slate-200">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{tr.result.overview}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{tr.search.district}</p>
                    <p className="font-medium text-navy">{DISTRICTS.find(d => d.code === formData.district)?.[lang === 'hi' ? 'name_hi' : 'name_en']}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded">{lang === 'hi' ? 'उपलब्ध' : 'Available'}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{tr.search.gata}</p>
                    <p className="font-medium text-navy">{formData.gata}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded">{lang === 'hi' ? 'उपलब्ध' : 'Available'}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'मालिक' : 'Owner'}</p>
                    <p className="font-medium text-slate-400">—</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded">{lang === 'hi' ? 'सत्यापन लंबित' : 'Pending Verification'}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'क्षेत्रफल' : 'Area'}</p>
                    <p className="font-medium text-slate-400">—</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded">{lang === 'hi' ? 'अनुपलब्ध' : 'Unavailable'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">{lang === 'hi' ? 'आंशिक जानकारी' : 'Partial Information'}</p>
                    <p className="text-xs text-amber-700 mt-1">{lang === 'hi' ? 'कुछ रिकॉर्ड आधिकारिक स्रोतों से उपलब्ध नहीं हैं। पूर्ण सत्यापन के लिए अतिरिक्त दस्तावेज़ों की आवश्यकता हो सकती है।' : 'Some records are not available from official sources. Additional documents may be required for complete verification.'}</p>
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

          {/* Unavailable State */}
          {searchState === 'unavailable' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">{tr.result.unavailable}</h3>
              <p className="text-slate-600 mb-6">{lang === 'hi' ? 'आधिकारिक डेटा स्रोत वर्तमान में अनुपलब्ध है। आपकी प्रॉपर्टी जानकारी सत्यापित नहीं की गई है।' : 'The official data source is currently unavailable. Your property information has not been verified.'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={resetSearch}
                  className="px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors"
                >
                  {lang === 'hi' ? 'पुनः प्रयास करें' : 'Try Again'}
                </button>
                <button
                  onClick={resetSearch}
                  className="px-6 py-3 border border-slate-200 text-navy rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  {lang === 'hi' ? 'बाद में सत्यापित करें' : 'Verify Later'}
                </button>
              </div>
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
// DOCUMENT VERIFICATION
// ============================================================
function DocumentVerification({ lang }: { lang: Lang }) {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {lang === 'hi' ? 'अपने दस्तावेज़ों को सिर्फ स्टोर न करें। उन्हें समझें।' : "Don't Just Store Your Documents. Understand Them."}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {lang === 'hi' 
              ? 'अपने प्रॉपर्टी दस्तावेज़ अपलोड करें और उन्हें उपलब्ध रिकॉर्ड जानकारी से तुलना करें।'
              : 'Upload your property documents and compare them with available record information.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 border-2 border-dashed border-slate-200 hover:border-navy/30 transition-colors"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-8 h-8 text-navy" />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">
                {lang === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {lang === 'hi' ? 'खतौनी, बयाना, रजिस्ट्री, म्यूटेशन दस्तावेज़' : 'Khatauni, Sale Deed, Registry, Mutation Documents'}
              </p>
              <button className="px-6 py-3 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors">
                {lang === 'hi' ? 'फाइल चुनें' : 'Choose File'}
              </button>
              <p className="text-xs text-slate-500 mt-3">
                {lang === 'hi' ? 'PDF, JPG, PNG (अधिकतम 10 MB)' : 'PDF, JPG, PNG (Max 10 MB)'}
              </p>
            </div>
          </motion.div>

          {/* Comparison Result */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-navy" />
                <h4 className="font-semibold text-navy">Khatauni.pdf</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'निकाला गया' : 'Extracted'}</p>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                    <p className="text-sm"><span className="text-slate-500">Gata:</span> <span className="font-medium text-navy">123</span></p>
                    <p className="text-sm"><span className="text-slate-500">Khata:</span> <span className="font-medium text-navy">00040</span></p>
                    <p className="text-sm"><span className="text-slate-500">Area:</span> <span className="font-medium text-navy">0.105000</span></p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'रिकॉर्ड' : 'Record'}</p>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                    <p className="text-sm"><span className="text-slate-500">Gata:</span> <span className="font-medium text-navy">123</span></p>
                    <p className="text-sm"><span className="text-slate-500">Khata:</span> <span className="font-medium text-navy">00040</span></p>
                    <p className="text-sm"><span className="text-slate-500">Area:</span> <span className="font-medium text-navy">0.105000</span></p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-700">
                      {lang === 'hi' ? 'जानकारी मेल खाती है' : 'Information Matches'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">
                    {lang === 'hi' ? 'दस्तावेज़ सत्यापित' : 'Document Verified'}
                  </p>
                  <p className="text-xs text-emerald-700 mt-1">
                    {lang === 'hi' ? 'आपका दस्तावेज़ आधिकारिक रिकॉर्ड से मेल खाता है' : 'Your document matches the official record'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
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
              <li><a href="#free-tools" className="hover:text-white transition-colors">{tr.nav.freeTools}</a></li>
              <li><a href="#property-report" className="hover:text-white transition-colors">Property Report</a></li>
              <li><a href="#expert-consultation" className="hover:text-white transition-colors">{tr.nav.expertConsultation}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{tr.nav.howItWorks}</a></li>
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
          <p className="text-xs text-white/40">
            {lang === 'hi'
              ? 'भूमि साथी द्वारा प्रदान की गई जानकारी सूचित निर्णय लेने में सहायता के लिए है और प्रमाणित सरकारी दस्तावेज़ या कानूनी राय का गठन नहीं करती।'
              : 'Information provided by Bhumi Saathi is intended to support informed decision-making and does not constitute a certified government document or legal opinion.'}
          </p>
          <p className="text-xs text-white/40 mt-2">© 2024 {BRAND.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// WHY BHUMI SAATHI
// ============================================================
function WhyBhumiSaathi({ lang }: { lang: Lang }) {
  const cards = [
    {
      title: lang === 'hi' ? 'बहुत अधिकारी जानकारी' : 'Too Much Information',
      desc: lang === 'hi' 
        ? 'प्रॉपर्टी जानकारी अलग-अलग स्रोतों में बिखरी हुई है।'
        : 'Property information is scattered across different sources.'
    },
    {
      title: lang === 'hi' ? 'समझना मुश्किल' : 'Hard to Interpret',
      desc: lang === 'hi'
        ? 'रिकॉर्ड खोजना और यह समझना कि इसका क्या मतलब है, दो अलग बातें हैं।'
        : 'Finding a record is not the same as understanding what it means.'
    },
    {
      title: lang === 'hi' ? 'बड़ा फैसला' : 'High-Value Decision',
      desc: lang === 'hi'
        ? 'प्रॉपर्टी खरीद में लाखों या करोड़ शामिल हो सकते हैं। छोटी अनदेखी जानकारी मायने रख सकती है।'
        : 'A property purchase can involve lakhs or crores. Small overlooked details can matter.'
    },
    {
      title: lang === 'hi' ? 'विशेषज्ञ मार्गदर्शन की आवश्यकता' : 'Need for Expert Guidance',
      desc: lang === 'hi'
        ? 'जब कोई संभावित समस्या दिखे, तो उपयोगकर्ताओं को योग्य पेशेवरों तक पहुंच होनी चाहिए।'
        : 'When a potential issue appears, users should have access to qualified professionals.'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {lang === 'hi' 
              ? 'प्रॉपर्टी फैसले बिखरी हुई जानकारी पर निर्भर नहीं होने चाहिए।'
              : "Property decisions shouldn't depend on scattered information."}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {lang === 'hi'
              ? 'भूमि अभिलेख, दस्तावेज़, लोकेशन डेटा, विकास गतिविधि और बाजार संकेत अक्सर अलग-अलग जगहों पर होते हैं। भूमि साथी प्रासंगिक जानकारी को एक साथ लाता है ताकि आप फैसला लेने से पहले प्रॉपर्टी को समझ सकें।'
              : 'Land records, documents, location data, development activity and market signals often exist in different places. Bhumi Saathi brings relevant information together so you can understand the property before making a decision.'}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-slate-100 hover:border-navy/20 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center mb-4 group-hover:bg-navy/10 transition-colors">
                <span className="text-2xl font-bold text-navy/20">0{i + 1}</span>
              </div>
              <h3 className="font-semibold text-navy mb-2">{card.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FREE TOOLS
// ============================================================
function FreeTools({ lang }: { lang: Lang }) {
  const tools = [
    {
      title: lang === 'hi' ? 'भूमि अभिलेख खोज' : 'Land Record Search',
      desc: lang === 'hi'
        ? 'लोकेशन और प्रॉपर्टी विवरण का उपयोग करके उपलब्ध सरकारी भूमि-अभिलेख जानकारी खोजें।'
        : 'Search available government land-record information using location and property details.',
      cta: lang === 'hi' ? 'भूमि अभिलेख खोजें' : 'Search Land Records',
      icon: Search
    },
    {
      title: lang === 'hi' ? 'भूमि और क्षेत्र विवरण' : 'Land & Area Details',
      desc: lang === 'hi'
        ? 'बुनियादी भूमि जानकारी, क्षेत्र, प्लॉट विवरण और उपलब्ध लोकेशन जानकारी देखें।'
        : 'Explore basic land information, area, plot details and available location information.',
      cta: lang === 'hi' ? 'प्रॉपर्टी देखें' : 'Explore Property',
      icon: MapPin
    },
    {
      title: lang === 'hi' ? 'भूमि सराहकरण अनुमानक' : 'Land Appreciation Estimator',
      desc: lang === 'hi'
        ? 'उपलब्ध लोकेशन, कनेक्टिविटी, विकास और बाजार संकेतकों का उपयोग करके प्रॉपर्टी सराहकरण क्षमता का संकेतक दृश्य पाएं।'
        : 'Get an indicative view of property appreciation potential using available location, connectivity, development and market indicators.',
      cta: lang === 'hi' ? 'क्षमता का अनुमान लगाएं' : 'Estimate Potential',
      icon: TrendingUp
    },
    {
      title: lang === 'hi' ? 'प्रॉपर्टी लोकेशन एक्सप्लोरर' : 'Property Location Explorer',
      desc: lang === 'hi'
        ? 'प्रॉपर्टी लोकेशन और आस-पास के क्षेत्र का पता लगाएं।'
        : 'Explore the property location and surrounding area.',
      cta: lang === 'hi' ? 'लोकेशन देखें' : 'Explore Location',
      icon: MapPin
    }
  ];

  return (
    <section id="free-tools" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full text-xs font-medium text-emerald-700 mb-4">
            <CheckCircle className="w-3.5 h-3.5" />
            {lang === 'hi' ? '100% मुफ्त' : '100% Free'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {lang === 'hi' ? 'मुफ्त प्रॉपर्टी टूल्स' : 'Free Property Tools'}
          </h2>
          <p className="text-lg text-slate-600">
            {lang === 'hi' ? 'बुनियादी बातें खुद चेक करें — मुफ्त।' : 'Check the basics yourself — free.'}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 border border-slate-100 hover:border-navy/20 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center mb-4 group-hover:bg-navy/10 transition-colors">
                <tool.icon className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy mb-2">{tool.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{tool.desc}</p>
              <a href="#search" className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-navy-light transition-colors">
                {tool.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PROPERTY INTELLIGENCE REPORT
// ============================================================
function PropertyIntelligenceReport({ lang }: { lang: Lang }) {
  const features = [
    { title: lang === 'hi' ? 'सरकारी भूमि अभिलेख विश्लेषण' : 'Government Land Record Analysis', icon: FileText },
    { title: lang === 'hi' ? 'मालिकाना हक और क्षेत्र विश्लेषण' : 'Ownership & Area Analysis', icon: Users },
    { title: lang === 'hi' ? 'म्यूटेशन और स्थिति' : 'Mutation & Status', icon: RefreshCw },
    { title: lang === 'hi' ? 'भूमि और उपयोग जानकारी' : 'Land & Usage Information', icon: MapPin },
    { title: lang === 'hi' ? 'दस्तावेज़ स्थिरता' : 'Document Consistency', icon: FileCheck },
    { title: lang === 'hi' ? 'लोकेशन इंटेलिजेंस' : 'Location Intelligence', icon: MapPin },
    { title: lang === 'hi' ? 'भविष्य सराहकरण क्षमता' : 'Future Appreciation Potential', icon: TrendingUp },
    { title: lang === 'hi' ? 'प्रॉपर्टी रिस्क इंडिकेटर्स' : 'Property Risk Indicators', icon: Shield },
    { title: lang === 'hi' ? 'विस्तृत PDF रिपोर्ट' : 'Detailed PDF Report', icon: BookOpen }
  ];

  return (
    <section id="property-report" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {lang === 'hi' ? 'बुनियादी प्रॉपर्टी रिकॉर्ड से आगे बढ़ें।' : 'Go Beyond the Basic Property Record.'}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {lang === 'hi'
              ? 'एक विस्तृत प्रॉपर्टी इंटेलिजेंस रिपोर्ट जो आपको बड़ा प्रॉपर्टी फैसला लेने से पहले आवश्यक जानकारी को एक साथ लाती है।'
              : 'A detailed property intelligence report that brings together the information you need before making a major property decision.'}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl border border-slate-100 hover:border-navy/20 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-4 group-hover:bg-navy/10 transition-colors">
                <feature.icon className="w-5 h-5 text-navy" />
              </div>
              <h3 className="font-semibold text-navy">{feature.title}</h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a href="#search" className="inline-flex items-center gap-2 px-8 py-4 bg-navy text-white rounded-lg font-medium hover:bg-navy-light transition-colors shadow-lg shadow-navy/20">
            {lang === 'hi' ? 'मेरी प्रॉपर्टी रिपोर्ट पाएं' : 'Get My Property Report'}
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// REPORT PREVIEW
// ============================================================
function ReportPreview({ lang }: { lang: Lang }) {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {lang === 'hi' ? 'रिपोर्ट प्रीव्यू' : 'Report Preview'}
          </h2>
          <p className="text-lg text-slate-600">
            {lang === 'hi' ? 'देखें कि आपकी प्रॉपर्टी इंटेलिजेंस रिपोर्ट कैसी दिखेगी।' : 'See what your Property Intelligence Report will look like.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Report Header */}
            <div className="bg-navy text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                    {lang === 'hi' ? 'प्रॉपर्टी इंटेलिजेंस रिपोर्ट' : 'PROPERTY INTELLIGENCE REPORT'}
                  </p>
                  <h3 className="text-xl font-bold">
                    {lang === 'hi' ? 'प्रॉपर्टी अवलोकन' : 'Property Overview'}
                  </h3>
                </div>
                <div className="text-right text-sm text-white/60">
                  <p>Report #BS-2024-001</p>
                  <p>Generated: Today</p>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-6 space-y-6">
              {/* Property Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {lang === 'hi' ? 'प्रॉपर्टी विवरण' : 'Property Details'}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'लोकेशन' : 'Location'}</p>
                    <p className="font-medium text-navy">Amroha, UP</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'क्षेत्र' : 'Area'}</p>
                    <p className="font-medium text-navy">0.105 ha</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'गाटा' : 'Gata'}</p>
                    <p className="font-medium text-navy">123</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{lang === 'hi' ? 'मालिक' : 'Ownership'}</p>
                    <p className="font-medium text-navy">Verified</p>
                  </div>
                </div>
              </div>

              {/* Risk Indicators */}
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {lang === 'hi' ? 'रिस्क इंडिकेटर्स' : 'Risk Indicators'}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm font-medium text-navy">{lang === 'hi' ? 'मालिकाना हक' : 'Ownership'}</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                      {lang === 'hi' ? 'स्पष्ट' : 'Clear'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm font-medium text-navy">{lang === 'hi' ? 'दस्तावेज़' : 'Documents'}</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                      {lang === 'hi' ? 'मेल खाता है' : 'Matches'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <span className="text-sm font-medium text-navy">{lang === 'hi' ? 'म्यूटेशन' : 'Mutation'}</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                      {lang === 'hi' ? 'समीक्षा आवश्यक' : 'Review Needed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Appreciation Potential */}
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  {lang === 'hi' ? 'सराहकरण क्षमता' : 'Appreciation Potential'}
                </h4>
                <div className="p-4 bg-navy/5 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-navy">{lang === 'hi' ? 'संकेतक' : 'Indicative'}</span>
                    <span className="text-lg font-bold text-navy">
                      {lang === 'hi' ? 'मध्यम' : 'MODERATE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {lang === 'hi' 
                      ? 'उपलब्ध संकेतकों के आधार पर। यह गारंटीड भविष्य रिटर्न नहीं है।'
                      : 'Based on available indicators. This is not a guaranteed future return.'}
                  </p>
                </div>
              </div>

              {/* Expert Recommendation */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-900 mb-1">
                      {lang === 'hi' ? 'विशेषज्ञ सिफारिश' : 'Expert Recommendation'}
                    </p>
                    <p className="text-xs text-emerald-700">
                      {lang === 'hi' 
                        ? 'पेशेवर समीक्षा की सिफारिश की जाती है'
                        : 'Professional review recommended'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// APPRECIATION INTELLIGENCE
// ============================================================
function AppreciationIntelligence({ lang }: { lang: Lang }) {
  const factors = [
    { label: lang === 'hi' ? 'लोकेशन' : 'Location', value: 'High' },
    { label: lang === 'hi' ? 'कनेक्टिविटी' : 'Connectivity', value: 'Moderate' },
    { label: lang === 'hi' ? 'इन्फ्रास्ट्रक्चर' : 'Infrastructure', value: 'Growing' },
    { label: lang === 'hi' ? 'विकास गतिविधि' : 'Development Activity', value: 'Active' }
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {lang === 'hi' ? 'भविष्य सराहकरण इंटेलिजेंस' : 'Future Appreciation Intelligence'}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {lang === 'hi'
              ? 'उपलब्ध लोकेशन, कनेक्टिविटी, विकास और बाजार संकेतकों का उपयोग करके प्रॉपर्टी सराहकरण क्षमता का संकेतक दृश्य पाएं।'
              : 'Get an indicative view of property appreciation potential using available location, connectivity, development and market indicators.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'hi' ? 'सराहकरण क्षमता' : 'Appreciation Potential'}
              </p>
              <p className="text-4xl font-bold text-navy mb-2">
                {lang === 'hi' ? 'मध्यम' : 'MODERATE'}
              </p>
              <p className="text-xs text-slate-500">
                {lang === 'hi' 
                  ? 'उपलब्ध संकेतकों के आधार पर। यह गारंटीड भविष्य रिटर्न नहीं है।'
                  : 'Based on available indicators. This is not a guaranteed future return.'}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-navy uppercase tracking-wider">
                {lang === 'hi' ? 'मुख्य कारक' : 'Key Factors'}
              </h4>
              {factors.map((factor, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-sm font-medium text-navy">{factor.label}</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    factor.value === 'High' ? 'bg-emerald-100 text-emerald-700' :
                    factor.value === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {factor.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  {lang === 'hi'
                    ? 'यह विश्लेषण उपलब्ध डेटा पर आधारित है और वित्तीय सलाह नहीं है। वास्तविक सराहकरण बाजार स्थितियों, सरकारी नीतियों और अन्य कारकों के आधार पर भिन्न हो सकती है।'
                    : 'This analysis is based on available data and is not financial advice. Actual appreciation may vary based on market conditions, government policies, and other factors.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// EXPERT CONSULTATION
// ============================================================
function ExpertConsultation({ lang }: { lang: Lang }) {
  const experts = [
    {
      title: lang === 'hi' ? 'प्रॉपर्टी कानूनी विशेषज्ञ' : 'Property Legal Experts',
      desc: lang === 'hi'
        ? 'प्रॉपर्टी दस्तावेज़ों, मालिकाना हक संबंधी चिंताओं, टाइटल संबंधी प्रश्नों और कानूनी जोखिमों पर पेशेवर मार्गदर्शन पाएं।'
        : 'Get professional guidance on property documents, ownership-related concerns, title-related questions and legal risks.',
      cta: lang === 'hi' ? 'कानूनी विशेषज्ञ से परामर्श करें' : 'Consult a Legal Expert',
      icon: Scale
    },
    {
      title: lang === 'hi' ? 'प्रॉपर्टी और निर्माण विशेषज्ञ' : 'Property & Construction Experts',
      desc: lang === 'hi'
        ? 'निर्माण, भूमि-उपयोग, प्रॉपर्टी विकास और संबंधित विचारों पर मार्गदर्शन पाएं।'
        : 'Get guidance on construction, land-use, property development and related considerations.',
      cta: lang === 'hi' ? 'विशेषज्ञ से बात करें' : 'Talk to an Expert',
      icon: Building2
    },
    {
      title: lang === 'hi' ? 'प्रॉपर्टी निवेश विशेषज्ञ' : 'Property Investment Experts',
      desc: lang === 'hi'
        ? 'लोकेशन क्षमता, निवेश विचार, बाजार कारकों और सराहकरण संकेतकों पर चर्चा करें।'
        : 'Discuss location potential, investment considerations, market factors and appreciation indicators.',
      cta: lang === 'hi' ? 'निवेश मार्गदर्शन पाएं' : 'Get Investment Guidance',
      icon: TrendingUp
    }
  ];

  return (
    <section id="expert-consultation" className="py-20 md:py-28 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === 'hi' ? 'विशेषज्ञ मार्गदर्शन चाहिए?' : 'Need Expert Guidance?'}
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            {lang === 'hi'
              ? 'कुछ प्रॉपर्टी फैसलों को डेटा से अधिक की आवश्यकता होती है। बड़ा फैसला लेने से पहले उद्योग विशेषज्ञों से मार्गदर्शन पाएं।'
              : 'Some property decisions need more than data. Get guidance from industry experts before you make a major decision.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {experts.map((expert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <expert.icon className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{expert.title}</h3>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">{expert.desc}</p>
              <button className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                {expert.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
            {lang === 'hi' ? 'उद्योग विशेषज्ञ से बात करें' : 'Talk to an Industry Expert'}
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-white/50 mt-4">
            {lang === 'hi' ? 'विशेषज्ञ जल्द ही उपलब्ध होंगे' : 'Experts coming soon'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// TRUST & TRANSPARENCY
// ============================================================
function TrustTransparency({ lang }: { lang: Lang }) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {lang === 'hi' ? 'जानकारी जिसे आप समझ सकते हैं। फैसले जो आप ले सकते हैं।' : 'Information You Can Understand. Decisions You Can Make.'}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {lang === 'hi'
              ? 'भूमि साथी उपलब्ध प्रॉपर्टी जानकारी को आसान समझ format में एक साथ लाता है।'
              : 'Bhumi Saathi brings available property information together into an easier-to-understand format.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-navy mb-1">
                  {lang === 'hi' ? 'स्रोत संदर्भ' : 'Source References'}
                </p>
                <p className="text-sm text-slate-600">
                  {lang === 'hi' ? 'हर जानकारी के लिए स्पष्ट स्रोत' : 'Clear source for every piece of information'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-navy mb-1">
                  {lang === 'hi' ? 'रिपोर्ट टाइमस्टैम्प' : 'Report Timestamp'}
                </p>
                <p className="text-sm text-slate-600">
                  {lang === 'hi' ? 'जानिए जानकारी कब अपडेट की गई' : 'Know when information was updated'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-navy mb-1">
                  {lang === 'hi' ? 'डेटा उपलब्धता संकेतक' : 'Data Availability Indicators'}
                </p>
                <p className="text-sm text-slate-600">
                  {lang === 'hi' ? 'जानिए कौन सी जानकारी उपलब्ध है और कौन सी नहीं' : 'Know which information is available and which is not'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-navy mb-1">
                  {lang === 'hi' ? 'सत्यापन स्थिति' : 'Verification Status'}
                </p>
                <p className="text-sm text-slate-600">
                  {lang === 'hi' ? 'स्पष्ट स्थिति हर जानकारी के लिए' : 'Clear status for every piece of information'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-navy mb-1">
                  {lang === 'hi' ? 'स्पष्ट अस्वीकरण' : 'Clear Disclaimers'}
                </p>
                <p className="text-sm text-slate-600">
                  {lang === 'hi' ? 'सीमाओं और सिफारिशों के बारे में पारदर्शी' : 'Transparent about limitations and recommendations'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-3xl mx-auto p-6 bg-slate-50 rounded-xl border border-slate-200"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-navy mb-2">
                {lang === 'hi' ? 'महत्वपूर्ण सूचना' : 'Important Notice'}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === 'hi'
                  ? 'भूमि साथी सरकारी रिकॉर्ड्स, प्रमाणित दस्तावेज़ों या पेशेवर कानूनी सलाह का विकल्प नहीं है। जहां पेशेवर कानूनी मार्गदर्शन की आवश्यकता होती है, वहां योग्य कानूनी पेशेवर से परामर्श करें।'
                  : 'Bhumi Saathi does not replace government records, certified documents or professional legal advice. Where professional legal guidance is required, consult a qualified legal professional.'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// FINAL CTA
// ============================================================
function FinalCTA({ lang }: { lang: Lang }) {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-navy to-navy-light text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === 'hi' ? 'निवेश से पहले, अपनी प्रॉपर्टी को जानें।' : 'Before You Invest, Know Your Property.'}
          </h2>
          <p className="text-lg text-white/70 mb-8">
            {lang === 'hi'
              ? 'हमारे मुफ्त टूल्स से शुरू करें या पूरी प्रॉपर्टी इंटेलिजेंस रिपोर्ट पाएं।'
              : 'Start with our free tools or get a complete Property Intelligence Report.'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <a href="#free-tools" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy rounded-lg font-medium hover:bg-slate-100 transition-colors">
              {lang === 'hi' ? 'मुफ्त टूल्स देखें' : 'Explore Free Tools'}
            </a>
            <a href="#search" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              {lang === 'hi' ? 'प्रॉपर्टी रिपोर्ट पाएं' : 'Get Property Report'}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <a href="#expert-consultation" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            {lang === 'hi' ? 'उद्योग विशेषज्ञ से बात करें' : 'Talk to an Industry Expert'}
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// TRUST STRIP
// ============================================================
function TrustStrip({ lang }: { lang: Lang }) {
  const items = [
    { icon: FileText, text: lang === 'hi' ? 'प्रॉपर्टी इंटेलिजेंस' : 'Property Intelligence' },
    { icon: MapPin, text: lang === 'hi' ? 'फिजिकल वेरिफिकेशन' : 'Physical Verification' },
    { icon: Users, text: lang === 'hi' ? 'इंडस्ट्री विशेषज्ञ' : 'Industry Experts' },
    { icon: Shield, text: lang === 'hi' ? 'डील सपोर्ट' : 'Deal Support' }
  ];

  return (
    <section className="py-8 bg-navy/5 border-y border-navy/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 justify-center"
            >
              <item.icon className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-navy">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SERVICE PLANS
// ============================================================
function ServicePlans({ lang }: { lang: Lang }) {
  const plans = [
    {
      name: lang === 'hi' ? 'मुफ्त टूल्स' : 'Free Tools',
      price: '₹0',
      badge: null,
      tagline: lang === 'hi' ? 'खुद चेक करें' : 'Check it yourself',
      features: lang === 'hi' ? [
        'बुनियादी प्रॉपर्टी टूल्स',
        'भूमि अभिलेख खोज',
        'क्षेत्र जानकारी',
        'लोकेशन एक्सप्लोरर',
        'सराहकरण अनुमानक'
      ] : [
        'Basic property tools',
        'Land record search',
        'Area information',
        'Location explorer',
        'Appreciation estimator'
      ],
      cta: lang === 'hi' ? 'मुफ्त टूल्स देखें' : 'Explore Free Tools',
      href: '#free-tools',
      style: 'neutral'
    },
    {
      name: lang === 'hi' ? 'प्रॉपर्टी इंटेलिजेंस' : 'Property Intelligence',
      price: '₹999',
      badge: lang === 'hi' ? 'सबसे लोकप्रिय' : 'MOST POPULAR',
      tagline: lang === 'hi' ? 'समझें' : 'Understand it',
      features: lang === 'hi' ? [
        'विस्तृत रिपोर्ट',
        'भूमि अभिलेख विश्लेषण',
        'मालिकाना हक विश्लेषण',
        'क्षेत्र विश्लेषण',
        'दस्तावेज़ स्थिरता',
        'लोकेशन इंटेलिजेंस',
        'सराहकरण क्षमता',
        'रिस्क इंडिकेटर्स',
        'PDF रिपोर्ट'
      ] : [
        'Detailed report',
        'Land record analysis',
        'Ownership analysis',
        'Area analysis',
        'Document consistency',
        'Location intelligence',
        'Appreciation potential',
        'Risk indicators',
        'PDF report'
      ],
      cta: lang === 'hi' ? 'प्रॉपर्टी रिपोर्ट पाएं' : 'Get Property Report',
      href: '#property-report',
      style: 'primary'
    },
    {
      name: lang === 'hi' ? 'फिजिकल वेरिफिकेशन' : 'Physical Verification',
      price: '₹2,999',
      badge: null,
      tagline: lang === 'hi' ? 'वेरिफाई करें' : 'Verify it',
      features: lang === 'hi' ? [
        'प्रॉपर्टी इंटेलिजेंस की सब चीज़ें',
        'फिजिकल साइट विज़िट',
        'ग्राउंड ऑब्ज़र्वेशंस',
        'फोटो (जहां लागू हो)',
        'लोकेशन वेरिफिकेशन',
        'फिजिकल वेरिफिकेशन रिपोर्ट',
        'वेरिफिकेशन समरी'
      ] : [
        'Everything in Property Intelligence',
        'Physical site visit',
        'Ground observations',
        'Photos where applicable',
        'Location verification',
        'Physical verification report',
        'Verification summary'
      ],
      cta: lang === 'hi' ? 'वेरिफिकेशन रिक्वेस्ट करें' : 'Request Verification',
      href: '#physical-verification',
      style: 'secondary'
    },
    {
      name: lang === 'hi' ? 'फुल डील सपोर्ट' : 'Full Deal Support',
      price: '₹9,999+',
      badge: 'END-TO-END',
      tagline: lang === 'hi' ? 'डील पूरी करें' : 'Complete the deal',
      features: lang === 'hi' ? [
        'प्रॉपर्टी इंटेलिजेंस + फिजिकल वेरिफिकेशन',
        'डेडिकेटेड रिप्रेजेंटेटिव',
        'दस्तावेज़ कोऑर्डिनेशन',
        'विशेषज्ञ कोऑर्डिनेशन',
        'नेगोशिएशन सपोर्ट',
        'ट्रांजेक्शन कोऑर्डिनेशन',
        'रजिस्ट्रेशन-स्टेज असिस्टेंस',
        'ऑन-ग्राउंड सपोर्ट',
        'डील प्रोग्रेस सपोर्ट'
      ] : [
        'Property Intelligence + Physical Verification',
        'Dedicated representative',
        'Document coordination',
        'Expert coordination',
        'Negotiation support',
        'Transaction coordination',
        'Registration-stage assistance',
        'On-ground support',
        'Deal progress support'
      ],
      cta: lang === 'hi' ? 'फुल डील सपोर्ट पाएं' : 'Get Full Deal Support',
      href: '#full-deal-support',
      style: 'premium'
    }
  ];

  const getCardStyle = (style: string) => {
    switch (style) {
      case 'primary':
        return 'bg-navy text-white border-navy shadow-xl scale-105 z-10';
      case 'secondary':
        return 'bg-emerald-50 border-emerald-200';
      case 'premium':
        return 'bg-gradient-to-br from-navy to-navy-light text-white border-navy shadow-xl';
      default:
        return 'bg-white border-slate-200';
    }
  };

  const getBadgeStyle = (style: string) => {
    switch (style) {
      case 'primary':
        return 'bg-emerald-500 text-white';
      case 'premium':
        return 'bg-accent text-navy';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <section id="service-plans" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            {lang === 'hi' ? 'अपनी ज़रूरत का सपोर्ट चुनें' : 'Choose the Support You Need'}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {lang === 'hi'
              ? 'खुद चेक करने से लेकर डील पूरी करने तक सपोर्ट।'
              : 'From checking it yourself to having someone support you through the deal.'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-6 border-2 ${getCardStyle(plan.style)} relative`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${getBadgeStyle(plan.style)}`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <p className={`text-xs uppercase tracking-wider mb-2 ${plan.style === 'neutral' ? 'text-slate-500' : 'text-white/60'}`}>
                  {plan.tagline}
                </p>
                <h3 className={`text-xl font-bold mb-2 ${plan.style === 'neutral' ? 'text-navy' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <p className={`text-3xl font-bold ${plan.style === 'neutral' ? 'text-navy' : 'text-white'}`}>
                  {plan.price}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.style === 'neutral' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    <span className={plan.style === 'neutral' ? 'text-slate-700' : 'text-white/90'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  plan.style === 'neutral'
                    ? 'bg-navy/5 text-navy hover:bg-navy/10'
                    : plan.style === 'primary'
                    ? 'bg-white text-navy hover:bg-slate-100'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PHYSICAL VERIFICATION
// ============================================================
function PhysicalVerification({ lang }: { lang: Lang }) {
  const checklist = [
    lang === 'hi' ? 'लोकेशन' : 'Location',
    lang === 'hi' ? 'एक्सेस रोड' : 'Access road',
    lang === 'hi' ? 'दिखाई दे रही बाउंड्रीज' : 'Visible boundaries',
    lang === 'hi' ? 'आस-पास का विकास' : 'Surrounding development',
    lang === 'hi' ? 'फिजिकल कंडीशन' : 'Physical condition',
    lang === 'hi' ? 'दिखाई दे रहा कब्ज़ा' : 'Visible occupancy',
    lang === 'hi' ? 'पहचान चिन्ह/साइनेज' : 'Signage/identification',
    lang === 'hi' ? 'बुनियादी प्रॉपर्टी विशेषताएं' : 'Basic property characteristics'
  ];

  return (
    <section id="physical-verification" className="py-20 md:py-28 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full text-xs font-medium text-emerald-700 mb-4">
              <MapPin className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'फिजिकल वेरिफिकेशन' : 'PHYSICAL VERIFICATION'}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              {lang === 'hi' ? 'जो लोग ग्राउंड पर किसी को चाहते हैं।' : 'For buyers who want someone on the ground.'}
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              {lang === 'hi'
                ? 'डिजिटल इंटेलिजेंस और रियल-वर्ल्ड वेरिफिकेशन के बीच का पुल।'
                : 'The bridge between digital intelligence and real-world verification.'}
            </p>

            <ul className="space-y-3 mb-6">
              {[
                lang === 'hi' ? 'प्रॉपर्टी इंटेलिजेंस रिपोर्ट' : 'Property Intelligence Report',
                lang === 'hi' ? 'फिजिकल साइट विज़िट' : 'Physical site visit',
                lang === 'hi' ? 'लोकेशन कन्फर्मेशन' : 'Location confirmation',
                lang === 'hi' ? 'बुनियादी साइट ऑब्ज़र्वेशंस' : 'Basic site observations',
                lang === 'hi' ? 'फोटोग्राफ्स (जहां लागू हो)' : 'Photographs where applicable',
                lang === 'hi' ? 'ग्राउंड-लेवल ऑब्ज़र्वेशंस' : 'Ground-level observations',
                lang === 'hi' ? 'बुनियादी प्रॉपर्टी डिटेल्स क्रॉस-चेक' : 'Basic property detail cross-check',
                lang === 'hi' ? 'वेरिफिकेशन समरी' : 'Verification summary',
                lang === 'hi' ? 'फिजिकल वेरिफिकेशन रिपोर्ट' : 'Physical verification report'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <a href="#service-plans" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
              {lang === 'hi' ? 'वेरिफिकेशन रिक्वेस्ट करें' : 'Request Verification'}
              <ArrowRight className="w-4 h-4" />
            </a>

            <p className="text-xs text-slate-500 mt-4">
              {lang === 'hi' 
                ? 'वर्तमान में सेलेक्टेड लोकेशंस में उपलब्ध।'
                : 'Currently available in selected locations.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-navy mb-4">
              {lang === 'hi' ? 'फील्ड चेकलिस्ट' : 'Field Checklist'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {checklist.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-navy">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  {lang === 'hi'
                    ? 'फिजिकल वेरिफिकेशन देखे जा सकने वाले साइट कंडीशंस की पुष्टि करता है और लीगल टाइटल वेरिफिकेशन का विकल्प नहीं है।'
                    : 'Physical verification confirms observable site conditions and does not replace legal title verification.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FULL DEAL SUPPORT
// ============================================================
function FullDealSupport({ lang }: { lang: Lang }) {
  const journey = [
    { icon: Search, title: lang === 'hi' ? 'प्रॉपर्टी सर्च' : 'Property Search', desc: lang === 'hi' ? 'सही प्रॉपर्टी खोजें' : 'Find the right property' },
    { icon: FileText, title: lang === 'hi' ? 'प्रॉपर्टी शॉर्टलिस्ट' : 'Property Shortlist', desc: lang === 'hi' ? 'ऑप्शंस को कम करें' : 'Narrow down options' },
    { icon: Shield, title: lang === 'hi' ? 'प्रॉपर्टी इंटेलिजेंस' : 'Property Intelligence', desc: lang === 'hi' ? 'प्रॉपर्टी को समझें' : 'Understand the property' },
    { icon: MapPin, title: lang === 'hi' ? 'फिजिकल वेरिफिकेशन' : 'Physical Verification', desc: lang === 'hi' ? 'ग्राउंड पर वेरिफाई करें' : 'Verify on the ground' },
    { icon: FileCheck, title: lang === 'hi' ? 'दस्तावेज़ रिव्यू' : 'Document Review', desc: lang === 'hi' ? 'दस्तावेज़ों की समीक्षा' : 'Review documents' },
    { icon: Scale, title: lang === 'hi' ? 'लीगल कोऑर्डिनेशन' : 'Legal Coordination', desc: lang === 'hi' ? 'कानूनी पहलुओं को हैंडल करें' : 'Handle legal aspects' },
    { icon: Users, title: lang === 'hi' ? 'नेगोशिएशन सपोर्ट' : 'Negotiation Support', desc: lang === 'hi' ? 'बेहतर डील पाएं' : 'Get better deal' },
    { icon: BookOpen, title: lang === 'hi' ? 'एग्रीमेंट / डॉक्यूमेंटेशन' : 'Agreement / Documentation', desc: lang === 'hi' ? 'दस्तावेज़ तैयार करें' : 'Prepare documents' },
    { icon: CheckCircle, title: lang === 'hi' ? 'रजिस्ट्रेशन प्रिपरेशन' : 'Registration Preparation', desc: lang === 'hi' ? 'रजिस्ट्रेशन के लिए तैयार' : 'Prepare for registration' },
    { icon: Shield, title: lang === 'hi' ? 'रजिस्ट्रेशन-स्टेज असिस्टेंस' : 'Registration-Stage Assistance', desc: lang === 'hi' ? 'रजिस्ट्रेशन में सहायता' : 'Assistance at registration' },
    { icon: CheckCircle, title: lang === 'hi' ? 'डील पूरी हुई' : 'Deal Completed', desc: lang === 'hi' ? 'सफलतापूर्वक पूरा हुआ' : 'Successfully completed' }
  ];

  return (
    <section id="full-deal-support" className="py-20 md:py-28 bg-gradient-to-br from-navy to-navy-light text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-full text-xs font-medium text-accent mb-4">
            <span>END-TO-END</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {lang === 'hi' ? 'फुल डील सपोर्ट' : 'Full Deal Support'}
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-2">
            {lang === 'hi' ? 'प्रॉपर्टी सर्च से रजिस्ट्रेशन तक।' : 'From Property Search to Registration.'}
          </p>
          <p className="text-base text-white/60 max-w-2xl mx-auto">
            {lang === 'hi'
              ? 'प्रॉपर्टी ट्रांजेक्शन को अकेले नेविगेट नहीं करना चाहते? अपनी डील के प्रमुख चरणों में समर्पित सपोर्ट पाएं।'
              : "Don't want to navigate the property transaction alone? Get dedicated support throughout the major stages of your deal."}
          </p>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/20 hidden md:block" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {journey.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-1">Step {i + 1}</p>
                    <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-xs text-white/60">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Dedicated Representative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/10 rounded-2xl p-8 border border-white/20 backdrop-blur-sm mb-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              {lang === 'hi' ? 'एक व्यक्ति। आपकी प्रॉपर्टी जर्नी।' : 'One Person. Your Property Journey.'}
            </h3>
            <p className="text-white/70 max-w-2xl mx-auto">
              {lang === 'hi'
                ? 'अपने आप को कई लोगों के साथ कोऑर्डिनेट करने के बजाय, एक समर्पित भूमि साथी रिप्रेजेंटेटिव आपकी प्रॉपर्टी ट्रांजेक्शन के प्रमुख चरणों को कोऑर्डिनेट करने में मदद करता है।'
                : 'Instead of coordinating with multiple people yourself, a dedicated Bhumi Saathi representative helps coordinate the major stages of your property transaction.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Users, title: lang === 'hi' ? 'आपका रिप्रेजेंटेटिव' : 'Your Representative' },
              { icon: CheckCircle, title: lang === 'hi' ? 'कोऑर्डिनेट करता है' : 'Coordinates' },
              { icon: Shield, title: lang === 'hi' ? 'सभी स्टेज पर' : 'All Stages' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <item.icon className="w-6 h-6 text-emerald-400" />
                <span className="font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a href="#service-plans" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-navy rounded-lg font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
            {lang === 'hi' ? 'फुल डील सपोर्ट पाएं' : 'Get Full Deal Support'}
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <Hero lang={lang} />
      <TrustStrip lang={lang} />
      <WhyBhumiSaathi lang={lang} />
      <FreeTools lang={lang} />
      <PropertyIntelligenceReport lang={lang} />
      <ReportPreview lang={lang} />
      <PropertySearch lang={lang} />
      <HowItWorks lang={lang} />
      <AppreciationIntelligence lang={lang} />
      <ServicePlans lang={lang} />
      <PhysicalVerification lang={lang} />
      <FullDealSupport lang={lang} />
      <ExpertConsultation lang={lang} />
      <Features lang={lang} />
      <DocumentVerification lang={lang} />
      <TrustSection lang={lang} />
      <TrustTransparency lang={lang} />
      <FinalCTA lang={lang} />
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
              <Route path="/booking" element={<Booking />} />
            </Routes>
            <Footer lang={lang} />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
