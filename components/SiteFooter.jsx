import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function SiteFooter() {
  return (
    <footer className="site-footer premium-site-footer">
      <div className="container footer-grid">
        <div>
          <Logo showTagline={false} className="footer-logo" />
          <p>Ontario Accident Review is not a law firm. No legal advice. No legal representation.</p>
          <p className="disclaimer">
            Follow-up, if any, comes from a representative of Ontario Accident Review after an
            initial review.
          </p>
        </div>
        <div>
          <p className="footer-heading">Pages</p>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
