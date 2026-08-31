import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { mandateRecoveryAdapter } from '@revenueshield/razorpay';

export class MandateRenewalAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.MANDATE_RENEWAL;

  public buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload {
    return {
      actionType: 'CREATE_MANDATE_RENEWAL_LINK',
      amountPaise: decision.amountPaise,
      discountPaise: 0,
      finalAmountPaise: decision.amountPaise,
      customer: event.customer,
      description: `Proactive UPI Autopay / Mandate Renewal for ${event.customer.name}`,
      expiresInHours: 72,
      metadata: {
        mandateType: 'UPI_AUTOPAY',
        expiresInDays: 5,
      },
    };
  }

  public async executeAction(action: ProposedActionPayload): Promise<ActionExecutionResult> {
    return mandateRecoveryAdapter.createMandateRenewalLink({
      customerId: action.customer.id,
      customerName: action.customer.name,
      mandateType: 'UPI_AUTOPAY',
      expiresInDays: 5,
      maxAmountPaise: action.finalAmountPaise,
    });
  }
}

export const mandateRenewalAgent = new MandateRenewalAgent();
