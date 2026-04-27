'use client';
import { useState } from 'react';
import { Analytics } from '@/lib/analytics';

function trackCta(text, location) {
  Analytics.ctaClick({ cta_text: text, cta_location: location });
  Analytics.intakeStart({ trigger: location });
}

const NEED_REVIEW = [
  'You were injured in a car accident',
  'Insurance has delayed, denied, or reduced benefits',
  'You are unsure what accident benefits apply',
  'You are missing work or paying out of pocket for treatment',
  'Your claim feels confusing or stalled',
];

const REVIEW_CHECKS = [
  'Treatment and rehabilitation benefits',
  'Income replacement possibility',
  'Attendant care or caregiver related issues if applicable',
  'Denials, delays, and claim next steps',
  'Whether the claim may be worth speaking to a legal professional about',
];

const STEPS = [
  { num: '01', title: 'Answer a few questions', desc: 'Tell us the basics in plain language. No policy number, document upload, or long statement required to start.' },
  { num: '02', title: 'We review the situation', desc: 'Your answers are reviewed against common Ontario accident benefits issues such as treatment, income replacement, delays, and denials.' },
  { num: '03', title: 'You receive a practical next step', desc: 'If appropriate, we may suggest a next step or connection with a relevant professional or service provider. No obligation.' },
];

const WHY_START = [
  { title: 'Ontario accident benefits are confusing', body: 'Many people do not know what treatment coverage, income replacement, or other benefits may apply after a collision.' },
  { title: 'Delays and denials are common', body: 'If an insurer has stalled, reduced, or denied something, a plain-language review can help identify what may be worth looking at next.' },
  { title: 'No pressure to hire anyone', body: 'The first step is only a free review request. It does not create a legal relationship or require you to move forward.' },
];

const FAQS = [
  { q: 'Is this free?', a: 'Yes. The initial accident benefits review is free and there is no obligation to proceed with anything.' },
  { q: 'Do I need my policy number or documents?', a: 'No. You can start without a policy number, claim number, uploads, or insurance paperwork.' },
  { q: 'Is Ontario Accident Review a law firm?', a: 'No. Ontario Accident Review is not a law firm and does not provide legal advice. The review is for general claim-navigation purposes only.' },
  { q: 'Will my insurer be notified?', a: 'No. Ontario Accident Review is not connected to your insurer and does not notify your insurer when you submit a review request.' },
  { q: 'What happens after I submit?', a: 'Your information is reviewed. If your situation appears to fit, you may be contacted about practical next steps. Where appropriate, you may be connected with a legal professional or relevant service provider.' },
  { q: 'Are there deadlines?', a: 'Ontario accident claims can involve time-sensitive steps. This site does not provide legal deadline advice. If you believe a deadline is urgent, seek qualified legal advice promptly.' },
];

const TRUST_ITEMS = ['Free review', 'Ontario claims only', 'No obligation', 'Takes about 2 minutes'];

export default function HomeContent() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <section style={{ position: 'relative', minHeight: '86vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--primary)' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/value-section.jpg" alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.28, mixBlendMode: 'overlay' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(13,27,46,0.98) 0%, rgba(13,27,46,0.88) 48%, rgba(13,27,46,0.64) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1180, width: '100%', margin: '0 auto', padding: 'clamp(6.5rem,10vw,10rem) 1.5rem' }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)', border: '1px solid rgba(138,90,26,0.35)', marginBottom: '1.75rem', background: 'rgba(138,90,26,0.12)' }}>
              Ontario accident benefits review
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.35rem,5.4vw,4.2rem)', fontWeight: 500, letterSpacing: '-0.035em', lineHeight: 1.06, color: '#fff', marginBottom: '1.35rem' }}>
              Injured in an Ontario Car Accident? Get a Free Accident Benefits Review.
            </h1>
            <p style={{ fontSize: 'clamp(1.02rem,2.2vw,1.2rem)', color: 'rgba(255,255,255,0.84)', marginBottom: '1.35rem', maxWidth: 660, lineHeight: 1.72, fontWeight: 300 }}>
              Answer a few plain-language questions and find out whether treatment coverage, income replacement, or other accident benefits may apply to your situation.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
              {TRUST_ITEMS.map(item => (
                <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'rgba(255,255,255,0.86)', fontSize: '0.9rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />{item}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <a href="#intake" onClick={() => trackCta('Start My Free Accident Review', 'hero')} style={{ display: 'inline-flex', minHeight: 56, alignItems: 'center', justifyContent: 'center', padding: '0 2rem', background: 'var(--accent)', color: '#fff', fontSize: '1rem', fontWeight: 700, textDecoration: 'none' }}>
                Start My Free Accident Review
              </a>
              <a href="#how-it-works" style={{ display: 'inline-flex', minHeight: 56, alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.24)', color: '#fff', fontSize: '1rem', fontWeight: 500, textDecoration: 'none' }}>
                See how it works
              </a>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.62)' }}>
              No policy number or uploads required to start.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(3rem,6vw,5rem) 1.5rem', background: '#fff' }} id="who-this-is-for">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ maxWidth: 700, marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>You may need a review if…</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.85rem,4vw,2.8rem)', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.18 }}>
              You are trying to understand what Ontario accident benefits may apply.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {NEED_REVIEW.map((item, i) => (
              <div key={item} style={{ padding: '1.35rem', border: '1px solid var(--border)', background: 'var(--surface-strong)', display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(138,90,26,0.12)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                <p style={{ margin: 0, color: 'var(--text-strong)', lineHeight: 1.55, fontSize: '0.95rem', fontWeight: 600 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(3rem,6vw,5rem) 1.5rem', background: 'var(--bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>What the free review checks</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.85rem,4vw,2.6rem)', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.18, marginBottom: '1rem' }}>
              A practical look at the benefits and next steps people often miss.
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '1rem' }}>
              This is not legal advice and it is not an approval decision. It is a plain-language review to help identify what may be worth looking at next.
            </p>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {REVIEW_CHECKS.map(item => (
              <div key={item} style={{ background: '#fff', border: '1px solid var(--border)', padding: '1rem 1.15rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span>
                <span style={{ color: 'var(--text-strong)', lineHeight: 1.55, fontWeight: 600 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: 'clamp(4rem,8vw,7rem) 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>How it works</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.85rem,4vw,2.8rem)', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.18 }}>
              Three steps. No pressure.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--surface-strong)' }}>
                <div style={{ width: 44, height: 44, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', marginBottom: '1.2rem' }}>{num}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.6rem', fontWeight: 400 }}>{title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.95rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(3rem,6vw,5rem) 1.5rem', background: 'var(--bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} id="why-start-here">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Why start here</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.85rem,4vw,2.6rem)', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.18 }}>
              Serious, simple, Ontario-specific.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {WHY_START.map(({ title, body }) => (
              <div key={title} style={{ padding: '1.75rem', border: '1px solid var(--border)', background: '#fff' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '0.75rem', fontWeight: 400, lineHeight: 1.3 }}>{title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.93rem' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(4rem,8vw,6rem) 1.5rem', background: 'var(--primary)', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Start your review</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            Find out what may apply before the claim stalls further.
          </h2>
          <p style={{ fontSize: '1.08rem', color: 'rgba(255,255,255,0.82)', marginBottom: '2rem', fontWeight: 300, lineHeight: 1.65 }}>
            The form takes about 2 minutes. No policy number, no uploads, and no obligation.
          </p>
          <a href="#intake" onClick={() => trackCta('Start My Free Accident Review', 'final_cta')} style={{ display: 'inline-flex', minHeight: 56, alignItems: 'center', justifyContent: 'center', padding: '0 2.25rem', background: 'var(--accent)', color: '#fff', fontSize: '1.05rem', fontWeight: 700, textDecoration: 'none' }}>
            Start My Free Accident Review
          </a>
          <p style={{ margin: '1.75rem auto 0', maxWidth: 760, fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            Ontario Accident Review is not a law firm and does not provide legal advice. The free review is for general claim-navigation purposes only. Where appropriate, users may be connected with a legal professional or relevant service provider.
          </p>
        </div>
      </section>

      <section id="faq" style={{ padding: 'clamp(4rem,8vw,6rem) 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 768, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Plain answers</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.2 }}>
              Questions before you start
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <button onClick={() => { setOpenFaq(openFaq === i ? null : i); Analytics.faqExpand({ question: faq.q, question_index: i }); }} style={{ width: '100%', textAlign: 'left', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.4 }}>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {openFaq === i && <div style={{ paddingBottom: '1.25rem', paddingRight: '2rem' }}><p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '0.94rem' }}>{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <a href="#intake" onClick={() => trackCta('Start Free Review', 'mobile_sticky')} className="oar-mobile-sticky-cta">Start Free Review</a>
    </>
  );
}
