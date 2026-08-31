import React, { useState } from 'react';
import { Search, CreditCard, ChevronRight } from 'lucide-react';
import { formatPaiseToINR } from '@revenueshield/shared';
import { RevenueLeakCase } from '../types/index.ts';

interface ActiveCasesTableProps {
  cases: RevenueLeakCase[];
  onSelectCase: (leakCase: RevenueLeakCase) => void;
  onQuickSimulatePay: (leakCase: RevenueLeakCase) => void;
}

export const ActiveCasesTable: React.FC<ActiveCasesTableProps> = ({
  cases,
  onSelectCase,
  onQuickSimulatePay,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<'ALL' | 'PRE_PAYMENT' | 'AT_PAYMENT' | 'POST_PAYMENT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTION_EXECUTED' | 'RECOVERED' | 'PENDING_HUMAN_APPROVAL'>('ALL');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.assignedAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === 'ALL' || c.leakStage === stageFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesStage && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECOVERED':
        return <span className="badge-pill badge-recovered">● Recovered</span>;
      case 'ACTION_EXECUTED':
        return <span className="badge-pill badge-active">● Link Sent</span>;
      case 'PENDING_HUMAN_APPROVAL':
        return <span className="badge-pill badge-escalated">▲ Approval Req</span>;
      case 'QUARANTINE':
        return <span className="badge-pill badge-quarantine">⏸ Quarantined</span>;
      default:
        return <span className="badge-pill badge-stopped">{status}</span>;
    }
  };

  return (
    <div className="card-base p-6">
      {/* Table Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[var(--bg-border)]">
        <div>
          <h3 className="font-syne font-bold text-lg text-[var(--text-primary)] flex items-center gap-2">
            <span>Recovery Operations Ledger</span>
            <span className="text-xs font-mono text-[var(--text-secondary)] font-normal">({filteredCases.length} records)</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Real-time multi-agent recovery cases and autonomous resolution pipeline
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search customer, agent, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--bg-border)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-amber-500 w-52 font-sans"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--bg-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-500 font-sans"
          >
            <option value="ALL">All Stages</option>
            <option value="PRE_PAYMENT">Pre-Payment</option>
            <option value="AT_PAYMENT">At-Payment</option>
            <option value="POST_PAYMENT">Post-Payment</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--bg-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-500 font-sans"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTION_EXECUTED">Active Links</option>
            <option value="RECOVERED">Recovered</option>
            <option value="PENDING_HUMAN_APPROVAL">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-xs">
          <thead>
            <tr className="border-b border-[var(--bg-border)] text-[var(--text-muted)] font-mono uppercase text-[10px] tracking-wider">
              <th className="pb-3 px-3 font-bold">Customer</th>
              <th className="pb-3 px-3 font-bold">Agent Module</th>
              <th className="pb-3 px-3 font-bold">Amount</th>
              <th className="pb-3 px-3 font-bold">Root Cause Diagnosis</th>
              <th className="pb-3 px-3 font-bold">Step</th>
              <th className="pb-3 px-3 font-bold">Status</th>
              <th className="pb-3 px-3 font-bold">Detected</th>
              <th className="pb-3 px-3 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--bg-border)]">
            {filteredCases.map((c) => {
              const isRecovered = c.status === 'RECOVERED';

              return (
                <tr
                  key={c.id}
                  className="hover:bg-[var(--bg-elevated)] transition-colors group cursor-pointer"
                  onClick={() => onSelectCase(c)}
                >
                  {/* Customer */}
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {c.customer?.name || 'Customer'}
                    </div>
                    <div className="text-[10px] text-[var(--text-secondary)] font-mono truncate max-w-[140px]">
                      {c.customer?.email}
                    </div>
                  </td>

                  {/* Agent */}
                  <td className="py-3.5 px-3">
                    <span className="badge-pill bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--bg-border)]">
                      {c.assignedAgent}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-3">
                    <div className="font-syne font-bold text-amber-600 dark:text-amber-400 text-sm">
                      {formatPaiseToINR(c.amountAtRiskPaise)}
                    </div>
                    {isRecovered && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">100% Recv</div>
                    )}
                  </td>

                  {/* Root Cause */}
                  <td className="py-3.5 px-3 max-w-[200px]">
                    <div className="truncate text-[var(--text-primary)] font-medium">
                      {c.rootCauseDiagnosis || 'Automated Recovery Action'}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">
                      Conf: {Math.round((c.aiConfidenceScore || 0.9) * 100)}%
                    </div>
                  </td>

                  {/* Step */}
                  <td className="py-3.5 px-3 font-mono text-[var(--text-secondary)]">
                    <span>1/3</span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    {getStatusBadge(c.status)}
                  </td>

                  {/* Detected Time */}
                  <td className="py-3.5 px-3 font-mono text-[var(--text-secondary)] text-[11px]">
                    {new Date(c.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {!isRecovered && c.status !== 'STOPPED' && (
                        <button
                          onClick={() => onQuickSimulatePay(c)}
                          className="btn-primary text-[11px] font-mono px-2.5 py-1"
                          title="Open Razorpay Hosted Checkout Preview"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Test Pay</span>
                        </button>
                      )}
                      <button
                        onClick={() => onSelectCase(c)}
                        className="btn-ghost p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        title="View Full Case Audit Pipeline"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
