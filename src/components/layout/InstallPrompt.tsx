import React from 'react';
import { Download, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '../ui/Button';

export const InstallPrompt: React.FC = () => {
  const { isInstallPromptVisible, deferredPrompt, dismissInstallPrompt } = useAppStore();

  if (!isInstallPromptVisible || !deferredPrompt) return null;

  const handleInstall = async () => {
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        dismissInstallPrompt();
      }
    } catch {
      dismissInstallPrompt();
    }
  };

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl p-4 z-50 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom duration-300"
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-purple-700 p-0.5 flex-shrink-0 shadow-md shadow-orange-500/20">
          <img
            src="/pwa-192x192.png"
            alt="Providence ERP"
            className="w-full h-full rounded-[10px] object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">تثبيت تطبيق Providence</h4>
          <p className="text-xs text-slate-500">وصول أسرع وتجربة سلسة بدون متصفح</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="primary"
          onClick={handleInstall}
          icon={<Download className="w-3.5 h-3.5" />}
        >
          تثبيت
        </Button>
        <button
          onClick={dismissInstallPrompt}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="لاحقاً"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
