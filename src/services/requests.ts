import { supabase } from '../lib/supabase';
import { calculateAmount } from '../config/pricing';

// ============================================================
// TYPES
// ============================================================

export interface CreateRequestInput {
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  packageCode: string;
  district: string;
  tehsil?: string;
  village?: string;
  gataKhasra: string;
  area?: string;
  ownerName?: string;
  propertyType?: string;
  notes?: string;
  consentGiven: boolean;
  privacyPolicyVersion: string;
}

export interface Request {
  id: string;
  request_id: string;
  user_id: string | null;
  service_type: string;
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

// ============================================================
// REQUEST ID GENERATOR
// Format: BSK-2026-XXXXXX
// ============================================================

function generateRequestId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `BSK-${year}-${randomNum}`;
}

// ============================================================
// CREATE REQUEST
// ============================================================

export async function createRequest(input: CreateRequestInput): Promise<{
  success: boolean;
  data?: { requestId: string; requestUuid: string; amount: number; status: string };
  error?: { code: string; message: string };
}> {
  try {
    // Validate package code and calculate amount server-side
    const amount = calculateAmount(input.packageCode);
    
    // Generate human-friendly request ID
    const requestId = generateRequestId();
    
    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create request record
    const { data: request, error: dbError } = await supabase
      .from('requests')
      .insert({
        request_id: requestId,
        user_id: user?.id || null,
        service_type: 'property_verification',
        package_code: input.packageCode,
        status: 'payment_pending',
        customer_name: input.customerName,
        customer_mobile: input.customerMobile,
        customer_email: input.customerEmail || null,
        district: input.district,
        tehsil: input.tehsil || null,
        village: input.village || null,
        gata_khasra: input.gataKhasra,
        area: input.area || null,
        owner_name: input.ownerName || null,
        property_type: input.propertyType || null,
        notes: input.notes || null,
        consent_given: input.consentGiven,
        consent_timestamp: input.consentGiven ? new Date().toISOString() : null,
        privacy_policy_version: input.privacyPolicyVersion
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('Database error creating request:', dbError);
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to create request. Please try again.'
        }
      };
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      actor_id: user?.id || null,
      actor_type: user ? 'customer' : 'system',
      action: 'request_created',
      entity_type: 'request',
      entity_id: request.id,
      metadata: {
        request_id: requestId,
        package_code: input.packageCode,
        amount: amount
      }
    });
    
    return {
      success: true,
      data: {
        requestId: request.request_id,
        requestUuid: request.id,
        amount: amount,
        status: request.status
      }
    };
    
  } catch (error) {
    console.error('Error creating request:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred. Please try again.'
      }
    };
  }
}

// ============================================================
// GET REQUEST BY ID
// ============================================================

export async function getRequestByRequestId(requestId: string): Promise<{
  success: boolean;
  data?: Request;
  error?: { code: string; message: string };
}> {
  try {
    const { data: request, error } = await supabase
      .from('requests')
      .select('*')
      .eq('request_id', requestId)
      .single();
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Request not found.'
        }
      };
    }
    
    return {
      success: true,
      data: request
    };
    
  } catch (error) {
    console.error('Error fetching request:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch request.'
      }
    };
  }
}

// ============================================================
// GET REQUESTS FOR USER
// ============================================================

export async function getUserRequests(userId: string): Promise<{
  success: boolean;
  data?: Request[];
  error?: { code: string; message: string };
}> {
  try {
    const { data: requests, error } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to fetch requests.'
        }
      };
    }
    
    return {
      success: true,
      data: requests || []
    };
    
  } catch (error) {
    console.error('Error fetching user requests:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch requests.'
      }
    };
  }
}

// ============================================================
// TRACK REQUEST (Public - by request_id + mobile)
// ============================================================

export async function trackRequest(requestId: string, mobile: string): Promise<{
  success: boolean;
  data?: Request;
  error?: { code: string; message: string };
}> {
  try {
    const { data: request, error } = await supabase
      .from('requests')
      .select('*')
      .eq('request_id', requestId)
      .eq('customer_mobile', mobile)
      .single();
    
    if (error || !request) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Request not found or mobile number does not match.'
        }
      };
    }
    
    return {
      success: true,
      data: request
    };
    
  } catch (error) {
    console.error('Error tracking request:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to track request.'
      }
    };
  }
}

// ============================================================
// GET VERIFICATION UPDATES
// ============================================================

export async function getVerificationUpdates(requestId: string): Promise<{
  success: boolean;
  data?: any[];
  error?: { code: string; message: string };
}> {
  try {
    const { data: updates, error } = await supabase
      .from('verification_updates')
      .select('status, public_message, created_at')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to fetch updates.'
        }
      };
    }
    
    return {
      success: true,
      data: updates || []
    };
    
  } catch (error) {
    console.error('Error fetching updates:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch updates.'
      }
    };
  }
}
