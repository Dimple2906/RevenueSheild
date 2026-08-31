export interface KpiMetricsData {
  revenueAtRiskPaise: number;
  revenueAtRiskFormatted: string;
  revenueRecoveredPaise: number;
  revenueRecoveredFormatted: string;
  revenueProtectedPaise: number;
  revenueProtectedFormatted: string;
  revenueLostPaise: number;
  revenueLostFormatted: string;
  recoveryRatePercentage: number;
  activeLeaksCount: number;
  recoveredLeaksCount: number;
  totalLeaksCount: number;
  autonomousActionPercentage: number;
}

export interface DashboardOverviewResponse {
  metrics?: KpiMetricsData;
  merchant?: {
    id: string;
    name: string;
    currency: string;
    mode: string;
  };
  totalAtRiskPaise: number;
  totalRecoveredPaise: number;
  activeRecoveriesCount: number;
  recoveryRatePercent: number;
}

export interface FunnelStageData {
  stage: string;
  label: string;
  description: string;
  totalPaise: number;
  recoveredPaise: number;
  count: number;
  totalFormatted: string;
  recoveredFormatted: string;
  recoveryRate: number;
}

export interface TimelinePoint {
  date: string;
  amountPaise: number;
  amountFormatted: string;
}

export interface RevenueLeakItem {
  id: string;
  leakType: string;
  leakStage: string;
  amountAtRiskPaise: number;
  amountAtRiskFormatted?: string;
  amountRecoveredPaise?: number;
  amountRecoveredFormatted?: string;
  priorityScore?: number;
  status: string;
  assignedAgent: string;
  rootCauseDiagnosis?: string;
  aiConfidenceScore?: number;
  recoveryStrategy?: string;
  requiresHumanReview?: boolean;
  detectedAt: string;
  resolvedAt?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    ltvPaise?: number;
    ltvFormatted?: string;
    isOptedOut?: boolean;
  };
  latestAction?: {
    id: string;
    actionType: string;
    amountPaise: number;
    discountPaise: number;
    razorpayResourceId?: string;
    razorpayResourceUrl?: string;
    status: string;
    isSimulated: boolean;
  };
  recoverySessions?: any[];
}

export type RevenueLeakCase = RevenueLeakItem;

export interface AgentInfo {
  type: string;
  name: string;
  description: string;
  stage: string;
  icon: string;
  status: 'ACTIVE' | 'STANDBY';
  totalCases: number;
  activeCases: number;
  successRatePercentage: number;
  totalRecoveredPaise: number;
}

export interface AgentActivityItem {
  id: string;
  merchantId?: string;
  leakId?: string;
  agentType?: string;
  eventType: string;
  message: string;
  amountAtRiskPaise?: number;
  timestamp: string;
  metadata?: any;
}

export interface AuditLogItem {
  id: string;
  merchantId: string;
  leakId?: string;
  agentType?: string;
  eventType: string;
  message: string;
  amountAtRiskPaise?: number;
  amountAtRiskFormatted?: string;
  amountRecoveredFormatted?: string;
  metadata?: string;
  parsedMetadata?: any;
  timestamp: string;
  createdAt?: string;
  leak?: {
    id: string;
    leakType: string;
    customer?: { name: string; email: string };
  };
}

export interface MerchantPolicyData {
  id: string;
  maxAutonomousAmountPaise: number;
  maxDiscountPercentage: number;
  maxRecoveryAttempts: number;
  customerCooldownHours: number;
  humanApprovalThresholdPaise: number;
  allowVoiceRecovery: boolean;
  allowStoreCreditCounter: boolean;
  optOutKeywords: string;
}
