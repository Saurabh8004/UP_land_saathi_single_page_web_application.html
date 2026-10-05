// Pricing configuration for Bhumi Seva Kendra

export interface PricingPlan {
  name: { hi: string; en: string };
  price: number;
  currency: string;
  delivery: { hi: string; en: string };
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  DOCUMENT_INTELLIGENCE: {
    name: { hi: 'Document Intelligence', en: 'Document Intelligence' },
    price: 199,
    currency: 'INR',
    delivery: { hi: 'Same-day digital analysis', en: 'Same-day digital analysis' }
  },
  PROPERTY_CHECK: {
    name: { hi: 'Property Check', en: 'Property Check' },
    price: 999,
    currency: 'INR',
    delivery: { hi: '24-48 hours', en: '24-48 hours' }
  },
  PROPERTY_VERIFICATION: {
    name: { hi: 'Property Verification', en: 'Property Verification' },
    price: 1999,
    currency: 'INR',
    delivery: { hi: '48-72 hours', en: '48-72 hours' }
  },
  FIELD_VERIFIED: {
    name: { hi: 'Field Verified', en: 'Field Verified' },
    price: 4999,
    currency: 'INR',
    delivery: { hi: '5-7 days', en: '5-7 days' }
  }
};

export function calculateAmount(packageCode: string): number {
  const plan = PRICING_PLANS[packageCode];
  return plan?.price || 0;
}
