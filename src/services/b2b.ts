import { supabase } from '../lib/supabase';

// ============================================================
// TYPES
// ============================================================

export interface B2BLead {
  id: string;
  company_name: string;
  contact_person: string;
  mobile: string;
  email: string | null;
  monthly_volume: string | null;
  city: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateB2BLeadInput {
  companyName: string;
  contactPerson: string;
  mobile: string;
  email?: string;
  monthlyVolume?: string;
  city: string;
}

// ============================================================
// CREATE B2B LEAD
// ============================================================

export async function createB2BLead(input: CreateB2BLeadInput): Promise<{
  success: boolean;
  data?: B2BLead;
  error?: { code: string; message: string };
}> {
  try {
    // Validate mobile number
    if (!/^[0-9]{10}$/.test(input.mobile)) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid mobile number.'
        }
      };
    }
    
    // Validate email if provided
    if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email address.'
        }
      };
    }
    
    const { data: lead, error } = await supabase
      .from('leads_b2b')
      .insert({
        company_name: input.companyName,
        contact_person: input.contactPerson,
        mobile: input.mobile,
        email: input.email || null,
        monthly_volume: input.monthlyVolume || null,
        city: input.city,
        status: 'new'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to create lead.'
        }
      };
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      actor_type: 'system',
      action: 'b2b_lead_created',
      entity_type: 'lead',
      entity_id: lead.id,
      metadata: {
        company_name: input.companyName,
        city: input.city
      }
    });
    
    return {
      success: true,
      data: lead
    };
    
  } catch (error) {
    console.error('Error creating B2B lead:', error);
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
// GET ALL B2B LEADS (Admin only)
// ============================================================

export async function getAllB2BLeads(): Promise<{
  success: boolean;
  data?: B2BLead[];
  error?: { code: string; message: string };
}> {
  try {
    const { data: leads, error } = await supabase
      .from('leads_b2b')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to fetch leads.'
        }
      };
    }
    
    return {
      success: true,
      data: leads || []
    };
    
  } catch (error) {
    console.error('Error fetching B2B leads:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch leads.'
      }
    };
  }
}

// ============================================================
// UPDATE B2B LEAD STATUS (Admin only)
// ============================================================

export async function updateB2BLeadStatus(
  leadId: string,
  status: string,
  notes?: string
): Promise<{
  success: boolean;
  data?: B2BLead;
  error?: { code: string; message: string };
}> {
  try {
    const validStatuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'lost'];
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid status.'
        }
      };
    }
    
    const updates: any = { status };
    if (notes !== undefined) {
      updates.notes = notes;
    }
    
    const { data: lead, error } = await supabase
      .from('leads_b2b')
      .update(updates)
      .eq('id', leadId)
      .select()
      .single();
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to update lead.'
        }
      };
    }
    
    return {
      success: true,
      data: lead
    };
    
  } catch (error) {
    console.error('Error updating B2B lead:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to update lead.'
      }
    };
  }
}

// ============================================================
// EXPORT B2B LEADS TO CSV (Admin only)
// ============================================================

export async function exportB2BLeadsToCSV(): Promise<{
  success: boolean;
  data?: { csv: string; filename: string };
  error?: { code: string; message: string };
}> {
  try {
    const result = await getAllB2BLeads();
    
    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error || {
          code: 'UNKNOWN_ERROR',
          message: 'Failed to fetch leads.'
        }
      };
    }
    
    // Convert to CSV
    const headers = ['Company Name', 'Contact Person', 'Mobile', 'Email', 'Monthly Volume', 'City', 'Status', 'Created At'];
    const rows = result.data.map(lead => [
      lead.company_name,
      lead.contact_person,
      lead.mobile,
      lead.email || '',
      lead.monthly_volume || '',
      lead.city,
      lead.status,
      new Date(lead.created_at).toLocaleDateString()
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const filename = `B2B-Leads-${new Date().toISOString().split('T')[0]}.csv`;
    
    return {
      success: true,
      data: { csv, filename }
    };
    
  } catch (error) {
    console.error('Error exporting B2B leads:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to export leads.'
      }
    };
  }
}
