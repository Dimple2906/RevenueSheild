import { ActionExecutionResult } from '@revenueshield/shared';

export interface VoiceCallPayload {
  customerName: string;
  customerPhone: string;
  amountPaise: number;
  dueDate: string;
  language: 'hinglish' | 'tamil' | 'english';
}

export interface VoiceCallResult extends ActionExecutionResult {
  callId: string;
  language: string;
  transcript: string;
  callDurationSeconds: number;
  contactWindowCompliant: boolean;
}

export class VoiceRecoveryAdapter {
  /**
   * Enforces TRAI-compliant contact hours (09:00 to 20:00 IST)
   */
  public isWithinContactWindow(nowDate = new Date()): boolean {
    // Current UTC time + 5:30 = IST
    const utcHours = nowDate.getUTCHours();
    const utcMinutes = nowDate.getUTCMinutes();
    const istMinutes = utcHours * 60 + utcMinutes + 330;
    const istHour = Math.floor((istMinutes / 60) % 24);

    return istHour >= 9 && istHour < 20;
  }

  /**
   * Generates multilingual voice dunning scripts
   */
  public generateScript(payload: VoiceCallPayload): string {
    const formattedAmount = `₹${(payload.amountPaise / 100).toLocaleString('en-IN')}`;

    switch (payload.language) {
      case 'hinglish':
        return `Namaste ${payload.customerName} ji, Acme SaaS support team se automated assistance call. Aapka subscription amount ${formattedAmount} ka payment pending hai. Aapke registered WhatsApp aur SMS par direct 1-click Razorpay payment link send kar diya gaya hai. Kripya tap karke payment complete karein aur uninterrupted service enjoy karein. Dhanyawad!`;

      case 'tamil':
        return `Vanakkam ${payload.customerName}, Acme SaaS ninaivu paduthuthal azhaippu. Ungal subscription thogai ${formattedAmount} baaki ulladhu. Ungal SMS matrum WhatsApp-il 1-click Razorpay link anuppa pattulladhu. Thayaivu seidhu link-ai payanpaduthi payment mudikkavum. Nandri!`;

      case 'english':
      default:
        return `Hello ${payload.customerName}, this is an automated priority assistance call from Acme SaaS. Your payment of ${formattedAmount} is currently due. A secure 1-click Razorpay recovery link has been dispatched to your registered SMS and WhatsApp. Please tap the link to complete payment with zero service interruption. Thank you!`;
    }
  }

  /**
   * Simulates dispatching voice recovery call
   */
  public async dispatchCall(payload: VoiceCallPayload): Promise<VoiceCallResult> {
    const isCompliant = this.isWithinContactWindow();
    const transcript = this.generateScript(payload);
    const callId = `call_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      success: true,
      callId,
      language: payload.language,
      transcript,
      callDurationSeconds: 42,
      contactWindowCompliant: isCompliant,
      isSimulated: true,
      razorpayResourceId: callId,
      message: `Voice call ${callId} dispatched in ${payload.language.toUpperCase()} (${isCompliant ? 'TRAI 9AM-8PM Compliant' : 'Outside Standard Window Warning'}).`,
    };
  }
}

export const voiceRecoveryAdapter = new VoiceRecoveryAdapter();
