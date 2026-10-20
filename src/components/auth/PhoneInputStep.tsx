import React, { useState } from 'react';
import { Phone, ArrowLeft, School } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface PhoneInputStepProps {
  onSubmit: (phone: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const PhoneInputStep: React.FC<PhoneInputStepProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    const clean = phone.trim().replace(/\s+/g, '');
    if (!clean) {
      setLocalError('يرجى إدخال رقم الهاتف.');
      return;
    }

    if (clean.length < 8) {
      setLocalError('رقم الهاتف يجب أن يتكون من 8 أرقام على الأقل.');
      return;
    }

    await onSubmit(clean);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20 text-white">
          <School className="w-8 h-8 stroke-[1.75]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          تسجيل الدخول
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          أدخل رقم هاتفك المسجل لدى إدارة مجمع لا بروفيدانس
        </p>
      </div>

      <Input
        label="رقم الهاتف"
        type="tel"
        dir="ltr"
        placeholder="مثال: 22123456"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        icon={<Phone className="w-4 h-4" />}
        error={localError || error}
        autoFocus
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={!phone.trim()}
        className="w-full"
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        متابعة
      </Button>

      <div className="pt-2 text-center text-slate-400 text-xs">
        <p>التطبيق مخصص لأولياء الأمور والمعلمين والإدارة</p>
      </div>
    </form>
  );
};
