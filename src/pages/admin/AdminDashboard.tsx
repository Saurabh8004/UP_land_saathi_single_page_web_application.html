import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  TrendingUp,
  DollarSign,
  Briefcase
} from 'lucide-react';

interface AdminStats {
  totalRequests: number;
  pendingRequests: number;
  inVerification: number;
  completedRequests: number;
  totalRevenue: number;
  b2bLeads: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalRequests: 0,
    pendingRequests: 0,
    inVerification: 0,
    completedRequests: 0,
    totalRevenue: 0,
    b2bLeads: 0
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      checkAdminAccess();
    }
  }, [user, authLoading, navigate]);

  const checkAdminAccess = async () => {
    if (!user) return;

    try {
      // Check if user is admin
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .eq('is_active', true)
        .single();

      if (error || !adminUser) {
        setIsAdmin(false);
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
      await loadDashboardData();
    } catch (err) {
      console.error('Admin check error:', err);
      setIsAdmin(false);
      navigate('/dashboard');
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load stats
      const [
        { count: totalRequests },
        { count: pendingRequests },
        { count: inVerification },
        { count: completedRequests },
        { data: payments },
        { count: b2bLeads }
      ] = await Promise.all([
        supabase.from('requests').select('*', { count: 'exact', head: true }),
        supabase.from('requests').select('*', { count: 'exact', head: true }).in('status', ['received', 'payment_pending']),
        supabase.from('requests').select('*', { count: 'exact', head: true }).eq('status', 'in_verification'),
        supabase.from('requests').select('*', { count: 'exact', head: true }).in('status', ['completed', 'report_ready']),
        supabase.from('payments').select('amount').eq('status', 'captured'),
        supabase.from('leads_b2b').select('*', { count: 'exact', head: true })
      ]);

      const totalRevenue = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;

      setStats({
        totalRequests: totalRequests || 0,
        pendingRequests: pendingRequests || 0,
        inVerification: inVerification || 0,
        completedRequests: completedRequests || 0,
        totalRevenue,
        b2bLeads: b2bLeads || 0
      });

      // Load recent requests
      const { data: requests } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentRequests(requests || []);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text mb-2">Admin Dashboard</h1>
          <p className="text-muted">Manage requests, reports, and verification workflows</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-text">{stats.totalRequests}</p>
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
                <p className="text-sm text-muted mb-1">Pending</p>
                <p className="text-3xl font-bold text-warning">{stats.pendingRequests}</p>
              </div>
              <Clock className="w-12 h-12 text-warning opacity-20" />
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
                <p className="text-sm text-muted mb-1">In Verification</p>
                <p className="text-3xl font-bold text-purple-600">{stats.inVerification}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Completed</p>
                <p className="text-3xl font-bold text-success">{stats.completedRequests}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-success opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-text">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <DollarSign className="w-12 h-12 text-success opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-border"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted mb-1">B2B Leads</p>
                <p className="text-3xl font-bold text-text">{stats.b2bLeads}</p>
              </div>
              <Briefcase className="w-12 h-12 text-primary opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Recent Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text">Recent Requests</h2>
            <Link
              to="/admin/requests"
              className="text-sm text-primary font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Request ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">District</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Package</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-bg/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-text">{request.request_id}</td>
                      <td className="px-6 py-4 text-sm text-text">{request.customer_name}</td>
                      <td className="px-6 py-4 text-sm text-muted">{request.district}</td>
                      <td className="px-6 py-4 text-sm text-muted">{request.package_code}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">{formatDate(request.created_at)}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/requests/${request.id}`}
                          className="text-sm text-primary font-semibold hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
