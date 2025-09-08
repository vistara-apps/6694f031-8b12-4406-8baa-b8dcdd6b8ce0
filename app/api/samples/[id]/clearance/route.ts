import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateClearanceRequest, calculateLicenseFeeAI } from '@/lib/ai';
import { uploadDocumentToIPFS, generateClearanceAgreement } from '@/lib/pinata';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { licenseTerms } = await request.json();
    const sampleId = params.id;

    if (!licenseTerms) {
      return NextResponse.json({ error: 'License terms are required' }, { status: 400 });
    }

    // Get sample from database
    const { data: sample, error: sampleError } = await supabase
      .from('samples')
      .select('*')
      .eq('sample_id', sampleId)
      .single();

    if (sampleError || !sample) {
      return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
    }

    // Calculate license fee using AI
    const calculatedFee = await calculateLicenseFeeAI({
      duration: 30, // Default duration
      usage: licenseTerms.usage,
      territory: licenseTerms.territory,
      popularity: 5, // Default popularity score
    });

    // Update license terms with calculated fee
    const updatedLicenseTerms = {
      ...licenseTerms,
      upfrontFee: calculatedFee,
    };

    // Generate clearance request message
    const clearanceMessage = await generateClearanceRequest(
      {
        trackName: sample.detected_samples[0]?.trackName || 'Unknown Track',
        artist: sample.detected_samples[0]?.artist || 'Unknown Artist',
        originalTrack: sample.original_track,
      },
      updatedLicenseTerms
    );

    // Generate clearance agreement document
    const agreementDocument = await generateClearanceAgreement(sample, updatedLicenseTerms);

    // Upload agreement to IPFS
    const { ipfsHash, gatewayUrl } = await uploadDocumentToIPFS(
      agreementDocument,
      {
        invoiceId: `clearance-${sampleId}`,
        sampleId,
        userId: sample.user_id,
        documentType: 'clearance_agreement',
        createdAt: new Date().toISOString(),
      }
    );

    // Update sample with license terms and clearance status
    const { data: updatedSample, error: updateError } = await supabase
      .from('samples')
      .update({
        license_terms: updatedLicenseTerms,
        clearance_status: 'active',
        agreement_ipfs_hash: ipfsHash,
        updated_at: new Date().toISOString(),
      })
      .eq('sample_id', sampleId)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json({ error: 'Failed to update sample' }, { status: 500 });
    }

    return NextResponse.json({
      sample: updatedSample,
      clearanceMessage,
      agreementDocument,
      ipfsHash,
      gatewayUrl,
      calculatedFee,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sampleId = params.id;

    // Get sample clearance status
    const { data: sample, error } = await supabase
      .from('samples')
      .select('clearance_status, license_terms, agreement_ipfs_hash')
      .eq('sample_id', sampleId)
      .single();

    if (error || !sample) {
      return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
    }

    return NextResponse.json({
      clearanceStatus: sample.clearance_status,
      licenseTerms: sample.license_terms,
      agreementIpfsHash: sample.agreement_ipfs_hash,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
