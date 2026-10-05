// Pricing configuration for Bhumi Saathi
// This is a placeholder for future payment integration

export const PRICING = {
  basic: {
    name: 'Basic Search',
    price: 0,
    currency: 'INR'
  },
  premium: {
    name: 'Premium Verification',
    price: 499,
    currency: 'INR'
  }
};

export function calculateAmount(packageCode: string): number {
  const pkg = PRICING[packageCode as keyof typeof PRICING];
  return pkg?.price || 0;
}
