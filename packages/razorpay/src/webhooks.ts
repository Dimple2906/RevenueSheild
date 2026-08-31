import crypto from 'crypto';
import { InternalRevenueEvent, LeakType, RazorpayWebhookPayload } from '@revenueshield/shared';

export class RazorpayWebhookHandler {
  private webhookSecret: string;

  constructor(webhookSecret?: string) {
    this.webhookSecret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_demo';
  }

  /**
   * Verifies Razorpay Webhook signature using HMAC SHA256
   */
  public verifySignature(rawBody: string, signature: string, customSecret?: string): boolean {
    const secret = customSecret || this.webhookSecret;
    if (!signature || !secret) return false;

    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }

  /**
   * Normalizes incoming Razorpay webhook payload to InternalRevenueEvent
   */
  public normalizeWebhook(payload: RazorpayWebhookPayload, merchantId: string): InternalRevenueEvent | null {
    const eventName = payload.event;
    const now = new Date().toISOString();

    if (eventName === 'payment.failed') {
      const payment = payload.payload?.payment?.entity as any;
      const amountPaise = payment?.amount || 0;
      const contact = payment?.contact || '+919876543210';
      const email = payment?.email || 'customer@example.com';
      const customerName = payment?.notes?.customer_name || 'Valued Customer';

      return {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        merchantId,
        eventType: eventName,
        leakType: LeakType.SUBSCRIPTION_FAILURE,
        amountPaise,
        razorpayId: payment?.id,
        customer: {
          id: payment?.customer_id || `cust_${contact.replace(/[^0-9]/g, '')}`,
          name: customerName,
          email,
          phone: contact,
          ltvPaise: 4500000,
          totalSuccessfulTxns: 12,
          totalFailedTxns: 1,
          isOptedOut: false,
          isHumanHandled: false,
          lastContactedAt: null,
        },
        timestamp: now,
        source: 'WEBHOOK',
        payload: payment || {},
      };
    }

    if (eventName === 'subscription.halted' || eventName === 'subscription.pending') {
      const subscription = payload.payload?.subscription?.entity as any;
      const amountPaise = subscription?.charge_at_amount || 249900;
      return {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        merchantId,
        eventType: eventName,
        leakType: LeakType.SUBSCRIPTION_FAILURE,
        amountPaise,
        razorpayId: subscription?.id,
        customer: {
          id: subscription?.customer_id || 'cust_sub_generic',
          name: 'Subscriber',
          email: 'subscriber@example.com',
          phone: '+919876543210',
          ltvPaise: 5000000,
          totalSuccessfulTxns: 6,
          totalFailedTxns: 1,
          isOptedOut: false,
          isHumanHandled: false,
          lastContactedAt: null,
        },
        timestamp: now,
        source: 'WEBHOOK',
        payload: subscription || {},
      };
    }

    if (eventName === 'invoice.expired') {
      const invoice = payload.payload?.invoice?.entity as any;
      const amountPaise = invoice?.amount || 1500000;
      return {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        merchantId,
        eventType: eventName,
        leakType: LeakType.INVOICE_OVERDUE,
        amountPaise,
        razorpayId: invoice?.id,
        customer: {
          id: invoice?.customer_id || 'cust_inv_generic',
          name: invoice?.customer_details?.name || 'Corporate Client',
          email: invoice?.customer_details?.email || 'finance@client.in',
          phone: invoice?.customer_details?.contact || '+919812345678',
          ltvPaise: 15000000,
          totalSuccessfulTxns: 10,
          totalFailedTxns: 2,
          isOptedOut: false,
          isHumanHandled: false,
          lastContactedAt: null,
        },
        timestamp: now,
        source: 'WEBHOOK',
        payload: invoice || {},
      };
    }

    if (eventName === 'refund.created') {
      const refund = payload.payload?.refund?.entity as any;
      const amountPaise = refund?.amount || 399900;
      return {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        merchantId,
        eventType: eventName,
        leakType: LeakType.REFUND_REQUEST,
        amountPaise,
        razorpayId: refund?.id,
        customer: {
          id: 'cust_refund_user',
          name: 'Pooja Verma',
          email: 'pooja.verma@example.com',
          phone: '+919988776655',
          ltvPaise: 1200000,
          totalSuccessfulTxns: 3,
          totalFailedTxns: 0,
          isOptedOut: false,
          isHumanHandled: false,
          lastContactedAt: null,
        },
        timestamp: now,
        source: 'WEBHOOK',
        payload: refund || {},
      };
    }

    return null;
  }

  public normalizeWebhookEvent(payload: any, merchantId: string): InternalRevenueEvent | null {
    return this.normalizeWebhook(payload, merchantId);
  }
}

export const razorpayWebhookHandler = new RazorpayWebhookHandler();
export const webhookHandler = razorpayWebhookHandler;
