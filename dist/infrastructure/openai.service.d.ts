export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export declare class OpenAIService {
    private openai;
    constructor();
    generateChatResponse(messages: ChatMessage[]): Promise<string>;
    generateTextResponse(prompt: string, systemPrompt?: string): Promise<string>;
}
//# sourceMappingURL=openai.service.d.ts.map