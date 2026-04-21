'use client';
import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@/lib/analytics';

/* âââââââââââââââââââââââââââââââââââââââââââââââââââ
   HomeContent â HIGH-CONVERTING CRO HOMEPAGE
   All styles inline to guarantee rendering.
   Links to intake form use #intake to trigger IntakeModal.
   âââââââââââââââââââââââââââââââââââââââââââââââââââ */

const GOLD = '#cba72f';
const GOLD_HOVER = '#e0ba44';
const NAVY = '#001b44';
const DARK_BG = '#060b16';
const DARK_ALT = '#08101d';
const DARK_CARD_BG = '#0e1c30';
const DARK_CARD_HOVER = '#112037';
const LIGHT_BG = '#f8f9fb';
const WHITE_ALT = '#ffffff';
const TEXT_DIM = 'rgba(255,255,255,0.5)';
const TEXT_DIMMER = 'rgba(255,255,255,0.35)';
const LABEL_DARK = '#735c00';
const ON_SURFACE_VARIANT = '#44474f';

const SVG_LOGO = (h = 40) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 100" fill="none" height={h} style={{width:'auto'}}>
    <path d="M 72 64 A 28 28 0 1 1 48 22" stroke="#e8f0ff" strokeWidth="7" strokeLinecap="round" fill="none"/>
    <path d="M 48 22 A 28 28 0 0 1 72 64" stroke="#3a82c8" strokeWidth="7" strokeLinecap="round" fill="none"/>
    <line x1="48" y1="30" x2="48" y2="42" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round"/>
    <line x1="48" y1="42" x2="48" y2="58" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round"/>
    <polyline points="38,50 48,62 58,50" stroke="#3a82c8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="92" y="44" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="25" fill="#e8f0ff">Ontario</text>
    <text x="92" y="74" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="25" fill="#e8f0ff">Accident Review</text>
  </svg>
);

function GoldLabel({ children, light }) {
  return <div style={{color: light ? LABEL_DARK : GOLD, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:'"Open Sans",sans-serif'}}>{children}</div>;
}

function GoldLine() {
  return <div style={{width:44, height:2, background:`linear-gradient(90deg, ${LABEL_DARK}, ${GOLD})`}} />;
}

function GoldBtn({ children, href, style: s, onClickTrack }) {
  return <a href={href || '#intake'} onClick={onClickTrack} style={{background:GOLD, color:'#1a0f00', fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', padding:'1rem 2rem', borderRadius:'0.375rem', fontSize:'0.875rem', letterSpacing:'0.025em', fontFamily:'"Open Sans",sans-serif', textDecoration:'none', ...s}}>{children}</a>;
}

function GhostBtn({ children, href, style: s }) {
  return <a href={href || '#how-it-works'} style={{border:`1.5px solid rgba(203,167,47,0.5)`, color:GOLD, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', padding:'1rem 2rem', borderRadius:'0.375rem', fontSize:'0.875rem', fontFamily:'"Open Sans",sans-serif', textDecoration:'none', ...s}}>{children}</a>;
}

function Icon({ name, size, color, fill }) {
  return <span className="material-symbols-outlined" style={{fontSize: size || '1.25rem', color: color || GOLD, fontVariationSettings: fill ? "'FILL' 1" : undefined}}>{name}</span>;
}

export default function HomeContent() {
  const [openFaq, setOpenFaq] = useState(-1);
  const [stickyCta, setStickyCta] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const intakeStartTime = useRef(null);

  // A/B variant state — SSR-safe defaults (variant A), resolved client-side
  const [heroCta,     setHeroCta]     = useState('Get My Free Claim Review');
  const [heroSubhead, setHeroSubhead] = useState('In about 2 minutes, tell us what happened. We review your situation and, if it fits our criteria, reach out with plain-language guidance on benefits, deadlines, and next steps — at no cost.');
  const [trustPills,  setTrustPills]  = useState(['Free', 'Confidential', 'No obligation', '~2 min']);

  // Homepage view + A/B variant assignment (client-side only)
  useEffect(() => {
    Analytics.homepageView();
    setHeroCta(getVariantContent('hero_cta'));
    setHeroSubhead(getVariantContent('hero_subhead'));
    setTrustPills(getVariantContent('trust_strip'));
  }, []);

  // Sticky CTA show
  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 300) setStickyCta(true); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    // First, set initial hidden state on elements not yet in viewport
    const els = document.querySelectorAll('.hc-reveal');
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        el.classList.add('hc-hidden');
      } else {
        el.classList.add('hc-visible');
      }
    });
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('hc-hidden'); e.target.classList.add('hc-visible'); } });
    }, { threshold: 0.10 });
    els.forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const toggleFaq = (i) => {
    const next = openFaq === i ? -1 : i;
    if (next !== -1) {
      Analytics.faqExpand({ question: FAQS[i]?.q ?? '', question_index: i });
    }
    setOpenFaq(next);
  };

  const trackCta = (text, location) => {
    Analytics.ctaClick({ cta_text: text, cta_location: location });
    intakeStartTime.current = Date.now();
    Analytics.intakeStart({ trigger: location });
    if (location === 'hero') {
      trackAbConversion('hero_cta', 'cta_click');
      trackAbConversion('hero_subhead', 'cta_click');
      trackAbConversion('trust_strip', 'cta_click');
    }
  };

  const maxW = { maxWidth:'80rem', margin:'0 auto' };
  const headlineFont = { fontFamily:'Raleway,sans-serif' };
  const bodyFont = { fontFamily:'"Open Sans",sans-serif' };
  const labelFont = { fontFamily:'"Open Sans",sans-serif' };

  const VALUE_ITEMS = [
    { icon:'visibility', text:'A clearer picture of what your situation may involve' },
    { icon:'insights', text:'Plain-language context on how accident claims generally work in Ontario' },
    { icon:'signpost', text:'Guidance on what next steps may be worth considering' },
    { icon:'handshake', text:'The option to be connected with a legal professional, if appropriate' },
  ];

  const STEPS = [
    { num:'01', label:'Initial Intake', title:'You submit a short form', desc:'Tell us the basics of your accident and how it has affected you. No documents, no insurance details, no policy numbers required at this stage.', bg:NAVY },
    { num:'02', label:'Submission Review', title:'Your submission is reviewed', desc:'A representative reviews your information. If your situation appears to fit our intake criteria, we may follow up with plain-language context on what may apply — and what next steps are worth considering.', bg:LABEL_DARK },
    { num:'03', label:'Your Next Step', title:'You decide what to do next', desc:'If your situation appears worth pursuing, we may connect you with a licensed Ontario personal injury lawyer who can explain your options — at no cost to you. No pressure, no obligation at any stage.', bg:NAVY },
  ];

  const WHY_START_HERE = [
    'You may not need a lawyer yet',
    'You might not fully understand your options',
    'You want clarity before being contacted by law firms',
    'You prefer a simple, no-pressure starting point',
  ];

  const TRUST_ITEMS = [
    { icon:'corporate_fare', text:'We are not a law firm' },
    { icon:'block', text:'We do not provide legal advice or representation' },
    { icon:'description', text:'Submitting your information does not start a legal case' },
    { icon:'lock', text:'Your information is kept private and handled securely' },
  ];

  const FAQS = [
    { q:'Is this completely free?', a:'Yes. The review is completely free. There is no cost at any stage and no obligation to proceed with anything.' },
    { q:'Will I be pressured or bombarded with calls?', a:'No. We review your submission before anyone follows up. If your situation fits our criteria, one representative may reach out — calmly, once — to explain what may apply. We respect your preferred contact time and method, and you are free to say no to anything.' },
    { q:'Am I hiring a lawyer by submitting this?', a:'No. Submitting this form does not hire a lawyer, start a legal case, or create any obligation of any kind. It is simply a review request. Nothing moves forward unless you choose it to.' },
    { q:'Is Ontario Accident Review connected to my insurance company?', a:'No. Ontario Accident Review has no connection to your insurer and is not affiliated with any insurance company. We do not notify your insurer that you submitted a review, and your submission is kept confidential.' },
    { q:'What happens after I submit?', a:'A representative reviews your submission. If your situation appears to fit our criteria, they may reach out to walk you through what may apply — in plain language, at no cost. If we don’t follow up, it means your situation didn’t meet our intake criteria at this time.' },
    { q:'Do I need documents or insurance info?', a:'No. You do not need any documents, policy numbers, insurance details, or anything in writing to get started. Just tell us the basics of what happened.' },
    { q:'Is my information private?', a:'Yes. Your information is kept confidential, stored securely, and is never shared with your insurer or any third party without your consent.' },
    { q:'What if the accident was partly my fault?', a:'Generally speaking, fault does not automatically disqualify someone from accident benefits in Ontario — Ontario operates under a no-fault accident benefits system. However, your specific situation may differ. A review can help clarify what may apply to your circumstances.' },
    { q:'Are there deadlines I should know about?', a:'Ontario accident claims can involve various time-sensitive steps. The earlier you understand your situation, the more options you may have. This review does not provide legal deadline advice — if you believe a deadline is approaching, seek qualified legal advice promptly.' },
  ];

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
      <style>{`
        .hc-reveal{opacity:1;transform:translateY(0);transition:opacity 0.55s ease,transform 0.55s ease}
        .hc-reveal.hc-hidden{opacity:0;transform:translateY(20px)}
        .hc-reveal.hc-visible{opacity:1;transform:translateY(0)}
        .hc-hover-lift{transition:transform 0.2s ease,box-shadow 0.2s ease}
        .hc-hover-lift:hover{transform:translateY(-3px)}
        .hc-dark-card{background:${DARK_CARD_BG};border:1px solid rgba(255,255,255,0.06);transition:border-color 0.2s ease,background 0.2s ease}
        .hc-dark-card:hover{border-color:rgba(203,167,47,0.35);background:${DARK_CARD_HOVER}}
        .hc-faq-answer{max-height:0;overflow:hidden;transition:max-height 0.3s ease;padding:0 1.25rem}
        .hc-faq-open .hc-faq-answer{max-height:280px;padding:0 1.25rem}
        .hc-faq-icon{transition:transform 0.25s ease;color:${GOLD}}
        .hc-faq-open .hc-faq-icon{transform:rotate(45deg)}
        .hc-ghost-btn{border:1.5px solid rgba(203,167,47,0.5);color:${GOLD};font-weight:700;transition:background 0.2s ease,border-color 0.2s ease}
        .hc-ghost-btn:hover{background:rgba(203,167,47,0.08);border-color:${GOLD}}
        .hc-gold-btn{background:${GOLD};color:#1a0f00;font-weight:700;transition:background 0.2s ease,transform 0.15s ease}
        .hc-gold-btn:hover{background:${GOLD_HOVER}}
        .hc-gold-btn:active{transform:scale(0.97)}
        @keyframes hcPulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .hc-pulse{animation:hcPulse 2s ease-in-out infinite}
        .hc-hamburger-line{display:block;width:22px;height:2px;background:${GOLD};border-radius:2px;transition:transform 0.2s,opacity 0.2s}
        @media(max-width:768px){
          .hc-mobile-sticky{display:flex !important}
          .hc-grid-2{grid-template-columns:1fr !important}
          .hc-grid-3{grid-template-columns:1fr !important}
          .hc-hero-grid{grid-template-columns:1fr !important}
          .hc-hero-h1{font-size:2.5rem !important}
          .hc-desktop-nav{display:none !important}
          .hc-hamburger{display:flex !important}
          .hc-header-cta{display:none !important}
          .hc-hero-section{padding-top:6rem !important;padding-bottom:4rem !important}
        }
        @media(min-width:769px){
          .hc-hamburger{display:none !important}
          .hc-mobile-menu{display:none !important}
        }
      `}</style>

      {/* HEADER */}
      <header style={{position:'fixed',top:0,width:'100%',zIndex:50,background:'rgba(6,11,22,0.90)',backdropFilter:'blur(14px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.5rem',...maxW}}>
          <a href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>{SVG_LOGO(40)}</a>
          <nav className="hc-desktop-nav" style={{display:'flex',alignItems:'center',gap:'2rem'}}>
            {[{t:'How it works',h:'#how-it-works'},{t:'Why start here',h:'#why-start-here'},{t:'FAQ',h:'#faq'},{t:'Resources',h:'/resources'}].map(l => (
              <a key={l.t} href={l.h} style={{color:'rgba(255,255,255,0.7)',fontWeight:500,fontSize:'0.875rem',textDecoration:'none',...labelFont}}>{l.t}</a>
            ))}
          </nav>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <a href="#intake" className="hc-gold-btn hc-header-cta" onClick={() => trackCta('Get My Free Review','header')} style={{padding:'0.625rem 1.5rem',borderRadius:'0.375rem',fontSize:'0.875rem',letterSpacing:'0.025em',textDecoration:'none',...labelFont}}>Get My Free Review</a>
            <button className="hc-hamburger" onClick={() => setMobileNavOpen(o => !o)} aria-label="Toggle menu" style={{background:'none',border:'none',cursor:'pointer',padding:'8px',display:'flex',flexDirection:'column',justifyContent:'center',gap:'5px'}}>
              <span className="hc-hamburger-line" style={mobileNavOpen ? {transform:'translateY(7px) rotate(45deg)'} : {}} />
              <span className="hc-hamburger-line" style={mobileNavOpen ? {opacity:0} : {}} />
              <span className="hc-hamburger-line" style={mobileNavOpen ? {transform:'translateY(-7px) rotate(-45deg)'} : {}} />
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav className="hc-mobile-menu" style={{display:'flex',flexDirection:'column',gap:'0.875rem',padding:'1.25rem 1.5rem 1.5rem',background:'#060b16',borderTop:'1px solid rgba(203,167,47,0.2)'}}>
            {[{t:'How it works',h:'#how-it-works'},{t:'Why start here',h:'#why-start-here'},{t:'FAQ',h:'#faq'},{t:'Resources',h:'/resources'}].map(l => (
              <a key={l.t} href={l.h} onClick={() => setMobileNavOpen(false)} style={{color:'rgba(255,255,255,0.85)',fontWeight:500,fontSize:'1rem',textDecoration:'none',padding:'0.25rem 0',...bodyFont}}>{l.t}</a>
            ))}
            <a href="#intake" onClick={() => { setMobileNavOpen(false); trackCta('Get My Free Claim Review','mobile_nav'); }} style={{display:'block',textAlign:'center',marginTop:'0.5rem',padding:'0.875rem 1.5rem',background:GOLD,color:'#1a0f00',fontWeight:700,borderRadius:'0.375rem',fontSize:'0.95rem',textDecoration:'none',...labelFont}}>Get My Free Claim Review</a>
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="hc-hero-section" style={{background:'linear-gradient(145deg, #04090f 0%, #001b44 55%, #050d1a 100%)',padding:'10rem 1.5rem 7rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-30%',right:'-8%',width:620,height:620,background:'radial-gradient(circle, rgba(203,167,47,0.13) 0%, transparent 68%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',bottom:'-25%',left:'-6%',width:440,height:440,background:'radial-gradient(circle, rgba(58,130,200,0.10) 0%, transparent 68%)',pointerEvents:'none'}} />
        <div className="hc-hero-grid" style={{...maxW,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
          <div style={{position:'relative',zIndex:10}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9999px',padding:'0.375rem 1rem',marginBottom:'2rem'}}>
              <span className="hc-pulse" style={{width:8,height:8,borderRadius:'50%',background:GOLD}} />
              <span style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.7)',...labelFont}}>Free {'\u00b7'} No Obligation {'\u00b7'} Confidential</span>
            </div>
            <h1 className="hc-hero-h1" style={{fontSize:'3.25rem',fontWeight:800,color:'#fff',lineHeight:1.12,letterSpacing:'-0.01em',marginBottom:'1.5rem',...headlineFont}}>
              Injured in an Ontario Accident? Find Out What Benefits May Apply to Your Claim.
            </h1>
            <p style={{fontSize:'1.125rem',color:'rgba(255,255,255,0.6)',lineHeight:1.7,maxWidth:'34rem',marginBottom:'2rem',...bodyFont}}>
              {heroSubhead}
            </p>
            <div style={{marginBottom:'2rem'}}>
              <GoldBtn onClickTrack={() => trackCta(heroCta,'hero')} style={{padding:'1.125rem 2.5rem',fontSize:'1rem',minHeight:'52px'}}>
                <Icon name="check_circle" size="1.25rem" color="#1a0f00" fill /> {heroCta}
              </GoldBtn>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'1rem',paddingTop:'0.25rem'}}>
              {trustPills.map(text => ({icon:'check', text})).map(t => (
                <div key={t.text} style={{display:'flex',alignItems:'center',gap:'0.4rem',fontSize:'0.8rem',fontWeight:700,color:'rgba(255,255,255,0.65)',...labelFont}}>
                  <Icon name={t.icon} size="1rem" color={GOLD} fill />{t.text}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',position:'relative',zIndex:10}}>
            <div className="hc-dark-card" style={{borderRadius:'0.75rem',padding:'2rem',width:'100%',maxWidth:'24rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'0.75rem',paddingBottom:'1rem',borderBottom:'1px solid rgba(255,255,255,0.08)',marginBottom:'1.25rem'}}>
                <div style={{height:40,width:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(203,167,47,0.15)',flexShrink:0}}>
                  <Icon name="verified_user" fill />
                </div>
                <div>
                  <div style={{color:'#fff',fontWeight:700,fontSize:'0.875rem',...headlineFont}}>What We Review</div>
                  <div style={{color:'rgba(255,255,255,0.4)',fontSize:'0.75rem',...labelFont}}>Areas we may consider in your review</div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                {['Accident benefits (SABS)','Income replacement (general)','Medical & rehabilitation benefits','Caregiver & attendant care','Whether third-party involvement may be relevant','Time-sensitivity of your situation'].map(c => (
                  <div key={c} style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                    <Icon name="check_circle" size="1.125rem" fill />
                    <span style={{color:'rgba(255,255,255,0.75)',fontSize:'0.875rem',...bodyFont}}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MINI INTAKE CARD - quick-start below hero */}
      <section style={{background:'#0a1628',padding:'2.5rem 1.5rem',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <div style={{maxWidth:'680px',margin:'0 auto'}}>
          <div style={{background:'#0e1c30',border:'1px solid rgba(203,167,47,0.25)',borderRadius:'0.75rem',padding:'1.75rem 2rem'}}>
            <p style={{color:GOLD,fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.75rem',fontFamily:'"Open Sans",sans-serif'}}>Start Your Free Review - Takes 2 Minutes</p>
            <p style={{color:'rgba(255,255,255,0.55)',fontSize:'0.85rem',marginBottom:'1.25rem',fontFamily:'"Open Sans",sans-serif'}}>Tell us the type of accident and whether it happened in Ontario - we'll take it from there.</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem',marginBottom:'1.25rem'}}>
              {['Car accident','Slip & fall','Pedestrian','Motorcycle','Workplace','Other'].map(type => (
                <a key={type} href="#intake" onClick={() => trackCta(type,'mini_card_type')} style={{background:'rgba(203,167,47,0.1)',border:'1px solid rgba(203,167,47,0.3)',color:'rgba(255,255,255,0.8)',borderRadius:'0.375rem',padding:'0.5rem 0.875rem',fontSize:'0.8rem',fontWeight:600,textDecoration:'none',fontFamily:'"Open Sans",sans-serif'}}>{type}</a>
              ))}
            </div>
            <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',alignItems:'center'}}>
              <a href="#intake" onClick={() => trackCta('Start My Free Review','mini_card')} style={{background:GOLD,color:'#1a0f00',fontWeight:700,padding:'0.875rem 1.75rem',borderRadius:'0.375rem',fontSize:'0.9rem',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'0.5rem',fontFamily:'"Open Sans",sans-serif',minHeight:'48px'}}>Start My Free Review →</a>
              <span style={{color:'rgba(255,255,255,0.3)',fontSize:'0.75rem',fontFamily:'"Open Sans",sans-serif'}}>Free · Confidential · No obligation</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{background:'#08101d',padding:'1rem 1.5rem',borderTop:'1px solid rgba(203,167,47,0.15)',borderBottom:'1px solid rgba(203,167,47,0.15)'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'flex',flexWrap:'wrap',justifyContent:'center',gap:'0.75rem 2.5rem'}}>
          {['Ontario-focused review','Plain-language claim guidance','Confidential intake','No obligation to proceed'].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>
              <span style={{color:'#cba72f',fontWeight:700,fontSize:'0.85rem'}}>✓</span>
              <span style={{color:'rgba(255,255,255,0.75)',fontSize:'0.85rem'}}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PATTERN INTERRUPT */}
      <section style={{background:DARK_BG,padding:'5rem 1.5rem'}}>
        <div className="hc-reveal" style={{...maxW,maxWidth:'52rem',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'rgba(203,167,47,0.12)',border:'1px solid rgba(203,167,47,0.25)',borderRadius:'0.5rem',padding:'0.5rem 1.25rem',marginBottom:'2rem'}}>
            <Icon name="warning" size="1.25rem" color={GOLD} fill />
            <span style={{fontSize:'0.8rem',fontWeight:700,color:GOLD,textTransform:'uppercase',letterSpacing:'0.1em',...labelFont}}>Important</span>
          </div>
          <h2 style={{fontSize:'2.5rem',fontWeight:800,color:'#fff',lineHeight:1.15,marginBottom:'1.5rem',...headlineFont}}>
            Many accident victims don&apos;t realize what they may be entitled to &mdash; until it&apos;s too late.
          </h2>
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:'1.125rem',lineHeight:1.8,maxWidth:'40rem',margin:'0 auto 1.5rem',...bodyFont}}>
            Insurance information is not always the full picture. A second look can help you understand what may apply before you make any decisions.
          </p>
          <p style={{color:GOLD,fontSize:'1rem',fontWeight:600,lineHeight:1.7,...bodyFont}}>
            That&apos;s why getting a second look before making decisions matters.
          </p>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section style={{background:DARK_ALT,padding:'4rem 1.25rem'}}>
        <div style={{maxWidth:'60rem',margin:'0 auto'}}>
          <div className="hc-reveal" style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <GoldLabel light>Who This Is For</GoldLabel>
            <h2 style={{fontSize:'2rem',fontWeight:800,color:'#fff',lineHeight:1.15,margin:'0.75rem 0 0',...headlineFont}}>This free review may be right for you if&hellip;</h2>
          </div>
          <div className="hc-grid-2" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'1rem'}}>
            {[
              {num:'01',title:'Recently hurt in Ontario',body:'You were recently injured in a car accident in Ontario.'},
              {num:'02',title:'Unsure about your benefits',body:"You're not sure if you're entitled to accident benefits."},
              {num:'03',title:'Denied or received a low offer',body:'You received a denial or low offer from your insurer.'},
              {num:'04',title:'Symptoms but no claim filed',body:"You're dealing with pain or ongoing symptoms but haven't filed a claim."},
              {num:'05',title:'Claim closed unexpectedly',body:"Your claim was closed and you're not sure if it should have been."},
              {num:'06',title:'Want plain-language clarity',body:'You want a plain-language explanation of your options - no lawyers, no pressure.'},
            ].map((item,i)=>(
              <div key={i} className="hc-dark-card hc-reveal hc-hover-lift" style={{padding:'1.5rem',borderRadius:'0.75rem',display:'flex',gap:'1rem',alignItems:'flex-start'}}>
                <span style={{fontSize:'1.25rem',fontWeight:800,color:GOLD,lineHeight:1,...labelFont,minWidth:'2.5rem'}}>{item.num}</span>
                <div>
                  <div style={{fontWeight:700,color:'#fff',marginBottom:'0.35rem',...labelFont}}>{item.title}</div>
                  <div style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.65)',lineHeight:1.6,...bodyFont}}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE SECTION */}
      <section style={{background:DARK_ALT,padding:'6rem 1.5rem'}}>
        <div className="hc-grid-2" style={{...maxW,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
          <div className="hc-reveal" style={{display:'flex',flexDirection:'column',gap:'1.75rem'}}>
            <GoldLabel>Your Free Review</GoldLabel>
            <h2 style={{fontSize:'2.75rem',fontWeight:800,color:'#fff',lineHeight:1.15,...headlineFont}}>
              Understand Your Situation Before You Commit to Anything
            </h2>
            <GoldLine />
            <p style={{color:'rgba(255,255,255,0.6)',lineHeight:1.7,fontSize:'1rem',...bodyFont}}>
              We help you make sense of your accident &mdash; so you&apos;re not guessing, and you&apos;re not relying only on what insurance tells you.
            </p>
            <p style={{color:TEXT_DIM,lineHeight:1.7,fontSize:'0.9rem',fontWeight:600,...bodyFont}}>
              With your free review, you may get:
            </p>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {VALUE_ITEMS.map(item => (
                <div key={item.text} style={{display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
                  <div style={{width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(203,167,47,0.12)',flexShrink:0,marginTop:'0.125rem'}}>
                    <Icon name={item.icon} size="1.125rem" fill />
                  </div>
                  <span style={{color:'rgba(255,255,255,0.7)',fontSize:'0.9rem',lineHeight:1.6,paddingTop:'0.375rem',...bodyFont}}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{paddingTop:'0.5rem'}}>
              <GoldBtn onClickTrack={() => trackCta('Get My Free Claim Review','value_section')}>
                <Icon name="search" size="1.25rem" color="#1a0f00" /> Get My Free Claim Review
              </GoldBtn>
            </div>
          </div>
          <div className="hc-reveal" style={{position:'relative',borderRadius:'0.75rem',overflow:'hidden',height:520}}>
            <img src="/value-section.jpg" alt="Ontario accident review professional consultation" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',filter:'brightness(0.75) contrast(1.05)'}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, #060b16 0%, rgba(6,11,22,0.35) 45%, transparent 100%)'}} />
            <div style={{position:'absolute',bottom:'1.5rem',left:'1.5rem',right:'1.5rem'}}>
              <div className="hc-dark-card" style={{borderRadius:'0.5rem',padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{height:40,width:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(203,167,47,0.18)',flexShrink:0}}>
                  <Icon name="workspace_premium" fill />
                </div>
                <div>
                  <div style={{color:'#fff',fontWeight:700,fontSize:'0.875rem',...headlineFont}}>&ldquo;No cost {'\u00b7'} No obligation&rdquo;</div>
                  <div style={{color:'rgba(255,255,255,0.45)',fontSize:'0.75rem',...labelFont,marginTop:'0.125rem'}}>Ontario Accident Review &mdash; Free initial review for Ontario accident victims seeking clarity on benefits, deadlines, and next steps.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{background:LIGHT_BG,padding:'6rem 1.5rem'}}>
        <div className="hc-grid-2" style={{...maxW,display:'grid',gridTemplateColumns:'2fr 3fr',gap:'4rem',alignItems:'flex-start'}}>
          <div className="hc-reveal">
            <GoldLabel light>What Happens Next</GoldLabel>
            <h2 style={{fontSize:'2.5rem',fontWeight:800,color:NAVY,lineHeight:1.15,margin:'1rem 0 1.25rem',...headlineFont}}>What Happens After You Submit</h2>
            <GoldLine />
            <p style={{color:ON_SURFACE_VARIANT,fontSize:'0.875rem',lineHeight:1.7,margin:'1.5rem 0 2rem',...bodyFont}}>
              Our process is designed to give you clarity fast &mdash; with no pressure, no paperwork, and no commitment at any stage.
            </p>
            <a href="#intake" onClick={() => trackCta('Start Your Free Review','how_it_works')} style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',fontSize:'0.875rem',fontWeight:700,color:NAVY,textDecoration:'none',borderBottom:`1.5px solid ${GOLD}`,paddingBottom:2,...labelFont}}>
              Start Your Free Review <Icon name="arrow_forward" size="1rem" color={NAVY} />
            </a>
          </div>
          <div className="hc-reveal">
            {STEPS.map((step, i) => (
              <div key={step.num} style={{position:'relative',paddingLeft:'4rem',paddingBottom: i < 2 ? '3rem' : 0,borderLeft: i < 2 ? '2px solid rgba(203,167,47,0.2)' : '2px solid transparent',marginLeft:20}}>
                <div style={{position:'absolute',left:0,top:0,width:40,height:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'0.875rem',color:'#fff',background:step.bg,transform:'translateX(-50%)',...headlineFont}}>{step.num}</div>
                <div style={{position:'absolute',top:-10,right:20,fontSize:'4.5rem',fontWeight:800,lineHeight:1,color:'rgba(203,167,47,0.12)',userSelect:'none',pointerEvents:'none',...headlineFont}}>{step.num}</div>
                <div style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:LABEL_DARK,marginBottom:'0.5rem',...labelFont}}>{step.label}</div>
                <h3 style={{fontSize:'1.125rem',fontWeight:700,color:NAVY,marginBottom:'0.5rem',...headlineFont}}>{step.title}</h3>
                <p style={{color:ON_SURFACE_VARIANT,fontSize:'0.875rem',lineHeight:1.7,...bodyFont}}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET SECTION */}
      <section style={{background:LIGHT_BG,padding:'6rem 1.5rem'}}>
        <div style={{...maxW}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <GoldLabel>Free Review</GoldLabel>
            <h2 style={{fontSize:'clamp(1.8rem,3.5vw,2.5rem)',fontWeight:800,color:NAVY,lineHeight:1.2,...headlineFont,marginTop:'0.75rem',marginBottom:'1rem'}}>
              What This Review May Help With
            </h2>
            <GoldLine style={{margin:'0 auto 1.25rem'}} />
            <p style={{color:ON_SURFACE_VARIANT,fontSize:'1rem',lineHeight:1.7,...bodyFont,maxWidth:600,margin:'0 auto'}}>
              This is a first-step review — not legal advice. It is designed to give you plain-language context before you decide what to do next.
            </p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem'}}>
            {[
              {icon:'description',title:'Benefits Context',body:'Plain-language context on how accident benefits generally work in Ontario — including common categories like income replacement, medical, and rehabilitation coverage.'},
              {icon:'search',title:'Situation Assessment',body:'A review of what you\'ve told us to help identify whether your situation may be worth exploring further with a qualified legal professional.'},
              {icon:'schedule',title:'Time-Sensitivity Check',body:'A flag if your situation may involve time-sensitive steps — so you know whether to seek advice promptly. This is not legal deadline guidance.'},
              {icon:'lightbulb',title:'Suggested Next Steps',body:'Plain-language suggestions on what next steps may be worth considering — with no pressure to act and no obligation to proceed.'},
            ].map((item, i) => (
              <div key={i} style={{background:'#fff',borderRadius:10,padding:'2rem 1.75rem',border:'1px solid #e8eaf0',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                <span className="material-symbols-outlined" style={{fontSize:'2rem',color:GOLD,fontVariationSettings:"'FILL' 1,'wght' 400"}}>{item.icon}</span>
                <h3 style={{fontSize:'1.05rem',fontWeight:700,color:NAVY,...headlineFont,margin:0}}>{item.title}</h3>
                <p style={{fontSize:'0.9rem',color:ON_SURFACE_VARIANT,lineHeight:1.7,...bodyFont,margin:0}}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST + POSITIONING */}
      <section style={{background:DARK_ALT,padding:'5rem 1.5rem'}}>
        <div className="hc-reveal" style={{...maxW,maxWidth:'52rem',textAlign:'center'}}>
          <GoldLabel>Our Commitment</GoldLabel>
          <h2 style={{fontSize:'2.25rem',fontWeight:800,color:'#fff',lineHeight:1.15,margin:'1rem 0 2rem',...headlineFont}}>
            Built for Clarity &mdash; Not Pressure
          </h2>
          <div className="hc-grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.25rem',textAlign:'left'}}>
            {TRUST_ITEMS.map(item => (
              <div key={item.text} className="hc-dark-card" style={{borderRadius:'0.75rem',padding:'1.5rem',display:'flex',alignItems:'flex-start',gap:'1rem'}}>
                <div style={{width:40,height:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(203,167,47,0.12)',flexShrink:0}}>
                  <Icon name={item.icon} size="1.25rem" fill />
                </div>
                <span style={{color:'rgba(255,255,255,0.7)',fontSize:'0.875rem',lineHeight:1.6,paddingTop:'0.5rem',...bodyFont}}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGENCY SECTION */}
      <section style={{background:DARK_BG,padding:'5rem 1.5rem'}}>
        <div className="hc-reveal" style={{...maxW,maxWidth:'52rem',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'rgba(203,167,47,0.12)',border:'1px solid rgba(203,167,47,0.25)',borderRadius:'0.5rem',padding:'0.5rem 1.25rem',marginBottom:'2rem'}}>
            <Icon name="schedule" size="1.25rem" color={GOLD} fill />
            <span style={{fontSize:'0.8rem',fontWeight:700,color:GOLD,textTransform:'uppercase',letterSpacing:'0.1em',...labelFont}}>Time-Sensitive</span>
          </div>
          <h2 style={{fontSize:'2.25rem',fontWeight:800,color:'#fff',lineHeight:1.15,marginBottom:'1.5rem',...headlineFont}}>
            Timing Matters More Than You Think
          </h2>
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:'1rem',lineHeight:1.8,maxWidth:'40rem',margin:'0 auto 1rem',...bodyFont}}>
            Ontario accident claims can involve various time-sensitive steps. The earlier you understand your situation, the more options you may have.
          </p>
          <p style={{color:GOLD,fontSize:'1rem',fontWeight:600,lineHeight:1.7,...bodyFont}}>
            A free review today costs nothing. Waiting can narrow your options.
          </p>
          <p style={{color:'rgba(255,255,255,0.35)',fontSize:'0.78rem',lineHeight:1.6,maxWidth:'36rem',margin:'1rem auto 0',...bodyFont}}>
            The timeframes below are general illustrations only and do not constitute legal deadline advice. Your specific situation may differ. If you believe a deadline applies to your matter, seek qualified legal advice promptly.
          </p>
          <div style={{display:'flex',justifyContent:'center',gap:'3rem',marginTop:'2.5rem',flexWrap:'wrap'}}>
            {[
              { value:'7 days', label:'Insurer notification (typical)', consequence:'Many policies require prompt notice after an accident — timelines vary', color:GOLD },
              { value:'30 days', label:'Benefits application (typical)', consequence:'Application windows are often shorter than people expect', color:'#fff' },
              { value:'2 years', label:'General limitation period (typical)', consequence:'This is a general civil limitation period — specific claims may differ', color:GOLD },
            ].map(s => (
              <div key={s.label} style={{maxWidth:'16rem'}}>
                <div style={{fontSize:'2.5rem',fontWeight:800,color:s.color,...headlineFont}}>{s.value}</div>
                <div style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',color:TEXT_DIMMER,marginTop:'0.5rem',...labelFont}}>{s.label}</div>
                <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.4)',marginTop:'0.4rem',lineHeight:1.5,...bodyFont}}>{s.consequence}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIMARY CTA (MID-PAGE) */}
      <section style={{padding:'6rem 1.5rem',background:'linear-gradient(145deg, #001b44 0%, #002e6e 50%, #001228 100%)'}}>
        <div className="hc-reveal" style={{...maxW,maxWidth:'48rem',textAlign:'center'}}>
          <GoldLabel>Take the next step</GoldLabel>
          <h2 style={{fontSize:'2.75rem',fontWeight:800,color:'#fff',lineHeight:1.15,margin:'1.25rem 0',...headlineFont}}>
            Find Out What May Apply to Your Claim
          </h2>
          <p style={{color:TEXT_DIM,maxWidth:'32rem',margin:'0 auto 2.5rem',lineHeight:1.7,fontSize:'1.125rem',...bodyFont}}>
            It takes about 2 minutes. No cost. No obligation.
          </p>
          <GoldBtn onClickTrack={() => trackCta('Get My Free Claim Review','mid_page')} style={{padding:'1.125rem 2.75rem',fontSize:'1rem',boxShadow:'0 10px 15px -3px rgba(0,0,0,0.2)'}}>
            <Icon name="check_circle" size="1.25rem" color="#1a0f00" fill /> Get My Free Claim Review
          </GoldBtn>
          <p style={{color:'rgba(255,255,255,0.25)',fontSize:'0.75rem',marginTop:'1.75rem',...labelFont}}>Free {'\u00b7'} Confidential {'\u00b7'} No obligation {'\u00b7'} Takes ~2 minutes</p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" style={{background:LIGHT_BG,padding:'6rem 1.5rem'}}>
        <div style={{...maxW,maxWidth:'48rem'}}>
          <div className="hc-reveal" style={{textAlign:'center',marginBottom:'3rem'}}>
            <GoldLabel light>Plain answers</GoldLabel>
            <h2 style={{fontSize:'2.25rem',fontWeight:800,color:NAVY,lineHeight:1.15,margin:'1rem 0',...headlineFont}}>Questions people usually have before they start</h2>
          </div>
          <div className="hc-reveal" style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
            {FAQS.map((f, i) => (
              <div key={i} className={`hc-faq-item${openFaq === i ? ' hc-faq-open' : ''}`} style={{border:'1px solid rgba(197,198,208,0.4)',borderRadius:'0.75rem',overflow:'hidden',background:'#fff'}}>
                <button onClick={() => toggleFaq(i)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.25rem',textAlign:'left',gap:'1rem',background:'none',border:'none',cursor:'pointer'}}>
                  <span style={{fontWeight:700,color:NAVY,fontSize:'0.9rem',...headlineFont}}>{f.q}</span>
                  <span className="material-symbols-outlined hc-faq-icon" style={{fontSize:'1.25rem',flexShrink:0}}>add</span>
                </button>
                <div className="hc-faq-answer">
                  <p style={{color:ON_SURFACE_VARIANT,fontSize:'0.875rem',lineHeight:1.7,paddingBottom:'1.25rem',...bodyFont}}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PEOPLE START HERE FIRST */}
      <section id="why-start-here" style={{background:'#0e1c30',padding:'4rem 1.5rem'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <h2 style={{color:'#ffffff',fontFamily:'Raleway,sans-serif',fontSize:'clamp(1.4rem,3vw,2rem)',fontWeight:800,textAlign:'center',marginBottom:'2.5rem'}}>Why People Start Here First</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'1.5rem'}}>
            {[
              {title:'No lawyers, no office visits, no calls you didn’t ask for',body:'Fill out a short form. If your situation fits, one representative may follow up — once, calmly. Nothing more unless you want it.'},
              {title:'Your insurer never finds out you were here',body:'Ontario Accident Review is not connected to any insurance company. Submitting a review does not notify your insurer or affect your policy.'},
              {title:'Understand your situation before committing to anything',body:'You’ll have plain-language context on what may apply before anyone asks you to take a next step. No pressure, no commitment unless you choose it.'},
            ].map((c,i)=>(
              <div key={i} style={{background:'#112037',borderRadius:'8px',padding:'1.75rem',borderTop:'2px solid rgba(203,167,47,0.3)'}}>
                <h3 style={{color:'#ffffff',fontFamily:'Raleway,sans-serif',fontSize:'1rem',fontWeight:700,marginBottom:'0.75rem'}}>{c.title}</h3>
                <p style={{color:'rgba(255,255,255,0.65)',fontFamily:'"Open Sans",sans-serif',fontSize:'0.9rem',lineHeight:1.6,margin:0}}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CLOSE */}
      <section style={{padding:'6rem 1.5rem',background:'linear-gradient(145deg, #04090f 0%, #001228 50%, #040810 100%)'}}>
        <div className="hc-reveal" style={{...maxW,maxWidth:'52rem',textAlign:'center'}}>
          <GoldLabel>A calm first step</GoldLabel>
          <h2 style={{fontSize:'3rem',fontWeight:800,color:'#fff',lineHeight:1.15,margin:'1.25rem 0',...headlineFont}}>
            Understand your situation before you make any decisions.
          </h2>
          <div style={{width:44,height:2,background:`linear-gradient(90deg, ${LABEL_DARK}, ${GOLD})`,margin:'1.75rem auto'}} />
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:'1.05rem',lineHeight:1.7,maxWidth:'38rem',margin:'0 auto 1rem',...bodyFont}}>
            A lot of accident victims don’t realize what may apply to their situation until it’s too late to do anything about it.
          </p>
          <p style={{color:TEXT_DIM,maxWidth:'36rem',margin:'0 auto 2.5rem',lineHeight:1.7,...bodyFont}}>
            Two minutes. Free. No obligation. No pressure. Just a clearer picture — before you decide what to do next.
          </p>
          <GoldBtn onClickTrack={() => trackCta('Get My Free Claim Review','final_cta')} style={{padding:'1.125rem 2.75rem',fontSize:'1rem',boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}}>
            <Icon name="rocket_launch" size="1.25rem" color="#1a0f00" /> Get My Free Claim Review
          </GoldBtn>
          <p style={{color:'rgba(255,255,255,0.25)',fontSize:'0.75rem',marginTop:'1.75rem',...labelFont}}>Free {'\u00b7'} Confidential {'\u00b7'} No obligation {'\u00b7'} Takes ~2 minutes</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:DARK_BG,borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div style={{...maxW,padding:'3.5rem 2rem 2rem'}}>
          <div className="hc-footer-grid hc-grid-3" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'2.5rem',paddingBottom:'3rem',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              {SVG_LOGO(36)}
              <p style={{color:'rgba(255,255,255,0.35)',fontSize:'0.875rem',lineHeight:1.7,maxWidth:'24rem',...bodyFont}}>Ontario Accident Review is not a law firm and does not provide legal advice or legal representation. This service is for assessment purposes only.</p>
              <div style={{display:'flex',gap:'0.75rem',paddingTop:'0.25rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.75rem',fontWeight:700,color:'rgba(255,255,255,0.4)',...labelFont}}>
                  <Icon name="lock" size="1rem" fill /> Encrypted
                </div>
                <div style={{width:1,height:16,background:'rgba(255,255,255,0.1)'}} />
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.75rem',fontWeight:700,color:'rgba(255,255,255,0.4)',...labelFont}}>
                  <Icon name="verified_user" size="1rem" fill /> Confidential
                </div>
              </div>
            </div>
            <div>
              <div style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.3)',marginBottom:'1.25rem',...labelFont}}>Navigate</div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                {[{t:'How it works',h:'#how-it-works'},{t:'Why start here',h:'#why-start-here'},{t:'FAQ',h:'#faq'}].map(l => (
                  <a key={l.t} href={l.h} style={{fontSize:'0.875rem',color:'rgba(255,255,255,0.5)',textDecoration:'none',...bodyFont}}>{l.t}</a>
                ))}
                <a href="#intake" onClick={() => trackCta('Start Your Free Review','footer_nav')} style={{fontSize:'0.875rem',fontWeight:600,color:GOLD,textDecoration:'none',...bodyFont}}>Start Your Free Review &rarr;</a>
              </div>
            </div>
            <div>
              <div style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.3)',marginBottom:'1.25rem',...labelFont}}>Legal</div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                {[{t:'Privacy Policy',h:'/privacy'},{t:'Terms of Service',h:'/terms-of-service'},{t:'Legal Disclaimer',h:'/disclaimer'},{t:'Contact',h:'/contact'}].map(l => (
                  <a key={l.t} href={l.h} style={{fontSize:'0.875rem',color:'rgba(255,255,255,0.5)',textDecoration:'none',...bodyFont}}>{l.t}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.25)',...labelFont}}>{'\u00A9'} 2026 Ontario Accident Review. All rights reserved.</div>
            <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.2)',...labelFont}}>Ontario, Canada</div>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="hc-mobile-sticky" style={{position:'fixed',bottom:0,left:0,right:0,zIndex:50,padding:'1rem',background:'rgba(4,9,15,0.97)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,0.07)',transform: stickyCta ? 'translateY(0)' : 'translateY(100%)',transition:'transform 0.4s ease',display:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:'#fff',fontWeight:700,fontSize:'0.875rem',lineHeight:1.2,...headlineFont}}>Free Accident Review</div>
            <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',...labelFont}}>~2 min {'\u00b7'} No obligation</div>
          </div>
          <a href="#intake" className="hc-gold-btn" onClick={() => trackCta('Get My Free Review','sticky_bar')} style={{flexShrink:0,display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'0.875rem 1.25rem',borderRadius:'0.375rem',fontSize:'0.875rem',textDecoration:'none',minHeight:'48px',...labelFont}}>
            Check If I Qualify <Icon name="arrow_forward" size="1rem" color="#1a0f00" />
          </a>
        </div>
      </div>
    </>
  );
}
