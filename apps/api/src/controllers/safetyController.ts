import { Request, Response } from 'express';
import { prisma } from '@revenueshield/database';

export const safetyController = {
  async getPolicies(req: Request, res: Response) {
    try {
      let policy = await prisma.merchantPolicy.findFirst();

      if (!policy) {
        const merchant = await prisma.merchant.findFirst();
        if (merchant) {
          policy = await prisma.merchantPolicy.create({
            data: {
              merchantId: merchant.id,
              maxAutonomousAmountPaise: 500000,
              maxDiscountPercentage: 15,
              maxRecoveryAttempts: 3,
              customerCooldownHours: 24,
              humanApprovalThresholdPaise: 1000000,
              allowVoiceRecovery: true,
              allowStoreCreditCounter: true,
              optOutKeywords: 'STOP,UNSUBSCRIBE,OPTOUT,CANCEL,DND'
            }
          });
        }
      }

      res.json({ policy });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async updatePolicies(req: Request, res: Response) {
    try {
      const {
        maxAutonomousAmountPaise,
        maxDiscountPercentage,
        maxRecoveryAttempts,
        customerCooldownHours,
        humanApprovalThresholdPaise,
        allowVoiceRecovery,
        allowStoreCreditCounter,
        optOutKeywords
      } = req.body;

      const merchant = await prisma.merchant.findFirst();
      if (!merchant) {
        return res.status(404).json({ error: 'Merchant not found' });
      }

      const updated = await prisma.merchantPolicy.upsert({
        where: { merchantId: merchant.id },
        update: {
          maxAutonomousAmountPaise: maxAutonomousAmountPaise !== undefined ? Number(maxAutonomousAmountPaise) : undefined,
          maxDiscountPercentage: maxDiscountPercentage !== undefined ? Number(maxDiscountPercentage) : undefined,
          maxRecoveryAttempts: maxRecoveryAttempts !== undefined ? Number(maxRecoveryAttempts) : undefined,
          customerCooldownHours: customerCooldownHours !== undefined ? Number(customerCooldownHours) : undefined,
          humanApprovalThresholdPaise: humanApprovalThresholdPaise !== undefined ? Number(humanApprovalThresholdPaise) : undefined,
          allowVoiceRecovery: allowVoiceRecovery !== undefined ? Boolean(allowVoiceRecovery) : undefined,
          allowStoreCreditCounter: allowStoreCreditCounter !== undefined ? Boolean(allowStoreCreditCounter) : undefined,
          optOutKeywords: optOutKeywords !== undefined ? (Array.isArray(optOutKeywords) ? optOutKeywords.join(',') : String(optOutKeywords)) : undefined,
        },
        create: {
          merchantId: merchant.id,
          maxAutonomousAmountPaise: Number(maxAutonomousAmountPaise || 500000),
          maxDiscountPercentage: Number(maxDiscountPercentage || 15),
          maxRecoveryAttempts: Number(maxRecoveryAttempts || 3),
          customerCooldownHours: Number(customerCooldownHours || 24),
          humanApprovalThresholdPaise: Number(humanApprovalThresholdPaise || 1000000),
          allowVoiceRecovery: Boolean(allowVoiceRecovery ?? true),
          allowStoreCreditCounter: Boolean(allowStoreCreditCounter ?? true),
          optOutKeywords: Array.isArray(optOutKeywords) ? optOutKeywords.join(',') : 'STOP,UNSUBSCRIBE,OPTOUT,CANCEL,DND'
        }
      });

      res.json({ success: true, policy: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async getPendingApprovals(req: Request, res: Response) {
    try {
      const pendingLeaks = await prisma.revenueLeak.findMany({
        where: { requiresHumanReview: true },
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

      res.json({ pending: pendingLeaks, count: pendingLeaks.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};
