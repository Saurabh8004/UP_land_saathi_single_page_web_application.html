import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  console.error('[SUPABASE] CRITICAL: Missing environment variables:', missingVars.join(', '));
  console.error('[SUPABASE] Please set these in Vercel Dashboard → Settings → Environment Variables');
  console.error('[SUPABASE] IMPORTANT: After setting variables, you must REDEPLOY for them to take effect');
  
  // Don't throw - allow app to load with degraded functionality
  // Queries will fail gracefully with clear error messages
}

// Validate URL format and protocol (only if variables exist)
let isValidUrl = false;
if (supabaseUrl) {
  try {
    const urlObj = new URL(supabaseUrl);
    
    if (urlObj.protocol !== 'https:') {
      console.error('[SUPABASE] ERROR: Supabase URL must use HTTPS protocol');
    } else if (!urlObj.hostname.endsWith('.supabase.co')) {
      console.error('[SUPABASE] ERROR: Supabase URL must be a valid *.supabase.co domain');
    } else {
      isValidUrl = true;
      console.log('[SUPABASE] Initializing with environment variables');
      console.log('[SUPABASE] URL:', supabaseUrl);
      console.log('[SUPABASE] URL format is valid');
    }
  } catch (e) {
    console.error('[SUPABASE] ERROR: Invalid URL format:', supabaseUrl);
  }
}

// Create Supabase client (safe initialization)
// If env vars are missing or invalid, create a client that will fail gracefully on queries
const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);

export { supabase };

// Helper to get current user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('[SUPABASE] Error getting user:', error.message);
      return null;
    }
    return user;
  } catch (err) {
    console.error('[SUPABASE] Exception getting user:', err);
    return null;
  }
}

// Helper to get current session
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[SUPABASE] Error getting session:', error.message);
      return null;
    }
    return session;
  } catch (err) {
    console.error('[SUPABASE] Exception getting session:', err);
    return null;
  }
}
