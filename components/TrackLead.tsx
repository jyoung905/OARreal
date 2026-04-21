'use client';

import { useEffect } from 'react';
import { event } from '@/lib/gtag';
import { Analytics } from '@/lib/analytics';

/**
 * Fires a generate_lead GA4 event, a Google Ads conversion, and
 * the OAR confirmation_page_view event on mount.
 */
export default function TrackLead() {
  useEffect(() => {
    // GA4 lead event
    event('generate_lead', {
      event_category: 'intake_form',
      event_label: 'ab_claims_ontario',
    });
    // OAR funnel event
    Analytics.confirmationPageView();
  }, []);

  return null;
}
