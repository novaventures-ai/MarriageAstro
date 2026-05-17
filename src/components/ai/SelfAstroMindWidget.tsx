/**
 * Self AstroMind Widget
 * AI chat widget for self analysis mode
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, Brain } from 'lucide-react';
import { SelfAnalysisReport, PartnerProfile } from '../../types/selfAnalysis';
import { useSelfAI } from '../../hooks/useSelfAI';
import { useUserProfileStore } from '../../store/useUserProfileStore';
import ReactMarkdown from 'react-markdown';

interface SelfAstroMindWidgetProps {
  report: SelfAnalysisReport;
  partners?: PartnerProfile[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const SelfAstroMindWidget: React.FC<SelfAstroMindWidgetProps> = ({
  report,
  partners = []
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${report.chart.name}! I'm AstroMind, your personal marriage astrology assistant. I have access to your complete birth chart analysis. Ask me anything about your marriage timing, spouse characteristics, doshas, or remedies!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { aiProvider, setAiProvider } = useUserProfileStore();
  const { generateInsight, loading, error, insight, reset, aiLimited } = useSelfAI(report);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use real AI from hook
      // Determine the type of insight needed based on keywords
      let insightType: any = 'ASTRO_MIND_SELF';
      const lowerContent = content.toLowerCase();

      if (lowerContent.includes('when') || lowerContent.includes('timing') || lowerContent.includes('marry')) {
        insightType = 'TIMING_FORECAST';
      } else if (lowerContent.includes('spouse') || lowerContent.includes('partner') || lowerContent.includes('husband') || lowerContent.includes('wife')) {
        insightType = 'SPOUSE_DETAILED_PROFILE';
      } else if (lowerContent.includes('remedy') || lowerContent.includes('solution') || lowerContent.includes('fix')) {
        insightType = 'PERSONAL_REMEDIES';
      } else if (lowerContent.includes('sexual') || lowerContent.includes('intimacy') || lowerContent.includes('yoni') || lowerContent.includes('physical profile') || lowerContent.includes('vitality')) {
        insightType = 'SEXUAL_PROFILE';
      } else if (lowerContent.includes('psychology') || lowerContent.includes('mind') || lowerContent.includes('attachment')) {
        insightType = 'PSYCHOLOGICAL_PROFILE';
      }

      await generateInsight(insightType, content);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to my astrological systems. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle AI response from hook
  React.useEffect(() => {
    if (insight && !loading) {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: insight,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      reset(); // Clear insight for next query
    }
  }, [insight, loading, reset]);

  // Effect to handle AI errors
  React.useEffect(() => {
    if (error && !loading) {
       const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: error + (aiLimited ? "\n\n[Upgrade to Premium](/pricing)" : ""),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      reset();
    }
  }, [error, loading, aiLimited, reset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const quickActions = [
    { label: '💍 When will I marry?', question: 'When will I get married?' },
    { label: '👤 Who is my spouse?', question: 'What will my future spouse be like?' },
    { label: '⚠️ Check my doshas', question: 'Do I have any doshas? What are they?' },
    { label: '💎 Remedies for me', question: 'What remedies should I follow?' },
    ...(partners.slice(0, 2).map(p => ({
      label: `💕 vs ${p.name}`,
      question: `Compare my chart with ${p.name}`
    })))
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700/80">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white">AstroMind AI Chat</h3>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Micro AI Switch */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setAiProvider('gemini')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                aiProvider === 'gemini'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Gemini
            </button>
            <button
              onClick={() => setAiProvider('anthropic')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                aiProvider === 'anthropic'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Claude
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-lg border border-white/5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Active</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700/80 rounded-bl-none shadow-sm'
                }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    strong: ({ node, ...props }) => <span className="text-indigo-600 dark:text-indigo-400 font-extrabold" {...props} />,
                    a: ({ node, ...props }) => <a className="text-violet-600 dark:text-violet-400 hover:underline font-bold" {...props} />
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                <span className="text-xs text-gray-500 font-medium animate-pulse">Analyzing chart data with {aiProvider === 'anthropic' ? 'Claude' : 'Gemini'}...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200/80 dark:border-gray-700/80">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => sendMessage(action.question)}
              className="px-3.5 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-slate-300 rounded-xl text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-all"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700/80 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${aiProvider === 'anthropic' ? 'Claude' : 'Gemini'} about marriage, spouse profile, or remedies...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SelfAstroMindWidget;
