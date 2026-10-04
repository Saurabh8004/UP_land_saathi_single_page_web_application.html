import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { bookingSchema, BookingFormData } from '../lib/validations';
import { PRICING_PLANS } from '../config/pricing';
import { DISTRICTS } from '../config/districts';
import DocumentUpload from '../components/DocumentUpload';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, FileText, User, MapPin, CreditCard, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

interface UploadedDoc {
  id: string;
  original_file_name: string;
  file_size: number;
  status: string;
}

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Flow: 1. Property Details → 2. Documents → 3. Review → 4. Success
  const [step, setStep] = useState(1);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [requestDbId, setRequestDbId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDoc[]>([]);
  const [formData, setFormData] = useState<BookingFormData | null>(null);
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

  const selectedPackage = watch('packageCode');
  const selectedPricing = PRICING_PLANS[selectedPackage as keyof typeof PRICING_PLANS];

  // Load uploaded documents when requestDbId changes
  useEffect(() => {
    if (requestDbId) {
      loadDocuments();
    }
  }, [requestDbId]);

  const loadDocuments = async () => {
    if (!requestDbId) return;
    try {
      const { data: docs, error } = await supabase
        .from('request_documents')
        .select('*')
        .eq('request_id', requestDbId)
        .order('uploaded_at', { ascending: false });

      if (!error && docs) {
        setUploadedDocuments(docs);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    }
  };

  // Step 1 → Step 2: Save form data and create request in DB
  const handleStep1Submit = async (data: BookingFormData) => {
    if (!user) {
      navigate('/login?redirect=/booking');
      return;
    }

    if (requestCreationRef.current) return;
    requestCreationRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const newRequestId = `BSK-${year}-${randomNum}`;

      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          request_id: newRequestId,
          user_id: user.id,
          package_code: data.packageCode,
          status: 'received',
          customer_name: data.customerName,
          customer_mobile: data.customerMobile,
          customer_email: data.customerEmail || null,
          district: data.district,
          tehsil: data.tehsil || null,
          village: data.village || null,
          gata_khasra: data.gataKhasra,
          area: data.area || null,
          owner_name: data.ownerName || null,
          property_type: data.propertyType || null,
          notes: data.notes || null,
          consent_given: data.consentGiven,
          consent_timestamp: new Date().toISOString(),
          privacy_policy_version: data.privacyPolicyVersion
        })
        .select()
        .single();

      if (requestError) throw requestError;

      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        actor_type: 'customer',
        action: 'REQUEST_CREATED',
        entity_type: 'request',
        entity_id: request.id,
        metadata: {
          request_id: newRequestId,
          package_code: data.packageCode,
          district: data.district
        }
      });

      setFormData(data);
      setRequestId(newRequestId);
      setRequestDbId(request.id);
      setStep(2);
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create request. Please try again.');
      requestCreationRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  // Step 3 → Step 4: Confirm and show success
  const handleConfirmAndSubmit = () => {
    setStep(4);
  };

  // Retry handler
  const handleRetry = () => {
    setError(null);
    requestCreationRef.current = false;
  };

  // Step labels
  const stepLabels = ['Property Details', 'Documents', 'Review', 'Success'];

  // ============================================================
  // STEP 4: SUCCESS
  // ============================================================
  if (step === 4 && requestId) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Request Created Successfully!</h2>
          <p className="text-muted mb-6">Your property verification request has been submitted</p>

          <div className="bg-bg rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-muted mb-1">Request ID</p>
            <p className="text-lg font-bold text-primary">{requestId}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate(`/track?requestId=${requestId}`)}
              className="w-full border border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Track Request
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================================================
  // MAIN LAYOUT
  // ============================================================
  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {stepLabels.slice(0, 3).map((label, i) => (
              <div key={i} className="flex-1 flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                  i + 1 <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1 < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    i + 1 < step ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span>Property Details</span>
            <span>Documents</span>
            <span>Review</span>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Error UI */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Something went wrong</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-red-700 font-medium hover:text-red-900"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 1: PROPERTY DETAILS */}
          {/* ============================================================ */}
          {step === 1 && (
            <form onSubmit={handleSubmit(handleStep1Submit)} className="space-y-6">
              <h2 className="text-2xl font-bold text-text mb-6">Property Details</h2>

              {/* Package Selection */}
              <div>
                <label className="block text-sm font-medium text-text mb-3">
                  Select Service Package *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(PRICING_PLANS).map(([code, pricing]) => (
                    <label
                      key={code}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPackage === code
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        value={code}
                        {...register('packageCode')}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="ml-3 flex-1">
                        <p className="font-semibold text-text">{pricing.name.en}</p>
                        <p className="text-sm text-muted">₹{pricing.price.toLocaleString('en-IN')}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.packageCode && (
                  <p className="mt-1 text-sm text-danger">{errors.packageCode.message}</p>
                )}
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Full Name *</label>
                  <input
                    {...register('customerName')}
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ramesh Kumar"
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-sm text-danger">{errors.customerName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Mobile Number *</label>
                  <input
                    {...register('customerMobile')}
                    type="tel"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="9876543210"
                  />
                  {errors.customerMobile && (
                    <p className="mt-1 text-sm text-danger">{errors.customerMobile.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Email Address</label>
                <input
                  {...register('customerEmail')}
                  type="email"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="you@example.com"
                />
                {errors.customerEmail && (
                  <p className="mt-1 text-sm text-danger">{errors.customerEmail.message}</p>
                )}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">District *</label>
                  <select
                    {...register('district')}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select District</option>
                    {DISTRICTS.map(d => (
                      <option key={d.code} value={d.name_en}>{d.name_en}</option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="mt-1 text-sm text-danger">{errors.district.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Tehsil</label>
                  <input
                    {...register('tehsil')}
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tehsil name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Village</label>
                  <input
                    {...register('village')}
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Village name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Gata/Khasra Number *</label>
                  <input
                    {...register('gataKhasra')}
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="125/A"
                  />
                  {errors.gataKhasra && (
                    <p className="mt-1 text-sm text-danger">{errors.gataKhasra.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Area (optional)</label>
                <input
                  {...register('area')}
                  type="text"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 500 sq meters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Owner Name (if known)</label>
                <input
                  {...register('ownerName')}
                  type="text"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Current owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Additional Notes</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any additional information..."
                />
              </div>

              {/* Consent */}
              <div className="flex items-start gap-3">
                <input
                  {...register('consentGiven')}
                  type="checkbox"
                  className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary mt-1"
                />
                <label className="text-sm text-muted">
                  I agree to the{' '}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  {' '}and consent to Bhumi Seva Kendra processing my information for this request.
                </label>
              </div>
              {errors.consentGiven && (
                <p className="text-sm text-danger">{errors.consentGiven.message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Request...
                  </>
                ) : (
                  <>
                    Continue to Document Upload
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ============================================================ */}
          {/* STEP 2: DOCUMENT UPLOAD */}
          {/* ============================================================ */}
          {step === 2 && requestId && requestDbId && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-text mb-2">Upload Documents</h2>
                <p className="text-muted">
                  Upload any property documents you have (registry, khatauni, map, etc.)
                </p>
                <p className="text-xs text-muted mt-1">
                  Request ID: <span className="font-mono font-semibold text-primary">{requestId}</span>
                </p>
              </div>

              <DocumentUpload requestId={requestDbId} onUploadComplete={loadDocuments} />

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 flex items-center justify-center gap-2 border border-border text-text py-3 rounded-lg font-semibold hover:bg-bg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Continue to Review
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: REVIEW */}
          {/* ============================================================ */}
          {step === 3 && formData && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-text mb-2">Review & Confirm</h2>
                <p className="text-muted">Please review your details before confirming</p>
              </div>

              {/* Property Details */}
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Property Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted">Owner Name:</span>
                    <p className="font-medium text-text">{formData.ownerName || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-muted">District:</span>
                    <p className="font-medium text-text">{formData.district}</p>
                  </div>
                  <div>
                    <span className="text-muted">Tehsil:</span>
                    <p className="font-medium text-text">{formData.tehsil || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-muted">Village:</span>
                    <p className="font-medium text-text">{formData.village || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-muted">Gata / Khasra:</span>
                    <p className="font-medium text-text">{formData.gataKhasra}</p>
                  </div>
                  <div>
                    <span className="text-muted">Area:</span>
                    <p className="font-medium text-text">{formData.area || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-muted">Property Type:</span>
                    <p className="font-medium text-text">{formData.propertyType || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Selected Service */}
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Selected Service
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text">
                      {selectedPricing?.name?.en || formData.packageCode}
                    </p>
                    <p className="text-sm text-muted">{selectedPricing?.delivery?.en}</p>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    ₹{selectedPricing?.price?.toLocaleString('en-IN') || '—'}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Documents ({uploadedDocuments.length})
                </h3>
                {uploadedDocuments.length > 0 ? (
                  <ul className="space-y-2">
                    {uploadedDocuments.map((doc) => (
                      <li key={doc.id} className="flex items-center justify-between p-2 bg-bg rounded-lg text-sm">
                        <span className="text-text truncate">{doc.original_file_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          doc.status === 'uploaded' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {doc.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">No documents uploaded (optional)</p>
                )}
              </div>

              {/* Customer Details */}
              <div className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted">Name:</span>
                    <p className="font-medium text-text">{formData.customerName}</p>
                  </div>
                  <div>
                    <span className="text-muted">Mobile:</span>
                    <p className="font-medium text-text">{formData.customerMobile}</p>
                  </div>
                  <div>
                    <span className="text-muted">Email:</span>
                    <p className="font-medium text-text">{formData.customerEmail || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Consent / Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Disclaimer:</strong> Bhumi Seva Kendra is a private information-assistance platform, not a government portal.
                  The report will be based on available records and documents. This is not a title guarantee or legal opinion.
                  By confirming, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 flex items-center justify-center gap-2 border border-border text-text py-3 rounded-lg font-semibold hover:bg-bg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleConfirmAndSubmit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
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
          )}

          {/* Fallback: if step 3 but no formData */}
          {step === 3 && !formData && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-lg font-bold text-text mb-2">Missing Information</h3>
              <p className="text-muted mb-6">Your form data was not saved. Please go back and try again.</p>
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                Go Back to Property Details
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
