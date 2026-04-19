import Link from 'next/link';
import { Logo } from '@/components/Logo';

function Dot() {
  return <span className="footer-v2-dot" aria-hidden="true" />;
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-v2">
      <div className="container footer-v2-inner">
        <div className="footer-v2-grid">
          <div className="footer-v2-brand">
            <Logo showTagline={false} className="footer-logo" />
            <p className="footer-v2-brand-copy">
              A simpler first step after an Ontario accident. We help people understand whether
              their situation may be worth pursuing — before deciding what to do next.
            </p>
            <ul className="footer-v2-badges" aria-label="Trust">
              <li><Dot /> Ontario-focused</li>
              <li><Dot /> Plain-language intake</li>
              <li><Dot /> Reviewed by a person</li>
            </ul>
          </div>

          <div className="footer-v2-col">
            <p className="footer-v2-heading">Explore</p>
            <ul>
              <li><Link href="/#how-it-works">How it works</Link></li>
              <li><Link href="/#who-this-is-for">Who this is for</Link></li>
              <li><Link href="/resources">Resources</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-v2-col">
            <p className="footer-v2-heading">Company</p>
            <ul>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy policy</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>

          <div className="footer-v2-col footer-v2-cta-col">
            <p className="footer-v2-heading">Start your review</p>
            <p className="footer-v2-cta-copy">
              Takes about 2 minutes. No insurance details needed.
            </p>
            <Link className="button footer-v2-cta" href="/review">
              Begin review
            </Link>
          </div>
        </div>

        <div className="footer-v2-bottom">
          <p>&copy; {year} Ontario Accident Review. All rights reserved.</p>
          <p className="footer-v2-disclaimer">
            Ontario Accident Review is not a law firm and does not provide legal advice or
            legal representation. Follow-up, if any, comes from a representative of Ontario
            Accident Review after an initial review.
          </p>
        </div>
      </div>
    </footer>
  );
}
