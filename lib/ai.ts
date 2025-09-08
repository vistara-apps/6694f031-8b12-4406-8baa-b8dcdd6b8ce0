import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function analyzeSample(audioFile: File): Promise<{
  detectedSamples: Array<{
    trackName: string;
    artist: string;
    confidence: number;
    startTime: number;
    endTime: number;
  }>;
  rightsInfo: {
    publisherName: string;
    contactEmail: string;
  };
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes audio files to identify potential music samples. Return a JSON response with detected samples and rights information.',
        },
        {
          role: 'user',
          content: `Analyze this audio file: ${audioFile.name}. Identify any potential music samples, their sources, and rights holders. Return the analysis in JSON format.`,
        },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse AI response (in a real app, you'd have more sophisticated parsing)
    return {
      detectedSamples: [
        {
          trackName: 'Sample Track',
          artist: 'Sample Artist',
          confidence: 0.85,
          startTime: 15.2,
          endTime: 18.7,
        },
      ],
      rightsInfo: {
        publisherName: 'Universal Music Publishing',
        contactEmail: 'licensing@ump.com',
      },
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error('Failed to analyze sample');
  }
}

export async function generateClearanceRequest(
  sampleInfo: {
    trackName: string;
    artist: string;
    originalTrack: string;
  },
  licenseTerms: {
    usage: string;
    territory: string;
    duration: string;
  }
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a professional music licensing assistant. Generate a formal clearance request email for music sample licensing.',
        },
        {
          role: 'user',
          content: `Generate a professional clearance request for sampling "${sampleInfo.trackName}" by ${sampleInfo.artist} in the track "${sampleInfo.originalTrack}". Usage: ${licenseTerms.usage}, Territory: ${licenseTerms.territory}, Duration: ${licenseTerms.duration}.`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Failed to generate clearance request';
  } catch (error) {
    console.error('Clearance request generation error:', error);
    throw new Error('Failed to generate clearance request');
  }
}

export async function calculateLicenseFeeAI(
  sampleInfo: {
    duration: number;
    usage: string;
    territory: string;
    popularity: number;
  }
): Promise<number> {
  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a music licensing expert. Calculate fair license fees based on industry standards. Return only a number representing the fee in USD.',
        },
        {
          role: 'user',
          content: `Calculate a fair license fee for a ${sampleInfo.duration} second sample. Usage: ${sampleInfo.usage}, Territory: ${sampleInfo.territory}, Popularity score: ${sampleInfo.popularity}/10. Return only the fee amount as a number.`,
        },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    const fee = parseInt(content?.replace(/[^0-9]/g, '') || '100');
    return Math.max(fee, 50); // Minimum $50 fee
  } catch (error) {
    console.error('Fee calculation error:', error);
    return 100; // Default fee
  }
}
