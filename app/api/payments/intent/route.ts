import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/payments';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd', invoiceId } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const { clientSecret, paymentIntentId } = await createPaymentIntent(
      amount,
      currency,
      invoiceId
    );

    return NextResponse.json({
      clientSecret,
      paymentIntentId,
    });
  } catch (error) {
    console.error('Payment intent API error:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
