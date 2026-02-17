import React, { useState } from 'react';
import { Sparkles, Brain, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { CompatibilityReport } from '@types';
import { processReportForAI } from '@lib/ai/contextProcessor';
import { generateVerdictPrompt, SYSTEM_PROMPTS } from '@lib/ai/prompts';
import { getGeminiModel, checkAIConfig } from '@lib/ai/geminiClient';
import ReactMarkdown from 'react-markdown';

interface AIVerdictGeneratorProps {
    report: CompatibilityReport;
}

export const AIVerdictGenerator: React.FC<AIVerdictGeneratorProps> = ({ report }) => {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasApiKey = checkAIConfig();

    const generateInsight = async () => {
        if (!hasApiKey) {
            setError("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const context = processReportForAI(report);
            const prompt = generateVerdictPrompt(context);

            // Pass the System Instruction here
            const model = getGeminiModel(SYSTEM_PROMPTS.GLOBAL_VERDICT);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setInsight(text);
        } catch (err: any) {
            console.error("AI Generation Error:", err);
            const errorMessage = err.message || "Unknown error";
            setError(`Failed to generate: ${errorMessage}. Please check your key or quota.`);
        } finally {
            setLoading(false);
        }
    };

    if (!hasApiKey) {
        return (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-gray-500">
                    <Brain className="w-6 h-6" />
                    <p className="text-sm">AI features disabled (Missing API Key)</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-2xl shadow-xl overflow-hidden text-white relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${loading ? 'bg-indigo-500/20 animate-pulse' : 'bg-white/10'}`}>
                            <Sparkles className={`w-6 h-6 ${loading ? 'text-indigo-300' : 'text-yellow-300'}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Gemini Astrologer</h3>
                            <p className="text-indigo-200 text-sm">AI-Synthesized Global Verdict</p>
                        </div>
                    </div>

                    {!insight && !loading && (
                        <button
                            onClick={generateInsight}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-900 rounded-lg font-bold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Brain className="w-4 h-4" />
                            Analyze Triggers
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-100 mb-4 animate-in fade-in slide-in-from-top-2">
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                        <div className="h-4 bg-white/5 rounded w-full"></div>
                        <div className="h-4 bg-white/5 rounded w-5/6"></div>
                    </div>
                )}

                {insight && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{insight}</ReactMarkdown>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                            <button
                                onClick={generateInsight}
                                className="flex items-center gap-2 text-xs text-indigo-300 hover:text-white transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Regenerate Analysis
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
