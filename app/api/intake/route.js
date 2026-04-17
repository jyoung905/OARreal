import { NextResponse } from 'next/server';
import { appendSubmission, sanitizeLead } from '@/lib/intake';

export async function POST(request) {
  try {
    const payload = await request.json();
    const record = sanitizeLead(payload);
    await appendSubmission(record);
    return NextResponse.json({ ok: true, message: 'Review request received.' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to process the review request.' },
      { status: 400 }
    );
  }
}
