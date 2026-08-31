import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  Code
} from 'lucide-react';
import { formatPaiseToINR } from '@revenueshield/shared';
import { AuditLogItem } from '../types/index.ts';

interface AuditTrailViewProps {
  auditLogs: AuditLogItem[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLogIds, setExpandedLogIds] = useState<{ [key: string]: boolean }>({});
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('ALL');

  const toggleExpand = (id: string) => {
    setExpandedLogIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.agentType && log.agentType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.leakId && log.leakId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAgent = selectedAgentFilter === 'ALL' || log.agentType === selectedAgentFilter;
    return matchesSearch && matchesAgent;
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,Event Type,Agent,Leak ID,Message,Amount (INR)']
        .concat(
          filteredLogs.map(
            (l) =>
              `"${l.timestamp}","${l.eventType}","${l.agentType || 'SYSTEM'}","${l.leakId || ''}","${l.message.replace(/"/g, '""')}","${(l.amountAtRiskPaise || 0) / 100}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `revenueshield_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="card-base p-6 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--bg-border)]">
        <div>
          <h2 className="font-syne font-bold text-xl text-[var(--text-primary)] flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            <span>Audit Log — Complete Financial Action Record</span>
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
            Append-only. Immutable. Every autonomous agent decision and payment link recorded.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--bg-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-500 w-52 font-sans"
            />
          </div>

          <select
            value={selectedAgentFilter}
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-input)] border border-[var(--bg-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-amber-500 font-sans"
          >
            <option value="ALL">All Agents</option>
            <option value="SUBSCRIPTION_RECOVERY">Subscription Recovery</option>
            <option value="INFRASTRUCTURE_GUARD">Infrastructure Guard</option>
            <option value="CHECKOUT_RECOVERY">Checkout Recovery</option>
            <option value="MANDATE_RENEWAL">Mandate Renewal</option>
            <option value="RECEIVABLES">Receivables</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="btn-ghost text-xs px-3 py-1.5"
            title="Export Immutable Audit Log as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Timeline Entries */}
      <div className="space-y-3 font-mono text-xs">
        {filteredLogs.map((log) => {
          const isExpanded = Boolean(expandedLogIds[log.id]);
          const isSuccess = log.eventType.includes('RECOVERED') || log.eventType.includes('SUCCESS');
          const isSafety = log.eventType.includes('SAFETY') || log.eventType.includes('POLICY');
          const isHeld = log.eventType.includes('HELD') || log.eventType.includes('BLOCKED');

          return (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] hover:border-amber-500 transition-all cursor-pointer"
              onClick={() => toggleExpand(log.id)}
            >
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--text-muted)]">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-amber-500" /> : <ChevronRight className="w-4 h-4" />}
                  </span>

                  <span className="text-[var(--text-secondary)] text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString()} IST
                  </span>

                  <span
                    className={`badge-pill text-[10px] ${
                      isSuccess
                        ? 'badge-recovered'
                        : isHeld
                        ? 'badge-escalated'
                        : isSafety
                        ? 'badge-quarantine'
                        : 'badge-active'
                    }`}
                  >
                    {log.eventType}
                  </span>

                  <span className="text-[var(--text-primary)] font-bold hidden sm:inline truncate max-w-xs font-sans">
                    {log.agentType || 'SYSTEM'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {log.amountAtRiskPaise && (
                    <span className="font-syne font-bold text-amber-600 dark:text-amber-400">
                      {formatPaiseToINR(log.amountAtRiskPaise)}
                    </span>
                  )}
                  {log.leakId && (
                    <span className="text-[var(--text-muted)] text-[10px] hidden md:inline">
                      {log.leakId}
                    </span>
                  )}
                </div>
              </div>

              {/* Message Summary */}
              <div className="mt-2 text-[var(--text-primary)] text-xs font-sans pl-7 font-medium">
                {log.message}
              </div>

              {/* Expanded JSON Inspector */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[var(--bg-border)] pl-7 space-y-2 text-[11px] animate-fadeIn">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] font-bold">
                    <Code className="w-3.5 h-3.5 text-amber-500" />
                    <span>Raw Event Context Payload</span>
                  </div>

                  <pre className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--bg-border)] text-[var(--text-primary)] overflow-x-auto text-[11px]">
                    {JSON.stringify(
                      {
                        auditId: log.id,
                        merchantId: log.merchantId,
                        leakId: log.leakId,
                        agentType: log.agentType,
                        eventType: log.eventType,
                        message: log.message,
                        timestamp: log.timestamp,
                        metadata: log.metadata ? JSON.parse(log.metadata) : null,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
