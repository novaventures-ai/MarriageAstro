/**
 * Gemini AI Client
 *
 * In production: calls the serverless proxy at /api/gemini (API key stays server-side).
 * In development: falls back to direct client-side calls if VITE_GEMINI_API_KEY is set.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const CLIENT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const IS_PRODUCTION = import.meta.env.PROD;

// Use proxy in production, or when no client key is available
const USE_PROXY = IS_PRODUCTION || !CLIENT_API_KEY;

/**
 * Call Gemini via the serverless proxy with retry logic
 */
async function callProxy(prompt: string, systemInstruction?: string, retries = 3): Promise<string> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider: 'gemini', prompt, systemInstruction }),
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
 * Direct client-side Gemini call (development only)
 */
function getDirectModel(systemInstruction?: string) {
    const genAI = new GoogleGenerativeAI(CLIENT_API_KEY || '');
    return genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction,
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
}

/**
 * Generate content using Gemini AI
 * Routes through serverless proxy in production, direct in development
 */
export async function generateAIContent(prompt: string, systemInstruction?: string): Promise<string> {
    if (USE_PROXY) {
        return callProxy(prompt, systemInstruction);
    }

    // Development: direct call
    const model = getDirectModel(systemInstruction);
    const result = await model.generateContent(prompt);
    return result.response.text();
}

/**
 * Legacy compatibility: returns a model-like object for existing code
 * @deprecated Use generateAIContent() directly instead
 */
export const getGeminiModel = (systemInstruction?: string) => {
    if (USE_PROXY) {
        // Return a proxy-compatible object matching the Gemini model interface
        return {
            generateContent: async (prompt: string) => {
                const text = await callProxy(prompt, systemInstruction);
                return {
                    response: {
                        text: () => text,
                    },
                };
            },
        };
    }

    return getDirectModel(systemInstruction);
};

export const checkAIConfig = () => USE_PROXY || !!CLIENT_API_KEY;
