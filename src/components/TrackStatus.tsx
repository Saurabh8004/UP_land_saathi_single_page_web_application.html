import { useState } from 'react';
import { t, type Lang } from '../config';
import { supabase } from '../lib/supabase';
import { Search, CheckCircle, Clock, FileText, MapPin, Scale, Download, Loader2, AlertCircle } from 'lucide-react';

interface TrackStatusProps {
  lang: Lang;
}

interface RequestData {
  id: string;
  request_id: string;
  status: string;
  package_code: string;
  district: string;
  village: string;
  gata_khasra: string;
  created_at: string;
}

interface VerificationUpdate {
  status: string;
  public_message: string;
  created_at: string;
}

export default function TrackStatus({ lang }: TrackStatusProps) {
  const tr = t[lang];
  const [requestId, setRequestId] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<RequestData | null>(null);
  const [updates, setUpdates] = useState<VerificationUpdate[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRequest(null);
    setUpdates([]);
    setSearched(true);

    try {
      // Fetch request from database
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select('*')
        .eq('request_id', requestId)
        .eq('customer_mobile', mobile)
        .single();

      if (requestError || !requestData) {
        throw new Error('Request not found or mobile number does not match');
      }

      setRequest(requestData);

      // Fetch verification updates
      const { data: updatesData, error: updatesError } = await supabase
        .from('verification_updates')
        .select('status, public_message, created_at')
        .eq('request_id', requestData.id)
        .order('created_at', { ascending: true });

      if (!updatesError && updatesData) {
        setUpdates(updatesData);
      }

      // Log tracking attempt
      await supabase.from('audit_logs').insert({
        actor_type: 'customer',
        action: 'REQUEST_TRACKED',
        entity_type: 'request',
        entity_id: requestData.id,
        metadata: {
          request_id: requestId
        }
      });

    } catch (err) {
      console.error('Track error:', err);
      setError(err instanceof Error ? err.message : 'Failed to track request');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!request) return;

    try {
      // Get report
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('request_id', request.id)
        .eq('status', 'ready')
        .single();

      if (reportError || !report) {
        throw new Error('Report not found');
      }

      // Generate signed URL
      const { data: urlData, error: urlError } = await supabase.storage
        .from('reports')
        .createSignedUrl(report.storage_path, 3600);

      if (urlError || !urlData) {
        throw new Error('Failed to generate download URL');
      }

      // Log download
      await supabase.from('report_downloads').insert({
        report_id: report.id,
        request_id: request.id,
        user_id: null
      });

      await supabase.from('audit_logs').insert({
        actor_type: 'customer',
        action: 'REPORT_DOWNLOADED',
        entity_type: 'report',
        entity_id: report.id,
        metadata: {
          request_id: request.request_id
        }
      });

      // Open download URL
      window.open(urlData.signedUrl, '_blank');

    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'Failed to download report');
    }
  };

  const getStatusIndex = (status: string): number => {
    const statusMap: Record<string, number> = {
      'received': 0,
      'payment_pending': 0,
      'paid': 1,
      'in_verification': 2,
      'field_visit_scheduled': 2,
      'field_visit_done': 3,
      'advocate_review': 3,
      'report_processing': 4,
      'report_ready': 5,
      'completed': 5
    };
    return statusMap[status] ?? 0;
  };

  const statusIcons = [Clock, Search, MapPin, Scale, FileText, CheckCircle];
  const statusColors = ['bg-gray-100 text-gray-600', 'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600', 'bg-green-100 text-green-600', 'bg-emerald-100 text-emerald-600'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-text text-center mb-8">
          {tr.track.title}
        </h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-lg border border-border mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">{tr.track.requestId}</label>
              <input
                type="text"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                placeholder="BSK-2026-XXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">{tr.track.mobile}</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile"
                pattern="[0-9]{10}"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {lang === 'hi' ? 'खोज रहे हैं...' : 'Searching...'}
                </>
              ) : (
                tr.track.check
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800 mb-1">
                  {lang === 'hi' ? 'कोई रिजल्ट नहीं मिला' : 'No result found'}
                </p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Request details and timeline */}
        {request && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-border">
            {/* Request summary */}
            <div className="mb-6 pb-6 border-b border-border">
              <h3 className="font-bold text-text text-lg mb-4">
                {lang === 'hi' ? 'रिक्वेस्ट विवरण' : 'Request Details'}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">{lang === 'hi' ? 'रिक्वेस्ट आईडी' : 'Request ID'}:</span>
                  <p className="font-semibold text-text">{request.request_id}</p>
                </div>
                <div>
                  <span className="text-muted">{lang === 'hi' ? 'पैकेज' : 'Package'}:</span>
                  <p className="font-semibold text-text">{request.package_code}</p>
                </div>
                <div>
                  <span className="text-muted">{lang === 'hi' ? 'ज़िला' : 'District'}:</span>
                  <p className="font-semibold text-text">{request.district}</p>
                </div>
                <div>
                  <span className="text-muted">{lang === 'hi' ? 'गाटा/खसरा' : 'Gata/Khasra'}:</span>
                  <p className="font-semibold text-text">{request.gata_khasra}</p>
                </div>
                <div>
                  <span className="text-muted">{lang === 'hi' ? 'स्टेटस' : 'Status'}:</span>
                  <p className="font-semibold text-primary capitalize">{request.status.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <span className="text-muted">{lang === 'hi' ? 'बुकिंग तिथि' : 'Booking Date'}:</span>
                  <p className="font-semibold text-text">{formatDate(request.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Verification timeline */}
            <div>
              <h3 className="font-bold text-text text-lg mb-4">
                {lang === 'hi' ? 'सत्यापन टाइमलाइन' : 'Verification Timeline'}
              </h3>
              
              {updates.length > 0 ? (
                <div className="space-y-4">
                  {updates.map((update, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle size={18} className="text-primary" />
                        </div>
                        {i < updates.length - 1 && (
                          <div className="w-0.5 h-8 bg-primary/20" />
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p className="font-medium text-text">{update.public_message}</p>
                        <p className="text-xs text-muted mt-1">{formatDate(update.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock size={32} className="text-muted mx-auto mb-2" />
                  <p className="text-sm text-muted">
                    {lang === 'hi' ? 'अभी तक कोई अपडेट नहीं' : 'No updates yet'}
                  </p>
                </div>
              )}
            </div>

            {/* Download button (only when report is ready) */}
            {request.status === 'report_ready' || request.status === 'completed' ? (
              <button
                onClick={handleDownloadReport}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors"
              >
                <Download size={18} />
                {lang === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
