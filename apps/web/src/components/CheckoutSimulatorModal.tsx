import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Lock, 
  CheckCircle2, 
  Zap
} from 'lucide-react';
import { formatPaiseToINR } from '@revenueshield/shared';
import { RevenueLeakCase } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface CheckoutSimulatorModalProps {
  leak: RevenueLeakCase | null;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const CheckoutSimulatorModal: React.FC<CheckoutSimulatorModalProps> = ({
  leak,
  onClose,
  onPaymentSuccess,
}) => {
  const [paying, setPaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  if (!leak) return null;

  const latestAction = (leak as any).recoverySessions?.[0]?.actions?.[0] || (leak as any).latestAction;
  const finalAmountPaise = latestAction
    ? latestAction.amountPaise - (latestAction.discountPaise || 0)
    : leak.amountAtRiskPaise;
  const formattedAmount = formatPaiseToINR(finalAmountPaise, true);

  const handlePayNow = async () => {
    try {
      setPaying(true);
      await api.simulatePayment(leak.id);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 1600);
    } catch (err: any) {
      alert(`Payment failed: ${err.message}`);
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn font-sans">
      <div 
        className="w-full max-w-md card-base rounded-2xl p-0 border border-amber-500 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Razorpay Standard Header */}
        <div className="bg-[var(--bg-elevated)] p-5 border-b border-[var(--bg-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-syne font-bold text-base text-[var(--text-primary)]">Acme SaaS Hosted Checkout</span>
                <span className="badge-pill badge-active text-[10px]">
                  SANDBOX
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Secured by Razorpay Smart Payment Link
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details */}
        <div className="p-5 bg-[var(--bg-surface)] border-b border-[var(--bg-border)] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-muted)]">Recovery Item:</span>
            <span className="font-semibold text-[var(--text-primary)] font-sans">{leak.assignedAgent}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-muted)]">Customer:</span>
            <span className="font-semibold text-[var(--text-primary)] font-sans">{leak.customer?.name}</span>
          </div>
          {latestAction && latestAction.discountPaise > 0 && (
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-bold">
              <span>Recovery Incentive Discount:</span>
              <span>-{formatPaiseToINR(latestAction.discountPaise, true)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--bg-border)] text-sm">
            <span className="text-[var(--text-primary)] font-sans font-bold">Total Amount Due:</span>
            <span className="font-syne font-bold text-lg text-amber-600 dark:text-amber-400">{formattedAmount}</span>
          </div>
        </div>

        {/* Methods */}
        <div className="p-5 bg-[var(--bg-elevated)] space-y-4">
          {isSuccess ? (
            <div className="py-8 text-center space-y-2 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-syne font-bold text-lg text-emerald-600 dark:text-emerald-400">Payment Captured!</h4>
              <p className="text-xs text-[var(--text-secondary)] font-mono">
                Webhook dispatched &rarr; RevenueShield auto-recovered {formattedAmount}!
              </p>
            </div>
          ) : (
            <>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-bold">
                Select Preferred Payment Method
              </div>

              <div className="space-y-2 text-xs">
                {/* UPI */}
                <div 
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedMethod === 'upi'
                      ? 'bg-[var(--bg-surface)] border-amber-500 shadow-sm'
                      : 'bg-[var(--bg-surface)] border-[var(--bg-border)] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-amber-500" />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">UPI / QR (Google Pay, PhonePe, Paytm)</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">Instant 1-click authorization</div>
                    </div>
                  </div>
                  <span className="badge-pill badge-recovered text-[9px]">Fastest</span>
                </div>

                {/* Card */}
                <div 
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-[var(--bg-surface)] border-amber-500 shadow-sm'
                      : 'bg-[var(--bg-surface)] border-[var(--bg-border)] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">Credit / Debit Card</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">Visa, Mastercard, RuPay, Amex</div>
                    </div>
                  </div>
                </div>

                {/* Netbanking */}
                <div 
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'bg-[var(--bg-surface)] border-amber-500 shadow-sm'
                      : 'bg-[var(--bg-surface)] border-[var(--bg-border)] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-semibold text-[var(--text-primary)]">Netbanking</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">HDFC, ICICI, SBI, Axis, Kotak</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solid Pay CTA */}
              <button
                onClick={handlePayNow}
                disabled={paying}
                className="btn-primary w-full py-3 text-sm"
              >
                {paying ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Processing with Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {formattedAmount} via {selectedMethod.toUpperCase()}</span>
                  </>
                )}
              </button>
            </>
          )}

          <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] font-mono pt-1">
            <Lock className="w-3 h-3 text-[var(--text-muted)]" />
            <span>256-bit SSL Encrypted • RBI &amp; PCI-DSS Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
