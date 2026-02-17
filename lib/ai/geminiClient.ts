import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini Client
// WARNING: In production, API calls should go through a backend proxy to hide the key.
// For MVP/Demo, we use the client-side key from .env.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('Missing VITE_GEMINI_API_KEY in .env file. AI features will be disabled.');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// Use a lightweight model for speed, or Pro for complex reasoning
export const getGeminiModel = (systemInstruction?: string) => {
    return genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction,
        generationConfig: {
            maxOutputTokens: 4000,
            temperature: 0.7,
        },
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
    });
};

export const checkAIConfig = () => !!API_KEY;
