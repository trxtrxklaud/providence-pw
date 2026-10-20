import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Bell,
  User,
  BookOpen,
  CalendarCheck,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  School,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import type { NavItem } from '@/types/common';
import { ROLE_LABELS } from '@/utils/constants';

export const DesktopSidebar: React.FC = () => {
  const activeRole = useAuthStore((state) => state.activeRole);

  const getNavItems = (): NavItem[] => {
    switch (activeRole) {
      case 'parent':
        return [
          { label: 'أبنائي ومتابعة الدراسة', href: '/parent', icon: Users, exact: true },
          { label: 'الإعلانات والتعاميم', href: '/parent/announcements', icon: Bell },
          { label: 'المل الشخصي', href: '/parent/profile', icon: User },
        ];
      case 'teacher':
        return [
          { label: 'صولي المسندة', href: '/teacher', icon: BookOpen, exact: true },
          { label: 'تسجيل الحضور والغياب', href: '/teacher/attendance', icon: CalendarCheck },
          { label: 'المل الشخصي', href: '/teacher/profile', icon: User },
        ];
      case 'admin':
        return [
          { label: 'لوحة القيادة الإدارية', href: '/admin', icon: LayoutDashboard, exact: true },
          { label: 'قاعدة بيانات الطلاب', href: '/staff/students', icon: GraduationCap },
          { label: 'الهيئة التدريسية والموظون', href: '/staff/employees', icon: Briefcase },
          { label: 'المستخدمون والصلاحيات', href: '/admin/users', icon: ShieldCheck },
          { label: 'المل الشخصي', href: '/staff/profile', icon: User },
        ];
      case 'staff':
      case 'cashier':
      case 'accountant':
      default:
        return [
          { label: 'لوحة التحكم الإدارية', href: '/staff', icon: LayoutDashboard, exact: true },
          { label: 'قاعدة بيانات الطلاب', href: '/staff/students', icon: GraduationCap },
          { label: 'الموظون والمربون', href: '/staff/employees', icon: Briefcase },
          { label: 'المل الشخصي', href: '/staff/profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();
  const roleLabel = ROLE_LABELS[activeRole || ''] || activeRole || 'مستخدم';

  return (
    <aside
      className="hidden md:flex flex-col w-64 bg-white border-l border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 sticky top-16"
      dir="rtl"
    >
      {/* Role Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-orange-50 via-purple-50 to-slate-50 border border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
          <School className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            بوابة الدخول الحالية
          </span>
          <p className="text-sm font-bold text-slate-900">{roleLabel}</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-md shadow-orange-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 stroke-[2.2] flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 text-center">
        <p className="text-[11px] font-bold text-slate-700">مجمع لا بروفيدانس</p>
        <p className="text-[10px] text-slate-400">سيدي بوزيد - تونس</p>
      </div>
    </aside>
  );
};
