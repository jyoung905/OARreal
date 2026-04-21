'use client';

import { useEffect } from 'react';
import { Analytics } from '@/lib/analytics';

type TrackableView = 'privacy_policy' | 'legal_disclaimer';

export default function TrackPageView({ view }: { view: TrackableView }) {
  useEffect(() => {
    if (view === 'privacy_policy') Analytics.privacyPolicyView();
    if (view === 'legal_disclaimer') Analytics.legalDisclaimerView();
  }, [view]);

  return null;
}
