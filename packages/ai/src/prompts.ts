import { AgentType, LeakType } from '@revenueshield/shared';

export const SYSTEM_PROMPT_AGENT = `You are RevenueShield AI, an autonomous revenue recovery decision engine built for modern fintech and SaaS merchants.
Your job is to analyze incoming revenue leak events, retrieve customer context, diagnose the exact root cause, and select a bounded recovery strategy.

CRITICAL INSTRUCTIONS:
1. Always respond in STRICT valid JSON matching the requested schema.
2. NEVER include markdown backticks or commentary outside JSON.
3. Keep monetary values in integer paise.
4. Bound all proposed discounts within merchant policy limits.
5. If confidence is below 0.70, flag requiresHumanApproval = true.`;

export function buildAgentPrompt(params: {
  agentType: AgentType;
  leakType: LeakType;
  amountPaise: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    ltvPaise: number;
    totalSuccessfulTxns: number;
    totalFailedTxns: number;
  };
  eventPayload: Record<string, unknown>;
  policyLimits: {
    maxAutonomousAmountPaise: number;
    maxDiscountPercentage: number;
  };
}): string {
  return `Agent: ${params.agentType}
Leak Type: ${params.leakType}
Amount at Risk: ₹${(params.amountPaise / 100).toFixed(2)} (${params.amountPaise} paise)
Customer Profile:
- Name: ${params.customer.name}
- LTV: ₹${(params.customer.ltvPaise / 100).toFixed(2)}
- Past Successful Txns: ${params.customer.totalSuccessfulTxns}
- Past Failed Txns: ${params.customer.totalFailedTxns}

Merchant Policy Caps:
- Max Autonomous Limit: ₹${(params.policyLimits.maxAutonomousAmountPaise / 100).toFixed(2)}
- Max Allowed Discount: ${params.policyLimits.maxDiscountPercentage}%

Trigger Event Data:
${JSON.stringify(params.eventPayload, null, 2)}

Provide your structured JSON decision with fields:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "rootCause": "string (succinct technical/behavioral diagnosis)",
  "confidence": number between 0.0 and 1.0,
  "recommendedAction": "string (e.g. CREATE_PAYMENT_LINK, ISSUE_INVOICE, OFFER_CREDIT, RETRY_MANDATE, VOICE_DUNNING)",
  "discountPercentage": number (integer <= max allowed),
  "reason": "string (clear human-readable justification for the merchant)",
  "requiresHumanApproval": boolean
}`;
}
