export enum Role {
  MERCHANT_ADMIN = 'MERCHANT_ADMIN',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  SUPPORT_CSM = 'SUPPORT_CSM',
  VIEWER = 'VIEWER'
}

export enum LeakType {
  SUBSCRIPTION_FAILURE = 'SUBSCRIPTION_FAILURE',
  CHECKOUT_ABANDONMENT = 'CHECKOUT_ABANDONMENT',
  INFRASTRUCTURE_DEGRADATION = 'INFRASTRUCTURE_DEGRADATION',
  MANDATE_EXPIRY = 'MANDATE_EXPIRY',
  INVOICE_OVERDUE = 'INVOICE_OVERDUE',
  CHURN_RISK = 'CHURN_RISK',
  REFUND_REQUEST = 'REFUND_REQUEST',
  PROMISE_BREACH = 'PROMISE_BREACH',
  VOICE_RECOVERY = 'VOICE_RECOVERY',
  PAYMENT_CLUSTER = 'PAYMENT_CLUSTER'
}

export enum LeakStage {
  PRE_PAYMENT = 'PRE_PAYMENT',
  AT_PAYMENT = 'AT_PAYMENT',
  POST_PAYMENT = 'POST_PAYMENT'
}

export enum LeakStatus {
  DETECTED = 'DETECTED',
  ANALYZING = 'ANALYZING',
  STRATEGY_SELECTED = 'STRATEGY_SELECTED',
  ACTION_PROPOSED = 'ACTION_PROPOSED',
  PENDING_HUMAN_APPROVAL = 'PENDING_HUMAN_APPROVAL',
  ACTION_EXECUTED = 'ACTION_EXECUTED',
  MONITORING = 'MONITORING',
  RECOVERED = 'RECOVERED',
  LOST = 'LOST',
  ESCALATED = 'ESCALATED',
  STOPPED = 'STOPPED'
}

export enum SafetyStatus {
  PASSED = 'PASSED',
  FLAGGED_HUMAN_REVIEW = 'FLAGGED_HUMAN_REVIEW',
  BLOCKED_LIMIT_EXCEEDED = 'BLOCKED_LIMIT_EXCEEDED',
  BLOCKED_COOLDOWN = 'BLOCKED_COOLDOWN',
  BLOCKED_OPT_OUT = 'BLOCKED_OPT_OUT',
  BLOCKED_CONFLICT = 'BLOCKED_CONFLICT'
}

export enum AgentType {
  SUBSCRIPTION_RECOVERY = 'SUBSCRIPTION_RECOVERY',
  INFRASTRUCTURE_GUARD = 'INFRASTRUCTURE_GUARD',
  CHECKOUT_RECOVERY = 'CHECKOUT_RECOVERY',
  MANDATE_RENEWAL = 'MANDATE_RENEWAL',
  REFUND_RECOVERY = 'REFUND_RECOVERY',
  RECEIVABLES = 'RECEIVABLES',
  PROMISE_TO_PAY = 'PROMISE_TO_PAY',
  CHURN_PREVENTION = 'CHURN_PREVENTION',
  VOICE_RECOVERY = 'VOICE_RECOVERY',
  PAYMENT_DETECTIVE = 'PAYMENT_DETECTIVE'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface CustomerContext {
  id: string;
  name: string;
  email: string;
  phone: string;
  ltvPaise: number;
  totalSuccessfulTxns: number;
  totalFailedTxns: number;
  isOptedOut: boolean;
  isHumanHandled: boolean;
  lastContactedAt?: string | null;
}

export interface MerchantPolicyConfig {
  maxAutonomousAmountPaise: number; // e.g. 500000 (₹5,000)
  maxDiscountPercentage: number;     // e.g. 15 (%)
  maxRecoveryAttempts: number;      // e.g. 3
  customerCooldownHours: number;    // e.g. 24
  humanApprovalThresholdPaise: number; // e.g. 1000000 (₹10,000)
  allowVoiceRecovery: boolean;
  allowStoreCreditCounter: boolean;
  optOutKeywords: string[];
}

export interface StructuredAIDecision {
  leakId: string;
  agentType: AgentType;
  riskLevel: RiskLevel;
  rootCause: string;
  confidence: number;
  recommendedAction: string;
  amountPaise: number;
  discountPercentage: number;
  discountPaise: number;
  finalAmountPaise: number;
  reason: string;
  requiresHumanApproval: boolean;
  metadata?: Record<string, unknown>;
}

export interface SafetyCheckResult {
  passed: boolean;
  status: SafetyStatus;
  policyViolations: string[];
  requiresHumanApproval: boolean;
  checkedRules: {
    ruleName: string;
    passed: boolean;
    reason: string;
  }[];
}

export interface ProposedActionPayload {
  actionType: string;
  amountPaise: number;
  discountPaise: number;
  finalAmountPaise: number;
  customer: CustomerContext;
  description: string;
  expiresInHours?: number;
  customNotes?: string;
  metadata?: Record<string, unknown>;
}

export interface ActionExecutionResult {
  success: boolean;
  razorpayResourceId?: string;
  razorpayResourceUrl?: string;
  isSimulated: boolean;
  message: string;
  error?: string;
}

export interface AuditEventDTO {
  id: string;
  merchantId: string;
  leakId?: string | null;
  agentType?: AgentType | null;
  eventType: string;
  message: string;
  metadata?: Record<string, unknown> | null;
  amountAtRiskPaise?: number | null;
  amountRecoveredPaise?: number | null;
  createdAt: string;
}

export interface DashboardMetricsDTO {
  revenueAtRiskPaise: number;
  revenueRecoveredPaise: number;
  revenueProtectedPaise: number;
  revenueLostPaise: number;
  recoveryRatePercentage: number;
  activeRecoveryCases: number;
  averageRecoveryTimeMinutes: number;
  successfulRecoveriesCount: number;
  stageBreakdown: {
    prePaymentPaise: number;
    atPaymentPaise: number;
    postPaymentPaise: number;
  };
}
