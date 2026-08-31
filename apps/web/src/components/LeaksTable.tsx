import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { RevenueLeakItem } from '../types/index.js';

interface LeaksTableProps {
  leaks: RevenueLeakItem[];
  onSelectLeak: (leakId: string) => void;
  onSimulatePayment: (leakId: string) => void;
  onOpenCheckoutModal: (leak: RevenueLeakItem) => void;
}

export const LeaksTable: React.FC<LeaksTableProps> = ({
  leaks,
  onSelectLeak,
  onSimulatePayment,
  onOpenCheckoutModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');

  const filteredLeaks = leaks.filter(leak => {
    const matchesSearch = 
      !searchTerm ||
      leak.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leak.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leak.customer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leak.assignedAgent.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || leak.status === statusFilter;
    const matchesStage = stageFilter === 'ALL' || leak.leakStage === stageFilter;

    return matchesSearch && matchesStatus && matchesStage;
  });

  const getStatusBadge = (status: string, requiresReview: boolean) => {
    if (status === 'RECOVERED') {
      return <span className="badge badge-recovered">Recovered</span>;
    }
    if (requiresReview || status === 'PENDING_HUMAN_APPROVAL') {
      return <span className="badge badge-pending">Human Review Needed</span>;
    }
    if (status === 'ACTION_EXECUTED') {
      return <span className="badge badge-executed">Action Dispatched</span>;
    }
    if (status === 'STOPPED') {
      return <span className="badge badge-stopped">Suppressed / Stopped</span>;
    }
    return <span className="badge badge-analyzing">Diagnosing</span>;
  };

  return (
    <div className="card space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading font-bold text-lg text-slate-100">
            Revenue Leaks & Recovery Cases
          </h3>
          <p className="text-xs text-slate-400">
            Autonomous diagnosis, deterministic safety verification, and recovery execution
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Search Input */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 focus-within:border-blue-500 transition-colors">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search customer, case ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-slate-200 outline-none w-44 placeholder:text-slate-600"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            aria-label="Filter by Stage"
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Stages</option>
            <option value="PRE_PAYMENT">Pre-Payment</option>
            <option value="AT_PAYMENT">At-Payment</option>
            <option value="POST_PAYMENT">Post-Payment</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="RECOVERED">Recovered</option>
            <option value="ACTION_EXECUTED">Action Dispatched</option>
            <option value="PENDING_HUMAN_APPROVAL">Human Review</option>
            <option value="STOPPED">Stopped</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Case ID / Customer</th>
              <th className="py-3 px-4">Leak Vector & Stage</th>
              <th className="py-3 px-4 text-right">Amount at Risk</th>
              <th className="py-3 px-4">Assigned Agent</th>
              <th className="py-3 px-4">AI Diagnosis & Strategy</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filteredLeaks.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No recovery cases match your filters.
                </td>
              </tr>
            ) : (
              filteredLeaks.map((leak) => {
                const isRecovered = leak.status === 'RECOVERED';
                const hasActiveLink = leak.latestAction?.razorpayResourceId;

                return (
                  <tr 
                    key={leak.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectLeak(leak.id)}
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">
                        {leak.customer?.name || 'System Alert'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                        <span>{leak.customer?.email || leak.id}</span>
                        {leak.customer?.ltvFormatted && (
                          <span className="text-[10px] text-slate-400">
                            • LTV: {leak.customer.ltvFormatted}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Leak Type & Stage */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-300">
                        {leak.leakType.replace(/_/g, ' ')}
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                        {leak.leakStage.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="font-bold text-slate-200">
                        {leak.amountAtRiskFormatted}
                      </div>
                      {isRecovered && (
                        <div className="text-[10px] text-emerald-400 font-bold">
                          Recovered: {leak.amountRecoveredFormatted}
                        </div>
                      )}
                    </td>

                    {/* Agent */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono font-medium text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded">
                        {leak.assignedAgent.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Diagnosis & Strategy */}
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <p className="text-slate-300 line-clamp-1">
                        {leak.rootCauseDiagnosis || 'Automated AI analysis...'}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {leak.recoveryStrategy || 'Formulating strategy'}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(leak.status, Boolean(leak.requiresHumanReview))}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* If link generated, let judge test payment */}
                        {!isRecovered && hasActiveLink && (
                          <button
                            onClick={() => onOpenCheckoutModal(leak)}
                            className="btn btn-primary btn-sm py-1 px-2 text-[11px] flex items-center gap-1"
                            title="Open interactive Razorpay hosted checkout preview"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Test Pay</span>
                          </button>
                        )}

                        {/* Quick 1-click simulate recovery */}
                        {!isRecovered && leak.status !== 'STOPPED' && (
                          <button
                            onClick={() => onSimulatePayment(leak.id)}
                            className="btn btn-success btn-sm py-1 px-2 text-[11px] flex items-center gap-1"
                            title="Simulate successful payment completion webhook"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Recover</span>
                          </button>
                        )}

                        <button
                          onClick={() => onSelectLeak(leak.id)}
                          className="btn btn-secondary btn-sm py-1 px-2 text-[11px] text-slate-400 hover:text-white"
                          title="View complete case pipeline & audit trail"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
