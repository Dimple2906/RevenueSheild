import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { razorpayService } from '@revenueshield/razorpay';

export class RefundRecoveryAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.REFUND_RECOVERY;

  public buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload {
    const bonusPaise = 50000; // ₹500 bonus store credit

    return {
      actionType: 'OFFER_STORE_CREDIT_PLUS_BONUS',
      amountPaise: decision.amountPaise,
      discountPaise: 0,
      finalAmountPaise: decision.amountPaise + bonusPaise,
      customer: event.customer,
      description: `Store Credit Offer: ₹${(decision.amountPaise / 100).toFixed(0)} + ₹500 Bonus Balance`,
      metadata: {
        originalRefundAmountPaise: decision.amountPaise,
        bonusCreditPaise: bonusPaise,
        refundReason: decision.rootCause,
      },
    };
  }

  public async executeAction(action: ProposedActionPayload): Promise<ActionExecutionResult> {
    const originalPaise = action.metadata?.originalRefundAmountPaise as number || action.amountPaise;
    const bonusPaise = action.metadata?.bonusCreditPaise as number || 50000;

    return {
      success: true,
      isSimulated: true,
      razorpayResourceId: `credit_offer_${Date.now().toString(36)}`,
      message: `Store credit counteroffer (₹${(originalPaise / 100).toFixed(0)} + ₹${(bonusPaise / 100).toFixed(0)} bonus) dispatched to ${action.customer.name}.`,
    };
  }

  /**
   * Graceful fallback if customer declines store credit
   */
  public async executeStandardRefund(paymentId: string, amountPaise: number): Promise<ActionExecutionResult> {
    return razorpayService.processRefund({
      paymentId,
      amountPaise,
      notes: { source: 'RevenueShield_RefundResolution_CustomerDeclinedCredit' },
    });
  }
}

export const refundRecoveryAgent = new RefundRecoveryAgent();
