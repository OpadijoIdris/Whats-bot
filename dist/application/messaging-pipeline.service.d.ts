import { WhatsAppService } from '../infrastructure/whatsapp.service.js';
import { OpenAIService } from '../infrastructure/openai.service.js';
import { ConversationRepository } from '../infrastructure/conversation.repository.js';
export interface IncomingContext {
    from: string;
    messageId: string;
    text: string;
    phoneId: string;
    userName?: string;
}
export declare class MessagingPipelineService {
    private readonly whatsappService;
    private readonly openaiService;
    private readonly conversationRepo;
    constructor(whatsappService: WhatsAppService, openaiService: OpenAIService, conversationRepo: ConversationRepository);
    processIncomingMessage(context: IncomingContext): Promise<void>;
}
//# sourceMappingURL=messaging-pipeline.service.d.ts.map