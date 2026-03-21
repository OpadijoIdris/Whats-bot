import { Worker, Job } from 'bullmq';
import { QueueService } from './queue.service.js';
import { MessagingPipelineService, IncomingContext } from '../application/messaging-pipeline.service.js';

export class MessageWorker {
  private worker: Worker;

  constructor(private readonly pipelineService: MessagingPipelineService) {
    this.worker = new Worker(
      QueueService.QUEUE_NAME,
      async (job: Job<IncomingContext>) => {
        const { data } = job;
        console.log(`[Worker]: Processing message ${data.messageId} from ${data.from}`);
        
        try {
          await this.pipelineService.processIncomingMessage(data);
          console.log(`[Worker]: Successfully processed job ${job.id}`);
        } catch (error) {
          console.error(`[Worker]: Error processing job ${job.id}:`, error);
          throw error; // Re-throw so BullMQ can attempt retries
        }
      },
      {
        connection: QueueService.getConnectionOptions(),
        concurrency: 5, // Process up to 5 messages in parallel
      }
    );

    this.setupListeners();
  }

  private setupListeners(): void {
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

  public async close(): Promise<void> {
    await this.worker.close();
  }
}
