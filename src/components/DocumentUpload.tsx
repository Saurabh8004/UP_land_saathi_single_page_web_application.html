import { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  requestId: string;
  onUploadComplete: (docs: any[]) => void;
}

interface UploadedDoc {
  name: string;
  size: number;
  type: string;
}

export default function DocumentUpload({ requestId, onUploadComplete }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    const newDocs: UploadedDoc[] = [];

    for (const file of Array.from(files)) {
      // Validate file
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} has invalid type. Only PDF, JPG, and PNG are allowed.`);
        continue;
      }

      newDocs.push({
        name: file.name,
        size: file.size,
        type: file.type
      });

      // TODO: Upload to Supabase Storage when requestId is real
      // For now, just track the file info
    }

    const updatedDocs = [...documents, ...newDocs];
    setDocuments(updatedDocs);
    onUploadComplete(updatedDocs);
    setUploading(false);

    // Reset input
    e.target.value = '';
  };

  const removeDocument = (index: number) => {
    const updatedDocs = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocs);
    onUploadComplete(updatedDocs);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-navy transition-colors">
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
          className="cursor-pointer flex flex-col items-center gap-3"
        >
          <Upload className="w-12 h-12 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-navy">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PDF, JPG, PNG (Max 10 MB each)
            </p>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-navy">Uploaded Documents</h4>
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-navy flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(doc.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <button
                  onClick={() => removeDocument(index)}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  title="Remove document"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
