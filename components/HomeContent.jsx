'use client';
import { useState } from 'react';
import { Analytics } from '@/lib/analytics';

function trackCta(text, location) {
  Analytics.ctaClick({ cta_text: text, cta_location: location });
  Analytics.intakeStart({ trigger: location });
}

const TRUST_PILLS = [
  { icon: 'lock', label: 'Free' },
  { icon: 'verified_user', label: 'Confidential' },
  { icon: 'person_check', label: 'No obligation' },
];

const TRUST_STRIP = [
  { icon: 'admin_panel_settings', title: 'Private & secure', body: 'Your information is used for your review request.' },
  { icon: 'map', title: 'Ontario-focused', body: 'Built around Ontario accident benefits and timelines.' },
  { icon: 'check_circle', title: 'Clear & unbiased', body: 'Plain-language information about possible next steps.' },
  { icon: 'eco', title: 'Here to help', body: 'Support that feels human, not hard to reach.' },
];

const FEATURES = [
  { icon: 'medical_services', title: 'Benefits that may apply', body: 'Treatment, rehabilitation, income replacement, attendant care, and other possible accident benefits.' },
  { icon: 'event_available', title: 'Deadlines to understand', body: 'A clearer view of common timing issues so you know what may need attention.' },
  { icon: 'description', title: 'Claim issues and documents', body: 'Denials, delays, missing information, insurer communication, and next-step questions.' },
  { icon: 'forum', title: 'Questions to ask next', body: 'A practical summary that helps you decide whether to speak with a professional.' },
];

const STEPS = [
  { title: 'Answer a few questions', body: 'Tell us the basics in plain language. No policy number or document upload required to start.' },
  { title: 'We review your details', body: 'Your answers are reviewed against common Ontario accident benefits issues and timelines.' },
  { title: 'Get a practical follow-up', body: 'You receive clear next-step information. If appropriate, you may be connected with a relevant professional.' },
];

const FAQS = [
  { q: 'Is this free?', a: 'Yes. The initial accident benefits review is free and there is no obligation to proceed with anything.' },
  { q: 'Do I need my policy number?', a: 'No. You can start without a policy number, claim number, uploads, or insurance paperwork.' },
  { q: 'Will my insurer be notified?', a: 'No. Ontario Accident Review is not connected to your insurer and does not notify your insurer when you submit a review request.' },
  { q: 'Is this legal advice?', a: 'No. Ontario Accident Review is not a law firm and does not provide legal advice. The review is for general claim-navigation information only.' },
];

function OntarioMap() {
  return (
    <div className="oar-ontario-map" aria-hidden="true">
      <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M151 50L230 24L305 62L390 82L463 137L437 206L468 265L420 317L319 300L252 357L174 330L103 367L66 289L30 222L79 167L62 101L151 50Z" fill="#EAF4FF" stroke="#9FC6EF" strokeWidth="3" strokeDasharray="4 4" />
        <path d="M74 275C132 240 167 249 218 213C284 166 323 173 411 124" stroke="#C7DFF8" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 7" />
        <circle cx="395" cy="185" r="32" fill="white" stroke="#D8E8FA" strokeWidth="2" />
        <path d="M386 176c7 5 10 12 9 22M404 176c-7 5-10 12-9 22M386 176c6-3 12-3 18 0" stroke="#0B5FC7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function HeroProductMockup() {
  return (
    <div className="oar-product-stage" aria-hidden="true">
      <OntarioMap />

      <div className="oar-floating-form oar-card">
        <h3>Your review starts here</h3>
        <div className="oar-form-progress"><span className="active">1</span> About you <span>2</span> Accident <span>3</span> Injuries <span>4</span> Review</div>
        <strong style={{ display: 'block', color: 'var(--primary)', marginBottom: '.65rem' }}>When did the accident occur?</strong>
        <div className="oar-faux-input"><span className="material-symbols-outlined">calendar_month</span> Select date</div>
        <div className="oar-faux-continue">Continue</div>
      </div>

      <div className="oar-benefit-card oar-card">
        <h3>Possible benefits may include</h3>
        <div className="oar-benefit-list">
          {['Treatment & rehabilitation coverage', 'Income replacement benefits', 'Caregiver & attendant benefits', 'Medical assessments & reports'].map(item => (
            <div className="oar-benefit-row" key={item}><span className="oar-check-dot">✓</span>{item}</div>
          ))}
        </div>
      </div>

      <div className="oar-deadline-card oar-card">
        <h3>Important deadlines</h3>
        <div className="oar-timeline">
          <div className="oar-timeline-row"><span className="oar-timeline-marker done" /><div><strong>Accident occurred</strong><small>April 12, 2024</small></div></div>
          <div className="oar-timeline-row"><span className="oar-timeline-marker" /><div><strong>Apply for benefits</strong><small>As soon as possible</small></div></div>
          <div className="oar-timeline-row"><span className="oar-timeline-marker" style={{ borderColor: 'var(--gold)' }} /><div><strong>Respond to insurer</strong><small>Within 30 days</small></div></div>
        </div>
      </div>

      <div className="oar-review-card oar-card">
        <h3>Your review summary</h3>
        <div className="oar-summary-list">
          {['Benefits snapshot', 'Next steps', 'Important deadlines', 'Helpful resources'].map(item => <div className="oar-summary-row" key={item}><span className="oar-icon blue" style={{ width: 34, height: 34, borderRadius: 12 }}><span className="material-symbols-outlined" style={{ fontSize: 19 }}>article</span></span>{item}</div>)}
        </div>
        <small style={{ display: 'block', marginTop: '1rem', color: 'var(--muted)' }}>This is not legal advice.</small>
      </div>

      <div className="oar-phone-card"><div className="oar-phone-inner"><div className="oar-phone-line blue"/><div className="oar-phone-line"/><div className="oar-phone-line green"/><div className="oar-phone-line"/><div className="oar-phone-line blue"/><div className="oar-phone-line"/></div></div>
    </div>
  );
}

export default function HomeContent() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <section className="oar-hero">
        <div className="oar-hero-bg-object" aria-hidden="true" />
        <div className="oar-container oar-hero-grid">
          <div className="oar-hero-copy">
            <div className="oar-section-kicker"><span className="material-symbols-outlined">verified_user</span> Ontario accident benefits review</div>
            <h1 className="oar-display oar-h1">Injured in an Ontario accident?</h1>
            <div className="oar-blue-copy">Start with a free, private review.</div>
            <p className="oar-lede">Understand what benefits, deadlines, and next steps may apply after a motor vehicle accident in Ontario.</p>

            <div className="oar-pill-row">
              {TRUST_PILLS.map(item => (
                <span className="oar-trust-pill" key={item.label}><span className="material-symbols-outlined" style={{ color: 'var(--teal)' }}>{item.icon}</span>{item.label}</span>
              ))}
            </div>

            <div className="oar-hero-actions">
              <a href="#intake" onClick={() => trackCta('Start My Free Review', 'hero')} className="oar-button">Start My Free Review <span className="oar-button-arrow"><span className="material-symbols-outlined">arrow_forward</span></span></a>
              <a href="#how-it-works" className="oar-link-cta">See how it works <span className="material-symbols-outlined">arrow_forward</span></a>
            </div>

            <div className="oar-disclaimer-strip">
              <span className="oar-icon gold"><span className="material-symbols-outlined">shield</span></span>
              <span><strong>Ontario Accident Review is not a law firm</strong> and does not provide legal advice.</span>
            </div>
          </div>

          <HeroProductMockup />
        </div>
      </section>

      <section className="oar-trust-strip-modern">
        <div className="oar-container oar-trust-strip-grid">
          {TRUST_STRIP.map(item => (
            <div className="oar-trust-item" key={item.title}>
              <span className="oar-icon blue"><span className="material-symbols-outlined">{item.icon}</span></span>
              <div><strong>{item.title}</strong><span>{item.body}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="oar-section" id="who-this-is-for">
        <div className="oar-container">
          <div className="oar-section-head">
            <div className="oar-section-kicker"><span className="material-symbols-outlined">task_alt</span> What we help clarify</div>
            <h2 className="oar-display oar-h2">A calm first step before you decide what to do next.</h2>
            <p className="oar-lede">The review is designed for people who feel unsure about benefits, deadlines, treatment coverage, insurer delays, or where to start.</p>
          </div>
          <div className="oar-grid-4">
            {FEATURES.map(item => (
              <article className="oar-feature-card oar-card" key={item.title}>
                <span className="oar-icon"><span className="material-symbols-outlined">{item.icon}</span></span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="oar-section" id="how-it-works" style={{ background: 'linear-gradient(180deg, rgba(246,241,232,.55), rgba(255,255,255,.65))', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="oar-container">
          <div className="oar-section-head">
            <div className="oar-section-kicker"><span className="material-symbols-outlined">route</span> How it works</div>
            <h2 className="oar-display oar-h2">Three steps. No pressure.</h2>
          </div>
          <div className="oar-grid-3">
            {STEPS.map((step, i) => (
              <article className="oar-step-card oar-card" key={step.title}>
                <div className="oar-step-number">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="oar-section-tight">
        <div className="oar-container oar-cta-panel oar-card-soft">
          <div>
            <div className="oar-section-kicker"><span className="material-symbols-outlined">lock_open</span> Start your review</div>
            <h2 className="oar-display oar-h3" style={{ marginTop: '1rem' }}>In about 2 minutes, we’ll help you understand what may be available to you.</h2>
            <p className="oar-lede">We’ll ask a few simple questions to identify possible benefits, deadlines, delays, denials, and next steps. No policy number or documents needed to begin.</p>
            <a href="#intake" onClick={() => trackCta('Begin review', 'mid_page_cta')} className="oar-button">Begin review <span className="oar-button-arrow"><span className="material-symbols-outlined">arrow_forward</span></span></a>
          </div>
          <div className="oar-mini-dashboard">
            {['About you', 'About the accident', 'Your injuries', 'Review possible next steps'].map((item, i) => (
              <div className="oar-mini-card" key={item}><span className="oar-icon"><span className="material-symbols-outlined">{['person','directions_car','favorite','fact_check'][i]}</span></span><div><h3>{item}</h3><p style={{ margin: '.2rem 0 0', color: 'var(--muted)' }}>{i === 0 ? 'Contact info and background' : i === 1 ? 'When and how it happened' : i === 2 ? 'What you experienced' : 'See benefits and next steps'}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="oar-section" id="faq">
        <div className="oar-container oar-faq-shell">
          <div>
            <div className="oar-section-kicker"><span className="material-symbols-outlined">help</span> Frequently asked questions</div>
            <h2 className="oar-display oar-h2" style={{ marginTop: '1rem' }}>Built on trust. Focused on you.</h2>
            <p className="oar-lede">Clear answers before you share your information.</p>
          </div>
          <div className="oar-faq-list">
            {FAQS.map((faq, i) => (
              <div key={faq.q} className="oar-faq-card oar-card" onClick={() => { setOpenFaq(openFaq === i ? null : i); Analytics.faqExpand({ question: faq.q, question_index: i }); }} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><span className="oar-icon blue"><span className="material-symbols-outlined">{['attach_money','article','notifications','gavel'][i]}</span></span><div><h3>{faq.q}</h3>{openFaq === i && <p style={{ marginTop: '.65rem' }}>{faq.a}</p>}</div></div>
                <span className="material-symbols-outlined" style={{ color: 'var(--blue)' }}>{openFaq === i ? 'remove' : 'add'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <a href="#intake" onClick={() => trackCta('Start Free Review', 'mobile_sticky')} className="oar-mobile-sticky-cta">Start Free Review</a>
    </>
  );
}
