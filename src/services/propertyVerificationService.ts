import { supabase } from '../lib/supabase';

export interface PropertyVerificationRequest {
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
  try {
    const requestId = generateRequestId();

    // Insert into requests table
    // Using 'whatsapp_verification' as service_type and 'free' as package_code
    // since this is a free WhatsApp-based verification request
    const { data: insertData, error: insertError } = await supabase
      .from('requests')
      .insert({
        request_id: requestId,
        user_id: null, // Anonymous request
        service_type: 'whatsapp_verification',
        package_code: 'free',
        status: 'received',
        customer_name: data.full_name,
        customer_mobile: data.mobile_number,
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

    if (insertError) {
      console.error('[PROPERTY_VERIFICATION] Database insert error:', insertError);
      
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
      
      return {
        success: false,
        error: `Failed to save request: ${insertError.message}`
      };
    }

    if (!insertData) {
      return {
        success: false,
        error: 'No data returned from database'
      };
    }

    console.log('[PROPERTY_VERIFICATION] Request saved successfully:', insertData.request_id);

    return {
      success: true,
      requestId: insertData.request_id
    };

  } catch (error) {
    console.error('[PROPERTY_VERIFICATION] Unexpected error:', error);
    
    if (error instanceof Error) {
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
