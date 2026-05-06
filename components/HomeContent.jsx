'use client';
import { useState } from 'react';
import { Analytics } from '@/lib/analytics';

function trackCta(text, location) {
  Analytics.ctaClick({ cta_text: text, cta_location: location });
  Analytics.intakeStart({ trigger: location });
}

const TRUST_PILLS = [
  { icon: 'lock', label: 'Free review' },
  { icon: 'verified_user', label: 'Private' },
  { icon: 'location_on', label: 'Ontario only' },
];

const TRUST_STRIP = [
  { icon: 'admin_panel_settings', title: 'Private & secure', body: 'Your request is not sent to your insurer.' },
  { icon: 'map', title: 'Ontario accident benefits', body: 'Focused on Ontario claim steps, forms, and timing issues.' },
  { icon: 'fact_check', title: 'Plain-language review', body: 'No hype, no settlement promises, no legal advice.' },
  { icon: 'support_agent', title: 'Human follow-up', body: 'You get practical next-step information, not pressure.' },
];

const FEATURES = [
  { icon: 'medical_services', title: 'Treatment and rehabilitation', body: 'We look at whether treatment, assessments, or rehabilitation benefits may be part of the next conversation.' },
  { icon: 'payments', title: 'Income replacement', body: 'If work has been affected, the review can flag income-replacement questions worth organizing.' },
  { icon: 'description', title: 'OCF forms and paperwork', body: 'We help you think through application-package issues, missing information, insurer requests, and claim records.' },
  { icon: 'report_problem', title: 'Denials, delays, and reductions', body: 'If benefits were delayed, denied, or reduced, we help identify what facts and dates may matter next.' },
];

const STEPS = [
  { title: 'Tell us what happened', body: 'Share the accident date, location, type of accident, injuries, and what feels stalled or unclear.' },
  { title: 'We organize the claim issues', body: 'Your request is reviewed against common Ontario accident-benefits categories, deadlines, denials, and treatment questions.' },
  { title: 'You decide the next step', body: 'You receive practical follow-up information. If appropriate, you may be connected with a relevant professional. No obligation.' },
];

const FAQS = [
  { q: 'Is this free?', a: 'Yes. The initial Ontario accident benefits review request is free and there is no obligation to proceed.' },
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
    <div className="oar-product-stage oar-claim-stage" aria-label="Ontario accident benefits review preview">
      <OntarioMap />

      <div className="oar-floating-form oar-card oar-grounded-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Your review starts here</h3>
          <span style={{ color: 'var(--muted)', fontSize: '.76rem', fontWeight: 700 }}>Private request</span>
        </div>
        <div className="oar-form-progress"><span className="active">1</span> About you <span>2</span> Accident <span>3</span> Injuries <span>4</span> Review</div>
        <strong style={{ display: 'block', color: 'var(--primary)', marginBottom: '.65rem' }}>A few details help us organize the claim issue.</strong>
        <div className="oar-faux-input"><span className="material-symbols-outlined">calendar_month</span> Accident date</div>
        <div className="oar-faux-input"><span className="material-symbols-outlined">location_on</span> City or region in Ontario</div>
        <div className="oar-faux-continue">Begin review</div>
      </div>

      <div className="oar-benefit-card oar-card oar-grounded-card">
        <h3>What we look at</h3>
        <div className="oar-benefit-list">
          {[
            'Treatment and rehabilitation benefits',
            'Income replacement questions',
            'OCF application-package issues',
            'Insurer delays, denials, or reductions',
          ].map(item => (
            <div className="oar-benefit-row" key={item}><span className="oar-check-dot">✓</span>{item}</div>
          ))}
        </div>
      </div>

      <div className="oar-deadline-card oar-card oar-grounded-card">
        <h3>Dates worth organizing</h3>
        <div className="oar-timeline">
          <div className="oar-timeline-row"><span className="oar-timeline-marker done" /><div><strong>Accident date</strong><small>Used to orient the review</small></div></div>
          <div className="oar-timeline-row"><span className="oar-timeline-marker" /><div><strong>Benefits application</strong><small>OCF-1 / application package timing</small></div></div>
          <div className="oar-timeline-row"><span className="oar-timeline-marker" style={{ borderColor: 'var(--gold)' }} /><div><strong>Insurer response</strong><small>Denial, delay, reduction, or request</small></div></div>
        </div>
      </div>
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
            <p className="oar-lede">A calm first step to organize possible accident benefits, deadlines, insurer issues, and practical next steps.</p>

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
              <span><strong>Ontario Accident Review is not a law firm</strong> and does not provide legal advice or create a lawyer-client relationship.</span>
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
            <h2 className="oar-display oar-h2">Not a claim promise. A clearer starting point.</h2>
            <p className="oar-lede">The review is for people who are unsure what benefits may apply, what forms or dates matter, or what to do when an insurer response feels confusing.</p>
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
            <h2 className="oar-display oar-h3" style={{ marginTop: '1rem' }}>In about 2 minutes, organize the facts that usually matter first.</h2>
            <p className="oar-lede">We’ll ask about the accident, injuries, work impact, treatment needs, insurer delays or denials, and how to contact you. You do not need a policy number to begin.</p>
            <a href="#intake" onClick={() => trackCta('Begin review', 'mid_page_cta')} className="oar-button">Begin review <span className="oar-button-arrow"><span className="material-symbols-outlined">arrow_forward</span></span></a>
          </div>
          <div className="oar-mini-dashboard">
            {[
              ['About you', 'Your contact info and preferred follow-up.'],
              ['About the accident', 'Date, location, and type of motor vehicle accident.'],
              ['Your injuries', 'Treatment needs, symptoms, and work impact.'],
              ['Claim issue', 'Delay, denial, reduction, paperwork, or uncertainty.'],
            ].map(([title, body], i) => (
              <div className="oar-mini-card" key={title}><span className="oar-icon"><span className="material-symbols-outlined">{['person','directions_car','favorite','folder_open'][i]}</span></span><div><h3>{title}</h3><p style={{ margin: '.2rem 0 0', color: 'var(--muted)' }}>{body}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="oar-section" id="faq">
        <div className="oar-container oar-faq-shell">
          <div>
            <div className="oar-section-kicker"><span className="material-symbols-outlined">help</span> Frequently asked questions</div>
            <h2 className="oar-display oar-h2" style={{ marginTop: '1rem' }}>Built on trust. Focused on clarity.</h2>
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
