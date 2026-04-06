export function CtaSection() {
  return (
    <section style={{background:'#060b16',padding:'100px 0',borderTop:'1px solid rgba(203,167,47,0.2)'}}>
      <div style={{maxWidth:800,margin:'0 auto',padding:'0 24px',textAlign:'center'}}>
        <p style={{color:'#cba72f',fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontSize:'0.75rem',marginBottom:16,marginTop:0}}>Take the first step</p>
        <h2 style={{color:'#fff',fontFamily:'Manrope,sans-serif',fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:800,marginBottom:20,marginTop:0,lineHeight:1.2}}>
          See Whether Your Claim May Be Worth Pursuing
        </h2>
        <p style={{color:'#8fa3be',fontFamily:'Inter,sans-serif',fontSize:'1.05rem',lineHeight:1.7,marginBottom:40,marginTop:0}}>
          No lawyers, no commitment, no pressure. Just an honest first look at your situation under Ontario law.
        </p>
        <a href="#intake" style={{display:'inline-block',background:'#cba72f',color:'#0a1628',fontFamily:'Manrope,sans-serif',fontWeight:800,fontSize:'1rem',padding:'16px 40px',borderRadius:6,textDecoration:'none',letterSpacing:'0.02em'}}>
          Start My Free Review
        </a>
      </div>
    </section>
  );
}
