import Link from 'next/link';
import Image from 'next/image';

export function SiteFooter() {
  return (
    <footer className="site-footer premium-site-footer">
      <div className="container footer-grid">
        <div>
          <Image src="/logo-placeholder.svg" alt="Ontario Accident Review" width={220} height={50} />
          <p>Ontario Accident Review is not a law firm. No legal advice. No legal representation.</p>
        </div>
        <div>
          <p className="footer-heading">Pages</p>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service">Terms of Service</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>

      <p className="footer-copyright">© 2026 Ontario Accident Review. All rights reserved.</p>
    </footer>
  );
}
