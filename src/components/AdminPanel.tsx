import { useState } from 'react';
import { t, DISTRICTS, type Lang } from '../config';
import { Shield, Download, Upload, Filter, Edit3, Eye } from 'lucide-react';

interface AdminPanelProps {
  lang: Lang;
}

// Mock data for demonstration
const MOCK_REQUESTS = [
  { id: 'ZS-A1B2C3', district: 'Lucknow', package: 'Verified Report', status: 'In Verification', date: '2024-01-15', mobile: '98XXXXXX01' },
  { id: 'ZS-D4E5F6', district: 'Kanpur Nagar', package: 'Quick Check', status: 'Report Ready', date: '2024-01-14', mobile: '87XXXXXX02' },
  { id: 'ZS-G7H8I9', district: 'Varanasi', package: 'Deal Support', status: 'Received', date: '2024-01-15', mobile: '76XXXXXX03' },
  { id: 'ZS-J1K2L3', district: 'Agra', package: 'Verified Report', status: 'Field Visit Done', date: '2024-01-13', mobile: '65XXXXXX04' },
  { id: 'ZS-M4N5O6', district: 'Prayagraj', package: 'Quick Check', status: 'Advocate Review', date: '2024-01-12', mobile: '54XXXXXX05' },
];

const MOCK_B2B_LEADS = [
  { company: 'ABC Properties', contact: 'Raj Kumar', mobile: '98XXXXXX10', email: 'raj@abc.com', volume: '6-20', city: 'Lucknow' },
  { company: 'XYZ Builders', contact: 'Amit Singh', mobile: '87XXXXXX11', email: 'amit@xyz.com', volume: '21-50', city: 'Noida' },
];

export default function AdminPanel({ lang }: AdminPanelProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'leads'>('requests');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with real auth (Supabase)
    if (password === 'admin123') {
      setAuthenticated(true);
    } else {
      alert(lang === 'hi' ? 'गलत पासवर्ड' : 'Wrong password');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Shield size={24} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-slate">Admin Panel</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={lang === 'hi' ? 'पासवर्ड' : 'Password'}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-bg focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-colors"
            >
              {lang === 'hi' ? 'लॉगिन' : 'Login'}
            </button>
          </form>
          <p className="text-xs text-slate-light text-center mt-4">
            Demo password: admin123
          </p>
        </div>
      </div>
    );
  }

  const filteredRequests = MOCK_REQUESTS.filter((r) => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterDistrict && r.district !== filterDistrict) return false;
    return true;
  });

  const statuses = ['Received', 'In Verification', 'Field Visit Done', 'Advocate Review', 'Report Ready'];

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate">Admin Panel</h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2 text-sm text-slate-light hover:text-slate border border-gray-200 rounded-lg"
          >
            {lang === 'hi' ? 'लॉगआउट' : 'Logout'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'requests' ? 'bg-primary text-white' : 'bg-white text-slate border border-gray-200'
            }`}
          >
            {lang === 'hi' ? 'रिक्वेस्ट्स' : 'Requests'} ({MOCK_REQUESTS.length})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'leads' ? 'bg-primary text-white' : 'bg-white text-slate border border-gray-200'
            }`}
          >
            B2B Leads ({MOCK_B2B_LEADS.length})
          </button>
        </div>

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-light" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                >
                  <option value="">{lang === 'hi' ? 'सब स्टेटस' : 'All Status'}</option>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
              >
                <option value="">{lang === 'hi' ? 'सब ज़िले' : 'All Districts'}</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <button className="ml-auto px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2">
                <Download size={14} />
                Export CSV
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-slate">ID</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'ज़िला' : 'District'}</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'पैकेज' : 'Package'}</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'स्टेटस' : 'Status'}</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'दिनांक' : 'Date'}</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'एक्शन' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{req.id}</td>
                        <td className="px-4 py-3">{req.district}</td>
                        <td className="px-4 py-3">{req.package}</td>
                        <td className="px-4 py-3">
                          <select
                            defaultValue={req.status}
                            className="px-2 py-1 rounded text-xs border border-gray-200 bg-white"
                          >
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-slate-light">{req.date}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded hover:bg-gray-100" title="View">
                              <Eye size={14} className="text-slate-light" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100" title="Edit">
                              <Edit3 size={14} className="text-slate-light" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-gray-100" title="Upload Report">
                              <Upload size={14} className="text-primary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* B2B Leads Tab */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'कंपनी' : 'Company'}</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'संपर्क' : 'Contact'}</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'मोबाइल' : 'Mobile'}</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'वॉल्यूम' : 'Volume'}</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate">{lang === 'hi' ? 'शहर' : 'City'}</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_B2B_LEADS.map((lead, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{lead.company}</td>
                      <td className="px-4 py-3">{lead.contact}</td>
                      <td className="px-4 py-3">{lead.mobile}</td>
                      <td className="px-4 py-3 text-slate-light">{lead.email}</td>
                      <td className="px-4 py-3">{lead.volume}</td>
                      <td className="px-4 py-3">{lead.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
