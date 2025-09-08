export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    clearancesPerMonth: 3,
    features: ['Basic sample detection', 'Manual clearance requests', 'Email support'],
  },
  unlimited: {
    name: 'Unlimited',
    price: 29,
    clearancesPerMonth: -1, // Unlimited
    features: ['Advanced AI detection', 'Automated clearance requests', 'Priority support', 'Bulk processing'],
  },
  premium: {
    name: 'Premium',
    price: 49,
    clearancesPerMonth: -1, // Unlimited
    features: ['All Unlimited features', 'Legal review service', 'Custom licensing terms', 'Dedicated account manager'],
  },
} as const;

export const CLEARANCE_STATUSES = {
  pending: 'Pending Review',
  active: 'In Progress',
  cleared: 'Cleared',
  rejected: 'Rejected',
} as const;

export const INVOICE_STATUSES = {
  paid: 'Paid',
  unpaid: 'Unpaid',
  overdue: 'Overdue',
} as const;

export const PAYMENT_METHODS = {
  onchain: 'On-chain (USDC)',
  fiat: 'Credit Card',
} as const;

export const USAGE_TYPES = [
  'Personal',
  'Commercial',
  'Streaming',
  'Sync',
  'Broadcast',
  'Live Performance',
] as const;

export const TERRITORIES = [
  'United States',
  'North America',
  'Europe',
  'Worldwide',
  'Other',
] as const;

export const SAMPLE_DETECTION_CONFIDENCE_THRESHOLD = 0.7;

export const DEFAULT_LICENSE_TERMS = {
  territory: 'United States',
  duration: '5 years',
  usage: 'Commercial',
  royaltyRate: 10, // percentage
  upfrontFee: 100, // USD
};

export const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  supabase: process.env.NEXT_PUBLIC_SUPABASE_URL,
  turnkey: 'https://api.turnkey.com',
  pinata: 'https://api.pinata.cloud',
  stripe: 'https://api.stripe.com/v1',
} as const;

export const SUPPORTED_AUDIO_FORMATS = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/aac',
  'audio/ogg',
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const DEMO_SAMPLES = [
  {
    sampleId: 'sample-1',
    originalTrack: 'My New Beat.mp3',
    detectedSamples: [
      {
        id: 'detected-1',
        trackName: 'Funky Drummer',
        artist: 'James Brown',
        startTime: 15.2,
        endTime: 18.7,
        confidence: 0.92,
      },
    ],
    rightsInfo: {
      rightsHolderId: 'rights-1',
      publisherName: 'Universal Music Publishing',
      contactInfo: {
        email: 'licensing@ump.com',
        phone: '+1-555-0123',
      },
      ownershipPercentage: 100,
    },
    clearanceStatus: 'pending' as const,
    userId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    sampleId: 'sample-2',
    originalTrack: 'Summer Vibes Remix.wav',
    detectedSamples: [
      {
        id: 'detected-2',
        trackName: 'Apache',
        artist: 'The Incredible Bongo Band',
        startTime: 32.1,
        endTime: 36.8,
        confidence: 0.87,
      },
    ],
    rightsInfo: {
      rightsHolderId: 'rights-2',
      publisherName: 'Sony Music Publishing',
      contactInfo: {
        email: 'clearance@sonymusic.com',
      },
      ownershipPercentage: 100,
    },
    clearanceStatus: 'cleared' as const,
    userId: 'user-1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_INVOICES = [
  {
    invoiceId: 'inv-1',
    sampleId: 'sample-2',
    userId: 'user-1',
    rightsHolderId: 'rights-2',
    amount: 150,
    status: 'paid' as const,
    paymentMethod: 'onchain' as const,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    paidAt: new Date().toISOString(),
    transactionHash: '0x1234567890abcdef...',
  },
  {
    invoiceId: 'inv-2',
    sampleId: 'sample-1',
    userId: 'user-1',
    rightsHolderId: 'rights-1',
    amount: 200,
    status: 'unpaid' as const,
    paymentMethod: 'fiat' as const,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
  },
];
