import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// ── Types ─────────────────────────────────────────────────────────
type AnalyticsEvent = {
  id: number;
  event: string;
  device: string | null;
  traffic_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  landing_page: string | null;
  accident_type: string | null;
  cta_text: string | null;
  cta_location: string | null;
  step: number | null;
  step_label: string | null;
  occurred_at: string;
};

// ── Supabase ──────────────────────────────────────────────────────
function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not set');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// ── Data fetch ────────────────────────────────────────────────────
async function getData() {
  const supabase = getClient();
  const analyticsTable = process.env.SUPABASE_ANALYTICS_TABLE || 'analytics_events';
  const intakeTable    = process.env.SUPABASE_INTAKE_TABLE    || 'intake_submissions';

  const [eventsResult, leadsResult] = await Promise.all([
    supabase
      .from(analyticsTable)
      .select('id,event,device,traffic_source,utm_medium,utm_campaign,landing_page,accident_type,cta_text,cta_location,step,step_label,occurred_at')
      .order('occurred_at', { ascending: false })
      .limit(2000),
    supabase
      .from(intakeTable)
      .select('id,submitted_at,review_score,review_bucket,accident_type,in_ontario,injured')
      .order('submitted_at', { ascending: false })
      .limit(500),
  ]);

  const events = (eventsResult.data ?? []) as AnalyticsEvent[];
  const leads  = (leadsResult.data ?? []) as {
    id: string; submitted_at: string; review_score: number;
    review_bucket: string; accident_type: string; in_ontario: string; injured: string;
  }[];

  const now = new Date();
  const cutoff = (days: number) => {
    const d = new Date(now); d.setDate(d.getDate() - days); return d.toISOString();
  };
  const todayStr = now.toISOString().slice(0, 10);

  const last7Events  = events.filter(e => e.occurred_at >= cutoff(7));
  const todayEvents  = events.filter(e => e.occurred_at.slice(0, 10) === todayStr);
  const last30Events = events.filter(e => e.occurred_at >= cutoff(30));

  function count(list: AnalyticsEvent[], eventName: string) {
    return list.filter(e => e.event === eventName).length;
  }

  // ── Funnel ──────────────────────────────────────────────────────
  // The OAR funnel: page load → CTA → intake open → steps 1-5 → submit → success
  const funnelDefs = [
    { key: 'homepage_view',        label: 'Homepage views' },
    { key: 'cta_click',            label: 'CTA clicked' },
    { key: 'intake_start',         label: 'Intake opened' },
    { key: 'intake_step_view',     label: 'Step 1 viewed',     filter: (e: AnalyticsEvent) => e.step === 1 },
    { key: 'intake_step_complete', label: 'Step 1 completed',  filter: (e: AnalyticsEvent) => e.step === 1 },
    { key: 'intake_step_view',     label: 'Step 2 viewed',     filter: (e: AnalyticsEvent) => e.step === 2 },
    { key: 'intake_step_complete', label: 'Step 2 completed',  filter: (e: AnalyticsEvent) => e.step === 2 },
    { key: 'intake_step_view',     label: 'Step 3 viewed',     filter: (e: AnalyticsEvent) => e.step === 3 },
    { key: 'intake_submit',        label: 'Form submitted' },
    { key: 'submission_success',   label: 'Submission confirmed' },
    { key: 'confirmation_page_view', label: 'Thank-you page viewed' },
  ];

  const funnelCounts = funnelDefs.map(f => {
    const filtered = f.filter
      ? last7Events.filter(e => e.event === f.key && f.filter!(e))
      : last7Events.filter(e => e.event === f.key);
    return { label: f.label, count: filtered.length };
  });

  // ── Traffic sources ──────────────────────────────────────────────
  const sourceCounts: Record<string, number> = {};
  for (const e of last7Events) {
    const src = e.traffic_source || 'direct';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  }

  // ── Device split ─────────────────────────────────────────────────
  const deviceCounts: Record<string, number> = {};
  for (const e of last7Events) {
    const d = e.device || 'unknown';
    deviceCounts[d] = (deviceCounts[d] || 0) + 1;
  }

  // ── CTA performance ──────────────────────────────────────────────
  const ctaCounts: Record<string, number> = {};
  for (const e of last7Events.filter(e => e.event === 'cta_click')) {
    const loc = e.cta_location || 'unknown';
    ctaCounts[loc] = (ctaCounts[loc] || 0) + 1;
  }

  // ── FAQ questions ─────────────────────────────────────────────────
  const faqRaw = last7Events.filter(e => e.event === 'faq_expand');
  const faqMap: Record<string, number> = {};
  for (const e of faqRaw) {
    const q = ((e as unknown as Record<string, unknown>).question as string) || 'unknown';
    faqMap[q] = (faqMap[q] || 0) + 1;
  }
  const topFaqs = Object.entries(faqMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // ── Accident type breakdown (from intake submissions) ────────────
  const accidentTypes: Record<string, number> = {};
  for (const l of leads) {
    accidentTypes[l.accident_type] = (accidentTypes[l.accident_type] || 0) + 1;
  }

  // ── Daily event volume (last 7 days) ─────────────────────────────
  const dailyMap: Record<string, number> = {};
  for (const e of last7Events) {
    const day = e.occurred_at.slice(0, 10);
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  }
  const dailyVolume = Object.entries(dailyMap).sort((a, b) => a[0].localeCompare(b[0]));

  return {
    totals: {
      allTime:  events.length,
      last30:   last30Events.length,
      last7:    last7Events.length,
      today:    todayEvents.length,
    },
    funnelCounts,
    sourceCounts,
    deviceCounts,
    ctaCounts,
    topFaqs,
    accidentTypes,
    dailyVolume,
    leads: {
      total: leads.length,
      today: leads.filter(l => l.submitted_at.slice(0, 10) === todayStr).length,
      last7: leads.filter(l => l.submitted_at >= cutoff(7)).length,
      highPriority: leads.filter(l => l.review_bucket === 'High priority review').length,
      avgScore: leads.length > 0
        ? Math.round(leads.reduce((s, l) => s + l.review_score, 0) / leads.length * 10) / 10
        : 0,
    },
    // Key computed rates
    ctrHomepageToIntake: last7Events.filter(e => e.event === 'homepage_view').length > 0
      ? Math.round(last7Events.filter(e => e.event === 'intake_start').length /
          last7Events.filter(e => e.event === 'homepage_view').length * 100)
      : 0,
    intakeToSubmit: last7Events.filter(e => e.event === 'intake_start').length > 0
      ? Math.round(last7Events.filter(e => e.event === 'intake_submit').length /
          last7Events.filter(e => e.event === 'intake_start').length * 100)
      : 0,
    submitToConfirm: last7Events.filter(e => e.event === 'intake_submit').length > 0
      ? Math.round(last7Events.filter(e => e.event === 'submission_success').length /
          last7Events.filter(e => e.event === 'intake_submit').length * 100)
      : 0,
  };
}

// ── Helpers ──────────────────────────────────────────────────────
function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-CA', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function pct(a: number, b: number) {
  return b > 0 ? Math.round(a / b * 100) : 0;
}

const BAR = (val: number, max: number, color: string) => (
  <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden', marginTop: 4 }}>
    <div style={{ height: '100%', width: `${max > 0 ? (val / max) * 100 : 0}%`, background: color, borderRadius: 999 }} />
  </div>
);

// ── Page ─────────────────────────────────────────────────────────
export default async function OARAnalyticsDashboard() {
  let data: Awaited<ReturnType<typeof getData>>;
  let errorMsg = '';

  try {
    data = await getData();
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : String(e);
    const empty = { totals: { allTime: 0, last30: 0, last7: 0, today: 0 }, funnelCounts: [], sourceCounts: {}, deviceCounts: {}, ctaCounts: {}, topFaqs: [], accidentTypes: {}, dailyVolume: [], leads: { total: 0, today: 0, last7: 0, highPriority: 0, avgScore: 0 }, ctrHomepageToIntake: 0, intakeToSubmit: 0, submitToConfirm: 0 };
    data = empty;
  }

  const maxFunnel = Math.max(...data.funnelCounts.map(f => f.count), 1);
  const maxSource = Math.max(...Object.values(data.sourceCounts), 1);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, color: '#111' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>⚖️ Ontario Accident Review — Analytics</div>
          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 2 }}>Site-wide event tracking · 7-day funnel</div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            {new Date().toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          <a href="/admin/analytics" style={{ background: '#0d1b2e', color: '#fff', fontWeight: 600, fontSize: '0.8rem', padding: '0.4rem 0.875rem', borderRadius: 6, textDecoration: 'none' }}>↻ Refresh</a>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '0.875rem 1.25rem', marginBottom: '1.5rem', color: '#b91c1c', fontWeight: 600 }}>
            ⚠️ Could not load analytics: {errorMsg}
            {errorMsg.includes('not set') && (
              <span style={{ fontWeight: 400, display: 'block', marginTop: 4, fontSize: '0.8rem' }}>
                Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Vercel environment variables, and run the schema migration to create the analytics_events table.
              </span>
            )}
          </div>
        )}

        {/* ── Key rate cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Events today',     value: data.totals.today,               sub: 'all events' },
            { label: 'Events (7d)',      value: data.totals.last7,               sub: 'all events' },
            { label: 'Homepage → Intake',value: `${data.ctrHomepageToIntake}%`,  sub: '7-day rate' },
            { label: 'Intake → Submit',  value: `${data.intakeToSubmit}%`,       sub: '7-day rate' },
            { label: 'Submit → Confirm', value: `${data.submitToConfirm}%`,      sub: '7-day rate' },
            { label: 'Leads (7d)',       value: data.leads.last7,                sub: 'form submissions' },
            { label: 'High priority',    value: data.leads.highPriority,         sub: `of ${data.leads.total} total` },
            { label: 'Avg lead score',   value: data.leads.avgScore,             sub: 'out of ~21' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1rem 1.125rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1, color: '#111', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Funnel + Sources ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

          {/* Conversion funnel */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>Conversion funnel <span style={{ color: '#9ca3af', fontWeight: 400 }}>(7 days)</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {data.funnelCounts.map((step, i) => {
                const prevCount = i > 0 ? data.funnelCounts[i - 1].count : step.count;
                const rate = pct(step.count, prevCount);
                const isGood = rate >= 60;
                const isBad  = rate < 30 && i > 0;
                return (
                  <div key={step.label + i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>
                        {i > 0 && <span style={{ color: '#d1d5db', marginRight: 6 }}>↓</span>}
                        {step.label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {i > 0 && (
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isBad ? '#ef4444' : isGood ? '#16a34a' : '#d97706' }}>
                            {rate}%
                          </span>
                        )}
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#111' }}>{step.count}</span>
                      </div>
                    </div>
                    {BAR(step.count, maxFunnel, '#0d1b2e')}
                  </div>
                );
              })}
            </div>
            {data.funnelCounts.length === 0 && (
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
                No events yet. Events will appear once users visit the site.
              </p>
            )}
          </div>

          {/* Sources + Device */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.25rem', flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>Traffic sources <span style={{ color: '#9ca3af', fontWeight: 400 }}>(7d)</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(data.sourceCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([src, cnt]) => (
                    <div key={src}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500, textTransform: 'capitalize' }}>{src}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{cnt} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct(cnt, data.totals.last7)}%)</span></span>
                      </div>
                      {BAR(cnt, maxSource, '#1d4ed8')}
                    </div>
                  ))}
                {Object.keys(data.sourceCounts).length === 0 && (
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No data yet</p>
                )}
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem' }}>Device split</div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {(['mobile', 'tablet', 'desktop'] as const).map(d => {
                  const cnt = data.deviceCounts[d] || 0;
                  const total = data.totals.last7;
                  return (
                    <div key={d} style={{ flex: 1, minWidth: 70, background: '#f9fafb', borderRadius: 8, padding: '0.625rem', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: '1.25rem', marginBottom: 2 }}>{d === 'mobile' ? '📱' : d === 'tablet' ? '📋' : '💻'}</div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{pct(cnt, total)}%</div>
                      <div style={{ fontSize: '0.68rem', color: '#6b7280', textTransform: 'capitalize' }}>{d}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA locations + Daily volume ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

          {/* CTA click locations */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>CTA performance <span style={{ color: '#9ca3af', fontWeight: 400 }}>(7d)</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(data.ctaCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([loc, cnt]) => {
                  const maxCta = Math.max(...Object.values(data.ctaCounts), 1);
                  return (
                    <div key={loc}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>{loc}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{cnt}</span>
                      </div>
                      {BAR(cnt, maxCta, '#8a5a1a')}
                    </div>
                  );
                })}
              {Object.keys(data.ctaCounts).length === 0 && (
                <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No CTA clicks tracked yet</p>
              )}
            </div>
          </div>

          {/* Daily event volume */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>Daily event volume <span style={{ color: '#9ca3af', fontWeight: 400 }}>(7d)</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.dailyVolume.length > 0 ? (() => {
                const maxDay = Math.max(...data.dailyVolume.map(d => d[1]), 1);
                return data.dailyVolume.map(([day, cnt]) => (
                  <div key={day}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: '0.8rem', color: '#374151' }}>{new Date(day).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{cnt}</span>
                    </div>
                    {BAR(cnt, maxDay, '#0d9488')}
                  </div>
                ));
              })() : (
                <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Top FAQs + Accident types ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>Top FAQ questions <span style={{ color: '#9ca3af', fontWeight: 400 }}>(7d)</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.topFaqs.length > 0 ? data.topFaqs.map(([q, cnt]) => (
                <div key={q} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.4, flex: 1 }}>{q.length > 60 ? q.slice(0, 57) + '...' : q}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.8rem', flexShrink: 0, color: '#1d4ed8' }}>{cnt}×</span>
                </div>
              )) : (
                <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No FAQ interactions yet</p>
              )}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem' }}>Lead accident types <span style={{ color: '#9ca3af', fontWeight: 400 }}>(all time)</span></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {Object.entries(data.accidentTypes)
                .sort((a, b) => b[1] - a[1])
                .map(([type, cnt]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: '0.3rem 0.625rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{type}</span>
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#1d4ed8', background: '#eff6ff', borderRadius: 4, padding: '0.1rem 0.35rem' }}>{cnt}</span>
                  </div>
                ))}
              {Object.keys(data.accidentTypes).length === 0 && (
                <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No lead data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Schema setup notice (shown when no data) ── */}
        {data.totals.allTime === 0 && !errorMsg && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, color: '#92400e', marginBottom: '0.5rem' }}>📋 One-time setup required</div>
            <p style={{ color: '#78350f', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
              Run this SQL in your Supabase project (SQL Editor) to create the analytics table, then events will start appearing here:
            </p>
            <pre style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 6, padding: '0.875rem', marginTop: '0.875rem', fontSize: '0.78rem', color: '#78350f', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
{`create table if not exists public.analytics_events (
  id             bigserial primary key,
  event          text not null,
  device         text,
  traffic_source text,
  utm_medium     text,
  utm_campaign   text,
  landing_page   text,
  accident_type  text,
  claim_status   text,
  ontario_yn     text,
  injured        text,
  step           integer,
  step_label     text,
  cta_text       text,
  cta_location   text,
  trigger        text,
  question       text,
  props          jsonb,
  occurred_at    timestamptz not null default now()
);
create index on public.analytics_events (event);
create index on public.analytics_events (occurred_at desc);`}
            </pre>
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af', marginTop: '1rem' }}>
          ontarioaccidentreview.ca · Supabase analytics · Data in Eastern time
        </div>
      </div>
    </div>
  );
}
