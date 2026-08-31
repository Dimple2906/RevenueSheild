import { Request, Response } from 'express';
import { AgentType, LeakType, LeakStage, InternalRevenueEvent } from '@revenueshield/shared';
import { revenueOrchestrator } from '@revenueshield/agents';
import { seedDatabase } from '@revenueshield/database';

export const demoController = {
  // Scenario 1: Subscription Payment Failure
  async triggerSubscriptionFailure(req: Request, res: Response) {
    try {
      const event: InternalRevenueEvent = {
        id: `leak_sub_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.SUBSCRIPTION_FAILURE,
        leakStage: LeakStage.AT_PAYMENT,
        assignedAgent: AgentType.SUBSCRIPTION_RECOVERY,
        amountPaise: 249900, // ₹2,499
        triggerEventType: 'subscription.charged_failed',
        razorpayId: `sub_fail_${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_rahul_01',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@example.com',
          phone: '+919876543210',
          ltvPaise: 4500000,
          totalSuccessfulTxns: 14,
          totalFailedTxns: 1,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: {
          errorCode: 'BAD_REQUEST_PAYMENT_DECLINED_BY_BANK',
          errorDescription: 'Bank authorization timeout on automated card recurring cycle.',
          subscriptionPlan: 'Pro Annual Tech SaaS (₹2,499/mo)'
        }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Subscription Failure scenario triggered', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scenario 2: Checkout Abandonment
  async triggerCheckoutAbandonment(req: Request, res: Response) {
    try {
      const event: InternalRevenueEvent = {
        id: `leak_cart_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.CHECKOUT_ABANDONMENT,
        leakStage: LeakStage.PRE_PAYMENT,
        assignedAgent: AgentType.CHECKOUT_RECOVERY,
        amountPaise: 499900, // ₹4,999
        triggerEventType: 'checkout.session_abandoned',
        razorpayId: `order_cart_${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_priya_02',
          name: 'Priya Nair',
          email: 'priya.nair@example.com',
          phone: '+919812345678',
          ltvPaise: 3200000,
          totalSuccessfulTxns: 8,
          totalFailedTxns: 2,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: {
          items: [
            { name: 'Developer Tooling Cloud Suite (1-Year License)', qty: 1, price: 499900 }
          ],
          device: 'Mobile Safari / iOS',
          hesitationTimeSeconds: 140
        }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Checkout Abandonment scenario triggered', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scenario 3: Infrastructure Gateway Degradation
  async triggerPaymentDegradation(req: Request, res: Response) {
    try {
      const event: InternalRevenueEvent = {
        id: `leak_infra_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.INFRASTRUCTURE_DEGRADATION,
        leakStage: LeakStage.AT_PAYMENT,
        assignedAgent: AgentType.INFRASTRUCTURE_GUARD,
        amountPaise: 1280000, // ₹12,800 aggregated at risk
        triggerEventType: 'telemetry.failure_spike_detected',
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_sys_telemetry',
          name: 'System Telemetry Monitor',
          email: 'alerts@revenueshield.ai',
          phone: '+919999999999',
          ltvPaise: 0,
          totalSuccessfulTxns: 100,
          totalFailedTxns: 14,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: {
          affectedBank: 'HDFC Bank',
          affectedMethod: 'UPI',
          failureRatePercentage: 84,
          sampleCount: 25,
          suggestedFallback: 'ICICI / Axis UPI Gateway'
        }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Infrastructure Guard scenario triggered', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scenario 4: Mandate Expiry
  async triggerMandateExpiry(req: Request, res: Response) {
    try {
      const event: InternalRevenueEvent = {
        id: `leak_mandate_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.MANDATE_EXPIRY,
        leakStage: LeakStage.AT_PAYMENT,
        assignedAgent: AgentType.MANDATE_RENEWAL,
        amountPaise: 199900, // ₹1,999
        triggerEventType: 'mandate.expiring_soon',
        razorpayId: `mandate_${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_amit_03',
          name: 'Amit Patel',
          email: 'amit.patel@example.com',
          phone: '+919765432109',
          ltvPaise: 8800000,
          totalSuccessfulTxns: 22,
          totalFailedTxns: 0,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: {
          mandateType: 'UPI_AUTOPAY',
          daysUntilExpiration: 5,
          planName: 'Enterprise Growth Tier'
        }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Mandate Expiry scenario triggered', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scenario 5: Refund Intercept
  async triggerRefundRequest(req: Request, res: Response) {
    try {
      const event: InternalRevenueEvent = {
        id: `leak_refund_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.REFUND_REQUEST,
        leakStage: LeakStage.POST_PAYMENT,
        assignedAgent: AgentType.REFUND_RECOVERY,
        amountPaise: 400000, // ₹4,000
        triggerEventType: 'refund.requested_by_customer',
        razorpayId: `pay_orig_${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_neha_05',
          name: 'Neha Gupta',
          email: 'neha.gupta@example.com',
          phone: '+919543210987',
          ltvPaise: 1850000,
          totalSuccessfulTxns: 5,
          totalFailedTxns: 3,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: {
          refundReason: 'Delivery delay of 3 days; requested full refund.',
          originalPaymentId: `pay_${Date.now().toString(36)}`
        }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Refund Intercept scenario triggered', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scenario 6: Overdue B2B Invoice
  async triggerInvoiceOverdue(req: Request, res: Response) {
    try {
      const event: InternalRevenueEvent = {
        id: `leak_inv_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.INVOICE_OVERDUE,
        leakStage: LeakStage.POST_PAYMENT,
        assignedAgent: AgentType.RECEIVABLES,
        amountPaise: 2500000, // ₹25,000 (Exceeds ₹10,000 human threshold!)
        triggerEventType: 'invoice.past_due_threshold',
        razorpayId: `inv_corp_${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_vikram_04',
          name: 'Vikram Singh (Enterprise Corp)',
          email: 'vikram.singh@enterprisecorp.in',
          phone: '+919654321098',
          ltvPaise: 25000000,
          totalSuccessfulTxns: 36,
          totalFailedTxns: 1,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: {
          invoiceNumber: 'INV-2026-9812',
          overdueDays: 45,
          originalDueDate: '2026-07-15'
        }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Invoice Overdue scenario triggered (Held for Human Review)', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scenario 7: Promise to Pay NLP
  async triggerPromiseToPay(req: Request, res: Response) {
    try {
      const event: InternalRevenueEvent = {
        id: `leak_p2p_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.PROMISE_BREACH,
        leakStage: LeakStage.POST_PAYMENT,
        assignedAgent: AgentType.PROMISE_TO_PAY,
        amountPaise: 350000, // ₹3,500
        triggerEventType: 'support_chat.promise_extracted',
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_rohan_07',
          name: 'Rohan Verma',
          email: 'rohan.verma@example.com',
          phone: '+919321098765',
          ltvPaise: 2200000,
          totalSuccessfulTxns: 6,
          totalFailedTxns: 1,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: {
          extractedText: 'Customer text: "Hey team, salary credited on 30th. I will pay ₹3,500 on Friday afternoon for sure."',
          promisedDate: new Date(Date.now() + 3 * 86400000).toISOString()
        }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Promise-to-Pay scenario triggered', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scenario 8: Churn Risk Intervention
  async triggerChurnRisk(req: Request, res: Response) {
    try {
      const event: InternalRevenueEvent = {
        id: `leak_churn_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.CHURN_RISK,
        leakStage: LeakStage.PRE_PAYMENT,
        assignedAgent: AgentType.CHURN_PREVENTION,
        amountPaise: 750000, // ₹7,500
        triggerEventType: 'analytics.churn_risk_high',
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_sanya_08',
          name: 'Sanya Malhotra',
          email: 'sanya.m@example.com',
          phone: '+919210987654',
          ltvPaise: 9500000,
          totalSuccessfulTxns: 19,
          totalFailedTxns: 2,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: {
          riskScore: 0.88,
          factors: ['API usage dropped 75% in 14 days', 'Visited cancellation page twice']
        }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Churn Risk scenario triggered', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scenario 9: Voice Telephony Recovery
  async triggerVoiceRecovery(req: Request, res: Response) {
    try {
      const event: InternalRevenueEvent = {
        id: `leak_voice_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.VOICE_RECOVERY,
        leakStage: LeakStage.POST_PAYMENT,
        assignedAgent: AgentType.VOICE_RECOVERY,
        amountPaise: 150000, // ₹1,500
        triggerEventType: 'dunning.voice_call_scheduled',
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_manoj_09',
          name: 'Manoj Kumar',
          email: 'manoj.k@example.com',
          phone: '+919109876543',
          ltvPaise: 1500000,
          totalSuccessfulTxns: 4,
          totalFailedTxns: 2,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: {
          language: 'hinglish',
          dueDate: 'today'
        }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Voice Recovery scenario triggered', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Scenario 10: Multi-Agent Conflict (Customer Coordinator Demonstration)
  async triggerMultiAgentConflict(req: Request, res: Response) {
    try {
      // 1. First trigger a Subscription Failure on Priya
      const event1: InternalRevenueEvent = {
        id: `leak_conflict_sub_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.SUBSCRIPTION_FAILURE,
        leakStage: LeakStage.AT_PAYMENT,
        assignedAgent: AgentType.SUBSCRIPTION_RECOVERY,
        amountPaise: 350000, // ₹3,500
        triggerEventType: 'subscription.charged_failed',
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_priya_02',
          name: 'Priya Nair',
          email: 'priya.nair@example.com',
          phone: '+919812345678',
          ltvPaise: 3200000,
          totalSuccessfulTxns: 8,
          totalFailedTxns: 2,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: { plan: 'Tech Suite' }
      };

      const res1 = await revenueOrchestrator.handleEvent(event1);

      // 2. Immediately trigger Cart Abandonment for the SAME customer Priya
      const event2: InternalRevenueEvent = {
        id: `leak_conflict_cart_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: LeakType.CHECKOUT_ABANDONMENT,
        leakStage: LeakStage.PRE_PAYMENT,
        assignedAgent: AgentType.CHECKOUT_RECOVERY,
        amountPaise: 120000, // ₹1,200
        triggerEventType: 'checkout.session_abandoned',
        timestamp: new Date().toISOString(),
        customer: {
          id: 'cust_priya_02',
          name: 'Priya Nair',
          email: 'priya.nair@example.com',
          phone: '+919812345678',
          ltvPaise: 3200000,
          totalSuccessfulTxns: 8,
          totalFailedTxns: 2,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: { items: [{ name: 'Add-on Pack', qty: 1 }] }
      };

      const res2 = await revenueOrchestrator.handleEvent(event2);

      res.json({
        success: true,
        message: 'Multi-Agent Conflict scenario executed. Customer Coordinator resolved conflict automatically.',
        primaryWorkflow: res1,
        secondaryWorkflow: res2
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Reset Database to Seed State
  async resetDatabase(req: Request, res: Response) {
    try {
      await seedDatabase();
      res.json({ success: true, message: 'Database reset and re-seeded with realistic fintech data.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  // Inject Custom Revenue Leak Event
  async triggerCustomEvent(req: Request, res: Response) {
    try {
      const { 
        customerName = 'Custom Merchant Client',
        customerEmail = 'client@example.com',
        customerPhone = '+919876543210',
        leakType = 'SUBSCRIPTION_FAILURE',
        leakStage = 'AT_PAYMENT',
        amountPaise = 350000,
        description = 'Custom payment failure injected via War Room Console'
      } = req.body;

      const agentMap: Record<string, AgentType> = {
        'SUBSCRIPTION_FAILURE': AgentType.SUBSCRIPTION_RECOVERY,
        'CHECKOUT_ABANDONMENT': AgentType.CHECKOUT_RECOVERY,
        'OVERDUE_INVOICE': AgentType.RECEIVABLES,
        'MANDATE_EXPIRY': AgentType.MANDATE_RENEWAL,
        'REFUND_REQUEST': AgentType.REFUND_RECOVERY,
        'PAYMENT_DEGRADATION': AgentType.INFRASTRUCTURE_GUARD
      };

      const assignedAgent = agentMap[leakType] || AgentType.SUBSCRIPTION_RECOVERY;

      const event: InternalRevenueEvent = {
        id: `leak_custom_${Date.now().toString(36)}`,
        merchantId: 'merchant_acme_01',
        leakType: leakType as LeakType,
        leakStage: leakStage as LeakStage,
        assignedAgent,
        amountPaise: Number(amountPaise),
        triggerEventType: `custom.${leakType.toLowerCase()}`,
        timestamp: new Date().toISOString(),
        customer: {
          id: `cust_custom_${Date.now().toString(36)}`,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          ltvPaise: 5000000,
          totalSuccessfulTxns: 10,
          totalFailedTxns: 1,
          isOptedOut: false,
          isHumanHandled: false
        },
        payload: { description }
      };

      const result = await revenueOrchestrator.handleEvent(event);
      res.json({ success: true, message: 'Custom event processed through 9-stage Universal Recovery Loop', result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
};
