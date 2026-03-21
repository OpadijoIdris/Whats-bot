import { Queue, ConnectionOptions } from 'bullmq';
import { env } from '../config/env.js';
import { IncomingContext } from '../application/messaging-pipeline.service.js';

export class QueueService {
  private static instance: Queue;

  public static readonly QUEUE_NAME = 'whatsapp-messages';

  private constructor() {}

  public static getConnectionOptions(): ConnectionOptions {
    return {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      maxRetriesPerRequest: null,
    };
  }

  public static getInstance(): Queue {
    if (!QueueService.instance) {
      QueueService.instance = new Queue(QueueService.QUEUE_NAME, {
        connection: QueueService.getConnectionOptions(),
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      });
    }
    return QueueService.instance;
  }

  /**
   * Push a message into the background processing queue
   */
  public static async addMessageToQueue(data: IncomingContext): Promise<void> {
    const queue = QueueService.getInstance();
    // Using the WhatsApp message ID as the job ID to prevent duplicate processing
    await queue.add('process-message', data, { jobId: data.messageId });
    console.log(`[Queue]: Message ${data.messageId} added to queue`);
  }
}
