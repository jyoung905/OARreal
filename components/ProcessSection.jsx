export function ProcessSection() {
  const steps = [
    { num: '01', title: 'We review your submission', body: 'A licensed Ontario professional personally reviews every submission — no AI, no automated screening.' },
    { num: '02', title: 'You receive a written summary', body: "We outline what accident benefits and options may apply to your specific situation." },
    { num: '03', title: 'You decide next steps', body: 'No pressure, no obligation. The review is yours to keep regardless.' },
  ];
  return (
    <section id="how-it-works" style={{background:'#0e1c30',padding:'80px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}>
        <p style={{color:'#cba72f',fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontSize:'0.75rem',marginBottom:16,marginTop:0}}>What Happens Next</p>
        <h2 style={{color:'#fff',fontFamily:'Manrope,sans-serif',fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,marginBottom:56,marginTop:0}}>What Happens After You Submit</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:40}}>
          {steps.map(s => (
            <div key={s.num} style={{borderTop:'2px solid #cba72f',paddingTop:28}}>
              <div style={{color:'#cba72f',fontFamily:'Manrope,sans-serif',fontSize:'3rem',fontWeight:900,lineHeight:1,marginBottom:20,opacity:0.45}}>{s.num}</div>
              <h3 style={{color:'#fff',fontFamily:'Manrope,sans-serif',fontSize:'1.1rem',fontWeight:700,marginBottom:12,marginTop:0}}>{s.title}</h3>
              <p style={{color:'#8fa3be',fontFamily:'Inter,sans-serif',fontSize:'0.95rem',lineHeight:1.7,margin:0}}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
