'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Analytics } from '@/lib/analytics';
import { OntarioMap } from './OntarioMap';

/* ─────────────────────────────────────────────────────────────────
   HomeContent — Rebrand 2026
   Matches mockup #1 (desktop hero) + #2 (mobile hero) + #3 (intake intro).
   Calm, premium, Ontario-focused. Cream bg, navy headings, blue CTAs.
   ───────────────────────────────────────────────────────────────── */

function trackCta(text, location) {
  Analytics.ctaClick({ cta_text: text, cta_location: location });
  Analytics.intakeStart({ trigger: location });
}

const REASSURANCE = ['Free', 'Confidential', 'No obligation'];

const BENEFITS = [
  'Treatment & rehabilitation coverage',
  'Income replacement benefits',
  'Caregiver & attendant benefits',
  'Medical assessments & reports',
  'Travel & other reasonable expenses',
];

const DEADLINES = [
  { label: 'Report your accident',     detail: 'As soon as possible',  tone: 'green' },
  { label: 'Apply for benefits',        detail: 'Within 30 days',        tone: 'blue' },
  { label: 'Respond to insurer',        detail: 'Within 30 days',        tone: 'amber' },
  { label: 'Appeal a decision',         detail: 'Within 6 months',       tone: 'muted' },
];

const STEPS = [
  { num: '1', title: 'Answer a few questions', desc: 'Takes about 2 minutes. No policy number, claim number, or uploads needed to start.' },
  { num: '2', title: 'We review your details',  desc: 'Our team looks at what may apply: benefits, deadlines, common delays, and next steps.' },
  { num: '3', title: 'Get your personalized summary', desc: 'Know your options and a clear next step. No pressure to proceed with anything.' },
];

const NEED_REVIEW = [
  { icon: 'spark',    title: 'You were injured in an Ontario accident',     body: 'Car, motorcycle, pedestrian, cyclist, transit, or rideshare — accident benefits may apply regardless of fault.' },
  { icon: 'shield',   title: 'Insurance has delayed, denied, or reduced benefits', body: 'A plain-language review can help you understand your options if a decision feels unfair or stalled.' },
  { icon: 'compass',  title: 'You\'re unsure what benefits apply',           body: 'Ontario\'s Statutory Accident Benefits Schedule (SABS) is complex. We help you make sense of it without jargon.' },
  { icon: 'clock',    title: 'You\'re missing work or paying out-of-pocket', body: 'Income replacement, treatment, and rehabilitation coverage may be available. We\'ll help you understand what you can claim.' },
  { icon: 'help',     title: 'Your claim feels confusing or stalled',       body: 'Sometimes the next step is just clarity — knowing what you\'re entitled to ask for, and when.' },
];

const FAQS = [
  { q: 'Is the review really free?',                a: 'Yes. The initial accident benefits review is free, and there is no obligation to proceed with anything afterwards.' },
  { q: 'Do I need my policy number or documents?',  a: 'No — you can start without a policy number, claim number, or any uploads. We only need basic information about what happened.' },
  { q: 'Is Ontario Accident Review a law firm?',    a: 'No. Ontario Accident Review is not a law firm and does not provide legal advice. Our reviews are for general claim-navigation purposes only.' },
  { q: 'Will my insurer be notified?',              a: 'No. Ontario Accident Review is not connected to your insurer and will not contact your insurance company on your behalf.' },
  { q: 'What happens after I submit?',              a: 'Your information is reviewed within 1–2 business days. If your situation appears to fit our criteria, a representative will reach out with a personalized summary of next steps.' },
  { q: 'Are there deadlines I should know about?',  a: 'Ontario accident claims involve time-sensitive steps — including a 30-day window to apply for benefits. If you believe a deadline is urgent, please don\'t wait — speak with a qualified legal professional promptly.' },
];

/* Inline icon helper */
function Icon({ name, size = 20, color = 'currentColor' }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'check':       return <svg {...props}><polyline points="20 6 9 17 4 12"/></svg>;
    case 'check-circle':return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="9 12 12 15 16 10"/></svg>;
    case 'arrow-right': return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case 'shield':      return <svg {...props}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/></svg>;
    case 'shield-check':return <svg {...props}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><polyline points="9 12 11 14 15 10"/></svg>;
    case 'lock':        return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case 'user-check':  return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>;
    case 'calendar':    return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case 'chevron-down':return <svg {...props}><polyline points="6 9 12 15 18 9"/></svg>;
    case 'compass':     return <svg {...props}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
    case 'clock':       return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case 'spark':       return <svg {...props}><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/><path d="M5 16l.75 2.25L8 19l-2.25.75L5 22l-.75-2.25L2 19l2.25-.75z"/></svg>;
    case 'help':        return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case 'message':     return <svg {...props}><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>;
    case 'leaf':        return <svg {...props}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>;
    case 'briefcase':   return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    case 'wallet':      return <svg {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;
    case 'heart':       return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
    case 'plane':       return <svg {...props}><path d="M2 12l8-4 4-8 4 8 8 4-8 4-4 8-4-8z"/></svg>;
    case 'clipboard':   return <svg {...props}><path d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2z"/><path d="M5 6h14v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/></svg>;
    default: return null;
  }
}

const benefitIcons = ['heart','wallet','user-check','clipboard','plane'];

export default function HomeContent() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      {/* ───── HERO ───── */}
      <section style={{ position: 'relative', background: 'var(--bg)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-soft) 100%)', zIndex: 0 }} aria-hidden="true" />
        <div className="oar-container-wide" style={{ position: 'relative', zIndex: 1, padding: 'clamp(2.5rem, 5vw, 4.5rem) 1.5rem clamp(2rem, 4vw, 3rem)' }}>
          <div className="oar-hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)', gap: 'clamp(2rem, 5vw, 5rem)', alignItems: 'center' }}>
            {/* Left: copy */}
            <div>
              <div className="oar-eyebrow" style={{ marginBottom: '1.75rem' }}>
                <Icon name="shield-check" size={14} />
                Ontario accident benefits review
              </div>

              <h1 className="oar-h1" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
                Injured in an<br/>Ontario accident?
              </h1>

              <p className="oar-lead" style={{ marginTop: 0, marginBottom: '1rem', maxWidth: 540 }}>
                Start with a free, private review.
              </p>

              <p className="oar-body-lg" style={{ marginTop: 0, marginBottom: '2rem', maxWidth: 540 }}>
                Understand what benefits, deadlines, and next steps may apply &mdash; in plain language, without pressure.
              </p>

              {/* Reassurance pills */}
              <div className="oar-pill-row" style={{ marginBottom: '2.25rem' }}>
                {REASSURANCE.map((item, i) => (
                  <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="oar-pill">
                      <Icon name={i === 0 ? 'lock' : i === 1 ? 'shield-check' : 'user-check'} size={14} color="var(--green)" />
                      {item}
                    </span>
                    {i < REASSURANCE.length - 1 && <span className="oar-pill-dot" />}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <a href="#intake" className="oar-btn oar-btn-primary oar-btn-lg" onClick={() => trackCta('Start My Free Review', 'hero')}>
                  Start My Free Review
                  <span className="oar-btn-arrow"><Icon name="arrow-right" size={14} /></span>
                </a>
                <a href="#how-it-works" className="oar-btn oar-btn-ghost oar-btn-lg" style={{ height: 'auto', padding: 0 }}>
                  See how it works
                  <Icon name="arrow-right" size={14} />
                </a>
              </div>
            </div>

            {/* Right: hero intake widget */}
            <div style={{ position: 'relative', minHeight: 360 }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.6, zIndex: 0 }} aria-hidden="true">
                <OntarioMap size={300} color="rgba(20, 83, 184, 0.18)" />
              </div>
              <div className="oar-hero-card oar-fade-in" style={{ position: 'relative', zIndex: 2, maxWidth: 460, marginLeft: 'auto' }}>
                <div className="oar-hero-card-header">
                  <h3 className="oar-hero-card-title">Your review starts here</h3>
                  <span className="oar-hero-card-private">
                    <Icon name="lock" size={12} color="var(--green)" /> Private &amp; confidential
                  </span>
                </div>

                {/* Mini stepper */}
                <div className="oar-stepper" style={{ marginBottom: '1.5rem' }}>
                  <div className="oar-stepper-item">
                    <span className="oar-step-dot is-active">1</span>
                    <span className="oar-step-label is-active">About you</span>
                  </div>
                  <span className="oar-step-rail" />
                  <div className="oar-stepper-item">
                    <span className="oar-step-dot">2</span>
                    <span className="oar-step-label oar-hide-mobile">Accident</span>
                  </div>
                  <span className="oar-step-rail" />
                  <div className="oar-stepper-item">
                    <span className="oar-step-dot">3</span>
                    <span className="oar-step-label oar-hide-mobile">Injuries</span>
                  </div>
                  <span className="oar-step-rail" />
                  <div className="oar-stepper-item">
                    <span className="oar-step-dot">4</span>
                    <span className="oar-step-label oar-hide-mobile">Review</span>
                  </div>
                </div>

                <div className="oar-field" style={{ marginBottom: '1.25rem' }}>
                  <label className="oar-field-label">When did the accident occur?</label>
                  <div className="oar-input-with-icon">
                    <Icon name="calendar" size={16} color="var(--muted)" />
                    <input type="date" id="oar-hero-date" className="oar-input" placeholder="Select date" />
                  </div>
                </div>

                <a
                  href="#intake"
                  className="oar-btn oar-btn-primary"
                  onClick={() => trackCta('Continue', 'hero_widget')}
                  style={{ width: '100%' }}
                >
                  Continue
                  <Icon name="arrow-right" size={14} />
                </a>

                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center', marginTop: '0.875rem', marginBottom: 0, lineHeight: 1.5 }}>
                  Takes about 2 minutes &middot; No policy number needed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="oar-container-wide" style={{ position: 'relative', zIndex: 1 }}>
          <div className="oar-trust-strip" style={{ borderTop: '1px solid var(--border)' }}>
            <TrustItem icon="shield" tone="blue" title="Private & secure" body="Your information is encrypted and never shared." />
            <TrustItem icon="leaf"   tone="green" title="Ontario-focused" body="We understand Ontario's benefits system." />
            <TrustItem icon="check"  tone="blue" title="Clear & unbiased" body="Get straightforward information about your options." />
            <TrustItem icon="message" tone="green" title="Here to help" body="Support that's human, not hard to reach." />
          </div>
        </div>
      </section>

      {/* ───── BENEFITS + DEADLINES (matches mockup hero subsection) ───── */}
      <section id="who-this-is-for" className="oar-section" style={{ background: '#fff' }}>
        <div className="oar-container">
          <div style={{ maxWidth: 720, marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="oar-eyebrow oar-eyebrow-gold" style={{ marginBottom: '1rem' }}>
              <Icon name="shield-check" size={14} />
              What we help clarify
            </div>
            <h2 className="oar-h2">A practical look at what may apply to your situation.</h2>
            <p className="oar-body-lg" style={{ marginTop: '1rem' }}>
              In about 2 minutes, you&rsquo;ll know what benefits, deadlines, and next steps to consider &mdash; without making any commitments.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.5rem' }}>
            {/* Possible benefits card */}
            <div className="oar-card oar-card-elevated">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                  background: 'var(--green-soft)', color: 'var(--green-strong)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="shield-check" size={18} />
                </span>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.15rem', fontWeight: 500 }}>
                  Possible benefits may include
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {BENEFITS.map((b, i) => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem 0', borderBottom: i < BENEFITS.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
                    <span className="oar-bullet-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      <Icon name={benefitIcons[i]} size={14} />
                    </span>
                    <span style={{ flex: 1, color: 'var(--text-strong)', fontSize: '0.92rem', fontWeight: 500 }}>{b}</span>
                    <span className="oar-bullet-check"><Icon name="check" size={12} /></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important deadlines card */}
            <div className="oar-card oar-card-elevated">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="clock" size={18} />
                </span>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.15rem', fontWeight: 500 }}>
                  Important deadlines
                </h3>
              </div>
              <div className="oar-timeline">
                {DEADLINES.map(d => (
                  <div key={d.label} className={`oar-timeline-row is-${d.tone}`}>
                    <span className="oar-timeline-marker">
                      <Icon name={d.tone === 'green' ? 'check' : d.tone === 'amber' ? 'clock' : 'calendar'} size={14} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <p className="oar-timeline-label" style={{ margin: 0 }}>{d.label}</p>
                      <p className="oar-timeline-detail" style={{ margin: 0 }}>{d.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/blog/ontario-accident-deadlines" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', marginTop: '1.25rem' }}>
                See all deadlines <Icon name="arrow-right" size={14} />
              </Link>
            </div>

            {/* Who this is for */}
            <div className="oar-card oar-card-elevated">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                  background: 'var(--gold-soft)', color: 'var(--gold-strong)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="user-check" size={18} />
                </span>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--primary)', fontSize: '1.15rem', fontWeight: 500 }}>
                  Who this is for
                </h3>
              </div>
              <div className="oar-bullet-list">
                {NEED_REVIEW.map((item) => (
                  <div key={item.title} className="oar-bullet">
                    <span className="oar-bullet-icon"><Icon name="check" size={14} /></span>
                    <div>
                      <p style={{ margin: 0, color: 'var(--text-strong)', fontWeight: 600, fontSize: '0.92rem' }}>{item.title}</p>
                      <p style={{ margin: '0.15rem 0 0', color: 'var(--muted)', fontSize: '0.825rem', lineHeight: 1.55 }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="oar-section" style={{ background: 'var(--bg)' }}>
        <div className="oar-container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto clamp(2rem, 5vw, 3.5rem)' }}>
            <div className="oar-eyebrow" style={{ marginBottom: '1rem' }}>How it works</div>
            <h2 className="oar-h2">Three simple steps. No pressure.</h2>
            <p className="oar-body-lg" style={{ marginTop: '1rem' }}>
              You stay in control the entire time. We just help you understand what to consider.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="oar-card" style={{ background: '#fff' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44, borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-soft)', color: 'var(--accent)',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem',
                  marginBottom: '1.125rem',
                }}>{num}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--primary)', marginTop: 0, marginBottom: '0.625rem', fontWeight: 500, letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.95rem', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="oar-section" style={{ background: 'var(--primary)', color: '#fff' }}>
        <div className="oar-container-narrow" style={{ textAlign: 'center' }}>
          <div className="oar-eyebrow is-on-dark" style={{ marginBottom: '1rem' }}>Start your review</div>
          <h2 className="oar-h2" style={{ color: '#fff', marginBottom: '1.25rem' }}>
            Find out what may apply, before the claim stalls further.
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.78)', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            About 2 minutes. No policy number. No uploads. No obligation.
          </p>
          <a href="#intake" className="oar-btn oar-btn-primary oar-btn-lg" onClick={() => trackCta('Start My Free Review', 'final_cta')}>
            Start My Free Review
            <span className="oar-btn-arrow"><Icon name="arrow-right" size={14} /></span>
          </a>
          <p style={{ marginTop: '1.75rem', maxWidth: 720, marginInline: 'auto', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            Ontario Accident Review is not a law firm and does not provide legal advice. The free review is for general claim-navigation purposes only. Where appropriate, users may be connected with a qualified legal professional or relevant service provider.
          </p>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="oar-section" style={{ background: '#fff' }}>
        <div className="oar-container-narrow">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <div className="oar-eyebrow" style={{ marginBottom: '1rem' }}>Frequently asked questions</div>
            <h2 className="oar-h2">Plain answers to common questions.</h2>
          </div>
          <div className="oar-card" style={{ background: 'var(--bg)', padding: '0.5rem 1.5rem' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
                <button
                  onClick={() => { setOpenFaq(openFaq === i ? null : i); Analytics.faqExpand({ question: faq.q, question_index: i }); }}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '1.25rem 0',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--accent-soft)', color: 'var(--accent)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.78rem', flexShrink: 0,
                    }}>?</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 500, color: 'var(--primary)', lineHeight: 1.4 }}>{faq.q}</span>
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', color: 'var(--accent)', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                    <Icon name="chevron-down" size={18} color="currentColor" />
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ paddingBottom: '1.25rem', paddingLeft: '2.5rem', paddingRight: '1rem' }}>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '0.95rem', margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <a href="#intake" onClick={() => trackCta('Start Free Review', 'mobile_sticky')} className="oar-mobile-sticky-cta">Start My Free Review</a>

      {/* Hero responsive */}
      <style>{`
        @media (max-width: 920px) {
          .oar-hero-grid { grid-template-columns: 1fr !important; }
          .oar-hero-grid > div:last-child { min-height: 0 !important; }
          .oar-hero-grid > div:last-child .oar-hero-card { margin: 0 auto !important; }
        }
      `}</style>
    </>
  );
}

function TrustItem({ icon, tone, title, body }) {
  const toneClass = tone === 'green' ? 'is-green' : tone === 'gold' ? 'is-gold' : tone === 'teal' ? 'is-teal' : '';
  return (
    <div className={`oar-trust-item ${toneClass}`}>
      <span className="oar-trust-icon"><Icon name={icon} size={18} /></span>
      <div>
        <p className="oar-trust-title">{title}</p>
        <p className="oar-trust-body">{body}</p>
      </div>
    </div>
  );
}
