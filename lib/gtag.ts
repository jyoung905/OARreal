export const GA_CONVERSION_ID = 'AW-XXXXXXXXXX';
export const GA_CONVERSION_LABEL = 'YYYYYYYYYYYYY';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function fireFormConversion() {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'conversion', {
    send_to: `${GA_CONVERSION_ID}/${GA_CONVERSION_LABEL}`,
  });
}
