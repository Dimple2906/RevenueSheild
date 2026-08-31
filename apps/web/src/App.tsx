import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { Sidebar, NavigationTab } from './components/Sidebar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { DashboardStatsRow } from './components/DashboardStatsRow.tsx';
import { LifecycleBreakdownPanel } from './components/LifecycleBreakdownPanel.tsx';
import { PendingApprovalsPanel } from './components/PendingApprovalsPanel.tsx';
import { ActiveCasesTable } from './components/ActiveCasesTable.tsx';
import { LiveAgentActivityFeed } from './components/LiveAgentActivityFeed.tsx';
import { AuditTrailView } from './components/AuditTrailView.tsx';
import { CaseDetailDrawer } from './components/CaseDetailDrawer.tsx';
import { CheckoutSimulatorModal } from './components/CheckoutSimulatorModal.tsx';
import { SafetyConfigModal } from './components/SafetyConfigModal.tsx';
import { RevenueFlowCanvas } from './components/RevenueFlowCanvas.tsx';
import { PageTransitionLock } from './components/PageTransitionLock.tsx';
import { api } from './lib/api.ts';
import { 
  RevenueLeakCase, 
  DashboardOverviewResponse, 
  FunnelStageData, 
  AgentActivityItem, 
  AuditLogItem 
} from './types/index.ts';

export const App: React.FC = () => {
  // Always default to 'home' (Landing Page) first
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [activeRole, setActiveRole] = useState('MERCHANT_ADMIN');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cinematic Page Transition Lock Loader State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTargetTitle, setTransitionTargetTitle] = useState('Merchant Console');

  // Data State
  const [overview, setOverview] = useState<DashboardOverviewResponse | null>(null);
  const [funnel, setFunnel] = useState<FunnelStageData[]>([]);
  const [cases, setCases] = useState<RevenueLeakCase[]>([]);
  const [activities, setActivities] = useState<AgentActivityItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Session Recovery Counters
  const [sessionRecoveredPaise, setSessionRecoveredPaise] = useState<number>(0);
  const [sessionRecoveredCount, setSessionRecoveredCount] = useState<number>(0);

  // Modal & Drawer State
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [checkoutCase, setCheckoutCase] = useState<RevenueLeakCase | null>(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      const [overviewRes, funnelRes, leaksRes, actRes, auditRes] = await Promise.allSettled([
        api.getOverview(),
        api.getFunnel(),
        api.getLeaks(),
        api.getActivity(),
        api.getAuditLogs(),
      ]);

      if (overviewRes.status === 'fulfilled') {
        setOverview(overviewRes.value);
        setSessionRecoveredPaise(overviewRes.value.totalRecoveredPaise);
      }
      if (funnelRes.status === 'fulfilled') setFunnel(funnelRes.value.funnel);
      if (leaksRes.status === 'fulfilled') {
        setCases(leaksRes.value.leaks);
        const recoveredCases = leaksRes.value.leaks.filter(l => l.status === 'RECOVERED');
        setSessionRecoveredCount(recoveredCases.length);
      }
      if (actRes.status === 'fulfilled') setActivities(actRes.value.activities);
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value.auditLogs);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 4000);
    return () => clearInterval(interval);
  }, []);

  const navigateToTabWithLock = (targetTab: NavigationTab, title: string) => {
    setTransitionTargetTitle(title);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTab(targetTab);
    }, 450);
  };

  const handleApproveCase = async (leakId: string, overrideDiscount?: number) => {
    await api.approveAction(leakId, overrideDiscount);
    await loadAllData();
  };

  const handleRejectCase = async (leakId: string) => {
    await api.rejectAction(leakId, 'Rejected in War Room Approvals');
    await loadAllData();
  };

  const pendingApprovals = cases.filter(
    (c) => c.status === 'PENDING_HUMAN_APPROVAL' || c.requiresHumanReview
  );

  return (
    <div className="relative min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)] font-sans overflow-x-hidden transition-colors duration-200">
      {/* Background Interactive Hover Light & Particle Canvas */}
      <RevenueFlowCanvas />

      {/* Cinematic Security Shield Transition Loader */}
      <PageTransitionLock
        isLoading={isTransitioning}
        destinationName={transitionTargetTitle}
        onComplete={() => setIsTransitioning(false)}
      />

      {/* TAB: PUBLIC LANDING PAGE (DEFAULT) */}
      {currentTab === 'home' ? (
        <div className="relative min-h-screen">
          <LandingPage onEnterDashboard={() => navigateToTabWithLock('dashboard', 'War Room Dashboard')} />
        </div>
      ) : (
        /* CONSOLE DASHBOARD VIEW */
        <div className="relative min-h-screen flex flex-col">
          {/* Fixed Left Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              const titles: Record<NavigationTab, string> = {
                home: 'Landing Page',
                dashboard: 'War Room Dashboard',
                agents: 'Live Agent Feed',
                cases: 'Recovery Cases Ledger',
                audit: 'Immutable Audit Trail',
                safety: 'Safety Firewall',
              };
              navigateToTabWithLock(tab, titles[tab] || 'Console');
            }}
            pendingApprovalsCount={pendingApprovals.length}
          />

          {/* Main Layout Area offset by sidebar */}
          <div className="pl-16 flex-1 flex flex-col min-h-screen">
            {/* Top Header */}
            <Header
              merchant={overview?.merchant}
              activeRole={activeRole}
              onRoleChange={setActiveRole}
              onRefresh={loadAllData}
              isRefreshing={isRefreshing}
              onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
              onNavigateHome={() => navigateToTabWithLock('home', 'Landing Page')}
              sessionRecoveredPaise={sessionRecoveredPaise}
              sessionRecoveredCount={sessionRecoveredCount}
            />

            {/* Dynamic Tab Body */}
            <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
              {/* TAB 1: MAIN DASHBOARD */}
              {currentTab === 'dashboard' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* 4 Stat Cards */}
                  <DashboardStatsRow overview={overview} />

                  {/* Pending Approvals Panel (War Room Priority) */}
                  <PendingApprovalsPanel
                    pendingCases={pendingApprovals}
                    onApprove={handleApproveCase}
                    onReject={handleRejectCase}
                  />

                  {/* Revenue Lifecycle Breakdown & Funnel */}
                  <LifecycleBreakdownPanel funnelData={funnel} />

                  {/* Active Recovery Cases Table */}
                  <ActiveCasesTable
                    cases={cases}
                    onSelectCase={(c) => setSelectedCaseId(c.id)}
                    onQuickSimulatePay={(c) => setCheckoutCase(c)}
                  />
                </div>
              )}

              {/* TAB 2: LIVE AGENTS FEED */}
              {currentTab === 'agents' && (
                <div className="space-y-6 animate-fadeIn">
                  <LiveAgentActivityFeed
                    activity={activities}
                    onSelectCaseById={(id) => setSelectedCaseId(id)}
                  />
                </div>
              )}

              {/* TAB 3: RECOVERY CASES LEDGER */}
              {currentTab === 'cases' && (
                <div className="space-y-6 animate-fadeIn">
                  <PendingApprovalsPanel
                    pendingCases={pendingApprovals}
                    onApprove={handleApproveCase}
                    onReject={handleRejectCase}
                  />
                  <ActiveCasesTable
                    cases={cases}
                    onSelectCase={(c) => setSelectedCaseId(c.id)}
                    onQuickSimulatePay={(c) => setCheckoutCase(c)}
                  />
                </div>
              )}

              {/* TAB 4: AUDIT TRAIL */}
              {currentTab === 'audit' && (
                <div className="space-y-6 animate-fadeIn">
                  <AuditTrailView auditLogs={auditLogs} />
                </div>
              )}

              {/* TAB 5: SAFETY FIREWALL CONFIG */}
              {currentTab === 'safety' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="card-base p-6">
                    <div className="flex items-center justify-between pb-4 border-b border-[var(--bg-border)]">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-sm">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="font-syne font-bold text-xl text-[var(--text-primary)]">
                            Deterministic Safety Engine &amp; Policy Rules
                          </h2>
                          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                            Mathematical guardrails, outreach cooldown windows, and human approval firewall.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsSafetyModalOpen(true)}
                        className="btn-primary text-xs"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Configure Firewall Rules</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                      <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)]">
                        <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Max Autonomous Cap</div>
                        <div className="font-syne font-bold text-xl text-amber-600 dark:text-amber-400 mt-1">₹5,000.00</div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-1">Actions &gt; ₹5k require human sign-off</div>
                      </div>

                      <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)]">
                        <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Max Incentive Discount</div>
                        <div className="font-syne font-bold text-xl text-purple-600 dark:text-purple-400 mt-1">15% Max</div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-1">Hard limit on AI coupon generation</div>
                      </div>

                      <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)]">
                        <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Customer Cooldown</div>
                        <div className="font-syne font-bold text-xl text-emerald-600 dark:text-emerald-400 mt-1">24 Hours</div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-1">Quiet window between touches</div>
                      </div>

                      <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)]">
                        <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">Customer Coordinator</div>
                        <div className="font-syne font-bold text-xl text-[var(--text-primary)] mt-1">Active 🟢</div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-1">Multi-agent priority collision arbiter</div>
                      </div>
                    </div>
                  </div>

                  {/* Pending Approvals within Safety Tab */}
                  <PendingApprovalsPanel
                    pendingCases={pendingApprovals}
                    onApprove={handleApproveCase}
                    onReject={handleRejectCase}
                  />
                </div>
              )}
            </main>
          </div>

          {/* Modals & Drawers */}
          <CaseDetailDrawer
            leakId={selectedCaseId}
            onClose={() => setSelectedCaseId(null)}
            onCaseUpdated={loadAllData}
            onOpenCheckoutModal={(c) => setCheckoutCase(c)}
          />

          <CheckoutSimulatorModal
            leak={checkoutCase}
            onClose={() => setCheckoutCase(null)}
            onPaymentSuccess={loadAllData}
          />

          <SafetyConfigModal
            isOpen={isSafetyModalOpen}
            onClose={() => setIsSafetyModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
