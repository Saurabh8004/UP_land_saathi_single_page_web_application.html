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
    if (cache.districts) {
      return cache.districts;
    }

    try {
      // For now, use the static district data from config
      // In production, this would come from Supabase or an API
      const { DISTRICTS } = await import('../config/districts');
      
      const districts: District[] = DISTRICTS.map(d => ({
        code: d.code,
        name: d.name_en,
        nameHindi: d.name_hi
      }));

      cache.districts = districts;
      return districts;
    } catch (error) {
      console.error('[LOCATION] Error fetching districts:', error);
      throw new Error('Failed to load districts');
    }
  },

  /**
   * Get tehsils for a district
   */
  async getTehsils(districtCode: string): Promise<Tehsil[]> {
    if (cache.tehsils[districtCode]) {
      return cache.tehsils[districtCode];
    }

    try {
      // TODO: In production, fetch from Supabase or Edge Function
      // For now, return mock data for Amroha (137)
      if (districtCode === '137') {
        const tehsils: Tehsil[] = [
          {
            code: '00730',
            name: 'Amroha',
            nameHindi: 'अमरोहा',
            districtCode: '137'
          },
          {
            code: '00731',
            name: 'Hasanpur',
            nameHindi: 'हसनपुर',
            districtCode: '137'
          }
        ];
        cache.tehsils[districtCode] = tehsils;
        return tehsils;
      }

      // For other districts, return empty for now
      // In production, this would be fetched from backend
      return [];
    } catch (error) {
      console.error('[LOCATION] Error fetching tehsils:', error);
      throw new Error('Failed to load tehsils');
    }
  },

  /**
   * Get villages for a tehsil
   */
  async getVillages(districtCode: string, tehsilCode: string): Promise<Village[]> {
    const cacheKey = `${districtCode}_${tehsilCode}`;
    
    if (cache.villages[cacheKey]) {
      return cache.villages[cacheKey];
    }

    try {
      // TODO: In production, fetch from Supabase or Edge Function
      // For now, return mock data for Amroha -> Amroha
      if (districtCode === '137' && tehsilCode === '00730') {
        const villages: Village[] = [
          {
            code: '117978',
            name: 'Atairana',
            nameHindi: 'अटेरना',
            tehsilCode: '00730',
            districtCode: '137'
          },
          {
            code: '117979',
            name: 'Bhikhpur',
            nameHindi: 'भीखमपुर',
            tehsilCode: '00730',
            districtCode: '137'
          },
          {
            code: '117980',
            name: 'Chandpur',
            nameHindi: 'चांदपुर',
            tehsilCode: '00730',
            districtCode: '137'
          }
        ];
        cache.villages[cacheKey] = villages;
        return villages;
      }

      // For other combinations, return empty for now
      return [];
    } catch (error) {
      console.error('[LOCATION] Error fetching villages:', error);
      throw new Error('Failed to load villages');
    }
  },

  /**
   * Clear cache
   */
  clearCache() {
    cache.districts = null;
    cache.tehsils = {};
    cache.villages = {};
  }
};
