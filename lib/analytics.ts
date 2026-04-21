/**
 * OAR Analytics — Full Funnel Event Map
 * All events route through GA4 (G-BJN974S0MR) via window.gtag.
 * Payloads are typed so future tools (GTM, Segment, etc.) can consume the same map.
 *
 * Event naming: snake_case, GA4-compatible.
 * All events include base_props automatically.
 */

/* ── Base helpers ── */

function getDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w <= 480) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

function getTrafficSource(): string {
  if (typeof document === 'undefined') return 'direct';
  const ref = document.referrer;
  if (!ref) return 'direct';
  if (ref.includes('google')) return 'google';
  if (ref.includes('bing')) return 'bing';
  if (ref.includes('facebook') || ref.includes('fb.com')) return 'facebook';
  if (ref.includes('instagram')) return 'instagram';
  return 'referral';
}

function getUtmParam(param: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(param);
}

function baseProps() {
  return {
    device: getDevice(),
    traffic_source: getUtmParam('utm_source') ?? getTrafficSource(),
    utm_medium: getUtmParam('utm_medium') ?? undefined,
    utm_campaign: getUtmParam('utm_campaign') ?? undefined,
    landing_page: typeof window !== 'undefined' ? window.location.pathname : '/',
    timestamp_ms: Date.now(),
  };
}

/* ── Core fire function ── */

export function track(event_name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const payload = { ...baseProps(), ...params };

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', event_name, payload);
  }

  // dataLayer (GTM-compatible)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: event_name, ...payload });

  // Dev logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[OAR Analytics] ${event_name}`, payload);
  }
}

/* ══════════════════════════════════════════════
   EVENT DEFINITIONS
   Each function documents the event name + payload
   so the event map is readable as code.
══════════════════════════════════════════════ */

// 1. Homepage / page views
export const Analytics = {

  /** Fired when homepage becomes visible (scroll to first section) */
  homepageView() {
    track('homepage_view');
  },

  /** Any primary CTA button clicked */
  ctaClick(params: {
    cta_text: string;        // e.g. "Get My Free Claim Review"
    cta_location: string;    // e.g. "hero" | "mid_page" | "sticky_bar" | "mini_card" | "final_cta"
  }) {
    track('cta_click', params);
  },

  /** FAQ item expanded */
  faqExpand(params: {
    question: string;        // the question text (truncated to 80 chars)
    question_index: number;  // 0-based
  }) {
    track('faq_expand', { ...params, question: params.question.slice(0, 80) });
  },

  /** Link to resource page / blog post clicked */
  resourceClick(params: {
    resource_title: string;
    resource_url: string;
  }) {
    track('resource_click', params);
  },

  /** Intake modal opened (hash = #intake) */
  intakeStart(params: {
    trigger?: string;  // which CTA triggered it, if known
  } = {}) {
    track('intake_start', params);
  },

  /** Each intake step becomes visible */
  intakeStepView(params: {
    step: number;            // 1, 2, 3
    step_label: string;      // "Accident basics" | "Impact" | "Contact"
  }) {
    track('intake_step_view', params);
  },

  /** User makes a selection/input on a field */
  intakeFieldCompleted(params: {
    step: number;
    field_name: string;      // e.g. "accident_type" | "ontario_yn" | "claim_status" | "injured"
    field_value?: string;    // only for non-PII fields (accident_type, claim_status, ontario_yn)
  }) {
    track('intake_field_completed', params);
  },

  /** User clicks Continue to advance a step */
  intakeStepComplete(params: {
    step: number;
    step_label: string;
    accident_type?: string;
    claim_status?: string;
    ontario_yn?: string;
    injured?: string;
    missed_work?: string;
    treatment?: string;
    ongoing_symptoms?: string;
    has_description?: boolean;
  }) {
    track('intake_step_complete', params);
  },

  /** User clicks Submit (before API call) */
  intakeSubmit(params: {
    accident_type?: string;
    claim_status?: string;
    ontario_yn?: string;
    injured?: string;
    time_to_submit_ms?: number; // ms from intake_start to submit click
  }) {
    track('intake_submit', params);
  },

  /** API call returned success → user hits /thank-you */
  submissionSuccess(params: {
    accident_type?: string;
    claim_status?: string;
    time_to_complete_ms?: number;
  }) {
    track('submission_success', params);
  },

  /** /thank-you page loaded */
  confirmationPageView() {
    track('confirmation_page_view');
  },

  /** Any footer/nav/inline contact link clicked */
  contactLinkClick(params: {
    link_text: string;
    link_url: string;
    location: string;  // "footer" | "nav" | "inline"
  }) {
    track('contact_link_click', params);
  },

  /** Privacy policy page loaded */
  privacyPolicyView() {
    track('privacy_policy_view');
  },

  /** Legal disclaimer page loaded */
  legalDisclaimerView() {
    track('legal_disclaimer_view');
  },
};

/* ── Type augmentation for window ── */
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
  }
}
