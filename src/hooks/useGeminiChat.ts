import { useState, useCallback } from 'react';
import { getGeminiModel } from '../../lib/ai/geminiClient';
import { SYSTEM_PROMPTS, generatePrompt } from '../../lib/ai/prompts';

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

    const sendMessage = useCallback(async (userQuestion: string) => {
        if (!userQuestion.trim()) return;

        // Add User Message
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: userQuestion
        };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);
        setError(null);

        try {
            // 1. Prepare System Prompt (The Guru Persona)
            const systemInstruction = SYSTEM_PROMPTS.ASTRO_MIND;

            // 2. Prepare User Prompt (Context + Question)
            const prompt = generatePrompt('ASTRO_MIND', {
                reportContext,
                userQuestion
            });

            // 3. Call Gemini
            // Note: For a real chat, we would send history. 
            // For this MVP, we send the summarized context + current question to save tokens.
            // The "Memory" is the context summary.
            const model = getGeminiModel(systemInstruction);
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            // Add AI Response
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText
            };
            setMessages(prev => [...prev, aiMsg]);

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

    return { messages, sendMessage, loading, error, clearChat };
};
