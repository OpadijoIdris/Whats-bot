import { PrismaClient, MessageRole } from '@prisma/client';
import { DatabaseService } from './database.service.js';

export class ConversationRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseService.getInstance();
  }

  async getAccountByPhoneId(phoneId: string) {
    return this.prisma.account.findUnique({
      where: { whatsappPhoneId: phoneId },
    });
  }

  async findOrCreateUser(phoneNumber: string, accountId: string, name?: string) {
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

  async getOrCreateActiveConversation(userId: string) {
    // For now, we just get the most recent one or create a new one
    // In a more complex bot, we might check for "expired" conversations
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

  async addMessage(conversationId: string, role: MessageRole, content: string, whatsappMid?: string) {
    return this.prisma.message.create({
      data: {
        conversationId,
        role,
        content,
        whatsappMid,
      },
    });
  }

  async getConversationHistory(conversationId: string, limit: number = 10) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: -limit, // Get the last N messages
    });
  }
}
