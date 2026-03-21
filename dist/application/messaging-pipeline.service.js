import { MessageRole } from '@prisma/client';
export class MessagingPipelineService {
    whatsappService;
    openaiService;
    conversationRepo;
    constructor(whatsappService, openaiService, conversationRepo) {
        this.whatsappService = whatsappService;
        this.openaiService = openaiService;
        this.conversationRepo = conversationRepo;
    }
    async processIncomingMessage(context) {
        const { from, messageId, text, phoneId, userName } = context;
        try {
            const account = await this.conversationRepo.getAccountByPhoneId(phoneId);
            if (!account) {
                console.error(`[Pipeline]: No account found for Phone ID: ${phoneId}`);
                return;
            }
            const user = await this.conversationRepo.findOrCreateUser(from, account.id, userName);
            const conversation = await this.conversationRepo.getOrCreateActiveConversation(user.id);
            await this.conversationRepo.addMessage(conversation.id, MessageRole.USER, text, messageId);
            await this.whatsappService.markAsRead(messageId);
            const history = await this.conversationRepo.getConversationHistory(conversation.id, 10);
            const chatMessages = [
                { role: 'system', content: account.botPersonality },
                ...history.map(msg => ({
                    role: msg.role === MessageRole.USER ? 'user' : 'assistant',
                    content: msg.content
                }))
            ];
            const aiResponse = await this.openaiService.generateChatResponse(chatMessages);
            await this.conversationRepo.addMessage(conversation.id, MessageRole.ASSISTANT, aiResponse);
            await this.whatsappService.sendTextMessage(from, aiResponse);
            console.log(`[Pipeline]: Processed message for user ${from} (Tenant: ${account.name})`);
        }
        catch (error) {
            console.error('[Pipeline]: Error processing message:', error);
            try {
                await this.whatsappService.sendTextMessage(from, "I'm sorry, I'm having trouble processing your request right now. Please try again later.");
            }
            catch (innerError) {
                console.error('[Pipeline]: Failed to send error fallback message:', innerError);
            }
        }
    }
}
//# sourceMappingURL=messaging-pipeline.service.js.map