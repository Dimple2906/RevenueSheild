import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowDown, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FunnelStageData } from '../types/index.ts';

interface LifecycleBreakdownPanelProps {
  funnelData: FunnelStageData[];
}

export const LifecycleBreakdownPanel: React.FC<LifecycleBreakdownPanelProps> = ({ funnelData }) => {
  const [expandedStages, setExpandedStages] = useState<{ [key: string]: boolean }>({
    pre: true,
    at: true,
    post: true,
  });

  const toggleStage = (stage: string) => {
    setExpandedStages((prev) => ({ ...prev, [stage]: !prev[stage] }));
  };

  return (
    <div className="card-base p-6">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--bg-border)]">
        <div>
          <h3 className="font-syne font-bold text-lg text-[var(--text-primary)] flex items-center gap-2">
            <span>Revenue Lifecycle Breakdown</span>
            <span className="text-amber-500 text-xs font-mono">◈ 3 STAGES</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
            Real-time leakage tracking and autonomous recovery pipeline efficiency
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT 7 COLUMNS: STAGE BREAKDOWN */}
        <div className="lg:col-span-7 space-y-4">
          {/* PRE-PAYMENT STAGE */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)]">
            <div
              onClick={() => toggleStage('pre')}
              className="flex items-center justify-between cursor-pointer group select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-syne font-bold text-sm text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  Pre-Payment Stage
                </span>
                <span className="badge-pill badge-active text-[10px] font-mono">
                  ₹1,29,800 At Risk
                </span>
              </div>
              <button className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {expandedStages.pre ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {expandedStages.pre && (
              <div className="mt-3.5 pt-3 border-t border-[var(--bg-border)] space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">├──</span>
                    <span>Checkout Abandonment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 progress-bar-track">
                      <div className="progress-bar-fill bg-amber-500" style={{ width: '57%' }} />
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-bold w-24 text-right">₹51.2K / ₹89.4K</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">├──</span>
                    <span>Pre-Churn Risk</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 progress-bar-track">
                      <div className="progress-bar-fill bg-pink-500" style={{ width: '63%' }} />
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-bold w-24 text-right">₹78.6K / ₹124K</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">└──</span>
                    <span>Infra Guard Health</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Healthy
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* AT-PAYMENT STAGE */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)]">
            <div
              onClick={() => toggleStage('at')}
              className="flex items-center justify-between cursor-pointer group select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="font-syne font-bold text-sm text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  At-Payment Stage
                </span>
                <span className="badge-pill badge-quarantine text-[10px] font-mono">
                  ₹63,200 At Risk
                </span>
              </div>
              <button className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {expandedStages.at ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {expandedStages.at && (
              <div className="mt-3.5 pt-3 border-t border-[var(--bg-border)] space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">├──</span>
                    <span>Subscriptions Recovery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 progress-bar-track">
                      <div className="progress-bar-fill bg-purple-500" style={{ width: '78%' }} />
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-bold w-24 text-right">₹48.8K / ₹62.4K</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">├──</span>
                    <span>E-Mandates Renewal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 progress-bar-track">
                      <div className="progress-bar-fill bg-blue-500" style={{ width: '79%' }} />
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-bold w-24 text-right">₹14.4K / ₹18.2K</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">└──</span>
                    <span>Payment Error Clusters</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3 h-3" /> No Active Outages
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* POST-PAYMENT STAGE */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)]">
            <div
              onClick={() => toggleStage('post')}
              className="flex items-center justify-between cursor-pointer group select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-syne font-bold text-sm text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  Post-Payment Stage
                </span>
                <span className="badge-pill badge-recovered text-[10px] font-mono">
                  ₹47,400 At Risk
                </span>
              </div>
              <button className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {expandedStages.post ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {expandedStages.post && (
              <div className="mt-3.5 pt-3 border-t border-[var(--bg-border)] space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">├──</span>
                    <span>Receivables (Invoices)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 progress-bar-track">
                      <div className="progress-bar-fill bg-emerald-500" style={{ width: '58%' }} />
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-bold w-24 text-right">₹28.2K / ₹48.6K</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">├──</span>
                    <span>Promise to Pay</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 progress-bar-track">
                      <div className="progress-bar-fill bg-teal-500" style={{ width: '66%' }} />
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-bold w-24 text-right">₹14.8K / ₹22.4K</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[var(--text-primary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">└──</span>
                    <span>Refund Arbitrage</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹19,200 saved in GMV</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 5 COLUMNS: MINI FUNNEL CHART */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-syne font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Recovery Funnel Pipeline
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">70.1% SUCCESS</span>
          </div>

          {/* Funnel Steps */}
          <div className="space-y-3 font-mono text-xs my-auto py-2">
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--bg-border)] flex items-center justify-between">
              <span className="text-[var(--text-primary)] font-semibold">127 Failed Events Detected</span>
              <span className="text-red-500 font-bold">100%</span>
            </div>

            <div className="flex justify-center -my-1 text-[var(--text-muted)]">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--bg-border)] flex items-center justify-between">
              <span className="text-[var(--text-primary)] font-semibold">89 In Active Recovery</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">70%</span>
            </div>

            <div className="flex justify-center -my-1 text-[var(--text-muted)]">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 67 Auto-Recovered
              </span>
              <span className="font-bold">₹2,41,800</span>
            </div>

            <div className="flex justify-center -my-1 text-[var(--text-muted)]">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--bg-border)] text-[var(--text-secondary)]">
                <div>24 Escalated</div>
                <div className="text-amber-600 dark:text-amber-400 font-bold">Human Queue</div>
              </div>
              <div className="p-2 rounded bg-[var(--bg-surface)] border border-[var(--bg-border)] text-[var(--text-secondary)]">
                <div>14 Stopped</div>
                <div className="text-[var(--text-muted)] font-bold">Opted Out</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
