// ============================================================
// PRICING CONFIGURATION
// Server-side source of truth for pricing
// ============================================================

export interface PricingPlan {
  id: string;
  name: { hi: string; en: string };
  price: number;
  currency: string;
  description: { hi: string; en: string };
  features: { hi: string[]; en: string[] };
  delivery: { hi: string; en: string };
  isPopular?: boolean;
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  DOCUMENT_INTELLIGENCE: {
    id: 'DOCUMENT_INTELLIGENCE',
    name: { hi: 'Document Intelligence', en: 'Document Intelligence' },
    price: 199,
    currency: 'INR',
    description: {
      hi: 'एक दस्तावेज़ को समझने और महत्वपूर्ण जानकारी पहचानने के लिए।',
      en: 'For understanding a document and identifying important information.'
    },
    features: {
      hi: [
        'OCR / document reading',
        'Owner / buyer / seller details',
        'Gata / Khasra / Rakba extraction',
        'Registration details',
        'Important clauses',
        'Basic inconsistency indicators',
        'Simple Hindi summary'
      ],
      en: [
        'OCR / document reading',
        'Owner / buyer / seller details',
        'Gata / Khasra / Rakba extraction',
        'Registration details',
        'Important clauses',
        'Basic inconsistency indicators',
        'Simple Hindi summary'
      ]
    },
    delivery: { hi: 'Same-day digital analysis', en: 'Same-day digital analysis' }
  },

  PROPERTY_CHECK: {
    id: 'PROPERTY_CHECK',
    name: { hi: 'Property Check', en: 'Property Check' },
    price: 999,
    currency: 'INR',
    description: {
      hi: 'सौदा करने से पहले प्रारंभिक property risk screening।',
      en: 'Preliminary property risk screening before making a deal.'
    },
    features: {
      hi: [
        'Ownership information',
        'Gata / Rakba',
        'Basic land category indicators',
        'Available litigation indicators',
        'Up to 2 documents',
        'Basic risk findings',
        'Short report'
      ],
      en: [
        'Ownership information',
        'Gata / Rakba',
        'Basic land category indicators',
        'Available litigation indicators',
        'Up to 2 documents',
        'Basic risk findings',
        'Short report'
      ]
    },
    delivery: { hi: '24-48 hours', en: '24-48 hours' }
  },

  PROPERTY_VERIFICATION: {
    id: 'PROPERTY_VERIFICATION',
    name: { hi: 'Property Verification', en: 'Property Verification' },
    price: 1999,
    currency: 'INR',
    description: {
      hi: 'प्रॉपर्टी खरीदने से पहले विस्तृत जाँच।',
      en: 'Detailed verification before buying property.'
    },
    features: {
      hi: [
        'Everything in Property Check',
        'Up to 5 documents',
        'Document comparison',
        'Ownership/share cross-check',
        'Naksha / Gata information',
        'RCCMS / court search where available',
        'Encumbrance indicators',
        'Detailed risk analysis',
        'Detailed PDF report',
        'Report explanation call'
      ],
      en: [
        'Everything in Property Check',
        'Up to 5 documents',
        'Document comparison',
        'Ownership/share cross-check',
        'Naksha / Gata information',
        'RCCMS / court search where available',
        'Encumbrance indicators',
        'Detailed risk analysis',
        'Detailed PDF report',
        'Report explanation call'
      ]
    },
    delivery: { hi: '48-72 hours', en: '48-72 hours' },
    isPopular: true
  },

  FIELD_VERIFIED: {
    id: 'FIELD_VERIFIED',
    name: { hi: 'Field Verified', en: 'Field Verified' },
    price: 4999,
    currency: 'INR',
    description: {
      hi: 'जब ऑनलाइन जाँच से आगे जाना हो।',
      en: 'When you need to go beyond online verification.'
    },
    features: {
      hi: [
        'Site visit',
        'Location verification',
        'Boundary observations',
        'Site photographs',
        'Field observations',
        'Applicable record follow-up',
        'Detailed report'
      ],
      en: [
        'Site visit',
        'Location verification',
        'Boundary observations',
        'Site photographs',
        'Field observations',
        'Applicable record follow-up',
        'Detailed report'
      ]
    },
    delivery: { hi: '5-7 days', en: '5-7 days' }
  }
};

// Helper to get plan by code
export function getPricingPlan(packageCode: string): PricingPlan | null {
  return PRICING_PLANS[packageCode] || null;
}

// Helper to get all plans
export function getAllPricingPlans(): PricingPlan[] {
  return Object.values(PRICING_PLANS);
}

// Helper to calculate amount (server-side validation)
export function calculateAmount(packageCode: string): number {
  const plan = getPricingPlan(packageCode);
  if (!plan) {
    throw new Error(`Invalid package code: ${packageCode}`);
  }
  return plan.price;
}
