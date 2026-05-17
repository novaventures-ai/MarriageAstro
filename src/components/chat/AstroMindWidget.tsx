import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useGeminiChat } from '../../hooks/useGeminiChat';
import { CompatibilityReport } from '@types';
import { getReportContext } from '@lib/ai/context';
import { useUserProfileStore } from '../../store/useUserProfileStore';

interface AstroMindWidgetProps {
    report: CompatibilityReport;
}

export const AstroMindWidget: React.FC<AstroMindWidgetProps> = ({ report }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const reportContext = React.useMemo(() => getReportContext(report), [report]);
    const { messages, sendMessage, loading, error, clearChat } = useGeminiChat(reportContext);
    const { aiProvider, setAiProvider } = useUserProfileStore();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        await sendMessage(userMsg);
    };

    return (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end pointer-events-none safe-area-x">

            {/* CHAT WINDOW - Mobile Optimized */}
            {isOpen && (
                <div className="mb-3 sm:mb-4 w-[calc(100vw-2rem)] max-w-[380px] sm:w-[400px] h-[60vh] sm:h-[500px] max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 rounded-t-2xl flex items-center justify-between text-white shrink-0 gap-2 border-b border-white/10 shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="p-1 sm:p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-xs sm:text-sm">AstroMind AI</h3>
                                <p className="text-[9px] sm:text-[10px] text-indigo-100/85 flex items-center gap-1 font-medium">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    Active: {aiProvider === 'anthropic' ? 'Claude' : 'Gemini'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Nano AI Toggle Selector */}
                            <div className="flex items-center gap-0.5 bg-black/45 p-0.5 rounded-lg border border-white/10 backdrop-blur-md">
                                <button
                                    onClick={() => setAiProvider('gemini')}
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold transition-all ${
                                        aiProvider === 'gemini'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                    title="Google Gemini"
                                >
                                    G
                                </button>
                                <button
                                    onClick={() => setAiProvider('anthropic')}
                                    className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold transition-all ${
                                        aiProvider === 'anthropic'
                                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                                            : 'text-gray-400 hover:text-white'
                                    }`}
                                    title="Anthropic Claude"
                                >
                                    C
                                </button>
                            </div>

                            <button
                                onClick={clearChat}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                title="Clear Chat"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50 dark:bg-gray-900/50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm shadow-sm ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                                        }`}
                                >
                                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                                        <ReactMarkdown
                                            components={{
                                                ul: ({ node, ...props }) => <ul {...props} className="text-left list-disc pl-3 sm:pl-4 my-1" />,
                                                p: ({ node, ...props }) => <p {...props} className="mb-1 last:mb-0" />,
                                                strong: ({ node, ...props }) => <span className="text-indigo-600 dark:text-indigo-400 font-extrabold" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Stars speaking via {aiProvider === 'anthropic' ? 'Claude' : 'Gemini'}...</span>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex justify-center my-2">
                                <div className="bg-red-50 text-red-600 text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 border border-red-100">
                                    <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    {error}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-2 sm:p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-2xl shrink-0">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Ask ${aiProvider === 'anthropic' ? 'Claude' : 'Gemini'} about compatibility...`}
                                className="w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-inner outline-none"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-1.5 sm:right-2 p-1.5 sm:p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                            >
                                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-center text-gray-400 mt-1.5 sm:mt-2">
                            AstroMind AI can make mistakes. Verify critical info.
                        </p>
                    </form>
                </div>
            )}

            {/* FAB BUTTON - Mobile Optimized */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto p-3 sm:p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 group relative ${isOpen
                    ? 'bg-gray-800 dark:bg-gray-700 text-white rotate-90'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 sm:w-8 sm:h-8" />
                ) : (
                    <>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping" />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white" />
                        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                    </>
                )}

                {/* Tooltip - Hidden on mobile */}
                {!isOpen && (
                    <span className="hidden sm:block absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Ask AstroMind AI
                    </span>
                )}
            </button>

        </div>
    );
};

export default AstroMindWidget;
