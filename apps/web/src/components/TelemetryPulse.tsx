import React from 'react';
import { Activity, Zap, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { AuditLogItem } from '../types/index.js';

interface TelemetryPulseProps {
  activities?: AuditLogItem[];
  onSelectLeak?: (leakId: string) => void;
}

export const TelemetryPulse: React.FC<TelemetryPulseProps> = ({ activities, onSelectLeak }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="card text-center py-6 text-slate-500 text-xs">
        No active agent telemetry yet. Trigger a scenario above to start the live stream.
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="pulse-dot"></div>
          <h3 className="font-heading font-bold text-base text-slate-100">
            Live Agent Telemetry Stream
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Universal loop real-time audit feed
        </span>
      </div>

      <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
        {activities.slice(0, 10).map((act) => {
          let icon = <Zap className="w-3.5 h-3.5 text-blue-400" />;
          let badgeClass = 'badge-executed';

          if (act.eventType === 'PAYMENT_RECOVERED') {
            icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
            badgeClass = 'badge-recovered';
          } else if (act.eventType === 'SAFETY_EVALUATED') {
            icon = <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />;
            badgeClass = 'badge-analyzing';
          } else if (act.eventType === 'COORDINATOR_CONFLICT_BLOCKED' || act.eventType === 'ACTION_HELD') {
            icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
            badgeClass = 'badge-pending';
          }

          const timeStr = new Date(act.createdAt || act.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

          return (
            <div
              key={act.id}
              onClick={() => act.leakId && onSelectLeak && onSelectLeak(act.leakId)}
              className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all flex items-center justify-between gap-3 text-xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1 rounded bg-slate-800 shrink-0">
                  {icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${badgeClass} text-[9px] py-0 px-1.5`}>
                      {act.eventType.replace(/_/g, ' ')}
                    </span>
                    {act.agentType && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {act.agentType}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200 mt-0.5 truncate max-w-[500px]">
                    {act.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-right">
                {act.amountRecoveredFormatted && (
                  <span className="font-mono font-bold text-emerald-400">
                    +{act.amountRecoveredFormatted}
                  </span>
                )}
                <span className="text-[10px] text-slate-500 font-mono">
                  {timeStr}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
