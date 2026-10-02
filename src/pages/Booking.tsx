import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { bookingSchema, BookingFormData } from '../lib/validations';
import { PRICING_PLANS } from '../config/pricing';
import { DISTRICTS } from '../config/districts';
import DocumentUpload from '../components/DocumentUpload';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      navigate('/login?redirect=/booking');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate request ID server-side (in production, this would be a database function)
      const year = new Date().getFullYear();
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const newRequestId = `BSK-${year}-${randomNum}`;

      // Create request in database
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

      // Create audit log
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

      setRequestId(newRequestId);
      setStep(3); // Move to success step

    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && requestId) {
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

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['Property Details', 'Documents', 'Review'].map((label, i) => (
              <div key={i} className="flex-1 flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                  i + 1 <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {step === 1 && (
            <form onSubmit={handleSubmit(() => setStep(2))} className="space-y-6">
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
                        <p className="text-sm text-muted">₹{pricing.price}</p>
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
                  <label className="block text-sm font-medium text-text mb-2">
                    Full Name *
                  </label>
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
                  <label className="block text-sm font-medium text-text mb-2">
                    Mobile Number *
                  </label>
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
                <label className="block text-sm font-medium text-text mb-2">
                  Email Address
                </label>
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
                  <label className="block text-sm font-medium text-text mb-2">
                    District *
                  </label>
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
                  <label className="block text-sm font-medium text-text mb-2">
                    Tehsil
                  </label>
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
                  <label className="block text-sm font-medium text-text mb-2">
                    Village
                  </label>
                  <input
                    {...register('village')}
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Village name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Gata/Khasra Number *
                  </label>
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
                <label className="block text-sm font-medium text-text mb-2">
                  Area (optional)
                </label>
                <input
                  {...register('area')}
                  type="text"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 500 sq meters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Owner Name (if known)
                </label>
                <input
                  {...register('ownerName')}
                  type="text"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Current owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Additional Notes
                </label>
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

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Continue to Document Upload'
                )}
              </button>
            </form>
          )}

          {step === 2 && requestId && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-text mb-6">Upload Documents (Optional)</h2>
              <p className="text-muted mb-6">
                Upload any property documents you have (registry, khatauni, map, etc.)
              </p>
              
              <DocumentUpload requestId={requestId} />

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-border text-text py-3 rounded-lg font-semibold hover:bg-bg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
