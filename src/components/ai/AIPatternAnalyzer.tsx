import React, { useState } from 'react';
import { Target, Brain, RefreshCw, XCircle } from 'lucide-react';
import { RelationshipPattern } from '@lib/relationshipPatternCalculations';
import { generatePrompt } from '@lib/ai/prompts';
import { getGeminiModel, checkAIConfig } from '@lib/ai/geminiClient';
import ReactMarkdown from 'react-markdown';

interface AIPatternAnalyzerProps {
    patterns: RelationshipPattern[];
    profileName: string;
}

export const AIPatternAnalyzer: React.FC<AIPatternAnalyzerProps> = ({ patterns, profileName }) => {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasApiKey = checkAIConfig();

    const generateInsight = async () => {
        if (!hasApiKey) {
            setError("Gemini API Key is missing.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const context = {
                name: profileName,
                patterns: patterns
            };

            const prompt = generatePrompt('PATTERN_ANALYSIS', context);
            const model = getGeminiModel(`You are a Psychological Analyst specializing in relationship behaviors.
Your goal is to explain "Why this happens" and "What it looks like in real life".
Avoid astrology jargon. Speak in terms of psychology, habits, and subconscious drivers.`);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setInsight(text);
        } catch (err: any) {
            console.error("AI Generation Error:", err);
            setError(`Failed to generate: ${err.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    if (!hasApiKey) return null;

    if (patterns.length === 0) return null;

    return (
        <div className="mt-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-24 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {!insight ? (
                <div className="flex flex-col items-center justify-center text-center relative z-10">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Want a Deep Dive?</h3>
                    <p className="text-slate-400 text-sm mb-4 max-w-md">
                        Get a psychological breakdown of these patterns and realistic scenarios of how they might manifest.
                    </p>
                    <button
                        onClick={generateInsight}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Analyzing Psyche...
                            </>
                        ) : (
                            <>
                                <Brain className="w-4 h-4" />
                                Decode with AI
                            </>
                        )}
                    </button>
                    {error && (
                        <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-900/20 px-3 py-1 rounded-full">
                            <XCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative z-10 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                        <div className="flex items-center gap-2 text-rose-400">
                            <Brain className="w-5 h-5" />
                            <span className="font-semibold">Psychological Profile</span>
                        </div>
                        <button
                            onClick={generateInsight}
                            disabled={loading}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                            title="Regenerate"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed space-y-3">
                        <ReactMarkdown
                            components={{
                                strong: ({ node, ...props }) => <span className="text-rose-300 font-semibold" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />
                            }}
                        >
                            {insight}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};
