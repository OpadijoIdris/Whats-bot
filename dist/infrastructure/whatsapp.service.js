import axios from 'axios';
import { env } from '../config/env.js';
export class WhatsAppService {
    baseUrl;
    accessToken;
    phoneNumberId;
    constructor() {
        this.accessToken = env.WHATSAPP_ACCESS_TOKEN;
        this.phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
        this.baseUrl = `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}`;
    }
    getRequestConfig(customToken, customPhoneId) {
        const token = customToken || this.accessToken;
        const phoneId = customPhoneId || this.phoneNumberId;
        return {
            url: `${this.baseUrl}/${phoneId}/messages`,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
    }
    async sendTextMessage(to, text, options) {
        try {
            const { url, headers } = this.getRequestConfig(options?.accessToken, options?.phoneNumberId);
            const response = await axios.post(url, {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to,
                type: 'text',
                text: { body: text },
            }, {
                headers,
            });
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('[WhatsAppService]: Failed to send message:', error.response?.data || error.message);
            }
            else {
                console.error('[WhatsAppService]: Unknown error:', error);
            }
            throw new Error('Failed to send WhatsApp message');
        }
    }
    async markAsRead(messageId, options) {
        try {
            const { url, headers } = this.getRequestConfig(options?.accessToken, options?.phoneNumberId);
            await axios.post(url, {
                messaging_product: 'whatsapp',
                status: 'read',
                message_id: messageId,
            }, {
                headers,
            });
        }
        catch (error) {
            console.error('[WhatsAppService]: Failed to mark message as read:', error);
        }
    }
}
//# sourceMappingURL=whatsapp.service.js.map