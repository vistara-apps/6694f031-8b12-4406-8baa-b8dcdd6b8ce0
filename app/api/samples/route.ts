import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { analyzeSample, calculateLicenseFeeAI } from '@/lib/ai';
import { uploadFileToIPFS } from '@/lib/pinata';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: samples, error } = await supabase
      .from('samples')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch samples' }, { status: 500 });
    }

    return NextResponse.json({ samples });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ error: 'File and user ID are required' }, { status: 400 });
    }

    // Convert file to buffer for processing
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload file to IPFS
    const { ipfsHash, gatewayUrl } = await uploadFileToIPFS(
      buffer,
      file.name,
      {
        userId,
        fileType: 'audio',
        originalName: file.name,
      }
    );

    // Analyze sample using AI
    const analysis = await analyzeSample(file);

    // Create sample record in database
    const sampleData = {
      original_track: file.name,
      detected_samples: analysis.detectedSamples,
      rights_info: {
        rightsHolderId: `rights-${Date.now()}`,
        publisherName: analysis.rightsInfo.publisherName,
        contactInfo: { email: analysis.rightsInfo.contactEmail },
        ownershipPercentage: 100,
      },
      clearance_status: 'pending' as const,
      user_id: userId,
      ipfs_hash: ipfsHash,
      file_url: gatewayUrl,
    };

    const { data: sample, error } = await supabase
      .from('samples')
      .insert(sampleData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to create sample' }, { status: 500 });
    }

    return NextResponse.json({ 
      sample,
      analysis,
      ipfsHash,
      gatewayUrl 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
