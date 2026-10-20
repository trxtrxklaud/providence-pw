import React from 'react';
import { WifiOff } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const OfflineBanner: React.FC = () => {
  const isOffline = useAppStore((state) => state.isOffline);

  if (!isOffline) return null;

  return (
    <div
      className="bg-amber-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-300 z-50 sticky top-0"
      dir="rtl"
    >
      <WifiOff className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
      <span>أنت غير متصل بالإنترنت حالياً. يتم عرض البيانات المخزنة مسبقاً.</span>
    </div>
  );
};
