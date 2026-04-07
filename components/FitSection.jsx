export function FitSection() {
  const cards = [
    { num: '01', title: 'Recently hurt in Ontario', body: 'You were recently injured in a car accident in Ontario.' },
    { num: '02', title: 'Unsure about your benefits', body: "You're not sure if you're entitled to accident benefits." },
    { num: '03', title: 'Denied or received a low offer', body: 'You received a denial or low offer from your insurer.' },
    { num: '04', title: 'Symptoms but no claim filed', body: "You're dealing with pain or ongoing symptoms but haven't filed a claim." },
    { num: '05', title: 'Claim closed unexpectedly', body: "Your claim was closed and you're not sure if it should have been." },
    { num: '06', title: 'Want plain-language clarity', body: 'You want a plain-language explanation of your options — no lawyers, no pressure.' },
  
  return (
    <section id="who-this-is-for" style={{background:'#060b16',padding:'80px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}>
        <p style={{color:'#cba72f',fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontSize:'0.75rem',marginBottom:16,marginTop:0}}>Who this is for</p>
        <h2 style={{color:'#fff',fontFamily:'Manrope,sans-serif',fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,marginBottom:56,marginTop:0}}>Who This Is For</h2>
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
