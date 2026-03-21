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
    this.baseUrl = `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${this.phoneNumberId}`;
  }

  async sendTextMessage(to: string, text: string): Promise<SendMessageResponse> {
    try {
      const response = await axios.post<SendMessageResponse>(
        `${this.baseUrl}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { body: text },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
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

  async markAsRead(messageId: string): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('[WhatsAppService]: Failed to mark message as read:', error);
    }
  }
}
