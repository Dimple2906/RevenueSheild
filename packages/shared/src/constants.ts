import { AgentType, LeakType, LeakStage, MerchantPolicyConfig } from './types.js';

export const DEFAULT_MERCHANT_POLICY: MerchantPolicyConfig = {
  maxAutonomousAmountPaise: 500000,      // ₹5,000 max autonomous execution
  maxDiscountPercentage: 15,            // Max 15% discount
  maxRecoveryAttempts: 3,               // Max 3 recovery outreach touches
  customerCooldownHours: 24,            // 24 hours quiet window between contacts
  humanApprovalThresholdPaise: 1000000, // ₹10,000+ requires human sign-off
  allowVoiceRecovery: true,
  allowStoreCreditCounter: true,
  optOutKeywords: ['STOP', 'UNSUBSCRIBE', 'OPTOUT', 'CANCEL', 'DND']
};

export const LEAK_TYPE_TO_AGENT_MAP: Record<LeakType, AgentType> = {
  [LeakType.SUBSCRIPTION_FAILURE]: AgentType.SUBSCRIPTION_RECOVERY,
  [LeakType.CHECKOUT_ABANDONMENT]: AgentType.CHECKOUT_RECOVERY,
  [LeakType.INFRASTRUCTURE_DEGRADATION]: AgentType.INFRASTRUCTURE_GUARD,
  [LeakType.MANDATE_EXPIRY]: AgentType.MANDATE_RENEWAL,
  [LeakType.INVOICE_OVERDUE]: AgentType.RECEIVABLES,
  [LeakType.CHURN_RISK]: AgentType.CHURN_PREVENTION,
  [LeakType.REFUND_REQUEST]: AgentType.REFUND_RECOVERY,
  [LeakType.PROMISE_BREACH]: AgentType.PROMISE_TO_PAY,
  [LeakType.VOICE_RECOVERY]: AgentType.VOICE_RECOVERY,
  [LeakType.PAYMENT_CLUSTER]: AgentType.PAYMENT_DETECTIVE,
};

export const LEAK_TYPE_TO_STAGE_MAP: Record<LeakType, LeakStage> = {
  [LeakType.CHECKOUT_ABANDONMENT]: LeakStage.PRE_PAYMENT,
  [LeakType.CHURN_RISK]: LeakStage.PRE_PAYMENT,
  
  [LeakType.SUBSCRIPTION_FAILURE]: LeakStage.AT_PAYMENT,
  [LeakType.INFRASTRUCTURE_DEGRADATION]: LeakStage.AT_PAYMENT,
  [LeakType.MANDATE_EXPIRY]: LeakStage.AT_PAYMENT,
  [LeakType.PAYMENT_CLUSTER]: LeakStage.AT_PAYMENT,

  [LeakType.INVOICE_OVERDUE]: LeakStage.POST_PAYMENT,
  [LeakType.REFUND_REQUEST]: LeakStage.POST_PAYMENT,
  [LeakType.PROMISE_BREACH]: LeakStage.POST_PAYMENT,
  [LeakType.VOICE_RECOVERY]: LeakStage.POST_PAYMENT,
};

export const AGENT_METADATA: Record<AgentType, {
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  capabilities: string[];
}> = {
  [AgentType.SUBSCRIPTION_RECOVERY]: {
    name: 'Subscription Recovery Agent',
    shortName: 'SubRescue',
    description: 'Diagnoses recurring payment failures, generates automated payment links and dunning schedules.',
    icon: 'RefreshCw',
    color: '#3B82F6',
    capabilities: ['Card retry', 'Dynamic payment link', 'Auto-dunning', 'Grace period management']
  },
  [AgentType.INFRASTRUCTURE_GUARD]: {
    name: 'Infrastructure Guard Agent',
    shortName: 'InfraGuard',
    description: 'Monitors payment gateways in real-time to detect bank/NPCI degradations and recommend routing fallbacks.',
    icon: 'ShieldAlert',
    color: '#EF4444',
    capabilities: ['UPI anomaly detection', 'Bank gateway RCA', 'Smart routing advice', 'Spike mitigation']
  },
  [AgentType.CHECKOUT_RECOVERY]: {
    name: 'Checkout Recovery Agent',
    shortName: 'CartRescuer',
    description: 'Recovers high-intent abandoned checkout sessions with bounded discount incentives.',
    icon: 'ShoppingCart',
    color: '#10B981',
    capabilities: ['Cart abandonment triage', 'Personalized recovery link', 'Price elasticity calculation']
  },
  [AgentType.MANDATE_RENEWAL]: {
    name: 'Mandate Renewal Agent',
    shortName: 'MandateGuard',
    description: 'Identifies expiring eNACH/UPI Autopay mandates and engages customers before renewal billing failures.',
    icon: 'CalendarClock',
    color: '#8B5CF6',
    capabilities: ['Mandate expiration watcher', 'Proactive token refresh', 'UPI Autopay renewal']
  },
  [AgentType.REFUND_RECOVERY]: {
    name: 'Refund Recovery Agent',
    shortName: 'RefundShield',
    description: 'Intercepts refund requests with bounded store credit + bonus balance counteroffers to protect GMV.',
    icon: 'ShieldCheck',
    color: '#F59E0B',
    capabilities: ['Return reason NLP', 'Store credit counteroffer', 'Graceful refund fallback']
  },
  [AgentType.RECEIVABLES]: {
    name: 'Receivables & Invoice Agent',
    shortName: 'Invoicer',
    description: 'Tracks aging B2B invoices and orchestrates graduated payment reminders and auto-generated links.',
    icon: 'FileText',
    color: '#06B6D4',
    capabilities: ['Aging bracket tracking', 'Automated Razorpay Invoices', 'Tiered escalation']
  },
  [AgentType.PROMISE_TO_PAY]: {
    name: 'Promise-to-Pay Agent',
    shortName: 'PromiseGuard',
    description: 'Parses conversational commitments, extracts promised amount & date, and tracks settlement.',
    icon: 'Handshake',
    color: '#EC4899',
    capabilities: ['NLP date/amount extraction', 'Time-locked payment links', 'Breach escalation']
  },
  [AgentType.CHURN_PREVENTION]: {
    name: 'Churn Prevention Agent',
    shortName: 'ChurnRescuer',
    description: 'Identifies behavioral signals predicting subscriber churn and executes bounded retention interventions.',
    icon: 'UserMinus',
    color: '#6366F1',
    capabilities: ['Churn risk modeling', 'Retention coupon bounds', 'Plan downgrade suggestion']
  },
  [AgentType.VOICE_RECOVERY]: {
    name: 'Voice Recovery Agent',
    shortName: 'VoiceGuard',
    description: 'Generates multilingual voice recovery calls (Hinglish/Tamil/English) with TRAI contact window enforcement.',
    icon: 'PhoneCall',
    color: '#14B8A6',
    capabilities: ['Multilingual script synthesis', 'TRAI 9AM-8PM compliance', 'Interactive audio player']
  },
  [AgentType.PAYMENT_DETECTIVE]: {
    name: 'Payment Detective Agent',
    shortName: 'Detective',
    description: 'Analyzes cross-merchant payment failure clusters and isolates root causes (Issuer vs Acquirer vs Merchant).',
    icon: 'Search',
    color: '#64748B',
    capabilities: ['Cluster anomaly grouping', 'Failure code correlation', 'Merchant error troubleshooting']
  }
};
