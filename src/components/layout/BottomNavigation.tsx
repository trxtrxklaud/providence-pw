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
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import type { NavItem } from '@/types/common';

export const BottomNavigation: React.FC = () => {
  const activeRole = useAuthStore((state) => state.activeRole);

  const getNavItems = (): NavItem[] => {
    switch (activeRole) {
      case 'parent':
        return [
          { label: 'أبنائي', href: '/parent', icon: Users, exact: true },
          { label: 'الإعلانات', href: '/parent/announcements', icon: Bell },
          { label: 'حسابي', href: '/parent/profile', icon: User },
        ];
      case 'teacher':
        return [
          { label: 'صولي', href: '/teacher', icon: BookOpen, exact: true },
          { label: 'حضور اليوم', href: '/teacher/attendance', icon: CalendarCheck },
          { label: 'حسابي', href: '/teacher/profile', icon: User },
        ];
      case 'admin':
      case 'staff':
      case 'cashier':
      case 'accountant':
      default:
        return [
          {
            label: 'الرئيسية',
            href: activeRole === 'admin' ? '/admin' : '/staff',
            icon: LayoutDashboard,
            exact: true,
          },
          { label: 'الطلاب', href: '/staff/students', icon: GraduationCap },
          { label: 'الموظون', href: '/staff/employees', icon: Briefcase },
          { label: 'حسابي', href: '/staff/profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 z-40 pb-safe shadow-lg"
      dir="rtl"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-orange-600 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-xl transition-colors ${
                      isActive ? 'bg-orange-50 text-orange-600' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
