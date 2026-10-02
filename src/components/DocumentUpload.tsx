import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { validateFile, sanitizeFilename } from '../lib/validations';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DocumentUploadProps {
  requestId: string;
  onUploadComplete?: () => void;
}

interface UploadedDocument {
  id: string;
  original_filename: string;
  file_size: number;
  status: string;
  uploaded_at: string;
}

export default function DocumentUpload({ requestId, onUploadComplete }: DocumentUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(null);

    for (const file of Array.from(files)) {
      await uploadDocument(file);
    }

    // Reset input
    e.target.value = '';
  };

  const uploadDocument = async (file: File) => {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Sanitize filename
      const sanitizedFilename = sanitizeFilename(file.name);
      const timestamp = Date.now();
      const storagePath = `${requestId}/${timestamp}_${sanitizedFilename}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('property-documents')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Create database record
      const { data: document, error: dbError } = await supabase
        .from('request_documents')
        .insert({
          request_id: requestId,
          uploaded_by: user?.id,
          document_type: 'general',
          original_file_name: file.name,
          storage_path: storagePath,
          mime_type: file.type,
          file_size: file.size,
          status: 'uploaded'
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(dbError.message);
      }

      // Add to local state
      setDocuments(prev => [...prev, {
        id: document.id,
        original_filename: document.original_file_name,
        file_size: document.file_size,
        status: document.status,
        uploaded_at: document.uploaded_at
      }]);

      setSuccess(`Successfully uploaded: ${file.name}`);
      
      if (onUploadComplete) {
        onUploadComplete();
      }

      // Create audit log
      await supabase.from('audit_logs').insert({
        actor_id: user?.id,
        actor_type: 'customer',
        action: 'DOCUMENT_UPLOADED',
        entity_type: 'document',
        entity_id: document.id,
        metadata: {
          request_id: requestId,
          filename: file.name,
          file_size: file.size
        }
      });

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = async (docId: string, storagePath: string) => {
    if (!confirm('Are you sure you want to remove this document?')) {
      return;
    }

    try {
      // Delete from storage
      await supabase.storage
        .from('property-documents')
        .remove([storagePath]);

      // Delete from database
      await supabase
        .from('request_documents')
        .delete()
        .eq('id', docId);

      // Update local state
      setDocuments(prev => prev.filter(d => d.id !== docId));
      setSuccess('Document removed successfully');

    } catch (err) {
      console.error('Remove error:', err);
      setError('Failed to remove document');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          type="file"
          id="document-upload"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <label
          htmlFor="document-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {uploading ? (
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </span>
          <span className="text-xs text-gray-500">
            PDF, JPG, PNG (Max 10 MB each)
          </span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-600">{success}</span>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Uploaded Documents</h4>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.original_filename}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(doc.file_size)}
                </p>
              </div>
              <button
                onClick={() => removeDocument(doc.id, `${requestId}/${doc.original_filename}`)}
                className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove document"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
