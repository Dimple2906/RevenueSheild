import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { formatPaiseToINR } from '@revenueshield/shared';

interface LiveRecoveryCounterWidgetProps {
  sessionRecoveredPaise: number;
  sessionRecoveredCount: number;
}

export const LiveRecoveryCounterWidget: React.FC<LiveRecoveryCounterWidgetProps> = ({
  sessionRecoveredPaise,
  sessionRecoveredCount,
}) => {
  const [displayPaise, setDisplayPaise] = useState(sessionRecoveredPaise);
  const [isGlow, setIsGlow] = useState(false);

  useEffect(() => {
    if (sessionRecoveredPaise > displayPaise) {
      setIsGlow(true);
      const diff = sessionRecoveredPaise - displayPaise;
      const steps = 20;
      const increment = diff / steps;
      let current = displayPaise;

      const timer = setInterval(() => {
        current += increment;
        if (current >= sessionRecoveredPaise) {
          setDisplayPaise(sessionRecoveredPaise);
          clearInterval(timer);
        } else {
          setDisplayPaise(Math.round(current));
        }
      }, 40);

      const glowTimeout = setTimeout(() => {
        setIsGlow(false);
      }, 2000);

      return () => {
        clearInterval(timer);
        clearTimeout(glowTimeout);
      };
    } else {
      setDisplayPaise(sessionRecoveredPaise);
    }
  }, [sessionRecoveredPaise]);

  const targetSessionPaise = 5000000; // ₹50,000 target
  const progressPercent = Math.min(100, Math.round((displayPaise / targetSessionPaise) * 100));

  return (
    <div
      className={`card-base p-2.5 rounded-xl border transition-all duration-300 font-sans ${
        isGlow
          ? 'border-emerald-500 shadow-md scale-105'
          : 'border-[var(--bg-border)] hover:border-amber-500'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <Sparkles className={`w-4 h-4 ${isGlow ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-wider uppercase text-[var(--text-muted)] font-bold">
              Live Session Recovery
            </div>
            <div className="text-sm font-syne font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span>{formatPaiseToINR(displayPaise, true)}</span>
              {isGlow && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  +Recovered!
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right pl-2 border-l border-[var(--bg-border)]">
          <div className="text-[10px] font-mono text-[var(--text-muted)] font-bold">Cases</div>
          <div className="text-xs font-syne font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
            <TrendingUp className="w-3 h-3" />
            <span>{sessionRecoveredCount}</span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill active bg-gradient-to-r from-amber-500 to-emerald-500"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
