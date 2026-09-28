import { useState } from 'react';
import { t, type Lang } from '../config';
import { Search, CheckCircle, Clock, FileText, MapPin, Scale, Download } from 'lucide-react';

interface TrackStatusProps {
  lang: Lang;
}

export default function TrackStatus({ lang }: TrackStatusProps) {
  const tr = t[lang];
  const [requestId, setRequestId] = useState('');
  const [mobile, setMobile] = useState('');
  const [status, setStatus] = useState<number | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Fetch status from backend API
    // Simulated response
    if (requestId && mobile.length === 10) {
      setStatus(2); // Simulating "Field Visit Done" status
      setSearched(true);
    }
  };

  const statusIcons = [Clock, Search, MapPin, Scale, FileText];
  const statusColors = ['bg-gray-100 text-gray-600', 'bg-blue-100 text-blue-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600', 'bg-green-100 text-green-600'];

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate text-center mb-8">
          {tr.track.title}
        </h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate mb-1">{tr.track.requestId}</label>
              <input
                type="text"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                placeholder="ZS-XXXXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate mb-1">{tr.track.mobile}</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile"
                pattern="[0-9]{10}"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors"
            >
              {tr.track.check}
            </button>
          </div>
        </form>

        {/* Status display */}
        {searched && status !== null && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-slate mb-6">{lang === 'hi' ? 'आपकी रिपोर्ट का स्टेटस' : 'Your Report Status'}</h3>
            
            {/* Status timeline */}
            <div className="space-y-4">
              {tr.track.statuses.map((s, i) => {
                const Icon = statusIcons[i];
                const isComplete = i <= status;
                const isCurrent = i === status;
                
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isComplete ? statusColors[i] : 'bg-gray-100 text-gray-300'
                      } ${isCurrent ? 'ring-2 ring-offset-2 ring-primary' : ''}`}>
                        {isComplete ? <CheckCircle size={18} /> : <Icon size={18} />}
                      </div>
                      {i < tr.track.statuses.length - 1 && (
                        <div className={`w-0.5 h-8 ${isComplete ? 'bg-primary' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className={`font-medium ${isComplete ? 'text-slate' : 'text-gray-400'}`}>{s}</p>
                      {isCurrent && (
                        <p className="text-xs text-primary mt-0.5">{lang === 'hi' ? 'वर्तमान स्टेप' : 'Current step'}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Download button (only when report is ready) */}
            {status === 4 && (
              <button className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors">
                <Download size={18} />
                {lang === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}
              </button>
            )}
          </div>
        )}

        {/* No result */}
        {searched && status === null && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <p className="text-slate-light">{lang === 'hi' ? 'कोई रिजल्ट नहीं मिला। Request ID और मोबाइल नंबर चेक करें।' : 'No result found. Please check your Request ID and mobile number.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
