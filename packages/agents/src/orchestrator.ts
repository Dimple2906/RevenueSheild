import { 
  AgentType, 
  LeakType, 
  LeakStage, 
  InternalRevenueEvent, 
  MerchantPolicyConfig, 
  CustomerContext,
  SafetyStatus
} from '@revenueshield/shared';
import { prisma } from '@revenueshield/database';
import { customerCoordinator } from '@revenueshield/safety';
import { subscriptionRecoveryAgent } from './subscriptionAgent.js';
import { infrastructureGuardAgent } from './infraGuardAgent.js';
import { checkoutRecoveryAgent } from './checkoutAgent.js';
import { mandateRenewalAgent } from './mandateAgent.js';
import { refundRecoveryAgent } from './refundAgent.js';
import { receivablesAgent } from './receivablesAgent.js';
import { promisePayAgent } from './promisePayAgent.js';
import { churnPreventionAgent } from './churnAgent.js';
import { voiceRecoveryAgent } from './voiceAgent.js';
import { paymentDetectiveAgent } from './detectiveAgent.js';
import { BaseRecoveryAgent, AgentExecutionPipelineResult } from './baseAgent.js';

export interface OrchestrationResult {
  leakId: string;
  agentType: AgentType;
  status: string;
  pipelineResult?: AgentExecutionPipelineResult;
  error?: string;
}

export class RevenueOrchestrator {
  private agentsMap: Map<AgentType, BaseRecoveryAgent> = new Map();
  private defaultPolicy: MerchantPolicyConfig = {
    maxAutonomousAmountPaise: 500000,
    maxDiscountPercentage: 15,
    maxRecoveryAttempts: 3,
    customerCooldownHours: 24,
    humanApprovalThresholdPaise: 1000000,
    allowVoiceRecovery: true,
    allowStoreCreditCounter: true,
    optOutKeywords: ['STOP', 'UNSUBSCRIBE', 'OPTOUT', 'CANCEL', 'DND']
  };

  constructor() {
    this.agentsMap.set(AgentType.SUBSCRIPTION_RECOVERY, subscriptionRecoveryAgent);
    this.agentsMap.set(AgentType.INFRASTRUCTURE_GUARD, infrastructureGuardAgent);
    this.agentsMap.set(AgentType.CHECKOUT_RECOVERY, checkoutRecoveryAgent);
    this.agentsMap.set(AgentType.MANDATE_RENEWAL, mandateRenewalAgent);
    this.agentsMap.set(AgentType.REFUND_RECOVERY, refundRecoveryAgent);
    this.agentsMap.set(AgentType.RECEIVABLES, receivablesAgent);
    this.agentsMap.set(AgentType.PROMISE_TO_PAY, promisePayAgent);
    this.agentsMap.set(AgentType.CHURN_PREVENTION, churnPreventionAgent);
    this.agentsMap.set(AgentType.VOICE_RECOVERY, voiceRecoveryAgent);
    this.agentsMap.set(AgentType.PAYMENT_DETECTIVE, paymentDetectiveAgent);
  }

  public getAgent(type: AgentType): BaseRecoveryAgent | undefined {
    return this.agentsMap.get(type);
  }

  public mapLeakTypeToAgent(leakType: LeakType): AgentType {
    switch (leakType) {
      case LeakType.SUBSCRIPTION_FAILURE: return AgentType.SUBSCRIPTION_RECOVERY;
      case LeakType.INFRASTRUCTURE_DEGRADATION: return AgentType.INFRASTRUCTURE_GUARD;
      case LeakType.CHECKOUT_ABANDONMENT: return AgentType.CHECKOUT_RECOVERY;
      case LeakType.MANDATE_EXPIRY: return AgentType.MANDATE_RENEWAL;
      case LeakType.REFUND_REQUEST: return AgentType.REFUND_RECOVERY;
      case LeakType.INVOICE_OVERDUE: return AgentType.RECEIVABLES;
      case LeakType.PROMISE_BREACH: return AgentType.PROMISE_TO_PAY;
      case LeakType.CHURN_RISK: return AgentType.CHURN_PREVENTION;
      case LeakType.VOICE_RECOVERY: return AgentType.VOICE_RECOVERY;
      case LeakType.PAYMENT_CLUSTER: return AgentType.PAYMENT_DETECTIVE;
      default: return AgentType.SUBSCRIPTION_RECOVERY;
    }
  }

  public mapLeakTypeToStage(leakType: LeakType): LeakStage {
    switch (leakType) {
      case LeakType.CHECKOUT_ABANDONMENT:
      case LeakType.CHURN_RISK:
        return LeakStage.PRE_PAYMENT;
      case LeakType.SUBSCRIPTION_FAILURE:
      case LeakType.MANDATE_EXPIRY:
      case LeakType.INFRASTRUCTURE_DEGRADATION:
      case LeakType.PAYMENT_CLUSTER:
        return LeakStage.AT_PAYMENT;
      default:
        return LeakStage.POST_PAYMENT;
    }
  }

  /**
   * Main Entrypoint: Ingests an event, coordinates agents, evaluates safety, executes, and records audit trail
   */
  public async handleEvent(event: InternalRevenueEvent): Promise<OrchestrationResult> {
    const leakId = event.id || `leak_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const merchantId = event.merchantId || 'merchant_acme_01';
    const assignedAgent = event.assignedAgent || this.mapLeakTypeToAgent(event.leakType);
    const leakStage = event.leakStage || this.mapLeakTypeToStage(event.leakType);
    const triggerEventType = event.triggerEventType || event.eventType || 'unknown_trigger';
    const triggerRazorpayId = event.razorpayId || null;

    // 1. Fetch or create Customer in DB
    let dbCustomer = await prisma.customer.findUnique({
      where: { id: event.customer.id }
    });

    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          id: event.customer.id,
          merchantId,
          name: event.customer.name,
          email: event.customer.email,
          phone: event.customer.phone,
          ltvPaise: event.customer.ltvPaise,
          totalSuccessfulTxns: event.customer.totalSuccessfulTxns,
          totalFailedTxns: event.customer.totalFailedTxns,
          isOptedOut: Boolean(event.customer.isOptedOut),
          isHumanHandled: Boolean(event.customer.isHumanHandled),
          lastContactedAt: event.customer.lastContactedAt ? new Date(event.customer.lastContactedAt) : null,
        }
      });
    }

    // 2. Fetch Merchant Policy
    const dbPolicy = await prisma.merchantPolicy.findUnique({
      where: { merchantId }
    });

    const policy: MerchantPolicyConfig = dbPolicy ? {
      maxAutonomousAmountPaise: dbPolicy.maxAutonomousAmountPaise,
      maxDiscountPercentage: dbPolicy.maxDiscountPercentage,
      maxRecoveryAttempts: dbPolicy.maxRecoveryAttempts,
      customerCooldownHours: dbPolicy.customerCooldownHours,
      humanApprovalThresholdPaise: dbPolicy.humanApprovalThresholdPaise,
      allowVoiceRecovery: dbPolicy.allowVoiceRecovery,
      allowStoreCreditCounter: dbPolicy.allowStoreCreditCounter,
      optOutKeywords: dbPolicy.optOutKeywords.split(',').map(s => s.trim())
    } : this.defaultPolicy;

    // 3. Customer Coordinator: Check for multi-agent conflicts
    const coordinatorCheck = customerCoordinator.coordinateWorkflow({
      customerId: event.customer.id,
      agentType: assignedAgent,
      leakType: event.leakType,
      leakId,
      status: 'ANALYZING',
      amountPaise: event.amountPaise,
      startedAt: new Date()
    });

    if (!coordinatorCheck.canProceed) {
      // Coordinator paused this candidate agent to prevent spam
      const leak = await prisma.revenueLeak.create({
        data: {
          id: leakId,
          merchantId,
          customerId: dbCustomer.id,
          leakType: event.leakType,
          leakStage,
          amountAtRiskPaise: event.amountPaise,
          priorityScore: 0.4,
          triggerEventType,
          triggerRazorpayId,
          status: 'STOPPED',
          assignedAgent,
          rootCauseDiagnosis: `Suppressed by Customer Coordinator: ${coordinatorCheck.reason}`,
          requiresHumanReview: false
        }
      });

      await prisma.auditLog.create({
        data: {
          merchantId,
          leakId: leak.id,
          agentType: assignedAgent,
          eventType: 'COORDINATOR_CONFLICT_BLOCKED',
          message: coordinatorCheck.reason,
          metadata: JSON.stringify({ conflictingAgent: coordinatorCheck.conflictingAgent }),
          amountAtRiskPaise: event.amountPaise
        }
      });

      return {
        leakId: leak.id,
        agentType: assignedAgent,
        status: 'COORDINATOR_PAUSED',
        error: coordinatorCheck.reason
      };
    }

    // 4. Dispatch to Target Agent
    const agent = this.agentsMap.get(assignedAgent);
    if (!agent) {
      throw new Error(`No registered agent for type ${assignedAgent}`);
    }

    const customerCtx: CustomerContext = {
      id: dbCustomer.id,
      name: dbCustomer.name,
      email: dbCustomer.email,
      phone: dbCustomer.phone,
      ltvPaise: dbCustomer.ltvPaise,
      totalSuccessfulTxns: dbCustomer.totalSuccessfulTxns,
      totalFailedTxns: dbCustomer.totalFailedTxns,
      isOptedOut: dbCustomer.isOptedOut,
      isHumanHandled: dbCustomer.isHumanHandled,
      lastContactedAt: dbCustomer.lastContactedAt?.toISOString()
    };

    // Update event customer context
    const enrichedEvent: InternalRevenueEvent = {
      ...event,
      id: leakId,
      customer: customerCtx,
      assignedAgent,
      leakStage,
      triggerEventType
    };

    // 5. Run Universal Agent Loop
    const pipelineResult = await agent.runLoop({
      event: enrichedEvent,
      policy,
      attemptCount: 1
    });

    // 6. Map Leak Status
    let dbStatus = 'DETECTED';
    let requiresHumanReview = false;

    if (pipelineResult.status === 'EXECUTED') {
      dbStatus = 'ACTION_EXECUTED';
    } else if (pipelineResult.status === 'HELD_FOR_HUMAN_APPROVAL') {
      dbStatus = 'PENDING_HUMAN_APPROVAL';
      requiresHumanReview = true;
    } else if (pipelineResult.status === 'BLOCKED_BY_SAFETY') {
      dbStatus = 'STOPPED';
    } else {
      dbStatus = 'FAILED';
    }

    // 7. Persist Leak & Session
    const leak = await prisma.revenueLeak.create({
      data: {
        id: leakId,
        merchantId,
        customerId: dbCustomer.id,
        leakType: event.leakType,
        leakStage,
        amountAtRiskPaise: event.amountPaise,
        priorityScore: pipelineResult.decision.confidence,
        triggerEventType,
        triggerRazorpayId,
        status: dbStatus,
        assignedAgent,
        rootCauseDiagnosis: pipelineResult.decision.rootCause,
        aiConfidenceScore: pipelineResult.decision.confidence,
        recoveryStrategy: pipelineResult.decision.reason,
        requiresHumanReview,
        recoverySessions: {
          create: {
            customerId: dbCustomer.id,
            agentType: assignedAgent,
            currentStep: pipelineResult.status,
            attemptCount: 1,
            status: dbStatus,
            safetyChecks: {
              create: {
                status: pipelineResult.safetyCheck.status,
                passed: pipelineResult.safetyCheck.passed,
                policyViolations: JSON.stringify(pipelineResult.safetyCheck.policyViolations),
                checkedRules: JSON.stringify(pipelineResult.safetyCheck.checkedRules)
              }
            },
            agentRuns: {
              create: {
                agentType: assignedAgent,
                promptTokens: pipelineResult.tokens.prompt,
                completionTokens: pipelineResult.tokens.completion,
                latencyMs: pipelineResult.latencyMs,
                confidence: pipelineResult.decision.confidence,
                structuredDecision: JSON.stringify(pipelineResult.decision)
              }
            },
            actions: {
              create: {
                actionType: pipelineResult.proposedAction.actionType,
                proposedPayload: JSON.stringify(pipelineResult.proposedAction),
                razorpayResourceId: pipelineResult.executionResult?.razorpayResourceId || null,
                razorpayResourceUrl: pipelineResult.executionResult?.razorpayResourceUrl || null,
                amountPaise: pipelineResult.proposedAction.amountPaise,
                discountPaise: pipelineResult.proposedAction.discountPaise,
                status: pipelineResult.status === 'EXECUTED' ? 'EXECUTED' : pipelineResult.status,
                isSimulated: Boolean(pipelineResult.executionResult?.isSimulated),
                executedAt: pipelineResult.status === 'EXECUTED' ? new Date() : null
              }
            }
          }
        }
      }
    });

    // 8. Record Audit Logs
    await prisma.auditLog.createMany({
      data: [
        {
          merchantId,
          leakId: leak.id,
          agentType: assignedAgent,
          eventType: 'LEAK_DETECTED',
          message: `${event.leakType} detected for ${dbCustomer.name} (Amount: ₹${(event.amountPaise / 100).toFixed(2)}).`,
          amountAtRiskPaise: event.amountPaise,
          metadata: JSON.stringify({ trigger: triggerEventType, razorpayId: triggerRazorpayId })
        },
        {
          merchantId,
          leakId: leak.id,
          agentType: assignedAgent,
          eventType: 'AI_DIAGNOSED',
          message: `AI Diagnosis (${Math.round(pipelineResult.decision.confidence * 100)}% conf): ${pipelineResult.decision.rootCause}`,
          metadata: JSON.stringify(pipelineResult.decision),
          amountAtRiskPaise: event.amountPaise
        },
        {
          merchantId,
          leakId: leak.id,
          agentType: assignedAgent,
          eventType: 'SAFETY_EVALUATED',
          message: pipelineResult.safetyCheck.passed 
            ? 'Safety Engine passed all deterministic guardrails.'
            : `Safety Engine flagged case: ${pipelineResult.safetyCheck.policyViolations.join(', ')}`,
          metadata: JSON.stringify(pipelineResult.safetyCheck)
        },
        {
          merchantId,
          leakId: leak.id,
          agentType: assignedAgent,
          eventType: pipelineResult.status === 'EXECUTED' ? 'ACTION_EXECUTED' : 'ACTION_HELD',
          message: pipelineResult.status === 'EXECUTED'
            ? `Dispatched ${pipelineResult.proposedAction.actionType} (${pipelineResult.executionResult?.razorpayResourceId || 'active'}).`
            : `Action held for human review due to policy threshold.`,
          metadata: JSON.stringify(pipelineResult.executionResult || {})
        }
      ]
    });

    // Update customer last contacted at if action executed
    if (pipelineResult.status === 'EXECUTED') {
      await prisma.customer.update({
        where: { id: dbCustomer.id },
        data: { lastContactedAt: new Date() }
      });
    }

    return {
      leakId: leak.id,
      agentType: assignedAgent,
      status: dbStatus,
      pipelineResult
    };
  }

  /**
   * Approves a held action in the human-in-the-loop queue
   */
  public async approveAction(params: {
    leakId: string;
    approvedBy: string;
    overrideDiscount?: number;
  }): Promise<{ success: boolean; message: string; actionId?: string }> {
    const leak = await prisma.revenueLeak.findUnique({
      where: { id: params.leakId },
      include: {
        customer: true,
        recoverySessions: {
          include: {
            actions: true,
            safetyChecks: true
          }
        }
      }
    });

    if (!leak || !leak.customer) {
      throw new Error(`Leak ${params.leakId} not found`);
    }

    const latestSession = leak.recoverySessions[0];
    const pendingAction = latestSession?.actions.find(a => a.status === 'HELD_FOR_HUMAN_APPROVAL' || a.status === 'PENDING');

    if (!pendingAction) {
      throw new Error(`No pending action found for leak ${params.leakId}`);
    }

    const agent = this.agentsMap.get(leak.assignedAgent as AgentType);
    if (!agent) {
      throw new Error(`Agent ${leak.assignedAgent} not found`);
    }

    const payload = JSON.parse(pendingAction.proposedPayload);
    if (params.overrideDiscount !== undefined) {
      payload.discountPaise = Math.round((payload.amountPaise * params.overrideDiscount) / 100);
      payload.finalAmountPaise = payload.amountPaise - payload.discountPaise;
    }

    const executionResult = await agent.executeAction(payload);

    // Update Action & Leak status
    await prisma.recoveryAction.update({
      where: { id: pendingAction.id },
      data: {
        status: 'EXECUTED',
        razorpayResourceId: executionResult.razorpayResourceId,
        razorpayResourceUrl: executionResult.razorpayResourceUrl,
        isSimulated: Boolean(executionResult.isSimulated),
        executedAt: new Date()
      }
    });

    await prisma.revenueLeak.update({
      where: { id: leak.id },
      data: {
        status: 'ACTION_EXECUTED',
        requiresHumanReview: false
      }
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        merchantId: leak.merchantId,
        leakId: leak.id,
        agentType: leak.assignedAgent as AgentType,
        eventType: 'HUMAN_ACTION_APPROVED',
        message: `Human Admin (${params.approvedBy}) approved action execution with override discount: ${params.overrideDiscount ?? 'None'}%.`,
        metadata: JSON.stringify({ approvedBy: params.approvedBy, executionResult })
      }
    });

    return {
      success: true,
      message: `Action approved and dispatched successfully (${executionResult.razorpayResourceId}).`,
      actionId: pendingAction.id
    };
  }

  /**
   * Rejects / Manually stops a held action
   */
  public async rejectAction(params: {
    leakId: string;
    rejectedBy: string;
    reason: string;
  }): Promise<{ success: boolean; message: string }> {
    const leak = await prisma.revenueLeak.findUnique({
      where: { id: params.leakId }
    });

    if (!leak) {
      throw new Error(`Leak ${params.leakId} not found`);
    }

    await prisma.revenueLeak.update({
      where: { id: leak.id },
      data: {
        status: 'STOPPED',
        requiresHumanReview: false
      }
    });

    await prisma.auditLog.create({
      data: {
        merchantId: leak.merchantId,
        leakId: leak.id,
        agentType: leak.assignedAgent as AgentType,
        eventType: 'HUMAN_ACTION_REJECTED',
        message: `Human Admin (${params.rejectedBy}) rejected proposed action. Reason: ${params.reason}`,
        metadata: JSON.stringify({ rejectedBy: params.rejectedBy, reason: params.reason })
      }
    });

    return {
      success: true,
      message: `Action successfully cancelled.`
    };
  }

  /**
   * Simulates customer paying the recovery link / completing the recovery loop
   */
  public async simulatePaymentRecovery(leakId: string): Promise<{ success: boolean; amountRecoveredPaise: number }> {
    const leak = await prisma.revenueLeak.findUnique({
      where: { id: leakId },
      include: { customer: true, recoverySessions: { include: { actions: true } } }
    });

    if (!leak) {
      throw new Error(`Leak ${leakId} not found`);
    }

    const latestAction = leak.recoverySessions[0]?.actions[0];
    const recoveredAmount = latestAction ? (latestAction.amountPaise - latestAction.discountPaise) : leak.amountAtRiskPaise;

    await prisma.revenueLeak.update({
      where: { id: leak.id },
      data: {
        status: 'RECOVERED',
        amountRecoveredPaise: recoveredAmount,
        resolvedAt: new Date()
      }
    });

    if (latestAction) {
      await prisma.recoveryAction.update({
        where: { id: latestAction.id },
        data: { status: 'RECOVERED' }
      });
    }

    if (leak.customerId) {
      customerCoordinator.completeWorkflow(leak.customerId, leak.id);
      await prisma.customer.update({
        where: { id: leak.customerId },
        data: {
          totalSuccessfulTxns: { increment: 1 },
          ltvPaise: { increment: recoveredAmount }
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        merchantId: leak.merchantId,
        leakId: leak.id,
        agentType: leak.assignedAgent as AgentType,
        eventType: 'PAYMENT_RECOVERED',
        message: `Customer completed payment! ₹${(recoveredAmount / 100).toFixed(2)} successfully recovered.`,
        amountAtRiskPaise: leak.amountAtRiskPaise,
        amountRecoveredPaise: recoveredAmount,
        metadata: JSON.stringify({ recoveredAmountPaise: recoveredAmount, razorpayResourceId: latestAction?.razorpayResourceId })
      }
    });

    return {
      success: true,
      amountRecoveredPaise: recoveredAmount
    };
  }
}

export const revenueOrchestrator = new RevenueOrchestrator();
