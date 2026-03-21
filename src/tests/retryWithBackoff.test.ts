import { describe, it, expect, vi } from 'vitest';
import { retryWithBackoff } from '../lib/retryWithBackoff';

describe('retryWithBackoff', () => {
    it('should return result on first success', async () => {
        const fn = vi.fn().mockResolvedValue('success');
        const result = await retryWithBackoff(fn);

        expect(result).toBe('success');
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on network errors', async () => {
        const fn = vi.fn()
            .mockRejectedValueOnce(new Error('fetch failed'))
            .mockResolvedValue('recovered');

        const result = await retryWithBackoff(fn, { baseDelayMs: 10 });

        expect(result).toBe('recovered');
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should throw after max retries', async () => {
        const fn = vi.fn().mockRejectedValue(new Error('network error'));

        await expect(
            retryWithBackoff(fn, { maxRetries: 2, baseDelayMs: 10 })
        ).rejects.toThrow('network error');

        expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it('should not retry on non-retryable errors', async () => {
        const fn = vi.fn().mockRejectedValue(new Error('invalid input'));

        await expect(
            retryWithBackoff(fn, { baseDelayMs: 10 })
        ).rejects.toThrow('invalid input');

        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should respect custom retryOn function', async () => {
        const fn = vi.fn()
            .mockRejectedValueOnce(new Error('custom retry'))
            .mockResolvedValue('ok');

        const result = await retryWithBackoff(fn, {
            baseDelayMs: 10,
            retryOn: (err) => err.message.includes('custom'),
        });

        expect(result).toBe('ok');
        expect(fn).toHaveBeenCalledTimes(2);
    });
});
