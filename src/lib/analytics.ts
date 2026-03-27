/**
 * Analytics — PostHog integration
 *
 * Initializes PostHog when VITE_POSTHOG_KEY is set.
 * All calls are no-ops when the key is absent (dev / staging without analytics).
 *
 * To activate: set VITE_POSTHOG_KEY in Vercel env vars.
 */

import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string | undefined || 'https://app.posthog.com';
const analyticsEnabled = Boolean(POSTHOG_KEY) && import.meta.env.PROD;

export function initAnalytics() {
  if (!analyticsEnabled) return;
  posthog.init(POSTHOG_KEY!, {
    api_host: POSTHOG_HOST,
    capture_pageview: false, // We'll capture manually with trackPageView
    autocapture: true,
    persistence: 'localStorage+cookie',
    // Don't send analytics in test environments
    loaded(ph) {
      if (import.meta.env.DEV) ph.opt_out_capturing();
    },
  });
}

// ─── User Identity ───────────────────────────────────────────────────────────

export function identifyUser(userId: string, properties?: { email?: string; plan?: string }) {
  if (!analyticsEnabled) return;
  posthog.identify(userId, properties);
}

export function resetUser() {
  if (!analyticsEnabled) return;
  posthog.reset();
}

// ─── Page Tracking ───────────────────────────────────────────────────────────

export function trackPageView(pageName?: string) {
  if (!analyticsEnabled) return;
  posthog.capture('$pageview', pageName ? { page: pageName } : undefined);
}

// ─── Event Tracking ──────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | 'chart_generated'
  | 'report_viewed'
  | 'section_unlock_attempted'
  | 'section_unlock_completed'
  | 'payment_initiated'
  | 'payment_completed'
  | 'payment_cancelled'
  | 'ai_query_sent'
  | 'ai_response_received'
  | 'user_signed_up'
  | 'user_signed_in'
  | 'user_signed_out'
  | 'premium_upgraded'
  | 'partner_added'
  | 'demo_started'
  | 'pricing_modal_opened';

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (!analyticsEnabled) {
    if (import.meta.env.DEV) console.debug('[Analytics]', event, properties);
    return;
  }
  posthog.capture(event, properties);
}

export function setUserProperties(properties: Record<string, unknown>) {
  if (!analyticsEnabled) return;
  posthog.people.set(properties);
}

export { analyticsEnabled };
