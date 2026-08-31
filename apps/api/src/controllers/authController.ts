import { Request, Response } from 'express';
import { prisma } from '@revenueshield/database';

export const authController = {
  async getMe(req: Request, res: Response) {
    try {
      const merchant = await prisma.merchant.findFirst({
        include: {
          policies: true,
          users: true
        }
      });

      if (!merchant) {
        return res.status(404).json({ error: 'Merchant not found' });
      }

      res.json({
        merchant: {
          id: merchant.id,
          name: merchant.name,
          slug: merchant.slug,
          currency: merchant.currency,
          isLiveRazorpayConfigured: Boolean(merchant.razorpayKeyId?.startsWith('rzp_live_')),
        },
        user: merchant.users[0] || {
          id: 'user_admin_01',
          name: 'Karan Mehra',
          email: 'admin@revenueshield.ai',
          role: 'MERCHANT_ADMIN'
        },
        availableRoles: ['MERCHANT_ADMIN', 'FINANCE_MANAGER', 'SUPPORT_CSM', 'VIEWER']
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async switchRole(req: Request, res: Response) {
    const { role } = req.body;
    res.json({
      success: true,
      activeRole: role || 'MERCHANT_ADMIN',
      message: `Role switched to ${role}`
    });
  }
};
