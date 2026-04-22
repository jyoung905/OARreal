import '@/styles/globals.css';
import Script from 'next/script';
import { Inter, Playfair_Display } from 'next/font/google';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seoTitle,
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
    title: site.seoTitle,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: 'en_CA',
    type: 'website',
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }]
  },
  twitter: {
    card: 'summary_large_image',
    title: site.seoTitle,
    description: site.description,
    images: [site.ogImage]
  },
  robots: {
    index: true,
    follow: true
  },
  verification: {
    google: 'gZVToI6H0XF_MBF1XiZczKJ8Op2PzA8X5ALxAaLLpPU',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA">
      <head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: "try { if (location.hash && location.hash !== '#intake') { history.replaceState(null, '', location.pathname); } } catch(e) {}" }} />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-18043625605"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18043625605');
  `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable}`}><GoogleAnalytics /><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
