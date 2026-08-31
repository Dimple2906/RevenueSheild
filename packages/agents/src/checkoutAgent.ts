import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { razorpayService } from '@revenueshield/razorpay';

export class CheckoutRecoveryAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.CHECKOUT_RECOVERY;

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
      description: `Complete Your Order with ${decision.discountPercentage}% Recovery Bonus`,
      expiresInHours: 24,
      metadata: {
        discountPercentage: decision.discountPercentage,
        cartItems: event.payload?.items || [{ name: 'Premium Plan Subscription', qty: 1 }],
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
        source: 'RevenueShield_CartRescuer',
        discountApplied: `${action.discountPaise / 100} INR`,
      },
    });
  }
}

export const checkoutRecoveryAgent = new CheckoutRecoveryAgent();
