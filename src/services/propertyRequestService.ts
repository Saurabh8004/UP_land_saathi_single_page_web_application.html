import { supabase } from '../lib/supabase';

// ============================================================
// TYPES
// ============================================================

export interface PropertyRequestInput {
  districtCode: string;
  districtName: string;
  tehsilCode: string;
  tehsilName: string;
  villageCode: string;
  villageName: string;
  gataNumber?: string;
  khataNumber?: string;
  userId?: string;
}

export interface PropertyRequest {
  id: string;
  request_id: string;
  user_id: string | null;
  district_code: string;
  district_name: string;
  tehsil_code: string;
  tehsil_name: string;
  village_code: string;
  village_name: string;
  gata_number: string | null;
  khata_number: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// PROPERTY REQUEST SERVICE
// ============================================================

export const propertyRequestService = {
  /**
   * Create a new property request
   */
  async createPropertyRequest(input: PropertyRequestInput): Promise<PropertyRequest> {
    try {
      console.log('[PROPERTY_REQUEST] Creating request with input:', input);

      // Generate a unique request ID
      const requestId = `BSK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Insert into property_requests table
      const { data, error } = await supabase
        .from('property_requests')
        .insert({
          request_id: requestId,
          user_id: input.userId || null,
          district_code: input.districtCode,
          district_name: input.districtName,
          tehsil_code: input.tehsilCode,
          tehsil_name: input.tehsilName,
          village_code: input.villageCode,
          village_name: input.villageName,
          gata_number: input.gataNumber || null,
          khata_number: input.khataNumber || null,
          status: 'created',
          error_message: null
        })
        .select()
        .single();

      if (error) {
        console.error('[PROPERTY_REQUEST] Database error:', error);
        throw new Error('Failed to create property request');
      }

      console.log('[PROPERTY_REQUEST] Request created successfully:', data);
      return data as PropertyRequest;
    } catch (error) {
      console.error('[PROPERTY_REQUEST] Error creating request:', error);
      throw error;
    }
  },

  /**
   * Update property request with Gata/Khata information
   */
  async updatePropertyRequest(
    requestId: string,
    updates: {
      gataNumber?: string;
      khataNumber?: string;
      status?: string;
      errorMessage?: string;
    }
  ): Promise<PropertyRequest> {
    try {
      console.log('[PROPERTY_REQUEST] Updating request:', requestId, updates);

      const { data, error } = await supabase
        .from('property_requests')
        .update({
          gata_number: updates.gataNumber,
          khata_number: updates.khataNumber,
          status: updates.status,
          error_message: updates.errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) {
        console.error('[PROPERTY_REQUEST] Update error:', error);
        throw new Error('Failed to update property request');
      }

      console.log('[PROPERTY_REQUEST] Request updated successfully:', data);
      return data as PropertyRequest;
    } catch (error) {
      console.error('[PROPERTY_REQUEST] Error updating request:', error);
      throw error;
    }
  },

  /**
   * Get property request by ID
   */
  async getPropertyRequest(requestId: string): Promise<PropertyRequest | null> {
    try {
      const { data, error } = await supabase
        .from('property_requests')
        .select()
        .eq('id', requestId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('[PROPERTY_REQUEST] Fetch error:', error);
        throw new Error('Failed to fetch property request');
      }

      return data as PropertyRequest;
    } catch (error) {
      console.error('[PROPERTY_REQUEST] Error fetching request:', error);
      throw error;
    }
  }
};
