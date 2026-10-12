import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { bookingSchema, BookingFormData } from '../lib/validations';
import { PRICING_PLANS } from '../config/pricing';
import { DISTRICTS } from '../config/districts';
import DocumentUpload from '../components/DocumentUpload';
import {
  ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Loader2,
  FileText, MapPin, User, CreditCard
} from 'lucide-react';

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
  const requestCreationRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema) as any,
    defaultValues: {
      consentGiven: false,
      privacyPolicyVersion: '1.0'
    }
  });

  const formData = watch();
  const selectedPackage = PRICING_PLANS[formData.packageCode as keyof typeof PRICING_PLANS];

  // Step 1: Property Details
  const handleStep1Submit = () => {
    setStep(2);
    setError(null);
  };

  // Step 2: Documents
  const handleStep2Submit = () => {
    setStep(3);
    setError(null);
  };

  // Step 3: Review & Submit
  const handleFinalSubmit = async () => {
    if (!user) {
      navigate('/login?redirect=/booking');
      return;
    }

    // Prevent duplicate request creation
    if (requestCreationRef.current) {
      return;
    }

    requestCreationRef.current = true;
    setLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      // Import diagnostics
      const { getSupabaseDiagnostics } = await import('../lib/supabase');
      const diagnostics = getSupabaseDiagnostics();
      
      console.log('[BOOKING] ════════════════════════════════════════════════════════');
      console.log('[BOOKING] Starting request submission...');
      console.log('[BOOKING] Supabase client status:', {
        isUsingDummyClient: diagnostics.isUsingDummyClient,
        hasUrl: diagnostics.hasUrl,
        hasAnonKey: diagnostics.hasAnonKey,
        urlHostname: diagnostics.urlHostname
      });
      
      if (diagnostics.isUsingDummyClient) {
        console.error('[BOOKING] ⚠️  WARNING: Using dummy client - request will fail!');
        throw new Error('Supabase client not properly initialized. Please redeploy the application.');
      }

      // Generate request ID
      const year = new Date().getFullYear();
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const newRequestId = `BSK-${year}-${randomNum}`;

      console.log('[BOOKING] Request ID:', newRequestId);
      console.log('[BOOKING] Attempting to insert request into database...');

      // Create request in database (removed customer_email field)
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          request_id: newRequestId,
          user_id: user.id,
          service_type: 'property_verification',
          package_code: formData.packageCode,
          status: 'received',
          customer_name: formData.customerName,
          mobile: formData.customerMobile,
          district: formData.district,
          tehsil: formData.tehsil || null,
          village: formData.village || null,
          gata_khasra: formData.gataKhasra,
          area: formData.area || null,
          owner_name: formData.ownerName || null,
          property_type: formData.propertyType || null,
          notes: formData.notes || null,
          consent_given: formData.consentGiven,
          consent_timestamp: new Date().toISOString(),
          privacy_policy_version: formData.privacyPolicyVersion
        })
        .select()
        .single();

      const duration = Date.now() - startTime;
      console.log('[BOOKING] Request completed in', duration, 'ms');

      if (requestError) {
        console.error('[BOOKING] ════════════════════════════════════════════════════════');
        console.error('[BOOKING] ❌ Database insert error:');
        console.error('[BOOKING] Error message:', requestError.message);
        console.error('[BOOKING] Error code:', requestError.code);
        console.error('[BOOKING] Error details:', requestError.details);
        console.error('[BOOKING] Error hint:', requestError.hint);
        console.error('[BOOKING] ════════════════════════════════════════════════════════');
        
        // Check for network errors
        if (requestError.message === 'Failed to fetch' || requestError.code === 'NETWORK_ERROR') {
          console.error('[BOOKING] ⚠️  NETWORK ERROR DETECTED');
          throw new Error('Network error: Cannot connect to database. Please check your internet connection and try again.');
        }
        
        throw requestError;
      }

      // Create audit log
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        actor_type: 'customer',
        action: 'REQUEST_CREATED',
        entity_type: 'request',
        entity_id: request.id,
        metadata: {
          request_id: newRequestId,
          package_code: formData.packageCode,
          district: formData.district
        }
      });

      console.log('[BOOKING] ════════════════════════════════════════════════════════');
      console.log('[BOOKING] ✓ Request saved successfully!');
      console.log('[BOOKING] Request ID:', newRequestId);
      console.log('[BOOKING] Duration:', duration, 'ms');
      console.log('[BOOKING] ════════════════════════════════════════════════════════');

      setRequestId(newRequestId);
      setStep(4); // Success step

    } catch (err) {
      const duration = Date.now() - startTime;
      console.error('[BOOKING] ════════════════════════════════════════════════════════');
      console.error('[BOOKING] ❌ ERROR:');
      console.error('[BOOKING] Error type:', err instanceof Error ? err.constructor.name : typeof err);
      console.error('[BOOKING] Error message:', err instanceof Error ? err.message : String(err));
      console.error('[BOOKING] Duration:', duration, 'ms');
      console.error('[BOOKING] ════════════════════════════════════════════════════════');
      
      setError(err instanceof Error ? err.message : 'Failed to create request. Please try again.');
      requestCreationRef.current = false; // Allow retry
    } finally {
      setLoading(false);
    }
  };

  // Step indicator
  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {['Property Details', 'Documents', 'Review'].map((label, i) => (
          <div key={i} className="flex-1 flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
              i + 1 <= step ? 'bg-navy text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {i + 1 < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
            </div>
            {i < 2 && (
              <div className={`flex-1 h-1 mx-2 ${
                i + 1 < step ? 'bg-navy' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>Property Details</span>
        <span>Documents</span>
        <span>Review</span>
      </div>
    </div>
  );

  // Success page
  if (step === 4 && requestId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">Request Created Successfully!</h2>
          <p className="text-slate-600 mb-6">Your property verification request has been submitted</p>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-slate-500 mb-1">Request ID</p>
            <p className="text-lg font-bold text-navy">{requestId}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate(`/track?requestId=${requestId}`)}
              className="w-full border border-navy text-navy py-3 rounded-lg font-semibold hover:bg-navy hover:text-white transition-colors"
            >
              Track Request
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <StepIndicator />

        <AnimatePresence mode="wait">
          {/* STEP 1: Property Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Property Details
              </h2>

              <form onSubmit={handleSubmit(handleStep1Submit)} className="space-y-6">
                {/* Package Selection */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-3">
                    Select Service Package *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(PRICING_PLANS).map(([code, pricing]) => (
                      <label
                        key={code}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.packageCode === code
                            ? 'border-navy bg-navy/5'
                            : 'border-slate-200 hover:border-navy/50'
                        }`}
                      >
                        <input
                          type="radio"
                          value={code}
                          {...register('packageCode')}
                          className="w-4 h-4 text-navy"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-semibold text-navy">{pricing.name.en}</p>
                          <p className="text-sm text-slate-500">₹{pricing.price}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.packageCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.packageCode.message}</p>
                  )}
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('customerName')}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                      placeholder="Ramesh Kumar"
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Mobile Number *
                    </label>
                    <input
                      {...register('customerMobile')}
                      type="tel"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                      placeholder="9876543210"
                    />
                    {errors.customerMobile && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerMobile.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Email Address
                  </label>
                  <input
                    {...register('customerEmail')}
                    type="email"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="you@example.com"
                  />
                  {errors.customerEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerEmail.message}</p>
                  )}
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      District *
                    </label>
                    <select
                      {...register('district')}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    >
                      <option value="">Select District</option>
                      {DISTRICTS.map(d => (
                        <option key={d.code} value={d.name_en}>{d.name_en}</option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Tehsil
                    </label>
                    <input
                      {...register('tehsil')}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                      placeholder="Tehsil name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Village
                    </label>
                    <input
                      {...register('village')}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                      placeholder="Village name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Gata/Khasra Number *
                    </label>
                    <input
                      {...register('gataKhasra')}
                      type="text"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                      placeholder="125/A"
                    />
                    {errors.gataKhasra && (
                      <p className="mt-1 text-sm text-red-600">{errors.gataKhasra.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Area (optional)
                  </label>
                  <input
                    {...register('area')}
                    type="text"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="e.g., 500 sq meters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Owner Name (if known)
                  </label>
                  <input
                    {...register('ownerName')}
                    type="text"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Current owner name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                    placeholder="Any additional information..."
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Document Upload
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: Documents */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Upload Documents (Optional)
              </h2>
              <p className="text-slate-600 mb-6">
                Upload any property documents you have (registry, khatauni, map, etc.)
              </p>
              
              <DocumentUpload
                requestId="temp"
                onUploadComplete={(docs: any[]) => setUploadedDocuments(docs)}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-slate-200 text-navy py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleStep2Submit}
                  className="flex-1 bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Review
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Review & Confirm
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800 mb-1">Something went wrong</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Property Details */}
                <div className="border border-slate-200 rounded-lg p-5">
                  <h3 className="font-semibold text-navy mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Property Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Owner Name:</span>
                      <p className="font-medium text-navy">{formData.ownerName || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">District:</span>
                      <p className="font-medium text-navy">{formData.district}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Tehsil:</span>
                      <p className="font-medium text-navy">{formData.tehsil || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Village:</span>
                      <p className="font-medium text-navy">{formData.village || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Gata/Khasra:</span>
                      <p className="font-medium text-navy">{formData.gataKhasra}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Area:</span>
                      <p className="font-medium text-navy">{formData.area || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Selected Service */}
                <div className="border border-slate-200 rounded-lg p-5">
                  <h3 className="font-semibold text-navy mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Selected Service
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-navy">{selectedPackage?.name.en}</p>
                      <p className="text-sm text-slate-500">{selectedPackage?.delivery.en}</p>
                    </div>
                    <p className="text-2xl font-bold text-navy">₹{selectedPackage?.price}</p>
                  </div>
                </div>

                {/* Documents */}
                <div className="border border-slate-200 rounded-lg p-5">
                  <h3 className="font-semibold text-navy mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents
                  </h3>
                  {uploadedDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {uploadedDocuments.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-sm text-navy">{doc.name}</span>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                      ))}
                      <p className="text-sm text-slate-500 mt-2">
                        {uploadedDocuments.length} document{uploadedDocuments.length !== 1 ? 's' : ''} uploaded
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No documents uploaded</p>
                  )}
                </div>

                {/* Customer Details */}
                <div className="border border-slate-200 rounded-lg p-5">
                  <h3 className="font-semibold text-navy mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Name:</span>
                      <p className="font-medium text-navy">{formData.customerName}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Mobile:</span>
                      <p className="font-medium text-navy">{formData.customerMobile}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Email:</span>
                      <p className="font-medium text-navy">{formData.customerEmail || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('consentGiven')}
                      className="w-5 h-5 text-navy rounded border-slate-300 focus:ring-navy mt-0.5"
                    />
                    <span className="text-sm text-slate-600">
                      I agree to the{' '}
                      <a href="/privacy" className="text-navy hover:underline">Privacy Policy</a>
                      {' '}and consent to Bhumi Seva Kendra processing my information for this request.
                    </span>
                  </label>
                  {errors.consentGiven && (
                    <p className="mt-2 text-sm text-red-600">{errors.consentGiven.message}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="flex-1 border border-slate-200 text-navy py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="flex-1 bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Request...
                      </>
                    ) : (
                      <>
                        Confirm & Proceed
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
