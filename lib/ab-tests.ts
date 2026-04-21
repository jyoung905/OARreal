/**
 * OAR A/B Testing — simple, bulletproof implementation
 * 50/50 variant assignment, stable per session via sessionStorage.
 * All calls are SSR-safe (window guard everywhere).
 */

import { track } from './analytics';

export type VariantKey = 'a' | 'b';
export type TestName = 'hero_cta' | 'hero_subhead' | 'trust_strip';

interface ABTest {
  name: TestName;
  enabled: boolean;
  variants: { a: unknown; b: unknown };
}

const AB_TESTS: Record<TestName, ABTest> = {
  hero_cta: {
    name: 'hero_cta',
    enabled: true,
    variants: {
      a: 'Get My Free Claim Review',
      b: 'Check What May Apply to My Claim',
    },
  },
  hero_subhead: {
    name: 'hero_subhead',
    enabled: true,
    variants: {
      a: 'In about 2 minutes, tell us what happened. We review your situation and, if it fits our criteria, reach out with plain-language guidance on benefits, deadlines, and next steps \u2014 at no cost.',
      b: 'Get a plain-language Ontario accident claim review so you can understand your benefits, deadlines, and next steps before making any decisions.',
    },
  },
  trust_strip: {
    name: 'trust_strip',
    enabled: true,
    variants: {
      a: ['Free', 'Confidential', 'No obligation', '~2 min'],
      b: ['Free', 'Confidential', 'Reviewed by a licensed Ontario professional', '~2 min'],
    },
  },
};

const STORAGE_PREFIX = 'oar_ab_';

export function getVariant(testName: TestName): VariantKey {
  try {
    if (typeof window === 'undefined') return 'a';
    const test = AB_TESTS[testName];
    if (!test || !test.enabled) return 'a';

    const storageKey = `${STORAGE_PREFIX}${testName}`;
    const stored = sessionStorage.getItem(storageKey);
    if (stored === 'a' || stored === 'b') return stored;

    const assigned: VariantKey = Math.random() < 0.5 ? 'a' : 'b';
    sessionStorage.setItem(storageKey, assigned);

    track('ab_variant_assigned', { test_name: testName, variant: assigned });

    return assigned;
  } catch {
    return 'a';
  }
}

export function getVariantContent<T = unknown>(testName: TestName): T {
  try {
    const variant = getVariant(testName);
    const test = AB_TESTS[testName];
    if (!test) return AB_TESTS.hero_cta.variants.a as T;
    return test.variants[variant] as T;
  } catch {
    return AB_TESTS[testName]?.variants.a as T;
  }
}

export function trackAbConversion(testName: TestName, conversionEvent: string): void {
  try {
    const variant = getVariant(testName);
    track('ab_conversion', { test_name: testName, variant, conversion_event: conversionEvent });
  } catch {
    // silent
  }
}
