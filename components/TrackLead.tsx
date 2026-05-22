'use client';

import { useEffect } from 'react';
import { Analytics } from '@/lib/analytics';

const CONVERSION_ID = 'AW-18043625605/HwLYCIypipAcEIXB75tD';

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args as unknown as Record<string, unknown>);
    };
  }

  return window.gtag;
}

/**
 * Fires lead conversion events only after a confirmed successful API capture.
 * The intake form sets oar_lead_conversion_pending after /api/intake returns success.
 * This prevents duplicate Google Ads conversions on thank-you page refreshes.
 */
export default function TrackLead() {
  useEffect(() => {
    let marker: string | null = null;
    try {
      marker = sessionStorage.getItem('oar_lead_conversion_pending');
    } catch {
      marker = null;
    }

    if (!marker) return;

    const gtag = ensureGtag();

    gtag('event', 'generate_lead', {
      event_category: 'intake_form',
      event_label: 'ab_claims_ontario',
      submission_id: marker,
    });

    gtag('event', 'conversion', {
      send_to: CONVERSION_ID,
      value: 1.0,
      currency: 'CAD',
      transaction_id: marker,
    });

    try {
      sessionStorage.removeItem('oar_lead_conversion_pending');
    } catch {}

    Analytics.confirmationPageView();
  }, []);

  return null;
}
