import { useState, useCallback } from 'react';
import { getAIModel } from '../../lib/ai/clientSelector';
import { SYSTEM_PROMPTS, generatePrompt } from '../../lib/ai/prompts';
import { useUserProfileStore } from '../store/useUserProfileStore';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export const useGeminiChat = (reportContext: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Namaste! I am AstroMind. I have analyzed your compatibility report. Ask me anything about your relationship, doshas, or future timeline."
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiLimited, setAiLimited] = useState(false);

    const sendMessage = useCallback(async (userQuestion: string) => {
        if (!userQuestion.trim()) return;

        // Check AI credits
        const state = useUserProfileStore.getState();
        const isPremium = state.isAdmin || state.planTier === 'premium' || state.planTier === 'astrologer';
        if (!isPremium && state.aiCreditsRemaining <= 0) {
            setAiLimited(true);
            setError("You've used all 3 free AI queries today. Upgrade to Premium for unlimited AI chat.");
            return;
        }

        // Add User Message
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: userQuestion
        };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);
        setError(null);
        setAiLimited(false);

        try {
            // 1. Prepare System Prompt (The Guru Persona)
            const systemInstruction = SYSTEM_PROMPTS.ASTRO_MIND;

            // 2. Prepare User Prompt (Context + Question)
            const prompt = generatePrompt('ASTRO_MIND', {
                reportContext,
                userQuestion
            });

            // 3. Call AI Model (Gemini or Claude)
            // Note: For a real chat, we would send history. 
            // For this MVP, we send the summarized context + current question to save tokens.
            // The "Memory" is the context summary.
            const model = getAIModel(systemInstruction);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Add AI Response
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText
            };
            setMessages(prev => [...prev, aiMsg]);

            // Deduct AI credit for free users
            if (!isPremium) {
                useUserProfileStore.getState().useAiCredit();
            }

        } catch (err: any) {
            console.error("AstroMind Chat Error:", err instanceof Error ? err.message : 'Unknown error');
            setError("The stars are clouded right now. Please try again.");

            // Optional: Remove user message if failed? Or keep it with error indicator? 
            // For now, we keep it.
        } finally {
            setLoading(false);
        }
    }, [reportContext]);

    const clearChat = useCallback(() => {
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: "Namaste! I am AstroMind. I have analyzed your compatibility report. Ask me anything about your relationship, doshas, or future timeline."
        }]);
    }, []);

    return { messages, sendMessage, loading, error, clearChat, aiLimited };
};
