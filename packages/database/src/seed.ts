import { prisma } from './client.js';

export async function seedDatabase() {
  console.log('🌱 Seeding RevenueShield database with realistic production merchant data...');

  // Clean existing tables
  await prisma.auditLog.deleteMany();
  await prisma.safetyCheck.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.recoveryAction.deleteMany();
  await prisma.recoverySession.deleteMany();
  await prisma.revenueLeak.deleteMany();
  await prisma.paymentPromise.deleteMany();
  await prisma.refundIntercept.deleteMany();
  await prisma.churnRiskScore.deleteMany();
  await prisma.mandate.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.merchantPolicy.deleteMany();
  await prisma.merchant.deleteMany();

  // 1. Create Default Merchant
  const merchant = await prisma.merchant.create({
    data: {
      id: 'merchant_acme_01',
      name: 'Acme SaaS India',
      slug: 'acme-saas',
      currency: 'INR',
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo12345678',
      razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'secret_demo12345678',
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_demo',
      policies: {
        create: {
          maxAutonomousAmountPaise: 500000,      // ₹5,000
          maxDiscountPercentage: 15,            // 15% max
          maxRecoveryAttempts: 3,
          customerCooldownHours: 24,
          humanApprovalThresholdPaise: 1000000, // ₹10,000
          allowVoiceRecovery: true,
          allowStoreCreditCounter: true,
          optOutKeywords: 'STOP,UNSUBSCRIBE,OPTOUT,CANCEL,DND'
        }
      },
      users: {
        create: [
          {
            id: 'user_admin_01',
            name: 'Karan Mehra',
            email: 'admin@revenueshield.ai',
            passwordHash: 'admin123',
            role: 'MERCHANT_ADMIN'
          },
          {
            id: 'user_finance_01',
            name: 'Ananya Roy',
            email: 'finance@revenueshield.ai',
            passwordHash: 'finance123',
            role: 'FINANCE_MANAGER'
          },
          {
            id: 'user_csm_01',
            name: 'Rohan Verma',
            email: 'csm@revenueshield.ai',
            passwordHash: 'csm123',
            role: 'SUPPORT_CSM'
          }
        ]
      }
    }
  });

  // 2. Create Customers
  const rahul = await prisma.customer.create({
    data: {
      id: 'cust_rahul_01',
      merchantId: merchant.id,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+919876543210',
      ltvPaise: 4500000, // ₹45,000
      totalSuccessfulTxns: 14,
      totalFailedTxns: 1,
      isOptedOut: false,
      isHumanHandled: false
    }
  });

  const priya = await prisma.customer.create({
    data: {
      id: 'cust_priya_02',
      merchantId: merchant.id,
      name: 'Priya Nair',
      email: 'priya.nair@example.com',
      phone: '+919812345678',
      ltvPaise: 3200000, // ₹32,000
      totalSuccessfulTxns: 8,
      totalFailedTxns: 2,
      isOptedOut: false,
      isHumanHandled: false
    }
  });

  const vikram = await prisma.customer.create({
    data: {
      id: 'cust_vikram_04',
      merchantId: merchant.id,
      name: 'Vikram Singh (Enterprise Corp)',
      email: 'vikram.singh@enterprisecorp.in',
      phone: '+919654321098',
      ltvPaise: 25000000, // ₹2,50,000
      totalSuccessfulTxns: 36,
      totalFailedTxns: 1,
      isOptedOut: false,
      isHumanHandled: false
    }
  });

  const amit = await prisma.customer.create({
    data: {
      id: 'cust_amit_03',
      merchantId: merchant.id,
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '+919765432109',
      ltvPaise: 8800000, // ₹88,000
      totalSuccessfulTxns: 22,
      totalFailedTxns: 0,
      isOptedOut: false,
      isHumanHandled: false
    }
  });

  const neha = await prisma.customer.create({
    data: {
      id: 'cust_neha_05',
      merchantId: merchant.id,
      name: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      phone: '+919543210987',
      ltvPaise: 1850000, // ₹18,500
      totalSuccessfulTxns: 5,
      totalFailedTxns: 3,
      isOptedOut: false,
      isHumanHandled: false
    }
  });

  const arjun = await prisma.customer.create({
    data: {
      id: 'cust_arjun_06',
      merchantId: merchant.id,
      name: 'Arjun Menon',
      email: 'arjun.menon@example.com',
      phone: '+919432109876',
      ltvPaise: 6400000, // ₹64,000
      totalSuccessfulTxns: 18,
      totalFailedTxns: 1,
      isOptedOut: true, // Opted out for safety firewall demo
      isHumanHandled: false
    }
  });

  // 3. Seed Leaks & Recovery Pipeline
  const leak1 = await prisma.revenueLeak.create({
    data: {
      id: 'leak_sub_01',
      merchantId: merchant.id,
      customerId: rahul.id,
      leakType: 'SUBSCRIPTION_FAILURE',
      leakStage: 'AT_PAYMENT',
      amountAtRiskPaise: 249900, // ₹2,499
      amountRecoveredPaise: 249900,
      priorityScore: 0.92,
      triggerEventType: 'subscription.charged_failed',
      triggerRazorpayId: 'sub_live_987654',
      status: 'RECOVERED',
      assignedAgent: 'SUBSCRIPTION_RECOVERY',
      rootCauseDiagnosis: 'Temporary card debit failure due to bank OTP timeout.',
      aiConfidenceScore: 0.94,
      recoveryStrategy: 'Automated 48h dynamic payment link with 0% discount.',
      requiresHumanReview: false,
      resolvedAt: new Date(),
      recoverySessions: {
        create: {
          id: 'sess_sub_01',
          customerId: rahul.id,
          agentType: 'SUBSCRIPTION_RECOVERY',
          currentStep: 'COMPLETED',
          attemptCount: 1,
          status: 'RECOVERED',
          actions: {
            create: {
              id: 'act_sub_01',
              actionType: 'CREATE_PAYMENT_LINK',
              proposedPayload: JSON.stringify({ amountPaise: 249900, customerId: rahul.id }),
              razorpayResourceId: 'plink_sub_rec_1001',
              razorpayResourceUrl: 'https://rzp.io/i/sub1001',
              amountPaise: 249900,
              discountPaise: 0,
              status: 'RECOVERED',
              isSimulated: false,
              executedAt: new Date()
            }
          },
          safetyChecks: {
            create: {
              status: 'PASSED',
              passed: true,
              policyViolations: '[]',
              checkedRules: JSON.stringify([
                { ruleName: 'MaxAutonomousAmountRule', passed: true, reason: '₹2,499 <= ₹5,000 policy limit' },
                { ruleName: 'CustomerCooldownRule', passed: true, reason: 'Customer not contacted in last 24h' },
                { ruleName: 'OptOutProtectionRule', passed: true, reason: 'Customer is active subscriber' }
              ])
            }
          }
        }
      }
    }
  });

  const leak2 = await prisma.revenueLeak.create({
    data: {
      id: 'leak_cart_02',
      merchantId: merchant.id,
      customerId: priya.id,
      leakType: 'CHECKOUT_ABANDONMENT',
      leakStage: 'PRE_PAYMENT',
      amountAtRiskPaise: 499900, // ₹4,999
      amountRecoveredPaise: 449910, // ₹4,499.10 (after 10% coupon)
      priorityScore: 0.88,
      triggerEventType: 'checkout.session_abandoned',
      status: 'RECOVERED',
      assignedAgent: 'CHECKOUT_RECOVERY',
      rootCauseDiagnosis: 'High intent shopper dropped at payment selection screen.',
      aiConfidenceScore: 0.89,
      recoveryStrategy: 'Personalized recovery link with bounded 10% incentive coupon.',
      requiresHumanReview: false,
      resolvedAt: new Date(),
      recoverySessions: {
        create: {
          id: 'sess_cart_02',
          customerId: priya.id,
          agentType: 'CHECKOUT_RECOVERY',
          currentStep: 'COMPLETED',
          attemptCount: 1,
          status: 'RECOVERED',
          actions: {
            create: {
              id: 'act_cart_02',
              actionType: 'CREATE_PAYMENT_LINK',
              proposedPayload: JSON.stringify({ amountPaise: 499900, discountPercentage: 10 }),
              razorpayResourceId: 'plink_cart_rec_2002',
              razorpayResourceUrl: 'https://rzp.io/i/cart2002',
              amountPaise: 499900,
              discountPaise: 49990,
              status: 'RECOVERED',
              isSimulated: false,
              executedAt: new Date()
            }
          },
          safetyChecks: {
            create: {
              status: 'PASSED',
              passed: true,
              policyViolations: '[]',
              checkedRules: JSON.stringify([
                { ruleName: 'MaxDiscountRule', passed: true, reason: '10% discount <= 15% policy cap' },
                { ruleName: 'DuplicateLinkGuardRule', passed: true, reason: 'No prior link active' }
              ])
            }
          }
        }
      }
    }
  });

  const leak3 = await prisma.revenueLeak.create({
    data: {
      id: 'leak_b2b_03',
      merchantId: merchant.id,
      customerId: vikram.id,
      leakType: 'OVERDUE_INVOICE',
      leakStage: 'POST_PAYMENT',
      amountAtRiskPaise: 2500000, // ₹25,000
      amountRecoveredPaise: 0,
      priorityScore: 0.96,
      triggerEventType: 'invoice.overdue',
      status: 'PENDING_HUMAN_APPROVAL',
      assignedAgent: 'RECEIVABLES_AGENT',
      rootCauseDiagnosis: 'Enterprise invoice past 30-day payment term. Amount exceeds ₹5,000 threshold.',
      aiConfidenceScore: 0.91,
      recoveryStrategy: 'Itemized Razorpay Invoice with structured 10% late-fee waiver recommendation.',
      requiresHumanReview: true,
      recoverySessions: {
        create: {
          id: 'sess_b2b_03',
          customerId: vikram.id,
          agentType: 'RECEIVABLES_AGENT',
          currentStep: 'WAITING_HUMAN_APPROVAL',
          attemptCount: 1,
          status: 'PENDING_HUMAN_APPROVAL',
          safetyChecks: {
            create: {
              status: 'FAILED',
              passed: false,
              policyViolations: '["AMOUNT_EXCEEDS_AUTONOMOUS_CAP"]',
              checkedRules: JSON.stringify([
                { ruleName: 'MaxAutonomousAmountRule', passed: false, reason: '₹25,000 > ₹5,000 autonomous threshold' }
              ])
            }
          }
        }
      }
    }
  });

  const leak4 = await prisma.revenueLeak.create({
    data: {
      id: 'leak_infra_04',
      merchantId: merchant.id,
      customerId: amit.id,
      leakType: 'PAYMENT_DEGRADATION',
      leakStage: 'AT_PAYMENT',
      amountAtRiskPaise: 1250000, // ₹12,500
      amountRecoveredPaise: 0,
      priorityScore: 0.95,
      triggerEventType: 'gateway.degradation_detected',
      status: 'ACTIVE_RECOVERY',
      assignedAgent: 'INFRASTRUCTURE_GUARD',
      rootCauseDiagnosis: '84% failure cluster spike detected on HDFC UPI handle switch.',
      aiConfidenceScore: 0.96,
      recoveryStrategy: 'Quarantine retries for 15 minutes, then issue dynamic ICICI smart routing advisory.',
      requiresHumanReview: false
    }
  });

  const leak5 = await prisma.revenueLeak.create({
    data: {
      id: 'leak_mandate_05',
      merchantId: merchant.id,
      customerId: amit.id,
      leakType: 'MANDATE_EXPIRY',
      leakStage: 'AT_PAYMENT',
      amountAtRiskPaise: 750000, // ₹7,500
      amountRecoveredPaise: 0,
      priorityScore: 0.89,
      triggerEventType: 'mandate.expiring_soon',
      status: 'ACTIVE_RECOVERY',
      assignedAgent: 'MANDATE_RENEWAL',
      rootCauseDiagnosis: 'UPI Autopay mandate expiring in 48 hours.',
      aiConfidenceScore: 0.90,
      recoveryStrategy: 'Proactive 1-click Razorpay mandate refresh link sent via WhatsApp.',
      requiresHumanReview: false
    }
  });

  // 4. Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        merchantId: merchant.id,
        leakId: leak1.id,
        agentType: 'SUBSCRIPTION_RECOVERY',
        eventType: 'LEAK_DETECTED',
        message: 'Subscription payment failed for Rahul Sharma (Amount: ₹2,499).',
        metadata: JSON.stringify({ razorpaySubscriptionId: 'sub_live_987654' }),
        amountAtRiskPaise: 249900,
        amountRecoveredPaise: 0
      },
      {
        merchantId: merchant.id,
        leakId: leak1.id,
        agentType: 'SUBSCRIPTION_RECOVERY',
        eventType: 'AI_DIAGNOSED',
        message: 'AI classified root cause: temporary card timeout (Confidence: 94%). Recommended payment link.',
        metadata: JSON.stringify({ confidence: 0.94 }),
        amountAtRiskPaise: 249900
      },
      {
        merchantId: merchant.id,
        leakId: leak1.id,
        agentType: 'SUBSCRIPTION_RECOVERY',
        eventType: 'SAFETY_EVALUATED',
        message: 'Safety Engine passed all 6 deterministic guardrails.',
        metadata: JSON.stringify({ status: 'PASSED' })
      },
      {
        merchantId: merchant.id,
        leakId: leak1.id,
        agentType: 'SUBSCRIPTION_RECOVERY',
        eventType: 'ACTION_EXECUTED',
        message: 'Razorpay payment link plink_sub_rec_1001 generated and dispatched.',
        metadata: JSON.stringify({ paymentLinkId: 'plink_sub_rec_1001' })
      },
      {
        merchantId: merchant.id,
        leakId: leak1.id,
        agentType: 'SUBSCRIPTION_RECOVERY',
        eventType: 'PAYMENT_RECOVERED',
        message: 'Payment received via Razorpay webhook. ₹2,499 successfully recovered!',
        amountAtRiskPaise: 249900,
        amountRecoveredPaise: 249900
      },
      {
        merchantId: merchant.id,
        leakId: leak3.id,
        agentType: 'RECEIVABLES_AGENT',
        eventType: 'SAFETY_HELD',
        message: 'Action held for human approval: ₹25,000 exceeds ₹5,000 autonomous policy cap.',
        amountAtRiskPaise: 2500000
      }
    ]
  });

  console.log('✅ Seed completed successfully! Production merchant created with realistic revenue recovery pipeline.');
}

if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase()
    .then(() => prisma.$disconnect())
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      prisma.$disconnect();
      process.exit(1);
    });
}
