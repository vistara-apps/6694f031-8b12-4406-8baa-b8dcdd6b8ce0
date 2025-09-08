import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { processOnchainPayment, processFiatPayment, createPaymentIntent, TurnkeyPaymentParams } from '@/lib/payments';

export async function POST(request: NextRequest) {
  try {
    const { invoiceId, paymentMethod, paymentData } = await request.json();

    if (!invoiceId || !paymentMethod) {
      return NextResponse.json({ 
        error: 'Invoice ID and payment method are required' 
      }, { status: 400 });
    }

    // Get invoice from database
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
    }

    let paymentResult;

    if (paymentMethod === 'onchain') {
      // Process onchain payment
      const turnkeyParams: TurnkeyPaymentParams = {
        amount: invoice.amount,
        recipientAddress: paymentData.recipientAddress || process.env.DEFAULT_RECIPIENT_ADDRESS!,
        invoiceId,
        walletId: paymentData.walletId,
      };

      paymentResult = await processOnchainPayment(turnkeyParams);
    } else if (paymentMethod === 'fiat') {
      // Process fiat payment
      paymentResult = await processFiatPayment(
        invoice.amount,
        paymentData.paymentMethodId,
        invoiceId
      );
    } else {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    if (!paymentResult.success) {
      return NextResponse.json({ 
        error: paymentResult.error || 'Payment failed' 
      }, { status: 400 });
    }

    // Update invoice status
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        transaction_hash: paymentResult.transactionHash || paymentResult.transactionId,
      })
      .eq('invoice_id', invoiceId)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }

    // Update sample clearance status to cleared
    await supabase
      .from('samples')
      .update({ clearance_status: 'cleared' })
      .eq('sample_id', invoice.sample_id);

    return NextResponse.json({
      success: true,
      invoice: updatedInvoice,
      transactionHash: paymentResult.transactionHash || paymentResult.transactionId,
      paymentIntentId: paymentResult.paymentIntentId,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
