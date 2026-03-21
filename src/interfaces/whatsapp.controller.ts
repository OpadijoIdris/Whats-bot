import { Request, Response } from 'express';
import { env } from '../config/env.js';
import { WhatsAppPayload } from '../core/whatsapp.types.js';
import { QueueService } from '../infrastructure/queue.service.js';

export class WhatsAppController {
  public verifyWebhook = (req: Request, res: Response): void => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
      console.log('[Webhook]: Verification successful');
      res.status(200).send(challenge);
    } else {
      console.error('[Webhook]: Verification failed');
      res.sendStatus(403);
    }
  };

  public handleIncoming = async (req: Request, res: Response): Promise<void> => {
    const body: WhatsAppPayload = req.body;

    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const metadata = value?.metadata;
      const contact = value?.contacts?.[0];
      const message = value?.messages?.[0];

      if (message && message.type === 'text') {
        const from = message.from;
        const messageId = message.id;
        const text = message.text?.body || '';
        const phoneId = metadata?.phone_number_id || '';
        const userName = contact?.profile?.name;

        console.log(`[Webhook]: New text message from ${from} (${userName || 'Unknown'}): ${text}`);

        // Add message to queue for background processing
        QueueService.addMessageToQueue({
          from,
          messageId,
          text,
          phoneId,
          userName
        }).catch((err) => console.error('[Webhook]: Error adding message to queue:', err));
      }

      // Respond 200 OK immediately
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  };
}
