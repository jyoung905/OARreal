'use client';

import { useEffect } from 'react';
import { event } from '@/lib/gtag';
import { Analytics } from '@/lib/analytics';

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

    try {
      sessionStorage.removeItem('oar_lead_conversion_pending');
    } catch {}

    event('generate_lead', {
      event_category: 'intake_form',
      event_label: 'ab_claims_ontario',
      submission_id: marker,
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-18043625605/HwLYCIypipAcEIXB75tD',
        value: 1.0,
        currency: 'CAD',
        transaction_id: marker,
      });
    }

    Analytics.confirmationPageView();
  }, []);

  return null;
}
