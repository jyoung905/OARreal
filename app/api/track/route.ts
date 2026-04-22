import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Always return 200 — never break the client-side app
  try {
    const payload = await req.json();
    const {
      event, device, traffic_source, utm_medium, utm_campaign, landing_page,
      accident_type, claim_status, ontario_yn, injured,
      step, step_label, cta_text, cta_location,
      trigger: eventTrigger, question,
    } = payload;

    if (!event || typeof event !== 'string') {
      return NextResponse.json({ ok: false, error: 'missing event' }, { status: 200 });
    }

    const supabase = getSupabaseAdminClient();
    const table = process.env.SUPABASE_ANALYTICS_TABLE || 'analytics_events';

    const { error } = await supabase.from(table).insert({
      event,
      device:        device        ?? null,
      traffic_source: traffic_source ?? null,
      utm_medium:    utm_medium    ?? null,
      utm_campaign:  utm_campaign  ?? null,
      landing_page:  landing_page  ?? null,
      accident_type: accident_type ?? null,
      claim_status:  claim_status  ?? null,
      ontario_yn:    ontario_yn    ?? null,
      injured:       injured       ?? null,
      step:          step          ?? null,
      step_label:    step_label    ?? null,
      cta_text:      cta_text      ?? null,
      cta_location:  cta_location  ?? null,
      trigger:       eventTrigger  ?? null,
      question:      question      ?? null,
      props:         payload,
    });

    if (error) {
      // Log but don't surface to client
      console.error('[OAR track] supabase error:', error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[OAR track] error:', err);
    return NextResponse.json({ ok: true }); // still 200
  }
}
