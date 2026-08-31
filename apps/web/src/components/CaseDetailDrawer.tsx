import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Ban,
  ExternalLink,
  User,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import { formatPaiseToINR } from '@revenueshield/shared';
import { RevenueLeakCase } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface CaseDetailDrawerProps {
  leakId: string | null;
  onClose: () => void;
  onCaseUpdated: () => void;
  onOpenCheckoutModal: (leak: RevenueLeakCase) => void;
}

export const CaseDetailDrawer: React.FC<CaseDetailDrawerProps> = ({
  leakId,
  onClose,
  onCaseUpdated,
  onOpenCheckoutModal,
}) => {
  const [leakData, setLeakData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [overrideDiscount, setOverrideDiscount] = useState<number>(10);

  useEffect(() => {
    if (leakId) {
      setLoading(true);
      api.getLeakById(leakId)
        .then((res) => setLeakData(res.leak))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [leakId]);

  if (!leakId) return null;

  const handleApprove = async () => {
    try {
      setApproving(true);
      await api.approveAction(leakId, overrideDiscount);
      const res = await api.getLeakById(leakId);
      setLeakData(res.leak);
      onCaseUpdated();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setApproving(true);
      await api.rejectAction(leakId, 'Rejected by Merchant Admin');
      const res = await api.getLeakById(leakId);
      setLeakData(res.leak);
      onCaseUpdated();
    } catch (err: any) {
      alert(`Rejection failed: ${err.message}`);
    } finally {
      setApproving(false);
    }
  };

  const latestSession = leakData?.recoverySessions?.[0];
  const latestAction = latestSession?.actions?.[0];
  const safetyCheck = latestSession?.safetyChecks?.[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-[var(--bg-surface)] border-l border-[var(--bg-border)] h-full overflow-y-auto p-6 space-y-6 shadow-2xl font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--bg-border)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-pill badge-quarantine">
                {leakData?.assignedAgent || 'Recovery Agent'}
              </span>
              <span className="badge-pill bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--bg-border)]">
                {leakData?.status}
              </span>
            </div>
            <h2 className="font-syne font-bold text-xl text-[var(--text-primary)] mt-1">
              Case {leakData?.id}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[var(--text-muted)] font-mono animate-pulse">
            Loading case pipeline &amp; audit data...
          </div>
        ) : leakData ? (
          <div className="space-y-5">
            {/* Step 1: Universal 5-Step Pipeline Tracker */}
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-3">
                Universal Recovery Pipeline
              </span>
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">1</div>
                  <span className="text-[10px]">Detected</span>
                </div>
                <div className="flex-1 h-0.5 bg-emerald-500 mx-1" />
                <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">2</div>
                  <span className="text-[10px]">Diagnosed</span>
                </div>
                <div className="flex-1 h-0.5 bg-emerald-500 mx-1" />
                <div className={`flex flex-col items-center gap-1 ${safetyCheck?.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  <div className={`w-7 h-7 rounded-full ${safetyCheck?.passed ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'} flex items-center justify-center font-bold shadow-sm`}>3</div>
                  <span className="text-[10px]">Safety Gate</span>
                </div>
                <div className="flex-1 h-0.5 bg-[var(--bg-border)] mx-1" />
                <div className={`flex flex-col items-center gap-1 ${latestAction?.status === 'EXECUTED' || leakData.status === 'RECOVERED' ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--text-muted)]'}`}>
                  <div className="w-7 h-7 rounded-full bg-[var(--bg-surface)] border border-[var(--bg-border)] text-[var(--text-primary)] flex items-center justify-center font-bold">4</div>
                  <span className="text-[10px]">Action Link</span>
                </div>
                <div className="flex-1 h-0.5 bg-[var(--bg-border)] mx-1" />
                <div className={`flex flex-col items-center gap-1 ${leakData.status === 'RECOVERED' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[var(--text-muted)]'}`}>
                  <div className={`w-7 h-7 rounded-full ${leakData.status === 'RECOVERED' ? 'bg-emerald-500 text-white' : 'bg-[var(--bg-surface)] border border-[var(--bg-border)] text-[var(--text-primary)]'} flex items-center justify-center font-bold`}>5</div>
                  <span className="text-[10px]">Recovered</span>
                </div>
              </div>
            </div>

            {/* Human Review Banner (if required) */}
            {leakData.requiresHumanReview && (
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border-2 border-amber-500 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-syne font-bold text-sm text-amber-600 dark:text-amber-400">
                      Human Review Required by Merchant Safety Policy
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Action exceeds autonomous limits (Amount: {formatPaiseToINR(leakData.amountAtRiskPaise)}). Review AI proposal and approve or override.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[var(--bg-border)]">
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-[var(--text-secondary)]">Discount %:</span>
                    <input
                      type="number"
                      value={overrideDiscount}
                      onChange={(e) => setOverrideDiscount(Number(e.target.value))}
                      className="bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded px-2 py-1 w-14 text-center text-amber-600 dark:text-amber-400 font-bold"
                      min={0}
                      max={25}
                    />
                  </div>
                  <button
                    onClick={handleReject}
                    disabled={approving}
                    className="btn-danger text-xs px-3.5 py-1.5 ml-auto"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={approving}
                    className="btn-success text-xs px-4 py-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve &amp; Dispatch</span>
                  </button>
                </div>
              </div>
            )}

            {/* Customer Profile */}
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-syne font-bold text-sm text-[var(--text-primary)]">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>Customer Profile</span>
                </div>
                {leakData.customer?.isOptedOut && (
                  <span className="badge-pill badge-stopped text-[10px]">Opted Out (DND)</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[var(--text-muted)] font-mono text-[10px] block font-bold">Name</span>
                  <span className="font-semibold text-[var(--text-primary)]">{leakData.customer?.name}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] font-mono text-[10px] block font-bold">Email</span>
                  <span className="font-mono text-[var(--text-secondary)]">{leakData.customer?.email}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] font-mono text-[10px] block font-bold">Phone</span>
                  <span className="font-mono text-[var(--text-secondary)]">{leakData.customer?.phone}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] font-mono text-[10px] block font-bold">Customer LTV</span>
                  <span className="font-syne font-bold text-amber-600 dark:text-amber-400">{formatPaiseToINR(leakData.customer?.ltvPaise || 0)}</span>
                </div>
              </div>
            </div>

            {/* AI Diagnosis & Strategy */}
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-syne font-bold text-sm text-[var(--text-primary)]">AI Diagnosis &amp; Reasoning</span>
                <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
                  {Math.round((leakData.aiConfidenceScore || 0.9) * 100)}% Conf
                </span>
              </div>
              <p className="text-xs text-[var(--text-primary)] font-mono">
                {leakData.rootCauseDiagnosis}
              </p>
              <div className="p-2.5 rounded bg-[var(--bg-surface)] border border-[var(--bg-border)] text-[11px] font-mono text-[var(--text-secondary)] italic">
                "{leakData.recoveryStrategy}"
              </div>
            </div>

            {/* Razorpay Dispatched Resource */}
            {latestAction && (
              <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-syne font-bold text-sm text-amber-600 dark:text-amber-400">
                    <CreditCard className="w-4 h-4" />
                    <span>Dispatched Razorpay Resource</span>
                  </div>
                  <span className="badge-pill badge-active text-[10px]">
                    {latestAction.actionType}
                  </span>
                </div>

                <div className="text-xs font-mono space-y-1.5 text-[var(--text-primary)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Resource ID:</span>
                    <span className="font-bold">{latestAction.razorpayResourceId || 'Generated'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Payable Amount:</span>
                    <span className="font-syne font-bold text-amber-600 dark:text-amber-400">
                      {formatPaiseToINR(latestAction.amountPaise - latestAction.discountPaise)}
                    </span>
                  </div>
                </div>

                {leakData.status !== 'RECOVERED' && (
                  <button
                    onClick={() => onOpenCheckoutModal(leakData)}
                    className="btn-primary w-full text-xs py-2 mt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Live Hosted Checkout Sandbox</span>
                  </button>
                )}
              </div>
            )}

            {/* Omnichannel Outreach Live WhatsApp Preview */}
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="font-syne font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>WhatsApp Outreach Live Preview</span>
                </span>
                <span className="badge-pill badge-recovered text-[9px]">Verified TRAI 140</span>
              </div>

              {/* Simulated WhatsApp Phone Frame */}
              <div className="rounded-xl bg-[#0B141A] border border-emerald-900/60 overflow-hidden shadow-inner font-sans">
                {/* WhatsApp Chat Top Bar */}
                <div className="bg-[#1F2C34] px-3.5 py-2.5 flex items-center justify-between border-b border-emerald-900/40">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                      RS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">Acme SaaS Support</div>
                      <div className="text-[9px] text-emerald-400 font-mono">Official Business Account • Verified</div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Message Bubble */}
                <div className="p-3.5 space-y-2 text-xs text-slate-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 to-[#0B141A]">
                  <div className="p-3 rounded-lg bg-[#005C4B] border border-emerald-500/30 text-white space-y-2 shadow-sm">
                    <p className="leading-relaxed">
                      Hi <strong>{leakData.customer?.name || 'Customer'}</strong>! 👋
                    </p>
                    <p className="leading-relaxed text-[11px]">
                      We noticed your recurring subscription payment for <strong>Acme SaaS</strong> was interrupted due to a temporary bank timeout.
                    </p>
                    <div className="p-2 rounded bg-[#004B3D] border border-emerald-400/20 text-[11px] font-mono">
                      💳 Amount Due: <strong>{formatPaiseToINR(leakData.amountAtRiskPaise || 249900)}</strong>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Click below to instantly complete your payment via Razorpay 1-Click checkout link:
                    </p>

                    {/* Interactive Button inside WhatsApp */}
                    <button
                      onClick={() => onOpenCheckoutModal(leakData)}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Pay {formatPaiseToINR(leakData.amountAtRiskPaise || 249900)} via Razorpay</span>
                    </button>

                    <div className="text-[9px] text-emerald-200/70 text-right font-mono pt-1">
                      Sent 1m ago • Delivered ✓✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
