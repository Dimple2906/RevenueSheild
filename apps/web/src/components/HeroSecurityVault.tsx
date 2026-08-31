import React, { useState } from 'react';
import { Shield, Lock, CheckCircle2, Zap, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

export const HeroSecurityVault: React.FC = () => {
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState<'idle' | 'threat_detected' | 'intercepting' | 'secured'>('idle');

  const handleTriggerSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    setSimStep('threat_detected');

    setTimeout(() => {
      setSimStep('intercepting');
    }, 900);

    setTimeout(() => {
      setSimStep('secured');
    }, 2200);

    setTimeout(() => {
      setSimStep('idle');
      setSimulating(false);
    }, 4500);
  };

  return (
    <div className="relative my-8 max-w-2xl mx-auto">
      {/* Main Security Chamber Card */}
      <div className="relative card-base rounded-3xl p-6 sm:p-8 overflow-hidden shadow-lg">
        {/* Top Cryptographic Status Bar */}
        <div className="flex items-center justify-between border-b border-[var(--bg-border)] pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Autonomous Security Fortress
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-pill badge-active text-[10px] font-mono">
              AES-256 • RBI READY
            </span>
            <span className="badge-pill badge-recovered text-[10px] font-mono hidden sm:inline-flex">
              10 AGENTS ON GUARD
            </span>
          </div>
        </div>

        {/* Center Animated Shield & Vault Lock Stage */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          {/* Rotating Outer Cryptographic Rings */}
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
            {/* Outer Ring 1 - Clockwise */}
            <div 
              className="absolute inset-0 rounded-full border border-dashed border-amber-500/40 animate-[spin_28s_linear_infinite]"
            />
            {/* Outer Ring 2 - Counter-Clockwise */}
            <div 
              className="absolute inset-3 rounded-full border border-dotted border-blue-500/40 animate-[spin_18s_linear_infinite_reverse]"
            />
            {/* Inner Ring 3 - Pulse Glow */}
            <div 
              className="absolute inset-7 rounded-full border border-amber-500/50 shadow-sm animate-pulse"
            />

            {/* Orbiting Security Satellites */}
            <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
              <div className="w-4 h-4 rounded-full bg-amber-500 absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center text-[8px] font-extrabold text-slate-950 shadow-sm">
                ₹
              </div>
            </div>
            <div className="absolute inset-0 animate-[spin_16s_linear_infinite_reverse]">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-sm" />
            </div>

            {/* Central Giant Shield Core */}
            <div 
              className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 transform shadow-md ${
                simStep === 'threat_detected'
                  ? 'bg-red-500 text-white border-2 border-red-600 scale-95'
                  : simStep === 'intercepting'
                  ? 'bg-blue-600 text-white border-2 border-blue-400 scale-105'
                  : 'bg-[var(--bg-elevated)] border-2 border-amber-500 text-amber-500'
              }`}
            >
              {/* Dynamic Shield / Lock Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                {simStep === 'threat_detected' ? (
                  <>
                    <AlertTriangle className="w-12 h-12 text-white animate-bounce" />
                    <span className="text-[10px] font-mono font-bold text-white mt-1">LEAK DETECTED</span>
                  </>
                ) : simStep === 'intercepting' ? (
                  <>
                    <Zap className="w-12 h-12 text-white animate-spin" />
                    <span className="text-[10px] font-mono font-bold text-white mt-1">SHIELD LOCKING</span>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Shield className="w-12 h-12 text-amber-500" />
                      <Lock className="w-5 h-5 text-slate-950 fill-amber-500 absolute inset-0 m-auto" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-300 mt-1">PAYMENTS LOCKED</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Live Status Feed Under Vault */}
          <div className="mt-6 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-xs font-mono">
              {simStep === 'threat_detected' && (
                <span className="text-red-500 font-bold">⚠️ Warning: ₹2,400 Recurring Subscription Drop Detected!</span>
              )}
              {simStep === 'intercepting' && (
                <span className="text-blue-500 font-bold">⚡ Autonomous Interception: Generating Smart Razorpay Link...</span>
              )}
              {simStep === 'secured' && (
                <span className="text-emerald-500 font-bold">🎉 Success: ₹2,400 Recovered &amp; Secured in Vault!</span>
              )}
              {simStep === 'idle' && (
                <span className="text-[var(--text-secondary)]">
                  <span className="text-amber-500 font-bold">RevenueShield Core:</span> 24/7 Sentinel Guard Active
                </span>
              )}
            </div>

            {/* Solid Non-Glowing Test Interactive Lock Button */}
            <div className="pt-1 flex items-center justify-center gap-3">
              <button
                onClick={handleTriggerSimulation}
                disabled={simulating}
                className="btn-primary text-xs px-5 py-2.5"
              >
                {simulating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Neutralizing Leak...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Security Interception Demo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
