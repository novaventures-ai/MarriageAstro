/**
 * AI Dynamic Client Selector
 *
 * Dynamically selects between Gemini and Anthropic Claude based on the user's preference
 * stored in the Zustand store.
 */

import { getGeminiModel } from './geminiClient';
import { getAnthropicModel } from './anthropicClient';
import { useUserProfileStore } from '../../src/store/useUserProfileStore';

export function getAIModel(systemInstruction?: string) {
    const provider = useUserProfileStore.getState().aiProvider || 'gemini';
    return provider === 'anthropic' 
        ? getAnthropicModel(systemInstruction) 
        : getGeminiModel(systemInstruction);
}
