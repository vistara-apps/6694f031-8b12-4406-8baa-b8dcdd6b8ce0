'use client';

import { useWalletClient, usePublicClient } from 'wagmi';
import { withPaymentInterceptor } from 'x402-axios';
import { base } from 'wagmi/chains';
import { parseUnits, formatUnits } from 'viem';
import axios from 'axios';

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export interface X402PaymentConfig {
  amount: number; // Amount in USD
  recipient: string; // Recipient address
  invoiceId: string;
  description?: string;
}

export interface X402PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  paymentId?: string;
}

export interface X402PaymentStatus {
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  transactionHash?: string;
  blockNumber?: number;
}

/**
 * Custom hook for x402 payments using wagmi wallet client
 */
export function useX402Payment() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  /**
   * Initialize x402-axios with wallet client
   * Note: This is a mock implementation for demonstration purposes.
   * In a real implementation, you would need to:
   * 1. Create a proper signer from the wallet client
   * 2. Use the actual x402 API endpoint
   * 3. Handle the x402 payment protocol correctly
   */
  const initializeX402Client = () => {
    if (!walletClient) {
      throw new Error('Wallet not connected');
    }

    // Create axios instance for x402 API
    const axiosClient = axios.create({
      baseURL: 'https://api.x402.example.com', // This would be the actual x402 API endpoint
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // For demonstration purposes, we'll return the axios client directly
    // In a real implementation, you would create a proper signer and use withPaymentInterceptor
    return axiosClient;
  };

  /**
   * Process x402 payment
   */
  const processPayment = async (config: X402PaymentConfig): Promise<X402PaymentResult> => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      const x402Client = initializeX402Client();
      
      // Convert USD amount to USDC (assuming 1:1 parity)
      const usdcAmount = parseUnits(config.amount.toString(), 6); // USDC has 6 decimals

      console.log('Processing x402 payment:', {
        amount: config.amount,
        usdcAmount: usdcAmount.toString(),
        recipient: config.recipient,
        invoiceId: config.invoiceId,
      });

      // Create payment request for x402 API
      const paymentRequest = {
        recipient: config.recipient,
        amount: usdcAmount.toString(),
        token: USDC_CONTRACT_ADDRESS,
        chainId: base.id,
        invoiceId: config.invoiceId,
        description: config.description || `Payment for invoice ${config.invoiceId}`,
      };

      // For demonstration purposes, we'll simulate the x402 payment flow
      // In a real implementation, this would:
      // 1. Make a request to the x402 API
      // 2. Handle 402 responses with payment requirements
      // 3. Create and sign payment transactions
      // 4. Return the actual transaction hash
      
      console.log('Simulating x402 payment processing...', paymentRequest);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock transaction hash for demonstration
      const mockTransactionHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      
      // Simulate successful payment
      return {
        success: true,
        transactionHash: mockTransactionHash,
        paymentId: config.invoiceId,
      };
    } catch (error) {
      console.error('X402 payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed',
      };
    }
  };

  /**
   * Check payment status and confirmations
   */
  const checkPaymentStatus = async (transactionHash: string): Promise<X402PaymentStatus> => {
    try {
      if (!publicClient) {
        throw new Error('Public client not available');
      }

      // Get transaction receipt
      const receipt = await publicClient.getTransactionReceipt({
        hash: transactionHash as `0x${string}`,
      });

      if (!receipt) {
        return {
          status: 'pending',
          confirmations: 0,
        };
      }

      // Get current block number
      const currentBlock = await publicClient.getBlockNumber();
      const confirmations = Number(currentBlock - receipt.blockNumber);

      // Consider transaction confirmed after 1 confirmation on Base
      const status = confirmations >= 1 ? 'confirmed' : 'pending';

      return {
        status,
        confirmations,
        transactionHash,
        blockNumber: Number(receipt.blockNumber),
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      return {
        status: 'failed',
        confirmations: 0,
        transactionHash,
      };
    }
  };

  /**
   * Get USDC balance for connected wallet
   */
  const getUSDCBalance = async (): Promise<number> => {
    try {
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      // For now, we'll simulate balance retrieval since x402 might not have a balance endpoint
      // In a real implementation, you would query the USDC contract directly or use a balance API
      
      // This is a mock implementation - in production you would:
      // 1. Query the USDC contract directly using viem
      // 2. Or use the x402 client if it provides balance endpoints
      
      // Mock balance for demonstration
      const mockBalance = 100.0; // $100 USDC
      return mockBalance;
    } catch (error) {
      console.error('Error getting USDC balance:', error);
      return 0;
    }
  };

  /**
   * Validate payment before processing
   */
  const validatePayment = async (config: X402PaymentConfig): Promise<{ valid: boolean; error?: string }> => {
    try {
      if (!walletClient) {
        return { valid: false, error: 'Wallet not connected' };
      }

      if (config.amount <= 0) {
        return { valid: false, error: 'Invalid payment amount' };
      }

      if (!config.recipient || !config.recipient.startsWith('0x')) {
        return { valid: false, error: 'Invalid recipient address' };
      }

      // Check USDC balance
      const balance = await getUSDCBalance();
      if (balance < config.amount) {
        return { 
          valid: false, 
          error: `Insufficient USDC balance. Required: ${config.amount}, Available: ${balance}` 
        };
      }

      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Validation failed' 
      };
    }
  };

  return {
    processPayment,
    checkPaymentStatus,
    getUSDCBalance,
    validatePayment,
    isWalletConnected: !!walletClient,
    walletAddress: walletClient?.account?.address,
  };
}

/**
 * Utility function to format USDC amount
 */
export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

/**
 * Utility function to get Base network explorer URL
 */
export function getTransactionUrl(transactionHash: string): string {
  return `https://basescan.org/tx/${transactionHash}`;
}
