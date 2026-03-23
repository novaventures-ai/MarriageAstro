/**
 * Self AstroMind Widget
 * AI chat widget for self analysis mode
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { SelfAnalysisReport, PartnerProfile } from '../../types/selfAnalysis';
import { useSelfAI } from '../../hooks/useSelfAI';
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white">AstroMind AI</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-white/80">Online</span>
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
                ? 'bg-purple-600 text-white rounded-br-none'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-sm'
                }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
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
                <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                <span className="text-xs text-gray-500">Analyzing your chart...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => sendMessage(action.question)}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your marriage, spouse, or remedies..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};



export default SelfAstroMindWidget;
