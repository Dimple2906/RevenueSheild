import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { razorpayService } from '@revenueshield/razorpay';

export class SubscriptionRecoveryAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.SUBSCRIPTION_RECOVERY;

  public buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload {
    return {
      actionType: 'CREATE_PAYMENT_LINK',
      amountPaise: decision.amountPaise,
      discountPaise: decision.discountPaise,
      finalAmountPaise: decision.finalAmountPaise,
      customer: event.customer,
      description: `Subscription Renewal Payment for ${event.customer.name}`,
      expiresInHours: 48,
      metadata: {
        subscriptionId: event.razorpayId || 'sub_demo_auto',
        rootCause: decision.rootCause,
      },
    };
  }

  public async executeAction(action: ProposedActionPayload): Promise<ActionExecutionResult> {
    return razorpayService.createPaymentLink({
      amountPaise: action.finalAmountPaise,
      description: action.description,
      customer: {
        name: action.customer.name,
        email: action.customer.email,
        phone: action.customer.phone,
      },
      notes: {
        source: 'RevenueShield_SubRescue',
        customerId: action.customer.id,
      },
    });
  }
}

export const subscriptionRecoveryAgent = new SubscriptionRecoveryAgent();
