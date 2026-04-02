export function FitSection() {
  const cards = [
    { num: '01', title: 'Injured in Ontario', body: 'You were hurt in a car accident, slip and fall, or other incident that happened in Ontario.' },
    { num: '02', title: "Not sure if it's serious enough", body: "You're unsure whether your injuries qualify — Ontario's threshold for accident benefits isn't always obvious." },
    { num: '03', title: 'Want to understand your rights', body: "You want plain-English clarity on what Ontario's insurance laws say about your situation, before taking any action." },
    { num: '04', title: 'Want a simple first step', body: "You're looking for a no-pressure, no-commitment starting point — before deciding anything or talking to anyone." },
  ];
  return (
    <section id="who-this-is-for" style={{background:'#060b16',padding:'80px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}>
        <p style={{color:'#cba72f',fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontSize:'0.75rem',marginBottom:16,marginTop:0}}>Who this is for</p>
        <h2 style={{color:'#fff',fontFamily:'Manrope,sans-serif',fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,marginBottom:56,marginTop:0}}>This is for you if…</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:24}}>
          {cards.map(c => (
            <div key={c.num} style={{background:'#0a1628',border:'1px solid rgba(203,167,47,0.15)',borderRadius:8,padding:'32px 28px'}}>
              <div style={{color:'#cba72f',fontFamily:'Manrope,sans-serif',fontSize:'1.8rem',fontWeight:900,lineHeight:1,marginBottom:16,opacity:0.45}}>{c.num}</div>
              <h3 style={{color:'#fff',fontFamily:'Manrope,sans-serif',fontSize:'1rem',fontWeight:700,marginBottom:10,marginTop:0}}>{c.title}</h3>
              <p style={{color:'#8fa3be',fontFamily:'Inter,sans-serif',fontSize:'0.9rem',lineHeight:1.7,margin:0}}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
