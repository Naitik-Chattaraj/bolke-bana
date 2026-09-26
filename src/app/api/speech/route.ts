import { NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/ai/sarvam';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const transcript = await transcribeAudio(file);
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Speech API Error:', error);
    return NextResponse.json({ error: 'Failed to process speech' }, { status: 500 });
  }
}
