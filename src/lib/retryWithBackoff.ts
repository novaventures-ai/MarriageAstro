/**
 * Retry utility with exponential backoff
 * Use for transient failures in Supabase/network calls
 */

interface RetryOptions {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    retryOn?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
    retryOn: (error: Error) => {
        const msg = error.message.toLowerCase();
        // Retry on network errors, timeouts, and 5xx server errors
        return (
            msg.includes('fetch') ||
            msg.includes('network') ||
            msg.includes('timeout') ||
            msg.includes('502') ||
            msg.includes('503') ||
            msg.includes('504')
        );
    },
};

export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    options?: RetryOptions
): Promise<T> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));

            if (attempt === opts.maxRetries || !opts.retryOn(err)) {
                throw err;
            }

            const delay = Math.min(
                opts.baseDelayMs * Math.pow(2, attempt),
                opts.maxDelayMs
            );
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error('Unexpected: exhausted retries');
}
