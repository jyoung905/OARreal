/**
 * Ontario Accident Review — notification helpers
 *
 * Both sendEmailAlert and sendTelegramAlert are fire-and-forget:
 * they log failures to console but never throw. Submission persistence
 * must always happen first, independently of notification delivery.
 */

// ---------------------------------------------------------------------------
// Email via SMTP (nodemailer)
// ---------------------------------------------------------------------------

function buildEmailHtml(record) {
  const { data, review } = record;
  const rows = [
    ['Lead ID', record.id],
    ['Submitted', record.submittedAt],
    ['Review bucket', review.bucket],
    ['Score', String(review.score)],
    ['---', '---'],
    ['Name', data.fullName],
    ['Phone', data.phone],
    ['Email', data.email],
    ['Contact method', data.contactMethod],
    ['Best time', data.bestTime],
    ['---', '---'],
    ['Accident type', data.accidentType],
    ['Accident date', data.accidentDate],
    ['City / area', data.cityArea],
    ['In Ontario', data.inOntario],
    ['---', '---'],
    ['Injured', data.injured],
    ['Medical attention', data.medicalAttention],
    ['Work impact', data.workImpact],
    ['Ongoing symptoms', data.ongoingSymptoms],
    ['Injury details', data.injuryDetails || '(not provided)'],
    ['---', '---'],
    ['Spoken with lawyer', data.spokenWithLawyer],
    ['Currently represented', data.currentlyRepresented],
    ['Third party involved', data.thirdPartyInvolved],
    ['Additional notes', data.additionalNotes || '(none)'],
    ['Source page', data.sourcePage]
  ];

  const tableRows = rows
    .map(([label, value]) => {
      if (label === '---') return '<tr><td colspan="2" style="padding:6px 0;border-bottom:1px solid #2a3a54;"></td></tr>';
      return `<tr><td style="padding:5px 10px 5px 0;color:#8ab4ff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:5px 0;color:#f4f7fb;vertical-align:top;word-break:break-word">${value}</td></tr>`;
    })
    .join('');

  const summaryBlock =
    data.accidentSummary
      ? `<div style="margin:16px 0;padding:14px;background:#0f1a2e;border-radius:10px;border:1px solid #1e3050;color:#dee6f1;font-size:14px;line-height:1.6"><strong style="color:#f4d18a;display:block;margin-bottom:6px">Accident summary</strong>${data.accidentSummary}</div>`
      : '';

  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#0b1220;font-family:system-ui,sans-serif;color:#f4f7fb">
<div style="max-width:640px;margin:0 auto">
  <div style="background:#101a2b;border:1px solid #1e3050;border-radius:14px;padding:20px 24px;margin-bottom:16px">
    <div style="margin-bottom:4px;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#d2a85a">New Submission</div>
    <h1 style="margin:0 0 4px;font-size:20px;color:#fff">Ontario Accident Review</h1>
    <div style="font-size:13px;color:#8ab4ff">${review.bucket} &mdash; Score: ${review.score}</div>
  </div>
  <div style="background:#0e1830;border:1px solid #1e3050;border-radius:14px;padding:20px 24px">
    <table style="width:100%;border-collapse:collapse">${tableRows}</table>
    ${summaryBlock}
  </div>
  <p style="margin:16px 0 0;font-size:11px;color:#4a5a72">Ontario Accident Review is not a law firm. Do not reply to this alert with sensitive legal or insurance information.</p>
</div>
</body></html>`;
}

export async function sendEmailAlert(record) {
  const host = process.env.SMTP_HOST;
  const toEmail = process.env.LEAD_ALERT_EMAIL_TO;

  if (!host || !toEmail) {
    console.log('[notify] Email alert skipped: SMTP_HOST or LEAD_ALERT_EMAIL_TO not configured.');
    return;
  }

  try {
    const nodemailer = await import('nodemailer');
    const transport = nodemailer.default.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== 'false',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      ...(process.env.SMTP_EHLO_NAME ? { name: process.env.SMTP_EHLO_NAME } : {})
    });

    const senderName = process.env.LEAD_SENDER_NAME || 'Ontario Accident Review';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    await transport.sendMail({
      from: `"${senderName}" <${fromEmail}>`,
      to: toEmail,
      subject: `[OAR] New review submission — ${record.review.bucket} — ${record.data.fullName}`,
      html: buildEmailHtml(record)
    });

    console.log('[notify] Email alert sent to', toEmail);
  } catch (error) {
    console.error('[notify] Email alert failed:', error?.message || error);
  }
}

// ---------------------------------------------------------------------------
// Telegram via Bot API
// ---------------------------------------------------------------------------

function buildTelegramMessage(record) {
  const { data, review } = record;
  const esc = (text) => String(text || '').replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');

  const summary =
    data.accidentSummary.length > 200
      ? data.accidentSummary.slice(0, 200) + '…'
      : data.accidentSummary;

  return [
    `🔔 *New Ontario Accident Review submission*`,
    ``,
    `*Bucket:* ${esc(review.bucket)}  |  *Score:* ${review.score}`,
    ``,
    `*Name:* ${esc(data.fullName)}`,
    `*Phone:* ${esc(data.phone)}`,
    `*Email:* ${esc(data.email)}`,
    ``,
    `*Accident type:* ${esc(data.accidentType)}`,
    `*Date:* ${esc(data.accidentDate)}`,
    `*City:* ${esc(data.cityArea)}`,
    `*In Ontario:* ${esc(data.inOntario)}`,
    ``,
    `*Injured:* ${esc(data.injured)}  |  *Medical:* ${esc(data.medicalAttention)}`,
    `*Work impact:* ${esc(data.workImpact)}  |  *Ongoing:* ${esc(data.ongoingSymptoms)}`,
    `*Third party:* ${esc(data.thirdPartyInvolved)}`,
    `*Spoken w/ lawyer:* ${esc(data.spokenWithLawyer)}  |  *Represented:* ${esc(data.currentlyRepresented)}`,
    ``,
    `*Summary:* ${esc(summary)}`,
    ``,
    `ID: \`${record.id}\``
  ].join('\n');
}

export async function sendTelegramAlert(record) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('[notify] Telegram alert skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured.');
    return;
  }

  try {
    const apiBase = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';
    const url = `${apiBase}/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(record),
        parse_mode: 'MarkdownV2'
      })
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error('[notify] Telegram alert returned non-OK:', response.status, body);
    } else {
      console.log('[notify] Telegram alert sent to chat', chatId);
    }
  } catch (error) {
    console.error('[notify] Telegram alert failed:', error?.message || error);
  }
}
