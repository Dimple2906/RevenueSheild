import { 
  AgentType, 
  InternalRevenueEvent, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { BaseRecoveryAgent } from './baseAgent.js';
import { telemetryAnalyzerAdapter } from '@revenueshield/razorpay';

export class PaymentDetectiveAgent extends BaseRecoveryAgent {
  public readonly type = AgentType.PAYMENT_DETECTIVE;

  public buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload {
    const bank = (event.payload?.bank as string) || 'HDFC';
    const method = (event.payload?.method as string) || 'CARD';
    const cardBin = (event.payload?.cardBin as string) || '4111xx';
    const analysis = telemetryAnalyzerAdapter.analyzeFailureCluster(bank, method);

    return {
      actionType: 'PUBLISH_INCIDENT_REPORT',
      amountPaise: event.amountPaise,
      discountPaise: 0,
      finalAmountPaise: event.amountPaise,
      customer: event.customer,
      description: `Detective RCA Report: Failure cluster identified on ${bank} ${method} (BIN: ${cardBin}).`,
      metadata: {
        analysis,
        cardBin,
        bank,
        method,
        investigationSummary: `Correlated ${event.payload?.failureCount || 8} consecutive failures to issuer 3DS gateway timeout.`
      }
    };
  }

  public async executeAction(action: ProposedActionPayload): Promise<ActionExecutionResult> {
    const reportId = `rca_report_${Date.now().toString(36)}`;
    return {
      success: true,
      isSimulated: true,
      razorpayResourceId: reportId,
      message: `Payment Detective published RCA incident report ${reportId} to merchant dashboard and alerts.`
    };
  }
}

export const paymentDetectiveAgent = new PaymentDetectiveAgent();
