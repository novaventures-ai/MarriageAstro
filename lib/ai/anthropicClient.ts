/**
 * Anthropic AI Client
 *
 * Mirroring the Gemini AI Client interface:
 * In production: calls the serverless proxy at /api/anthropic (API key stays server-side).
 * In development: falls back to direct client-side calls if VITE_ANTHROPIC_API_KEY is set.
 */

const CLIENT_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const IS_PRODUCTION = import.meta.env.PROD;

// Use proxy in production, or when no client key is available
const USE_PROXY = IS_PRODUCTION || !CLIENT_API_KEY;

/**
 * Call Anthropic via the serverless proxy with retry logic
 */
async function callProxy(prompt: string, systemInstruction?: string, retries = 3): Promise<string> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider: 'anthropic', prompt, systemInstruction }),
            });

            if (response.status === 429) {
                if (attempt < retries - 1) {
                    await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
                    continue;
                }
                throw new Error('429: Too many requests. Please try again in a moment.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            return data.text;
        } catch (err: any) {
            if (attempt === retries - 1) throw err;
            if (err.message?.includes('fetch') || err.message?.includes('network')) {
                await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
                continue;
            }
            throw err;
        }
    }
    throw new Error('Max retries exceeded');
}

/**
 * Direct client-side Anthropic call (development only)
 */
async function callDirect(prompt: string, systemInstruction?: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': CLIENT_API_KEY || '',
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'dangerously-allow-developer-only-browser-access': 'true' // needed for client-side testing
        } as any,
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4096,
            system: systemInstruction || undefined,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `Anthropic returned status ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
}

/**
 * Generate content using Anthropic Claude AI
 * Routes through serverless proxy in production, direct in development
 */
export async function generateAnthropicContent(prompt: string, systemInstruction?: string): Promise<string> {
    if (USE_PROXY) {
        return callProxy(prompt, systemInstruction);
    }
    return callDirect(prompt, systemInstruction);
}

/**
 * Interface-compatible model generator for easy switching
 */
export const getAnthropicModel = (systemInstruction?: string) => {
    return {
        generateContent: async (prompt: string) => {
            const text = await generateAnthropicContent(prompt, systemInstruction);
            return {
                response: {
                    text: () => text,
                },
            };
        },
    };
};

export const checkAnthropicConfig = () => USE_PROXY || !!CLIENT_API_KEY;
