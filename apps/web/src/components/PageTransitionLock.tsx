import React, { useEffect, useState } from 'react';
import { Lock, CheckCircle2, Zap } from 'lucide-react';
import { RazorpayShieldLogo } from './RazorpayShieldLogo.tsx';

interface PageTransitionLockProps {
  isLoading: boolean;
  destinationName?: string;
  onComplete: () => void;
}

export const PageTransitionLock: React.FC<PageTransitionLockProps> = ({
  isLoading,
  destinationName = 'Merchant Console',
  onComplete,
}) => {
  const [stage, setStage] = useState<'locking' | 'secured' | 'done'>('locking');

  useEffect(() => {
    if (!isLoading) {
      setStage('done');
      return;
    }

    setStage('locking');
    const timer1 = setTimeout(() => {
      setStage('secured');
    }, 450);

    const timer2 = setTimeout(() => {
      setStage('done');
      onComplete();
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isLoading, onComplete]);

  if (!isLoading || stage === 'done') return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[var(--bg-void)]/95 backdrop-blur-xl flex flex-col items-center justify-center animate-fadeIn font-sans"
    >
      {/* Central Shield Vault */}
      <div className="relative flex flex-col items-center">
        {/* Rotating Outer Cryptographic Rings */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/40 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-3 rounded-full border border-dotted border-blue-500/50 animate-[spin_5s_linear_infinite_reverse]" />
          <div className="absolute inset-6 rounded-full border border-emerald-500/30 animate-pulse" />

          {/* Central Shield Vault */}
          <div 
            className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-xl ${
              stage === 'secured'
                ? 'bg-emerald-500 text-white scale-105'
                : 'bg-[var(--bg-elevated)] border-2 border-amber-500 text-amber-500 scale-100'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <RazorpayShieldLogo className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Dynamic Security Loading Text */}
        <div className="mt-6 text-center space-y-1.5 font-mono">
          <div className="text-xs uppercase tracking-widest text-[var(--text-muted)] flex items-center justify-center gap-2 font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            <span>{stage === 'secured' ? 'Security Perimeter Engaged' : 'Securing Revenue Channel'}</span>
          </div>

          <h3 className="font-syne font-bold text-lg text-[var(--text-primary)]">
            {stage === 'secured' ? `Accessing ${destinationName}` : 'Authenticating Razorpay Sentinel...'}
          </h3>

          <div className="flex items-center justify-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>256-Bit SHA Encrypted &bull; 10 Autonomous Agents Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
