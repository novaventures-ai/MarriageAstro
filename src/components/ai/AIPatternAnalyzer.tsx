import React, { useState } from 'react';
import { Sparkles, Brain, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { RelationshipPattern } from '@lib/relationshipPatternCalculations';
import { generatePrompt } from '@lib/ai/prompts';
import { checkAIConfig } from '@lib/ai/geminiClient';
import { checkAnthropicConfig } from '@lib/ai/anthropicClient';
import { getAIModel } from '@lib/ai/clientSelector';
import { useUserProfileStore } from '@store/useUserProfileStore';
import ReactMarkdown from 'react-markdown';

interface AIPatternAnalyzerProps {
    patterns: RelationshipPattern[];
    profileName: string;
}

export const AIPatternAnalyzer: React.FC<AIPatternAnalyzerProps> = ({ patterns, profileName }) => {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { aiProvider, setAiProvider } = useUserProfileStore();
    const hasApiKey = aiProvider === 'anthropic' ? checkAnthropicConfig() : checkAIConfig();

    const generateInsight = async () => {
        if (!hasApiKey) {
            setError(`${aiProvider === 'anthropic' ? 'Anthropic Claude' : 'Google Gemini'} API Key is missing. Please add VITE_${aiProvider === 'anthropic' ? 'ANTHROPIC' : 'GEMINI'}_API_KEY to your .env file.`);
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
            const model = getAIModel(`You are a Psychological Analyst specializing in relationship behaviors.
Your goal is to explain "Why this happens" and "What it looks like in real life" to the user, based on their astrological nodes and houses.
Avoid dry astrology jargon. Speak in terms of modern psychology, attachment theory, subconscious drivers, and relationship habits.`);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setInsight(text);
        } catch (err: any) {
            console.error("AI Generation Error:", err instanceof Error ? err.message : 'Unknown error');
            setError(`Failed to generate: ${err.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    if (patterns.length === 0) return null;

    return (
        <div className="mt-6 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-6 border border-slate-800/80 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-24 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-800/80 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20">
                        <Brain className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                        <span className="font-bold text-slate-100 text-base">Psychological Attachment Profile</span>
                        <p className="text-slate-400 text-xs mt-0.5">Behavioral explanation and subconscious relationship drivers</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                    {/* Sleek Toggle Pill Selector */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 backdrop-blur-md shadow-inner">
                        <button
                            onClick={() => {
                                setAiProvider('gemini');
                                setError(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                                aiProvider === 'gemini'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            Gemini 2.5
                        </button>
                        <button
                            onClick={() => {
                                setAiProvider('anthropic');
                                setError(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                                aiProvider === 'anthropic'
                                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            Claude 3.5
                        </button>
                    </div>

                    {insight && (
                        <button
                            onClick={generateInsight}
                            disabled={loading}
                            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-50"
                            title="Regenerate analysis"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            {!insight ? (
                <div className="flex flex-col items-center justify-center text-center py-6 relative z-10">
                    <h3 className="text-base font-bold text-slate-200 mb-2">Want a Deep Behavioral Dive?</h3>
                    <p className="text-slate-400 text-xs mb-5 max-w-md leading-relaxed">
                        Get a highly personalized psychological breakdown of these relationship patterns, attachments, and realistic scenarios of how they manifest.
                    </p>

                    {!hasApiKey ? (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col items-center gap-2 max-w-sm mb-4 text-amber-200/90">
                            <div className="flex items-center gap-2 font-bold text-xs text-white">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                <span>API Key Missing</span>
                            </div>
                            <p className="text-[10px] text-center leading-normal text-slate-300/80">
                                To analyze this pattern with {aiProvider === 'anthropic' ? 'Claude' : 'Gemini'}, please configure <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">VITE_{aiProvider === 'anthropic' ? 'ANTHROPIC' : 'GEMINI'}_API_KEY</code> in your environment.
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={generateInsight}
                            disabled={loading}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed ${
                                aiProvider === 'anthropic'
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black shadow-orange-500/10'
                                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-500/10'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Decoding patterns...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-4 h-4" />
                                    Decode with AI
                                </>
                            )}
                        </button>
                    )}

                    {error && (
                        <div className="mt-4 flex items-start gap-2 text-red-300 text-xs bg-red-950/40 border border-red-900/35 px-4 py-2 rounded-xl max-w-md">
                            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                            <span className="leading-relaxed">{error}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 bg-black/20 p-5 rounded-xl border border-white/5 shadow-inner">
                    <div className="prose prose-invert prose-xs max-w-none text-slate-300 leading-relaxed space-y-4">
                        <ReactMarkdown
                            components={{
                                h3: ({ node, ...props }) => <h3 className="text-xs font-bold text-rose-300/90 mt-4 mb-2 flex items-center gap-1.5" {...props} />,
                                strong: ({ node, ...props }) => <span className="text-rose-200 font-extrabold" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-2 text-slate-300" {...props} />,
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
