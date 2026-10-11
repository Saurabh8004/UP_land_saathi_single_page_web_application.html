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
  
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Validate URL format and protocol
try {
  const urlObj = new URL(supabaseUrl);
  
  if (urlObj.protocol !== 'https:') {
    throw new Error('Supabase URL must use HTTPS protocol');
  }
  
  if (!urlObj.hostname.endsWith('.supabase.co')) {
    throw new Error('Supabase URL must be a valid *.supabase.co domain');
  }
  
  console.log('[SUPABASE] Initializing with environment variables');
  console.log('[SUPABASE] URL:', supabaseUrl);
  console.log('[SUPABASE] URL format is valid');
} catch (e) {
  console.error('[SUPABASE] ERROR: Invalid URL format:', supabaseUrl);
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}. Must be a valid HTTPS *.supabase.co domain`);
}

// Create Supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabase };

// Helper to get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper to get current session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
