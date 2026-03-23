import crypto from 'crypto';
import { env } from '../config/env.js';
export const verifyWhatsAppSignature = (req, res, next) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        console.error('[Security]: Missing x-hub-signature-256 header');
        res.status(401).send('Signature missing');
        return;
    }
    if (!req.rawBody) {
        console.error('[Security]: Raw body missing for verification');
        res.status(500).send('Verification failed: raw body not captured');
        return;
    }
    try {
        const [algo, receivedHash] = signature.split('=');
        if (algo !== 'sha256' || !receivedHash) {
            console.error('[Security]: Invalid signature format');
            res.status(401).send('Invalid signature format');
            return;
        }
        const expectedHash = crypto
            .createHmac('sha256', env.WHATSAPP_APP_SECRET)
            .update(req.rawBody)
            .digest('hex');
        if (crypto.timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expectedHash))) {
            next();
        }
        else {
            console.error('[Security]: Signature mismatch');
            res.status(401).send('Signature mismatch');
        }
    }
    catch (error) {
        console.error('[Security]: Error during signature verification:', error);
        res.status(500).send('Internal verification error');
    }
};
//# sourceMappingURL=security.middleware.js.map