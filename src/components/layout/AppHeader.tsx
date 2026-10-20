import React from 'react';
import { LogOut, User as UserIcon, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { ROLE_LABELS } from '@/utils/constants';
import { Badge } from '../ui/Badge';

export interface AppHeaderProps {
  onOpenRoleSelector?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenRoleSelector }) => {
  const { user, profile, activeRole, logout } = useAuthStore();

  const displayName =
    profile?.name ||
    (user ? `${user.first_name} ${user.last_name}` : 'مستخدم');
  const roleLabel = ROLE_LABELS[activeRole || ''] || activeRole || 'مستخدم';

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 shadow-xs" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 p-0.5 shadow-md shadow-orange-500/15 flex-shrink-0">
            <img
              src="/pwa-192x192.png"
              alt="Providence"
              className="w-full h-full rounded-[10px] object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                Providence <span className="text-orange-600">ERP</span>
              </span>
              <Badge variant="orange" size="sm">
                PWA
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              مجمع لا بروفيدانس - سيدي بوزيد
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Role Badge with Role Selector Button */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 py-1 px-2.5 rounded-xl">
            <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <UserIcon className="w-3.5 h-3.5" />
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[100px] sm:max-w-none">
                {displayName}
              </p>
              <p className="text-[10px] text-purple-700 font-semibold">
                {roleLabel}
              </p>
            </div>

            {onOpenRoleSelector && (
              <button
                onClick={onOpenRoleSelector}
                className="p-1 hover:bg-slate-200/60 rounded-md text-slate-500 hover:text-slate-800 transition-colors mr-1"
                title="تبديل الدور"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
