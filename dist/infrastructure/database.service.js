import { PrismaClient } from '@prisma/client';
export class DatabaseService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new PrismaClient();
        }
        return DatabaseService.instance;
    }
}
//# sourceMappingURL=database.service.js.map