import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { razorpayService } from '@revenueshield/razorpay';

export class PromisePayAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.PROMISE_TO_PAY;

  public buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload {
    const promisedDate = (event.payload?.promisedDate as string) || new Date(Date.now() + 3 * 86400000).toISOString();
    const extractedText = (event.payload?.extractedText as string) || 'Customer agreed to pay on Friday via WhatsApp support chat.';

    return {
      actionType: 'CREATE_TIMELOCKED_PAYMENT_LINK',
      amountPaise: decision.amountPaise,
      discountPaise: decision.discountPaise,
      finalAmountPaise: decision.finalAmountPaise,
      customer: event.customer,
      description: `Promise-to-Pay Commitment Link for ${event.customer.name}`,
      expiresInHours: 96,
      metadata: {
        promisedDate,
        extractedText,
        lockUntilDate: promisedDate
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
        source: 'RevenueShield_PromiseToPay',
        promisedDate: String(action.metadata?.promisedDate || '')
      }
    });
  }
}

export const promisePayAgent = new PromisePayAgent();
