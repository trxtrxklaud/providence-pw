import React, { useState, useEffect } from 'react';
import { KeyRound, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface OtpVerificationStepProps {
  phone: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
  devCode?: string;
}

export const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
  phone,
  onVerify,
  onResend,
  onBack,
  isLoading,
  error,
  devCode,
}) => {
  const [otp, setOtp] = useState(devCode || '');
  const [localError, setLocalError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (devCode) {
      setOtp(devCode);
    }
  }, [devCode]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!otp.trim()) {
      setLocalError('يرجى إدخال رمز التحقق.');
      return;
    }
    await onVerify(otp.trim());
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    try {
      await onResend();
      setCountdown(60);
      setOtp('');
      setLocalError('');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-5" dir="rtl">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <KeyRound className="w-8 h-8 stroke-[1.75]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          رمز التحقق (OTP)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          تم إرسال رمز التحقق إلى هاتفك{' '}
          <span className="font-bold text-slate-800 dir-ltr inline-block">
            {phone}
          </span>
        </p>
      </div>

      {devCode && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs text-center space-y-1.5 shadow-xs">
          <div className="flex items-center justify-center gap-1.5 text-amber-800 font-semibold text-xs">
            <span>وضع الإطلاق التجريبي (SMS غير مفعّل بعد)</span>
          </div>
          <div className="font-mono text-xl font-black tracking-widest text-amber-950 select-all py-1">
            {devCode}
          </div>
          <p className="text-[11px] text-amber-700">
            تم إدراج رمز التحقق أعلاه تلقائياً لتسهيل التجربة دون انتظار SMS.
          </p>
        </div>
      )}

      <Input
        label="رمز التحقق"
        type="text"
        inputMode="numeric"
        dir="ltr"
        placeholder="أدخل الرمز المكون من أرقام"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        icon={<CheckCircle2 className="w-4 h-4" />}
        error={localError || error}
        autoFocus
        maxLength={8}
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={!otp.trim()}
        className="w-full"
      >
        تأكيد الدخول
      </Button>

      {/* Resend Timer & Actions */}
      <div className="flex items-center justify-between text-xs pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          تغيير رقم الهاتف
        </button>

        {countdown > 0 ? (
          <span className="text-slate-400">
            إعادة الإرسال بعد{' '}
            <span className="font-bold text-orange-600">{countdown}</span> ثانية
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3 h-3" />
            {isResending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
          </button>
        )}
      </div>
    </form>
  );
};
