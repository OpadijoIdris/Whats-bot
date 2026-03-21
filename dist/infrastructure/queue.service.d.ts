import { Queue, ConnectionOptions } from 'bullmq';
import { IncomingContext } from '../application/messaging-pipeline.service.js';
export declare class QueueService {
    private static instance;
    static readonly QUEUE_NAME = "whatsapp-messages";
    private constructor();
    static getConnectionOptions(): ConnectionOptions;
    static getInstance(): Queue;
    static addMessageToQueue(data: IncomingContext): Promise<void>;
}
//# sourceMappingURL=queue.service.d.ts.map