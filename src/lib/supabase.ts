import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const envStatus = {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  urlValue: supabaseUrl || '(not set)',
  urlType: typeof supabaseUrl
};

console.log('[SUPABASE] ════════════════════════════════════════════════════════');
console.log('[SUPABASE] Environment variable status:');
console.log('[SUPABASE]   VITE_SUPABASE_URL:', envStatus.hasUrl ? '✓ Set' : '✗ Missing');
console.log('[SUPABASE]   VITE_SUPABASE_ANON_KEY:', envStatus.hasAnonKey ? '✓ Set' : '✗ Missing');
console.log('[SUPABASE]   URL type:', envStatus.urlType);
console.log('[SUPABASE]   URL length:', supabaseUrl ? supabaseUrl.length : 0);

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  console.error('[SUPABASE] ════════════════════════════════════════════════════════');
  console.error('[SUPABASE] CRITICAL: Missing environment variables:', missingVars.join(', '));
  console.error('[SUPABASE] ════════════════════════════════════════════════════════');
  console.error('[SUPABASE] This will cause "Failed to fetch" errors.');
  console.error('[SUPABASE] Fix: Set these in Vercel Dashboard → Settings → Environment Variables');
  console.error('[SUPABASE] Then REDEPLOY the project (environment vars are baked into the build)');
  console.error('[SUPABASE] ════════════════════════════════════════════════════════');
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
      console.log('[SUPABASE] URL hostname:', urlObj.hostname);
      console.log('[SUPABASE] URL format is valid');
    }
  } catch (e) {
    console.error('[SUPABASE] ERROR: Invalid URL format:', supabaseUrl);
  }
}

// Create Supabase client
let supabase: SupabaseClient;
let isUsingDummyClient = false;

if (!supabaseUrl || !supabaseAnonKey) {
  // Cannot create a valid client without credentials
  // Create a dummy client that will fail with clear errors
  isUsingDummyClient = true;
  console.error('[SUPABASE] ════════════════════════════════════════════════════════');
  console.error('[SUPABASE] ⚠️  CREATING DUMMY CLIENT - All queries will fail!');
  console.error('[SUPABASE] This means environment variables are NOT loaded in this build.');
  console.error('[SUPABASE] The deployment needs to be REBUILT with the environment variables.');
  console.error('[SUPABASE] ════════════════════════════════════════════════════════');
  supabase = createClient(
    'https://invalid.supabase.co',
    'invalid-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
} else {
  // Valid credentials - create real client
  isUsingDummyClient = false;
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
  console.log('[SUPABASE] ════════════════════════════════════════════════════════');
  console.log('[SUPABASE] ✓ Client initialized with REAL credentials');
  console.log('[SUPABASE] Target URL hostname:', new URL(supabaseUrl).hostname);
  console.log('[SUPABASE] ════════════════════════════════════════════════════════');
}

// Export diagnostic function
export function getSupabaseDiagnostics() {
  return {
    isUsingDummyClient,
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    urlHostname: supabaseUrl ? new URL(supabaseUrl).hostname : null,
    buildTime: new Date().toISOString()
  };
}

export { supabase };

// Helper to get current user
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('[SUPABASE] Error getting user:', error.message);
      return null;
    }
    return data?.user ?? null;
  } catch (err) {
    console.error('[SUPABASE] Exception getting user:', err);
    return null;
  }
}

// Helper to get current session
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[SUPABASE] Error getting session:', error.message);
      return null;
    }
    return data?.session ?? null;
  } catch (err) {
    console.error('[SUPABASE] Exception getting session:', err);
    return null;
  }
}
