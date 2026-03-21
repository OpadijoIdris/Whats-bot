import { SendMessageResponse } from '../core/whatsapp.types.js';
export declare class WhatsAppService {
    private readonly baseUrl;
    private readonly accessToken;
    private readonly phoneNumberId;
    constructor();
    sendTextMessage(to: string, text: string): Promise<SendMessageResponse>;
    markAsRead(messageId: string): Promise<void>;
}
//# sourceMappingURL=whatsapp.service.d.ts.map