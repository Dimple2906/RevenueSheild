import { Request, Response } from 'express';
import { prisma } from '@revenueshield/database';
import { AgentType } from '@revenueshield/shared';

const AGENT_METADATA: Record<AgentType, { name: string; description: string; stage: string; icon: string }> = {
  [AgentType.SUBSCRIPTION_RECOVERY]: {
    name: 'Subscription Recovery Agent',
    description: 'Auto-heals recurring billing failures with smart payment links & dunning retries.',
    stage: 'AT_PAYMENT',
    icon: 'RefreshCw'
  },
  [AgentType.INFRASTRUCTURE_GUARD]: {
    name: 'Infrastructure Guard Agent',
    description: 'Real-time telemetry cluster detector for NPCI & bank gateway degradations.',
    stage: 'AT_PAYMENT',
    icon: 'ShieldAlert'
  },
  [AgentType.CHECKOUT_RECOVERY]: {
    name: 'Checkout Recovery Agent (Cart Rescuer)',
    description: 'Recovers high-intent abandoned carts with bounded dynamic incentive links.',
    stage: 'PRE_PAYMENT',
    icon: 'ShoppingCart'
  },
  [AgentType.MANDATE_RENEWAL]: {
    name: 'Mandate Renewal Agent',
    description: 'Proactively identifies expiring UPI Autopay / eNACH mandates before cycle drop.',
    stage: 'AT_PAYMENT',
    icon: 'FileCheck'
  },
  [AgentType.REFUND_RECOVERY]: {
    name: 'Refund Recovery Agent',
    description: 'Intercepts refund requests with bonus store credit counteroffers to protect GMV.',
    stage: 'POST_PAYMENT',
    icon: 'RotateCcw'
  },
  [AgentType.RECEIVABLES]: {
    name: 'Receivables Agent',
    description: 'Autonomous B2B aging invoice collection with structured payment schedules.',
    stage: 'POST_PAYMENT',
    icon: 'Receipt'
  },
  [AgentType.PROMISE_TO_PAY]: {
    name: 'Promise-to-Pay Agent',
    description: 'NLP commitment parser for chat/SMS with auto-generated time-locked links.',
    stage: 'POST_PAYMENT',
    icon: 'CalendarCheck'
  },
  [AgentType.CHURN_PREVENTION]: {
    name: 'Churn Prevention Agent',
    description: 'Predicts high churn risk accounts and triggers retention incentives.',
    stage: 'PRE_PAYMENT',
    icon: 'UserMinus'
  },
  [AgentType.VOICE_RECOVERY]: {
    name: 'Voice Recovery Agent',
    description: 'Multilingual conversational AI telephony dunning (Hinglish/Tamil/English) with TRAI compliance.',
    stage: 'POST_PAYMENT',
    icon: 'PhoneCall'
  },
  [AgentType.PAYMENT_DETECTIVE]: {
    name: 'Payment Detective Agent',
    description: 'Deep root-cause analyzer across failure clusters, BINs, and payment methods.',
    stage: 'AT_PAYMENT',
    icon: 'Search'
  },
};

export const agentsController = {
  async getAgents(req: Request, res: Response) {
    try {
      const leaks = await prisma.revenueLeak.findMany({
        select: {
          assignedAgent: true,
          status: true,
          amountAtRiskPaise: true,
          amountRecoveredPaise: true
        }
      });

      const statsMap: Record<string, { total: number; recovered: number; count: number; active: number }> = {};

      for (const leak of leaks) {
        if (!statsMap[leak.assignedAgent]) {
          statsMap[leak.assignedAgent] = { total: 0, recovered: 0, count: 0, active: 0 };
        }
        statsMap[leak.assignedAgent].total += leak.amountAtRiskPaise;
        statsMap[leak.assignedAgent].recovered += leak.amountRecoveredPaise;
        statsMap[leak.assignedAgent].count += 1;
        if (['DETECTED', 'ANALYZING', 'ACTION_EXECUTED', 'PENDING_HUMAN_APPROVAL'].includes(leak.status)) {
          statsMap[leak.assignedAgent].active += 1;
        }
      }

      const agentsList = Object.values(AgentType).map(type => {
        const meta = AGENT_METADATA[type];
        const stats = statsMap[type] || { total: 0, recovered: 0, count: 0, active: 0 };
        const successRate = stats.total > 0 ? Math.round((stats.recovered / stats.total) * 100) : 92;

        return {
          type,
          name: meta.name,
          description: meta.description,
          stage: meta.stage,
          icon: meta.icon,
          status: stats.active > 0 ? 'ACTIVE' : 'STANDBY',
          totalCases: stats.count,
          activeCases: stats.active,
          successRatePercentage: successRate,
          totalRecoveredPaise: stats.recovered,
        };
      });

      res.json({ agents: agentsList });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getActivity(req: Request, res: Response) {
    try {
      const logs = await prisma.auditLog.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' }
      });

      res.json({ activities: logs });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};
