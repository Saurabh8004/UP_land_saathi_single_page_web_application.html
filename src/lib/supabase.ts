import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safe initialization with detailed error reporting
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  console.log('[SUPABASE] Initializing with environment variables');
  console.log('[SUPABASE] URL:', supabaseUrl);
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
} else {
  // In production, this is a critical error
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  console.error('[SUPABASE] CRITICAL: Missing environment variables:', missingVars.join(', '));
  console.error('[SUPABASE] Please set these in Vercel Dashboard → Settings → Environment Variables');
  
  // Still create a client to avoid crashes, but it will fail on queries
  supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

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
