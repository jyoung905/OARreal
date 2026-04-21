/**
 * OAR A/B Testing
 * ─────────────────────────────────────────────────────────────────
 * Simple 50/50 variant assignment. Stable per browser session via
 * sessionStorage. Variants tracked through GA4 via Analytics.track().
 *
 * Usage:
 *   const variant = getVariant('hero_cta')          // 'a' | 'b'
 *   const config  = AB_TESTS.hero_cta.variants[variant]
 *
 * To disable a test (lock to 'a'):
 *   Set enabled: false in the test definition below.
 * ─────────────────────────────────────────────────────────────────
 */

import { track } from './analytics';

export type VariantKey = 'a' | 'b';

export interface ABTest<T> {
  name: string;
  enabled: boolean;
  variants: { a: T; b: T };
}

/* ══════════════════════════════════════════════
   TEST DEFINITIONS
   Edit only this section to change copy or
   enable/disable tests.
══════════════════════════════════════════════ */

export const AB_TESTS = {

  /** TEST 1 — Hero CTA button text */
  hero_cta: {
    name: 'hero_cta',
    enabled: true,
    variants: {
      a: 'Get My Free Claim Review',
      b: 'Check What May Apply to My Claim',
    },
  } satisfies ABTest<string>,

  /** TEST 2 — Hero subheadline */
  hero_subhead: {
    name: 'hero_subhead',
    enabled: true,
    variants: {
      a: 'In about 2 minutes, tell us what happened. We review your situation and, if it fits our criteria, reach out with plain-language guidance on benefits, deadlines, and next steps — at no cost.',
      b: 'Get a plain-language Ontario accident claim review so you can understand your benefits, deadlines, and next steps before making any decisions.',
    },
  } satisfies ABTest<string>,

  /** TEST 3 — Trust strip pills */
  trust_strip: {
    name: 'trust_strip',
    enabled: true,
    variants: {
      a: ['Free', 'No Obligation', 'Confidential', '~2 min'],
      b: ['Free', 'Confidential', 'Reviewed by a licensed Ontario professional', '~2 min'],
    },
  } satisfies ABTest<string[]>,

} as const;

export type TestName = keyof typeof AB_TESTS;

/* ══════════════════════════════════════════════
   VARIANT ASSIGNMENT
══════════════════════════════════════════════ */

const STORAGE_PREFIX = 'oar_ab_';

/**
 * Returns the assigned variant for a test.
 * Assigns randomly on first call; stable for the rest of the session.
 * Always returns 'a' for disabled tests or during SSR.
 */
export function getVariant(testName: TestName): VariantKey {
  if (typeof window === 'undefined') return 'a';

  const test = AB_TESTS[testName];
  if (!test.enabled) return 'a';

  const storageKey = `${STORAGE_PREFIX}${testName}`;
  const stored = sessionStorage.getItem(storageKey) as VariantKey | null;

  if (stored === 'a' || stored === 'b') return stored;

  // First visit — assign randomly
  const assigned: VariantKey = Math.random() < 0.5 ? 'a' : 'b';
  sessionStorage.setItem(storageKey, assigned);

  // Fire assignment event once
  track('ab_variant_assigned', {
    test_name: testName,
    variant: assigned,
  });

  return assigned;
}

/**
 * Returns the content for the active variant of a test.
 */
export function getVariantContent<T>(testName: TestName): T {
  const variant = getVariant(testName);
  return (AB_TESTS[testName].variants as Record<VariantKey, T>)[variant];
}

/**
 * Track a conversion event attributed to the current variant.
 * Call this when a tracked action occurs (e.g. CTA click, intake start).
 */
export function trackAbConversion(testName: TestName, conversionEvent: string) {
  const variant = getVariant(testName);
  track('ab_conversion', {
    test_name: testName,
    variant,
    conversion_event: conversionEvent,
  });
}
