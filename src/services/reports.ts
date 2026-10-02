import { supabase } from '../lib/supabase';

// ============================================================
// TYPES
// ============================================================

export interface Report {
  id: string;
  request_id: string;
  report_number: string | null;
  storage_path: string;
  status: string;
  version: number;
  uploaded_at: string;
  ready_at: string | null;
}

// ============================================================
// GET REPORT FOR REQUEST
// ============================================================

export async function getReportForRequest(requestId: string): Promise<{
  success: boolean;
  data?: Report;
  error?: { code: string; message: string };
}> {
  try {
    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('request_id', requestId)
      .eq('status', 'ready')
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to fetch report.'
        }
      };
    }
    
    return {
      success: true,
      data: report || undefined
    };
    
  } catch (error) {
    console.error('Error fetching report:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch report.'
      }
    };
  }
}

// ============================================================
// GET SIGNED URL FOR REPORT DOWNLOAD
// ============================================================

export async function getReportSignedUrl(storagePath: string): Promise<{
  success: boolean;
  data?: { url: string };
  error?: { code: string; message: string };
}> {
  try {
    const { data, error } = await supabase.storage
      .from('reports')
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
// LOG REPORT DOWNLOAD
// ============================================================

export async function logReportDownload(
  reportId: string,
  requestId: string,
  userId?: string
): Promise<void> {
  try {
    await supabase.from('report_downloads').insert({
      report_id: reportId,
      request_id: requestId,
      user_id: userId || null,
      ip_hash: null // Will be set server-side in production
    });
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      actor_id: userId || null,
      actor_type: userId ? 'customer' : 'system',
      action: 'report_downloaded',
      entity_type: 'report',
      entity_id: reportId,
      metadata: { request_id: requestId }
    });
  } catch (error) {
    console.error('Error logging report download:', error);
  }
}

// ============================================================
// DOWNLOAD REPORT
// ============================================================

export async function downloadReport(
  requestId: string,
  userId?: string
): Promise<{
  success: boolean;
  data?: { url: string; filename: string };
  error?: { code: string; message: string };
}> {
  try {
    // Get report
    const reportResult = await getReportForRequest(requestId);
    
    if (!reportResult.success || !reportResult.data) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Report not found or not ready.'
        }
      };
    }
    
    const report = reportResult.data;
    
    // Verify user has access
    const { data: request } = await supabase
      .from('requests')
      .select('user_id, customer_mobile')
      .eq('id', requestId)
      .single();
    
    if (request?.user_id && userId && request.user_id !== userId) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You do not have permission to download this report.'
        }
      };
    }
    
    // Get signed URL
    const urlResult = await getReportSignedUrl(report.storage_path);
    
    if (!urlResult.success || !urlResult.data) {
      return {
        success: false,
        error: urlResult.error || {
          code: 'URL_ERROR',
          message: 'Failed to generate download URL.'
        }
      };
    }
    
    // Log download
    await logReportDownload(report.id, requestId, userId);
    
    // Generate filename
    const filename = `BSK-Report-${requestId}.pdf`;
    
    return {
      success: true,
      data: {
        url: urlResult.data.url,
        filename
      }
    };
    
  } catch (error) {
    console.error('Error downloading report:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to download report.'
      }
    };
  }
}
