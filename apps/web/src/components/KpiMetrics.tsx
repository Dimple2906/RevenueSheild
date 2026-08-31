import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu,
  ArrowUpRight
} from 'lucide-react';
import { KpiMetricsData } from '../types/index.js';

interface KpiMetricsProps {
  metrics?: KpiMetricsData;
  loading?: boolean;
}

export const KpiMetrics: React.FC<KpiMetricsProps> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card animate-pulse h-28 bg-slate-900/40 border-slate-800"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Revenue Recovered */}
      <div className="card card-hover relative overflow-hidden border-emerald-500/30 bg-gradient-to-br from-slate-900/90 to-emerald-950/20">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Revenue Recovered</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-heading font-extrabold text-2xl text-emerald-400 font-mono tracking-tight">
            {metrics.revenueRecoveredFormatted}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{metrics.recoveredLeaksCount} cases auto-healed</span>
          </div>
        </div>
      </div>

      {/* 2. Revenue at Risk */}
      <div className="card card-hover relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-slate-900/90 to-amber-950/20">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Revenue at Risk</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-heading font-extrabold text-2xl text-amber-400 font-mono tracking-tight">
            {metrics.revenueAtRiskFormatted}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>{metrics.activeLeaksCount} active recovery cases</span>
          </div>
        </div>
      </div>

      {/* 3. Revenue Protected */}
      <div className="card card-hover relative overflow-hidden border-blue-500/30 bg-gradient-to-br from-slate-900/90 to-blue-950/20">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Revenue Protected</span>
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-heading font-extrabold text-2xl text-blue-400 font-mono tracking-tight">
            {metrics.revenueProtectedFormatted}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-300">
            <span>Refunds converted to store credit</span>
          </div>
        </div>
      </div>

      {/* 4. Overall Recovery Rate */}
      <div className="card card-hover relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-slate-900/90 to-purple-950/20">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Recovery Rate</span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-heading font-extrabold text-2xl text-purple-300 font-mono tracking-tight">
            {metrics.recoveryRatePercentage}%
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, metrics.recoveryRatePercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5. Autonomous Action % */}
      <div className="card card-hover relative overflow-hidden border-slate-700 bg-gradient-to-br from-slate-900/90 to-slate-800/40">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Autonomous Actions</span>
          <div className="p-1.5 rounded-lg bg-slate-800 text-blue-400">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="font-heading font-extrabold text-2xl text-slate-100 font-mono tracking-tight">
            {metrics.autonomousActionPercentage}%
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Deterministic Safety Guardrails</span>
          </div>
        </div>
      </div>
    </div>
  );
};
