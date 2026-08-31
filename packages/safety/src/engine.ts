import { 
  CustomerContext, 
  MerchantPolicyConfig, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  SafetyCheckResult, 
  SafetyStatus 
} from '@revenueshield/shared';
import { 
  evaluateMaxAutonomousAmount, 
  evaluateMaxDiscountPercentage, 
  evaluateMaxRecoveryAttempts, 
  evaluateCustomerCooldown, 
  evaluateOptOutProtection, 
  evaluateHumanProtectedCase, 
  evaluateHumanApprovalThreshold 
} from './rules.js';

export class SafetyEngine {
  /**
   * Evaluates a proposed agent action against all merchant safety policies
   */
  public evaluate(params: {
    action: ProposedActionPayload;
    decision: StructuredAIDecision;
    customer: CustomerContext;
    policy: MerchantPolicyConfig;
    attemptCount: number;
  }): SafetyCheckResult {
    const { action, decision, customer, policy, attemptCount } = params;
    const policyViolations: string[] = [];
    let requiresHumanApproval = false;
    let finalStatus = SafetyStatus.PASSED;

    // 1. Opt-out Protection (Hard Block)
    const optOutRes = evaluateOptOutProtection(customer, undefined, policy);
    if (!optOutRes.passed) {
      policyViolations.push(optOutRes.violationMessage || 'Customer opted out');
      finalStatus = SafetyStatus.BLOCKED_OPT_OUT;
    }

    // 2. Human Protected Case (Route to Human)
    const humanProtectRes = evaluateHumanProtectedCase(customer);
    if (!humanProtectRes.passed) {
      policyViolations.push(humanProtectRes.violationMessage || 'Human handling active');
      requiresHumanApproval = true;
      if (finalStatus === SafetyStatus.PASSED) finalStatus = SafetyStatus.FLAGGED_HUMAN_REVIEW;
    }

    // 3. Customer Cooldown (Block outreach if too soon)
    const cooldownRes = evaluateCustomerCooldown(customer, policy);
    if (!cooldownRes.passed) {
      policyViolations.push(cooldownRes.violationMessage || 'Cooldown active');
      if (finalStatus === SafetyStatus.PASSED) finalStatus = SafetyStatus.BLOCKED_COOLDOWN;
    }

    // 4. Max Recovery Attempts
    const attemptsRes = evaluateMaxRecoveryAttempts(attemptCount, policy);
    if (!attemptsRes.passed) {
      policyViolations.push(attemptsRes.violationMessage || 'Max recovery attempts reached');
      if (finalStatus === SafetyStatus.PASSED) finalStatus = SafetyStatus.BLOCKED_LIMIT_EXCEEDED;
    }

    // 5. Max Autonomous Amount
    const amountRes = evaluateMaxAutonomousAmount(action, policy);
    if (!amountRes.passed) {
      policyViolations.push(amountRes.violationMessage || 'Amount exceeds autonomous limit');
      requiresHumanApproval = true;
      if (finalStatus === SafetyStatus.PASSED) finalStatus = SafetyStatus.FLAGGED_HUMAN_REVIEW;
    }

    // 6. Max Discount Percentage
    const discountRes = evaluateMaxDiscountPercentage(decision, policy);
    if (!discountRes.passed) {
      policyViolations.push(discountRes.violationMessage || 'Discount exceeds limit');
      requiresHumanApproval = true;
      if (finalStatus === SafetyStatus.PASSED) finalStatus = SafetyStatus.FLAGGED_HUMAN_REVIEW;
    }

    // 7. Human Approval Threshold Tier
    const thresholdRes = evaluateHumanApprovalThreshold(action, policy);
    if (!thresholdRes.passed) {
      policyViolations.push(thresholdRes.violationMessage || 'Above high-tier threshold');
      requiresHumanApproval = true;
      if (finalStatus === SafetyStatus.PASSED) finalStatus = SafetyStatus.FLAGGED_HUMAN_REVIEW;
    }

    const checkedRules = [
      { ruleName: optOutRes.ruleName, passed: optOutRes.passed, reason: optOutRes.reason },
      { ruleName: humanProtectRes.ruleName, passed: humanProtectRes.passed, reason: humanProtectRes.reason },
      { ruleName: cooldownRes.ruleName, passed: cooldownRes.passed, reason: cooldownRes.reason },
      { ruleName: attemptsRes.ruleName, passed: attemptsRes.passed, reason: attemptsRes.reason },
      { ruleName: amountRes.ruleName, passed: amountRes.passed, reason: amountRes.reason },
      { ruleName: discountRes.ruleName, passed: discountRes.passed, reason: discountRes.reason },
      { ruleName: thresholdRes.ruleName, passed: thresholdRes.passed, reason: thresholdRes.reason },
    ];

    const passed = policyViolations.length === 0;

    return {
      passed,
      status: finalStatus,
      policyViolations,
      requiresHumanApproval,
      checkedRules
    };
  }
}

export const safetyEngine = new SafetyEngine();
