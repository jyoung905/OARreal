import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// ── Types ──────────────────────────────────────────────────────────────────
type Lead = {
  id: string;
  submitted_at: string;
  full_name: string;
  phone: string;
  email: string;
  contact_method: string;
  best_time: string;
  accident_type: string;
  accident_date: string;
  city_area: string;
  in_ontario: string;
  injured: string;
  medical_attention: string;
  work_impact: string;
  ongoing_symptoms: string;
  spoken_with_lawyer: string;
  currently_represented: string;
  third_party_involved: string;
  accident_summary: string;
  review_score: number;
  review_bucket: string;
  source_page: string;
};

// ── Supabase client ────────────────────────────────────────────────────────
function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not set');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// ── Data fetching ──────────────────────────────────────────────────────────
async function getData() {
  const supabase = getClient();
  const table = process.env.SUPABASE_INTAKE_TABLE || 'intake_submissions';

  const { data: leads, error } = await supabase
    .from(table)
    .select('id,submitted_at,full_name,phone,email,contact_method,best_time,accident_type,accident_date,city_area,in_ontario,injured,medical_attention,work_impact,ongoing_symptoms,spoken_with_lawyer,currently_represented,third_party_involved,accident_summary,review_score,review_bucket,source_page')
    .order('submitted_at', { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);

  const all = (leads ?? []) as Lead[];
  const now = new Date();

  const cutoff = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString();
  };

  const todayStr = now.toISOString().slice(0, 10);
  const today   = all.filter(l => l.submitted_at.slice(0, 10) === todayStr);
  const last7   = all.filter(l => l.submitted_at >= cutoff(7));
  const last30  = all.filter(l => l.submitted_at >= cutoff(30));

  // Bucket counts
  const buckets: Record<string, number> = {};
  for (const l of all) {
    buckets[l.review_bucket] = (buckets[l.review_bucket] || 0) + 1;
  }

  // Score distribution: bins 0-4, 5-9, 10-14, 15-19, 20+
  const scoreBins = [0, 0, 0, 0, 0];
  for (const l of all) {
    const s = l.review_score;
    if (s < 5) scoreBins[0]++;
    else if (s < 10) scoreBins[1]++;
    else if (s < 15) scoreBins[2]++;
    else if (s < 20) scoreBins[3]++;
    else scoreBins[4]++;
  }

  // Avg score
  const avgScore = all.length > 0
    ? Math.round(all.reduce((sum, l) => sum + l.review_score, 0) / all.length * 10) / 10
    : 0;

  // Top accident types
  const accidentTypes: Record<string, number> = {};
  for (const l of all) {
    accidentTypes[l.accident_type] = (accidentTypes[l.accident_type] || 0) + 1;
  }

  // High priority rate
  const highPriority = all.filter(l => l.review_bucket === 'High priority review').length;
  const qualifiedPlus = all.filter(l => ['High priority review', 'Qualified review'].includes(l.review_bucket)).length;

  return {
    all, total: all.length, today: today.length, last7: last7.length, last30: last30.length,
    buckets, scoreBins, avgScore, accidentTypes,
    highPriority, qualifiedPlus,
    recent: all.slice(0, 20),
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function bucketColor(bucket: string): string {
  if (bucket.includes('High')) return '#16a34a';
  if (bucket.includes('Qualified')) return '#2563eb';
  if (bucket.includes('Manual')) return '#d97706';
  return '#9ca3af';
}

function scoreColor(score: number): string {
  if (score >= 11) return '#16a34a';
  if (score >= 7) return '#2563eb';
  if (score >= 4) return '#d97706';
  return '#ef4444';
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleString('en-CA', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function OARAnalytics() {
  let data: Awaited<ReturnType<typeof getData>>;
  let errorMsg = '';
  try {
    data = await getData();
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : String(e);
    data = {
      all: [], total: 0, today: 0, last7: 0, last30: 0,
      buckets: {}, scoreBins: [0,0,0,0,0], avgScore: 0, accidentTypes: {},
      highPriority: 0, qualifiedPlus: 0, recent: [],
    };
  }

  const BUCKET_ORDER = [
    'High priority review',
    'Qualified review',
    'Manual review',
    'Low priority review',
    'Outside Ontario / low priority',
    'Already represented / low priority',
  ];

  const maxBucket = Math.max(...Object.values(data.buckets), 1);
  const maxScore  = Math.max(...data.scoreBins, 1);

  const topTypes = Object.entries(data.accidentTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px', color: '#111' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>⚖️ Ontario Accident Review</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.1rem' }}>Lead Analytics Dashboard</div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Auto-refresh on load · {new Date().toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          <a href="/admin/analytics" style={{ background: '#1d4ed8', color: '#fff', fontWeight: 600, fontSize: '0.8rem', padding: '0.4rem 0.875rem', borderRadius: 8, textDecoration: 'none' }}>↻ Refresh</a>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#b91c1c', fontWeight: 600 }}>
            ⚠️ Could not load data: {errorMsg}
          </div>
        )}

        {/* ── Volume stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total leads', value: data.total, sub: 'all time' },
            { label: 'Today',       value: data.today,  sub: 'submissions' },
            { label: 'Last 7 days', value: data.last7,  sub: 'submissions' },
            { label: 'Last 30 days',value: data.last30, sub: 'submissions' },
            { label: 'High priority', value: data.highPriority, sub: `${data.total > 0 ? Math.round(data.highPriority / data.total * 100) : 0}% of all` },
            { label: 'Qualified+',  value: data.qualifiedPlus, sub: `${data.total > 0 ? Math.round(data.qualifiedPlus / data.total * 100) : 0}% of all` },
            { label: 'Avg score',   value: data.avgScore, sub: 'out of ~21' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.125rem 1.25rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, color: '#111', marginBottom: '0.25rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Bucket breakdown + Score distribution ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

          {/* Bucket breakdown */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', color: '#111' }}>Lead quality buckets</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {BUCKET_ORDER.map(bucket => {
                const count = data.buckets[bucket] || 0;
                const pct   = data.total > 0 ? Math.round(count / data.total * 100) : 0;
                const color = bucketColor(bucket);
                return (
                  <div key={bucket}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>{bucket}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{count} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(count / maxBucket) * 100}%`, background: color, borderRadius: 999, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score distribution */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', color: '#111' }}>Score distribution</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { range: '0 – 4 (Low)',      idx: 0, color: '#ef4444' },
                { range: '5 – 9 (Manual)',   idx: 1, color: '#d97706' },
                { range: '10 – 14 (Qualified)', idx: 2, color: '#2563eb' },
                { range: '15 – 19 (High)',   idx: 3, color: '#16a34a' },
                { range: '20+ (Top)',         idx: 4, color: '#059669' },
              ].map(({ range, idx, color }) => {
                const count = data.scoreBins[idx];
                return (
                  <div key={range}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>{range}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{count}</span>
                    </div>
                    <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(count / maxScore) * 100}%`, background: color, borderRadius: 999 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', fontSize: '0.8rem', color: '#6b7280' }}>
              Score ≥ 11 = refer · ≥ 7 = qualified · ≥ 4 = manual review
            </div>
          </div>
        </div>

        {/* ── Accident types ── */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', color: '#111' }}>Accident types</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
            {topTypes.map(([type, count]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.4rem 0.75rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.82rem', color: '#111' }}>{type}</span>
                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#1d4ed8', background: '#eff6ff', borderRadius: 6, padding: '0.1rem 0.4rem' }}>{count}</span>
              </div>
            ))}
            {topTypes.length === 0 && <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No data yet</span>}
          </div>
        </div>

        {/* ── Recent leads table ── */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111' }}>Recent leads <span style={{ color: '#6b7280', fontWeight: 400 }}>(last 20)</span></div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Click row to expand</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Time', 'Name', 'Contact', 'Accident type', 'Area', 'Score', 'Bucket'].map(h => (
                    <th key={h} style={{ padding: '0.625rem 1rem', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recent.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>No leads yet</td>
                  </tr>
                )}
                {data.recent.map((lead, i) => (
                  <tr
                    key={lead.id}
                    style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}
                  >
                    <td style={{ padding: '0.75rem 1rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{fmt(lead.submitted_at)}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      <div>{lead.full_name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 400 }}>{lead.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#374151', whiteSpace: 'nowrap' }}>
                      <div>{lead.phone}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{lead.contact_method} · {lead.best_time}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#374151' }}>{lead.accident_type}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#374151', whiteSpace: 'nowrap' }}>{lead.city_area}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: scoreColor(lead.review_score) }}>{lead.review_score}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: `${bucketColor(lead.review_bucket)}18`,
                        color: bucketColor(lead.review_bucket),
                        whiteSpace: 'nowrap',
                      }}>
                        {lead.review_bucket.replace(' review', '').replace(' / low priority', '')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Lead detail cards for high priority ── */}
        {data.all.filter(l => l.review_bucket === 'High priority review').length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '1rem', color: '#111' }}>
              🟢 High priority leads ({data.all.filter(l => l.review_bucket === 'High priority review').length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {data.all
                .filter(l => l.review_bucket === 'High priority review')
                .slice(0, 10)
                .map(lead => (
                <div key={lead.id} style={{ background: '#fff', border: '1.5px solid #86efac', borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.875rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>{lead.full_name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}>
                        {lead.email} · {lead.phone} · {lead.contact_method} · {lead.best_time}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#16a34a', lineHeight: 1 }}>{lead.review_score}</span>
                      <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>score</span>
                      <span style={{ background: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: '0.72rem', padding: '0.25rem 0.625rem', borderRadius: 6 }}>High priority</span>
                      <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{fmt(lead.submitted_at)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem', marginBottom: '0.875rem' }}>
                    {[
                      { label: 'Accident', value: lead.accident_type },
                      { label: 'Date',     value: lead.accident_date },
                      { label: 'Location', value: lead.city_area },
                      { label: 'Injured',  value: lead.injured },
                      { label: 'Medical',  value: lead.medical_attention },
                      { label: 'Work impact', value: lead.work_impact },
                      { label: 'Symptoms', value: lead.ongoing_symptoms },
                      { label: '3rd party', value: lead.third_party_involved },
                      { label: 'Had lawyer', value: lead.spoken_with_lawyer },
                      { label: 'Represented', value: lead.currently_represented },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ background: '#f9fafb', borderRadius: 6, padding: '0.375rem 0.625rem' }}>
                        <div style={{ fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111', marginTop: '0.1rem' }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {lead.accident_summary && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.75rem', fontSize: '0.85rem', color: '#166534', lineHeight: 1.6 }}>
                      <strong>Summary:</strong> {lead.accident_summary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.72rem', color: '#9ca3af' }}>
          ontarioaccidentreview.ca · Supabase backend · Data shown in Eastern time
        </div>
      </div>
    </div>
  );
}
