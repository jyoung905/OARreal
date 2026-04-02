import Link from 'next/link';

export function FaqSection() {
  const faqs = [
    { q: 'Is Ontario Accident Review a law firm?', a: 'No. Ontario Accident Review is not a law firm and does not provide legal advice or legal representation.' },
    { q: 'What happens after I submit my review?', a: 'A representative of Ontario Accident Review reviews your information. If your situation appears to fit our review criteria, we may contact you to discuss next steps.' },
    { q: 'Do I need to provide insurance information?', a: 'No. We do not ask for insurance details in the initial review.' },
    { q: 'Do I need to upload documents?', a: 'No. We are intentionally keeping the first stage simple and do not require uploads.' },
    { q: 'Does submitting a review mean I am starting a legal case?', a: 'No. Submitting the form is only a request for an initial review.' },
  ];
  return (
    <section id="faq" style={{background:'#f5f7fa',padding:'80px 0'}}>
      <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px'}}>
        <p style={{color:'#cba72f',fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',fontSize:'0.75rem',marginBottom:16,marginTop:0}}>Common questions</p>
        <h2 style={{color:'#0a1628',fontFamily:'Manrope,sans-serif',fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,marginBottom:48,marginTop:0}}>FAQ</h2>
        <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:48,alignItems:'start'}}>
          <div>
            {faqs.map(faq => (
              <div key={faq.q} style={{borderBottom:'1px solid #dde3ed',paddingBottom:20,marginBottom:20}}>
                <h3 style={{color:'#0a1628',fontFamily:'Manrope,sans-serif',fontSize:'0.95rem',fontWeight:700,marginBottom:6,marginTop:0}}>{faq.q}</h3>
                <p style={{color:'#4a5568',fontFamily:'Inter,sans-serif',fontSize:'0.9rem',lineHeight:1.7,margin:0}}>{faq.a}</p>
              </div>
            ))}
          </div>
          <div style={{background:'#fff',border:'1px solid #dde3ed',borderRadius:8,padding:'28px 24px',position:'sticky',top:24}}>
            <p style={{color:'#cba72f',fontFamily:'Manrope,sans-serif',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',fontSize:'0.7rem',marginBottom:8,marginTop:0}}>Important</p>
            <h3 style={{color:'#0a1628',fontFamily:'Manrope,sans-serif',fontSize:'0.95rem',fontWeight:700,marginBottom:10,marginTop:0}}>Keep the first step simple</h3>
            <p style={{color:'#4a5568',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',lineHeight:1.7,margin:'0 0 12px 0'}}>
              Do not send IDs, health card numbers, insurance policy numbers, banking details, or other highly sensitive information through this first-step intake.
            </p>
            <p style={{color:'#4a5568',fontFamily:'Inter,sans-serif',fontSize:'0.85rem',lineHeight:1.7,margin:0}}>
              Please review our{' '}
              <Link href="/privacy.html" style={{color:'#cba72f'}}>Privacy Policy</Link>,{' '}
              <Link href="/disclaimer.html" style={{color:'#cba72f'}}>Disclaimer</Link>, and{' '}
              <Link href="/contact.html" style={{color:'#cba72f'}}>Contact</Link> pages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
