'use client';

import { useEffect, useMemo, useState } from 'react';
import { Analytics } from '@/lib/analytics';

const QUESTIONS = [
  {
    key: 'offer',
    question: 'What is happening with the offer?',
    options: [
      ['early', 'I received an offer quickly'],
      ['low', 'The offer feels too low'],
      ['pressure', 'I feel pressured to sign'],
      ['none', 'No offer yet'],
    ],
  },
  {
    key: 'treatment',
    question: 'What is happening with treatment?',
    options: [
      ['denied', 'Treatment was denied or cut off'],
      ['ongoing', 'I still need treatment'],
      ['approved', 'Treatment is mostly approved'],
      ['unsure', 'I am not sure'],
    ],
  },
  {
    key: 'work',
    question: 'Did the accident affect work or income?',
    options: [
      ['missed', 'Yes, I missed work'],
      ['reduced', 'Yes, reduced hours/duties'],
      ['no', 'No major work impact'],
      ['unsure', 'Not sure yet'],
    ],
  },
];

const SCORE = {
  early: 2,
  low: 3,
  pressure: 3,
  none: 1,
  denied: 3,
  ongoing: 2,
  approved: 0,
  unsure: 1,
  missed: 3,
  reduced: 2,
  no: 0,
};

function getResult(total) {
  if (total >= 7) {
    return {
      label: 'Worth reviewing before you sign',
      tone: 'high',
      body: 'Based on your answers, there may be claim issues worth clarifying before you accept an offer or close your file.',
      bullets: ['Settlement pressure', 'Treatment or benefit issues', 'Possible income/work impact'],
    };
  }
  if (total >= 4) {
    return {
      label: 'Some warning signs to clarify',
      tone: 'medium',
      body: 'Your situation may still be straightforward, but there are enough details that a private review could help you understand what questions to ask next.',
      bullets: ['Offer timing', 'Treatment status', 'Benefits that may still apply'],
    };
  }
  return {
    label: 'Still worth understanding your options',
    tone: 'low',
    body: 'Even if there are fewer obvious warning signs, it can help to understand what benefits, timelines, and next steps may apply before making a decision.',
    bullets: ['General benefit awareness', 'Deadline reminders', 'No-pressure next steps'],
  };
}

function MiniChecker() {
  const [answers, setAnswers] = useState({});
  const answered = Object.keys(answers).length;
  const result = useMemo(() => {
    const total = Object.values(answers).reduce((sum, value) => sum + (SCORE[value] || 0), 0);
    return getResult(total);
  }, [answers]);
  const complete = answered === QUESTIONS.length;

  const select = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    Analytics.ctaClick({ cta_text: `Settlement checker answer: ${key}`, cta_location: 'settlement_checker' });
  };

  return (
    <div className="settlement-checker-card">
      <div className="checker-topline">
        <span>{answered}/{QUESTIONS.length} answered</span>
        <div><i style={{ width: `${(answered / QUESTIONS.length) * 100}%` }} /></div>
      </div>
      <div className="checker-questions">
        {QUESTIONS.map(item => (
          <div key={item.key} className="checker-question">
            <strong>{item.question}</strong>
            <div className="checker-options">
              {item.options.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={answers[item.key] === value ? 'selected' : ''}
                  onClick={() => select(item.key, value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={`checker-result ${complete ? result.tone : ''}`}>
        <span>{complete ? 'Your private pre-check' : 'Answer 3 questions'}</span>
        <h3>{complete ? result.label : 'See if your settlement offer has warning signs.'}</h3>
        <p>{complete ? result.body : 'This does not give legal advice. It helps you decide whether a free review may be worth starting.'}</p>
        {complete && <ul>{result.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
        <a href="#intake" className="oar-btn oar-btn-primary" onClick={() => Analytics.ctaClick({ cta_text: 'Start free settlement review', cta_location: 'settlement_checker_result' })}>Start free review <span>→</span></a>
      </div>
    </div>
  );
}

export default function SettlementCheckerContent() {
  const [checkerOpen, setCheckerOpen] = useState(false);

  const openChecker = (location = 'settlement_hero') => {
    setCheckerOpen(true);
    Analytics.ctaClick({ cta_text: 'Open settlement offer checker', cta_location: location });
  };

  useEffect(() => {
    if (window.location.hash === '#checker') {
      setCheckerOpen(true);
    }
  }, []);

  return (
    <main>
      <style>{`
        .settlement-hero{position:relative;overflow:hidden;padding:clamp(3.5rem,7vw,6.5rem) 0;background:radial-gradient(circle at 82% 10%,rgba(18,154,159,.14),transparent 34%),linear-gradient(180deg,#FAF7F1,#FFFDF8)}
        .settlement-hero:before{content:'';position:absolute;right:-140px;bottom:-240px;width:620px;height:620px;border-radius:50%;background:rgba(234,243,255,.8)}
        .settlement-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(330px,.86fr);gap:clamp(2rem,5vw,4.5rem);align-items:center}
        .settlement-hero h1{max-width:760px;color:var(--primary);font-size:clamp(3rem,6.2vw,5.9rem);line-height:.94;margin:0 0 1rem}
        .settlement-lede{max-width:690px;color:var(--primary);font-size:clamp(1.16rem,2vw,1.45rem);line-height:1.48;font-weight:650;margin:0 0 .85rem}
        .settlement-sub{max-width:650px;color:var(--muted);font-size:1.02rem;line-height:1.72;margin:0}
        .settlement-proof{display:flex;flex-wrap:wrap;gap:.55rem;margin:1.4rem 0 1.7rem}.settlement-proof span{padding:.45rem .72rem;border-radius:999px;background:#fff;border:1px solid var(--border);color:var(--primary);font-weight:850;font-size:.84rem;box-shadow:var(--shadow)}
        .checker-launch-card{background:rgba(255,255,255,.94);border:1px solid var(--border);box-shadow:var(--shadow-lg);border-radius:34px;padding:clamp(1.25rem,3vw,1.75rem);position:relative;overflow:hidden}.checker-launch-card:before{content:'';position:absolute;right:-70px;top:-70px;width:180px;height:180px;border-radius:50%;background:rgba(18,154,159,.12)}.checker-launch-card>*{position:relative}.checker-launch-badge{display:inline-flex;align-items:center;gap:.45rem;padding:.4rem .65rem;border-radius:999px;background:var(--success-soft);color:var(--success);font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;font-weight:950}.checker-launch-card h2{font-family:var(--font-display);font-size:clamp(2rem,3vw,3rem);line-height:1;margin:1rem 0 .75rem;color:var(--primary)}.checker-launch-card p{color:var(--muted);line-height:1.65;margin:0 0 1rem}.checker-launch-list{display:grid;gap:.6rem;margin:1rem 0 1.35rem;padding:0;list-style:none}.checker-launch-list li{display:flex;gap:.55rem;align-items:flex-start;color:var(--primary);font-weight:800}.checker-launch-list li:before{content:'✓';display:grid;place-items:center;width:22px;height:22px;flex:0 0 22px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-weight:950}.checker-launch-card .oar-btn{width:100%}.checker-launch-note{display:block;margin-top:.75rem;text-align:center;color:var(--muted);font-size:.82rem;font-weight:750}
        .settlement-checker-card{background:rgba(255,255,255,.92);border:1px solid var(--border);box-shadow:var(--shadow-lg);border-radius:34px;padding:clamp(1rem,3vw,1.35rem)}
        .checker-topline{display:grid;gap:.55rem;color:var(--accent);font-size:.75rem;font-weight:950;text-transform:uppercase;letter-spacing:.1em;margin-bottom:1rem}.checker-topline div{height:8px;background:#E6EDF5;border-radius:99px;overflow:hidden}.checker-topline i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--success));border-radius:inherit;transition:width .2s ease}
        .checker-questions{display:grid;gap:.85rem}.checker-question{padding:1rem;border-radius:24px;background:#FBFDFE;border:1px solid var(--border)}.checker-question strong{display:block;color:var(--primary);margin-bottom:.7rem}.checker-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem}.checker-options button{border:1px solid var(--border);background:#fff;border-radius:16px;padding:.72rem .78rem;text-align:left;color:var(--primary);font-weight:800;cursor:pointer;transition:all .15s}.checker-options button:hover{border-color:var(--accent)}.checker-options button.selected{background:var(--success-soft);border-color:var(--success);box-shadow:0 0 0 4px rgba(47,139,110,.10)}
        .checker-result{margin-top:.95rem;padding:1.05rem;border-radius:26px;background:linear-gradient(135deg,var(--primary),#214A86);color:#fff}.checker-result span{display:inline-flex;padding:.35rem .6rem;border-radius:999px;background:rgba(255,255,255,.12);color:#CFE0F7;font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;font-weight:950}.checker-result h3{font-family:var(--font-display);font-size:1.7rem;line-height:1.02;margin:.85rem 0 .55rem;color:#fff}.checker-result p{color:rgba(255,255,255,.78);line-height:1.55;margin:0 0 .85rem}.checker-result ul{margin:.2rem 0 1rem;padding-left:1.15rem;color:rgba(255,255,255,.84);line-height:1.6}.checker-result .oar-btn{width:100%;margin-top:.4rem}.checker-result.medium{background:linear-gradient(135deg,#12224A,#1559B1)}.checker-result.high{background:linear-gradient(135deg,#12224A,#8A5A1A)}
        .settlement-section{padding:clamp(3.5rem,7vw,5.5rem) 0;background:var(--surface-strong)}.settlement-section.alt{background:var(--bg)}.settlement-columns{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(2rem,5vw,4rem);align-items:start}.settlement-section h2{color:var(--primary);font-size:clamp(2.2rem,4.5vw,4.1rem);line-height:1;margin:0 0 .9rem}.settlement-section p{color:var(--muted);line-height:1.75}.warning-list{display:grid;gap:.9rem}.warning-item{display:flex;gap:.8rem;padding:1rem;border-radius:24px;background:#fff;border:1px solid var(--border);box-shadow:var(--shadow)}.warning-item span{width:34px;height:34px;border-radius:14px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;font-weight:950;flex:0 0 34px}.warning-item strong{color:var(--primary);display:block;margin-bottom:.2rem}.warning-item p{font-size:.93rem;margin:0}.settlement-cta-band{padding:clamp(1.3rem,3vw,2rem);border-radius:30px;background:linear-gradient(135deg,var(--primary),#214A86);box-shadow:var(--shadow-md);color:#fff}.settlement-cta-band h2{color:#fff}.settlement-cta-band p{color:rgba(255,255,255,.76)}
        .checker-modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(11,23,52,.68);backdrop-filter:blur(10px);display:grid;place-items:center;padding:1rem}.checker-modal{width:min(760px,100%);max-height:min(92vh,900px);overflow:auto;background:#fff;border-radius:34px;box-shadow:0 30px 90px rgba(11,23,52,.35);padding:clamp(1rem,3vw,1.35rem);position:relative}.checker-modal-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;padding:.25rem .2rem 1rem}.checker-modal-head p{margin:.2rem 0 0;color:var(--muted);font-weight:750}.checker-modal-head strong{display:block;color:var(--primary);font-size:1.15rem}.checker-modal-close{border:1px solid var(--border);background:#fff;color:var(--primary);border-radius:999px;width:42px;height:42px;font-size:1.45rem;line-height:1;cursor:pointer;box-shadow:var(--shadow)}.checker-modal .settlement-checker-card{box-shadow:none;background:#FBFDFE}.checker-modal .checker-result{position:sticky;bottom:0}
        @media(max-width:900px){.settlement-grid,.settlement-columns{grid-template-columns:1fr}.settlement-hero h1{font-size:clamp(3rem,13vw,4.3rem)}.checker-options{grid-template-columns:1fr}}
      `}</style>

      {checkerOpen && (
        <div className="checker-modal-overlay" role="dialog" aria-modal="true" aria-label="Settlement offer checker">
          <div className="checker-modal">
            <div className="checker-modal-head">
              <div>
                <strong>Your private settlement offer check</strong>
                <p>Answer 3 questions. This is the actual checker.</p>
              </div>
              <button type="button" className="checker-modal-close" aria-label="Close settlement checker" onClick={() => setCheckerOpen(false)}>×</button>
            </div>
            <MiniChecker />
          </div>
        </div>
      )}

      <section className="settlement-hero">
        <div className="container settlement-grid">
          <div>
            <p className="oar-eyebrow">Ontario settlement checker</p>
            <h1>Got an accident settlement offer?</h1>
            <p className="settlement-lede">Before you accept, take a private two-minute pre-check to spot common warning signs around treatment, income, pressure, and claim timing.</p>
            <p className="settlement-sub">Ontario Accident Review is not your insurer and not a law firm. This free checker is a calm first step to understand what may be worth reviewing before you make a decision.</p>
            <div className="settlement-proof">
              <span>No policy number needed</span>
              <span>Private</span>
              <span>Free review</span>
              <span>No obligation</span>
            </div>
            <div className="oar-hero-actions">
              <button type="button" className="oar-btn oar-btn-primary" onClick={() => openChecker('settlement_hero_primary')}>Get my offer check <span>→</span></button>
              <a href="#warning-signs" className="oar-btn oar-btn-secondary">See warning signs</a>
            </div>
          </div>
          <div id="checker" className="checker-launch-card">
            <span className="checker-launch-badge">Actual checker</span>
            <h2>Start the 3-question offer check</h2>
            <p>This is not a sample. Click below and the private checker opens so you can answer the questions one by one.</p>
            <ul className="checker-launch-list">
              <li>Offer pressure or low offer concerns</li>
              <li>Treatment denied, delayed, or still ongoing</li>
              <li>Missed work, reduced duties, or income impact</li>
            </ul>
            <button type="button" className="oar-btn oar-btn-primary" onClick={() => openChecker('settlement_checker_launch_card')}>Open the checker <span>→</span></button>
            <small className="checker-launch-note">Private, free, and takes about two minutes.</small>
          </div>
        </div>
      </section>

      <section id="warning-signs" className="settlement-section">
        <div className="container settlement-columns">
          <div>
            <p className="oar-eyebrow">Common warning signs</p>
            <h2>Settlement offers can arrive before the full picture is clear.</h2>
            <p>Some Ontario accident claims involve treatment denials, income loss, or pressure to close the file before symptoms and benefit needs are fully understood.</p>
          </div>
          <div className="warning-list">
            <div className="warning-item"><span>1</span><div><strong>The offer came quickly</strong><p>An early offer may not reflect ongoing treatment needs, income disruption, or future recovery issues.</p></div></div>
            <div className="warning-item"><span>2</span><div><strong>Treatment was denied or delayed</strong><p>Denied physiotherapy, rehab, assessments, or other benefits can change what questions are worth asking before settlement.</p></div></div>
            <div className="warning-item"><span>3</span><div><strong>You missed work or changed duties</strong><p>Income replacement and work-impact questions may matter if the accident affected your earning ability.</p></div></div>
            <div className="warning-item"><span>4</span><div><strong>You feel pressured to sign</strong><p>If you are being pushed to accept quickly, pause and understand your next-step options first.</p></div></div>
          </div>
        </div>
      </section>

      <section className="settlement-section alt">
        <div className="container settlement-columns">
          <div className="settlement-cta-band">
            <p className="oar-eyebrow light">Free private review</p>
            <h2>Understand your situation before accepting less.</h2>
            <p>Start with the existing Ontario Accident Review intake. It takes about two minutes and does not require your claim number, policy number, or documents to begin.</p>
            <a href="#intake" className="oar-btn oar-btn-light" onClick={() => Analytics.ctaClick({ cta_text: 'Start settlement review', cta_location: 'settlement_cta_band' })}>Start free review <span>→</span></a>
          </div>
          <div className="oar-card-grid three">
            <div className="oar-card"><strong>Not legal advice</strong><p>This is general claim-navigation information and a review request, not legal representation.</p></div>
            <div className="oar-card"><strong>Not your insurer</strong><p>Ontario Accident Review is not connected to your insurer and does not notify them when you submit.</p></div>
            <div className="oar-card"><strong>No pressure</strong><p>If your situation fits, you may receive practical next-step information. There is no obligation.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}
