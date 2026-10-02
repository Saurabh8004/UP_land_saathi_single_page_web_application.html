import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  FileText, 
  User, 
  MapPin, 
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  MessageSquare
} from 'lucide-react';

interface RequestDetail {
  id: string;
  request_id: string;
  user_id: string;
  package_code: string;
  status: string;
  customer_name: string;
  customer_mobile: string;
  customer_email: string | null;
  district: string;
  tehsil: string | null;
  village: string | null;
  gata_khasra: string;
  area: string | null;
  owner_name: string | null;
  property_type: string | null;
  notes: string | null;
  consent_given: boolean;
  consent_timestamp: string | null;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: string;
  original_filename: string;
  storage_path: string;
  file_size: number;
  status: string;
  uploaded_at: string;
}

interface VerificationUpdate {
  id: string;
  status: string;
  public_message: string;
  internal_message: string | null;
  created_at: string;
}

interface InternalNote {
  id: string;
  note: string;
  created_at: string;
}

export default function AdminRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [updates, setUpdates] = useState<VerificationUpdate[]>([]);
  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newUpdate, setNewUpdate] = useState({ status: '', public_message: '', internal_message: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user && id) {
      checkAdminAccess();
    }
  }, [user, authLoading, navigate, id]);

  const checkAdminAccess = async () => {
    if (!user) return;

    try {
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
      await loadRequestData();
    } catch (err) {
      console.error('Admin check error:', err);
      setIsAdmin(false);
      navigate('/dashboard');
    }
  };

  const loadRequestData = async () => {
    if (!id) return;

    try {
      // Load request
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .select('*')
        .eq('id', id)
        .single();

      if (requestError || !requestData) {
        throw new Error('Request not found');
      }

      setRequest(requestData);

      // Load documents
      const { data: docsData } = await supabase
        .from('request_documents')
        .select('*')
        .eq('request_id', id)
        .order('uploaded_at', { ascending: false });

      setDocuments(docsData || []);

      // Load verification updates
      const { data: updatesData } = await supabase
        .from('verification_updates')
        .select('*')
        .eq('request_id', id)
        .order('created_at', { ascending: false });

      setUpdates(updatesData || []);

      // Load internal notes
      const { data: notesData } = await supabase
        .from('internal_notes')
        .select('*')
        .eq('request_id', id)
        .order('created_at', { ascending: false });

      setNotes(notesData || []);

    } catch (err) {
      console.error('Error loading request data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !request || !user) return;

    try {
      const { error } = await supabase.from('internal_notes').insert({
        request_id: request.id,
        admin_user_id: user.id,
        note: newNote
      });

      if (error) throw error;

      setNewNote('');
      await loadRequestData();
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note');
    }
  };

  const handleAddUpdate = async () => {
    if (!newUpdate.status || !newUpdate.public_message || !request || !user) return;

    try {
      const { error } = await supabase.from('verification_updates').insert({
        request_id: request.id,
        status: newUpdate.status,
        public_message: newUpdate.public_message,
        internal_message: newUpdate.internal_message || null,
        created_by: user.id
      });

      if (error) throw error;

      // Update request status
      await supabase
        .from('requests')
        .update({ status: newUpdate.status })
        .eq('id', request.id);

      setNewUpdate({ status: '', public_message: '', internal_message: '' });
      await loadRequestData();
    } catch (err) {
      console.error('Error adding update:', err);
      alert('Failed to add update');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!request) return;

    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', request.id);

      if (error) throw error;

      await loadRequestData();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const handleUploadReport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !request) return;

    try {
      const storagePath = `${request.request_id}/final-report.pdf`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Create report record
      const { error: reportError } = await supabase.from('reports').insert({
        request_id: request.id,
        report_number: `RPT-${request.request_id}`,
        storage_path: storagePath,
        status: 'ready',
        version: 1,
        uploaded_by: user?.id,
        ready_at: new Date().toISOString()
      });

      if (reportError) throw reportError;

      // Update request status
      await supabase
        .from('requests')
        .update({ status: 'report_ready' })
        .eq('id', request.id);

      alert('Report uploaded successfully');
      await loadRequestData();
    } catch (err) {
      console.error('Error uploading report:', err);
      alert('Failed to upload report');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin || !request) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-text mb-2">Request {request.request_id}</h1>
          <p className="text-muted">Manage verification request and workflow</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <User size={20} />
                Customer Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">Name:</span>
                  <p className="font-semibold text-text">{request.customer_name}</p>
                </div>
                <div>
                  <span className="text-muted">Mobile:</span>
                  <p className="font-semibold text-text">{request.customer_mobile}</p>
                </div>
                <div>
                  <span className="text-muted">Email:</span>
                  <p className="font-semibold text-text">{request.customer_email || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted">Package:</span>
                  <p className="font-semibold text-text">{request.package_code}</p>
                </div>
              </div>
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted">District:</span>
                  <p className="font-semibold text-text">{request.district}</p>
                </div>
                <div>
                  <span className="text-muted">Tehsil:</span>
                  <p className="font-semibold text-text">{request.tehsil || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted">Village:</span>
                  <p className="font-semibold text-text">{request.village || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted">Gata/Khasra:</span>
                  <p className="font-semibold text-text">{request.gata_khasra}</p>
                </div>
                <div>
                  <span className="text-muted">Area:</span>
                  <p className="font-semibold text-text">{request.area || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted">Owner Name:</span>
                  <p className="font-semibold text-text">{request.owner_name || 'N/A'}</p>
                </div>
              </div>
              {request.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-muted text-sm">Notes:</span>
                  <p className="text-text mt-1">{request.notes}</p>
                </div>
              )}
            </motion.div>

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <FileText size={20} />
                Documents ({documents.length})
              </h2>
              {documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-bg rounded-lg">
                      <div>
                        <p className="font-medium text-text text-sm">{doc.original_filename}</p>
                        <p className="text-xs text-muted">{formatFileSize(doc.file_size)} • {formatDate(doc.uploaded_at)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        doc.status === 'uploaded' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No documents uploaded</p>
              )}
            </motion.div>

            {/* Verification Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <Clock size={20} />
                Verification Timeline
              </h2>
              {updates.length > 0 ? (
                <div className="space-y-3">
                  {updates.map((update) => (
                    <div key={update.id} className="flex items-start gap-3 p-3 bg-bg rounded-lg">
                      <CheckCircle size={16} className="text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-text text-sm">{update.public_message}</p>
                        {update.internal_message && (
                          <p className="text-xs text-muted mt-1">Internal: {update.internal_message}</p>
                        )}
                        <p className="text-xs text-muted mt-1">{formatDate(update.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm">No updates yet</p>
              )}

              {/* Add Update Form */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold text-text mb-3">Add Update</h3>
                <div className="space-y-3">
                  <select
                    value={newUpdate.status}
                    onChange={(e) => setNewUpdate({ ...newUpdate, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  >
                    <option value="">Select Status</option>
                    <option value="received">Received</option>
                    <option value="paid">Paid</option>
                    <option value="in_verification">In Verification</option>
                    <option value="field_visit_done">Field Visit Done</option>
                    <option value="advocate_review">Advocate Review</option>
                    <option value="report_processing">Report Processing</option>
                    <option value="report_ready">Report Ready</option>
                    <option value="completed">Completed</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Public message (visible to customer)"
                    value={newUpdate.public_message}
                    onChange={(e) => setNewUpdate({ ...newUpdate, public_message: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Internal message (admin only)"
                    value={newUpdate.internal_message}
                    onChange={(e) => setNewUpdate({ ...newUpdate, internal_message: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                  <button
                    onClick={handleAddUpdate}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-light transition-colors"
                  >
                    Add Update
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-lg font-bold text-text mb-4">Status</h2>
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  request.status === 'completed' ? 'bg-green-100 text-green-800' :
                  request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {request.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <select
                value={request.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              >
                <option value="received">Received</option>
                <option value="payment_pending">Payment Pending</option>
                <option value="paid">Paid</option>
                <option value="in_verification">In Verification</option>
                <option value="field_visit_scheduled">Field Visit Scheduled</option>
                <option value="field_visit_done">Field Visit Done</option>
                <option value="advocate_review">Advocate Review</option>
                <option value="report_processing">Report Processing</option>
                <option value="report_ready">Report Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </motion.div>

            {/* Upload Report */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <Upload size={20} />
                Upload Report
              </h2>
              <input
                type="file"
                accept=".pdf"
                onChange={handleUploadReport}
                className="w-full text-sm"
              />
              <p className="text-xs text-muted mt-2">Upload final PDF report</p>
            </motion.div>

            {/* Internal Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                Internal Notes
              </h2>
              {notes.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-bg rounded-lg">
                      <p className="text-sm text-text">{note.note}</p>
                      <p className="text-xs text-muted mt-1">{formatDate(note.created_at)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm mb-4">No notes yet</p>
              )}
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add internal note..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm"
              />
              <button
                onClick={handleAddNote}
                className="w-full mt-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary-light transition-colors"
              >
                Add Note
              </button>
            </motion.div>

            {/* Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-border"
            >
              <h2 className="text-lg font-bold text-text mb-4">Metadata</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted">Created:</span>
                  <p className="font-medium text-text">{formatDate(request.created_at)}</p>
                </div>
                <div>
                  <span className="text-muted">Updated:</span>
                  <p className="font-medium text-text">{formatDate(request.updated_at)}</p>
                </div>
                <div>
                  <span className="text-muted">Consent:</span>
                  <p className="font-medium text-text">
                    {request.consent_given ? '✓ Given' : '✗ Not given'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
