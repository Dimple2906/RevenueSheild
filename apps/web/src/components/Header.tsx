import React from 'react';
import { RefreshCw, User, Sliders, Home, Sun, Moon } from 'lucide-react';
import { RazorpayShieldLogo } from './RazorpayShieldLogo.tsx';
import { LiveRecoveryCounterWidget } from './LiveRecoveryCounterWidget.tsx';
import { useTheme } from '../lib/ThemeContext.tsx';

interface HeaderProps {
  merchant?: any;
  user?: any;
  activeRole: string;
  onRoleChange: (role: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSafetyModal: () => void;
  onNavigateHome: () => void;
  sessionRecoveredPaise: number;
  sessionRecoveredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  merchant,
  user,
  activeRole,
  onRoleChange,
  onRefresh,
  isRefreshing,
  onOpenSafetyModal,
  onNavigateHome,
  sessionRecoveredPaise,
  sessionRecoveredCount,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-[var(--bg-border)] bg-[var(--bg-surface)] sticky top-0 z-30 font-sans transition-colors duration-200">
      <div className="px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Tag */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onNavigateHome}
            className="w-9 h-9 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-center font-bold shadow-sm cursor-pointer hover:scale-105 transition-transform shrink-0"
          >
            <RazorpayShieldLogo className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-syne font-extrabold text-base tracking-tight text-[var(--text-primary)] flex items-center gap-1">
                RevenueShield <span className="text-amber-500 text-xs">◈</span>
              </span>
              <span className="badge-pill badge-active text-[10px]">
                AI OS
              </span>
              <span className="badge-pill badge-recovered text-[10px] hidden sm:inline-flex">
                Track 03
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] hidden sm:block">
              {merchant?.name || 'Acme SaaS India'} • 10 Autonomous Agents Live
            </p>
          </div>
        </div>

        {/* Center: Live Session Recovery Widget */}
        <div className="hidden md:block">
          <LiveRecoveryCounterWidget
            sessionRecoveredPaise={sessionRecoveredPaise}
            sessionRecoveredCount={sessionRecoveredCount}
          />
        </div>

        {/* Right: Controls, Theme Switcher & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Landing page link */}
          <button
            onClick={onNavigateHome}
            className="btn-ghost text-xs px-2.5 py-1.5 hidden lg:flex items-center gap-1.5"
            title="Return to Public Landing Page"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Landing</span>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-mono">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline font-mono">Dark</span>
              </>
            )}
          </button>

          {/* Safety Settings Button */}
          <button 
            onClick={onOpenSafetyModal}
            className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold"
            title="Configure Safety Policy Firewall"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Safety Firewall</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-lg px-2.5 py-1.5 text-xs">
            <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value)}
              aria-label="Select User Role"
              className="bg-transparent text-[var(--text-primary)] outline-none cursor-pointer text-xs font-mono font-medium"
            >
              <option value="MERCHANT_ADMIN" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Admin (Karan)</option>
              <option value="FINANCE_MANAGER" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Finance (Ananya)</option>
              <option value="SUPPORT_CSM" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">CSM (Rohan)</option>
              <option value="VIEWER" className="bg-[var(--bg-surface)] text-[var(--text-primary)]">Viewer Mode</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="btn-ghost p-2 rounded-lg text-[var(--text-secondary)] hover:text-amber-500"
            title="Refresh Real-time Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
