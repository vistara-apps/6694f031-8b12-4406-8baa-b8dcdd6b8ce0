export interface User {
  userId: string;
  username: string;
  walletAddress: string;
  email: string;
  subscriptionTier: 'free' | 'unlimited' | 'premium';
}

export interface Sample {
  sampleId: string;
  originalTrack: string;
  detectedSamples: DetectedSample[];
  rightsInfo: RightsInfo;
  clearanceStatus: 'pending' | 'active' | 'cleared' | 'rejected';
  licenseTerms?: LicenseTerms;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DetectedSample {
  id: string;
  trackName: string;
  artist: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface RightsInfo {
  rightsHolderId: string;
  publisherName: string;
  contactInfo: ContactInfo;
  ownershipPercentage: number;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  address?: string;
}

export interface LicenseTerms {
  territory: string;
  duration: string;
  usage: string;
  royaltyRate: number;
  upfrontFee: number;
}

export interface RightsHolder {
  rightsHolderId: string;
  name: string;
  contactInfo: ContactInfo;
  managedSamples: string[];
}

export interface Invoice {
  invoiceId: string;
  sampleId: string;
  userId: string;
  rightsHolderId: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  paymentMethod: 'onchain' | 'fiat';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  transactionHash?: string;
  ipfsHash?: string;
}

export interface ClearanceRequest {
  requestId: string;
  sampleId: string;
  userId: string;
  rightsHolderId: string;
  message: string;
  proposedTerms: LicenseTerms;
  status: 'sent' | 'responded' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
}
