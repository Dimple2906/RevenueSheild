import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { telemetryAnalyzerAdapter } from '@revenueshield/razorpay';

export class InfrastructureGuardAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.INFRASTRUCTURE_GUARD;

  public buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload {
    const analysis = telemetryAnalyzerAdapter.analyzeFailureCluster('HDFC', 'UPI');

    return {
      actionType: 'RECOMMEND_SMART_ROUTING_FALLBACK',
      amountPaise: event.amountPaise,
      discountPaise: 0,
      finalAmountPaise: event.amountPaise,
      customer: event.customer,
      description: `Infrastructure Alert: ${analysis.affectedBank} ${analysis.affectedMethod} failure spike detected (${analysis.failureRatePercentage}%).`,
      metadata: {
        analysis,
        suggestedFallback: analysis.suggestedFallbackGateway,
        recommendation: analysis.recommendedMitigation,
      },
    };
  }

  public async executeAction(action: ProposedActionPayload): Promise<ActionExecutionResult> {
    const analysis = action.metadata?.analysis as any;
    return {
      success: true,
      isSimulated: true,
      razorpayResourceId: analysis?.clusterId || `alert_${Date.now().toString(36)}`,
      message: `Infrastructure Guard mitigation dispatched: Smart routing alert published to merchant console.`,
    };
  }
}

export const infrastructureGuardAgent = new InfrastructureGuardAgent();
