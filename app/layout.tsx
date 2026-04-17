import '@/styles/globals.css';
import { Inter, Instrument_Serif } from 'next/font/google';
import type { ReactNode } from 'react';
import { site } from '@/lib/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif'
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
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
