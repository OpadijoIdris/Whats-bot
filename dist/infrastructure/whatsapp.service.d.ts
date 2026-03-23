import { SendMessageResponse } from '../core/whatsapp.types.js';
export declare class WhatsAppService {
    private readonly baseUrl;
    private readonly accessToken;
    private readonly phoneNumberId;
    constructor();
    private getRequestConfig;
    sendTextMessage(to: string, text: string, options?: {
        accessToken?: string;
        phoneNumberId?: string;
    }): Promise<SendMessageResponse>;
    markAsRead(messageId: string, options?: {
        accessToken?: string;
        phoneNumberId?: string;
    }): Promise<void>;
}
//# sourceMappingURL=whatsapp.service.d.ts.map