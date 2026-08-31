import test from 'node:test';
import assert from 'node:assert';
import { 
  AgentType, 
  LeakType, 
  RiskLevel, 
  SafetyStatus, 
  MerchantPolicyConfig, 
  CustomerContext,
  ProposedActionPayload,
  StructuredAIDecision 
} from '@revenueshield/shared';
import { safetyEngine } from '../engine.ts';
import { customerCoordinator } from '../coordinator.ts';

const mockPolicy: MerchantPolicyConfig = {
  maxAutonomousAmountPaise: 500000,      // ₹5,000 max
  maxDiscountPercentage: 15,            // 15% max
  maxRecoveryAttempts: 3,
  customerCooldownHours: 24,
  humanApprovalThresholdPaise: 1000000, // ₹10,000
  allowVoiceRecovery: true,
  allowStoreCreditCounter: true,
  optOutKeywords: ['STOP', 'UNSUBSCRIBE', 'OPTOUT', 'CANCEL', 'DND']
};

const mockCustomer: CustomerContext = {
  id: 'cust_test_01',
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '+919876543210',
  ltvPaise: 4500000,
  totalSuccessfulTxns: 10,
  totalFailedTxns: 1,
  isOptedOut: false,
  isHumanHandled: false
};

test('SafetyEngine passes valid low-risk action within policy limits', () => {
  const action: ProposedActionPayload = {
    actionType: 'CREATE_PAYMENT_LINK',
    amountPaise: 249900,
    discountPaise: 0,
    finalAmountPaise: 249900,
    customer: mockCustomer,
    description: 'Subscription Renewal'
  };

  const decision: StructuredAIDecision = {
    leakId: 'leak_1',
    agentType: AgentType.SUBSCRIPTION_RECOVERY,
    riskLevel: RiskLevel.LOW,
    rootCause: 'Card timeout',
    confidence: 0.95,
    recommendedAction: 'CREATE_PAYMENT_LINK',
    amountPaise: 249900,
    discountPercentage: 0,
    discountPaise: 0,
    finalAmountPaise: 249900,
    reason: 'Regular loyalty renewal',
    requiresHumanApproval: false
  };

  const result = safetyEngine.evaluate({
    action,
    decision,
    customer: mockCustomer,
    policy: mockPolicy,
    attemptCount: 1
  });

  assert.strictEqual(result.passed, true);
  assert.strictEqual(result.requiresHumanApproval, false);
  assert.strictEqual(result.status, SafetyStatus.PASSED);
});

test('SafetyEngine flags action exceeding max autonomous amount for human review', () => {
  const overLimitAction: ProposedActionPayload = {
    actionType: 'ISSUE_INVOICE',
    amountPaise: 2500000, // ₹25,000 > ₹5,000 limit
    discountPaise: 0,
    finalAmountPaise: 2500000,
    customer: mockCustomer,
    description: 'Enterprise License Overdue'
  };

  const decision: StructuredAIDecision = {
    leakId: 'leak_2',
    agentType: AgentType.RECEIVABLES,
    riskLevel: RiskLevel.HIGH,
    rootCause: 'B2B past due',
    confidence: 0.9,
    recommendedAction: 'ISSUE_INVOICE',
    amountPaise: 2500000,
    discountPercentage: 0,
    discountPaise: 0,
    finalAmountPaise: 2500000,
    reason: 'Invoice overdue',
    requiresHumanApproval: true
  };

  const result = safetyEngine.evaluate({
    action: overLimitAction,
    decision,
    customer: mockCustomer,
    policy: mockPolicy,
    attemptCount: 1
  });

  assert.strictEqual(result.passed, false);
  assert.strictEqual(result.requiresHumanApproval, true);
  assert.strictEqual(result.status, SafetyStatus.FLAGGED_HUMAN_REVIEW);
});

test('SafetyEngine blocks action on opted-out customer', () => {
  const optedOutCustomer: CustomerContext = {
    ...mockCustomer,
    isOptedOut: true
  };

  const action: ProposedActionPayload = {
    actionType: 'CREATE_PAYMENT_LINK',
    amountPaise: 100000,
    discountPaise: 0,
    finalAmountPaise: 100000,
    customer: optedOutCustomer,
    description: 'Test payment'
  };

  const decision: StructuredAIDecision = {
    leakId: 'leak_3',
    agentType: AgentType.CHECKOUT_RECOVERY,
    riskLevel: RiskLevel.LOW,
    rootCause: 'Abandoned cart',
    confidence: 0.9,
    recommendedAction: 'CREATE_PAYMENT_LINK',
    amountPaise: 100000,
    discountPercentage: 0,
    discountPaise: 0,
    finalAmountPaise: 100000,
    reason: 'Cart rescuer',
    requiresHumanApproval: false
  };

  const result = safetyEngine.evaluate({
    action,
    decision,
    customer: optedOutCustomer,
    policy: mockPolicy,
    attemptCount: 1
  });

  assert.strictEqual(result.passed, false);
  assert.strictEqual(result.status, SafetyStatus.BLOCKED_OPT_OUT);
});

test('CustomerCoordinator resolves multi-agent conflict prioritizing high-value subscription over cart', () => {
  const customerId = 'cust_multi_test';

  // Workflow 1: Active Subscription Recovery
  const coord1 = customerCoordinator.coordinateWorkflow({
    customerId,
    agentType: AgentType.SUBSCRIPTION_RECOVERY,
    leakType: LeakType.SUBSCRIPTION_FAILURE,
    leakId: 'leak_sub_active',
    status: 'ACTION_EXECUTED',
    amountPaise: 350000,
    startedAt: new Date()
  });

  assert.strictEqual(coord1.canProceed, true);

  // Workflow 2: Simultaneous Cart Abandonment attempt on same customer
  const coord2 = customerCoordinator.coordinateWorkflow({
    customerId,
    agentType: AgentType.CHECKOUT_RECOVERY,
    leakType: LeakType.CHECKOUT_ABANDONMENT,
    leakId: 'leak_cart_attempt',
    status: 'ANALYZING',
    amountPaise: 120000,
    startedAt: new Date()
  });

  assert.strictEqual(coord2.canProceed, false);
  assert.strictEqual(coord2.action, 'PAUSE_CANDIDATE');
  assert.strictEqual(coord2.conflictingAgent, AgentType.SUBSCRIPTION_RECOVERY);
});
