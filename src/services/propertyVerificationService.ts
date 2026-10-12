import { supabase } from '../lib/supabase';

export interface PropertyVerificationRequest {
  user_id?: string | null; // Optional for anonymous submissions
  full_name: string;
  mobile_number: string;
  district: string;
  tehsil?: string;
  gata_khasra_number?: string;
  additional_information?: string;
}

export interface PropertyVerificationResponse {
  success: boolean;
  requestId?: string;
  error?: string;
}

/**
 * Generate a unique request ID in format: BSK-YYYYMMDD-XXXXXX
 */
function generateRequestId(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BSK-${dateStr}-${randomStr}`;
}

/**
 * Save property verification request to Supabase
 */
export async function savePropertyVerificationRequest(
  data: PropertyVerificationRequest
): Promise<PropertyVerificationResponse> {
  const startTime = Date.now();
  
  try {
    // Import diagnostics
    const { getSupabaseDiagnostics } = await import('../lib/supabase');
    const diagnostics = getSupabaseDiagnostics();
    
    console.log('[PROPERTY_VERIFICATION] ════════════════════════════════════════════════════════');
    console.log('[PROPERTY_VERIFICATION] Starting request submission...');
    console.log('[PROPERTY_VERIFICATION] Request ID will be:', generateRequestId());
    console.log('[PROPERTY_VERIFICATION] Supabase client status:', {
      isUsingDummyClient: diagnostics.isUsingDummyClient,
      hasUrl: diagnostics.hasUrl,
      hasAnonKey: diagnostics.hasAnonKey,
      urlHostname: diagnostics.urlHostname
    });
    
    if (diagnostics.isUsingDummyClient) {
      console.error('[PROPERTY_VERIFICATION] ⚠️  WARNING: Using dummy client - request will fail!');
      console.error('[PROPERTY_VERIFICATION] The deployment needs to be rebuilt with environment variables.');
      return {
        success: false,
        error: 'Supabase client not properly initialized. Please contact support or redeploy the application.'
      };
    }
    
    const requestId = generateRequestId();

    console.log('[PROPERTY_VERIFICATION] Attempting to insert request into database...');
    console.log('[PROPERTY_VERIFICATION] Table: requests');
    console.log('[PROPERTY_VERIFICATION] Request ID:', requestId);

    // Insert into requests table
    // Using 'whatsapp_verification' as service_type and 'free' as package_code
    // since this is a free WhatsApp-based verification request
    // user_id can be null for anonymous Property Verification requests
    const { data: insertData, error: insertError } = await supabase
      .from('requests')
      .insert({
        request_id: requestId,
        user_id: data.user_id || null, // Allow null for anonymous submissions
        service_type: 'whatsapp_verification',
        package_code: 'free',
        status: 'received',
        customer_name: data.full_name,
        mobile: data.mobile_number,
        district: data.district,
        tehsil: data.tehsil || null,
        village: null,
        gata_khasra: data.gata_khasra_number || null,
        area: null,
        owner_name: null,
        property_type: null,
        notes: data.additional_information || null,
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
        privacy_policy_version: '1.0'
      })
      .select('id, request_id')
      .single();

    const duration = Date.now() - startTime;
    console.log('[PROPERTY_VERIFICATION] Request completed in', duration, 'ms');

    if (insertError) {
      console.error('[PROPERTY_VERIFICATION] ════════════════════════════════════════════════════════');
      console.error('[PROPERTY_VERIFICATION] ❌ Database insert error:');
      console.error('[PROPERTY_VERIFICATION] Error message:', insertError.message);
      console.error('[PROPERTY_VERIFICATION] Error code:', insertError.code);
      console.error('[PROPERTY_VERIFICATION] Error details:', insertError.details);
      console.error('[PROPERTY_VERIFICATION] Error hint:', insertError.hint);
      console.error('[PROPERTY_VERIFICATION] ════════════════════════════════════════════════════════');
      
      // Check for specific error types
      if (insertError.code === '23505') {
        return {
          success: false,
          error: 'Request ID already exists. Please try again.'
        };
      }
      
      if (insertError.code === '23503') {
        return {
          success: false,
          error: 'Database constraint violation. Please contact support.'
        };
      }
      
      // Check for network/fetch errors
      if (insertError.message === 'Failed to fetch' || insertError.code === 'NETWORK_ERROR') {
        console.error('[PROPERTY_VERIFICATION] ⚠️  NETWORK ERROR DETECTED');
        console.error('[PROPERTY_VERIFICATION] This could be:');
        console.error('[PROPERTY_VERIFICATION]   - CORS issue');
        console.error('[PROPERTY_VERIFICATION]   - Supabase URL is unreachable');
        console.error('[PROPERTY_VERIFICATION]   - Network connectivity issue');
        console.error('[PROPERTY_VERIFICATION]   - Firewall blocking the request');
        return {
          success: false,
          error: `Network error: Cannot connect to database. Please check your internet connection and try again.`
        };
      }
      
      return {
        success: false,
        error: `Failed to save request: ${insertError.message}`
      };
    }

    if (!insertData) {
      console.error('[PROPERTY_VERIFICATION] ❌ No data returned from database');
      return {
        success: false,
        error: 'No data returned from database'
      };
    }

    console.log('[PROPERTY_VERIFICATION] ════════════════════════════════════════════════════════');
    console.log('[PROPERTY_VERIFICATION] ✓ Request saved successfully!');
    console.log('[PROPERTY_VERIFICATION] Request ID:', insertData.request_id);
    console.log('[PROPERTY_VERIFICATION] Duration:', duration, 'ms');
    console.log('[PROPERTY_VERIFICATION] ════════════════════════════════════════════════════════');

    return {
      success: true,
      requestId: insertData.request_id
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[PROPERTY_VERIFICATION] ════════════════════════════════════════════════════════');
    console.error('[PROPERTY_VERIFICATION] ❌ UNEXPECTED ERROR:');
    console.error('[PROPERTY_VERIFICATION] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[PROPERTY_VERIFICATION] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[PROPERTY_VERIFICATION] Error stack:', error instanceof Error ? error.stack : 'N/A');
    console.error('[PROPERTY_VERIFICATION] Duration:', duration, 'ms');
    console.error('[PROPERTY_VERIFICATION] ════════════════════════════════════════════════════════');
    
    if (error instanceof Error) {
      // Check for network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return {
          success: false,
          error: 'Network error: Cannot connect to server. Please check your internet connection and try again.'
        };
      }
      
      return {
        success: false,
        error: `Unexpected error: ${error.message}`
      };
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}
