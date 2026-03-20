import Link from 'next/link';
import { site } from '@/lib/site';

export function Logo({ showTagline = true, href = '/', className = '' }) {
  const content = (
    <>
      <span className="brand-mark" aria-hidden="true">
        OAR
      </span>
      <span>
        <span className="brand-name">{site.name}</span>
        {showTagline ? <span className="brand-sub">{site.tagline}</span> : null}
      </span>
    </>
  );

  if (!href) {
    return <div className={`brand brand-lockup ${className}`.trim()}>{content}</div>;
  }

  return (
    <Link href={href} className={`brand brand-lockup ${className}`.trim()} aria-label={site.name}>
      {content}
    </Link>
  );
}
