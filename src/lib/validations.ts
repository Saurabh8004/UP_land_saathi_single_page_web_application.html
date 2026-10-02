import { z } from 'zod';

// ============================================================
// BOOKING VALIDATION
// ============================================================

export const bookingSchema = z.object({
  // Customer details
  customerName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  customerMobile: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  
  customerEmail: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  
  // Property details
  district: z.string()
    .min(1, 'Please select a district'),
  
  tehsil: z.string()
    .max(100)
    .optional()
    .or(z.literal('')),
  
  village: z.string()
    .max(100)
    .optional()
    .or(z.literal('')),
  
  gataKhasra: z.string()
    .min(1, 'Gata/Khasra number is required')
    .max(50, 'Gata/Khasra must be less than 50 characters'),
  
  area: z.string()
    .max(50)
    .optional()
    .or(z.literal('')),
  
  ownerName: z.string()
    .max(100)
    .optional()
    .or(z.literal('')),
  
  propertyType: z.string()
    .max(50)
    .optional()
    .or(z.literal('')),
  
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  
  // Service selection
  packageCode: z.string()
    .min(1, 'Please select a service package'),
  
  // Consent
  consentGiven: z.boolean()
    .refine(val => val === true, {
      message: 'You must agree to the privacy policy to continue'
    }),
  
  privacyPolicyVersion: z.string()
    .default('1.0')
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// ============================================================
// LOGIN VALIDATION
// ============================================================

export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address'),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================
// SIGNUP VALIDATION
// ============================================================

export const signupSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z.string()
    .email('Please enter a valid email address'),
  
  mobile: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type SignupFormData = z.infer<typeof signupSchema>;

// ============================================================
// TRACK REQUEST VALIDATION
// ============================================================

export const trackRequestSchema = z.object({
  requestId: z.string()
    .regex(/^BSK-\d{4}-\d{6}$/, 'Please enter a valid request ID (e.g., BSK-2026-000001)'),
  
  mobile: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter the 10-digit mobile number used during booking')
});

export type TrackRequestData = z.infer<typeof trackRequestSchema>;

// ============================================================
// B2B LEAD VALIDATION
// ============================================================

export const b2bLeadSchema = z.object({
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(200, 'Company name must be less than 200 characters'),
  
  contactPerson: z.string()
    .min(2, 'Contact person name must be at least 2 characters')
    .max(100, 'Contact person name must be less than 100 characters'),
  
  mobile: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  
  monthlyVolume: z.string()
    .max(50)
    .optional()
    .or(z.literal('')),
  
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .or(z.literal(''))
});

export type B2BLeadFormData = z.infer<typeof b2bLeadSchema>;

// ============================================================
// DOCUMENT UPLOAD VALIDATION
// ============================================================

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size must be less than 10 MB'
    };
  }
  
  // Check MIME type
  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    return {
      valid: false,
      error: 'Only PDF, JPG, and PNG files are allowed'
    };
  }
  
  // Check extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
  
  if (!extension || !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'Invalid file extension. Only .pdf, .jpg, .jpeg, and .png are allowed'
    };
  }
  
  return { valid: true };
}

export function sanitizeFilename(filename: string): string {
  // Remove special characters and spaces
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}
