import { NextResponse } from 'next/server';
import { appendSubmission, sanitizeLead } from '@/lib/intake';
import { sendEmailAlert, sendTelegramAlert } from '@/lib/notify';

export async function POST(request) {
  try {
    const payload = await request.json();
    const record = sanitizeLead(payload);

    // Persist first — notifications must never block or roll back storage.
    await appendSubmission(record);

    // Fire-and-forget notifications. Failures are logged but do not affect
    // the response returned to the visitor.
    Promise.allSettled([
      sendEmailAlert(record),
      sendTelegramAlert(record)
    ]).catch(() => {});

    return NextResponse.json({ ok: true, message: 'Review request received.' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to process the review request.' },
      { status: 400 }
    );
  }
}
