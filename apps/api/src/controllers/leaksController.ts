import { Request, Response } from 'express';
import { prisma } from '@revenueshield/database';
import { revenueOrchestrator } from '@revenueshield/agents';
import { formatPaiseToINR } from '@revenueshield/shared';

export const leaksController = {
  async getLeaks(req: Request, res: Response) {
    try {
      const { status, stage, agent, search } = req.query;

      const whereClause: any = {};
      if (status && status !== 'ALL') whereClause.status = String(status);
      if (stage && stage !== 'ALL') whereClause.leakStage = String(stage);
      if (agent && agent !== 'ALL') whereClause.assignedAgent = String(agent);

      if (search) {
        whereClause.OR = [
          { customer: { name: { contains: String(search) } } },
          { customer: { email: { contains: String(search) } } },
          { id: { contains: String(search) } },
          { triggerRazorpayId: { contains: String(search) } },
        ];
      }

      const leaks = await prisma.revenueLeak.findMany({
        where: whereClause,
        include: {
          customer: true,
          recoverySessions: {
            include: {
              actions: true,
              safetyChecks: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const formatted = leaks.map(l => ({
        id: l.id,
        leakType: l.leakType,
        leakStage: l.leakStage,
        amountAtRiskPaise: l.amountAtRiskPaise,
        amountAtRiskFormatted: formatPaiseToINR(l.amountAtRiskPaise),
        amountRecoveredPaise: l.amountRecoveredPaise,
        amountRecoveredFormatted: formatPaiseToINR(l.amountRecoveredPaise),
        priorityScore: l.priorityScore,
        status: l.status,
        assignedAgent: l.assignedAgent,
        rootCauseDiagnosis: l.rootCauseDiagnosis,
        aiConfidenceScore: l.aiConfidenceScore,
        recoveryStrategy: l.recoveryStrategy,
        requiresHumanReview: l.requiresHumanReview,
        detectedAt: l.detectedAt,
        resolvedAt: l.resolvedAt,
        customer: l.customer ? {
          id: l.customer.id,
          name: l.customer.name,
          email: l.customer.email,
          phone: l.customer.phone,
          ltvFormatted: formatPaiseToINR(l.customer.ltvPaise),
          isOptedOut: l.customer.isOptedOut
        } : null,
        latestAction: l.recoverySessions[0]?.actions[0] || null
      }));

      res.json({ leaks: formatted, count: formatted.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getLeakById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const leak = await prisma.revenueLeak.findUnique({
        where: { id },
        include: {
          customer: true,
          auditLogs: { orderBy: { createdAt: 'asc' } },
          recoverySessions: {
            include: {
              actions: true,
              safetyChecks: true,
              agentRuns: true
            }
          }
        }
      });

      if (!leak) {
        return res.status(404).json({ error: `Leak ${id} not found` });
      }

      res.json({
        leak: {
          ...leak,
          amountAtRiskFormatted: formatPaiseToINR(leak.amountAtRiskPaise),
          amountRecoveredFormatted: formatPaiseToINR(leak.amountRecoveredPaise),
          customer: leak.customer ? {
            ...leak.customer,
            ltvFormatted: formatPaiseToINR(leak.customer.ltvPaise)
          } : null
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async approveAction(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { approvedBy = 'Merchant Admin', overrideDiscount } = req.body;

      const result = await revenueOrchestrator.approveAction({
        leakId: id,
        approvedBy,
        overrideDiscount: overrideDiscount !== undefined ? Number(overrideDiscount) : undefined
      });

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async rejectAction(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rejectedBy = 'Merchant Admin', reason = 'Manual rejection by admin' } = req.body;

      const result = await revenueOrchestrator.rejectAction({
        leakId: id,
        rejectedBy,
        reason
      });

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async simulatePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await revenueOrchestrator.simulatePaymentRecovery(id);
      res.json({
        message: `Successfully recovered ₹${(result.amountRecoveredPaise / 100).toFixed(2)} for case ${id}`,
        ...result
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
};
