import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Filter
} from 'lucide-react';
import { formatPaiseToINR } from '@revenueshield/shared';
import { AgentActivityItem } from '../types/index.ts';

interface LiveAgentActivityFeedProps {
  activity: AgentActivityItem[];
  onSelectCaseById: (caseId: string) => void;
}

export const LiveAgentActivityFeed: React.FC<LiveAgentActivityFeedProps> = ({
  activity,
  onSelectCaseById,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('TODAY');

  const agentList = [
    'ALL',
    'SUBSCRIPTION_RECOVERY',
    'INFRASTRUCTURE_GUARD',
    'CHECKOUT_RECOVERY',
    'MANDATE_RENEWAL',
    'REFUND_RECOVERY',
    'RECEIVABLES',
    'PROMISE_TO_PAY',
    'CHURN_PREVENTION',
    'VOICE_RECOVERY',
    'PAYMENT_DETECTIVE',
  ];

  const filteredActivity = activity.filter((item) => {
    const matchesAgent = selectedAgent === 'ALL' || item.agentType === selectedAgent;
    const isRecovered = item.eventType.includes('RECOVERED') || item.eventType.includes('SUCCESS');
    const isEscalated = item.eventType.includes('BLOCKED') || item.eventType.includes('HELD');

    if (selectedStatus === 'RECOVERED') return matchesAgent && isRecovered;
    if (selectedStatus === 'ESCALATED') return matchesAgent && isEscalated;
    if (selectedStatus === 'ACTIVE') return matchesAgent && !isRecovered && !isEscalated;
    return matchesAgent;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT 3 COLUMNS: FILTERS */}
      <div className="lg:col-span-3 space-y-4 font-sans">
        <div className="card-base p-4 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--bg-border)] text-[var(--text-primary)] font-syne font-bold text-sm">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Feed Filters</span>
          </div>

          {/* Filter: Agent Module */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Agent Module</div>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {agentList.map((ag) => (
                <button
                  key={ag}
                  onClick={() => setSelectedAgent(ag)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono truncate transition-colors flex items-center justify-between ${
                    selectedAgent === ag
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/40'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <span className="truncate">{ag === 'ALL' ? 'All Agents' : ag}</span>
                  {selectedAgent === ag && <span className="text-amber-500">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Status */}
          <div className="space-y-1.5 pt-2 border-t border-[var(--bg-border)]">
            <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Event Status</div>
            <div className="grid grid-cols-2 gap-1 text-xs font-mono">
              {['ALL', 'ACTIVE', 'RECOVERED', 'ESCALATED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2 py-1.5 rounded-lg text-center transition-colors ${
                    selectedStatus === st
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Time Range */}
          <div className="space-y-1.5 pt-2 border-t border-[var(--bg-border)]">
            <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Time Horizon</div>
            <div className="space-y-1 text-xs font-mono">
              {['LAST_HOUR', 'TODAY', 'LAST_7_DAYS'].map((tr) => (
                <button
                  key={tr}
                  onClick={() => setSelectedTimeRange(tr)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedTimeRange === tr
                      ? 'text-amber-600 dark:text-amber-400 font-bold bg-[var(--bg-elevated)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{tr.replace(/_/g, ' ')}</span>
                  {selectedTimeRange === tr && <span className="text-amber-500">●</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT 9 COLUMNS: REAL-TIME STREAMING FEED */}
      <div className="lg:col-span-9 space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="font-syne font-bold text-base text-[var(--text-primary)]">Live Agent Stream</h3>
            <span className="text-xs font-mono text-[var(--text-secondary)]">({filteredActivity.length} events logged)</span>
          </div>
          <div className="text-xs font-mono text-[var(--text-muted)]">Real-time WebSocket &amp; HMAC Webhooks</div>
        </div>

        <div className="space-y-3.5">
          {filteredActivity.map((item) => {
            const isRecovered = item.eventType.includes('RECOVERED') || item.eventType.includes('SUCCESS');
            const isEscalated = item.eventType.includes('BLOCKED') || item.eventType.includes('HELD') || item.eventType.includes('CONFLICT');

            // VARIANT A: RECOVERED CARD (GREEN BORDER)
            if (isRecovered) {
              return (
                <div
                  key={item.id}
                  className="card-base card-recovered p-4 space-y-2.5 cursor-pointer hover:border-emerald-500 transition-all"
                  onClick={() => item.leakId && onSelectCaseById(item.leakId)}
                >
                  <div className="flex items-center justify-between border-b border-[var(--bg-border)] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="badge-pill badge-recovered">✅ RECOVERED</span>
                      <span className="text-xs font-mono text-[var(--text-secondary)] font-semibold">{item.agentType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-syne font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {formatPaiseToINR(item.amountAtRiskPaise || 249900)}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {new Date(item.timestamp).toLocaleTimeString()} IST
                      </span>
                    </div>
                  </div>

                  <div className="font-sans text-xs text-[var(--text-primary)]">
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{item.message}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[11px] font-mono text-[var(--text-secondary)] space-y-1">
                    <div>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">EVENT ▸ </span>
                      <span className="text-[var(--text-primary)]">{item.eventType}</span>
                    </div>
                    <div>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">RESULT ▸ </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Payment received via Razorpay Smart Link. Revenue saved.</span>
                    </div>
                  </div>
                </div>
              );
            }

            // VARIANT C: ESCALATED / HELD (RED BORDER)
            if (isEscalated) {
              return (
                <div
                  key={item.id}
                  className="card-base card-at-risk p-4 space-y-2.5 cursor-pointer hover:border-red-500 transition-all"
                  onClick={() => item.leakId && onSelectCaseById(item.leakId)}
                >
                  <div className="flex items-center justify-between border-b border-[var(--bg-border)] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="badge-pill badge-escalated">▲ SAFETY GATE / ESCALATED</span>
                      <span className="text-xs font-mono text-[var(--text-secondary)] font-semibold">{item.agentType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-syne font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {formatPaiseToINR(item.amountAtRiskPaise || 2500000)}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {new Date(item.timestamp).toLocaleTimeString()} IST
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-red-500 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{item.message}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[11px] font-mono text-[var(--text-secondary)]">
                    <span className="text-red-500 font-bold">REASONING ▸ </span>
                    <span className="text-[var(--text-primary)]">
                      Deterministic Safety Engine policy triggered. Action held in merchant approval queue.
                    </span>
                  </div>
                </div>
              );
            }

            // VARIANT B: ACTIVE / ACTION EXECUTED (AMBER BORDER)
            return (
              <div
                key={item.id}
                className="card-base card-amber p-4 space-y-2.5 cursor-pointer hover:border-amber-500 transition-all"
                onClick={() => item.leakId && onSelectCaseById(item.leakId)}
              >
                <div className="flex items-center justify-between border-b border-[var(--bg-border)] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="badge-pill badge-active">● ACTIVE ACTION</span>
                    <span className="text-xs font-mono text-[var(--text-secondary)] font-semibold">{item.agentType}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-syne font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {formatPaiseToINR(item.amountAtRiskPaise || 249900)}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {new Date(item.timestamp).toLocaleTimeString()} IST
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-primary)] font-medium">
                  {item.message}
                </div>

                <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[11px] font-mono text-[var(--text-secondary)] space-y-1">
                  <div>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">STAGE ▸ </span>
                    <span className="text-[var(--text-primary)]">Action Dispatched • Awaiting customer checkout</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
