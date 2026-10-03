import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND, type Lang } from './config';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import { ProblemSection, HowItWorks, WhyUs, Testimonials } from './components/Sections';
import Pricing from './components/Pricing';
import SampleReport from './components/SampleReport';
import FreeTools from './components/FreeTools';
import { B2BSection, FAQ } from './components/B2BAndFAQ';
import Footer from './components/Footer';
import TrackStatus from './components/TrackStatus';
import AdminPanel from './components/AdminPanel';
import LegalPage from './components/LegalPage';
import GuidePage from './components/GuidePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRequestDetail from './pages/admin/AdminRequestDetail';
import { MessageCircle, FileText } from 'lucide-react';
import { useReducedMotion } from './hooks/useAnimations';
import { ErrorBoundary } from './components/ErrorBoundary';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function GuidePageWrapper({ lang }: { lang: Lang }) {
  const { slug } = useParams<{ slug: string }>();
  return <GuidePage lang={lang} slug={slug} />;
}

function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <Hero lang={lang} />
      <ProblemSection lang={lang} />
      <HowItWorks lang={lang} />
      <Pricing lang={lang} />
      <SampleReport lang={lang} />
      <FreeTools lang={lang} />
      <B2BSection lang={lang} />
      <WhyUs lang={lang} />
      <Testimonials lang={lang} />
      <FAQ lang={lang} />
    </>
  );
}

function StickyBottomBar({ lang }: { lang: Lang }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  
  const hiddenPaths = ['/book', '/admin'];
  const hiddenPrefixes = ['/privacy', '/terms', '/refund', '/disclaimer'];
  const isHidden = hiddenPaths.includes(location.pathname) || hiddenPrefixes.some(p => location.pathname.startsWith(p));
  if (isHidden) return null;

  return (
    <motion.div
      initial={reducedMotion ? {} : { y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky-bottom-bar"
    >
      <a
        href={`https://wa.me/${BRAND.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-all active:scale-95"
      >
        <MessageCircle size={16} />
        WhatsApp
      </a>
      <Link
        to="/book"
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-light transition-all active:scale-95"
      >
        <FileText size={16} />
        {lang === 'hi' ? 'रिपोर्ट बुक' : 'Book Report'}
      </Link>
    </motion.div>
  );
}

function App() {
  const [lang, setLang] = useState<Lang>('hi');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.setAttribute('lang', lang);
  }, [lang]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-bg">
            <Header lang={lang} setLang={setLang} />
            
            <main>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage lang={lang} />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/book" element={<Booking />} />
                  <Route path="/track" element={<TrackStatus lang={lang} />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/requests/:id" element={<AdminRequestDetail />} />
                  <Route path="/privacy" element={<LegalPage lang={lang} type="privacy" />} />
                  <Route path="/terms" element={<LegalPage lang={lang} type="terms" />} />
                  <Route path="/refund" element={<LegalPage lang={lang} type="refund" />} />
                  <Route path="/disclaimer" element={<LegalPage lang={lang} type="disclaimer" />} />
                  <Route path="/guides" element={<GuidePage lang={lang} />} />
                  <Route path="/guides/:slug" element={<GuidePageWrapper lang={lang} />} />
                </Routes>
              </AnimatePresence>
            </main>

            <Footer lang={lang} />
            <StickyBottomBar lang={lang} />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
