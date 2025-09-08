import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency: 'USD' | 'USDC' = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'USDC' ? 'USD' : currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SS-${timestamp}-${random}`.toUpperCase();
}

export function calculateLicenseFee(
  duration: number,
  usage: string,
  territory: string,
  baseRate: number = 0.1
): number {
  let multiplier = 1;
  
  // Usage type multiplier
  switch (usage.toLowerCase()) {
    case 'commercial':
      multiplier *= 2;
      break;
    case 'streaming':
      multiplier *= 1.5;
      break;
    case 'sync':
      multiplier *= 3;
      break;
    default:
      multiplier *= 1;
  }
  
  // Territory multiplier
  switch (territory.toLowerCase()) {
    case 'worldwide':
      multiplier *= 2;
      break;
    case 'north america':
      multiplier *= 1.5;
      break;
    default:
      multiplier *= 1;
  }
  
  // Duration multiplier (per second)
  const durationMultiplier = Math.max(duration / 30, 0.5); // Minimum 0.5x for very short samples
  
  const baseFee = 50; // Base fee in USD
  return Math.round(baseFee * multiplier * durationMultiplier);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'paid':
    case 'cleared':
      return 'status-active';
    case 'pending':
      return 'status-pending';
    case 'unpaid':
      return 'status-unpaid';
    case 'overdue':
      return 'status-overdue';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateWalletAddress(address: string): boolean {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
}
