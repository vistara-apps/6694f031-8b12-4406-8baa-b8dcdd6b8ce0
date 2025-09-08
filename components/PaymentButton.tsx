'use client';

import { useState } from 'react';
import { Coins, CreditCard, Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  variant: 'onchain' | 'fiat';
  amount: number;
  invoiceId: string;
  onPaymentSuccess: (transactionHash?: string) => void;
  onPaymentError: (error: string) => void;
}

export function PaymentButton({ 
  variant, 
  amount, 
  invoiceId, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      if (variant === 'onchain') {
        // Simulate on-chain payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
        onPaymentSuccess(mockTxHash);
      } else {
        // Simulate fiat payment
        await new Promise(resolve => setTimeout(resolve, 1500));
        onPaymentSuccess();
      }
    } catch (error) {
      onPaymentError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className={`
        w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium 
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'onchain' 
          ? 'btn-primary' 
          : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
        }
      `}
    >
      {isProcessing ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {variant === 'onchain' ? (
            <Coins className="w-5 h-5" />
          ) : (
            <CreditCard className="w-5 h-5" />
          )}
          <span>
            Pay ${amount} {variant === 'onchain' ? 'USDC' : 'USD'}
          </span>
        </>
      )}
    </button>
  );
}
