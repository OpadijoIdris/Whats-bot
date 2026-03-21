import OpenAI from 'openai';
import { env } from '../config/env.js';
export class OpenAIService {
    openai;
    constructor() {
        this.openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY,
        });
    }
    async generateChatResponse(messages) {
        try {
            const response = await this.openai.chat.completions.create({
                model: env.OPENAI_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 1000,
            });
            return response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
        }
        catch (error) {
            console.error('[OpenAIService]: Failed to generate response:', error);
            throw new Error('Failed to generate AI response');
        }
    }
    async generateTextResponse(prompt, systemPrompt) {
        return this.generateChatResponse([
            { role: 'system', content: systemPrompt || 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
        ]);
    }
}
//# sourceMappingURL=openai.service.js.map