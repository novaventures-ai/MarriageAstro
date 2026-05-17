import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

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
        const { provider, prompt, systemInstruction } = req.body;

        if (!provider || (provider !== 'gemini' && provider !== 'anthropic')) {
            return res.status(400).json({ error: 'Missing or invalid provider' });
        }

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid prompt' });
        }

        if (prompt.length > 50000) {
            return res.status(400).json({ error: 'Prompt too long (max 50000 chars)' });
        }

        if (provider === 'gemini') {
            const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                return res.status(500).json({ error: 'Gemini API key not configured on server' });
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                systemInstruction: systemInstruction || undefined,
                generationConfig: {
                    maxOutputTokens: 8192,
                    temperature: 0.7,
                },
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ],
            });

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            return res.status(200).json({ text });
        } else {
            const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
            if (!apiKey) {
                return res.status(500).json({ error: 'Anthropic API key not configured on server' });
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
        }
    } catch (err: any) {
        console.error('AI proxy error:', err);

        if (err.message?.includes('429')) {
            return res.status(429).json({ error: 'AI quota exceeded. Please try again later.' });
        }

        return res.status(500).json({
            error: err.message || 'AI generation failed. Please try again.',
        });
    }
}
