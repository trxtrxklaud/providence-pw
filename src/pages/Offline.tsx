import React from 'react';
import { WifiOff } from 'lucide-react';

/** صحة Offline بسيطة وآمنة — لا تخزّن بيانات ولا تسمح بأي عملية. */
const OfflinePage: React.FC = () => (
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center"
    dir="rtl"
  >
    <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
      <WifiOff className="w-8 h-8" />
    </div>
    <h1 className="text-xl font-black text-slate-900">لا يوجد اتصال بالإنترنت</h1>
    <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xs">
      هذه الشاشة تعمل بلا اتصال. عند عودة الشبكة سيعاد تحميل التطبيق
      تلقائياً — لا تحظ أي عملية أو بيانات حساسة دون اتصال.
    </p>
  </div>
);

export default OfflinePage;
