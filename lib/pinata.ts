import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY_URL!,
});

export interface DocumentMetadata {
  invoiceId: string;
  sampleId: string;
  userId: string;
  documentType: 'invoice' | 'clearance_agreement' | 'license_terms';
  createdAt: string;
}

export async function uploadDocumentToIPFS(
  document: any,
  metadata: DocumentMetadata
): Promise<{ ipfsHash: string; gatewayUrl: string }> {
  try {
    const documentBuffer = Buffer.from(JSON.stringify(document));
    
    const upload = await pinata.upload.buffer(documentBuffer, {
      metadata: {
        name: `${metadata.documentType}_${metadata.invoiceId}`,
        keyvalues: {
          invoiceId: metadata.invoiceId,
          sampleId: metadata.sampleId,
          userId: metadata.userId,
          documentType: metadata.documentType,
          createdAt: metadata.createdAt,
        },
      },
    });

    const gatewayUrl = `${process.env.PINATA_GATEWAY_URL}/ipfs/${upload.IpfsHash}`;

    return {
      ipfsHash: upload.IpfsHash,
      gatewayUrl,
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload document to IPFS');
  }
}

export async function uploadFileToIPFS(
  file: Buffer,
  filename: string,
  metadata?: Record<string, string>
): Promise<{ ipfsHash: string; gatewayUrl: string }> {
  try {
    const upload = await pinata.upload.buffer(file, {
      metadata: {
        name: filename,
        keyvalues: metadata || {},
      },
    });

    const gatewayUrl = `${process.env.PINATA_GATEWAY_URL}/ipfs/${upload.IpfsHash}`;

    return {
      ipfsHash: upload.IpfsHash,
      gatewayUrl,
    };
  } catch (error) {
    console.error('File upload to IPFS error:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

export async function getDocumentFromIPFS(ipfsHash: string): Promise<any> {
  try {
    const response = await fetch(`${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`);
    if (!response.ok) {
      throw new Error('Failed to fetch document from IPFS');
    }
    return await response.json();
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error('Failed to retrieve document from IPFS');
  }
}

export async function listUserDocuments(userId: string): Promise<any[]> {
  try {
    const files = await pinata.files.list({
      metadata: {
        keyvalues: {
          userId: {
            value: userId,
            op: 'eq',
          },
        },
      },
    });

    return files.files || [];
  } catch (error) {
    console.error('IPFS list error:', error);
    throw new Error('Failed to list user documents');
  }
}

export async function generateInvoiceDocument(invoice: any, sample: any): Promise<any> {
  return {
    invoiceId: invoice.invoiceId,
    sampleId: invoice.sampleId,
    amount: invoice.amount,
    currency: 'USD',
    dueDate: invoice.dueDate,
    createdAt: invoice.createdAt,
    sample: {
      originalTrack: sample.originalTrack,
      detectedSamples: sample.detectedSamples,
    },
    licenseTerms: sample.licenseTerms,
    rightsHolder: sample.rightsInfo,
    status: invoice.status,
    paymentMethod: invoice.paymentMethod,
    generatedAt: new Date().toISOString(),
    version: '1.0',
  };
}

export async function generateClearanceAgreement(sample: any, licenseTerms: any): Promise<any> {
  return {
    agreementId: `agreement-${sample.sampleId}`,
    sampleId: sample.sampleId,
    originalTrack: sample.originalTrack,
    detectedSamples: sample.detectedSamples,
    licenseTerms,
    rightsHolder: sample.rightsInfo,
    userId: sample.userId,
    status: 'active',
    signedAt: new Date().toISOString(),
    version: '1.0',
    terms: {
      territory: licenseTerms.territory,
      duration: licenseTerms.duration,
      usage: licenseTerms.usage,
      royaltyRate: licenseTerms.royaltyRate,
      upfrontFee: licenseTerms.upfrontFee,
    },
  };
}
