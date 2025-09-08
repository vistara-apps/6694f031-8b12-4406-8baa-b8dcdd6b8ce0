'use client';

import { useState, useEffect } from 'react';
import { Coins, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useX402Payment, formatUSDC, getTransactionUrl, type X402PaymentConfig } from '@/lib/x402-payment';

interface X402PaymentButtonProps {
  amount: number;
  invoiceId: string;
  recipient: string;
  description?: string;
  onPaymentSuccess: (transactionHash: string) => void;
  onPaymentError: (error: string) => void;
}

export function X402PaymentButton({ 
  amount, 
  invoiceId, 
  recipient,
  description,
  onPaymentSuccess, 
  onPaymentError 
}: X402PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [confirmations, setConfirmations] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    processPayment,
    checkPaymentStatus,
    getUSDCBalance,
    validatePayment,
    isWalletConnected,
    walletAddress,
  } = useX402Payment();

  // Load USDC balance when wallet is connected
  useEffect(() => {
    if (isWalletConnected) {
      loadBalance();
    }
  }, [isWalletConnected]);

  const loadBalance = async () => {
    try {
      const balance = await getUSDCBalance();
      setUsdcBalance(balance);
    } catch (error) {
      console.error('Failed to load USDC balance:', error);
    }
  };

  // Poll for transaction confirmations
  useEffect(() => {
    if (!transactionHash) return;

    const pollConfirmations = async () => {
      try {
        const status = await checkPaymentStatus(transactionHash);
        setConfirmations(status.confirmations);
        
        if (status.status === 'confirmed') {
          onPaymentSuccess(transactionHash);
          setIsProcessing(false);
        } else if (status.status === 'failed') {
          onPaymentError('Transaction failed');
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    const interval = setInterval(pollConfirmations, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [transactionHash, onPaymentSuccess, onPaymentError]);

  const handlePayment = async () => {
    if (!isWalletConnected) {
      onPaymentError('Please connect your wallet first');
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    const paymentConfig: X402PaymentConfig = {
      amount,
      recipient,
      invoiceId,
      description,
    };

    // Validate payment
    const validation = await validatePayment(paymentConfig);
    setIsValidating(false);

    if (!validation.valid) {
      setValidationError(validation.error || 'Payment validation failed');
      onPaymentError(validation.error || 'Payment validation failed');
      return;
    }

    setIsProcessing(true);
    setTransactionHash(null);
    setConfirmations(0);

    try {
      const result = await processPayment(paymentConfig);
      
      if (result.success && result.transactionHash) {
        setTransactionHash(result.transactionHash);
        // Continue processing - confirmations will be handled by useEffect
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error instanceof Error ? error.message : 'Payment processing failed');
      setIsProcessing(false);
    }
  };

  const getButtonContent = () => {
    if (isValidating) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Validating...</span>
        </>
      );
    }

    if (isProcessing && !transactionHash) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing Payment...</span>
        </>
      );
    }

    if (transactionHash && confirmations === 0) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Waiting for Confirmation...</span>
        </>
      );
    }

    if (transactionHash && confirmations > 0) {
      return (
        <>
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>Payment Confirmed ({confirmations} confirmations)</span>
        </>
      );
    }

    return (
      <>
        <Coins className="w-5 h-5" />
        <span>Pay {formatUSDC(amount)} USDC</span>
      </>
    );
  };

  const isDisabled = isValidating || isProcessing || !isWalletConnected;

  return (
    <div className="space-y-4">
      {/* Wallet Status */}
      {!isWalletConnected && (
        <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>Please connect your wallet to proceed with payment</span>
        </div>
      )}

      {/* USDC Balance */}
      {isWalletConnected && usdcBalance !== null && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>USDC Balance:</span>
          <span className={usdcBalance >= amount ? 'text-green-600' : 'text-red-600'}>
            {formatUSDC(usdcBalance)}
          </span>
        </div>
      )}

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isDisabled}
        className={`
          w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium 
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${transactionHash && confirmations > 0
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'btn-primary'
          }
        `}
      >
        {getButtonContent()}
      </button>

      {/* Transaction Details */}
      {transactionHash && (
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>Transaction Hash:</span>
            <a
              href={getTransactionUrl(transactionHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            >
              <span className="font-mono text-xs">
                {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span>Confirmations:</span>
            <span className={confirmations >= 1 ? 'text-green-600' : 'text-amber-600'}>
              {confirmations} / 1 required
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Network:</span>
            <span>Base</span>
          </div>
        </div>
      )}

      {/* Payment Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>• Payments are processed on Base network using USDC</div>
        <div>• Transaction requires 1 confirmation for completion</div>
        <div>• Gas fees are paid separately in ETH</div>
      </div>
    </div>
  );
}
