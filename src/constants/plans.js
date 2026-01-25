export const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 49,
    yearlyPrice: 490,
    minutes: 100,
    features: [
      '100 minutes/month',
      '1 phone number',
      'All features included',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 99,
    yearlyPrice: 990,
    minutes: 300,
    recommended: true,
    features: [
      '300 minutes/month',
      '1 phone number',
      'All features included',
    ],
  },
};

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'GB', name: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'DE', name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'FR', name: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'NL', name: 'Netherlands', flag: '\u{1F1F3}\u{1F1F1}' },
  { code: 'ES', name: 'Spain', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'IT', name: 'Italy', flag: '\u{1F1EE}\u{1F1F9}' },
  { code: 'AT', name: 'Austria', flag: '\u{1F1E6}\u{1F1F9}' },
];

export const BILLING_PERIODS = {
  monthly: 'monthly',
  yearly: 'yearly',
};
