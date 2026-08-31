import React from 'react';
import { 
  Bot, 
  RefreshCw, 
  ShieldAlert, 
  ShoppingCart, 
  FileCheck, 
  RotateCcw, 
  Receipt, 
  MessageSquare, 
  UserMinus, 
  PhoneCall, 
  Search,
  CheckCircle,
  Play
} from 'lucide-react';
import { AgentInfo } from '../types/index.js';
import { formatPaiseToINR } from '@revenueshield/shared';

interface AgentGridProps {
  agents?: AgentInfo[];
  onTriggerAgent?: (agentType: string) => void;
}

const AGENT_ICON_MAP: Record<string, React.ReactNode> = {
  SUBSCRIPTION_RECOVERY: <RefreshCw className="w-5 h-5 text-blue-400" />,
  INFRASTRUCTURE_GUARD: <ShieldAlert className="w-5 h-5 text-amber-400" />,
  CHECKOUT_RECOVERY: <ShoppingCart className="w-5 h-5 text-emerald-400" />,
  MANDATE_RENEWAL: <FileCheck className="w-5 h-5 text-purple-400" />,
  REFUND_RECOVERY: <RotateCcw className="w-5 h-5 text-pink-400" />,
  RECEIVABLES: <Receipt className="w-5 h-5 text-cyan-400" />,
  PROMISE_TO_PAY: <MessageSquare className="w-5 h-5 text-indigo-400" />,
  CHURN_PREVENTION: <UserMinus className="w-5 h-5 text-rose-400" />,
  VOICE_RECOVERY: <PhoneCall className="w-5 h-5 text-amber-300" />,
  PAYMENT_DETECTIVE: <Search className="w-5 h-5 text-teal-400" />,
};

export const AgentGrid: React.FC<AgentGridProps> = ({ agents }) => {
  if (!agents || agents.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h3 className="font-heading font-bold text-lg text-slate-100">
            10 Specialized Recovery Agents
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Autonomous agents operating under strict Safety Engine policies
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {agents.map((agent) => {
          const icon = AGENT_ICON_MAP[agent.type] || <Bot className="w-5 h-5 text-blue-400" />;

          return (
            <div 
              key={agent.type}
              className="card card-hover flex flex-col justify-between p-4 border-slate-800/80 bg-slate-900/60"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                    {icon}
                  </div>
                  <span className={`badge ${agent.status === 'ACTIVE' ? 'badge-executed' : 'badge-pending'} text-[9px]`}>
                    {agent.status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping mr-1"></span>}
                    {agent.status}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-sm text-slate-100 line-clamp-1">
                  {agent.name}
                </h4>

                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase">Recovered</span>
                  <span className="font-bold text-emerald-400">
                    {formatPaiseToINR(agent.totalRecoveredPaise)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 block uppercase">Success</span>
                  <span className="font-bold text-slate-200">
                    {agent.successRatePercentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
