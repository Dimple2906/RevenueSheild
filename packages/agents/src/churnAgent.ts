import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { razorpayService } from '@revenueshield/razorpay';

export class ChurnPreventionAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.CHURN_PREVENTION;

  public buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload {
    return {
      actionType: 'OFFER_RETENTION_COUPON',
      amountPaise: decision.amountPaise,
      discountPaise: decision.discountPaise,
      finalAmountPaise: decision.finalAmountPaise,
      customer: event.customer,
      description: `Exclusive Loyalty Retention: ${decision.discountPercentage}% off your renewal for ${event.customer.name}`,
      expiresInHours: 48,
      metadata: {
        discountPercentage: decision.discountPercentage,
        churnRiskScore: (event.payload?.riskScore as number) || 0.82,
        churnFactors: (event.payload?.factors as string[]) || ['Usage drop >60%', '2 failed retries']
      }
    };
  }

  public async executeAction(action: ProposedActionPayload): Promise<ActionExecutionResult> {
    return razorpayService.createPaymentLink({
      amountPaise: action.finalAmountPaise,
      description: action.description,
      customer: {
        name: action.customer.name,
        email: action.customer.email,
        phone: action.customer.phone
      },
      notes: {
        source: 'RevenueShield_ChurnPrevention',
        retentionDiscount: `${action.discountPaise / 100} INR`
      }
    });
  }
}

export const churnPreventionAgent = new ChurnPreventionAgent();
