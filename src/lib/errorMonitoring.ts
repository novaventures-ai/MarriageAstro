/**
 * Error Monitoring Utility
 *
 * Lightweight error tracking that captures unhandled errors and rejections.
 * Logs to console in development; in production, replace reportError()
 * with a service like Sentry, LogRocket, or Datadog.
 *
 * To upgrade to Sentry:
 *   1. npm install @sentry/react
 *   2. Replace initErrorMonitoring() with Sentry.init({ dsn: "..." })
 *   3. Replace reportError() with Sentry.captureException()
 */

interface ErrorEvent {
    message: string;
    stack?: string;
    context?: Record<string, unknown>;
    timestamp: string;
    url: string;
    userAgent: string;
}

const ERROR_LOG_KEY = 'astro_error_log';
const MAX_STORED_ERRORS = 50;

function reportError(error: ErrorEvent) {
    // In development: log to console
    if (import.meta.env.DEV) {
        console.error('[ErrorMonitor]', error.message, error.context || '');
        return;
    }

    // In production: store locally and could POST to an endpoint
    try {
        const stored = JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
        stored.push(error);

        // Keep only the most recent errors
        if (stored.length > MAX_STORED_ERRORS) {
            stored.splice(0, stored.length - MAX_STORED_ERRORS);
        }

        localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(stored));

        // TODO: Uncomment and configure when you have an error reporting endpoint
        // fetch('/api/errors', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(error),
        // }).catch(() => {});
    } catch {
        // Storage full or unavailable - silently fail
    }
}

function createErrorEvent(error: Error | string, context?: Record<string, unknown>): ErrorEvent {
    const err = typeof error === 'string' ? new Error(error) : error;
    return {
        message: err.message,
        stack: err.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
    };
}

/**
 * Initialize global error handlers
 * Call this once in main.tsx before rendering
 */
export function initErrorMonitoring() {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
        reportError(createErrorEvent(event.error || event.message, {
            source: 'window.onerror',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
        }));
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const error = event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason));

        reportError(createErrorEvent(error, {
            source: 'unhandledrejection',
        }));
    });

    if (import.meta.env.DEV) {
        console.log('[ErrorMonitor] Initialized (development mode)');
    }
}

/**
 * Manually capture an error with optional context
 */
export function captureError(error: Error | string, context?: Record<string, unknown>) {
    reportError(createErrorEvent(error, context));
}

/**
 * Get stored error logs (useful for debugging in production)
 */
export function getErrorLogs(): ErrorEvent[] {
    try {
        return JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || '[]');
    } catch {
        return [];
    }
}
