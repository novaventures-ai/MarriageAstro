/**
 * useSelfAI Hook
 * Hook for AI-powered insights in Self Mode
 */

import { useState, useCallback } from 'react';
import { getAIModel } from '../../lib/ai/clientSelector';
import { SELF_SYSTEM_PROMPTS, generateSelfPrompt, SelfAIType } from '../../lib/ai/selfPrompts';
import { SelfAnalysisReport } from '../types/selfAnalysis';
import { Chart } from '../types';
import { useUserProfileStore } from '../store/useUserProfileStore';

interface UseSelfAIResult {
  loading: boolean;
  error: string | null;
  insight: string | null;
  generateInsight: (type: SelfAIType, question?: string) => Promise<void>;
  reset: () => void;
  aiLimited: boolean;
}

/**
 * Hook for generating AI insights for self analysis
 */
export const useSelfAI = (
  selfReport: SelfAnalysisReport,
  partnerChart?: Chart
): UseSelfAIResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [aiLimited, setAiLimited] = useState(false);

  const generateInsight = useCallback(async (type: SelfAIType, question?: string) => {
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
      // 1. Get the appropriate system prompt
      const systemInstruction = SELF_SYSTEM_PROMPTS[type];

      // 2. Generate user prompt with context (now including question)
      const userPrompt = generateSelfPrompt(type, selfReport, partnerChart, question);

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
      console.error('Self AI Insight Error:', err instanceof Error ? err.message : 'Unknown error');

      // Handle specific errors
      if (err.message?.includes('SAFETY')) {
        setError('Analysis blocked by safety filters. Please try a different question.');
      } else if (err.message?.includes('429')) {
        setError('AI is busy. Please try again in a moment.');
      } else if (err.message?.includes('quota')) {
        setError('AI quota exceeded. Please try again later.');
      } else {
        setError(err.message || 'Failed to generate insight.');
      }
    } finally {
      setLoading(false);
    }
  }, [selfReport, partnerChart]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setInsight(null);
    setAiLimited(false);
  }, []);

  return { loading, error, insight, generateInsight, reset, aiLimited };
};

export default useSelfAI;
