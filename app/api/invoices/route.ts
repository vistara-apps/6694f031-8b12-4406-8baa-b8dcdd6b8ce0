import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadDocumentToIPFS, generateInvoiceDocument } from '@/lib/pinata';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        samples (
          sample_id,
          original_track,
          detected_samples,
          license_terms
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sampleId, userId, rightsHolderId, amount, paymentMethod, dueDate } = await request.json();

    if (!sampleId || !userId || !rightsHolderId || !amount) {
      return NextResponse.json({ 
        error: 'Sample ID, user ID, rights holder ID, and amount are required' 
      }, { status: 400 });
    }

    // Get sample information
    const { data: sample, error: sampleError } = await supabase
      .from('samples')
      .select('*')
      .eq('sample_id', sampleId)
      .single();

    if (sampleError || !sample) {
      return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
    }

    // Create invoice record
    const invoiceData = {
      sample_id: sampleId,
      user_id: userId,
      rights_holder_id: rightsHolderId,
      amount,
      status: 'unpaid' as const,
      payment_method: paymentMethod || 'onchain',
      due_date: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single();

    if (invoiceError) {
      console.error('Database error:', invoiceError);
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }

    // Generate invoice document
    const invoiceDocument = await generateInvoiceDocument(invoice, sample);

    // Upload invoice to IPFS
    const { ipfsHash, gatewayUrl } = await uploadDocumentToIPFS(
      invoiceDocument,
      {
        invoiceId: invoice.invoice_id,
        sampleId,
        userId,
        documentType: 'invoice',
        createdAt: invoice.created_at,
      }
    );

    // Update invoice with IPFS hash
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update({ ipfs_hash: ipfsHash })
      .eq('invoice_id', invoice.invoice_id)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }

    return NextResponse.json({
      invoice: updatedInvoice,
      invoiceDocument,
      ipfsHash,
      gatewayUrl,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
