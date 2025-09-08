import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToIPFS } from '@/lib/pinata';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const fileType = formData.get('fileType') as string || 'audio';

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/aac'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only audio files are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 50MB.' 
      }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to IPFS
    const { ipfsHash, gatewayUrl } = await uploadFileToIPFS(
      buffer,
      file.name,
      {
        userId,
        fileType,
        originalName: file.name,
        mimeType: file.type,
        size: file.size.toString(),
        uploadedAt: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      success: true,
      ipfsHash,
      gatewayUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
