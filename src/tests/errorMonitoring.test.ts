import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// The error-monitoring module is Sentry-based. With no VITE_SENTRY_DSN set
// (the default in the test environment), `sentryEnabled` is false and
// captureError falls back to console.error. These tests exercise that real,
// current behaviour — the previous suite tested a removed localStorage
// `getErrorLogs` API and no longer matched the module.

const { captureError, setSentryUser, clearSentryUser, initErrorMonitoring, sentryEnabled } =
    await import('../lib/errorMonitoring');

describe('Error Monitoring', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('runs with Sentry disabled when no DSN is configured', () => {
        expect(sentryEnabled).toBe(false);
    });

    it('captureError accepts a string and logs via the console fallback', () => {
        captureError('test error');
        expect(consoleErrorSpy).toHaveBeenCalled();
        const args = consoleErrorSpy.mock.calls.at(-1);
        expect(args?.join(' ')).toContain('test error');
    });

    it('captureError accepts an Error object without throwing', () => {
        expect(() => captureError(new Error('boom'), { where: 'unit-test' })).not.toThrow();
        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('setSentryUser / clearSentryUser are safe no-ops when Sentry is disabled', () => {
        expect(() => setSentryUser('user-123', 'user@example.com')).not.toThrow();
        expect(() => clearSentryUser()).not.toThrow();
    });

    it('initErrorMonitoring wires the fallback listeners without throwing', () => {
        // With no DSN, init registers window error listeners; provide a minimal
        // window stub so the fallback path can be exercised in a node env.
        const addEventListener = vi.fn();
        vi.stubGlobal('window', { addEventListener, location: { href: 'http://localhost/' } });
        expect(() => initErrorMonitoring()).not.toThrow();
        expect(addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
        expect(addEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
        vi.unstubAllGlobals();
    });
});
