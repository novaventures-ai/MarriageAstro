import { useState, useCallback } from 'react';
import { getGeminiModel } from '../../lib/ai/geminiClient';
import { SYSTEM_PROMPTS, generatePrompt, InsightType } from '../../lib/ai/prompts';

interface UseGeminiInsightResult {
    loading: boolean;
    error: string | null;
    insight: string | null;
    triggerAnalysis: (type: InsightType, context: any) => Promise<void>;
    reset: () => void;
}

export const useGeminiInsight = (): UseGeminiInsightResult => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [insight, setInsight] = useState<string | null>(null);

    const triggerAnalysis = useCallback(async (type: InsightType, context: any) => {
        setLoading(true);
        setError(null);
        setInsight(null);

        try {
            // 1. Select the correct System Prompt (Persona)
            const systemInstruction = SYSTEM_PROMPTS[type];

            // 2. Generate the User Prompt based on context
            const userPrompt = generatePrompt(type, context);

            if (!userPrompt) {
                throw new Error(`Invalid prompt type: ${type}`);
            }

            // 3. Call Gemini
            const model = getGeminiModel(systemInstruction);
            const result = await model.generateContent(userPrompt);
            const output = result.response.text();

            setInsight(output);
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
    }, []);

    return { loading, error, insight, triggerAnalysis, reset };
};
