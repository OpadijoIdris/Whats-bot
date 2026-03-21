import { MessagingPipelineService } from '../application/messaging-pipeline.service.js';
export declare class MessageWorker {
    private readonly pipelineService;
    private worker;
    constructor(pipelineService: MessagingPipelineService);
    private setupListeners;
    close(): Promise<void>;
}
//# sourceMappingURL=worker.d.ts.map