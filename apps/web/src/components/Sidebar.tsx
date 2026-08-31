import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  ClipboardList, 
  Target, 
  Sliders, 
  Home
} from 'lucide-react';
import { RazorpayShieldLogo } from './RazorpayShieldLogo.tsx';

export type NavigationTab = 'home' | 'dashboard' | 'agents' | 'cases' | 'audit' | 'safety';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  pendingApprovalsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingApprovalsCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { id: 'home' as NavigationTab, label: 'Landing Page', icon: Home },
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agents' as NavigationTab, label: 'Live Agents', icon: Zap, badge: '10' },
    { id: 'cases' as NavigationTab, label: 'Recovery Cases', icon: Target, badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined },
    { id: 'audit' as NavigationTab, label: 'Audit Trail', icon: ClipboardList },
    { id: 'safety' as NavigationTab, label: 'Safety Firewall', icon: Sliders },
  ];

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[var(--bg-sidebar)] border-r border-[var(--bg-border)] flex flex-col justify-between transition-all duration-300 ${
        isExpanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* Top Logo */}
      <div>
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[var(--bg-border)] overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-center shrink-0 shadow-sm">
            <RazorpayShieldLogo className="w-5 h-5" />
          </div>
          {isExpanded && (
            <div className="truncate font-syne font-bold text-sm tracking-tight text-[var(--text-primary)] flex items-center gap-1.5">
              <span>RevenueShield</span>
              <span className="text-amber-500 text-xs">◈</span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-semibold relative group ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-500' : 'text-[var(--text-secondary)] group-hover:text-amber-500'}`} />

                {isExpanded && (
                  <div className="flex items-center justify-between w-full truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-mono border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Left Active Accent Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-amber-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Status */}
      <div className="p-3 border-t border-[var(--bg-border)] bg-[var(--bg-elevated)]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="pulse-dot-green shrink-0 ml-1" />
          {isExpanded && (
            <div className="truncate">
              <div className="text-[11px] font-bold text-[var(--text-primary)] truncate">All Systems Operational</div>
              <div className="text-[10px] text-[var(--text-secondary)] font-mono truncate">Razorpay Test Mode 🟢</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
