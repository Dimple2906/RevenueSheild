import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Save } from 'lucide-react';
import { api } from '../lib/api.ts';

interface SafetyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyConfigModal: React.FC<SafetyConfigModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [policy, setPolicy] = useState({
    maxAutonomousAmountPaise: 500000,
    maxDiscountPercentage: 15,
    customerCooldownHours: 24,
    humanApprovalThresholdPaise: 1000000,
    allowVoiceRecovery: true,
    allowStoreCreditCounter: true,
    optOutKeywords: 'STOP,UNSUBSCRIBE,OPTOUT,CANCEL,DND'
  });

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getPolicies()
        .then(res => {
          if (res.policy) {
            setPolicy({
              maxAutonomousAmountPaise: res.policy.maxAutonomousAmountPaise,
              maxDiscountPercentage: res.policy.maxDiscountPercentage,
              customerCooldownHours: res.policy.customerCooldownHours,
              humanApprovalThresholdPaise: res.policy.humanApprovalThresholdPaise,
              allowVoiceRecovery: res.policy.allowVoiceRecovery,
              allowStoreCreditCounter: res.policy.allowStoreCreditCounter,
              optOutKeywords: res.policy.optOutKeywords
            });
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.updatePolicies(policy);
      alert('✅ Safety policies updated successfully!');
      onClose();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn font-sans">
      <div 
        className="w-full max-w-lg card-base rounded-2xl border border-amber-500 overflow-hidden shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--bg-border)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-lg text-[var(--text-primary)]">
                Safety Engine Policy Firewall
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Configure deterministic boundary caps &amp; approval thresholds
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[var(--text-muted)] font-mono animate-pulse">
            Loading merchant safety policies...
          </div>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            {/* 1. Max Autonomous Amount */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[var(--text-primary)]">Max Autonomous Amount Cap</label>
                <span className="font-syne font-bold text-amber-600 dark:text-amber-400 text-sm">
                  ₹{(policy.maxAutonomousAmountPaise / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[var(--text-secondary)] text-[11px]">
                Transactions above this threshold route directly to human approval war room.
              </p>
              <input
                type="range"
                min={100000}
                max={2500000}
                step={50000}
                value={policy.maxAutonomousAmountPaise}
                onChange={(e) => setPolicy({ ...policy, maxAutonomousAmountPaise: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            {/* 2. Max Discount Percentage */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[var(--text-primary)]">Max Autonomous Incentive Discount</label>
                <span className="font-syne font-bold text-purple-600 dark:text-purple-400 text-sm">
                  {policy.maxDiscountPercentage}%
                </span>
              </div>
              <p className="text-[var(--text-secondary)] text-[11px]">
                AI agents cannot propose coupons or late fee waivers exceeding this limit.
              </p>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={policy.maxDiscountPercentage}
                onChange={(e) => setPolicy({ ...policy, maxDiscountPercentage: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            {/* 3. Customer Cooldown Window */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[var(--text-primary)]">Customer Outreach Cooldown</label>
                <span className="font-syne font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {policy.customerCooldownHours} Hours
                </span>
              </div>
              <p className="text-[var(--text-secondary)] text-[11px]">
                Minimum quiet window between automated customer touches to prevent spam.
              </p>
              <input
                type="range"
                min={6}
                max={72}
                step={6}
                value={policy.customerCooldownHours}
                onChange={(e) => setPolicy({ ...policy, customerCooldownHours: Number(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* 4. Toggles */}
            <div className="grid grid-cols-2 gap-3">
              <label className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-[var(--text-primary)] text-xs">Voice Telephony AI</div>
                  <div className="text-[10px] text-[var(--text-muted)]">TRAI 9AM–8PM compliant</div>
                </div>
                <input
                  type="checkbox"
                  checked={policy.allowVoiceRecovery}
                  onChange={(e) => setPolicy({ ...policy, allowVoiceRecovery: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </label>

              <label className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--bg-border)] flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-[var(--text-primary)] text-xs">Store Credit Offers</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Retain cash on refunds</div>
                </div>
                <input
                  type="checkbox"
                  checked={policy.allowStoreCreditCounter}
                  onChange={(e) => setPolicy({ ...policy, allowStoreCreditCounter: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[var(--bg-border)] flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-ghost text-xs">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="btn-primary text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Policies</span>
          </button>
        </div>
      </div>
    </div>
  );
};
