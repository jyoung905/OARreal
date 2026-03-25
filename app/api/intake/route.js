import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_EMAIL = 'ontarioaccidentreview@gmail.com';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      fullName, phone, email, bestTime, preferredContact,
      accidentDate, accidentType, location, atFault, description,
      injuries, treatment, missedWork, vehicleDamage,
      hasLawyer, reportedToInsurance, currentStatus,
      consent
    } = body;

    const html = `
      <h2>New Lead – Ontario Accident Review</h2>
      <h3>Contact</h3>
      <p><strong>Name:</strong> ${fullName || '—'}<br>
      <strong>Phone:</strong> ${phone || '—'}<br>
      <strong>Email:</strong> ${email || '—'}<br>
      <strong>Best time:</strong> ${bestTime || '—'}<br>
      <strong>Preferred contact:</strong> ${preferredContact || '—'}</p>
      <h3>Accident</h3>
      <p><strong>Date:</strong> ${accidentDate || '—'}<br>
      <strong>Type:</strong> ${accidentType || '—'}<br>
      <strong>Location:</strong> ${location || '—'}<br>
      <strong>At fault:</strong> ${atFault || '—'}<br>
      <strong>Description:</strong> ${description || '—'}</p>
      <h3>Impact</h3>
      <p><strong>Injuries:</strong> ${injuries || '—'}<br>
      <strong>Treatment:</strong> ${treatment || '—'}<br>
      <strong>Missed work:</strong> ${missedWork || '—'}<br>
      <strong>Vehicle damage:</strong> ${vehicleDamage || '—'}</p>
      <h3>Current Status</h3>
      <p><strong>Has lawyer:</strong> ${hasLawyer || '—'}<br>
      <strong>Reported to insurance:</strong> ${reportedToInsurance || '—'}<br>
      <strong>Current status:</strong> ${currentStatus || '—'}</p>
    `;

    await resend.emails.send({
      from: 'Ontario Accident Review <onboarding@resend.dev>',
      to: NOTIFY_EMAIL,
      subject: `New lead: ${fullName || 'Unknown'} – ${phone || email || '—'}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Intake route error:', err);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
