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

  const agentMapDisplay: { [key: string]: string } = {
    'ALL': 'All 10 Agents',
    'SUBSCRIPTION_RECOVERY': 'Subscription Recovery',
    'INFRASTRUCTURE_GUARD': 'Infrastructure Guard',
    'CHECKOUT_RECOVERY': 'Checkout Recovery',
    'MANDATE_RENEWAL': 'Mandate Renewal',
    'REFUND_RECOVERY': 'Refund Recovery',
    'RECEIVABLES': 'Receivables Agent',
    'PROMISE_TO_PAY': 'Promise-to-Pay Agent',
    'CHURN_PREVENTION': 'Churn Prevention',
    'VOICE_RECOVERY': 'Voice AI Telephony',
    'PAYMENT_DETECTIVE': 'Payment Detective',
  };

  const agentKeys = Object.keys(agentMapDisplay);

  const filteredActivity = activity.filter((item) => {
    const matchesAgent = selectedAgent === 'ALL' || item.agentType === selectedAgent;
    const isRecovered = item.eventType.includes('RECOVERED') || item.eventType.includes('SUCCESS');
    const isEscalated = item.eventType.includes('BLOCKED') || item.eventType.includes('HELD') || item.eventType.includes('CONFLICT');

    if (selectedStatus === 'RECOVERED') return matchesAgent && isRecovered;
    if (selectedStatus === 'ESCALATED') return matchesAgent && isEscalated;
    if (selectedStatus === 'ACTIVE') return matchesAgent && !isRecovered && !isEscalated;
    return matchesAgent;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      {/* LEFT 3 COLUMNS: FILTERS */}
      <div className="lg:col-span-3 space-y-4">
        <div className="card-base p-5 space-y-5">
          <div className="flex items-center gap-2 pb-3.5 border-b border-[var(--bg-border)] text-[var(--text-primary)] font-syne font-bold text-base">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Feed Filters</span>
          </div>

          {/* Filter: Agent Module */}
          <div className="space-y-2">
            <div className="text-xs font-syne font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Select Agent Module
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {agentKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedAgent(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-sans font-semibold truncate transition-colors flex items-center justify-between ${
                    selectedAgent === key
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <span className="truncate">{agentMapDisplay[key]}</span>
                  {selectedAgent === key && <span className="text-amber-500 font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Status */}
          <div className="space-y-2 pt-3 border-t border-[var(--bg-border)]">
            <div className="text-xs font-syne font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Event Status
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-sans font-semibold">
              {['ALL', 'ACTIVE', 'RECOVERED', 'ESCALATED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-2 rounded-lg text-center transition-colors ${
                    selectedStatus === st
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--bg-border)]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Filter: Time Range */}
          <div className="space-y-2 pt-3 border-t border-[var(--bg-border)]">
            <div className="text-xs font-syne font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Time Horizon
            </div>
            <div className="space-y-1 text-xs font-sans font-medium">
              {[
                { id: 'LAST_HOUR', label: 'Last 1 Hour' },
                { id: 'TODAY', label: 'Today (24h)' },
                { id: 'LAST_7_DAYS', label: 'Last 7 Days' }
              ].map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => setSelectedTimeRange(tr.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedTimeRange === tr.id
                      ? 'text-amber-600 dark:text-amber-400 font-bold bg-[var(--bg-elevated)] border border-[var(--bg-border)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{tr.label}</span>
                  {selectedTimeRange === tr.id && <span className="text-amber-500 font-bold">●</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT 9 COLUMNS: REAL-TIME STREAMING FEED */}
      <div className="lg:col-span-9 space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="font-syne font-bold text-lg text-[var(--text-primary)]">Live Agent Stream</h3>
            <span className="text-xs font-sans text-[var(--text-secondary)] font-semibold">({filteredActivity.length} events logged)</span>
          </div>
          <div className="text-xs font-sans font-medium text-[var(--text-secondary)]">Real-time WebSocket &amp; HMAC Webhooks</div>
        </div>

        <div className="space-y-4">
          {filteredActivity.map((item) => {
            const isRecovered = item.eventType.includes('RECOVERED') || item.eventType.includes('SUCCESS');
            const isEscalated = item.eventType.includes('BLOCKED') || item.eventType.includes('HELD') || item.eventType.includes('CONFLICT');

            // VARIANT A: RECOVERED CARD (GREEN BORDER)
            if (isRecovered) {
              return (
                <div
                  key={item.id}
                  className="card-base card-recovered p-5 space-y-3 cursor-pointer hover:border-emerald-500 transition-all shadow-sm"
                  onClick={() => item.leakId && onSelectCaseById(item.leakId)}
                >
                  <div className="flex items-center justify-between border-b border-[var(--bg-border)] pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="badge-pill badge-recovered text-xs">✅ RECOVERED</span>
                      <span className="text-xs font-syne font-bold text-[var(--text-primary)]">
                        {item.agentType ? (agentMapDisplay[item.agentType] || item.agentType) : 'System Agent'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-syne font-extrabold text-amber-600 dark:text-amber-400 text-base">
                        {formatPaiseToINR(item.amountAtRiskPaise || 249900)}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {new Date(item.timestamp).toLocaleTimeString()} IST
                      </span>
                    </div>
                  </div>

                  <div className="font-sans text-sm text-[var(--text-primary)]">
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item.message}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-xs font-mono text-[var(--text-secondary)] space-y-1.5">
                    <div>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">EVENT ▸ </span>
                      <span className="text-[var(--text-primary)] font-semibold">{item.eventType}</span>
                    </div>
                    <div>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">RESULT ▸ </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Payment captured via Razorpay Smart Link. Revenue secured.</span>
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
                  className="card-base card-at-risk p-5 space-y-3 cursor-pointer hover:border-red-500 transition-all shadow-sm"
                  onClick={() => item.leakId && onSelectCaseById(item.leakId)}
                >
                  <div className="flex items-center justify-between border-b border-[var(--bg-border)] pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="badge-pill badge-escalated text-xs">▲ SAFETY GATE / ESCALATED</span>
                      <span className="text-xs font-syne font-bold text-[var(--text-primary)]">
                        {item.agentType ? (agentMapDisplay[item.agentType] || item.agentType) : 'System Agent'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-syne font-extrabold text-amber-600 dark:text-amber-400 text-base">
                        {formatPaiseToINR(item.amountAtRiskPaise || 2500000)}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {new Date(item.timestamp).toLocaleTimeString()} IST
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-red-500 font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{item.message}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-xs font-mono text-[var(--text-secondary)]">
                    <span className="text-red-500 font-bold">REASONING ▸ </span>
                    <span className="text-[var(--text-primary)] font-medium">
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
                className="card-base card-amber p-5 space-y-3 cursor-pointer hover:border-amber-500 transition-all shadow-sm"
                onClick={() => item.leakId && onSelectCaseById(item.leakId)}
              >
                <div className="flex items-center justify-between border-b border-[var(--bg-border)] pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="badge-pill badge-active text-xs">● ACTIVE ACTION</span>
                    <span className="text-xs font-syne font-bold text-[var(--text-primary)]">
                      {item.agentType ? (agentMapDisplay[item.agentType] || item.agentType) : 'System Agent'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-syne font-extrabold text-amber-600 dark:text-amber-400 text-base">
                      {formatPaiseToINR(item.amountAtRiskPaise || 249900)}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                      {new Date(item.timestamp).toLocaleTimeString()} IST
                    </span>
                  </div>
                </div>

                <div className="text-sm text-[var(--text-primary)] font-semibold">
                  {item.message}
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-xs font-mono text-[var(--text-secondary)] space-y-1.5">
                  <div>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">STAGE ▸ </span>
                    <span className="text-[var(--text-primary)] font-medium">Action Dispatched • Awaiting customer checkout</span>
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
