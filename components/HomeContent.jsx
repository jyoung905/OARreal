'use client';
import { useState } from 'react';
import { Analytics } from '@/lib/analytics';

/* ─────────────────────────────────────────────────────────────────
   HomeContent -- Original OAR copy + Rebrand visual design
   Copy source of truth: original HomeContent.jsx (pre-rebrand)
   Visual source of truth: /Desktop/.openclaw/web/src/pages/home.tsx
   ───────────────────────────────────────────────────────────────── */

function trackCta(text, location) {
  Analytics.ctaClick({ cta_text: text, cta_location: location });
  Analytics.intakeStart({ trigger: location });
}

const STEPS = [
  { num: '01', label: 'Initial Intake', title: 'You submit a short form', desc: 'Tell us the basics of your accident and how it has affected you. No documents, no insurance details, no policy numbers required at this stage.' },
  { num: '02', label: 'Submission Review', title: 'Your submission is reviewed', desc: 'A representative reviews your information. If your situation appears to fit our intake criteria, we may follow up with plain-language context on what may apply -- and what next steps are worth considering.' },
  { num: '03', label: 'Your Next Step', title: 'You decide what to do next', desc: 'If your situation appears worth pursuing, we may connect you with a licensed Ontario personal injury lawyer who can explain your options -- at no cost to you. No pressure, no obligation at any stage.' },
];

const WHO_FOR = [
  { num: '01', title: 'Recently hurt in Ontario', body: 'You were recently injured in a car accident in Ontario.' },
  { num: '02', title: 'Unsure about your benefits', body: "You're not sure if you're entitled to accident benefits." },
  { num: '03', title: 'Denied or received a low offer', body: 'You received a denial or low offer from your insurer.' },
  { num: '04', title: 'Symptoms but no claim filed', body: "You're dealing with pain or ongoing symptoms but haven't filed a claim." },
  { num: '05', title: 'Claim closed unexpectedly', body: "Your claim was closed and you're not sure if it should have been." },
  { num: '06', title: 'Want plain-language clarity', body: 'You want a plain-language explanation of your options -- no lawyers, no pressure.' },
];

const WHAT_WE_REVIEW = [
  'Accident benefits (SABS)',
  'Income replacement (general)',
  'Medical & rehabilitation benefits',
  'Caregiver & attendant care',
  'Whether third-party involvement may be relevant',
  'Time-sensitivity of your situation',
];

const WHY_START = [
  { title: "No lawyers, no office visits, no calls you didn't ask for", body: "Fill out a short form. If your situation fits, one representative may follow up -- once, calmly. Nothing more unless you want it." },
  { title: 'Your insurer never finds out you were here', body: 'Ontario Accident Review is not connected to any insurance company. Submitting a review does not notify your insurer or affect your policy.' },
  { title: "Understand your situation before committing to anything", body: "You'll have plain-language context on what may apply before anyone asks you to take a next step. No pressure, no commitment unless you choose it." },
];

const FAQS = [
  { q: 'Is this completely free?', a: 'Yes. The review is completely free. There is no cost at any stage and no obligation to proceed with anything.' },
  { q: 'Will I be pressured or bombarded with calls?', a: 'No. We review your submission before anyone follows up. If your situation fits our criteria, one representative may reach out -- calmly, once -- to explain what may apply. We respect your preferred contact time and method, and you are free to say no to anything.' },
  { q: 'Am I hiring a lawyer by submitting this?', a: 'No. Submitting this form does not hire a lawyer, start a legal case, or create any obligation of any kind. It is simply a review request. Nothing moves forward unless you choose it to.' },
  { q: 'Is Ontario Accident Review connected to my insurance company?', a: 'No. Ontario Accident Review has no connection to your insurer and is not affiliated with any insurance company. We do not notify your insurer that you submitted a review, and your submission is kept confidential.' },
  { q: 'What happens after I submit?', a: 'A representative reviews your submission. If your situation appears to fit our criteria, they may reach out to walk you through what may apply -- in plain language, at no cost. If we don\'t follow up, it means your situation didn\'t meet our intake criteria at this time.' },
  { q: 'Do I need documents or insurance info?', a: 'No. You do not need any documents, policy numbers, insurance details, or anything in writing to get started. Just tell us the basics of what happened.' },
  { q: 'Is my information private?', a: 'Yes. Your information is kept confidential, stored securely, and is never shared with your insurer or any third party without your consent.' },
  { q: 'Are there deadlines I should know about?', a: 'Ontario accident claims can involve various time-sensitive steps. The earlier you understand your situation, the more options you may have. This review does not provide legal deadline advice -- if you believe a deadline is approaching, seek qualified legal advice promptly.' },
];

export default function HomeContent() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      {/* ── Hero ── */}
      {/* Visual: relative min-h-[90vh] flex items-center bg-primary overflow-hidden */}
      <section style={{
        position: 'relative', minHeight: '90vh',
        display: 'flex', alignItems: 'center',
        overflow: 'hidden', background: 'var(--primary)',
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/value-section.jpg" alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.4, mixBlendMode: 'overlay' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--primary) 0%, rgba(13,27,46,0.8) 50%, rgba(13,27,46,0.4) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: 'clamp(8rem,12vw,12rem) 1.5rem' }}>
          {/* Badge -- visual only, using original positioning copy */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--accent)', border: '1px solid rgba(138,90,26,0.3)', marginBottom: '2rem', background: 'rgba(138,90,26,0.1)' }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
              <span style={{ position: 'absolute', display: 'inline-flex', width: '100%', height: '100%', borderRadius: '50%', background: 'var(--accent)', opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex' }} />
            </span>
            Free Accident Benefits Review
          </div>

          {/* Headline -- ORIGINAL OAR COPY */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem,5vw,3.75rem)', fontWeight: 500, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#fff', marginBottom: '1.5rem', maxWidth: '750px' }}>
            Injured in an Ontario Accident? Find Out What Benefits May Apply to Your Claim.
          </h1>

          {/* Subheading -- ORIGINAL OAR COPY */}
          <p style={{ fontSize: 'clamp(1rem,2.5vw,1.125rem)', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', maxWidth: '580px', lineHeight: 1.7, fontWeight: 300 }}>
            In about 2 minutes, tell us what happened. We review your situation and, if it fits our criteria, reach out with plain-language guidance on benefits, deadlines, and next steps -- at no cost.
          </p>

          {/* CTAs -- ORIGINAL CTA TEXT */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <a
              href="#intake"
              onClick={() => trackCta('Get My Free Claim Review', 'hero')}
              style={{ display: 'inline-flex', height: 56, alignItems: 'center', padding: '0 2rem', background: 'var(--accent)', color: '#fff', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}
            >
              Get My Free Claim Review
            </a>
            <a
              href="#how-it-works"
              style={{ display: 'inline-flex', height: 56, alignItems: 'center', padding: '0 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '1rem', fontWeight: 500, textDecoration: 'none' }}
            >
              How it works
            </a>
          </div>

          {/* Trust note -- ORIGINAL COPY */}
          <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Free · Confidential · No obligation · Takes ~2 minutes
          </p>
        </div>
      </section>

      {/* ── Trust strip -- ORIGINAL LABELS ── */}
      {/* Visual: py-12 bg-background border-b, 4-col grid, font-serif text-3xl, opacity-70 */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', opacity: 0.7 }}>
            {[
              { stat: '100%', label: 'Independent' },
              { stat: '$0', label: 'Cost to Start' },
              { stat: '24/7', label: 'Confidential Intake' },
              { stat: 'Ontario', label: 'Accident Claims Only' },
            ].map(({ stat, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stat}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who This Is For -- ORIGINAL OAR COPY ── */}
      {/* Visual: py-24 md:py-32 bg-white, 3-col grid cards with border */}
      <section style={{ padding: 'clamp(4rem,8vw,8rem) 1.5rem', background: '#fff' }} id="who-this-is-for">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ maxWidth: 680, margin: '0 auto 4rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Who This Is For</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.2 }}>
              This free review may be right for you if…
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {WHO_FOR.map(({ num, title, body }) => (
              <div key={num} style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--surface-strong)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{num}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 400 }}>{title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.9rem', flex: 1 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works -- ORIGINAL OAR COPY ── */}
      {/* Visual: py-24 md:py-32 bg-background border-y, 2-col grid */}
      <section id="how-it-works" style={{ padding: 'clamp(4rem,8vw,8rem) 1.5rem', background: 'var(--bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>What Happens Next</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 400, color: 'var(--primary)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                What Happens After You Submit
              </h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--muted)', marginBottom: '3rem', lineHeight: 1.65 }}>
                A simple, transparent process designed to give you clarity and control over your situation.
              </p>

              {/* Steps -- ORIGINAL OAR COPY, rebrand visual (w-12 h-12 navy squares) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {STEPS.map(({ num, label, title, desc }) => (
                  <div key={num} style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ flexShrink: 0, width: 48, height: 48, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{num}</div>
                    <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: '0.25rem' }}>{label}</div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 400 }}>{title}</h4>
                      <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.9rem' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image side with floating quote */}
            <div style={{ position: 'relative' }}>
              <div style={{ aspectRatio: '4/5', background: 'var(--primary)', position: 'relative', overflow: 'hidden' }}>
                <img src="/value-section.jpg" alt="Review process" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', filter: 'brightness(0.65) contrast(1.05)' }} />
                <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' }} />
              </div>
              {/* Floating card -- ORIGINAL OAR POSITIONING */}
              <div style={{ position: 'absolute', bottom: -32, left: -32, background: '#fff', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: 280, border: '1px solid var(--border)' }}>
                <svg style={{ color: 'var(--accent)', marginBottom: '1rem' }} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  &ldquo;No cost · No obligation&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Start Here -- ORIGINAL OAR COPY ── */}
      {/* Visual: py-24 bg-white, 3-col cards */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) 1.5rem', background: '#fff' }} id="why-start-here">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Our Commitment</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.2 }}>
              Why People Start Here First
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {WHY_START.map(({ title, body }) => (
              <div key={title} style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--surface-strong)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--primary)', marginBottom: '0.75rem', fontWeight: 400, lineHeight: 1.3 }}>{title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.9rem', flex: 1 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA section -- ORIGINAL OAR COPY ── */}
      {/* Visual: py-32 bg-primary text-center */}
      <section style={{ padding: 'clamp(5rem,10vw,8rem) 1.5rem', background: 'var(--primary)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>A calm first step</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 400, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            Take the next step
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', fontWeight: 300, lineHeight: 1.65 }}>
            Two minutes. Free. No obligation. No pressure. Just a clearer picture -- before you decide what to do next.
          </p>
          <a
            href="#intake"
            onClick={() => trackCta('Get My Free Claim Review', 'final_cta')}
            style={{ display: 'inline-flex', height: 56, alignItems: 'center', padding: '0 2.5rem', background: 'var(--accent)', color: '#fff', fontSize: '1.0625rem', fontWeight: 600, textDecoration: 'none' }}
          >
            Get My Free Claim Review
          </a>
          <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
            Ontario Accident Review is not a law firm and does not provide legal advice or legal representation. This service is for assessment purposes only.
          </p>
        </div>
      </section>

      {/* ── FAQ -- ORIGINAL OAR QUESTIONS + ANSWERS ── */}
      {/* Visual: py-24 bg-background (light), accordion style */}
      <section id="faq" style={{ padding: 'clamp(4rem,8vw,6rem) 1.5rem', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 768, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: '0.75rem' }}>Plain answers</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.2 }}>
              Questions people usually have before they start
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <button
                  onClick={() => { setOpenFaq(openFaq === i ? null : i); Analytics.faqExpand({ question: faq.q, question_index: i }); }}
                  style={{ width: '100%', textAlign: 'left', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 400, color: 'var(--primary)', lineHeight: 1.4 }}>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {openFaq === i && (
                  <div style={{ paddingBottom: '1.25rem', paddingRight: '2rem' }}>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '0.9375rem' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
