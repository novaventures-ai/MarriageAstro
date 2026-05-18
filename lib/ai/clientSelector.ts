/**
 * AI Dynamic Client Selector
 *
 * Dynamically selects between Gemini and Anthropic Claude based on the user's preference
 * stored in the Zustand store.
 */

import { getGeminiModel } from './geminiClient.js';
import { getAnthropicModel } from './anthropicClient.js';
import { useUserProfileStore } from '../../src/store/useUserProfileStore.js';

export function getAIModel(systemInstruction?: string) {
    const provider = useUserProfileStore.getState().aiProvider || 'gemini';
    return provider === 'anthropic' 
        ? getAnthropicModel(systemInstruction) 
        : getGeminiModel(systemInstruction);
}
