/**
 * Fires a pageview on every route change.
 *
 * analytics.ts initialises PostHog with `capture_pageview: false` and a comment
 * saying pageviews are captured manually — but nothing ever called
 * trackPageView. So PostHog would have recorded clicks and sign-ins and not a
 * single pageview, which makes every funnel question unanswerable: you cannot
 * ask "how many who saw a report hit the paywall" without the denominator.
 *
 * Automatic capture is not an option for this app: it is a client-routed SPA,
 * so the browser only ever loads one document and PostHog would see one
 * pageview per session no matter how many screens the visitor moved through.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

export const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // The path alone; query strings can carry birth details and report keys.
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};
