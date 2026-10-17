import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, LogIn } from 'lucide-react';
import { PhoneInputStep } from '@/components/auth/PhoneInputStep';
import { OtpVerificationStep } from '@/components/auth/OtpVerificationStep';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { getApiErrorMessage } from '@/utils/formatters';
import type { LoginResponse } from '@/types/auth';

type LoginStep = 'phone' | 'otp';

/**
 * شاشة الدخول الموحّد بالهاتف.
 *
 * التدّق الرسمي (لا fallback بلا OTP):
 * 1) phone → loginByPhone. إن نجح وراً → admin/teacher (لا OTP لهما).
 * 2) إن عاد 401 otp_required:true → وليّ أمر: requestOtp ثم إدخال الرمز.
 * 3) التحقّق عبر loginByPhone مع otp_code (أو verify-otp الرسمي).
 * الرمز (dev_code) لا يعرض ي الواجهة أبداً ولو ورد ي الاستجابة.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const extractLoginData = (payload: LoginResponse) => {
    if (payload.success && payload.data?.access_token) {
      return payload.data;
    }
    return null;
  };

  const finishLogin = (data: NonNullable<ReturnType<typeof extractLoginData>>) => {
    login(data.access_token, data.user, data.profile, data.role);
    navigate('/', { replace: true });
  };

  const handlePhoneSubmit = async (cleanPhone: string) => {
    setError('');
    setDevCode(undefined);
    setIsLoading(true);
    try {
      const response = await authService.loginByPhone(cleanPhone);
      const data = extractLoginData(response as LoginResponse);

      if (data) {
        finishLogin(data);
        return;
      }

      // otp_required من وليّ أمر — طلب الرمز والانتقال لخطوة الـ OTP
      setPhone(cleanPhone);
      setStep('otp');
      const otpRes = await authService.requestOtp(cleanPhone).catch(() => undefined);
      if (otpRes?.dev_code) {
        setDevCode(otpRes.dev_code);
      }
    } catch (err) {
      const status = (err as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        // رقم وليّ — يلزم OTP. نقوم بطلب الرمز فوراً وحفظه
        setPhone(cleanPhone);
        setStep('otp');
        try {
          const otpRes = await authService.requestOtp(cleanPhone);
          if (otpRes?.dev_code) {
            setDevCode(otpRes.dev_code);
          }
        } catch {
          // في حال كان الرقم غير مسجل مع تلميذ
        }
        return;
      }

      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setError('');
    setIsOtpLoading(true);
    try {
      // المسار الأول: login-by-phone مع الرمز.
      try {
        const response = await authService.loginByPhone(phone, otp);
        const data = extractLoginData(response as LoginResponse);
        if (data) {
          finishLogin(data);
          return;
        }
      } catch (loginErr) {
        const status = (loginErr as { response?: { status?: number } }).response?.status;

        // رمز غير صحيح/منتهي — رسالة واضحة بلا كشف تفاصيل.
        if (status === 401) {
          setError('الرمز غير صحيح أو منتهي الصلاحية. طلب رمز جديد قد يحل المشكلة.');
          return;
        }

        throw loginErr;
      }

      setError('تعذّر التحقق من الرمز، أعد المحاولة.');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleOtpResend = async () => {
    setError('');
    try {
      const otpRes = await authService.requestOtp(phone);
      if (otpRes?.dev_code) {
        setDevCode(otpRes.dev_code);
      }
    } catch {
      // لا نكسر التجربة: الرسالة الموحّدة أدناه تكفي.
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row bg-slate-50"
      dir="rtl"
    >
      {/* اللوحة الجانبية: الهوية على الشاشات الكبيرة */}
      <aside className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-orange-500 via-orange-600 to-purple-700 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-lg leading-tight">Providence</p>
            <p className="text-xs text-orange-100">مجمع لا بروفيدانس التعليمي</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-purple-900/30 rounded-full blur-2xl" />
          <h2 className="relative text-4xl font-black leading-snug">
            منظومة واحدة
            <br />
            <span className="text-orange-100">لإدارة المدرسة</span>
          </h2>
          <p className="relative mt-4 text-sm leading-relaxed text-orange-50/90 max-w-sm">
            أولياء الأمور يتابعون الأبناء والمعاليم، والمعلمون يسجّلون الحضور والنتائج،
            والإدارة تدير كل شيء من مكان واحد.
          </p>
        </div>

        <div className="text-xs text-orange-100/70">
          سيدي بوزيد، تونس — التميز ي التعليم والتأطير
        </div>
      </aside>

      {/* نموذج الدخول */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20 text-white">
              <School className="w-8 h-8 stroke-[1.75]" />
            </div>
            <h1 className="text-xl font-black text-slate-900">مجمع لا بروفيدانس</h1>
            <p className="text-xs text-slate-500 mt-1">
              منظومة إدارة المدرسة — أولياء الأمور والمعلمين والإدارة
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
            {step === 'phone' ? (
              <PhoneInputStep onSubmit={handlePhoneSubmit} isLoading={isLoading} error={error} />
            ) : (
              <OtpVerificationStep
                phone={phone}
                devCode={devCode}
                onVerify={handleOtpVerify}
                onResend={handleOtpResend}
                onBack={() => {
                  setStep('phone');
                  setDevCode(undefined);
                  setError('');
                }}
                isLoading={isOtpLoading}
                error={error}
              />
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <LogIn className="w-3.5 h-3.5" />
            دخول آمن برمز تحقّق يصل هاتفك
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
