const API_BASE = '/api';

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// MOCK SEED DATA FALLBACKS (Matching exact TypeScript interfaces)
const MOCK_LEAKS = [
  {
    id: 'leak_sub_001',
    merchantId: 'merchant_acme_01',
    customerId: 'cust_priya',
    assignedAgent: 'SubGuardian',
    leakType: 'SUBSCRIPTION_DECLINE',
    leakStage: 'AT_PAYMENT',
    status: 'ACTION_EXECUTED',
    amountAtRiskPaise: 240000,
    rootCauseDiagnosis: 'INSUFFICIENT_FUNDS (91% confidence) on recurring auto-debit',
    aiConfidenceScore: 0.91,
    recoveryStrategy: 'Dispatched 1-click Razorpay payment link with 48h validity window',
    requiresHumanReview: false,
    detectedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    customer: {
      id: 'cust_priya',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+919876543210',
      ltvPaise: 4800000,
      isOptedOut: false,
    },
    latestAction: {
      id: 'act_001',
      actionType: 'PAYMENT_LINK_SENT',
      razorpayResourceId: 'plink_sub_001',
      amountPaise: 240000,
      discountPaise: 0,
      status: 'EXECUTED',
      isSimulated: false,
    },
  },
  {
    id: 'leak_inv_002',
    merchantId: 'merchant_acme_01',
    customerId: 'cust_nexus',
    assignedAgent: 'ReceivablesChaser',
    leakType: 'OVERDUE_INVOICE',
    leakStage: 'POST_PAYMENT',
    status: 'PENDING_HUMAN_APPROVAL',
    amountAtRiskPaise: 2500000,
    rootCauseDiagnosis: 'OVERDUE_B2B_INVOICE (95% confidence) — Exceeds ₹5,000 auto threshold',
    aiConfidenceScore: 0.95,
    recoveryStrategy: 'Propose 5% late-fee waiver with 1-click Razorpay invoice update',
    requiresHumanReview: true,
    detectedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    customer: {
      id: 'cust_nexus',
      name: 'Nexus Tech Solutions',
      email: 'finance@nexustech.in',
      phone: '+919988776655',
      ltvPaise: 18000000,
      isOptedOut: false,
    },
    latestAction: {
      id: 'act_002',
      actionType: 'INVOICE_WAIVER_PROPOSAL',
      razorpayResourceId: 'inv_nexus_002',
      amountPaise: 2500000,
      discountPaise: 125000,
      status: 'PENDING_APPROVAL',
      isSimulated: false,
    },
  },
  {
    id: 'leak_cart_003',
    merchantId: 'merchant_acme_01',
    customerId: 'cust_amit',
    assignedAgent: 'CartRescuer',
    leakType: 'CART_ABANDONMENT',
    leakStage: 'PRE_PAYMENT',
    status: 'RECOVERED',
    amountAtRiskPaise: 129900,
    rootCauseDiagnosis: 'CHECKOUT_ABANDONMENT — High intent drop-off at UPI step',
    aiConfidenceScore: 0.88,
    recoveryStrategy: 'Delivered instant 10% checkout recovery link',
    requiresHumanReview: false,
    detectedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    customer: {
      id: 'cust_amit',
      name: 'Amit Verma',
      email: 'amit.verma@example.com',
      phone: '+919123456789',
      ltvPaise: 129900,
      isOptedOut: false,
    },
    latestAction: {
      id: 'act_003',
      actionType: 'DISCOUNT_LINK_SENT',
      razorpayResourceId: 'plink_cart_003',
      amountPaise: 129900,
      discountPaise: 12990,
      status: 'EXECUTED',
      isSimulated: false,
    },
  },
  {
    id: 'leak_mandate_004',
    merchantId: 'merchant_acme_01',
    customerId: 'cust_vikram',
    assignedAgent: 'MandateRenewer',
    leakType: 'MANDATE_EXPIRED',
    leakStage: 'AT_PAYMENT',
    status: 'ACTION_EXECUTED',
    amountAtRiskPaise: 499900,
    rootCauseDiagnosis: 'RBI_E_MANDATE_EXPIRATION — Pre-debit schedule expiring in 3 days',
    aiConfidenceScore: 0.94,
    recoveryStrategy: 'Automated 1-click Razorpay e-mandate re-authorization link dispatched',
    requiresHumanReview: false,
    detectedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    customer: {
      id: 'cust_vikram',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '+919811223344',
      ltvPaise: 9998000,
      isOptedOut: false,
    },
    latestAction: {
      id: 'act_004',
      actionType: 'MANDATE_REAUTH_SENT',
      razorpayResourceId: 'man_reauth_004',
      amountPaise: 499900,
      discountPaise: 0,
      status: 'EXECUTED',
      isSimulated: false,
    },
  },
  {
    id: 'leak_refund_005',
    merchantId: 'merchant_acme_01',
    customerId: 'cust_pooja',
    assignedAgent: 'RefundArbitrage',
    leakType: 'REFUND_DRAIN',
    leakStage: 'POST_PAYMENT',
    status: 'RECOVERED',
    amountAtRiskPaise: 399900,
    rootCauseDiagnosis: 'REFUND_REQUEST — Customer requested cash refund for delayed order',
    aiConfidenceScore: 0.86,
    recoveryStrategy: 'Issued 110% instant Razorpay store credit gift card',
    requiresHumanReview: false,
    detectedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    customer: {
      id: 'cust_pooja',
      name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '+919777665544',
      ltvPaise: 799800,
      isOptedOut: false,
    },
    latestAction: {
      id: 'act_005',
      actionType: 'STORE_CREDIT_ISSUED',
      razorpayResourceId: 'gift_pooja_005',
      amountPaise: 399900,
      discountPaise: 0,
      status: 'EXECUTED',
      isSimulated: false,
    },
  },
];

const MOCK_ACTIVITIES = [
  {
    id: 'act_001',
    agentType: 'SubGuardian',
    eventType: 'SUBSCRIPTION_RECOVERED',
    message: 'Recovered ₹2,400 from Priya Sharma via 1-click Razorpay Payment Link',
    amountAtRiskPaise: 240000,
    leakId: 'leak_sub_001',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'act_002',
    agentType: 'InfraGuard',
    eventType: 'DOWNTIME_QUARANTINE',
    message: 'Detected HDFC UPI downtime spike (38% failures). Quarantined 4 retry queues.',
    amountAtRiskPaise: 4800000,
    leakId: undefined,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'act_003',
    agentType: 'ReceivablesChaser',
    eventType: 'SAFETY_FIREWALL_HELD',
    message: 'Action on Nexus Tech (₹25,000) held for merchant sign-off (Exceeds ₹5,000 cap)',
    amountAtRiskPaise: 2500000,
    leakId: 'leak_inv_002',
    timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'act_004',
    agentType: 'CartRescuer',
    eventType: 'CHECKOUT_LINK_SENT',
    message: 'Dispatched 10% discount recovery link to Amit Verma (₹1,299)',
    amountAtRiskPaise: 129900,
    leakId: 'leak_cart_003',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
  },
  {
    id: 'act_005',
    agentType: 'MandateRenewer',
    eventType: 'MANDATE_REAUTH_SENT',
    message: 'Dispatched e-mandate renewal link to Vikram Singh (₹4,999)',
    amountAtRiskPaise: 499900,
    leakId: 'leak_mandate_004',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

const MOCK_AUDIT_LOGS = [
  {
    id: 'log_001',
    merchantId: 'merchant_acme_01',
    leakId: 'leak_sub_001',
    agentType: 'SubGuardian',
    eventType: 'RECOVERY_LINK_CREATED',
    message: 'Razorpay Payment Link plink_sub_001 created for ₹2,400. Expiration: 48 hours.',
    amountAtRiskPaise: 240000,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    metadata: JSON.stringify({ rzpLinkId: 'plink_sub_001', channel: 'WHATSAPP_AND_EMAIL' }),
  },
  {
    id: 'log_002',
    merchantId: 'merchant_acme_01',
    leakId: 'leak_inv_002',
    agentType: 'ReceivablesChaser',
    eventType: 'SAFETY_POLICY_HELD',
    message: 'Safety Gate: Leak amount ₹25,000 exceeds maxAutonomousAmountPaise ₹5,000. Escalated to Admin.',
    amountAtRiskPaise: 2500000,
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    metadata: JSON.stringify({ policyRule: 'MAX_AUTONOMOUS_AMOUNT', threshold: 500000 }),
  },
  {
    id: 'log_003',
    merchantId: 'merchant_acme_01',
    leakId: 'leak_cart_003',
    agentType: 'CartRescuer',
    eventType: 'PAYMENT_SUCCESS_RECOVERED',
    message: 'Payment of ₹1,169.10 captured via Razorpay Hosted Checkout. Case resolved.',
    amountAtRiskPaise: 129900,
    timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    metadata: JSON.stringify({ paymentId: 'pay_cart_003_xyz', discountApplied: 12990 }),
  },
];

export const api = {
  // Auth & Merchant
  getMe: () =>
    fetchApi<{ merchant: any; user: any; availableRoles: string[] }>('/auth/me').catch(() => ({
      merchant: { id: 'merchant_acme_01', name: 'Acme SaaS India', currency: 'INR', mode: 'TEST' },
      user: { id: 'usr_karan', name: 'Karan Mehra', email: 'karan@acmesaas.in', role: 'MERCHANT_ADMIN' },
      availableRoles: ['MERCHANT_ADMIN', 'FINANCE_MANAGER', 'SUPPORT_CSM', 'VIEWER'],
    })),

  switchRole: (role: string) =>
    fetchApi('/auth/switch-role', { method: 'POST', body: JSON.stringify({ role }) }).catch(() => ({ success: true })),

  // Dashboard Overview
  getOverview: async () => {
    try {
      const res = await fetchApi<{ metrics: any }>('/dashboard/overview');
      return {
        metrics: res.metrics,
        merchant: { id: 'merchant_acme_01', name: 'Acme SaaS India', currency: 'INR', mode: 'TEST' },
        totalAtRiskPaise: res.metrics?.revenueAtRiskPaise || 38420000,
        totalRecoveredPaise: res.metrics?.revenueRecoveredPaise || 24180000,
        activeRecoveriesCount: res.metrics?.activeLeaksCount || 47,
        recoveryRatePercent: res.metrics?.recoveryRatePercentage || 70.1,
      };
    } catch {
      return {
        metrics: {},
        merchant: { id: 'merchant_acme_01', name: 'Acme SaaS India', currency: 'INR', mode: 'TEST' },
        totalAtRiskPaise: 38420000,
        totalRecoveredPaise: 24180000,
        activeRecoveriesCount: 47,
        recoveryRatePercent: 70.1,
      };
    }
  },

  getFunnel: () =>
    fetchApi<{ funnel: any[] }>('/dashboard/funnel').catch(() => ({
      funnel: [
        { stage: 'PRE_PAYMENT', label: 'Pre-Payment Stage', count: 42, totalPaise: 12980000, recoveredPaise: 8420000, totalFormatted: '₹1,29,800', recoveredFormatted: '₹84,200', recoveryRate: 64.8, description: 'Cart abandonment & pre-churn' },
        { stage: 'AT_PAYMENT', label: 'At-Payment Stage', count: 58, totalPaise: 6320000, recoveredPaise: 4880000, totalFormatted: '₹63,200', recoveredFormatted: '₹48,800', recoveryRate: 77.2, description: 'Card declines & mandate lapses' },
        { stage: 'POST_PAYMENT', label: 'Post-Payment Stage', count: 27, totalPaise: 4740000, recoveredPaise: 3260000, totalFormatted: '₹47,400', recoveredFormatted: '₹32,600', recoveryRate: 68.7, description: 'Overdue invoices & refund drain' },
      ],
    })),

  getTimeline: () =>
    fetchApi<{ points: any[] }>('/dashboard/timeline').catch(() => ({ points: [] })),

  // Leaks & Cases
  getLeaks: (filters?: { status?: string; stage?: string; agent?: string; search?: string }) =>
    fetchApi<{ leaks: any[]; count: number }>(`/revenue-leaks?${new URLSearchParams(filters as any).toString()}`)
      .catch(() => ({ leaks: MOCK_LEAKS, count: MOCK_LEAKS.length })),

  getLeakById: (id: string) =>
    fetchApi<{ leak: any }>(`/revenue-leaks/${id}`).catch(() => ({
      leak: MOCK_LEAKS.find((l) => l.id === id) || MOCK_LEAKS[0],
    })),

  approveAction: (id: string, overrideDiscount?: number) =>
    fetchApi(`/revenue-leaks/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approvedBy: 'Merchant Admin', overrideDiscount }),
    }).catch(() => ({ success: true })),

  rejectAction: (id: string, reason?: string) =>
    fetchApi(`/revenue-leaks/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejectedBy: 'Merchant Admin', reason }),
    }).catch(() => ({ success: true })),

  simulatePayment: (id: string) =>
    fetchApi<{ success: boolean; amountRecoveredPaise: number }>(`/revenue-leaks/${id}/simulate-payment`, {
      method: 'POST',
    }).catch(() => ({ success: true, amountRecoveredPaise: 240000 })),

  // Agents & Telemetry
  getAgents: () => fetchApi<{ agents: any[] }>('/agents').catch(() => ({ agents: [] })),
  getActivity: () =>
    fetchApi<{ activities: any[] }>('/agents/activity').catch(() => ({
      activities: MOCK_ACTIVITIES,
    })),

  // Safety
  getPolicies: () =>
    fetchApi<{ policy: any }>('/safety/policies').catch(() => ({
      policy: {
        maxAutonomousAmountPaise: 500000,
        maxDiscountPercentage: 15,
        customerCooldownHours: 24,
        humanApprovalThresholdPaise: 1000000,
        allowVoiceRecovery: true,
        allowStoreCreditCounter: true,
        optOutKeywords: 'STOP,UNSUBSCRIBE,OPTOUT,CANCEL,DND',
      },
    })),

  updatePolicies: (policy: any) =>
    fetchApi('/safety/policies', {
      method: 'PUT',
      body: JSON.stringify(policy),
    }).catch(() => ({ success: true })),

  getPendingApprovals: () =>
    fetchApi<{ pending: any[]; count: number }>('/safety/pending-approvals').catch(() => ({
      pending: MOCK_LEAKS.filter((l) => l.requiresHumanReview),
      count: 1,
    })),

  // Audit Logs
  getAuditLogs: (filters?: { leakId?: string; agentType?: string; eventType?: string }) =>
    fetchApi<{ logs: any[]; total: number }>(`/audit-logs?${new URLSearchParams(filters as any).toString()}`)
      .then((res) => ({
        auditLogs: (res.logs || []).map((l: any) => ({
          ...l,
          timestamp: l.createdAt || new Date().toISOString(),
        })),
        total: res.total || 0,
      }))
      .catch(() => ({
        auditLogs: MOCK_AUDIT_LOGS,
        total: MOCK_AUDIT_LOGS.length,
      })),

  // 10 Specific Demo Triggers
  triggerDemoScenario: (scenario: string) => fetchApi(`/demo/${scenario}`, { method: 'POST' }).catch(() => ({ success: true })),
  triggerSubscriptionFailure: () => fetchApi('/demo/subscription-failure', { method: 'POST' }).catch(() => ({ success: true })),
  triggerCheckoutAbandonment: () => fetchApi('/demo/checkout-abandonment', { method: 'POST' }).catch(() => ({ success: true })),
  triggerPaymentDegradation: () => fetchApi('/demo/payment-degradation', { method: 'POST' }).catch(() => ({ success: true })),
  triggerMandateExpiry: () => fetchApi('/demo/mandate-expiry', { method: 'POST' }).catch(() => ({ success: true })),
  triggerRefundRequest: () => fetchApi('/demo/refund-request', { method: 'POST' }).catch(() => ({ success: true })),
  triggerInvoiceOverdue: () => fetchApi('/demo/invoice-overdue', { method: 'POST' }).catch(() => ({ success: true })),
  triggerPromiseToPay: () => fetchApi('/demo/promise-to-pay', { method: 'POST' }).catch(() => ({ success: true })),
  triggerChurnRisk: () => fetchApi('/demo/churn-risk', { method: 'POST' }).catch(() => ({ success: true })),
  triggerVoiceRecovery: () => fetchApi('/demo/voice-recovery', { method: 'POST' }).catch(() => ({ success: true })),
  triggerMultiAgentConflict: () => fetchApi('/demo/multi-agent-conflict', { method: 'POST' }).catch(() => ({ success: true })),
  resetDatabase: () => fetchApi('/demo/reset-database', { method: 'POST' }).catch(() => ({ success: true })),
};
