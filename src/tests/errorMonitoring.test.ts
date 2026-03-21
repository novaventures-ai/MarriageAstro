import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });
Object.defineProperty(globalThis, 'window', {
    value: {
        location: { href: 'http://localhost:3001' },
        addEventListener: vi.fn(),
    },
    writable: true,
});
Object.defineProperty(globalThis, 'navigator', {
    value: { userAgent: 'test-agent' },
    writable: true,
});

// Force production mode so reportError stores to localStorage
vi.stubEnv('DEV', '');

// Must import after mocks are set up
const { captureError, getErrorLogs } = await import('../lib/errorMonitoring');

describe('Error Monitoring', () => {
    beforeEach(() => {
        localStorageMock.removeItem('astro_error_log');
        vi.stubEnv('DEV', '');
    });

    it('captureError should store errors in localStorage in production', () => {
        captureError('test error');
        const logs = getErrorLogs();
        expect(Array.isArray(logs)).toBe(true);
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[0].message).toBe('test error');
    });

    it('getErrorLogs should return empty array when no logs exist', () => {
        expect(getErrorLogs()).toEqual([]);
    });

    it('getErrorLogs should handle corrupted localStorage gracefully', () => {
        localStorageMock.setItem('astro_error_log', 'invalid json');
        expect(getErrorLogs()).toEqual([]);
    });
});
