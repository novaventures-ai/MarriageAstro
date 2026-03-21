/**
 * useSelfAI Hook
 * Hook for AI-powered insights in Self Mode
 */

import { useState, useCallback } from 'react';
import { getGeminiModel } from '../../lib/ai/geminiClient';
import { SELF_SYSTEM_PROMPTS, generateSelfPrompt, SelfAIType } from '../../lib/ai/selfPrompts';
import { SelfAnalysisReport } from '../types/selfAnalysis';
import { Chart } from '../types';

interface UseSelfAIResult {
  loading: boolean;
  error: string | null;
  insight: string | null;
  generateInsight: (type: SelfAIType) => Promise<void>;
  reset: () => void;
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

  const generateInsight = useCallback(async (type: SelfAIType) => {
    setLoading(true);
    setError(null);
    setInsight(null);

    try {
      // 1. Get the appropriate system prompt
      const systemInstruction = SELF_SYSTEM_PROMPTS[type];

      // 2. Generate user prompt with context
      const userPrompt = generateSelfPrompt(type, selfReport, partnerChart);

      // 3. Call Gemini
      const model = getGeminiModel(systemInstruction);
      const result = await model.generateContent(userPrompt);
      const output = result.response.text();

      setInsight(output);
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
  }, []);

  return { loading, error, insight, generateInsight, reset };
};

export default useSelfAI;
