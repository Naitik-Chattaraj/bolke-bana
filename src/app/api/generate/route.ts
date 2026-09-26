import { NextResponse } from 'next/server';
import { extractRequirements } from '@/lib/ai/sarvam';

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    const spec = await extractRequirements(transcript);
    return NextResponse.json({ spec });
  } catch (error) {
    console.error('Generate API Error:', error);
    return NextResponse.json({ error: 'Failed to generate specification' }, { status: 500 });
  }
}
