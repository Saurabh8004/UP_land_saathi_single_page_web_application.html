import { supabase } from '../lib/supabase';

// ============================================================
// TYPES
// ============================================================

export interface District {
  code: string;
  name: string;
  nameHindi?: string;
}

export interface Tehsil {
  code: string;
  name: string;
  nameHindi?: string;
  districtCode: string;
}

export interface Village {
  code: string;
  name: string;
  nameHindi?: string;
  tehsilCode: string;
  districtCode: string;
}

// ============================================================
// CACHE
// ============================================================

const cache = {
  districts: null as District[] | null,
  tehsils: {} as Record<string, Tehsil[]>,
  villages: {} as Record<string, Village[]>
};

// ============================================================
// LOCATION SERVICE
// ============================================================

export const locationService = {
  /**
   * Get all districts
   */
  async getDistricts(): Promise<District[]> {
    console.log('[LOCATION DEBUG] Fetching districts...');
    
    if (cache.districts) {
      console.log('[LOCATION DEBUG] Returning cached districts:', cache.districts.length);
      return cache.districts;
    }

    try {
      // Query from Supabase districts table
      const { data, error } = await supabase
        .from('districts')
        .select('code, name_en, name_hi')
        .eq('is_active', true)
        .order('name_en');

      if (error) {
        console.error('[LOCATION ERROR] Failed to fetch districts:', error);
        // Show actual error details for debugging
        const errorMessage = error.message || 'Unknown error';
        const errorCode = error.code || 'NO_CODE';
        throw new Error(`Failed to load districts: ${errorMessage} (Code: ${errorCode})`);
      }

      console.log('[LOCATION DEBUG] Districts fetched:', data?.length || 0);
      console.log('[LOCATION DEBUG] First 3 districts:', data?.slice(0, 3));

      const districts: District[] = (data || []).map(d => ({
        code: d.code,
        name: d.name_en,
        nameHindi: d.name_hi
      }));

      cache.districts = districts;
      return districts;
    } catch (error) {
      console.error('[LOCATION ERROR] Error fetching districts:', error);
      // Preserve the original error message if it's already an Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to load districts: ${String(error)}`);
    }
  },

  /**
   * Get tehsils for a district
   */
  async getTehsils(districtCode: string): Promise<Tehsil[]> {
    console.log('[TEHSIL DEBUG] ========================================');
    console.log('[TEHSIL DEBUG] getTehsils called');
    console.log('[TEHSIL DEBUG] districtCode:', districtCode);
    console.log('[TEHSIL DEBUG] districtCode type:', typeof districtCode);
    
    if (cache.tehsils[districtCode]) {
      console.log('[TEHSIL DEBUG] Returning cached tehsils:', cache.tehsils[districtCode].length);
      return cache.tehsils[districtCode];
    }

    try {
      console.log('[TEHSIL DEBUG] Querying Supabase for tehsils...');
      
      // Query from Supabase tehsils table
      const { data, error } = await supabase
        .from('tehsils')
        .select('code, name_en, name_hi, district_code')
        .eq('district_code', districtCode)
        .eq('is_active', true)
        .order('name_en');

      console.log('[TEHSIL DEBUG] Supabase response received');
      console.log('[TEHSIL DEBUG] Error:', error);
      console.log('[TEHSIL DEBUG] Data:', data);
      console.log('[TEHSIL DEBUG] Number of tehsils:', data?.length || 0);

      if (error) {
        console.error('[TEHSIL ERROR] Failed to fetch tehsils:', error);
        throw new Error('Failed to load tehsils');
      }

      if (!data || data.length === 0) {
        console.warn('[TEHSIL DEBUG] No tehsils found for district:', districtCode);
        console.warn('[TEHSIL DEBUG] This district may not have tehsil data in the database');
      } else {
        console.log('[TEHSIL DEBUG] First 3 tehsils:', data.slice(0, 3));
      }

      const tehsils: Tehsil[] = (data || []).map(t => ({
        code: t.code,
        name: t.name_en,
        nameHindi: t.name_hi,
        districtCode: t.district_code
      }));

      cache.tehsils[districtCode] = tehsils;
      console.log('[TEHSIL DEBUG] Cached tehsils for district:', districtCode);
      console.log('[TEHSIL DEBUG] ========================================');
      
      return tehsils;
    } catch (error) {
      console.error('[TEHSIL ERROR] Error fetching tehsils:', error);
      console.error('[TEHSIL ERROR] districtCode:', districtCode);
      console.log('[TEHSIL DEBUG] ========================================');
      throw new Error('Failed to load tehsils');
    }
  },

  /**
   * Get villages for a tehsil
   */
  async getVillages(districtCode: string, tehsilCode: string): Promise<Village[]> {
    const cacheKey = `${districtCode}_${tehsilCode}`;
    
    console.log('[VILLAGE DEBUG] ========================================');
    console.log('[VILLAGE DEBUG] getVillages called');
    console.log('[VILLAGE DEBUG] districtCode:', districtCode);
    console.log('[VILLAGE DEBUG] tehsilCode:', tehsilCode);
    
    if (cache.villages[cacheKey]) {
      console.log('[VILLAGE DEBUG] Returning cached villages:', cache.villages[cacheKey].length);
      return cache.villages[cacheKey];
    }

    try {
      console.log('[VILLAGE DEBUG] Querying Supabase for villages...');
      
      // Query from Supabase villages table
      const { data, error } = await supabase
        .from('villages')
        .select('code, name_en, name_hi, tehsil_code, district_code')
        .eq('district_code', districtCode)
        .eq('tehsil_code', tehsilCode)
        .eq('is_active', true)
        .order('name_en');

      console.log('[VILLAGE DEBUG] Supabase response received');
      console.log('[VILLAGE DEBUG] Error:', error);
      console.log('[VILLAGE DEBUG] Data:', data);
      console.log('[VILLAGE DEBUG] Number of villages:', data?.length || 0);

      if (error) {
        console.error('[VILLAGE ERROR] Failed to fetch villages:', error);
        throw new Error('Failed to load villages');
      }

      if (!data || data.length === 0) {
        console.warn('[VILLAGE DEBUG] No villages found for tehsil:', tehsilCode);
        console.warn('[VILLAGE DEBUG] This tehsil may not have village data in the database');
      } else {
        console.log('[VILLAGE DEBUG] First 3 villages:', data.slice(0, 3));
      }

      const villages: Village[] = (data || []).map(v => ({
        code: v.code,
        name: v.name_en,
        nameHindi: v.name_hi,
        tehsilCode: v.tehsil_code,
        districtCode: v.district_code
      }));

      cache.villages[cacheKey] = villages;
      console.log('[VILLAGE DEBUG] Cached villages for tehsil:', tehsilCode);
      console.log('[VILLAGE DEBUG] ========================================');
      
      return villages;
    } catch (error) {
      console.error('[VILLAGE ERROR] Error fetching villages:', error);
      console.error('[VILLAGE ERROR] districtCode:', districtCode);
      console.error('[VILLAGE ERROR] tehsilCode:', tehsilCode);
      console.log('[VILLAGE DEBUG] ========================================');
      throw new Error('Failed to load villages');
    }
  },

  /**
   * Clear cache
   */
  clearCache() {
    console.log('[LOCATION DEBUG] Clearing cache...');
    cache.districts = null;
    cache.tehsils = {};
    cache.villages = {};
  }
};
