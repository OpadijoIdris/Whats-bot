import express from 'express';
import { env } from './config/env.js';
import { WhatsAppController } from './interfaces/whatsapp.controller.js';
import { WhatsAppService } from './infrastructure/whatsapp.service.js';
import { OpenAIService } from './infrastructure/openai.service.js';
import { MessagingPipelineService } from './application/messaging-pipeline.service.js';
import { ConversationRepository } from './infrastructure/conversation.repository.js';
import { MessageWorker } from './infrastructure/worker.js';
import { verifyWhatsAppSignature } from './infrastructure/security.middleware.js';
const whatsappService = new WhatsAppService();
const openaiService = new OpenAIService();
const conversationRepo = new ConversationRepository();
const messagingPipeline = new MessagingPipelineService(whatsappService, openaiService, conversationRepo);
new MessageWorker(messagingPipeline);
const whatsappController = new WhatsAppController();
const app = express();
app.use(express.json({
    verify: (req, _res, buf) => {
        req.rawBody = buf;
    }
}));
app.get('/', (_req, res) => {
    res.json({ status: 'success', message: 'WhatsApp AI Bot is running with Queue' });
});
app.get('/webhook', whatsappController.verifyWebhook);
app.post('/webhook', verifyWhatsAppSignature, whatsappController.handleIncoming);
const start = () => {
    try {
        app.listen(env.PORT, () => {
            console.log(`[Server]: Bot is running at http://localhost:${env.PORT}`);
            console.log(`[Server]: Mode: ${env.NODE_ENV}`);
            console.log(`[Server]: Webhook URL: http://localhost:${env.PORT}/webhook`);
            console.log(`[Server]: Worker started and listening for jobs in Redis`);
        });
    }
    catch (error) {
        console.error('[Server]: Failed to start server:', error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map