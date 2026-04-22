'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Analytics } from '@/lib/analytics';

/* ─────────────────────────────────────────────────────────────────
   HomeContent — Rebrand visual fidelity port
   Visual source of truth: /Desktop/.openclaw/web/src/pages/home.tsx
   Logic preserved: Analytics calls, #intake modal trigger
   ───────────────────────────────────────────────────────────────── */

function trackCta(text, location) {
  Analytics.ctaClick({ cta_text: text, cta_location: location });
  Analytics.intakeStart({ trigger: location });
}

export default function HomeContent() {
  useEffect(() => { Analytics.homepageView(); }, []);

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────────── */}
      {/* Matches rebrand: relative min-h-[90vh] flex items-center bg-primary text-primary-foreground */}
      <section style={{
        position: 'relative', minHeight: '90vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: 'var(--primary)', color: '#fff',
      }}>
        {/* Background image + gradient — matches rebrand opacity-40 mix-blend-overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="/hero.png"
            alt="Professional consultation"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: 0.4, mixBlendMode: 'overlay' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--primary) 0%, rgba(13,27,46,0.8) 50%, rgba(13,27,46,0.4) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '8rem 1.5rem' }}>
          {/* Animated badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            fontSize: '0.875rem', fontWeight: 500,
            color: 'var(--accent)', border: '1px solid rgba(138,90,26,0.3)',
            marginBottom: '2rem', background: 'rgba(138,90,26,0.1)',
          }}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
              <span style={{ position: 'absolute', display: 'inline-flex', width: '100%', height: '100%', borderRadius: '50%', background: 'var(--accent)', opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
              <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex' }} />
            </span>
            Independent SABS Information
          </div>

          {/* Headline — font-serif text-5xl md:text-7xl */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
            fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.1,
            marginBottom: '1.5rem', maxWidth: '750px',
          }}>
            Clarity <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>before</em> you commit.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'rgba(255,255,255,0.8)',
            marginBottom: '2.5rem', maxWidth: '600px', lineHeight: 1.7, fontWeight: 300,
          }}>
            We provide independent, plain-language reviews of your Ontario accident benefits claim. Know what you&apos;re entitled to under the SABS before signing with a law firm or accepting an insurer&apos;s decision.
          </p>

          {/* CTA row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <a
              href="#intake"
              onClick={() => trackCta('Start Your Free Review', 'hero')}
              style={{
                display: 'inline-flex', height: 56, alignItems: 'center',
                padding: '0 2rem', background: 'var(--accent)',
                color: 'var(--primary)', fontSize: '1rem', fontWeight: 500,
                textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#a06d22'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              Start Your Free Review
              <svg style={{ marginLeft: '0.5rem' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <Link
              href="/resources/first-72-hours"
              style={{
                display: 'inline-flex', height: 56, alignItems: 'center',
                padding: '0 2rem', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                fontSize: '1rem', fontWeight: 500, textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            >
              What to do in the first 72 hours
            </Link>
          </div>

          <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            100% confidential and free of charge. No legal commitment.
          </p>
        </div>
      </section>

      {/* ── Trust Signals ─────────────────────────────────────────── */}
      {/* Matches rebrand: py-12 bg-background border-b */}
      <section style={{ padding: '3rem 1.5rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', opacity: 0.7 }}>
            {[
              { stat: '100%', label: 'Independent' },
              { stat: '0',    label: 'Hidden Fees' },
              { stat: '24/7', label: 'Confidential Intake' },
              { stat: 'SABS', label: 'Specialists' },
            ].map(({ stat, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stat}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Problem Section ──────────────────────────────────── */}
      {/* Matches rebrand: py-24 md:py-32 bg-white */}
      <section style={{ padding: 'clamp(4rem,8vw,8rem) 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ maxWidth: 768, margin: '0 auto 4rem', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 400, color: 'var(--primary)',
              marginBottom: '1.5rem', lineHeight: 1.2,
            }}>
              The system is complex. You shouldn&apos;t navigate it alone.
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--muted)', lineHeight: 1.7 }}>
              After a car accident in Ontario, you are immediately thrust into the Statutory Accident Benefits Schedule (SABS). Insurers use complex language, tight deadlines, and strict categorizations (like the Minor Injury Guideline) to manage claims. Without clear information, you risk losing benefits you&apos;re legally entitled to.
            </p>
          </div>

          {/* 3-col card grid — matches rebrand: grid md:grid-cols-3 gap-8 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              {
                icon: <ClockIcon />,
                title: 'Critical Deadlines',
                body: 'You have 7 days to notify your insurer, and 30 days to submit the application. Missing these deadlines can jeopardize your entire claim.',
              },
              {
                icon: <FileIcon />,
                title: 'The MIG Trap',
                body: 'Insurers often push claims into the Minor Injury Guideline (MIG), capping your medical benefits at $3,500. We help you understand if this applies to you.',
              },
              {
                icon: <ShieldIcon />,
                title: 'Lawyer Pressure',
                body: 'Many victims feel pressured to sign with a personal injury lawyer immediately. We provide the facts so you can choose representation on your own terms.',
              },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{
                padding: '2rem', border: '1px solid var(--border)',
                background: 'var(--surface-strong)', display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>{icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.95rem', flex: 1 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      {/* Matches rebrand: py-24 md:py-32 bg-background border-y, 2-col grid */}
      <section id="how-it-works" style={{ padding: 'clamp(4rem,8vw,8rem) 1.5rem', background: 'var(--bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            {/* Left: text + steps */}
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                fontWeight: 400, color: 'var(--primary)',
                marginBottom: '1.5rem', lineHeight: 1.2,
              }}>
                How our independent review works
              </h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--muted)', marginBottom: '3rem', lineHeight: 1.65 }}>
                A simple, transparent process designed to give you clarity and control over your situation.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {[
                  { n: '1', title: 'Submit Your Details', body: 'Fill out our secure, confidential intake form. It takes about 5 minutes and asks targeted questions about your accident and injuries.' },
                  { n: '2', title: 'We Review', body: 'Our SABS specialists analyze your situation against current Ontario regulations, identifying key deadlines and potential benefit categories.' },
                  { n: '3', title: 'Receive Your Report', body: 'You receive a plain-language summary of your likely entitlements, immediate next steps, and questions to ask if you choose to hire a lawyer.' },
                ].map(({ n, title, body }) => (
                  <div key={n} style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{
                      flexShrink: 0, width: 48, height: 48,
                      background: 'var(--primary)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '1.25rem',
                    }}>{n}</div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{title}</h4>
                      <p style={{ color: 'var(--muted)', lineHeight: 1.65, fontSize: '0.95rem' }}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image + floating quote card */}
            <div style={{ position: 'relative' }}>
              <div style={{ aspectRatio: '4/5', background: 'var(--surface-alt)', position: 'relative', overflow: 'hidden' }}>
                <img src="/resources.png" alt="Review process" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' }} />
              </div>
              <div style={{
                position: 'absolute', bottom: -32, left: -32,
                background: '#fff', padding: '2rem', boxShadow: 'var(--shadow-lg)',
                maxWidth: 280, border: '1px solid var(--border)',
              }}>
                <svg style={{ color: 'var(--accent)', marginBottom: '1rem' }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--primary)', lineHeight: 1.5 }}>
                  &ldquo;They explained the MIG limit to me in plain English when my insurer wouldn&apos;t.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────── */}
      {/* Matches rebrand: py-32 bg-primary text-center */}
      <section style={{ padding: 'clamp(5rem,10vw,8rem) 1.5rem', background: 'var(--primary)', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400, color: '#fff',
            marginBottom: '2rem', lineHeight: 1.2,
          }}>
            Ready for some clarity?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', fontWeight: 300, lineHeight: 1.65 }}>
            Start your free, no-obligation review today. Understand your rights before the critical deadlines pass.
          </p>
          <a
            href="#intake"
            onClick={() => trackCta('Start Your Free Review', 'cta_section')}
            style={{
              display: 'inline-flex', height: 56, alignItems: 'center',
              padding: '0 2.5rem', background: 'var(--accent)',
              color: 'var(--primary)', fontSize: '1.125rem', fontWeight: 500,
              textDecoration: 'none', transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#a06d22'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            Start Your Free Review
          </a>
          <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Completely confidential. We do not share your information with law firms or insurers.
          </p>
        </div>
      </section>
    </>
  );
}

/* ── SVG Icons ─────────────────────────────────────────────────── */
function ClockIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function FileIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}
function ShieldIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
