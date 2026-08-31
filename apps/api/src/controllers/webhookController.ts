import { Request, Response } from 'express';
import { prisma } from '@revenueshield/database';
import { webhookHandler } from '@revenueshield/razorpay';
import { revenueOrchestrator } from '@revenueshield/agents';

export const webhookController = {
  async handleRazorpayWebhook(req: Request, res: Response) {
    try {
      const signature = (req.headers['x-razorpay-signature'] as string) || '';
      const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

      const merchant = await prisma.merchant.findFirst();
      const webhookSecret = merchant?.webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_demo';

      // 1. Verify Signature
      const isValid = webhookHandler.verifySignature(rawBody, signature, webhookSecret);
      if (!isValid && process.env.NODE_ENV === 'production') {
        return res.status(400).json({ error: 'Invalid HMAC signature' });
      }

      // 2. Parse & Process Event
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const eventType = body.event || 'unknown';

      // Check if event is payment recovery (e.g. payment_link.paid or payment.captured)
      if (eventType === 'payment_link.paid' || eventType === 'invoice.paid' || eventType === 'order.paid') {
        const linkId = body.payload?.payment_link?.entity?.id || body.payload?.invoice?.entity?.id || body.payload?.order?.entity?.id;
        
        // Find matching active action
        const action = await prisma.recoveryAction.findFirst({
          where: { razorpayResourceId: linkId },
          include: { session: { include: { leak: true } } }
        });

        if (action && action.session?.leak) {
          const recoveryResult = await revenueOrchestrator.simulatePaymentRecovery(action.session.leak.id);
          return res.json({
            received: true,
            status: 'RECOVERY_RESOLVED',
            recoveredPaise: recoveryResult.amountRecoveredPaise
          });
        }
      }

      // 3. Normalize to Internal Revenue Event
      const internalEvent = webhookHandler.normalizeWebhookEvent(body, merchant?.id || 'merchant_acme_01');

      if (!internalEvent) {
        return res.json({ received: true, status: 'IGNORED_NON_LEAK_EVENT' });
      }

      // 4. Ingest into Central Orchestrator
      const result = await revenueOrchestrator.handleEvent(internalEvent);

      res.json({
        received: true,
        status: 'PROCESSED',
        orchestration: result
      });
    } catch (err: any) {
      console.error('Webhook processing error:', err);
      res.status(500).json({ error: err.message });
    }
  }
};
