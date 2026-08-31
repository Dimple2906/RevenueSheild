import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { voiceRecoveryAdapter } from '@revenueshield/razorpay';

export class VoiceRecoveryAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.VOICE_RECOVERY;

  public buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload {
    const language = ((event.payload?.language as string) || 'hinglish').toLowerCase() as 'hinglish' | 'tamil' | 'english';
    const dueDate = (event.payload?.dueDate as string) || 'today';

    return {
      actionType: 'DISPATCH_VOICE_DUNNING_CALL',
      amountPaise: decision.amountPaise,
      discountPaise: 0,
      finalAmountPaise: decision.amountPaise,
      customer: event.customer,
      description: `Automated Voice Call Reminder (${language.toUpperCase()}) for ${event.customer.name}`,
      metadata: {
        language,
        dueDate,
        isTRAICompliantTime: voiceRecoveryAdapter.isWithinContactWindow()
      }
    };
  }

  public async executeAction(action: ProposedActionPayload): Promise<ActionExecutionResult> {
    const language = (action.metadata?.language as 'hinglish' | 'tamil' | 'english') || 'hinglish';

    return voiceRecoveryAdapter.dispatchCall({
      customerName: action.customer.name,
      customerPhone: action.customer.phone,
      amountPaise: action.finalAmountPaise,
      dueDate: String(action.metadata?.dueDate || 'immediate'),
      language
    });
  }
}

export const voiceRecoveryAgent = new VoiceRecoveryAgent();
