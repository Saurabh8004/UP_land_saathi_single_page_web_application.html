import { supabase } from '../lib/supabase';

// ============================================================
// TYPES
// ============================================================

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
}

export interface Profile {
  id: string;
  full_name: string;
  mobile: string;
  email: string | null;
  whatsapp_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// SIGN UP WITH EMAIL
// ============================================================

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  mobile: string
): Promise<{
  success: boolean;
  data?: { user: User; session: any };
  error?: { code: string; message: string };
}> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          mobile: mobile
        }
      }
    });
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'SIGNUP_ERROR',
          message: error.message
        }
      };
    }
    
    if (!data.user) {
      return {
        success: false,
        error: {
          code: 'SIGNUP_ERROR',
          message: 'Failed to create user.'
        }
      };
    }
    
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name: fullName,
        mobile: mobile,
        email: email
      });
    
    if (profileError) {
      console.error('Error creating profile:', profileError);
    }
    
    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email || null,
          phone: data.user.phone || null
        },
        session: data.session
      }
    };
    
  } catch (error) {
    console.error('Error signing up:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred.'
      }
    };
  }
}

// ============================================================
// SIGN IN WITH EMAIL
// ============================================================

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{
  success: boolean;
  data?: { user: User; session: any };
  error?: { code: string; message: string };
}> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'SIGNIN_ERROR',
          message: error.message
        }
      };
    }
    
    if (!data.user) {
      return {
        success: false,
        error: {
          code: 'SIGNIN_ERROR',
          message: 'Failed to sign in.'
        }
      };
    }
    
    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email || null,
          phone: data.user.phone || null
        },
        session: data.session
      }
    };
    
  } catch (error) {
    console.error('Error signing in:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred.'
      }
    };
  }
}

// ============================================================
// SIGN IN WITH OTP (Phone)
// ============================================================

export async function signInWithOtp(
  mobile: string
): Promise<{
  success: boolean;
  error?: { code: string; message: string };
}> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${mobile}`,
      options: {
        data: {
          mobile: mobile
        }
      }
    });
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'OTP_ERROR',
          message: error.message
        }
      };
    }
    
    return {
      success: true
    };
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to send OTP.'
      }
    };
  }
}

// ============================================================
// VERIFY OTP
// ============================================================

export async function verifyOtp(
  mobile: string,
  token: string
): Promise<{
  success: boolean;
  data?: { user: User; session: any };
  error?: { code: string; message: string };
}> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+91${mobile}`,
      token: token,
      type: 'sms'
    });
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'VERIFY_ERROR',
          message: error.message
        }
      };
    }
    
    if (!data.user) {
      return {
        success: false,
        error: {
          code: 'VERIFY_ERROR',
          message: 'Failed to verify OTP.'
        }
      };
    }
    
    // Check if profile exists, create if not
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle();
    
    if (!profile) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: 'User',
        mobile: mobile,
        email: data.user.email || null
      });
    }
    
    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email || null,
          phone: data.user.phone || null
        },
        session: data.session
      }
    };
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to verify OTP.'
      }
    };
  }
}

// ============================================================
// SIGN OUT
// ============================================================

export async function signOut(): Promise<{
  success: boolean;
  error?: { code: string; message: string };
}> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'SIGNOUT_ERROR',
          message: error.message
        }
      };
    }
    
    return {
      success: true
    };
    
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to sign out.'
      }
    };
  }
}

// ============================================================
// GET CURRENT USER
// ============================================================

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email || null,
    phone: user.phone || null
  };
}

// ============================================================
// GET PROFILE
// ============================================================

export async function getProfile(userId: string): Promise<{
  success: boolean;
  data?: Profile;
  error?: { code: string; message: string };
}> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Profile not found.'
        }
      };
    }
    
    return {
      success: true,
      data: profile
    };
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch profile.'
      }
    };
  }
}

// ============================================================
// UPDATE PROFILE
// ============================================================

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'full_name' | 'mobile' | 'email' | 'whatsapp_opt_in'>>
): Promise<{
  success: boolean;
  data?: Profile;
  error?: { code: string; message: string };
}> {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error.message
        }
      };
    }
    
    return {
      success: true,
      data: profile
    };
    
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to update profile.'
      }
    };
  }
}
