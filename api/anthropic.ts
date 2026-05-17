import { IncomingMessage, ServerResponse } from 'http';

// Rate limiting: simple in-memory store (resets per cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }

    entry.count++;
    return entry.count > RATE_LIMIT;
}

export default async function handler(req: any, res: any) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting by IP
    const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    if (isRateLimited(clientIp)) {
        return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
    }

    try {
        const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Anthropic API key not configured on server' });
        }

        const { prompt, systemInstruction } = req.body;

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid prompt' });
        }

        if (prompt.length > 50000) {
            return res.status(400).json({ error: 'Prompt too long (max 50000 chars)' });
        }

        // Call Anthropic API natively via standard fetch
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4096,
                system: systemInstruction || undefined,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7
            })
        });

        if (!anthropicResponse.ok) {
            const errorJson = await anthropicResponse.json().catch(() => ({}));
            const errMsg = errorJson?.error?.message || `Anthropic API returned status ${anthropicResponse.status}`;
            console.error('Anthropic API error response:', errorJson);
            return res.status(anthropicResponse.status).json({ error: errMsg });
        }

        const data = await anthropicResponse.json() as any;
        const text = data?.content?.[0]?.text || '';

        return res.status(200).json({ text });
    } catch (err: any) {
        console.error('Anthropic proxy error:', err);

        if (err.message?.includes('429')) {
            return res.status(429).json({ error: 'AI quota exceeded. Please try again later.' });
        }

        return res.status(500).json({
            error: err.message || 'AI generation failed. Please try again.',
        });
    }
}
