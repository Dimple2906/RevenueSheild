import React, { useState } from 'react';
import { 
  Play, 
  RefreshCw, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldAlert, 
  CreditCard, 
  PhoneCall, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api } from '../lib/api.ts';

interface FloatingDemoControllerProps {
  onScenarioTriggered?: (scenarioName: string) => void;
}

export const FloatingDemoController: React.FC<FloatingDemoControllerProps> = ({ onScenarioTriggered }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const scenarios = [
    {
      id: 'sub_failure',
      name: '1. Subscription Failure',
      desc: 'Priya Sharma (₹2,400) — Insufficient Funds',
      icon: CreditCard,
      action: api.triggerSubscriptionFailure,
    },
    {
      id: 'cart_abandon',
      name: '2. Cart Abandonment',
      desc: 'Amit Verma (₹1,299) — Proactive Payment Link',
      icon: Sparkles,
      action: api.triggerCheckoutAbandonment,
    },
    {
      id: 'bank_downtime',
      name: '3. Bank Downtime Cluster',
      desc: '4x HDFC Failures — Quarantine & Reroute',
      icon: AlertTriangle,
      action: api.triggerPaymentDegradation,
    },
    {
      id: 'mandate_expiry',
      name: '4. E-Mandate Expiry',
      desc: 'Vikram Singh (₹4,999) — RBI Re-auth Link',
      icon: RotateCcw,
      action: api.triggerMandateExpiry,
    },
    {
      id: 'refund_counter',
      name: '5. Refund Arbitrage',
      desc: 'Pooja Verma (₹3,999) — 110% Store Credit',
      icon: Sparkles,
      action: api.triggerRefundRequest,
    },
    {
      id: 'invoice_overdue',
      name: '6. Overdue B2B Invoice',
      desc: 'Nexus Tech (₹25,000) — 5% Late Waiver',
      icon: CreditCard,
      action: api.triggerInvoiceOverdue,
    },
    {
      id: 'promise_to_pay',
      name: '7. Promise to Pay',
      desc: 'Siddharth Rao (₹7,500) — NLP Promise Lock',
      icon: Check,
      action: api.triggerPromiseToPay,
    },
    {
      id: 'churn_risk',
      name: '8. Pre-Churn Prevention',
      desc: 'Deepak Patel (₹3,499) — Retention Pause',
      icon: ShieldAlert,
      action: api.triggerChurnRisk,
    },
    {
      id: 'voice_recovery',
      name: '9. Voice AI Recovery',
      desc: 'Rajesh Sharma (₹45,000) — TRAI Multilingual Call',
      icon: PhoneCall,
      action: api.triggerVoiceRecovery,
    },
    {
      id: 'conflict_resolution',
      name: '10. Coordinator Conflict',
      desc: 'Multi-Agent Collision — Auto Priority Rank',
      icon: ShieldAlert,
      action: api.triggerMultiAgentConflict,
    },
  ];

  const handleTrigger = async (id: string, name: string, actionFn: () => Promise<unknown>) => {
    setActiveButton(id);
    try {
      await actionFn();
      if (onScenarioTriggered) onScenarioTriggered(name);
      setTimeout(() => {
        setActiveButton(null);
      }, 1600);
    } catch (err) {
      console.error('Demo trigger error:', err);
      setActiveButton(null);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await api.resetDatabase();
      if (onScenarioTriggered) onScenarioTriggered('Database Reset');
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full font-sans transition-all duration-300">
      <div className="card-base rounded-2xl p-0 border border-amber-500 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-3 bg-[var(--bg-elevated)] border-b border-[var(--bg-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="font-syne font-bold text-xs tracking-wider text-amber-600 dark:text-amber-400 uppercase">
              ◈ Demo Controller
            </span>
            <span className="badge-pill badge-active text-[9px]">
              JUDGES' PLAYGROUND
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors text-xs flex items-center gap-1"
              title="Reset Database to Seed State"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-amber-500' : ''}`} />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Body */}
        {!isMinimized && (
          <div className="p-3 space-y-2 max-h-[360px] overflow-y-auto bg-[var(--bg-surface)] text-xs">
            <p className="text-[11px] text-[var(--text-secondary)] mb-2 font-medium">
              Trigger autonomous recovery scenarios in real-time:
            </p>

            <div className="grid grid-cols-1 gap-1.5">
              {scenarios.map((s) => {
                const Icon = s.icon;
                const isFired = activeButton === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => handleTrigger(s.id, s.name, s.action)}
                    disabled={activeButton !== null}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between group ${
                      isFired
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        : 'bg-[var(--bg-elevated)] border-[var(--bg-border)] hover:border-amber-500 text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center shrink-0 font-bold ${
                          isFired
                            ? 'bg-white text-emerald-600'
                            : 'bg-[var(--bg-surface)] text-[var(--text-primary)] group-hover:text-amber-500'
                        }`}
                      >
                        {isFired ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="truncate">
                        <div className={`font-bold truncate ${isFired ? 'text-white' : 'text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400'}`}>
                          {s.name}
                        </div>
                        <div className={`text-[10px] truncate ${isFired ? 'text-emerald-100' : 'text-[var(--text-secondary)]'}`}>{s.desc}</div>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isFired ? (
                        <span className="text-[10px] font-mono font-bold text-white">Fired ✓</span>
                      ) : (
                        <Play className="w-3 h-3 text-[var(--text-muted)] group-hover:text-amber-500 transition-transform group-hover:scale-110" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
