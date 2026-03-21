import { Queue } from 'bullmq';
import { env } from '../config/env.js';
export class QueueService {
    static instance;
    static QUEUE_NAME = 'whatsapp-messages';
    constructor() { }
    static getConnectionOptions() {
        return {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            maxRetriesPerRequest: null,
        };
    }
    static getInstance() {
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
    static async addMessageToQueue(data) {
        const queue = QueueService.getInstance();
        await queue.add('process-message', data, { jobId: data.messageId });
        console.log(`[Queue]: Message ${data.messageId} added to queue`);
    }
}
//# sourceMappingURL=queue.service.js.map