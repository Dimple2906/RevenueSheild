import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { razorpayService } from '@revenueshield/razorpay';

export class ReceivablesAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.RECEIVABLES;

  public buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload {
    const overdueDays = (event.payload?.overdueDays as number) || 30;
    const invoiceNumber = (event.payload?.invoiceNumber as string) || `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`;

    return {
      actionType: 'ISSUE_INVOICE',
      amountPaise: decision.amountPaise,
      discountPaise: decision.discountPaise,
      finalAmountPaise: decision.finalAmountPaise,
      customer: event.customer,
      description: `Overdue B2B Invoice ${invoiceNumber} (${overdueDays} Days Past Due) for ${event.customer.name}`,
      expiresInHours: 72,
      metadata: {
        invoiceNumber,
        overdueDays,
        itemizedTitle: `B2B Enterprise License Term (${overdueDays}d Overdue)`,
        requiresHumanApproval: decision.requiresHumanApproval
      }
    };
  }

  public async executeAction(action: ProposedActionPayload): Promise<ActionExecutionResult> {
    return razorpayService.createInvoice({
      amountPaise: action.finalAmountPaise,
      description: action.description,
      customer: {
        name: action.customer.name,
        email: action.customer.email,
        phone: action.customer.phone
      },
      lineItemTitle: action.metadata?.itemizedTitle as string || 'Overdue Enterprise Subscription'
    });
  }
}

export const receivablesAgent = new ReceivablesAgent();
