'use client';
import { useState, useEffect, useRef } from 'react';

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
  return <div style={{color: light ? LABEL_DARK : GOLD, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', fontFamily:'Inter,sans-serif'}}>{children}</div>;
}

function GoldLine() {
  return <div style={{width:44, height:2, background:`linear-gradient(90deg, ${LABEL_DARK}, ${GOLD})`}} />;
}

function GoldBtn({ children, href, style: s }) {
  return <a href={href || '#intake'} style={{background:GOLD, color:'#1a0f00', fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', padding:'1rem 2rem', borderRadius:'0.375rem', fontSize:'0.875rem', letterSpacing:'0.025em', fontFamily:'Inter,sans-serif', textDecoration:'none', ...s}}>{children}</a>;
}

function GhostBtn({ children, href, style: s }) {
  return <a href={href || '#how-it-works'} style={{border:`1.5px solid rgba(203,167,47,0.5)`, color:GOLD, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', padding:'1rem 2rem', borderRadius:'0.375rem', fontSize:'0.875rem', fontFamily:'Inter,sans-serif', textDecoration:'none', ...s}}>{children}</a>;
}

function Icon({ name, size, color, fill }) {
  return <span className="material-symbols-outlined" style={{fontSize: size || '1.25rem', color: color || GOLD, fontVariationSettings: fill ? "'FILL' 1" : undefined}}>{name}</span>;
}

export default function HomeContent() {
  const [openFaq, setOpenFaq] = useState(-1);
  const [stickyCta, setStickyCta] = useState(false);

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

  const toggleFaq = (i) => setOpenFaq(prev => prev === i ? -1 : i);

  const maxW = { maxWidth:'80rem', margin:'0 auto' };
  const headlineFont = { fontFamily:'Manrope,sans-serif' };
  const bodyFont = { fontFamily:'Inter,sans-serif' };
  const labelFont = { fontFamily:'Inter,sans-serif' };

  const VALUE_ITEMS = [
    { icon:'visibility', text:'A clearer understanding of what you may be entitled to' },
    { icon:'insights', text:'Insight into whether your situation may qualify for compensation' },
    { icon:'signpost', text:'Guidance on what steps to take next' },
    { icon:'handshake', text:'The option to be connected with a legal professional if appropriate' },
  ];

  const STEPS = [
    { num:'01', label:'Initial Intake', title:'Tell us what happened', desc:'Answer a few quick questions \u2014 no documents or insurance info needed.', bg:NAVY },
    { num:'02', label:'Professional Review', title:'We review your situation', desc:'Your information is reviewed to determine if it meets criteria for further consideration.', bg:LABEL_DARK },
    { num:'03', label:'Clarity on Next Steps', title:'Get clarity on your options', desc:'If appropriate, a licensed Ontario legal professional may contact you to discuss next steps.', bg:NAVY },
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
    { q:'Do I have to pay anything?', a:'No. This is completely free.' },
    { q:'Am I hiring a lawyer by submitting this?', a:'No. This does not create a legal relationship or commitment.' },
    { q:'What happens after I submit?', a:'Your information is reviewed. If your situation appears to fit review criteria, you may be contacted.' },
    { q:'Do I need documents or insurance info?', a:'No. Not for the initial review.' },
    { q:'Is my information private?', a:'Yes. Your information is handled securely and used only for review purposes.' },
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
        @media(max-width:768px){
          .hc-mobile-sticky{display:flex !important}
          .hc-grid-2{grid-template-columns:1fr !important}
          .hc-grid-3{grid-template-columns:1fr !important}
          .hc-hero-grid{grid-template-columns:1fr !important}
          .hc-hero-h1{font-size:2.5rem !important}
        }
      `}</style>

      {/* HEADER */}
      <header style={{position:'fixed',top:0,width:'100%',zIndex:50,background:'rgba(6,11,22,0.90)',backdropFilter:'blur(14px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',...maxW}}>
          <a href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>{SVG_LOGO(40)}</a>
          <nav style={{display:'flex',alignItems:'center',gap:'2rem'}}>
            {[{t:'How it works',h:'#how-it-works'},{t:'Why start here',h:'#why-start-here'},{t:'FAQ',h:'#faq'}].map(l => (
              <a key={l.t} href={l.h} style={{color:'rgba(255,255,255,0.7)',fontWeight:500,fontSize:'0.875rem',textDecoration:'none',...labelFont}}>{l.t}</a>
            ))}
          </nav>
          <a href="#intake" className="hc-gold-btn" style={{padding:'0.625rem 1.5rem',borderRadius:'0.375rem',fontSize:'0.875rem',letterSpacing:'0.025em',textDecoration:'none',...labelFont}}>Check If I Qualify Now</a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{background:'linear-gradient(145deg, #04090f 0%, #001b44 55%, #050d1a 100%)',padding:'10rem 1.5rem 7rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-30%',right:'-8%',width:620,height:620,background:'radial-gradient(circle, rgba(203,167,47,0.13) 0%, transparent 68%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',bottom:'-25%',left:'-6%',width:440,height:440,background:'radial-gradient(circle, rgba(58,130,200,0.10) 0%, transparent 68%)',pointerEvents:'none'}} />
        <div className="hc-hero-grid" style={{...maxW,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
          <div style={{position:'relative',zIndex:10}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9999px',padding:'0.375rem 1rem',marginBottom:'2rem'}}>
              <span className="hc-pulse" style={{width:8,height:8,borderRadius:'50%',background:GOLD}} />
              <span style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.7)',...labelFont}}>Free {'\u00b7'} No Obligation {'\u00b7'} Confidential</span>
            </div>
            <h1 className="hc-hero-h1" style={{fontSize:'3.25rem',fontWeight:800,color:'#fff',lineHeight:1.12,letterSpacing:'-0.01em',marginBottom:'1.5rem',...headlineFont}}>
              You Could Be Owed Compensation &mdash;{' '}
              <span style={{background:'linear-gradient(90deg, #cba72f, #e9c349)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Find Out Before Insurance Undervalues Your Claim</span>
            </h1>
            <p style={{fontSize:'1.125rem',color:'rgba(255,255,255,0.6)',lineHeight:1.7,maxWidth:'34rem',marginBottom:'2rem',...bodyFont}}>
              If you&apos;ve been in an accident in Ontario, you may be entitled to compensation. Get a free, no-obligation review in under 2 minutes &mdash; before you make any decisions.
            </p>
            <div style={{marginBottom:'2rem'}}>
              <GoldBtn style={{padding:'1.125rem 2.5rem',fontSize:'1rem'}}>
                <Icon name="check_circle" size="1.25rem" color="#1a0f00" fill /> Check If I Qualify Now
              </GoldBtn>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'1.5rem',paddingTop:'0.25rem'}}>
              {[{icon:'check',text:'Free'},{icon:'check',text:'Private'},{icon:'check',text:'No obligation'},{icon:'check',text:'Takes ~2 minutes'}].map(t => (
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
                  <div style={{color:'rgba(255,255,255,0.4)',fontSize:'0.75rem',...labelFont}}>Assessed for every Ontario claim</div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                {['Accident benefits (SABS)','Income replacement eligibility','Medical & rehabilitation benefits','Caregiver & attendant care','Third-party liability assessment','Insurer deadline awareness'].map(c => (
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

      {/* PATTERN INTERRUPT */}
      <section style={{background:DARK_BG,padding:'5rem 1.5rem'}}>
        <div className="hc-reveal" style={{...maxW,maxWidth:'52rem',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'rgba(203,167,47,0.12)',border:'1px solid rgba(203,167,47,0.25)',borderRadius:'0.5rem',padding:'0.5rem 1.25rem',marginBottom:'2rem'}}>
            <Icon name="warning" size="1.25rem" color={GOLD} fill />
            <span style={{fontSize:'0.8rem',fontWeight:700,color:GOLD,textTransform:'uppercase',letterSpacing:'0.1em',...labelFont}}>Important</span>
          </div>
          <h2 style={{fontSize:'2.5rem',fontWeight:800,color:'#fff',lineHeight:1.15,marginBottom:'1.5rem',...headlineFont}}>
            Most accident victims accept less than they should.
          </h2>
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:'1.125rem',lineHeight:1.8,maxWidth:'40rem',margin:'0 auto 1.5rem',...bodyFont}}>
            Insurance companies don&apos;t explain everything you may be entitled to &mdash; and once you settle, you can&apos;t go back.
          </p>
          <p style={{color:GOLD,fontSize:'1rem',fontWeight:600,lineHeight:1.7,...bodyFont}}>
            That&apos;s why getting a second look before making decisions matters.
          </p>
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
              <GoldBtn>
                <Icon name="search" size="1.25rem" color="#1a0f00" /> Start My Free Review
              </GoldBtn>
            </div>
          </div>
          <div className="hc-reveal" style={{position:'relative',borderRadius:'0.75rem',overflow:'hidden',height:520}}>
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuArsYkOIA4FUvBnpGFLcdqukHA_JQsXw9LgaQ5yuVzNPzge4wJWifuLf-JVUbrm4EnL7PB1LwdEA_HSi129RKeTwQo-Mc2hJKe6XIAXHvbtzzsKghdAvQaAukdjlJIZF8RY-mDO7i9f3MM4C3Ih3WNZhMxWKGtaL4FbCpYmvWbb9ey8_vKE3O2NlHJruJJY4lSUZajd6w9Bi8ufVmLwTSO3wsPx8s5EH-5Rj9xl66WWo-7uECf28sFhGNXAyaWtV8rnKuyy2L1nfzH7" alt="Ontario accident review professional" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',filter:'brightness(0.75) contrast(1.05)'}} />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, #060b16 0%, rgba(6,11,22,0.35) 45%, transparent 100%)'}} />
            <div style={{position:'absolute',bottom:'1.5rem',left:'1.5rem',right:'1.5rem'}}>
              <div className="hc-dark-card" style={{borderRadius:'0.5rem',padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{height:40,width:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(203,167,47,0.18)',flexShrink:0}}>
                  <Icon name="workspace_premium" fill />
                </div>
                <div>
                  <div style={{color:'#fff',fontWeight:700,fontSize:'0.875rem',...headlineFont}}>&ldquo;No cost {'\u00b7'} No obligation&rdquo;</div>
                  <div style={{color:'rgba(255,255,255,0.45)',fontSize:'0.75rem',...labelFont,marginTop:'0.125rem'}}>Ontario Accident Review &mdash; Free for all claimants</div>
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
            <GoldLabel light>How It Works</GoldLabel>
            <h2 style={{fontSize:'2.5rem',fontWeight:800,color:NAVY,lineHeight:1.15,margin:'1rem 0 1.25rem',...headlineFont}}>Simple. Private.<br/>No Pressure.</h2>
            <GoldLine />
            <p style={{color:ON_SURFACE_VARIANT,fontSize:'0.875rem',lineHeight:1.7,margin:'1.5rem 0 2rem',...bodyFont}}>
              Our process is designed to give you clarity fast &mdash; with no pressure, no paperwork, and no commitment at any stage.
            </p>
            <a href="#intake" style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',fontSize:'0.875rem',fontWeight:700,color:NAVY,textDecoration:'none',borderBottom:`1.5px solid ${GOLD}`,paddingBottom:2,...labelFont}}>
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

      {/* WHY START HERE FIRST */}
      <section id="why-start-here" style={{background:DARK_BG,padding:'6rem 1.5rem'}}>
        <div className="hc-grid-2" style={{...maxW,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
          <div className="hc-reveal" style={{display:'flex',flexDirection:'column',gap:'1.75rem'}}>
            <GoldLabel>Why Start Here</GoldLabel>
            <h2 style={{fontSize:'2.5rem',fontWeight:800,color:'#fff',lineHeight:1.15,...headlineFont}}>
              Why Not Go Directly to a Lawyer?
            </h2>
            <GoldLine />
            <p style={{color:'rgba(255,255,255,0.6)',lineHeight:1.7,fontSize:'1rem',...bodyFont}}>
              Starting here helps you understand your situation before committing to anything.
            </p>
            <p style={{color:TEXT_DIM,fontWeight:600,fontSize:'0.9rem',...bodyFont}}>Here&apos;s why people use this first:</p>
            <div style={{display:'flex',flexDirection:'column',gap:'0.875rem'}}>
              {WHY_START_HERE.map(item => (
                <div key={item} style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <Icon name="check_circle" size="1.125rem" fill />
                  <span style={{color:'rgba(255,255,255,0.75)',fontSize:'0.9rem',...bodyFont}}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{color:GOLD,fontSize:'1rem',fontWeight:600,lineHeight:1.7,...bodyFont}}>
              This gives you direction &mdash; without obligation.
            </p>
            <div>
              <GoldBtn>Check If I Qualify Now <Icon name="arrow_forward" size="1.25rem" color="#1a0f00" /></GoldBtn>
            </div>
          </div>
          <div className="hc-reveal" style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            {WHY_START_HERE.map((item, i) => (
              <div key={item} className="hc-dark-card hc-hover-lift" style={{borderRadius:'0.75rem',padding:'1.25rem 1.5rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{width:44,height:44,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(203,167,47,0.12)',flexShrink:0}}>
                  <span style={{fontSize:'1.25rem',fontWeight:800,color:GOLD,...headlineFont}}>0{i+1}</span>
                </div>
                <span style={{color:'rgba(255,255,255,0.75)',fontSize:'0.9rem',fontWeight:500,...bodyFont}}>{item}</span>
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
            Deadlines can apply to accident-related claims in Ontario. Waiting too long or making decisions too early could impact your ability to recover compensation.
          </p>
          <p style={{color:GOLD,fontSize:'1rem',fontWeight:600,lineHeight:1.7,...bodyFont}}>
            It&apos;s better to understand your situation now &mdash; before it&apos;s too late.
          </p>
          <div style={{display:'flex',justifyContent:'center',gap:'3rem',marginTop:'2.5rem',flexWrap:'wrap'}}>
            {[
              { value:'7 days', label:'To notify your insurer', color:GOLD },
              { value:'30 days', label:'To complete application', color:'#fff' },
              { value:'2 years', label:'General limitation period', color:GOLD },
            ].map(s => (
              <div key={s.label}>
                <div style={{fontSize:'2.5rem',fontWeight:800,color:s.color,...headlineFont}}>{s.value}</div>
                <div style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',color:TEXT_DIMMER,marginTop:'0.5rem',...labelFont}}>{s.label}</div>
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
            Find Out What Your Case Could Be Worth
          </h2>
          <p style={{color:TEXT_DIM,maxWidth:'32rem',margin:'0 auto 2.5rem',lineHeight:1.7,fontSize:'1.125rem',...bodyFont}}>
            It takes about 2 minutes. No cost. No obligation.
          </p>
          <GoldBtn style={{padding:'1.125rem 2.75rem',fontSize:'1rem',boxShadow:'0 10px 15px -3px rgba(0,0,0,0.2)'}}>
            <Icon name="check_circle" size="1.25rem" color="#1a0f00" fill /> Start My Free Review
          </GoldBtn>
          <p style={{color:'rgba(255,255,255,0.25)',fontSize:'0.75rem',marginTop:'1.75rem',...labelFont}}>Free {'\u00b7'} Confidential {'\u00b7'} No obligation {'\u00b7'} Takes ~2 minutes</p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" style={{background:LIGHT_BG,padding:'6rem 1.5rem'}}>
        <div style={{...maxW,maxWidth:'48rem'}}>
          <div className="hc-reveal" style={{textAlign:'center',marginBottom:'3rem'}}>
            <GoldLabel light>Common Questions</GoldLabel>
            <h2 style={{fontSize:'2.25rem',fontWeight:800,color:NAVY,lineHeight:1.15,margin:'1rem 0',...headlineFont}}>Frequently Asked</h2>
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

      {/* FINAL CLOSE */}
      <section style={{padding:'6rem 1.5rem',background:'linear-gradient(145deg, #04090f 0%, #001228 50%, #040810 100%)'}}>
        <div className="hc-reveal" style={{...maxW,maxWidth:'52rem',textAlign:'center'}}>
          <GoldLabel>Don&apos;t wait</GoldLabel>
          <h2 style={{fontSize:'3rem',fontWeight:800,color:'#fff',lineHeight:1.15,margin:'1.25rem 0',...headlineFont}}>
            Don&apos;t Risk Leaving Money on the Table
          </h2>
          <div style={{width:44,height:2,background:`linear-gradient(90deg, ${LABEL_DARK}, ${GOLD})`,margin:'1.75rem auto'}} />
          <p style={{color:'rgba(255,255,255,0.55)',fontSize:'1.05rem',lineHeight:1.7,maxWidth:'38rem',margin:'0 auto 1rem',...bodyFont}}>
            You only get one shot at handling your accident properly.
          </p>
          <p style={{color:TEXT_DIM,maxWidth:'36rem',margin:'0 auto 2.5rem',lineHeight:1.7,...bodyFont}}>
            Before you rely on insurance &mdash; or make any decisions &mdash; take 2 minutes to understand your situation.
          </p>
          <GoldBtn style={{padding:'1.125rem 2.75rem',fontSize:'1rem',boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}}>
            <Icon name="rocket_launch" size="1.25rem" color="#1a0f00" /> Check If I Qualify Now
          </GoldBtn>
          <p style={{color:'rgba(255,255,255,0.25)',fontSize:'0.75rem',marginTop:'1.75rem',...labelFont}}>Free {'\u00b7'} Confidential {'\u00b7'} No obligation {'\u00b7'} Takes ~2 minutes</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:DARK_BG,borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div style={{...maxW,padding:'3.5rem 2rem 2rem'}}>
          <div className="hc-grid-3" style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'2.5rem',paddingBottom:'3rem',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
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
                <a href="#intake" style={{fontSize:'0.875rem',fontWeight:600,color:GOLD,textDecoration:'none',...bodyFont}}>Start Your Free Review &rarr;</a>
              </div>
            </div>
            <div>
              <div style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.3)',marginBottom:'1.25rem',...labelFont}}>Legal</div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                {[{t:'Privacy Policy',h:'/privacy'},{t:'Terms of Service',h:'#'},{t:'Legal Disclaimer',h:'/disclaimer'},{t:'Contact',h:'/contact'}].map(l => (
                  <a key={l.t} href={l.h} style={{fontSize:'0.875rem',color:'rgba(255,255,255,0.5)',textDecoration:'none',...bodyFont}}>{l.t}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{paddingTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.25)',...labelFont}}>{'\u00A9'} 2025 Ontario Accident Review. All rights reserved.</div>
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
          <a href="#intake" className="hc-gold-btn" style={{flexShrink:0,display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'0.75rem 1.25rem',borderRadius:'0.375rem',fontSize:'0.875rem',textDecoration:'none',...labelFont}}>
            Check If I Qualify <Icon name="arrow_forward" size="1rem" color="#1a0f00" />
          </a>
        </div>
      </div>
    </>
  );
}
