import { LeakType, LeakStage, AgentType, CustomerContext } from './types.js';

export interface InternalRevenueEvent {
  id: string;
  merchantId: string;
  eventType?: string;
  triggerEventType?: string;
  leakType: LeakType;
  leakStage?: LeakStage;
  assignedAgent?: AgentType;
  amountPaise: number;
  razorpayId?: string;
  customer: CustomerContext;
  timestamp: string;
  source?: 'WEBHOOK' | 'DEMO_SIMULATION' | 'INTERNAL_TELEMETRY';
  payload: Record<string, unknown>;
}

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment?: { entity: Record<string, unknown> };
    order?: { entity: Record<string, unknown> };
    subscription?: { entity: Record<string, unknown> };
    invoice?: { entity: Record<string, unknown> };
    payment_link?: { entity: Record<string, unknown> };
    refund?: { entity: Record<string, unknown> };
    [key: string]: unknown;
  };
  created_at: number;
}
