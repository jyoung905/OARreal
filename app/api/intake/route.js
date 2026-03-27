import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  name: process.env.SMTP_EHLO_NAME,
});

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName, phone, email, bestTime,
      contactMethod,
      accidentType, accidentDate,
      cityArea,
      accidentSummary,
      injured,
      injuryDetails,
      medicalAttention,
      workImpact,
      ongoingSymptoms,
      spokenWithLawyer,
      currentlyRepresented,
      thirdPartyInvolved,
      additionalNotes,
      inOntario,
    } = body;

    const subject = `New lead: ${fullName || 'Unknown'} — ${phone || email || '—'}`;

    const html = `
      <h2 style="color:#001b44">New Lead – Ontario Accident Review</h2>
      <h3>Contact</h3>
      <p><b>Name:</b> ${fullName || '—'}<br>
      <b>Phone:</b> ${phone || '—'}<br>
      <b>Email:</b> ${email || '—'}<br>
      <b>Best time:</b> ${bestTime || '—'}<br>
      <b>Preferred contact:</b> ${contactMethod || '—'}</p>
      <h3>Accident</h3>
      <p><b>Date:</b> ${accidentDate || '—'}<br>
      <b>Type:</b> ${accidentType || '—'}<br>
      <b>Location:</b> ${cityArea || '—'}<br>
      <b>In Ontario:</b> ${inOntario || '—'}<br>
      <b>Description:</b> ${accidentSummary || '—'}</p>
      <h3>Impact</h3>
      <p><b>Injured:</b> ${injured || '—'}<br>
      <b>Medical attention:</b> ${medicalAttention || '—'}<br>
      <b>Work/life impact:</b> ${workImpact || '—'}<br>
      <b>Ongoing symptoms:</b> ${ongoingSymptoms || '—'}<br>
      <b>Injury details:</b> ${injuryDetails || '—'}</p>
      <h3>Legal Status</h3>
      <p><b>Spoken with lawyer:</b> ${spokenWithLawyer || '—'}<br>
      <b>Currently represented:</b> ${currentlyRepresented || '—'}<br>
      <b>Third party involved:</b> ${thirdPartyInvolved || '—'}</p>
      ${additionalNotes ? `<h3>Additional Notes</h3><p>${additionalNotes}</p>` : ''}
    `;

    const hasLawyerFlag = currentlyRepresented && currentlyRepresented.toLowerCase().includes('yes') ? '⚠️ HAS LAWYER' : '';
    const flags = [hasLawyerFlag].filter(Boolean).join('  ');

    const tgText = `🚨 <b>New Lead${flags ? ' — ' + flags : ''}</b>

👤 <b>${fullName || '—'}</b>
📞 ${phone || '—'}  |  📧 ${email || '—'}
🕐 Best time: ${bestTime || '—'} via ${contactMethod || '—'}

💥 <b>Accident:</b> ${accidentType || '—'}
📅 Date: ${accidentDate || '—'}
📍 ${cityArea || '—'}${inOntario ? ` (Ontario: ${inOntario})` : ''}

🩹 <b>Injured:</b> ${injured || '—'}
🏥 Medical attention: ${medicalAttention || '—'}
💼 Work/life impact: ${workImpact || '—'}
🔄 Ongoing symptoms: ${ongoingSymptoms || '—'}
${injuryDetails ? `📝 ${injuryDetails}` : ''}

⚖️ Spoken with lawyer: ${spokenWithLawyer || '—'}
🔑 Currently represented: ${currentlyRepresented || '—'}
👥 Third party involved: ${thirdPartyInvolved || '—'}
${additionalNotes ? `
💬 Notes: ${additionalNotes}` : ''}

📋 <b>Accident summary:</b>
${accidentSummary || '—'}`;

    await Promise.all([
      transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Ontario Accident Review'}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: process.env.LEAD_ALERT_EMAIL_TO || 'ontarioaccidentreview@gmail.com',
        subject,
        html,
      }),
      sendTelegram(tgText),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Intake route error:', err);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
