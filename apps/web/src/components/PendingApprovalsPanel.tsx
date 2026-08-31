import React, { useState } from 'react';
import { ShieldAlert, Check, X, Sliders, User, AlertCircle } from 'lucide-react';
import { formatPaiseToINR } from '@revenueshield/shared';
import { RevenueLeakCase } from '../types/index.ts';

interface PendingApprovalsPanelProps {
  pendingCases: RevenueLeakCase[];
  onApprove: (leakId: string, overrideDiscount?: number) => Promise<void>;
  onReject: (leakId: string) => Promise<void>;
}

export const PendingApprovalsPanel: React.FC<PendingApprovalsPanelProps> = ({
  pendingCases,
  onApprove,
  onReject,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [overrideDiscount, setOverrideDiscount] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (!pendingCases || pendingCases.length === 0) {
    return null;
  }

  const handleApproveAction = async (leakId: string) => {
    setIsProcessing(leakId);
    try {
      await onApprove(leakId, selectedCaseId === leakId ? overrideDiscount : undefined);
    } finally {
      setIsProcessing(null);
      setSelectedCaseId(null);
    }
  };

  const handleRejectAction = async (leakId: string) => {
    setIsProcessing(leakId);
    try {
      await onReject(leakId);
    } finally {
      setIsProcessing(null);
      setSelectedCaseId(null);
    }
  };

  return (
    <div className="card-base border-amber-500 p-6 space-y-4 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-syne font-bold text-base text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <span>⚠ PENDING YOUR APPROVAL</span>
              <span className="badge-pill badge-active text-xs font-mono">
                {pendingCases.length}
              </span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Autonomous cap threshold exceeded. Review AI reasoning and authorize recovery link dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {pendingCases.map((c) => {
          const isSelected = selectedCaseId === c.id;
          const isCurrentProcessing = isProcessing === c.id;

          return (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] space-y-3 transition-all"
            >
              {/* Card Meta Top */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--bg-border)] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="badge-pill badge-quarantine">
                    {c.assignedAgent}
                  </span>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    {new Date(c.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-[var(--text-secondary)]">Amount at Risk:</span>
                  <span className="font-syne font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {formatPaiseToINR(c.amountAtRiskPaise)}
                  </span>
                </div>
              </div>

              {/* Customer & Root Cause */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-[var(--text-muted)] font-mono text-[10px] uppercase font-bold">Customer</div>
                  <div className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>{c.customer?.name || 'Enterprise Customer'}</span>
                    <span className="text-[var(--text-secondary)]">({c.customer?.email})</span>
                  </div>
                </div>

                <div>
                  <div className="text-[var(--text-muted)] font-mono text-[10px] uppercase font-bold">Root Cause Diagnosis</div>
                  <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>{c.rootCauseDiagnosis || 'High-value invoice overdue'}</span>
                  </div>
                </div>
              </div>

              {/* AI Reasoning Quote */}
              <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--bg-border)] text-xs font-mono text-[var(--text-primary)]">
                <span className="text-purple-600 dark:text-purple-400 font-bold">Agent Reasoning: </span>
                <span className="text-[var(--text-secondary)] italic">
                  "{c.recoveryStrategy || 'High-value customer transaction. Exceeds standard autonomous limit of ₹5,000. Authorize custom recovery discount and dispatch.'}"
                </span>
              </div>

              {/* Modify Discount Drawer (if expanded) */}
              {isSelected && (
                <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-amber-500/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[var(--text-primary)] font-semibold">Override Incentive Discount:</span>
                    <span className="font-syne font-bold text-amber-600 dark:text-amber-400">{overrideDiscount}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={overrideDiscount}
                    onChange={(e) => setOverrideDiscount(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span>0% (No discount)</span>
                    <span>15% (Policy Max)</span>
                    <span>25% (Admin Special)</span>
                  </div>
                </div>
              )}

              {/* Action Buttons - Solid non-glowing buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => handleRejectAction(c.id)}
                  disabled={isCurrentProcessing}
                  className="btn-danger text-xs px-3.5 py-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => setSelectedCaseId(isSelected ? null : c.id)}
                  className="btn-ghost text-xs px-3.5 py-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Close' : 'Modify Discount'}</span>
                </button>

                <button
                  onClick={() => handleApproveAction(c.id)}
                  disabled={isCurrentProcessing}
                  className="btn-success text-xs px-4 py-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCurrentProcessing ? 'Authorizing...' : 'Approve & Dispatch'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
