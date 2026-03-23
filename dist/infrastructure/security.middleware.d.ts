import { Request, Response, NextFunction } from 'express';
export interface RequestWithRawBody extends Request {
    rawBody?: Buffer;
}
export declare const verifyWhatsAppSignature: (req: RequestWithRawBody, res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.middleware.d.ts.map