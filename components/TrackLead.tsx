'use client';

import { useEffect } from 'react';
import { event } from '@/lib/gtag';

/**
 * Fires a generate_lead GA4 event and a Google Ads conversion event on mount.
 * Drop this into any Server Component page — it renders nothing visible.
 */
export default function TrackLead() {
  useEffect(() => {
    event('generate_lead', {
      event_category: 'intake_form',
      event_label: 'ab_claims_ontario',
    });
  }, []);

  return null;
}
