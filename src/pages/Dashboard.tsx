import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertCircle, Loader2, Plus } from 'lucide-react';

interface Request {
  id: string;
  request_id: string;
  package_code: string;
  status: string;
  district: string;
  village: string;
  gata_khasra: string;
  created_at: string;
  payment_status: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      loadRequests();
    }
  }, [user, authLoading, navigate]);

  const loadRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      received: 'bg-blue-100 text-blue-800',
      payment_pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      in_verification: 'bg-purple-100 text-purple-800',
      report_ready: 'bg-emerald-100 text-emerald-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed' || status === 'report_ready') {
      return <CheckCircle className="w-4 h-4" />;
    }
    if (status === 'cancelled') {
      return <AlertCircle className="w-4 h-4" />;
    }
    return <Clock className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text mb-2">
            Welcome, {profile?.full_name || 'User'}
          </h1>
          <p className="text-muted">Manage your property verification requests</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-text">{requests.length}</p>
              </div>
              <FileText className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">In Progress</p>
                <p className="text-3xl font-bold text-text">
                  {requests.filter(r => !['completed', 'cancelled'].includes(r.status)).length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-accent opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Completed</p>
                <p className="text-3xl font-bold text-text">
                  {requests.filter(r => r.status === 'completed' || r.status === 'report_ready').length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-success opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* New Request Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Verification Request
          </Link>
        </motion.div>

        {/* Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold text-text mb-4">Your Requests</h2>

          {requests.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-border">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">No requests yet</h3>
              <p className="text-muted mb-6">Start by creating your first property verification request</p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Request
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-text">{request.request_id}</h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted mb-2">
                        {request.district} • {request.village || 'N/A'} • Gata: {request.gata_khasra}
                      </p>
                      <p className="text-xs text-muted">
                        Created: {formatDate(request.created_at)} • Package: {request.package_code}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/track?requestId=${request.request_id}`}
                        className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors text-sm"
                      >
                        Track
                      </Link>
                      {(request.status === 'report_ready' || request.status === 'completed') && (
                        <Link
                          to={`/reports/${request.id}`}
                          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors text-sm"
                        >
                          View Report
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
