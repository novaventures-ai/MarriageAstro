/**
 * AI Client Selector
 *
 * Gemini is the only supported AI provider. This indirection is kept so call
 * sites stay stable if another provider is ever reintroduced.
 */

import { getGeminiModel } from './geminiClient.js';

export function getAIModel(systemInstruction?: string) {
    return getGeminiModel(systemInstruction);
}
