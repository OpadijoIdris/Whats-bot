import { Worker } from 'bullmq';
import { QueueService } from './queue.service.js';
export class MessageWorker {
    pipelineService;
    worker;
    constructor(pipelineService) {
        this.pipelineService = pipelineService;
        this.worker = new Worker(QueueService.QUEUE_NAME, async (job) => {
            const { data } = job;
            console.log(`[Worker]: Processing message ${data.messageId} from ${data.from}`);
            try {
                await this.pipelineService.processIncomingMessage(data);
                console.log(`[Worker]: Successfully processed job ${job.id}`);
            }
            catch (error) {
                console.error(`[Worker]: Error processing job ${job.id}:`, error);
                throw error;
            }
        }, {
            connection: QueueService.getConnectionOptions(),
            concurrency: 5,
        });
        this.setupListeners();
    }
    setupListeners() {
        this.worker.on('completed', (job) => {
            console.log(`[Worker]: Job ${job.id} completed`);
        });
        this.worker.on('failed', (job, err) => {
            console.error(`[Worker]: Job ${job?.id} failed:`, err);
        });
        this.worker.on('error', (err) => {
            console.error('[Worker]: Connection error:', err);
        });
    }
    async close() {
        await this.worker.close();
    }
}
//# sourceMappingURL=worker.js.map