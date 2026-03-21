import { MessageRole } from '@prisma/client';
export declare class ConversationRepository {
    private prisma;
    constructor();
    getAccountByPhoneId(phoneId: string): Promise<{
        id: string;
        name: string;
        whatsappPhoneId: string;
        whatsappToken: string;
        openaiApiKey: string | null;
        botPersonality: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findOrCreateUser(phoneNumber: string, accountId: string, name?: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        phoneNumber: string;
        accountId: string;
    }>;
    getOrCreateActiveConversation(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addMessage(conversationId: string, role: MessageRole, content: string, whatsappMid?: string): Promise<{
        id: string;
        createdAt: Date;
        whatsappMid: string | null;
        role: import("@prisma/client").$Enums.MessageRole;
        content: string;
        conversationId: string;
    }>;
    getConversationHistory(conversationId: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        whatsappMid: string | null;
        role: import("@prisma/client").$Enums.MessageRole;
        content: string;
        conversationId: string;
    }[]>;
}
//# sourceMappingURL=conversation.repository.d.ts.map