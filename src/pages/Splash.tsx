import React from 'react';
import { School } from 'lucide-react';

/** شاشة البداية: تدرّج الهوية البرتقالي/البنفسجي مع تحقّق الجلسة. */
const Splash: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-orange-600 to-purple-700"
      dir="rtl"
    >
      <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-2xl shadow-purple-900/30">
        <School className="w-12 h-12 text-white stroke-[1.5]" />
      </div>

      <h1 className="mt-6 text-3xl font-black text-white tracking-tight drop-shadow-sm">
        Providence
      </h1>
      <p className="mt-1 text-sm font-semibold text-orange-100">
        مجمع لا بروفيدانس التعليمي
      </p>

      <div className="mt-10 flex items-center gap-2" aria-label="جاري التحميل">
        <span className="w-2.5 h-2.5 rounded-full bg-white/90 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2.5 h-2.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2.5 h-2.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>

      <p className="mt-6 text-xs text-orange-100/80">جاري التحقق من جلستك...</p>
    </div>
  );
};

export default Splash;
