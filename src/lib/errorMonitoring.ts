/**
 * Error Monitoring — Sentry integration
 *
 * Initializes Sentry when VITE_SENTRY_DSN is set.
 * Falls back to console + localStorage logging in development or when DSN is absent.
 *
 * To activate: set VITE_SENTRY_DSN in Vercel env vars.
 */

import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;
const IS_PROD = import.meta.env.PROD;
const sentryEnabled = Boolean(DSN);

// ─── Sentry Init ────────────────────────────────────────────────────────────

export function initErrorMonitoring() {
  if (sentryEnabled) {
    Sentry.init({
      dsn: DSN,
      environment: IS_PROD ? 'production' : 'development',
      release: import.meta.env.VITE_APP_VERSION || 'unknown',
      // Capture 10% of sessions for performance tracing (free tier friendly)
      tracesSampleRate: IS_PROD ? 0.1 : 0,
      // Only send errors in production by default
      beforeSend(event) {
        if (!IS_PROD) return null;
        return event;
      },
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: IS_PROD ? 1.0 : 0,
    });
    return;
  }

  // Fallback: capture to localStorage for local debugging
  const ERROR_LOG_KEY = 'astro_error_log';
  const MAX_STORED = 50;

  function storeError(message: string, stack?: string, context?: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      console.error('[ErrorMonitor]', message, context || '');
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
      stored.push({ message, stack, context, timestamp: new Date().toISOString(), url: window.location.href });
      if (stored.length > MAX_STORED) stored.splice(0, stored.length - MAX_STORED);
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(stored));
    } catch { /* storage full */ }
  }

  window.addEventListener('error', (ev) => {
    storeError(ev.message, ev.error?.stack, { source: 'window.onerror', filename: ev.filename, lineno: ev.lineno });
  });

  window.addEventListener('unhandledrejection', (ev) => {
    const err = ev.reason instanceof Error ? ev.reason : new Error(String(ev.reason));
    storeError(err.message, err.stack, { source: 'unhandledrejection' });
  });
}

// ─── Public API ─────────────────────────────────────────────────────────────

export function captureError(error: Error | string, context?: Record<string, unknown>) {
  const err = typeof error === 'string' ? new Error(error) : error;
  if (sentryEnabled) {
    Sentry.captureException(err, { extra: context });
  } else {
    console.error('[captureError]', err.message, context);
  }
}

export function setSentryUser(id: string, email?: string) {
  if (sentryEnabled) {
    Sentry.setUser({ id, email });
  }
}

export function clearSentryUser() {
  if (sentryEnabled) {
    Sentry.setUser(null);
  }
}

/** Wrap a component with Sentry error boundary (used in App.tsx) */
export const SentryErrorBoundary = sentryEnabled
  ? Sentry.withErrorBoundary
  : <P extends object>(Component: React.ComponentType<P>) => Component;

export { sentryEnabled };
