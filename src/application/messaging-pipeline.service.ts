import { WhatsAppService } from '../infrastructure/whatsapp.service.js';
import { OpenAIService, ChatMessage } from '../infrastructure/openai.service.js';
import { ConversationRepository } from '../infrastructure/conversation.repository.js';
import { MessageRole } from '@prisma/client';

export interface IncomingContext {
  from: string;
  messageId: string;
  text: string;
  phoneId: string; // The ID of the bot phone that received the message
  userName?: string;
}

export class MessagingPipelineService {
  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly openaiService: OpenAIService,
    private readonly conversationRepo: ConversationRepository
  ) {}

  async processIncomingMessage(context: IncomingContext): Promise<void> {
    const { from, messageId, text, phoneId, userName } = context;

    try {
      // 1. Identify Account (Tenant)
      const account = await this.conversationRepo.getAccountByPhoneId(phoneId);
      if (!account) {
        console.error(`[Pipeline]: No account found for Phone ID: ${phoneId}`);
        return;
      }

      // 2. Identify/Create User
      const user = await this.conversationRepo.findOrCreateUser(from, account.id, userName);

      // 3. Get/Create Active Conversation
      const conversation = await this.conversationRepo.getOrCreateActiveConversation(user.id);

      // 4. Save Incoming Message to DB
      await this.conversationRepo.addMessage(conversation.id, MessageRole.USER, text, messageId);

      // 5. Mark as read
      await this.whatsappService.markAsRead(messageId);

      // 6. Get Conversation History for AI context
      const history = await this.conversationRepo.getConversationHistory(conversation.id, 10);
      
      const chatMessages: ChatMessage[] = [
        { role: 'system', content: account.botPersonality },
        ...history.map(msg => ({
          role: msg.role === MessageRole.USER ? 'user' : 'assistant' as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      // 7. Generate AI response
      const aiResponse = await this.openaiService.generateChatResponse(chatMessages);

      // 8. Save AI response to DB
      await this.conversationRepo.addMessage(conversation.id, MessageRole.ASSISTANT, aiResponse);

      // 9. Send response back
      await this.whatsappService.sendTextMessage(from, aiResponse);
      
      console.log(`[Pipeline]: Processed message for user ${from} (Tenant: ${account.name})`);
    } catch (error) {
      console.error('[Pipeline]: Error processing message:', error);
      
      try {
        await this.whatsappService.sendTextMessage(
          from, 
          "I'm sorry, I'm having trouble processing your request right now. Please try again later."
        );
      } catch (innerError) {
        console.error('[Pipeline]: Failed to send error fallback message:', innerError);
      }
    }
  }
}
