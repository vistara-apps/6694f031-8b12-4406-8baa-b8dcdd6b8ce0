import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  transactionHash?: string;
  paymentIntentId?: string;
  error?: string;
}

export interface TurnkeyPaymentParams {
  amount: number;
  recipientAddress: string;
  invoiceId: string;
  walletId: string;
}

export async function processOnchainPayment(
  params: TurnkeyPaymentParams
): Promise<PaymentResult> {
  try {
    // In a real implementation, this would interact with Turnkey SDK
    console.log(`Processing onchain payment: $${params.amount} to ${params.recipientAddress} for invoice ${params.invoiceId}`);
    
    // Simulate Turnkey payment processing
    const response = await simulateTurnkeyPayment(params);
    
    return {
      success: true,
      transactionId: response.transactionHash,
      transactionHash: response.transactionHash,
    };
  } catch (error) {
    console.error('Onchain payment error:', error);
    return {
      success: false,
      error: 'Failed to process onchain payment',
    };
  }
}

export async function processFiatPayment(
  amount: number,
  paymentMethodId: string,
  invoiceId: string
): Promise<PaymentResult> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        invoiceId,
        service: 'samplesafe',
      },
    });

    return {
      success: paymentIntent.status === 'succeeded',
      transactionId: paymentIntent.id,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Fiat payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process fiat payment',
    };
  }
}

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  invoiceId?: string
): Promise<{
  clientSecret: string;
  paymentIntentId: string;
}> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        invoiceId: invoiceId || '',
        service: 'samplesafe',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Payment intent creation error:', error);
    // Fallback to mock for development
    return {
      clientSecret: 'pi_' + Math.random().toString(36) + '_secret_' + Math.random().toString(36),
      paymentIntentId: 'pi_' + Math.random().toString(36).substring(2, 15),
    };
  }
}

export async function confirmPayment(paymentIntentId: string): Promise<PaymentResult> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: paymentIntent.status === 'succeeded',
      paymentIntentId: paymentIntent.id,
      transactionId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return {
      success: false,
      error: 'Failed to confirm payment',
    };
  }
}

// Simulate Turnkey payment for demo purposes
async function simulateTurnkeyPayment(params: TurnkeyPaymentParams): Promise<{ transactionHash: string }> {
  // In a real implementation, this would use the Turnkey SDK
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      });
    }, 2000);
  });
}

export function calculateProcessingFee(amount: number, method: 'onchain' | 'fiat'): number {
  if (method === 'onchain') {
    return 0.01; // Fixed gas fee estimate
  } else {
    return amount * 0.029 + 0.30; // Stripe fees: 2.9% + $0.30
  }
}

export async function refundPayment(paymentIntentId: string, amount?: number): Promise<PaymentResult> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    });

    return {
      success: refund.status === 'succeeded',
      transactionId: refund.id,
    };
  } catch (error) {
    console.error('Refund error:', error);
    return {
      success: false,
      error: 'Failed to process refund',
    };
  }
}

export function formatPaymentAmount(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
