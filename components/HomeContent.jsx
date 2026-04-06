'use client';
import { useState, useEffect, useRef } from 'react';

/* âââââââââââââââââââââââââââââââââââââââââââââââââââ
   HomeContent â full homepage matching reference index.html
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
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('hc-visible'); });
    }, { threshold: 0.10 });
    document.querySelectorAll('.hc-reveal').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const toggleFaq = (i) => setOpenFaq(prev => prev === i ? -1 : i);

  /* shared inline style fragments */
  const maxW = { maxWidth:'80rem', margin:'0 auto' };
  const sectionPad = { padding:'6rem 1.5rem' };
  const headlineFont = { fontFamily:'Manrope,sans-serif' };
  const bodyFont = { fontFamily:'Inter,sans-serif' };
  const labelFont = { fontFamily:'Inter,sans-serif' };

  const CHECKLIST = [
    'Accident benefits (SABS)',
    'Income replacement eligibility',
    'Medical & rehabilitation benefits',
    'Caregiver & attendant care',
    'Third-party liability assessment',
    'Insurer deadline awareness',
  ];

  const CASE_TYPES = [
    { icon:'directions_car', title:'Motor Vehicle Accidents', desc:'Car, truck, motorcycle, pedestrian, and cyclist accidents anywhere in Ontario. Rideshare incidents included.', tag:'Most common claim type' },
    { icon:'person_raised_hand', title:'Slip & Fall / Premises', desc:'Falls on public or private property due to negligence, unsafe conditions, or failure to maintain premises.', tag:"Occupiers' liability applies" },
    { icon:'accessibility', title:'Disability & Injury Claims', desc:'Long-term or catastrophic injuries where income replacement, attendant care, or ongoing rehab may be at issue.', tag:'SABS coverage review' },
    { icon:'gavel', title:'Denied or Underpaid Claims', desc:'Insurers who have reduced, denied, or delayed benefits. We assess whether the outcome aligns with Ontario law.', tag:'Dispute & appeal support' },
    { icon:'construction', title:'Workplace Injuries', desc:'On-the-job accidents involving equipment, third parties, or conditions where liability extends beyond WSIB.', tag:'Third-party liability review' },
  ];

  const STEPS = [
    { num:'01', label:'Initial Intake', title:'Tell us what happened', desc:'Share the basics in a short guided form. No documents, no insurance details, no commitment. Takes about 2 minutes.', bg:NAVY },
    { num:'02', label:'Professional Review', title:'We review your situation', desc:"A licensed Ontario legal professional reviews the information you provided against Ontario\u2019s accident benefits framework \u2014 at no cost to you.", bg:LABEL_DARK },
    { num:'03', label:'We May Contact You', title:'We may contact you', desc:'If your situation fits our review criteria, a representative may reach out to discuss possible next steps \u2014 with zero pressure and no obligation to proceed.', bg:NAVY },
  ];

  const STATS = [
    { value:'2 yr', label:'Typical limitation window', color:'#fff' },
    { value:'7 day', label:'Deadline to notify insurer', color:GOLD },
    { value:'$0', label:'Cost to start your review', color:'#fff' },
    { value:'24hr', label:'Average response time', color:GOLD },
  ];

  const ADVANTAGES = [
    { icon:'lock', title:'Fully Confidential', desc:'Everything you share is encrypted and never disclosed to insurers or third parties without your explicit consent.' },
    { icon:'attach_money', title:'Free \u2014 No Obligation', desc:'No retainer, no fees, no pressure. The review is a service \u2014 not a sales process.' },
    { icon:'verified_user', title:'Ontario-Specific Expertise', desc:'Our reviewers understand the SABS framework, Ontario court precedents, and insurer tactics specific to this province.' },
    { icon:'schedule', title:'Fast Turnaround', desc:"Most reviews receive a response within 24 hours of submission \u2014 because deadlines in Ontario don\u2019t wait." },
  ];

  const FAQS = [
    { q:'Is this review really free?', a:"Yes \u2014 completely. There is no fee, no retainer, and no obligation to proceed. Ontario Accident Review is not a law firm and does not charge for reviews or referrals. The review exists to give you information, not to sign you up for anything." },
    { q:'Do I need to have a lawyer already?', a:"No. Many people who contact us have not yet spoken to a lawyer. The review is designed for exactly this stage \u2014 when you want to understand your situation before making any decisions. If you already have a lawyer, you\u2019re still welcome to request a review for a second perspective." },
    { q:'What happens after I submit the form?', a:"Your submission is reviewed by our team, typically within 24 hours. If your situation fits our review criteria, a representative will reach out using your preferred contact method. The conversation is informational \u2014 there\u2019s no pressure, no sales process, and no commitment required." },
    { q:'How long do I have to file a claim in Ontario?', a:'Ontario has strict deadlines. For accident benefits you must notify your insurer within 7 days and complete an application within 30 days. The general limitation period for civil claims is 2 years from the accident date. Missing these can eliminate entitlements. If you\u2019re approaching a deadline, submit your review immediately.' },
    { q:'What if my insurer already denied my claim?', a:'A denial is not necessarily the final word. Ontario\u2019s accident benefits system has formal dispute resolution processes including mediation and arbitration through FSRA (Financial Services Regulatory Authority). Our review can assess whether the denial is defensible under SABS and outline your next options.' },
    { q:'Is my information kept confidential?', a:'Absolutely. Everything you share is encrypted and handled in strict confidence. We do not share your information with insurers, third parties, or any other organization without your explicit written consent.' },
  ];

  const BLOGS = [
    { href:'/blog/deadlines', icon:'calendar_clock', label:'Deadlines & Timelines', title:'The 5 Deadlines Ontario Accident Victims Miss \u2014 And What Happens When They Do', desc:'Missing a notice or application deadline can cost you benefits you\u2019re otherwise entitled to.', grad:'linear-gradient(135deg, #001b44, #002e6e)' },
    { href:'/blog/sabs', icon:'account_balance', label:'Insurance Rights', title:'What Ontario\u2019s SABS Actually Covers: A Plain-Language Breakdown', desc:'The Statutory Accident Benefits Schedule is long and technical. We translate what it means for your situation.', grad:'linear-gradient(135deg, #0d1f38, #001b44)' },
    { href:'/blog/settlement', icon:'handshake', label:'Settlements', title:'Should You Accept the First Offer? What Most Claimants Don\u2019t Know', desc:'Initial offers often undervalue ongoing and future costs. Understand what\u2019s negotiable.', grad:'linear-gradient(135deg, #091625, #001b44)' },
  ];

  return (
    <>
      <style>{`
        .hc-reveal{opacity:0;transform:translateY(20px);transition:opacity 0.55s ease,transform 0.55s ease}
        .hc-reveal.hc-visible{opacity:1;transform:translateY(0)}
        .hc-hover-lift{transition:transform 0.2s ease,box-shadow 0.2s ease}
        .hc-hover-lift:hover{transform:translateY(-3px)}
        .hc-dark-card{background:${DARK_CARD_BG};border:1px solid rgba(255,255,255,0.06);transition:border-color 0.2s ease,background 0.2s ease}
        .hc-dark-card:hover{border-color:rgba(203,167,47,0.35);background:${DARK_CARD_HOVER}}
        .hc-blog-card{transition:border-color 0.2s ease;border:1px solid rgba(255,255,255,0.05)}
        .hc-blog-card:hover{border-color:rgba(203,167,47,0.3)}
        .hc-blog-card:hover .hc-blog-arrow{transform:translateX(4px)}
        .hc-blog-arrow{transition:transform 0.2s ease}
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
      `}</style>

      {/* ââââââ HEADER ââââââ */}
      <header style={{position:'fixed',top:0,width:'100%',zIndex:50,background:'rgba(6,11,22,0.90)',backdropFilter:'blur(14px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',...maxW}}>
          <a href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>{SVG_LOGO(40)}</a>
          <nav style={{display:'flex',alignItems:'center',gap:'2rem'}}>
            {[{t:'How it works',h:'#how-it-works'},{t:'Who this is for',h:'#who-this-is-for'},{t:'Blog',h:'/blog'},{t:'FAQ',h:'#faq'}].map(l => (
              <a key={l.t} href={l.h} style={{color:'rgba(255,255,255,0.7)',fontWeight:500,fontSize:'0.875rem',textDecoration:'none',...labelFont}}>{l.t}</a>
            ))}
          </nav>
          <a href="#intake" className="hc-gold-btn" style={{padding:'0.625rem 1.5rem',borderRadius:'0.375rem',fontSize:'0.875rem',letterSpacing:'0.025em',textDecoration:'none',...labelFont}}>Start Your Review</a>
        </div>
      </header>

      {/* ââââââ HERO ââââââ */}
      <section style={{background:'linear-gradient(145deg, #04090f 0%, #001b44 55%, #050d1a 100%)',paddingTop:'10rem',paddingBottom:'7rem',padding:'10rem 1.5rem 7rem',position:'relative',overflow:'hidden'}}>
        {/* Radial glow top-right */}
        <div style={{position:'absolute',top:'-30%',right:'-8%',width:620,height:620,background:'radial-gradient(circle, rgba(203,167,47,0.13) 0%, transparent 68%)',pointerEvents:'none'}} />
        {/* Radial glow bottom-left */}
        <div style={{position:'absolute',bottom:'-25%',left:'-6%',width:440,height:440,background:'radial-gradient(circle, rgba(58,130,200,0.10) 0%, transparent 68%)',pointerEvents:'none'}} />

        <div style={{...maxW,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
          <div style={{position:'relative',zIndex:10}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'9999px',padding:'0.375rem 1rem',marginBottom:'2rem'}}>
              <span className="hc-pulse" style={{width:8,height:8,borderRadius:'50%',background:GOLD}} />
              <span style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.7)',...labelFont}}>Free Â· No Obligation Â· Confidential</span>
            </div>
            <h1 style={{fontSize:'3.75rem',fontWeight:800,color:'#fff',lineHeight:1.08,letterSpacing:'-0.01em',marginBottom:'2rem',...headlineFont}}>
              Most Ontario accident victims don&apos;t know what they&apos;re actually entitled to.<br/>
              <span style={{background:'linear-gradient(90deg, #cba72f, #e9c349)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Find out.</span>
            </h1>
            <p style={{fontSize:'1.125rem',color:'rgba(255,255,255,0.6)',lineHeight:1.7,maxWidth:'32rem',marginBottom:'2rem',...bodyFont}}>
              It takes about 2 minutes. Get a free, no-obligation review of your situation before deciding your next step.
            </p>
            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',marginBottom:'2rem'}}>
              <GoldBtn>Start Your Free Review <Icon name="arrow_forward" size="1.25rem" color="#1a0f00" /></GoldBtn>
              <GhostBtn><Icon name="play_circle" size="1.25rem" fill /> See how it works</GhostBtn>
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'1.25rem',paddingTop:'0.25rem'}}>
              {['$0 to start','About 2 minutes','Private','No obligation'].map(t => (
                <div key={t} style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.75rem',fontWeight:700,color:'rgba(255,255,255,0.6)',...labelFont}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:GOLD,flexShrink:0}} />{t}
                </div>
              ))}
            </div>
          </div>

          {/* Checklist card */}
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',position:'relative',zIndex:10}}>
            <div className="hc-dark-card" style={{borderRadius:'0.75rem',padding:'2rem',width:'100%',maxWidth:'24rem'}}>
              <div style={{display:'flex',alignItems:'center',gap:'0.75rem',paddingBottom:'1rem',borderBottom:'1px solid rgba(255,255,255,0.08)',marginBottom:'1.25rem'}}>
                <div style={{height:40,width:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(203,167,47,0.15)',flexShrink:0}}>
                  <Icon name="verified_user" fill />
                </div>
                <div>
                  <div style={{color:'#fff',fontWeight:700,fontSize:'0.875rem',...headlineFont}}>Your Review Checklist</div>
                  <div style={{color:'rgba(255,255,255,0.4)',fontSize:'0.75rem',...labelFont}}>What we assess for every claim</div>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                {CHECKLIST.map(c => (
                  <div key={c} style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                    <Icon name="check_circle" size="1.125rem" fill />
                    <span style={{color:'rgba(255,255,255,0.75)',fontSize:'0.875rem',...bodyFont}}>{c}</span>
                  </div>
                ))}
              </div>
              <div style={{paddingTop:'0.75rem',borderTop:'1px solid rgba(255,255,255,0.08)',marginTop:'1.25rem'}}>
                <span style={{fontSize:'0.625rem',fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'0.1em',...labelFont}}>Reviewed for every Ontario claim</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ââââââ ADVOCACY INTRO ââââââ */}
      <section style={{background:DARK_BG,padding:'6rem 1.5rem'}}>
        <div style={{...maxW,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
          <div className="hc-reveal" style={{display:'flex',flexDirection:'column',gap:'1.75rem'}}>
            <GoldLabel>Ontario Accident Review</GoldLabel>
            <h2 style={{fontSize:'3rem',fontWeight:800,color:'#fff',lineHeight:1.15,...headlineFont}}>Independent Advocacy<br/>for Real Results.</h2>
            <GoldLine />
            <p style={{color:'rgba(255,255,255,0.6)',lineHeight:1.7,fontSize:'1rem',...bodyFont}}>Navigating Ontario&apos;s accident benefits system requires more than paperwork. We apply a structured approach to identifying every entitlement you&apos;re legally entitled to &mdash; before you face a single insurer or settlement table.</p>
            <p style={{color:TEXT_DIM,lineHeight:1.7,fontSize:'0.875rem',...bodyFont}}>Our review process is built on Ontario&apos;s Statutory Accident Benefits Schedule (SABS) and draws on a detailed analysis of your specific circumstances &mdash; not a generic checklist.</p>
            <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',paddingTop:'0.5rem'}}>
              <GoldBtn>Start Your Free Review <Icon name="arrow_forward" size="1.25rem" color="#1a0f00" /></GoldBtn>
              <GhostBtn href="#who-this-is-for">Who qualifies <Icon name="arrow_forward" size="1.25rem" /></GhostBtn>
            </div>
            <div style={{display:'flex',gap:'2rem',paddingTop:'0.75rem',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
              {[{v:'24 hr',l:'Response time'},{v:'$0',l:'Cost to you'},{v:'100%',l:'Confidential'}].map(s => (
                <div key={s.v}>
                  <div style={{fontSize:'1.875rem',fontWeight:800,color:'#fff',...headlineFont}}>{s.v}</div>
                  <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.05em',marginTop:'0.25rem',...labelFont}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="hc-reveal" style={{position:'relative',borderRadius:'0.75rem',overflow:'hidden',height:520}}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArsYkOIA4FUvBnpGFLcdqukHA_JQsXw9LgaQ5yuVzNPzge4wJWifuLf-JVUbrm4EnL7PB1LwdEA_HSi129RKeTwQo-Mc2hJKe6XIAXHvbtzzsKghdAvQaAukdjlJIZF8RY-mDO7i9f3MM4C3Ih3WNZhMxWKGtaL4FbCpYmvWbb9ey8_vKE3O2NlHJruJJY4lSUZajd6w9Bi8ufVmLwTSO3wsPx8s5EH-5Rj9xl66WWo-7uECf28sFhGNXAyaWtV8rnKuyy2L1nfzH7"
              alt="Ontario legal review professional"
              style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top',filter:'brightness(0.75) contrast(1.05)'}}
            />
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top, #060b16 0%, rgba(6,11,22,0.35) 45%, transparent 100%)'}} />
            <div style={{position:'absolute',bottom:'1.5rem',left:'1.5rem',right:'1.5rem'}}>
              <div className="hc-dark-card" style={{borderRadius:'0.5rem',padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{height:40,width:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(203,167,47,0.18)',flexShrink:0}}>
                  <Icon name="workspace_premium" fill />
                </div>
                <div>
                  <div style={{color:'#fff',fontWeight:700,fontSize:'0.875rem',...headlineFont}}>&ldquo;No cost Â· No obligation&rdquo;</div>
                  <div style={{color:'rgba(255,255,255,0.45)',fontSize:'0.75rem',...labelFont,marginTop:'0.125rem'}}>Ontario Accident Review â Free for all claimants</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ââââââ CASE TYPES ââââââ */}
      <section id="who-this-is-for" style={{background:DARK_ALT,padding:'6rem 1.5rem'}}>
        <div style={maxW}>
          <div className="hc-reveal" style={{maxWidth:'36rem',marginBottom:'3.5rem'}}>
            <GoldLabel>Who This Is For</GoldLabel>
            <h2 style={{fontSize:'2.5rem',fontWeight:800,color:'#fff',lineHeight:1.15,margin:'1rem 0 1.25rem',...headlineFont}}>Expert Review<br/>Across Claim Types</h2>
            <GoldLine />
            <p style={{color:TEXT_DIM,fontSize:'0.875rem',lineHeight:1.7,marginTop:'1.25rem',...bodyFont}}>Specific accident categories present unique entitlements under Ontario&apos;s legislative framework. Our review is structured around your exact type of claim.</p>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.25rem'}}>
            {CASE_TYPES.map((ct, i) => (
              <div key={ct.title} className="hc-reveal hc-dark-card hc-hover-lift" style={{borderRadius:'0.75rem',padding:'1.75rem'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',marginBottom:'1rem'}}>
                  <div style={{width:40,height:40,borderRadius:'0.5rem',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(203,167,47,0.12)',flexShrink:0}}>
                    <Icon name={ct.icon} size="1.25rem" fill />
                  </div>
                  <h3 style={{fontSize:'1rem',fontWeight:700,color:'#fff',paddingTop:'0.375rem',...headlineFont}}>{ct.title}</h3>
                </div>
                <p style={{color:TEXT_DIM,fontSize:'0.875rem',lineHeight:1.7,...bodyFont}}>{ct.desc}</p>
                <div style={{marginTop:'1.25rem',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                  <span style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:GOLD,...labelFont}}>{ct.tag}</span>
                </div>
              </div>
            ))}
            {/* CTA Card */}
            <div className="hc-reveal" style={{borderRadius:'0.75rem',padding:'1.75rem',display:'flex',flexDirection:'column',justifyContent:'space-between',background:'linear-gradient(135deg, #001b44, #002e6e)'}}>
              <div>
                <GoldLabel>Start now</GoldLabel>
                <h3 style={{fontSize:'1.25rem',fontWeight:800,color:'#fff',lineHeight:1.3,margin:'1rem 0 0.75rem',...headlineFont}}>Not sure which<br/>category applies?</h3>
                <p style={{color:'rgba(255,255,255,0.55)',fontSize:'0.875rem',lineHeight:1.7,...bodyFont}}>Submit your details and we&apos;ll identify the right framework for your claim.</p>
              </div>
              <a href="#intake" className="hc-gold-btn" style={{marginTop:'2rem',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',padding:'0.75rem 1.5rem',borderRadius:'0.375rem',fontSize:'0.875rem',textDecoration:'none',...labelFont}}>
                Check If I Qualify <Icon name="arrow_forward" size="1.125rem" color="#1a0f00" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ââââââ HOW IT WORKS ââââââ */}
      <section id="how-it-works" style={{background:LIGHT_BG,padding:'6rem 1.5rem'}}>
        <div style={{...maxW,display:'grid',gridTemplateColumns:'2fr 3fr',gap:'4rem',alignItems:'flex-start'}}>
          <div className="hc-reveal">
            <GoldLabel light>How It Works</GoldLabel>
            <h2 style={{fontSize:'2.5rem',fontWeight:800,color:NAVY,lineHeight:1.15,margin:'1rem 0 1.25rem',...headlineFont}}>Three Simple<br/>Steps</h2>
            <GoldLine />
            <p style={{color:ON_SURFACE_VARIANT,fontSize:'0.875rem',lineHeight:1.7,margin:'1.5rem 0 2rem',...bodyFont}}>Our process is designed to give you clarity fast &mdash; with no pressure, no paperwork, and no commitment at any stage.</p>
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

      {/* ââââââ STATS BAND ââââââ */}
      <section style={{background:DARK_BG,padding:'4rem 1.5rem'}}>
        <div style={{...maxW,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'2rem'}}>
          {STATS.map(s => (
            <div key={s.label} className="hc-reveal" style={{textAlign:'center'}}>
              <div style={{fontSize:'3rem',fontWeight:800,color:s.color,...headlineFont}}>{s.value}</div>
              <div style={{fontSize:'0.75rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',color:TEXT_DIMMER,marginTop:'0.5rem',...labelFont}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ââââââ ADVANTAGES + FAQ ââââââ */}
      <section id="faq" style={{background:WHITE_ALT,padding:'6rem 1.5rem'}}>
        <div style={{...maxW,display:'grid',gridTemplateColumns:'2fr 3fr',gap:'4rem'}}>
          {/* Left: Advantages */}
          <div className="hc-reveal" style={{display:'flex',flexDirection:'column',gap:'2rem'}}>
            <div>
              <GoldLabel light>Advantages</GoldLabel>
              <h2 style={{fontSize:'1.875rem',fontWeight:800,color:NAVY,lineHeight:1.15,margin:'1rem 0',...headlineFont}}>Why Ontario Accident Review</h2>
              <GoldLine />
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              {ADVANTAGES.map(a => (
                <div key={a.title} className="hc-hover-lift" style={{display:'flex',alignItems:'flex-start',gap:'1rem',padding:'1.25rem',borderRadius:'0.75rem',background:'#f3f4f6'}}>
                  <div style={{width:40,height:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(115,92,0,0.1)',flexShrink:0,marginTop:'0.125rem'}}>
                    <Icon name={a.icon} size="1.25rem" color={LABEL_DARK} fill />
                  </div>
                  <div>
                    <div style={{fontWeight:700,color:NAVY,fontSize:'0.875rem',marginBottom:'0.25rem',...headlineFont}}>{a.title}</div>
                    <p style={{color:ON_SURFACE_VARIANT,fontSize:'0.75rem',lineHeight:1.7,...bodyFont}}>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAQ */}
          <div className="hc-reveal">
            <GoldLabel light>Common Legal Inquiries</GoldLabel>
            <h2 style={{fontSize:'1.875rem',fontWeight:800,color:NAVY,lineHeight:1.15,margin:'1rem 0 1.5rem',...headlineFont}}>Frequently Asked</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
              {FAQS.map((f, i) => (
                <div key={i} className={`hc-faq-item${openFaq === i ? ' hc-faq-open' : ''}`} style={{border:'1px solid rgba(197,198,208,0.4)',borderRadius:'0.75rem',overflow:'hidden'}}>
                  <button onClick={() => toggleFaq(i)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1.25rem',textAlign:'left',gap:'1rem',background:'none',border:'none',cursor:'pointer'}}>
                    <span style={{fontWeight:700,color:NAVY,fontSize:'0.875rem',...headlineFont}}>{f.q}</span>
                    <span className="material-symbols-outlined hc-faq-icon" style={{fontSize:'1.25rem',flexShrink:0}}>add</span>
                  </button>
                  <div className="hc-faq-answer">
                    <p style={{color:ON_SURFACE_VARIANT,fontSize:'0.875rem',lineHeight:1.7,paddingBottom:'1.25rem',...bodyFont}}>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ââââââ BLOG PREVIEW ââââââ */}
      <section style={{background:DARK_BG,padding:'6rem 1.5rem'}}>
        <div style={maxW}>
          <div className="hc-reveal" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'3rem',flexWrap:'wrap',gap:'1rem'}}>
            <div>
              <GoldLabel>Resources &amp; Insights</GoldLabel>
              <h2 style={{fontSize:'2.5rem',fontWeight:800,color:'#fff',marginTop:'1rem',...headlineFont}}>Know Before You Claim</h2>
            </div>
            <a href="/blog" className="hc-ghost-btn" style={{display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'0.625rem 1.5rem',borderRadius:'0.375rem',fontSize:'0.875rem',textDecoration:'none',...labelFont}}>
              View all articles <Icon name="arrow_forward" size="1.125rem" />
            </a>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}}>
            {BLOGS.map(b => (
              <a key={b.href} href={b.href} className="hc-reveal hc-blog-card hc-dark-card hc-hover-lift" style={{borderRadius:'0.75rem',overflow:'hidden',display:'block',textDecoration:'none'}}>
                <div style={{height:'10rem',display:'flex',alignItems:'center',justifyContent:'center',background:b.grad}}>
                  <Icon name={b.icon} size="3.75rem" color="rgba(203,167,47,0.35)" fill />
                </div>
                <div style={{padding:'1.5rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <GoldLabel>{b.label}</GoldLabel>
                  <h3 style={{fontSize:'1rem',fontWeight:700,color:'#fff',lineHeight:1.4,...headlineFont}}>{b.title}</h3>
                  <p style={{color:'rgba(255,255,255,0.45)',fontSize:'0.75rem',lineHeight:1.7,...bodyFont}}>{b.desc}</p>
                  <div style={{paddingTop:'0.5rem',display:'flex',alignItems:'center',gap:'0.375rem',fontSize:'0.75rem',fontWeight:600,color:GOLD,...labelFont}}>
                    Read article <span className="material-symbols-outlined hc-blog-arrow" style={{fontSize:'0.875rem'}}>arrow_forward</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ââââââ CTA ââââââ */}
      <section style={{padding:'6rem 1.5rem',background:'linear-gradient(145deg, #04090f 0%, #001228 50%, #040810 100%)'}}>
        <div className="hc-reveal" style={{...maxW,maxWidth:'56rem',textAlign:'center'}}>
          <GoldLabel>Take the first step</GoldLabel>
          <h2 style={{fontSize:'3rem',fontWeight:800,color:'#fff',lineHeight:1.15,margin:'1.25rem 0',...headlineFont}}>Secure Your<br/>Professional Advocacy Today.</h2>
          <div style={{width:44,height:2,background:`linear-gradient(90deg, ${LABEL_DARK}, ${GOLD})`,margin:'1.75rem auto'}} />
          <p style={{color:TEXT_DIM,maxWidth:'36rem',margin:'0 auto 2.5rem',lineHeight:1.7,...bodyFont}}>Ontario accident victims routinely accept less than they&apos;re entitled to. A free, no-obligation review takes two minutes and could change what you walk away with.</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <GoldBtn style={{padding:'1rem 2.5rem',boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)'}}>Start Your Free Review <Icon name="arrow_forward" size="1.25rem" color="#1a0f00" /></GoldBtn>
            <GhostBtn href="#faq" style={{padding:'1rem 2.5rem'}}>Common Questions</GhostBtn>
          </div>
          <p style={{color:'rgba(255,255,255,0.25)',fontSize:'0.75rem',marginTop:'1.75rem',...labelFont}}>Free Â· Confidential Â· No obligation Â· Takes ~2 minutes</p>
        </div>
      </section>

      {/* ââââââ FOOTER ââââââ */}
      <footer style={{background:DARK_BG,borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <div style={{...maxW,padding:'3.5rem 2rem 2rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'2.5rem',paddingBottom:'3rem',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
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
                {[{t:'How it works',h:'#how-it-works'},{t:'Who this is for',h:'#who-this-is-for'},{t:'Blog & Resources',h:'/blog'},{t:'FAQ',h:'#faq'}].map(l => (
                  <a key={l.t} href={l.h} style={{fontSize:'0.875rem',color:'rgba(255,255,255,0.5)',textDecoration:'none',...bodyFont}}>{l.t}</a>
                ))}
                <a href="#intake" style={{fontSize:'0.875rem',fontWeight:600,color:GOLD,textDecoration:'none',...bodyFont}}>Start Your Free Review â</a>
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
            <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.25)',...labelFont}}>Â© 2025 Ontario Accident Review. All rights reserved.</div>
            <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.2)',...labelFont}}>Ontario, Canada</div>
          </div>
        </div>
      </footer>

      {/* ââââââ MOBILE STICKY CTA ââââââ */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:50,padding:'1rem',background:'rgba(4,9,15,0.97)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,0.07)',transform: stickyCta ? 'translateY(0)' : 'translateY(100%)',transition:'transform 0.4s ease',display:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:'#fff',fontWeight:700,fontSize:'0.875rem',lineHeight:1.2,...headlineFont}}>Free Accident Review</div>
            <div style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem',...labelFont}}>About 2 min Â· No obligation</div>
          </div>
          <a href="#intake" className="hc-gold-btn" style={{flexShrink:0,display:'inline-flex',alignItems:'center',gap:'0.5rem',padding:'0.75rem 1.25rem',borderRadius:'0.375rem',fontSize:'0.875rem',textDecoration:'none',...labelFont}}>
            Start Free Review <Icon name="arrow_forward" size="1rem" color="#1a0f00" />
          </a>
        </div>
      </div>
    </>
  );
}
