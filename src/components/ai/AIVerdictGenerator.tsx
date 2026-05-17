import React, { useState } from 'react';
import { Sparkles, Brain, AlertTriangle, RefreshCw, XCircle } from 'lucide-react';
import { CompatibilityReport } from '@types';
import { processReportForAI } from '@lib/ai/contextProcessor';
import { generateVerdictPrompt, SYSTEM_PROMPTS } from '@lib/ai/prompts';
import { checkAIConfig } from '@lib/ai/geminiClient';
import { checkAnthropicConfig } from '@lib/ai/anthropicClient';
import { getAIModel } from '@lib/ai/clientSelector';
import { useUserProfileStore } from '@store/useUserProfileStore';
import ReactMarkdown from 'react-markdown';

interface AIVerdictGeneratorProps {
    report: CompatibilityReport;
}

export const AIVerdictGenerator: React.FC<AIVerdictGeneratorProps> = ({ report }) => {
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
            const context = processReportForAI(report);
            const prompt = generateVerdictPrompt(context);

            // Pass the System Instruction here to the dynamically selected model
            const model = getAIModel(SYSTEM_PROMPTS.GLOBAL_VERDICT);

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setInsight(text);
        } catch (err: any) {
            console.error("AI Generation Error:", err instanceof Error ? err.message : 'Unknown error');
            const errorMessage = err.message || "Unknown error";
            setError(`Failed to generate: ${errorMessage}. Please check your key or quota.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 rounded-2xl shadow-2xl overflow-hidden text-white relative border border-white/10">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between w-full mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3.5 rounded-2xl ${loading ? 'bg-indigo-500/20 animate-pulse' : 'bg-white/5 border border-white/10'}`}>
                            <Sparkles className={`w-6 h-6 ${loading ? 'text-indigo-300 animate-spin' : 'text-yellow-400'}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                {aiProvider === 'anthropic' ? 'Claude Astrologer' : 'Gemini Astrologer'}
                            </h3>
                            <p className="text-indigo-200/70 text-sm font-medium">AI-Synthesized Global Relationship Verdict</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 self-start md:self-auto">
                        {/* Premium Toggle Selector with Glow */}
                        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl relative">
                            <button
                                onClick={() => {
                                    setAiProvider('gemini');
                                    setError(null);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                                    aiProvider === 'gemini'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105 border border-white/10'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                }`}
                                title="Switch to Google Gemini Engine"
                            >
                                <Brain className="w-3.5 h-3.5" />
                                Gemini 2.5
                            </button>
                            <button
                                onClick={() => {
                                    setAiProvider('anthropic');
                                    setError(null);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                                    aiProvider === 'anthropic'
                                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105 border border-white/10'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                }`}
                                title="Switch to Anthropic Claude Engine"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Claude 3.5
                            </button>
                        </div>

                        <button
                            onClick={generateInsight}
                            disabled={loading}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed ${
                                aiProvider === 'anthropic'
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold shadow-orange-500/20'
                                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-indigo-500/20'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Analyzing Charts...
                                </>
                            ) : insight ? (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Recalculate
                                </>
                            ) : (
                                <>
                                    <Brain className="w-4 h-4" />
                                    Synthesize Verdict
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {!hasApiKey && !insight && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4 text-amber-200/90 mb-4 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
                        <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 animate-bounce" />
                        <div className="space-y-1">
                            <h4 className="font-bold text-white text-sm">
                                API Key Required for {aiProvider === 'anthropic' ? 'Anthropic Claude' : 'Google Gemini'}
                            </h4>
                            <p className="text-xs text-indigo-200/70 leading-relaxed">
                                To use AI matching, you need to add your API keys. Please set <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300 border border-white/5 font-mono">VITE_{aiProvider === 'anthropic' ? 'ANTHROPIC' : 'GEMINI'}_API_KEY</code> in your local <code className="bg-black/40 px-1.5 py-0.5 rounded text-slate-300 font-mono">.env</code> configuration.
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/15 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3.5 text-red-200 mb-4 animate-in fade-in slide-in-from-top-3 duration-500">
                        <XCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
                        <p className="text-sm leading-relaxed">{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="space-y-4 animate-pulse py-4">
                        <div className="h-4.5 bg-white/10 rounded-full w-3/4"></div>
                        <div className="h-4 bg-white/5 rounded-full w-full"></div>
                        <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
                    </div>
                )}

                {insight && (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 mt-2 bg-black/20 p-5 md:p-6 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner">
                        <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed space-y-4">
                            <ReactMarkdown
                                components={{
                                    h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-300 mt-4 mb-2 flex items-center gap-1.5" {...props} />,
                                    strong: ({ node, ...props }) => <span className="text-indigo-200 font-extrabold" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-2 text-slate-300" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />
                                }}
                            >
                                {insight}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                            <button
                                onClick={generateInsight}
                                className="flex items-center gap-2 text-xs font-bold text-indigo-300/80 hover:text-white transition-colors"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Regenerate Analysis
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
