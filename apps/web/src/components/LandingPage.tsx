import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Zap, 
  CreditCard, 
  RotateCcw, 
  Layers, 
  Users, 
  PhoneCall, 
  Search,
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import { RevenueFlowCanvas } from './RevenueFlowCanvas.tsx';
import { HeroSecurityVault } from './HeroSecurityVault.tsx';
import { useTheme } from '../lib/ThemeContext.tsx';
import { RazorpayShieldLogo } from './RazorpayShieldLogo.tsx';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const [activeTab, setActiveTab] = useState<'pre' | 'at' | 'post'>('at');
  const [typedLines, setTypedLines] = useState<number>(0);
  const { theme, toggleTheme } = useTheme();

  // Terminal sequence automated typing loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTypedLines((prev) => (prev < 6 ? prev + 1 : 0));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const agents = [
    {
      name: 'SubGuardian',
      title: 'Subscription Recovery',
      desc: 'Diagnoses recurring auto-debit declines & generates personalized 1-click Razorpay recovery links.',
      recovered: '₹87,200',
      rate: '78%',
      color: '#8B5CF6',
      icon: CreditCard,
    },
    {
      name: 'InfraGuard',
      title: 'Infrastructure Guard',
      desc: 'Monitors bank downtime spikes (e.g. HDFC UPI downtime), quarantines retries, and reroutes when green.',
      recovered: '₹54,000',
      rate: '92%',
      color: '#EF4444',
      icon: AlertTriangle,
    },
    {
      name: 'CartRescuer',
      title: 'Checkout Recovery',
      desc: 'Detects cart abandonment drop-offs and dispatches dynamic discount recovery checkout links.',
      recovered: '₹38,400',
      rate: '65%',
      color: '#F59E0B',
      icon: Sparkles,
    },
    {
      name: 'MandateRenewer',
      title: 'Mandate Renewal',
      desc: 'Tracks RBI e-mandate expiry schedules and automates pre-debit renewals before subscription lapse.',
      recovered: '₹28,600',
      rate: '84%',
      color: '#3B82F6',
      icon: RotateCcw,
    },
    {
      name: 'RefundArbitrage',
      title: 'Refund Recovery',
      desc: 'Offers instant 110% store credit gift cards to retain customer cash GMV on refund requests.',
      recovered: '₹19,200',
      rate: '58%',
      color: '#F97316',
      icon: Zap,
    },
    {
      name: 'ReceivablesChaser',
      title: 'Receivables Agent',
      desc: 'Monitors overdue B2B SaaS invoices, offers dynamic 5% late-fee waivers, and updates invoices.',
      recovered: '₹75,000',
      rate: '72%',
      color: '#10B981',
      icon: Layers,
    },
    {
      name: 'PromisePay',
      title: 'Promise-to-Pay Agent',
      desc: 'Parses customer payment promises with NLP, schedules reminders, and tracks commitment deadlines.',
      recovered: '₹22,500',
      rate: '80%',
      color: '#14B8A6',
      icon: CheckCircle2,
    },
    {
      name: 'ChurnPredictor',
      title: 'Churn Prevention',
      desc: 'Detects pre-churn usage dips and intervenes with pause options and tailored loyalty retention discounts.',
      recovered: '₹41,000',
      rate: '61%',
      color: '#EC4899',
      icon: Users,
    },
    {
      name: 'VoiceRecovery',
      title: 'Voice AI Telephony',
      desc: 'Synthesizes multilingual AI recovery phone calls (Hindi/English) with strict TRAI 140 compliance.',
      recovered: '₹68,000',
      rate: '86%',
      color: '#6366F1',
      icon: PhoneCall,
    },
    {
      name: 'PaymentDetective',
      title: 'Payment Cluster Detective',
      desc: 'Aggregates payment failure clusters for root-cause diagnosis and automated rerouting alerts.',
      recovered: '₹95,000',
      rate: '89%',
      color: '#DC2626',
      icon: Search,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)] font-sans overflow-x-hidden transition-colors duration-200">
      {/* Background Interactive Hover Light & Particle Canvas */}
      <RevenueFlowCanvas />

      {/* STICKY NAVBAR */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-center shrink-0 shadow-sm">
              <RazorpayShieldLogo className="w-6 h-6" />
            </div>
            <div>
              <span className="font-syne font-extrabold text-lg tracking-tight text-[var(--text-primary)] flex items-center gap-1.5">
                RevenueShield <span className="text-amber-500 text-sm">◈</span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[var(--text-secondary)]">
            <a href="#problem" className="hover:text-amber-500 transition-colors">The Problem</a>
            <a href="#agents" className="hover:text-amber-500 transition-colors">10 Recovery Agents</a>
            <a href="#terminal" className="hover:text-amber-500 transition-colors">Live Terminal</a>
            <a href="#metrics" className="hover:text-amber-500 transition-colors">Metrics</a>
          </div>

          <div className="flex items-center gap-3">
            {/* 10 Agents Active Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>10 Agents Active</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn-ghost text-xs px-2.5 py-1.5 flex items-center gap-1.5"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline font-mono">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline font-mono">Dark</span>
                </>
              )}
            </button>

            {/* Solid Launch Console Button */}
            <button
              onClick={onEnterDashboard}
              className="btn-primary text-xs"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-20 pb-16 px-6 max-w-5xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-amber-600 dark:text-amber-400 text-xs font-mono tracking-wider uppercase mb-8">
          <span>◈</span>
          <span>Razorpay Buildathon 2026 — Track 03</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-syne font-extrabold text-4xl sm:text-6xl md:text-7xl leading-[1.08] tracking-tight mb-6 text-[var(--text-primary)]">
          Revenue is leaving <br />
          your business <br />
          <span className="animate-urgency font-extrabold">right now.</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-secondary)] font-normal leading-relaxed mb-6">
          RevenueShield watches every payment stage. Detects every leak. Recovers every rupee it can. 
          Powered by 10 specialized autonomous recovery agents and deterministic safety guardrails.
        </p>

        {/* WELCOME SECURITY VAULT ANIMATION & SIMULATOR */}
        <HeroSecurityVault />

        {/* Solid CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onEnterDashboard}
            className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Live Recovery Console</span>
          </button>
          <a
            href="#agents"
            className="btn-ghost w-full sm:w-auto px-8 py-3.5 text-base"
          >
            <span>Explore 10 AI Agents</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* LIVE COUNTER STRIP */}
        <div className="card-base rounded-2xl p-4 sm:p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[var(--bg-border)] text-left">
            <div className="p-2">
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)] mb-1">Recovered Today</div>
              <div className="font-syne font-bold text-xl sm:text-2xl text-amber-600 dark:text-amber-400">₹2,41,800</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 font-bold">▲ +18.4% vs avg</div>
            </div>
            <div className="p-2 md:pl-6">
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)] mb-1">Active Agents</div>
              <div className="font-syne font-bold text-xl sm:text-2xl text-[var(--text-primary)] flex items-center gap-2">
                <span>10 / 10</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">All modules operational</div>
            </div>
            <div className="p-2 md:pl-6 pt-4 md:pt-2">
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)] mb-1">Recovery Rate</div>
              <div className="font-syne font-bold text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400">70.1%</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">Automated resolution</div>
            </div>
            <div className="p-2 md:pl-6 pt-4 md:pt-2">
              <div className="text-[11px] font-mono uppercase text-[var(--text-muted)] mb-1">Avg Recovery Time</div>
              <div className="font-syne font-bold text-xl sm:text-2xl text-[var(--text-primary)]">14.3 hrs</div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">&lt; 24h SLA target</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM / 3-STAGE LIFECYCLE */}
      <section id="problem" className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 font-bold">◈ The Problem</div>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-[var(--text-primary)] mb-4">
            Revenue leaks at three different lifecycle stages
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            The average Indian SaaS &amp; D2C merchant loses 12–18% of potential revenue to preventable payment friction.
          </p>
        </div>

        {/* 3-Stage Interactive Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pre-Payment Card */}
          <div 
            onClick={() => setActiveTab('pre')}
            className={`card-base cursor-pointer transition-all ${
              activeTab === 'pre' ? 'border-amber-500 shadow-md scale-[1.02]' : 'opacity-85'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="badge-pill badge-active">Stage 01</span>
              <div className="pulse-dot-red" />
            </div>
            <h3 className="font-syne font-bold text-xl text-[var(--text-primary)] mb-2">Pre-Payment Stage</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Friction before transaction completes. High drop-off before intent becomes revenue.
            </p>
            <div className="space-y-2 font-mono text-xs text-[var(--text-primary)]">
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-between">
                <span>Cart Abandonment</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">₹51,200 lost/mo</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-between">
                <span>Pre-Churn Decay</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">₹78,600 lost/mo</span>
              </div>
            </div>
          </div>

          {/* At-Payment Card */}
          <div 
            onClick={() => setActiveTab('at')}
            className={`card-base cursor-pointer transition-all ${
              activeTab === 'at' ? 'border-amber-500 shadow-md scale-[1.02]' : 'opacity-85'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="badge-pill badge-active">Stage 02</span>
              <div className="pulse-dot-red" />
            </div>
            <h3 className="font-syne font-bold text-xl text-[var(--text-primary)] mb-2">At-Payment Stage</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Declines during charge execution. Bank outages, card expiry, and e-mandate lapses.
            </p>
            <div className="space-y-2 font-mono text-xs text-[var(--text-primary)]">
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-between">
                <span>Subscription Declines</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">₹48,800 lost/mo</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-between">
                <span>Mandate Expirations</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">₹14,400 lost/mo</span>
              </div>
            </div>
          </div>

          {/* Post-Payment Card */}
          <div 
            onClick={() => setActiveTab('post')}
            className={`card-base cursor-pointer transition-all ${
              activeTab === 'post' ? 'border-amber-500 shadow-md scale-[1.02]' : 'opacity-85'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="badge-pill badge-active">Stage 03</span>
              <div className="pulse-dot-red" />
            </div>
            <h3 className="font-syne font-bold text-xl text-[var(--text-primary)] mb-2">Post-Payment Stage</h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
              Overdue B2B invoices, broken customer promises, and cash-draining refund chargebacks.
            </p>
            <div className="space-y-2 font-mono text-xs text-[var(--text-primary)]">
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-between">
                <span>Overdue Invoices</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">₹28,200 lost/mo</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-between">
                <span>Refund Cash Drain</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">₹19,200 lost/mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE 10 RECOVERY AGENTS */}
      <section id="agents" className="relative z-10 py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 font-bold">◈ Autonomous Systems</div>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-[var(--text-primary)] mb-4">
            Ten specialized agents. Zero revenue left behind.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto">
            Each agent is dedicated to a specific failure pattern with custom AI diagnosis and native Razorpay primitives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div
                key={i}
                className="card-base group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-transform group-hover:scale-110 shadow-sm"
                    style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[10px] font-mono text-emerald-600 dark:text-emerald-400 border border-[var(--bg-border)] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>LIVE</span>
                  </div>
                </div>

                <h3 className="font-syne font-bold text-lg text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {agent.name}
                </h3>
                <div className="text-xs font-semibold text-[var(--text-secondary)] mb-3">{agent.title}</div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-5 min-h-[48px]">
                  {agent.desc}
                </p>

                <div className="pt-4 border-t border-[var(--bg-border)] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Recovered (30d)</div>
                    <div className="font-syne font-bold text-sm text-amber-600 dark:text-amber-400">{agent.recovered}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Recovery Rate</div>
                    <div className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">{agent.rate}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: LIVE TERMINAL DEMO PREVIEW */}
      <section id="terminal" className="relative z-10 py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 font-bold">◈ Machine Intelligence</div>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl text-[var(--text-primary)] mb-2">
            Watch an agent recover revenue in real-time
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Autonomous diagnosis, safety firewall gate, Razorpay link dispatch, and recovery loop closure.
          </p>
        </div>

        <div className="card-base p-0 rounded-2xl overflow-hidden font-mono text-xs shadow-xl">
          {/* Terminal Title Bar */}
          <div className="p-3 bg-[var(--bg-elevated)] border-b border-[var(--bg-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-[var(--text-secondary)] ml-2 font-bold">SubGuardian Agent Activity Terminal</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>STREAMING</span>
            </div>
          </div>

          {/* Terminal Output (Clean dark styling for code readability) */}
          <div className="p-6 space-y-4 bg-[#0A0B12] text-slate-200 min-h-[320px]">
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">● 14:32:07</span>
              <div>
                <span className="text-slate-100 font-bold">subscription.halted</span> detected for <span className="text-amber-400 font-bold">Priya Sharma</span> (₹2,400/month)
                <div className="text-[11px] text-slate-400 mt-0.5">sub_001 | Error: INSUFFICIENT_FUNDS | Razorpay Webhook</div>
              </div>
            </div>

            {typedLines >= 1 && (
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-bold">● 14:32:09</span>
                <div>
                  <span className="text-slate-200">Fetching customer context from Razorpay...</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ✓ Tenure: 18 months • 0 prior failures • High Value Loyal tier
                  </div>
                </div>
              </div>
            )}

            {typedLines >= 2 && (
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-bold">● 14:32:10</span>
                <div>
                  <span className="text-slate-200">AI Root Cause Diagnosis:</span> <span className="text-amber-300 font-bold">TEMPORARY_CASH_FLOW (91% confidence)</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">Strategy: Warm 1-click payment link, 48hr validity window</div>
                </div>
              </div>
            )}

            {typedLines >= 3 && (
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold">● 14:32:10</span>
                <div>
                  <span className="text-slate-200">Safety Firewall Evaluation:</span> <span className="text-emerald-400 font-bold">PASSED ✅</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    ✅ Attempt 1/3 • ✅ ₹2,400 &lt; ₹5,000 Cap • ✅ Cooldown Passed • ✅ Auto-Approved
                  </div>
                </div>
              </div>
            )}

            {typedLines >= 4 && (
              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-bold">● 14:32:11</span>
                <div>
                  <span className="text-slate-200">Razorpay Action Dispatched:</span> <span className="text-amber-300 font-bold">plink_NEW123</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    POST /v1/payment-links → rzp.io/l/abc123 created &amp; delivered via WhatsApp &amp; Email
                  </div>
                </div>
              </div>
            )}

            {typedLines >= 5 && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">08:41:33 ✓ RECOVERED — ₹2,400.00</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">18h 9m recovery time</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-2">
              <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse" />
              <span>Awaiting next webhook stream event...</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: KEY METRICS STRIP */}
      <section id="metrics" className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-[var(--bg-border)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="font-syne font-extrabold text-3xl sm:text-4xl text-amber-600 dark:text-amber-400 mb-1">₹2.4 Cr+</div>
            <div className="text-xs text-[var(--text-muted)] uppercase font-mono font-semibold">Recovered (30 Days)</div>
          </div>
          <div className="p-4">
            <div className="font-syne font-extrabold text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400 mb-1">70.1%</div>
            <div className="text-xs text-[var(--text-muted)] uppercase font-mono font-semibold">Recovery Success Rate</div>
          </div>
          <div className="p-4">
            <div className="font-syne font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)] mb-1">10 Modules</div>
            <div className="text-xs text-[var(--text-muted)] uppercase font-mono font-semibold">Specialized AI Agents</div>
          </div>
          <div className="p-4">
            <div className="font-syne font-extrabold text-3xl sm:text-4xl text-amber-600 dark:text-amber-400 mb-1">&lt; 24 hrs</div>
            <div className="text-xs text-[var(--text-muted)] uppercase font-mono font-semibold">Average Resolution Time</div>
          </div>
        </div>
      </section>

      {/* SECTION 6: BOTTOM CTA */}
      <section className="relative z-10 py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="card-base rounded-3xl p-8 sm:p-12 border-amber-500/40 relative overflow-hidden shadow-lg">
          <h2 className="font-syne font-extrabold text-3xl sm:text-5xl text-[var(--text-primary)] mb-4 relative z-10">
            Stop watching revenue disappear.
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto mb-8 relative z-10">
            Connect your Razorpay account. RevenueShield starts watching and recovering revenue immediately.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={onEnterDashboard}
              className="btn-primary w-full sm:w-auto px-8 py-3.5 text-base"
            >
              <span>Launch Live Recovery Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-[var(--text-muted)] font-mono mt-6 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Works with Razorpay test mode. No production credentials required.</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 px-6 border-t border-[var(--bg-border)] text-center text-xs text-[var(--text-muted)] font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <RazorpayShieldLogo className="w-4 h-4" />
            <span className="text-[var(--text-primary)] font-bold">RevenueShield AI OS</span>
            <span>— Razorpay Buildathon 2026</span>
          </div>
          <div>Every failed payment has a reason. Every reason has a solution.</div>
        </div>
      </footer>
    </div>
  );
};
