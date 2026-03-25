import '@/styles/globals.css';
import { Inter, Manrope } from 'next/font/google';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body'
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-display'
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`
  },
  description: site.description,
  applicationName: site.name,
  alternates: {
    canonical: '/'
  },
  keywords: [
    'Ontario accident review',
    'Ontario accident intake',
    'car accident Ontario',
    'injury review Ontario',
    'slip and fall Ontario'
  ],
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'en_CA',
    type: 'website',
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }]
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
    images: [site.ogImage]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA">
            <head>
        <script dangerouslySetInnerHTML={{ __html: "try { if (location.hash && location.hash !== '#intake') { history.replaceState(null, '', location.pathname); } } catch(e) {}" }} />
      </head>
<body className={`${inter.variable} ${manrope.variable}`}>{children}</body>
    </html>
  );
}
