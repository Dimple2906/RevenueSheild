import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { dashboardController } from '../controllers/dashboardController.js';
import { leaksController } from '../controllers/leaksController.js';
import { agentsController } from '../controllers/agentsController.js';
import { safetyController } from '../controllers/safetyController.js';
import { auditController } from '../controllers/auditController.js';
import { webhookController } from '../controllers/webhookController.js';
import { demoController } from '../controllers/demoController.js';

export const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'RevenueShield AI OS' });
});

// Auth
router.get('/auth/me', authController.getMe);
router.post('/auth/switch-role', authController.switchRole);

// Dashboard
router.get('/dashboard/overview', dashboardController.getOverview);
router.get('/dashboard/funnel', dashboardController.getFunnel);
router.get('/dashboard/timeline', dashboardController.getTimeline);

// Revenue Leaks & Cases
router.get('/revenue-leaks', leaksController.getLeaks);
router.get('/revenue-leaks/:id', leaksController.getLeakById);
router.post('/revenue-leaks/:id/approve', leaksController.approveAction);
router.post('/revenue-leaks/:id/reject', leaksController.rejectAction);
router.post('/revenue-leaks/:id/simulate-payment', leaksController.simulatePayment);

// Agents & Live Telemetry
router.get('/agents', agentsController.getAgents);
router.get('/agents/activity', agentsController.getActivity);

// Safety Engine Policies & Approvals
router.get('/safety/policies', safetyController.getPolicies);
router.put('/safety/policies', safetyController.updatePolicies);
router.get('/safety/pending-approvals', safetyController.getPendingApprovals);

// Immutable Audit Logs
router.get('/audit-logs', auditController.getAuditLogs);

// Razorpay Webhooks
router.post('/webhooks/razorpay', webhookController.handleRazorpayWebhook);

// Demo & Judges' Playground Endpoints
router.post('/demo/subscription-failure', demoController.triggerSubscriptionFailure);
router.post('/demo/checkout-abandonment', demoController.triggerCheckoutAbandonment);
router.post('/demo/payment-degradation', demoController.triggerPaymentDegradation);
router.post('/demo/mandate-expiry', demoController.triggerMandateExpiry);
router.post('/demo/refund-request', demoController.triggerRefundRequest);
router.post('/demo/invoice-overdue', demoController.triggerInvoiceOverdue);
router.post('/demo/promise-to-pay', demoController.triggerPromiseToPay);
router.post('/demo/churn-risk', demoController.triggerChurnRisk);
router.post('/demo/voice-recovery', demoController.triggerVoiceRecovery);
router.post('/demo/multi-agent-conflict', demoController.triggerMultiAgentConflict);
router.post('/demo/reset-database', demoController.resetDatabase);
