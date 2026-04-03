export function ValueSection() {
  const items = [
    { icon: '01', title: 'Know your rights', body: "Ontario accident law is complex. We break it down so you can understand your situation — without hiring anyone first." },
    { icon: '02', title: 'Real advice, not generic info', body: "Your review is based on your specific situation, not a generic FAQ. We assess what Ontario's rules say about your case." },
    { icon: '03', title: 'No commitment required', body: "Submitting a review doesn't start any legal process. It's simply a first step — you decide what to do from there." },
  ];
  return (
    <section style={{background:'#0e1c30',padding:'80px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}>
        <p style={{color:'#cba72f',fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontSize:'0.75rem',marginBottom:16,marginTop:0}}>Why Ontario Accident Review</p>
        <h2 style={{color:'#fff',fontFamily:'Manrope,sans-serif',fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,marginBottom:56,marginTop:0}}>Built for people who want clarity — not pressure</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:40}}>
          {items.map(item => (
            <div key={item.title} style={{borderTop:'1px solid rgba(203,167,47,0.3)',paddingTop:28}}>
              <div style={{fontSize:'1.5rem',fontFamily:'Manrope,sans-serif',fontWeight:800,color:'#cba72f',marginBottom:16}}>{item.icon}</div>
              <h3 style={{color:'#fff',fontFamily:'Manrope,sans-serif',fontSize:'1.05rem',fontWeight:700,marginBottom:10,marginTop:0}}>{item.title}</h3>
              <p style={{color:'#8fa3be',fontFamily:'Inter,sans-serif',fontSize:'0.95rem',lineHeight:1.7,margin:0}}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
