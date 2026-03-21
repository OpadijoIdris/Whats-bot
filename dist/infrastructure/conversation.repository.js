import { DatabaseService } from './database.service.js';
export class ConversationRepository {
    prisma;
    constructor() {
        this.prisma = DatabaseService.getInstance();
    }
    async getAccountByPhoneId(phoneId) {
        return this.prisma.account.findUnique({
            where: { whatsappPhoneId: phoneId },
        });
    }
    async findOrCreateUser(phoneNumber, accountId, name) {
        return this.prisma.user.upsert({
            where: {
                phoneNumber_accountId: {
                    phoneNumber,
                    accountId,
                },
            },
            update: { name },
            create: {
                phoneNumber,
                accountId,
                name,
            },
        });
    }
    async getOrCreateActiveConversation(userId) {
        let conversation = await this.prisma.conversation.findFirst({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
        if (!conversation) {
            conversation = await this.prisma.conversation.create({
                data: { userId },
            });
        }
        return conversation;
    }
    async addMessage(conversationId, role, content, whatsappMid) {
        return this.prisma.message.create({
            data: {
                conversationId,
                role,
                content,
                whatsappMid,
            },
        });
    }
    async getConversationHistory(conversationId, limit = 10) {
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            take: -limit,
        });
    }
}
//# sourceMappingURL=conversation.repository.js.map