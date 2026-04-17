import { SimpleHeader } from '@/components/SiteHeader';

export function ContentPage({ eyebrow, title, intro, children, shellClassName = 'page-shell', containerClassName = 'container' }) {
  return (
    <>
      <SimpleHeader />
      <main className="page-section">
        <div className={containerClassName}>
          <div className={shellClassName}>
            <div className="page-head">
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
              <p className="page-copy">{intro}</p>
            </div>
            <div className="page-body">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
}
