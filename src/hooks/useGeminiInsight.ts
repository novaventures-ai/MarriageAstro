import { useState, useCallback } from 'react';
import { getAIModel } from '../../lib/ai/clientSelector';
import { SYSTEM_PROMPTS, generatePrompt, InsightType } from '../../lib/ai/prompts';
import { useUserProfileStore } from '../store/useUserProfileStore';

interface UseGeminiInsightResult {
    loading: boolean;
    error: string | null;
    insight: string | null;
    triggerAnalysis: (type: InsightType, context: any) => Promise<void>;
    reset: () => void;
    aiLimited: boolean;
}

export const useGeminiInsight = (): UseGeminiInsightResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [insight, setInsight] = useState<string | null>(null);
    const [aiLimited, setAiLimited] = useState(false);

    const triggerAnalysis = useCallback(async (type: InsightType, context: any) => {
        // Check AI credits
        const state = useUserProfileStore.getState();
        const isPremium = state.isAdmin || state.planTier === 'premium' || state.planTier === 'astrologer';
        if (!isPremium && state.aiCreditsRemaining <= 0) {
            setAiLimited(true);
            setError("You've used all 3 free AI queries today. Upgrade to Premium for unlimited AI insights.");
            return;
        }

        setLoading(true);
        setError(null);
        setInsight(null);
        setAiLimited(false);

        try {
            // 1. Select the correct System Prompt (Persona)
            const systemInstruction = SYSTEM_PROMPTS[type];

            // 2. Generate the User Prompt based on context
            const userPrompt = generatePrompt(type, context);

            if (!userPrompt) {
                throw new Error(`Invalid prompt type: ${type}`);
            }

            // 3. Call AI Model (Gemini or Claude)
            const model = getAIModel(systemInstruction);
            const result = await model.generateContent(userPrompt);
            const output = result.response.text();

            setInsight(output);

            // Deduct AI credit for free users
            if (!isPremium) {
                useUserProfileStore.getState().useAiCredit();
            }
        } catch (err: any) {
            console.error("Gemini Insight Error:", err instanceof Error ? err.message : 'Unknown error');
            // Nice user-facing error message
            if (err.message.includes('SAFETY')) {
                setError("Analysis blocked by safety filters. Please try a less sensitive context.");
            } else if (err.message.includes('429')) {
                setError("AI is busy. Please try again in a moment.");
            } else {
                setError(err.message || "Failed to generate insight.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setInsight(null);
        setAiLimited(false);
    }, []);

    return { loading, error, insight, triggerAnalysis, reset, aiLimited };
};
