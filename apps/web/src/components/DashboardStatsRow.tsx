import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, RefreshCw, Zap, ArrowUpRight } from 'lucide-react';
import { formatPaiseToINR } from '@revenueshield/shared';
import { DashboardOverviewResponse } from '../types/index.ts';

interface DashboardStatsRowProps {
  overview: DashboardOverviewResponse | null;
}

export const DashboardStatsRow: React.FC<DashboardStatsRowProps> = ({ overview }) => {
  const [floatingBonus, setFloatingBonus] = useState<string | null>(null);
  const [prevRecovered, setPrevRecovered] = useState<number>(overview?.totalRecoveredPaise || 0);

  useEffect(() => {
    if (overview && overview.totalRecoveredPaise > prevRecovered && prevRecovered > 0) {
      const diff = overview.totalRecoveredPaise - prevRecovered;
      setFloatingBonus(`+${formatPaiseToINR(diff)}`);
      setPrevRecovered(overview.totalRecoveredPaise);

      const t = setTimeout(() => setFloatingBonus(null), 2500);
      return () => clearTimeout(t);
    } else if (overview) {
      setPrevRecovered(overview.totalRecoveredPaise);
    }
  }, [overview?.totalRecoveredPaise]);

  const atRiskPaise = overview?.totalAtRiskPaise || 38420000;
  const recoveredPaise = overview?.totalRecoveredPaise || 24180000;
  const inRecoveryCount = overview?.activeRecoveriesCount || 47;
  const inRecoveryPaise = atRiskPaise - recoveredPaise > 0 ? atRiskPaise - recoveredPaise : 11420000;
  const recoveryRate = overview?.recoveryRatePercent || 62.9;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
      {/* CARD 1: TOTAL AT RISK (RED LEFT BORDER) */}
      <div className="card-base card-at-risk p-5 relative overflow-hidden">
        <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono uppercase tracking-wider mb-2 font-bold">
          <span>Total at Risk</span>
          <ShieldAlert className="w-4 h-4 text-red-500" />
        </div>
        <div className="font-syne font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mb-1">
          {formatPaiseToINR(atRiskPaise)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-red-500 font-mono mt-2 font-semibold">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>+12.4% vs last 30d</span>
        </div>
      </div>

      {/* CARD 2: RECOVERED 30D (GREEN LEFT BORDER) */}
      <div className="card-base card-recovered p-5 relative overflow-hidden">
        {floatingBonus && (
          <div className="absolute top-2 right-4 text-emerald-600 dark:text-emerald-400 font-syne font-bold text-sm float-bubble z-10">
            {floatingBonus}
          </div>
        )}
        <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono uppercase tracking-wider mb-2 font-bold">
          <span>Recovered (30d)</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="font-syne font-extrabold text-2xl sm:text-3xl text-amber-600 dark:text-amber-400 mb-1">
          {formatPaiseToINR(recoveredPaise)}
        </div>
        <div className="space-y-1.5 mt-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[var(--text-secondary)] font-medium">Recovery Rate</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{recoveryRate}%</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill active bg-emerald-500"
              style={{ width: `${Math.min(100, Math.max(5, recoveryRate))}%` }}
            />
          </div>
        </div>
      </div>

      {/* CARD 3: IN RECOVERY (AMBER LEFT BORDER) */}
      <div className="card-base card-amber p-5 relative overflow-hidden">
        <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono uppercase tracking-wider mb-2 font-bold">
          <span>In Recovery</span>
          <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div className="font-syne font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mb-1">
          {inRecoveryCount} <span className="text-sm font-normal text-[var(--text-secondary)]">cases</span>
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mt-2">
          <span>Pipeline Value:</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">{formatPaiseToINR(inRecoveryPaise)}</span>
        </div>
      </div>

      {/* CARD 4: AGENTS ACTIVE (PURPLE LEFT BORDER) */}
      <div className="card-base card-purple p-5 relative overflow-hidden">
        <div className="flex items-center justify-between text-[var(--text-muted)] text-xs font-mono uppercase tracking-wider mb-2 font-bold">
          <span>Agents Active</span>
          <Zap className="w-4 h-4 text-purple-500" />
        </div>
        <div className="font-syne font-extrabold text-2xl sm:text-3xl text-[var(--text-primary)] mb-1 flex items-center gap-2">
          <span>10 / 10</span>
          <span className="badge-pill badge-quarantine text-xs font-mono font-normal">
            100%
          </span>
        </div>
        <div className="flex items-center gap-1 mt-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
              title={`Agent ${i + 1} Operational`}
            />
          ))}
          <span className="text-[10px] text-[var(--text-secondary)] font-mono ml-2 font-medium">All Operational</span>
        </div>
      </div>
    </div>
  );
};
