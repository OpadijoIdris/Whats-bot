import axios from 'axios';
import { env } from '../config/env.js';
import { SendMessageResponse } from '../core/whatsapp.types.js';

export class WhatsAppService {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly phoneNumberId: string;

  constructor() {
    this.accessToken = env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
    this.baseUrl = `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}`;
  }

  private getRequestConfig(customToken?: string, customPhoneId?: string) {
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

  async sendTextMessage(to: string, text: string, options?: { accessToken?: string; phoneNumberId?: string }): Promise<SendMessageResponse> {
    try {
      const { url, headers } = this.getRequestConfig(options?.accessToken, options?.phoneNumberId);
      const response = await axios.post<SendMessageResponse>(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { body: text },
        },
        {
          headers,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('[WhatsAppService]: Failed to send message:', error.response?.data || error.message);
      } else {
        console.error('[WhatsAppService]: Unknown error:', error);
      }
      throw new Error('Failed to send WhatsApp message');
    }
  }

  async markAsRead(messageId: string, options?: { accessToken?: string; phoneNumberId?: string }): Promise<void> {
    try {
      const { url, headers } = this.getRequestConfig(options?.accessToken, options?.phoneNumberId);
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers,
        }
      );
    } catch (error) {
      console.error('[WhatsAppService]: Failed to mark message as read:', error);
    }
  }
}
