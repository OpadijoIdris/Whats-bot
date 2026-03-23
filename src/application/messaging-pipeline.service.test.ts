import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { MessagingPipelineService, IncomingContext } from './messaging-pipeline.service.js';
import { WhatsAppService } from '../infrastructure/whatsapp.service.js';
import { OpenAIService } from '../infrastructure/openai.service.js';
import { ConversationRepository } from '../infrastructure/conversation.repository.js';
import { MessageRole } from '@prisma/client';

// Mock dependencies
vi.mock('../infrastructure/whatsapp.service.js');
vi.mock('../infrastructure/openai.service.js');
vi.mock('../infrastructure/conversation.repository.js');

describe('MessagingPipelineService', () => {
  let pipeline: MessagingPipelineService;
  let whatsappService: Mocked<WhatsAppService>;
  let openaiService: Mocked<OpenAIService>;
  let conversationRepo: Mocked<ConversationRepository>;

  const mockContext: IncomingContext = {
    from: '2348000000000',
    messageId: 'msg_123',
    text: 'Hello bot',
    phoneId: 'phone_abc',
    userName: 'John Doe'
  };

  const mockAccount = {
    id: 'acc_1',
    name: 'Test Business',
    whatsappPhoneId: 'phone_abc',
    whatsappToken: 'token_xyz',
    openaiApiKey: 'sk-test-key',
    botPersonality: 'Professional assistant',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUser = { id: 'user_1', phoneNumber: '2348000000000', accountId: 'acc_1' };
  const mockConversation = { id: 'conv_1', userId: 'user_1' };

  beforeEach(() => {
    vi.clearAllMocks();

    whatsappService = new WhatsAppService() as any;
    openaiService = new OpenAIService() as any;
    conversationRepo = new ConversationRepository() as any;

    pipeline = new MessagingPipelineService(
      whatsappService,
      openaiService,
      conversationRepo
    );
  });

  it('should process a message successfully', async () => {
    // Setup mocks
    conversationRepo.getAccountByPhoneId.mockResolvedValue(mockAccount as any);
    conversationRepo.findOrCreateUser.mockResolvedValue(mockUser as any);
    conversationRepo.getOrCreateActiveConversation.mockResolvedValue(mockConversation as any);
    conversationRepo.getConversationHistory.mockResolvedValue([
      { role: MessageRole.USER, content: 'Hello bot' }
    ] as any);
    openaiService.generateChatResponse.mockResolvedValue('Hello John! How can I help you?');

    await pipeline.processIncomingMessage(mockContext);

    // Assertions
    expect(conversationRepo.getAccountByPhoneId).toHaveBeenCalledWith('phone_abc');
    expect(conversationRepo.findOrCreateUser).toHaveBeenCalledWith('2348000000000', 'acc_1', 'John Doe');
    expect(whatsappService.markAsRead).toHaveBeenCalledWith('msg_123', {
      accessToken: 'token_xyz',
      phoneNumberId: 'phone_abc'
    });
    expect(openaiService.generateChatResponse).toHaveBeenCalledWith(
      expect.arrayContaining([
        { role: 'system', content: 'Professional assistant' },
        { role: 'user', content: 'Hello bot' }
      ]),
      'sk-test-key'
    );
    expect(whatsappService.sendTextMessage).toHaveBeenCalledWith('2348000000000', 'Hello John! How can I help you?', {
      accessToken: 'token_xyz',
      phoneNumberId: 'phone_abc'
    });
  });

  it('should stop processing if account is not found', async () => {
    conversationRepo.getAccountByPhoneId.mockResolvedValue(null);

    await pipeline.processIncomingMessage(mockContext);

    expect(conversationRepo.findOrCreateUser).not.toHaveBeenCalled();
    expect(openaiService.generateChatResponse).not.toHaveBeenCalled();
    expect(whatsappService.sendTextMessage).not.toHaveBeenCalled();
  });

  it('should send a fallback message if an error occurs during processing', async () => {
    conversationRepo.getAccountByPhoneId.mockResolvedValue(mockAccount as any);
    conversationRepo.findOrCreateUser.mockRejectedValue(new Error('DB Error'));

    await pipeline.processIncomingMessage(mockContext);

    expect(whatsappService.sendTextMessage).toHaveBeenCalledWith(
      '2348000000000',
      expect.stringContaining("I'm sorry, I'm having trouble"),
      {
        accessToken: 'token_xyz',
        phoneNumberId: 'phone_abc'
      }
    );
  });
});
