import { 
  AgentType, 
  InternalRevenueEvent, 
  CustomerContext, 
  MerchantPolicyConfig, 
  StructuredAIDecision, 
  ProposedActionPayload, 
  SafetyCheckResult, 
  ActionExecutionResult 
} from '@revenueshield/shared';
import { aiProvider } from '@revenueshield/ai';
import { safetyEngine } from '@revenueshield/safety';

export interface AgentExecutionPipelineResult {
  decision: StructuredAIDecision;
  safetyCheck: SafetyCheckResult;
  proposedAction: ProposedActionPayload;
  executionResult?: ActionExecutionResult;
  status: 'EXECUTED' | 'HELD_FOR_HUMAN_APPROVAL' | 'BLOCKED_BY_SAFETY' | 'FAILED';
  tokens: { prompt: number; completion: number };
  latencyMs: number;
}

export abstract class BaseRecoveryAgent {
  public abstract readonly type: AgentType;

  /**
   * 1. Diagnose & Formulate Strategy via AI
   */
  public async diagnoseAndDecide(
    event: InternalRevenueEvent,
    policy: MerchantPolicyConfig
  ): Promise<{ decision: StructuredAIDecision; tokens: { prompt: number; completion: number }; latencyMs: number }> {
    return aiProvider.generateDecision({
      leakId: event.id,
      agentType: this.type,
      leakType: event.leakType,
      amountPaise: event.amountPaise,
      customer: {
        name: event.customer.name,
        email: event.customer.email,
        phone: event.customer.phone,
        ltvPaise: event.customer.ltvPaise,
        totalSuccessfulTxns: event.customer.totalSuccessfulTxns,
        totalFailedTxns: event.customer.totalFailedTxns,
      },
      eventPayload: event.payload,
      policyLimits: {
        maxAutonomousAmountPaise: policy.maxAutonomousAmountPaise,
        maxDiscountPercentage: policy.maxDiscountPercentage,
      },
    });
  }

  /**
   * 2. Build Proposed Action Payload from AI Decision
   */
  public abstract buildProposedAction(
    event: InternalRevenueEvent,
    decision: StructuredAIDecision
  ): ProposedActionPayload;

  /**
   * 3. Pass Proposed Action through Safety Engine
   */
  public validateSafety(params: {
    action: ProposedActionPayload;
    decision: StructuredAIDecision;
    customer: CustomerContext;
    policy: MerchantPolicyConfig;
    attemptCount: number;
  }): SafetyCheckResult {
    return safetyEngine.evaluate(params);
  }

  /**
   * 4. Execute Action via Razorpay / Adapter
   */
  public abstract executeAction(
    action: ProposedActionPayload,
    merchantCredentials?: { keyId?: string; keySecret?: string }
  ): Promise<ActionExecutionResult>;

  /**
   * Universal Agent Loop Runner
   */
  public async runLoop(params: {
    event: InternalRevenueEvent;
    policy: MerchantPolicyConfig;
    attemptCount?: number;
  }): Promise<AgentExecutionPipelineResult> {
    const attemptCount = params.attemptCount || 1;

    // Step A: Diagnose & Decide
    const { decision, tokens, latencyMs } = await this.diagnoseAndDecide(params.event, params.policy);

    // Step B: Build Action
    const proposedAction = this.buildProposedAction(params.event, decision);

    // Step C: Safety Engine Check
    const safetyCheck = this.validateSafety({
      action: proposedAction,
      decision,
      customer: params.event.customer,
      policy: params.policy,
      attemptCount,
    });

    // Step D: Route based on Safety Engine verdict
    if (!safetyCheck.passed) {
      if (safetyCheck.requiresHumanApproval) {
        return {
          decision,
          safetyCheck,
          proposedAction,
          status: 'HELD_FOR_HUMAN_APPROVAL',
          tokens,
          latencyMs,
        };
      } else {
        return {
          decision,
          safetyCheck,
          proposedAction,
          status: 'BLOCKED_BY_SAFETY',
          tokens,
          latencyMs,
        };
      }
    }

    // Step E: Execute approved action
    try {
      const executionResult = await this.executeAction(proposedAction);
      return {
        decision,
        safetyCheck,
        proposedAction,
        executionResult,
        status: executionResult.success ? 'EXECUTED' : 'FAILED',
        tokens,
        latencyMs,
      };
    } catch (err: any) {
      return {
        decision,
        safetyCheck,
        proposedAction,
        executionResult: {
          success: false,
          isSimulated: false,
          message: 'Execution failed',
          error: err?.message || 'Unknown error',
        },
        status: 'FAILED',
        tokens,
        latencyMs,
      };
    }
  }
}
