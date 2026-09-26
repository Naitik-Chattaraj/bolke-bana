import { NextResponse } from 'next/server';
import { modifyRequirements } from '@/lib/ai/sarvam';

export async function POST(request: Request) {
  try {
    const { currentSpec, instruction } = await request.json();
    
    if (!currentSpec || !instruction) {
      return NextResponse.json({ error: 'Missing currentSpec or instruction' }, { status: 400 });
    }

    const updatedSpec = await modifyRequirements(currentSpec, instruction);
    return NextResponse.json({ spec: updatedSpec });
  } catch (error) {
    console.error('Update API Error:', error);
    return NextResponse.json({ error: 'Failed to update specification' }, { status: 500 });
  }
}
