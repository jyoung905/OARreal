// TODO: Replace G-XXXXXXXXXX with your real GA4 Measurement ID before deploying
export const GA_ID = 'G-BJN974S0MR';

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', GA_ID, { page_path: url });
  }
};

export const event = (action: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
};
