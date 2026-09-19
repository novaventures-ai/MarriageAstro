import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import { initErrorMonitoring } from './lib/errorMonitoring'
import { initAnalytics } from './lib/analytics'
// Vercel Web Analytics: pageviews, referrers and countries, with no account to
// configure. It is what makes an acquisition question answerable — the first
// international customer's origin could not be recovered because nothing was
// recording it. PostHog (src/lib/analytics.ts) covers funnels and identified
// users and stays dormant until VITE_POSTHOG_KEY is set; the two do not clash.
import { Analytics } from '@vercel/analytics/react'
import './index.css'

// Initialize observability before rendering
initErrorMonitoring();
initAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
      <Analytics />
    </HelmetProvider>
  </React.StrictMode>,
)
