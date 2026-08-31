import { AgentType, LeakType } from '@revenueshield/shared';

// Agent Priority Hierarchy (Higher number = Higher priority)
export const AGENT_PRIORITY_RANK: Record<AgentType, number> = {
  [AgentType.SUBSCRIPTION_RECOVERY]: 90,   // Active recurring revenue at immediate risk
  [AgentType.INFRASTRUCTURE_GUARD]: 85,     // System-wide gateway health
  [AgentType.PAYMENT_DETECTIVE]: 80,       // Cluster RCA
  [AgentType.RECEIVABLES]: 75,             // Overdue corporate invoice
  [AgentType.PROMISE_TO_PAY]: 70,          // Explicit payment commitment
  [AgentType.REFUND_RECOVERY]: 65,         // Inbound return/refund mitigation
  [AgentType.CHECKOUT_RECOVERY]: 60,       // High-intent abandoned cart
  [AgentType.MANDATE_RENEWAL]: 55,         // Upcoming mandate expiration
  [AgentType.CHURN_PREVENTION]: 50,        // Pre-churn behavioral engagement
  [AgentType.VOICE_RECOVERY]: 40,          // Secondary voice escalation
};

export interface ActiveCustomerWorkflow {
  customerId: string;
  agentType: AgentType;
  leakType: LeakType;
  leakId: string;
  status: string;
  amountPaise: number;
  startedAt: Date;
}

export class CustomerCoordinator {
  private activeWorkflows: Map<string, ActiveCustomerWorkflow[]> = new Map();

  /**
   * Registers or checks an active workflow for a customer
   */
  public coordinateWorkflow(
    candidate: ActiveCustomerWorkflow
  ): {
    canProceed: boolean;
    reason: string;
    action: 'PROCEED' | 'PAUSE_CANDIDATE' | 'PREEMPT_EXISTING' | 'MERGE';
    conflictingAgent?: AgentType;
  } {
    const existing = this.activeWorkflows.get(candidate.customerId) || [];
    
    // Filter active (non-completed) workflows
    const active = existing.filter(w => !['RECOVERED', 'LOST', 'STOPPED'].includes(w.status));

    if (active.length === 0) {
      this.activeWorkflows.set(candidate.customerId, [...existing, candidate]);
      return {
        canProceed: true,
        reason: 'No conflicting workflows active for customer.',
        action: 'PROCEED'
      };
    }

    // Check if candidate is same workflow/leak
    const sameWorkflow = active.find(w => w.leakId === candidate.leakId && w.agentType === candidate.agentType);
    if (sameWorkflow) {
      return {
        canProceed: true,
        reason: 'Continuing existing active session.',
        action: 'PROCEED'
      };
    }

    // Evaluate priority between conflicting agents
    const candidatePriority = AGENT_PRIORITY_RANK[candidate.agentType] || 0;
    const highestActive = active.reduce((prev, curr) => {
      const prevP = AGENT_PRIORITY_RANK[prev.agentType] || 0;
      const currP = AGENT_PRIORITY_RANK[curr.agentType] || 0;
      return currP > prevP ? curr : prev;
    }, active[0]);

    const highestPriority = AGENT_PRIORITY_RANK[highestActive.agentType] || 0;

    if (candidatePriority > highestPriority) {
      return {
        canProceed: true,
        reason: `New leak (${candidate.agentType}, priority ${candidatePriority}) preempts lower-priority active agent (${highestActive.agentType}, priority ${highestPriority}).`,
        action: 'PREEMPT_EXISTING',
        conflictingAgent: highestActive.agentType
      };
    } else {
      return {
        canProceed: false,
        reason: `Customer is already in an active ${highestActive.agentType} recovery workflow. Pausing ${candidate.agentType} outreach to avoid customer fatigue.`,
        action: 'PAUSE_CANDIDATE',
        conflictingAgent: highestActive.agentType
      };
    }
  }

  public completeWorkflow(customerId: string, leakId: string): void {
    const workflows = this.activeWorkflows.get(customerId);
    if (workflows) {
      this.activeWorkflows.set(
        customerId,
        workflows.map(w => w.leakId === leakId ? { ...w, status: 'RECOVERED' } : w)
      );
    }
  }
}

export const customerCoordinator = new CustomerCoordinator();
