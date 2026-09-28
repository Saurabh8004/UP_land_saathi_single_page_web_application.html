import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BRAND, t, DISTRICTS, PACKAGES, type Lang } from '../config';
import { Check, Upload, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';

interface BookingFlowProps {
  lang: Lang;
}

export default function BookingFlow({ lang }: BookingFlowProps) {
  const tr = t[lang];
  const [searchParams] = useSearchParams();
  const preselectedPackage = searchParams.get('package') || '';
  
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [requestId, setRequestId] = useState('');
  
  // Form data
  const [packageId, setPackageId] = useState(preselectedPackage);
  const [propertyData, setPropertyData] = useState({
    district: '', tehsil: '', village: '', gata: '', area: '', ownerName: ''
  });
  const [contactData, setContactData] = useState({
    name: '', mobile: '', email: '', whatsappOptIn: true, consent: false
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = tr.booking.steps;

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1 && !packageId) {
      newErrors.package = tr.common.required;
    }
    if (step === 2) {
      if (!propertyData.district) newErrors.district = tr.common.required;
      if (!propertyData.gata) newErrors.gata = tr.common.required;
    }
    if (step === 3) {
      // Files are optional
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          newErrors.files = lang === 'hi' ? 'फाइल 10 MB से बड़ी है' : 'File exceeds 10 MB';
          break;
        }
      }
    }
    if (step === 4) {
      if (!contactData.name) newErrors.name = tr.common.required;
      if (!contactData.mobile || !/^[0-9]{10}$/.test(contactData.mobile)) {
        newErrors.mobile = tr.common.invalidMobile;
      }
      if (!contactData.consent) {
        newErrors.consent = lang === 'hi' ? 'कंसेंट ज़रूरी है' : 'Consent is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 5) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    // TODO: Send to backend API, create Razorpay order
    const id = `ZS-${Date.now().toString(36).toUpperCase()}`;
    setRequestId(id);
    setCompleted(true);
    
    // TODO: Send WhatsApp confirmation
    // TODO: Send email confirmation
    console.log('Booking submitted:', { packageId, propertyData, contactData, files: files.map(f => f.name) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate mb-2">{tr.booking.thankYou}</h2>
          <div className="bg-bg rounded-xl p-4 mt-6 space-y-3 text-left">
            <div className="flex justify-between">
              <span className="text-sm text-slate-light">{tr.booking.requestId}:</span>
              <span className="font-bold text-primary">{requestId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-light">{tr.booking.delivery}:</span>
              <span className="font-medium text-slate">
                {packageId === 'quick-check' ? '24 hrs' : packageId === 'verified-report' ? '48-72 hrs' : 'Custom'}
              </span>
            </div>
          </div>
          <a
            href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hi, my request ID is ${requestId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={18} />
            {tr.booking.whatsappBtn}
          </a>
          <div className="mt-4">
            <Link to="/track" className="text-sm text-primary font-medium hover:underline">
              {tr.nav.track} →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i + 1 <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1 < step ? <Check size={14} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 ${i + 1 < step ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-light text-center mt-2">{steps[step - 1]}</p>
        </div>

        {/* Form content */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          {/* Step 1: Choose Package */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate mb-6">{tr.booking.steps[0]}</h2>
              <div className="space-y-3">
                {PACKAGES.map((pkg) => (
                  <label
                    key={pkg.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      packageId === pkg.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="package"
                      value={pkg.id}
                      checked={packageId === pkg.id}
                      onChange={(e) => setPackageId(e.target.value)}
                      className="w-5 h-5 text-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate">{pkg.id === 'quick-check' ? 'Quick Check' : pkg.id === 'verified-report' ? 'Verified Report' : 'Deal Support'}</span>
                        {pkg.popular && <span className="text-xs px-2 py-0.5 bg-accent text-slate rounded-full font-bold">Popular</span>}
                      </div>
                      <span className="text-sm text-slate-light">{pkg.delivery}</span>
                    </div>
                    <span className="font-bold text-primary">{lang === 'hi' ? pkg.priceHi : pkg.priceEn}</span>
                  </label>
                ))}
              </div>
              {errors.package && <p className="text-red-500 text-sm mt-2">{errors.package}</p>}
            </div>
          )}

          {/* Step 2: Property Details */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate mb-6">{tr.booking.steps[1]}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">{tr.booking.district} *</label>
                  <select
                    value={propertyData.district}
                    onChange={(e) => setPropertyData({ ...propertyData, district: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">—</option>
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">{tr.booking.tehsil}</label>
                    <input
                      type="text"
                      value={propertyData.tehsil}
                      onChange={(e) => setPropertyData({ ...propertyData, tehsil: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">{tr.booking.village}</label>
                    <input
                      type="text"
                      value={propertyData.village}
                      onChange={(e) => setPropertyData({ ...propertyData, village: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">{tr.booking.gata} *</label>
                    <input
                      type="text"
                      value={propertyData.gata}
                      onChange={(e) => setPropertyData({ ...propertyData, gata: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    {errors.gata && <p className="text-red-500 text-sm mt-1">{errors.gata}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate mb-1">{tr.booking.area}</label>
                    <input
                      type="text"
                      value={propertyData.area}
                      onChange={(e) => setPropertyData({ ...propertyData, area: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">{tr.booking.ownerName}</label>
                  <input
                    type="text"
                    value={propertyData.ownerName}
                    onChange={(e) => setPropertyData({ ...propertyData, ownerName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Upload Documents */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate mb-2">{tr.booking.steps[2]}</h2>
              <p className="text-sm text-slate-light mb-6">{tr.booking.uploadNote}</p>
              
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <Upload size={32} className="text-gray-400 mx-auto mb-3" />
                <label className="cursor-pointer">
                  <span className="text-primary font-medium hover:underline">
                    {lang === 'hi' ? 'फाइलें चुनें' : 'Choose files'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-light mt-2">PDF, JPG, PNG — Max 10 MB each</p>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <span className="text-sm text-slate truncate">{file.name}</span>
                      <button onClick={() => removeFile(i)} className="text-red-500 text-sm hover:underline">✕</button>
                    </div>
                  ))}
                </div>
              )}
              {errors.files && <p className="text-red-500 text-sm mt-2">{errors.files}</p>}
            </div>
          )}

          {/* Step 4: Contact Info */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-slate mb-6">{tr.booking.steps[3]}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">{tr.booking.name} *</label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">{tr.booking.mobile} *</label>
                  <input
                    type="tel"
                    value={contactData.mobile}
                    onChange={(e) => setContactData({ ...contactData, mobile: e.target.value })}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate mb-1">{tr.booking.email}</label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactData.whatsappOptIn}
                    onChange={(e) => setContactData({ ...contactData, whatsappOptIn: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate">{tr.booking.whatsapp}</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactData.consent}
                    onChange={(e) => setContactData({ ...contactData, consent: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                  />
                  <span className="text-sm text-slate-light">
                    {tr.booking.consent}
                    <Link to="/privacy" className="text-primary hover:underline ml-1">(Privacy Policy)</Link>
                  </span>
                </label>
                {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}
              </div>
            </div>
          )}

          {/* Step 5: Summary & Pay */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-slate mb-6">{tr.booking.steps[4]}</h2>
              
              {/* Summary */}
              <div className="bg-bg rounded-xl p-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-light">{tr.booking.package}:</span>
                  <span className="font-medium">{packageId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-light">{tr.booking.district}:</span>
                  <span className="font-medium">{propertyData.district}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-light">{tr.booking.gata}:</span>
                  <span className="font-medium">{propertyData.gata}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-light">{tr.booking.name}:</span>
                  <span className="font-medium">{contactData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-light">{tr.booking.mobile}:</span>
                  <span className="font-medium">{contactData.mobile}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-slate">{lang === 'hi' ? 'कुल' : 'Total'}:</span>
                  <span className="font-bold text-primary text-lg">
                    {PACKAGES.find(p => p.id === packageId)?.[lang === 'hi' ? 'priceHi' : 'priceEn'] || '—'}
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100">
                <p className="text-xs text-amber-700 leading-relaxed">
                  {BRAND.disclaimer[lang]}
                </p>
              </div>

              {/* TODO: Razorpay integration */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-light mb-2">
                  {lang === 'hi' ? 'पेमेंट गेटवे (TODO: Razorpay)' : 'Payment Gateway (TODO: Razorpay)'}
                </p>
                <p className="text-xs text-slate-light">
                  UPI, Cards, Net Banking
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-2.5 text-slate font-medium hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                {tr.booking.back}
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors"
            >
              {step === 5 ? tr.booking.pay : tr.booking.next}
              {step < 5 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
