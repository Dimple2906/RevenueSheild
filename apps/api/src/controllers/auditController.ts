import { Request, Response } from 'express';
import { prisma } from '@revenueshield/database';
import { formatPaiseToINR } from '@revenueshield/shared';

export const auditController = {
  async getAuditLogs(req: Request, res: Response) {
    try {
      const { leakId, agentType, eventType, limit = 50, offset = 0 } = req.query;

      const whereClause: any = {};
      if (leakId) whereClause.leakId = String(leakId);
      if (agentType && agentType !== 'ALL') whereClause.agentType = String(agentType);
      if (eventType && eventType !== 'ALL') whereClause.eventType = String(eventType);

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where: whereClause,
          take: Number(limit),
          skip: Number(offset),
          orderBy: { createdAt: 'desc' },
          include: {
            leak: {
              select: {
                id: true,
                leakType: true,
                customer: { select: { name: true, email: true } }
              }
            }
          }
        }),
        prisma.auditLog.count({ where: whereClause })
      ]);

      const formatted = logs.map(l => ({
        ...l,
        amountAtRiskFormatted: l.amountAtRiskPaise ? formatPaiseToINR(l.amountAtRiskPaise) : null,
        amountRecoveredFormatted: l.amountRecoveredPaise ? formatPaiseToINR(l.amountRecoveredPaise) : null,
        parsedMetadata: l.metadata ? (typeof l.metadata === 'string' ? JSON.parse(l.metadata) : l.metadata) : null
      }));

      res.json({
        logs: formatted,
        total,
        limit: Number(limit),
        offset: Number(offset)
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};
