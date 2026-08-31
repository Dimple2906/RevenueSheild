import React from 'react';
import { Layers, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { FunnelStageData } from '../types/index.js';

interface FunnelChartProps {
  funnel?: FunnelStageData[];
  onSelectStage?: (stage: string) => void;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ funnel, onSelectStage }) => {
  if (!funnel || funnel.length === 0) return null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="font-heading font-bold text-base text-slate-100">
            3-Stage Revenue Recovery Funnel
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Universal loop across pre, at, and post payment lifecycles
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {funnel.map((item, idx) => {
          let stageColor = 'border-blue-500/30 text-blue-400 bg-blue-950/20';
          let progressBg = 'bg-blue-500';

          if (item.stage === 'PRE_PAYMENT') {
            stageColor = 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20';
            progressBg = 'bg-cyan-500';
          } else if (item.stage === 'AT_PAYMENT') {
            stageColor = 'border-blue-500/30 text-blue-400 bg-blue-950/20';
            progressBg = 'bg-blue-500';
          } else {
            stageColor = 'border-purple-500/30 text-purple-400 bg-purple-950/20';
            progressBg = 'bg-purple-500';
          }

          return (
            <div 
              key={item.stage} 
              onClick={() => onSelectStage && onSelectStage(item.stage)}
              className={`p-4 rounded-xl border ${stageColor} cursor-pointer transition-all hover:scale-[1.01] hover:border-blue-400/50`}
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                <span>{item.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                  {item.count} cases
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {item.description}
              </p>

              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">Recovered</span>
                  <span className="font-mono font-bold text-lg text-emerald-400">
                    {item.recoveredFormatted}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-500 font-bold block">At Risk</span>
                  <span className="font-mono text-sm text-slate-300">
                    {item.totalFormatted}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-2 mt-3 overflow-hidden border border-slate-800">
                <div 
                  className={`${progressBg} h-full rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min(100, item.recoveryRate)}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 font-mono">
                <span>Success Rate</span>
                <span className="font-bold text-slate-200">{item.recoveryRate}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
