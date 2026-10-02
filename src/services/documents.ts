import { supabase } from '../lib/supabase';

// ============================================================
// TYPES
// ============================================================

export interface DocumentUpload {
  id: string;
  request_id: string;
  original_filename: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  document_type: string | null;
  analysis_status: string;
  analysis_summary: string | null;
  uploaded_at: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

// ============================================================
// VALIDATION
// ============================================================

function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 10 MB limit.'
    };
  }
  
  // Check MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only PDF, JPG, and PNG are allowed.'
    };
  }
  
  // Check extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Invalid file extension. Only .pdf, .jpg, .jpeg, and .png are allowed.'
    };
  }
  
  return { valid: true };
}

// ============================================================
// UPLOAD DOCUMENT
// ============================================================

export async function uploadDocument(
  requestId: string,
  file: File,
  documentType?: string
): Promise<{
  success: boolean;
  data?: DocumentUpload;
  error?: { code: string; message: string };
}> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.error || 'Invalid file.'
        }
      };
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Verify user has access to this request
    const { data: request } = await supabase
      .from('requests')
      .select('id, user_id')
      .eq('id', requestId)
      .single();
    
    if (!request) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Request not found.'
        }
      };
    }
    
    if (request.user_id && user?.id !== request.user_id) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You do not have permission to upload to this request.'
        }
      };
    }
    
    // Generate unique file path
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const uniqueId = crypto.randomUUID();
    const storagePath = `${requestId}/${uniqueId}.${fileExtension}`;
    
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('property-documents')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: 'Failed to upload file. Please try again.'
        }
      };
    }
    
    // Create document record
    const { data: document, error: dbError } = await supabase
      .from('request_documents')
      .insert({
        request_id: requestId,
        user_id: user?.id || null,
        original_filename: file.name,
        storage_path: storagePath,
        file_type: file.type,
        file_size: file.size,
        document_type: documentType || null,
        uploaded_by: user?.email || 'anonymous',
        analysis_status: 'pending'
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('Database error:', dbError);
      // Try to delete the uploaded file
      await supabase.storage.from('property-documents').remove([storagePath]);
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to save document record.'
        }
      };
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      actor_id: user?.id || null,
      actor_type: user ? 'customer' : 'system',
      action: 'document_uploaded',
      entity_type: 'document',
      entity_id: document.id,
      metadata: {
        request_id: requestId,
        filename: file.name,
        file_size: file.size
      }
    });
    
    return {
      success: true,
      data: document
    };
    
  } catch (error) {
    console.error('Error uploading document:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred.'
      }
    };
  }
}

// ============================================================
// GET DOCUMENTS FOR REQUEST
// ============================================================

export async function getDocumentsForRequest(requestId: string): Promise<{
  success: boolean;
  data?: DocumentUpload[];
  error?: { code: string; message: string };
}> {
  try {
    const { data: documents, error } = await supabase
      .from('request_documents')
      .select('*')
      .eq('request_id', requestId)
      .order('uploaded_at', { ascending: false });
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to fetch documents.'
        }
      };
    }
    
    return {
      success: true,
      data: documents || []
    };
    
  } catch (error) {
    console.error('Error fetching documents:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch documents.'
      }
    };
  }
}

// ============================================================
// GET SIGNED URL FOR DOCUMENT
// ============================================================

export async function getDocumentSignedUrl(storagePath: string): Promise<{
  success: boolean;
  data?: { url: string };
  error?: { code: string; message: string };
}> {
  try {
    const { data, error } = await supabase.storage
      .from('property-documents')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'URL_ERROR',
          message: 'Failed to generate download URL.'
        }
      };
    }
    
    return {
      success: true,
      data: { url: data.signedUrl }
    };
    
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to generate download URL.'
      }
    };
  }
}

// ============================================================
// DELETE DOCUMENT
// ============================================================

export async function deleteDocument(documentId: string): Promise<{
  success: boolean;
  error?: { code: string; message: string };
}> {
  try {
    // Get document details
    const { data: document } = await supabase
      .from('request_documents')
      .select('storage_path, request_id, user_id')
      .eq('id', documentId)
      .single();
    
    if (!document) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found.'
        }
      };
    }
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Verify ownership
    if (document.user_id && user?.id !== document.user_id) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You do not have permission to delete this document.'
        }
      };
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('property-documents')
      .remove([document.storage_path]);
    
    if (storageError) {
      console.error('Storage delete error:', storageError);
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('request_documents')
      .delete()
      .eq('id', documentId);
    
    if (dbError) {
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to delete document record.'
        }
      };
    }
    
    return {
      success: true
    };
    
  } catch (error) {
    console.error('Error deleting document:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to delete document.'
      }
    };
  }
}
