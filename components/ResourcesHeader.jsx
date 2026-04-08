'use client';
import { useState } from 'react';
import Link from 'next/link';

const GOLD = '#cba72f';

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

export function ResourcesHeader() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { t: 'How it works', h: '/#how-it-works' },
    { t: 'Why start here', h: '/#why-start-here' },
    { t: 'Resources', h: '/resources' },
    { t: 'FAQ', h: '/#faq' },
  ];

  return (
    <>
      <style>{`
        @media(max-width:768px){
          .rh-desktop-nav{display:none!important}
          .rh-hamburger{display:flex!important}
          .rh-header-cta{display:none!important}
        }
        @media(min-width:769px){
          .rh-hamburger{display:none!important}
          .rh-mobile-menu{display:none!important}
        }
        .rh-hamburger-line{display:block;width:22px;height:2px;background:${GOLD};border-radius:2px;transition:transform 0.2s,opacity 0.2s}
      `}</style>
      <header style={{position:'sticky',top:0,width:'100%',zIndex:50,background:'rgba(6,11,22,0.92)',backdropFilter:'blur(14px)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.5rem',maxWidth:'80rem',margin:'0 auto'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>{SVG_LOGO(40)}</Link>
          <nav className="rh-desktop-nav" style={{display:'flex',alignItems:'center',gap:'2rem'}}>
            {navLinks.map(l => (
              <Link key={l.t} href={l.h} style={{color: l.h === '/resources' ? GOLD : 'rgba(255,255,255,0.7)',fontWeight: l.h === '/resources' ? 700 : 500,fontSize:'0.875rem',textDecoration:'none',fontFamily:"'Open Sans',sans-serif"}}>{l.t}</Link>
            ))}
          </nav>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <a href="/#intake" className="rh-header-cta" style={{background:GOLD,color:'#1a0f00',fontWeight:700,padding:'0.625rem 1.5rem',borderRadius:'0.375rem',fontSize:'0.875rem',textDecoration:'none',fontFamily:"'Open Sans',sans-serif"}}>Get My Free Review</a>
            <button className="rh-hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu" style={{background:'none',border:'none',cursor:'pointer',padding:'8px',display:'flex',flexDirection:'column',justifyContent:'center',gap:'5px'}}>
              <span className="rh-hamburger-line" style={open ? {transform:'translateY(7px) rotate(45deg)'} : {}} />
              <span className="rh-hamburger-line" style={open ? {opacity:0} : {}} />
              <span className="rh-hamburger-line" style={open ? {transform:'translateY(-7px) rotate(-45deg)'} : {}} />
            </button>
          </div>
        </div>
        {open && (
          <nav className="rh-mobile-menu" style={{display:'flex',flexDirection:'column',gap:'0.875rem',padding:'1.25rem 1.5rem 1.5rem',background:'#060b16',borderTop:'1px solid rgba(203,167,47,0.2)'}}>
            {navLinks.map(l => (
              <Link key={l.t} href={l.h} onClick={() => setOpen(false)} style={{color:'rgba(255,255,255,0.85)',fontWeight:500,fontSize:'1rem',textDecoration:'none',padding:'0.25rem 0',fontFamily:"'Open Sans',sans-serif"}}>{l.t}</Link>
            ))}
            <a href="/#intake" onClick={() => setOpen(false)} style={{display:'block',textAlign:'center',marginTop:'0.5rem',padding:'0.875rem 1.5rem',background:GOLD,color:'#1a0f00',fontWeight:700,borderRadius:'0.375rem',fontSize:'0.95rem',textDecoration:'none',fontFamily:"'Open Sans',sans-serif"}}>Get My Free Claim Review</a>
          </nav>
        )}
      </header>
    </>
  );
}
