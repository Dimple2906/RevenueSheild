import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  ShoppingCart, 
  RefreshCw, 
  FileCheck, 
  Receipt, 
  MessageSquare, 
  PhoneCall, 
  Users, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { api } from '../lib/api.js';

interface DemoBarProps {
  onScenarioTriggered: () => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({ onScenarioTriggered }) => {
  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const trigger = async (scenarioKey: string, name: string) => {
    try {
      setLoadingScenario(scenarioKey);
      setLastMessage(`Triggering scenario: ${name}...`);
      await api.triggerDemoScenario(scenarioKey);
      setLastMessage(`✅ Success! Scenario "${name}" ingested into AI Orchestrator.`);
      onScenarioTriggered();
    } catch (err: any) {
      setLastMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoadingScenario(null);
      setTimeout(() => setLastMessage(null), 6000);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset database to clean default test state?')) {
      try {
        setLoadingScenario('reset');
        await api.resetDatabase();
        setLastMessage('✅ Database reset and re-seeded successfully.');
        onScenarioTriggered();
      } catch (err: any) {
        setLastMessage(`❌ Reset failed: ${err.message}`);
      } finally {
        setLoadingScenario(null);
        setTimeout(() => setLastMessage(null), 4000);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-b border-blue-500/20 py-2.5 px-4 shadow-inner">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Label */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-blue-500/20 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Judges' Demo Playground
              </span>
              <span className="hidden sm:inline text-[11px] text-slate-400 ml-2">
                Simulate any of the 10 revenue leak vectors:
              </span>
            </div>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => trigger('subscription-failure', 'Subscription Decline')}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-slate-800/80 hover:bg-blue-600 hover:text-white border-slate-700 text-xs py-1 px-2.5 transition-all"
              title="Card decline on recurring billing -> Dynamic Payment Link"
            >
              <RefreshCw className="w-3 h-3 text-blue-400" />
              <span>1. Sub Failure</span>
            </button>

            <button
              onClick={() => trigger('checkout-abandonment', 'Abandoned Cart Rescuer')}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-slate-800/80 hover:bg-blue-600 hover:text-white border-slate-700 text-xs py-1 px-2.5"
              title="Cart dropped at checkout -> Recovery link with 10% coupon"
            >
              <ShoppingCart className="w-3 h-3 text-emerald-400" />
              <span>2. Cart Rescuer</span>
            </button>

            <button
              onClick={() => trigger('payment-degradation', 'UPI Degradation Alert')}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-slate-800/80 hover:bg-blue-600 hover:text-white border-slate-700 text-xs py-1 px-2.5"
              title="84% UPI failure spike on HDFC -> Smart fallback advisory"
            >
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>3. Infra Guard</span>
            </button>

            <button
              onClick={() => trigger('mandate-expiry', 'UPI Mandate Renewal')}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-slate-800/80 hover:bg-blue-600 hover:text-white border-slate-700 text-xs py-1 px-2.5"
              title="Expiring UPI Autopay token -> Proactive renewal link"
            >
              <FileCheck className="w-3 h-3 text-purple-400" />
              <span>4. Mandate</span>
            </button>

            <button
              onClick={() => trigger('refund-request', 'Refund Intercept')}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-slate-800/80 hover:bg-blue-600 hover:text-white border-slate-700 text-xs py-1 px-2.5"
              title="Refund request -> Store Credit + ₹500 Bonus counteroffer"
            >
              <RotateCcw className="w-3 h-3 text-pink-400" />
              <span>5. Refund Intercept</span>
            </button>

            <button
              onClick={() => trigger('invoice-overdue', 'Overdue B2B Invoice')}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-slate-800/80 hover:bg-blue-600 hover:text-white border-slate-700 text-xs py-1 px-2.5"
              title="₹25,000 corporate invoice -> Exceeds limit -> Held for Human Review"
            >
              <Receipt className="w-3 h-3 text-amber-400" />
              <span>6. Overdue B2B</span>
            </button>

            <button
              onClick={() => trigger('promise-to-pay', 'Promise-to-Pay NLP')}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-slate-800/80 hover:bg-blue-600 hover:text-white border-slate-700 text-xs py-1 px-2.5"
              title="WhatsApp chat promise extracted -> Time-locked link"
            >
              <MessageSquare className="w-3 h-3 text-cyan-400" />
              <span>7. Promise-to-Pay</span>
            </button>

            <button
              onClick={() => trigger('voice-recovery', 'Voice Telephony Call')}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-slate-800/80 hover:bg-blue-600 hover:text-white border-slate-700 text-xs py-1 px-2.5"
              title="Multilingual voice recovery script (Hinglish/Tamil) + TRAI check"
            >
              <PhoneCall className="w-3 h-3 text-indigo-400" />
              <span>9. Voice Recovery</span>
            </button>

            <button
              onClick={() => trigger('multi-agent-conflict', 'Multi-Agent Conflict')}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-blue-900/40 hover:bg-blue-600 hover:text-white border-blue-600/40 text-xs py-1 px-2.5"
              title="Triggers simultaneous Cart + Subscription leaks on Priya to prove Customer Coordinator preemption"
            >
              <Layers className="w-3 h-3 text-blue-300" />
              <span>10. Coordinator Conflict</span>
            </button>

            <button
              onClick={handleReset}
              disabled={Boolean(loadingScenario)}
              className="btn btn-secondary btn-sm bg-slate-900 border-slate-800 text-slate-400 hover:text-red-400 text-xs py-1 px-2"
              title="Reset DB to initial seed data"
            >
              <RotateCcw className={`w-3 h-3 ${loadingScenario === 'reset' ? 'animate-spin' : ''}`} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Live Notification Feedback */}
        {lastMessage && (
          <div className="mt-2 text-xs font-mono bg-slate-950/80 border border-slate-800 rounded px-3 py-1.5 flex items-center justify-between text-slate-300 animate-fadeIn">
            <span>{lastMessage}</span>
            <span className="text-[10px] text-slate-500">Autonomous Universal Loop Running</span>
          </div>
        )}
      </div>
    </div>
  );
};
