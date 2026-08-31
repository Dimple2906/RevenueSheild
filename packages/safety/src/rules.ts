import { 
  CustomerContext, 
  MerchantPolicyConfig, 
  StructuredAIDecision, 
  ProposedActionPayload 
} from '@revenueshield/shared';

export interface RuleEvaluation {
  ruleName: string;
  passed: boolean;
  requiresHumanReview?: boolean;
  violationMessage?: string;
  reason: string;
}

export function evaluateMaxAutonomousAmount(
  action: ProposedActionPayload,
  policy: MerchantPolicyConfig
): RuleEvaluation {
  const isWithinLimit = action.finalAmountPaise <= policy.maxAutonomousAmountPaise;
  if (!isWithinLimit) {
    return {
      ruleName: 'MaxAutonomousAmountRule',
      passed: false,
      requiresHumanReview: true,
      violationMessage: `Action amount (₹${(action.finalAmountPaise / 100).toLocaleString('en-IN')}) exceeds autonomous limit of ₹${(policy.maxAutonomousAmountPaise / 100).toLocaleString('en-IN')}.`,
      reason: 'High-value transaction requires merchant approval.'
    };
  }
  return {
    ruleName: 'MaxAutonomousAmountRule',
    passed: true,
    reason: `Action amount ₹${(action.finalAmountPaise / 100).toLocaleString('en-IN')} is within autonomous threshold.`
  };
}

export function evaluateMaxDiscountPercentage(
  decision: StructuredAIDecision,
  policy: MerchantPolicyConfig
): RuleEvaluation {
  const isWithinDiscountCap = decision.discountPercentage <= policy.maxDiscountPercentage;
  if (!isWithinDiscountCap) {
    return {
      ruleName: 'MaxDiscountPercentageRule',
      passed: false,
      requiresHumanReview: true,
      violationMessage: `Proposed discount ${decision.discountPercentage}% exceeds policy cap of ${policy.maxDiscountPercentage}%.`,
      reason: 'Excessive discount incentive proposed.'
    };
  }
  return {
    ruleName: 'MaxDiscountPercentageRule',
    passed: true,
    reason: `Discount of ${decision.discountPercentage}% is within allowed ${policy.maxDiscountPercentage}% cap.`
  };
}

export function evaluateMaxRecoveryAttempts(
  currentAttemptCount: number,
  policy: MerchantPolicyConfig
): RuleEvaluation {
  const isWithinAttempts = currentAttemptCount <= policy.maxRecoveryAttempts;
  if (!isWithinAttempts) {
    return {
      ruleName: 'MaxRecoveryAttemptsRule',
      passed: false,
      violationMessage: `Recovery attempt #${currentAttemptCount} exceeds limit of ${policy.maxRecoveryAttempts}. Automated outreach halted.`,
      reason: 'Preventing excessive customer dunning fatigue.'
    };
  }
  return {
    ruleName: 'MaxRecoveryAttemptsRule',
    passed: true,
    reason: `Attempt #${currentAttemptCount} of ${policy.maxRecoveryAttempts} allowed.`
  };
}

export function evaluateCustomerCooldown(
  customer: CustomerContext,
  policy: MerchantPolicyConfig
): RuleEvaluation {
  if (!customer.lastContactedAt) {
    return {
      ruleName: 'CustomerCooldownRule',
      passed: true,
      reason: 'Customer has no prior contact history.'
    };
  }

  const lastContact = new Date(customer.lastContactedAt).getTime();
  const now = Date.now();
  const elapsedHours = (now - lastContact) / (1000 * 60 * 60);

  if (elapsedHours < policy.customerCooldownHours) {
    const remainingHours = Math.ceil(policy.customerCooldownHours - elapsedHours);
    return {
      ruleName: 'CustomerCooldownRule',
      passed: false,
      violationMessage: `Customer was contacted ${elapsedHours.toFixed(1)}h ago. Cooldown active for another ${remainingHours}h.`,
      reason: 'Customer in quiet period to avoid spam.'
    };
  }

  return {
    ruleName: 'CustomerCooldownRule',
    passed: true,
    reason: `Customer quiet cooldown window (${policy.customerCooldownHours}h) satisfied.`
  };
}

export function evaluateOptOutProtection(
  customer: CustomerContext,
  rawTextSample?: string,
  policy?: MerchantPolicyConfig
): RuleEvaluation {
  if (customer.isOptedOut) {
    return {
      ruleName: 'OptOutProtectionRule',
      passed: false,
      violationMessage: 'Customer has explicitly opted out of automated communications.',
      reason: 'Strict DND/Opt-Out compliance.'
    };
  }

  if (rawTextSample && policy?.optOutKeywords) {
    const upperText = rawTextSample.toUpperCase();
    const hasOptOut = policy.optOutKeywords.some(kw => upperText.includes(kw));
    if (hasOptOut) {
      return {
        ruleName: 'OptOutProtectionRule',
        passed: false,
        violationMessage: `Opt-out keyword detected in customer message stream.`,
        reason: 'Immediate automatic opt-out trigger.'
      };
    }
  }

  return {
    ruleName: 'OptOutProtectionRule',
    passed: true,
    reason: 'Customer is active and subscribed.'
  };
}

export function evaluateHumanProtectedCase(
  customer: CustomerContext
): RuleEvaluation {
  if (customer.isHumanHandled) {
    return {
      ruleName: 'HumanProtectedCaseRule',
      passed: false,
      requiresHumanReview: true,
      violationMessage: 'A human support/finance agent is actively managing this customer. Autonomous actions paused.',
      reason: 'Preventing bot collision with human representative.'
    };
  }

  return {
    ruleName: 'HumanProtectedCaseRule',
    passed: true,
    reason: 'No active human agent lock on customer.'
  };
}

export function evaluateHumanApprovalThreshold(
  action: ProposedActionPayload,
  policy: MerchantPolicyConfig
): RuleEvaluation {
  if (action.finalAmountPaise >= policy.humanApprovalThresholdPaise) {
    return {
      ruleName: 'HumanApprovalThresholdRule',
      passed: false,
      requiresHumanReview: true,
      violationMessage: `Action amount ₹${(action.finalAmountPaise / 100).toLocaleString('en-IN')} meets or exceeds high-tier threshold ₹${(policy.humanApprovalThresholdPaise / 100).toLocaleString('en-IN')}.`,
      reason: 'Mandatory human approval tier.'
    };
  }

  return {
    ruleName: 'HumanApprovalThresholdRule',
    passed: true,
    reason: 'Below mandatory human approval threshold.'
  };
}
