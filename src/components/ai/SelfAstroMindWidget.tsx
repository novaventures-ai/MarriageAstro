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

  const { generateInsight } = useSelfAI(report);

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
      // Determine the type of insight needed based on the question
      let insightType: any = 'ASTRO_MIND_SELF';
      const lowerContent = content.toLowerCase();

      if (lowerContent.includes('when') || lowerContent.includes('timing') || lowerContent.includes('marry')) {
        insightType = 'TIMING_FORECAST';
      } else if (lowerContent.includes('spouse') || lowerContent.includes('partner') || lowerContent.includes('husband') || lowerContent.includes('wife')) {
        insightType = 'SPOUSE_DETAILED_PROFILE';
      } else if (lowerContent.includes('remedy') || lowerContent.includes('solution') || lowerContent.includes('fix')) {
        insightType = 'PERSONAL_REMEDIES';
      } else if (lowerContent.includes('sexual') || lowerContent.includes('intimacy') || lowerContent.includes('yoni')) {
        insightType = 'SEXUAL_PROFILE';
      } else if (lowerContent.includes('psychology') || lowerContent.includes('mind') || lowerContent.includes('attachment')) {
        insightType = 'PSYCHOLOGICAL_PROFILE';
      }

      // Generate AI response
      const response = await generateInsightWithContext(content, insightType);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an issue processing your question. Please try again or ask something else.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsightWithContext = async (question: string, type: any): Promise<string> => {
    // Build context-rich prompt
    const context = buildChatContext(report, partners, question);

    // Simulate AI response (in real implementation, this would call Gemini)
    // For now, return contextual response based on report data
    return generateContextualResponse(report, question, type);
  };

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

// Helper functions
function buildChatContext(
  report: SelfAnalysisReport,
  partners: PartnerProfile[],
  question: string
): string {
  return `
Context for answering: "${question}"

User: ${report.chart.name}
Ascendant: ${report.chart.ascendant}
Moon: ${report.chart.planetaryPositions.find(p => p.planet === 'Moon')?.sign} in ${report.chart.planetaryPositions.find(p => p.planet === 'Moon')?.house}
7th House: ${report.chart.houses.find(h => h.houseNumber === 7)?.sign}
7th Lord: ${report.chart.houses.find(h => h.houseNumber === 7)?.lord}
Marriage Score: ${report.marriagePotential.score}/100
Best Timing: ${report.timingForecast?.nextMarriageWindow.yearRange}

${partners.length > 0 ? `Saved partners: ${partners.map(p => p.name).join(', ')}` : ''}
`;
}

function generateContextualResponse(
  report: SelfAnalysisReport,
  question: string,
  type: string
): string {
  const lowerQuestion = question.toLowerCase();

  // Timing questions
  if (lowerQuestion.includes('when') || lowerQuestion.includes('marry') || lowerQuestion.includes('marriage')) {
    return `Based on your chart analysis, here are the key timing indicators:

**Next Marriage Window:** ${report.timingForecast?.nextMarriageWindow.yearRange}

**Current Dasha:** ${report.timing.currentDasha?.planet} Mahadasha
- This period is ${report.marriagePotential.dashaSupport > 60 ? 'favorable' : 'building phase'} for marriage

**Favorable Periods:**
${report.timingForecast?.favorablePeriods.slice(0, 3).map(p => `- ${p.period}: ${p.dates}`).join('\n') || 'Analyzing dasha periods...'}

**Advice:** ${report.timingForecast?.delayAnalysis?.hasDelays
        ? 'There are some delay indicators, but following remedies can help.'
        : 'Your timing looks favorable. Stay open to opportunities!'}

Would you like me to analyze a specific year or compare with a partner?`;
  }

  // Spouse questions
  if (lowerQuestion.includes('spouse') || lowerQuestion.includes('partner') || lowerQuestion.includes('husband') || lowerQuestion.includes('wife')) {
    return `Here's what your chart reveals about your future spouse:

**Physical Profile:**
- Build: ${report.spouseDetailedProfile?.physicalAppearance.build}
- Style: ${report.spouseDetailedProfile?.physicalAppearance.styleOfDressing}
- First impression: ${report.spouseDetailedProfile?.physicalAppearance.firstImpression}

**Career & Status:**
- Field: ${report.spouseDetailedProfile?.career.field}
- Archetype: ${report.spouseDetailedProfile?.career.archetype}
- Ambition level: ${report.spouseDetailedProfile?.career.ambitionLevel}

**How You'll Meet:**
${report.spouseDetailedProfile?.meetingCircumstances.how}
Direction from your birthplace: ${report.spouseDetailedProfile?.meetingCircumstances.direction}

**Key Personality Traits:**
${report.spouseDetailedProfile?.personality.keyTraits.slice(0, 3).map(trait => `- ${trait}`).join('\n')}

Would you like more details about their personality or your relationship dynamic?`;
  }

  // Dosha questions
  if (lowerQuestion.includes('dosha') || lowerQuestion.includes('manglik') || lowerQuestion.includes('problem')) {
    const doshas = report.doshaAnalysis.doshas.filter(d => d.present);

    if (doshas.length === 0) {
      return `Great news! Your chart shows **no significant doshas** affecting marriage.

Your 7th house is well-supported, and you have a clean slate for a happy married life. The main focus should be on:
- Timing your marriage well
- Finding a compatible partner
- Following general strengthening remedies

**Strengths:**
${report.marriagePotential.strengths.slice(0, 3).map(s => `- ${s}`).join('\n')}

Would you like to know about your best timing or spouse characteristics?`;
    }

    return `Here are the doshas identified in your chart:

${doshas.map(d => `**${d.name}** (${d.severity})
- Effect: ${d.effects}
- Remedy: ${d.remedies.length > 0 ? d.remedies.join(', ') : 'General remedies recommended'}`).join('\n\n')}

**Don't worry!** Doshas are common and can be managed through:
1. Specific remedies (see Remedies tab)
2. Matching with compatible charts
3. Timing marriage appropriately

Your overall marriage potential is still ${report.marriagePotential.score}/100.

Would you like specific remedies for these doshas?`;
  }

  // Remedy questions
  if (lowerQuestion.includes('remedy') || lowerQuestion.includes('solution') || lowerQuestion.includes('what should i do')) {
    return `Here are your **Top 3 Prioritized Remedies:**

**1. ${report.remedies.prioritizedActions[0]?.title}**
${report.remedies.prioritizedActions[0]?.description}
- Start: ${report.remedies.prioritizedActions[0]?.whenToStart}
- Duration: ${report.remedies.prioritizedActions[0]?.duration}

**2. ${report.remedies.prioritizedActions[1]?.title}**
${report.remedies.prioritizedActions[1]?.description}

**3. ${report.remedies.prioritizedActions[2]?.title}**
${report.remedies.prioritizedActions[2]?.description}

**Gemstone Recommendation:**
- Stone: ${report.remedies.gemstone.stone}
- Metal: ${report.remedies.gemstone.metal}
- Wear on: ${report.remedies.gemstone.day}

**Daily Mantra:**
${report.remedies.mantras.primary.mantra}
- Chant ${report.remedies.mantras.primary.count} times
- Best time: ${report.remedies.mantras.primary.bestTime}

Would you like more details on any specific remedy?`;
  }

  // Default response
  return `Based on your chart with ${report.marriagePotential.score}/100 marriage potential, here's what I can tell you:

**Your Strengths:**
${report.marriagePotential.strengths.slice(0, 3).map(s => `- ${s}`).join('\n')}

**Best Marriage Window:** ${report.timingForecast?.nextMarriageWindow.yearRange}

**Spouse Field:** ${report.spouseDetailedProfile?.career.field}

You can ask me specifically about:
- Marriage timing and dasha periods
- Detailed spouse characteristics
- Dosha analysis and remedies
- Compatibility with saved partners

What would you like to know more about?`;
}

export default SelfAstroMindWidget;
