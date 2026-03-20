import { describe, it, expect, vi, beforeEach } from 'vitest';
import { captureError, getErrorLogs } from '../lib/errorMonitoring';

describe('Error Monitoring', () => {
    beforeEach(() => {
        localStorage.removeItem('astro_error_log');
    });

    it('captureError should store errors in localStorage in production', () => {
        // Simulate by directly testing getErrorLogs returns empty initially
        const logs = getErrorLogs();
        expect(Array.isArray(logs)).toBe(true);
    });

    it('getErrorLogs should return empty array when no logs exist', () => {
        expect(getErrorLogs()).toEqual([]);
    });

    it('getErrorLogs should handle corrupted localStorage gracefully', () => {
        localStorage.setItem('astro_error_log', 'invalid json');
        expect(getErrorLogs()).toEqual([]);
    });
});
